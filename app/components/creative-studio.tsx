"use client";

import { useEffect, useState } from "react";
import { buildCreativePrompt, type CreativeMode, type CreativeStyle } from "@/lib/creative-prompts.cjs";

type TaskResult = { taskId?: string; status?: string; output?: string[]; error?: string; failure?: string | null; outputExpires?: string | null };

export default function CreativeStudio() {
  const [mode, setMode] = useState<CreativeMode>("product");
  const [style, setStyle] = useState<CreativeStyle>("photoreal");
  const [subject, setSubject] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("Instagram و فروشگاه آنلاین");
  const [language, setLanguage] = useState("بدون نوشته داخل تصویر");
  const [details, setDetails] = useState("");
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");
  const [providerReady, setProviderReady] = useState(false);
  const [checkingProvider, setCheckingProvider] = useState(true);
  const [busy, setBusy] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [taskKind, setTaskKind] = useState<"image" | "video">("image");
  const [taskStatus, setTaskStatus] = useState("");
  const [outputs, setOutputs] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/creative/status", { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!active) return;
        setProviderReady(Boolean(response.ok && data.configured));
        if (response.status === 401) setNotice("برای تولید واقعی، ابتدا وارد حساب کاربری شو.");
        else if (response.ok && !data.configured) setNotice("کلید API هنوز در تنظیمات محرمانه سرور ثبت نشده است.");
        else if (response.ok) setNotice("Runway Dev متصل است. هزینه پیش از هر تولید نمایش داده می‌شود.");
      })
      .catch(() => { if (active) setNotice("وضعیت سرویس تولید قابل دریافت نیست."); })
      .finally(() => { if (active) setCheckingProvider(false); });
    return () => { active = false; };
  }, []);

  function generateBrief(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setPrompt(buildCreativePrompt({ mode, style, subject, audience, platform, language, details }));
      setNotice("پرامپت آماده شد. برای تولید واقعی، هزینه قبل از ارسال نمایش داده می‌شود.");
      setOutputs([]);
      setTaskId("");
      setTaskStatus("");
    } catch {
      setNotice("موضوع یا محصول را وارد کن.");
      setPrompt("");
    }
  }

  async function generateContent() {
    if (!prompt || busy || !providerReady) return;
    const kind = mode === "video" ? "video" : "image";
    const cost = kind === "image" ? "۲ اعتبار، حدود ۰٫۰۲ دلار" : "حدود ۶۵ اعتبار، ۰٫۶۵ دلار برای ویدئوی ۵ ثانیه‌ای ۴۸۰p";
    if (!window.confirm("تولید از طریق Runway Dev هزینه دارد: " + cost + ". اعتبار API جدا از اعتبار حساب معمولی Runway است. این هزینه را برای همین تولید تأیید می‌کنی؟")) return;

    setBusy(true);
    setNotice("درخواست به Runway ارسال می‌شود...");
    setOutputs([]);
    try {
      const response = await fetch("/api/creative/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, prompt, confirmed: true })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ارسال درخواست ناموفق بود.");
      setTaskId(data.taskId);
      setTaskKind(kind);
      setTaskStatus("PENDING");
      setNotice("درخواست ثبت شد. تولید در پس‌زمینه ادامه دارد؛ وضعیت را بررسی کن.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "خطای نامشخص هنگام ارسال درخواست.");
    } finally {
      setBusy(false);
    }
  }

  async function checkTask() {
    if (!taskId || busy) return;
    setBusy(true);
    setNotice("وضعیت تولید بررسی می‌شود...");
    try {
      const response = await fetch("/api/creative/tasks/" + encodeURIComponent(taskId), { cache: "no-store" });
      const data: TaskResult = await response.json();
      if (!response.ok) throw new Error(data.error || "دریافت وضعیت ناموفق بود.");
      setTaskStatus(data.status || "UNKNOWN");
      if (data.status === "SUCCEEDED") {
        setOutputs(data.output || []);
        setNotice(data.output?.length ? "خروجی آماده است. فایل را ذخیره کن؛ پیوندها موقت‌اند." : "کار تمام شد، اما خروجی قابل نمایش دریافت نشد.");
      } else if (data.status === "FAILED" || data.status === "CANCELED") {
        setNotice(data.failure || "تولید ناموفق یا لغو شد.");
      } else {
        setNotice("تولید هنوز در حال انجام است. چند ثانیه بعد دوباره بررسی کن.");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "خطای نامشخص هنگام بررسی وضعیت.");
    } finally {
      setBusy(false);
    }
  }

  async function copyPrompt() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setNotice("پرامپت کپی شد.");
    } catch {
      setNotice("کپی خودکار در دسترس نیست؛ متن را انتخاب و کپی کن.");
    }
  }

  function downloadPrompt() {
    if (!prompt) return;
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "creative-production-prompt.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("فایل پرامپت دانلود شد.");
  }

  return (
    <section className="panel creative-studio" id="creative-studio">
      <div className="panel-head"><div><span className="eyebrow">AI CREATIVE WORKBENCH</span><h2>کارگاه تولید تصویر و ویدئو</h2></div><span className="free-tag">تولید با تأیید هزینه</span></div>
      <p className="hub-intro">پرامپت بساز و در صورت تنظیم کلید Runway Dev، همان‌جا تصویر یا ویدئو تولید کن. کلید فقط روی سرور نگه‌داری می‌شود و هر تولید نیازمند تأیید جداگانه هزینه است.</p>
      <div className={providerReady ? "provider-status ready" : "provider-status"} role="status">
        <strong>{checkingProvider ? "در حال بررسی اتصال..." : providerReady ? "Runway Dev آماده است" : "اتصال API هنوز کامل نیست"}</strong>
        <span>{notice || "برای تولید واقعی، کلید محرمانه Runway Dev باید در تنظیمات سرور ثبت شود."}</span>
        <small>تصویر: ۲ اعتبار ≈ $0.02 · ویدئوی ۵ ثانیه‌ای ۴۸۰p: حدود ۶۵ اعتبار ≈ $0.65</small>
      </div>
      <form className="creative-form" onSubmit={generateBrief}>
        <label>نوع خروجی<select value={mode} onChange={e => setMode(e.target.value as CreativeMode)}><option value="product">عکس محصول</option><option value="social">تبلیغ شبکه اجتماعی</option><option value="video">ویدئوی کوتاه ۵ ثانیه‌ای</option><option value="banner">بنر تبلیغاتی</option></select></label>
        <label>سبک بصری<select value={style} onChange={e => setStyle(e.target.value as CreativeStyle)}><option value="photoreal">واقع‌گرایانه</option><option value="minimal">مینیمال</option><option value="luxury">لوکس</option><option value="vibrant">رنگی و پرانرژی</option><option value="editorial">ادیتوریال</option></select></label>
        <label className="creative-wide">موضوع / محصول<input value={subject} onChange={e => setSubject(e.target.value)} maxLength={500} required placeholder="مثلاً کفش چرمی دست‌دوز، قهوه تخصصی، غذای ایرانی"/></label>
        <label>مخاطب هدف<input value={audience} onChange={e => setAudience(e.target.value)} maxLength={180} placeholder="مثلاً خریداران آنلاین"/></label>
        <label>محل انتشار<input value={platform} onChange={e => setPlatform(e.target.value)} maxLength={120}/></label>
        <label>زبان نوشته داخل خروجی<input value={language} onChange={e => setLanguage(e.target.value)} maxLength={60}/></label>
        <label className="creative-wide">جزئیات و محدودیت‌های مشتری<textarea value={details} onChange={e => setDetails(e.target.value)} maxLength={700} rows={3} placeholder="رنگ، زاویه دوربین، پس‌زمینه، ویژگی واقعی محصول، موارد ممنوع..."/></label>
        <button type="submit">ساخت پرامپت تولید</button>
      </form>
      {prompt && <div className="creative-output"><div className="panel-head"><strong>پرامپت آماده استفاده</strong><div className="creative-actions"><button type="button" onClick={copyPrompt}>کپی متن</button><button type="button" onClick={downloadPrompt}>دانلود TXT</button></div></div><pre dir="auto">{prompt}</pre><div className="creative-actions production-actions"><button type="button" onClick={generateContent} disabled={!providerReady || busy}>{busy ? "در حال پردازش..." : mode === "video" ? "تولید ویدئو با Runway" : "تولید تصویر با Runway"}</button></div>{!providerReady && <p className="backup-notice">پس از ثبت RUNWAYML_API_SECRET و SESSION_SECRET در Environment Variables سرور، تولید فعال می‌شود.</p>}</div>}
      {taskId && <div className="creative-output task-output"><div className="panel-head"><strong>پیگیری تولید</strong><span className="status">{taskStatus}</span></div><p dir="ltr">{taskId}</p><div className="creative-actions"><button type="button" onClick={checkTask} disabled={busy}>{busy ? "در حال بررسی..." : "بررسی وضعیت تولید"}</button></div>{outputs.map((url, index) => taskKind === "video" ? <video key={url} controls playsInline src={url} className="generated-media"/> : <a key={url} href={url} target="_blank" rel="noreferrer"><img src={url} alt={"خروجی تولیدشده " + (index + 1)} className="generated-media"/></a>)}{outputs.length > 0 && <p className="backup-notice">خروجی را همین حالا ذخیره کن؛ پیوندهای تحویل موقت‌اند.</p>}</div>}
      <p className="backup-notice">هزینه‌های اعلام‌شده بر اساس نرخ پایه Runway Dev هستند؛ مبلغ نهایی را پاسخ API تعیین می‌کند. اعتبار API با اعتبار حساب معمولی Runway یکی نیست و حداقل شارژ اولیه API طبق درگاه توسعه‌دهنده ۱۰ دلار است. مجوز تجاری مدل و دارایی‌ها را پیش از تحویل بررسی کن.</p>
    </section>
  );
}
