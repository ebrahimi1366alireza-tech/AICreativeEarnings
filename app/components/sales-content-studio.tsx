"use client";

import { useEffect, useState } from "react";

type Usage = { used: number; remaining: number; limit: number; resetsAt?: string };

type SalesBrief = {
  product: string; buyer: string; market: string; channel: string;
  format: string; language: string; benefit: string; notes: string;
};

export default function SalesContentStudio() {
  const [brief, setBrief] = useState<SalesBrief>({
    product: "", buyer: "", market: "جهانی", channel: "بازار سفارش‌های فریلنسری",
    format: "تصویر تبلیغاتی محصول", language: "انگلیسی", benefit: "", notes: ""
  });
  const [briefText, setBriefText] = useState("");
  const [output, setOutput] = useState("");
  const [image, setImage] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<"text" | "image" | "">("");
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/creative/generate", { credentials: "same-origin", cache: "no-store" })
      .then(async response => response.ok ? response.json() : null)
      .then(result => { if (active && result?.usage) setUsage(result.usage as Usage); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  function update<K extends keyof SalesBrief>(key: K, value: SalesBrief[K]) {
    setBrief(current => ({ ...current, [key]: value }));
  }

  function createBrief(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brief.product.trim() || !brief.buyer.trim()) {
      setNotice("نام محصول/خدمت و نوع خریدار را وارد کن.");
      return;
    }
    const prompt = [
      "COMMERCIAL CREATIVE PRODUCTION BRIEF",
      "Purpose: create an original commercial asset for sale to a real client or digital-content buyer. This is NOT an Instagram page-management task.",
      `Product/service: ${brief.product.trim()}`,
      `Target buyer: ${brief.buyer.trim()}`,
      `Target market: ${brief.market}`,
      `Sales channel: ${brief.channel}`,
      `Deliverable: ${brief.format}`,
      `Output language: ${brief.language}`,
      `Main selling benefit: ${brief.benefit.trim() || "Do not invent product claims; identify missing facts."}`,
      `Client requirements: ${brief.notes.trim() || "None supplied"}`,
      "",
      "Create a sale-ready creative concept, production instructions, exact copy/headline/CTA where relevant, quality-control checklist, and delivery checklist. Do not invent client approval, guaranteed sales, product facts, licensing rights, or a confirmed buyer. Flag assumptions."
    ].join("\n");
    setBriefText(prompt);
    setOutput("");
    setImage("");
    setNotice("بریف آماده شد. حالا می‌توانی تولید متن تبلیغاتی یا تصویر را درخواست کنی.");
  }

  async function generate(mode: "text" | "image") {
    if (!briefText) {
      setNotice("ابتدا اطلاعات محصول و خریدار را وارد و بریف را بساز.");
      return;
    }
    if (mode === "image" && !brief.format.toLowerCase().includes("تصویر") && !brief.format.toLowerCase().includes("عکس") && !brief.format.toLowerCase().includes("بنر") && !brief.format.toLowerCase().includes("پوستر")) {
      setNotice("این خروجی انتخاب‌شده تصویر ثابت نیست. برای تولید تصویر، نوع خروجی را به تصویر تبلیغاتی یا بنر تغییر بده.");
      return;
    }
    setBusy(mode);
    setNotice(mode === "text" ? "در حال تولید محتوای تبلیغاتی با هوش مصنوعی..." : "در حال تولید تصویر؛ ممکن است زمان‌بر باشد...");
    try {
      const prompt = mode === "text"
        ? briefText
        : [
            "Create one polished, original commercial advertising image. Do not add fake logos, watermarks, fabricated certifications, or unreadable text. Prioritize a strong product composition and professional art direction.",
            briefText,
            output ? `Use this approved creative direction as context: ${output.slice(0, 2500)}` : ""
          ].filter(Boolean).join("\n\n");
      const response = await fetch("/api/creative/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ mode, prompt })
      });
      const result = await response.json().catch(() => ({}));
      if (result.usage) setUsage(result.usage as Usage);
      if (!response.ok) throw new Error(result.error || "تولید محتوا ناموفق بود.");
      if (mode === "text") setOutput(String(result.output || ""));
      else setImage(String(result.imageDataUrl || ""));
      setNotice(mode === "text" ? "محتوای متنی تولید شد. پیش از تحویل، اطلاعات و ادعاهای محصول را بررسی کن." : "تصویر تولید شد. پیش از فروش، کیفیت و مجوز استفادهٔ تجاری سرویس را بررسی کن.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "خطای نامشخص در تولید محتوا.");
    } finally {
      setBusy("");
    }
  }

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice("متن کپی شد.");
    } catch {
      setNotice("کپی خودکار در این مرورگر در دسترس نیست؛ متن را دستی انتخاب کن.");
    }
  }

  return (
    <section className="panel" id="sales-studio" style={{ marginTop: 18 }}>
      <div className="panel-head">
        <div><span className="eyebrow">COMMERCIAL CONTENT WORKBENCH</span><h2>استودیوی تولید محتوای قابل فروش</h2></div>
        <span className="free-tag">بدون اتصال اینستاگرام</span>
      </div>
      <p className="hub-intro">برای سفارش مشتری یا فروش فایل دیجیتال، بریف بساز و از موتور هوش مصنوعی برای تولید متن تبلیغاتی یا تصویر استفاده کن.</p>
      <form className="opportunity-form" onSubmit={createBrief}>
        <input value={brief.product} onChange={e => update("product", e.target.value)} placeholder="محصول یا خدمت موردنظر" aria-label="محصول یا خدمت" required />
        <input value={brief.buyer} onChange={e => update("buyer", e.target.value)} placeholder="خریدار هدف؛ مثلاً برند پوشاک یا فروشگاه" aria-label="خریدار هدف" required />
        <select value={brief.market} onChange={e => update("market", e.target.value)} aria-label="بازار هدف">
          <option>جهانی</option><option>اروپا</option><option>آمریکای شمالی</option><option>خاورمیانه</option><option>آسیا</option>
        </select>
        <select value={brief.channel} onChange={e => update("channel", e.target.value)} aria-label="کانال فروش">
          <option>بازار سفارش‌های فریلنسری</option><option>فروشگاه فایل دیجیتال</option><option>مستقیماً به برند یا کسب‌وکار</option><option>مسابقه یا بونتی تجاری</option>
        </select>
        <select value={brief.format} onChange={e => update("format", e.target.value)} aria-label="نوع خروجی">
          <option>تصویر تبلیغاتی محصول</option><option>عکس محصول برای فروشگاه</option><option>ویدئوی تبلیغاتی کوتاه</option><option>بنر و پوستر تبلیغاتی</option><option>بسته محتوای برند</option><option>موشن‌گرافیک</option>
        </select>
        <select value={brief.language} onChange={e => update("language", e.target.value)} aria-label="زبان خروجی">
          <option>انگلیسی</option><option>فارسی</option><option>عربی</option><option>ترکی</option><option>روسی</option><option>چندزبانه</option>
        </select>
        <input value={brief.benefit} onChange={e => update("benefit", e.target.value)} placeholder="مزیت اصلی محصول (اختیاری)" aria-label="مزیت محصول" />
        <input value={brief.notes} onChange={e => update("notes", e.target.value)} placeholder="ابعاد، سبک، رنگ یا توضیحات مشتری (اختیاری)" aria-label="نیازهای مشتری" />
        <button type="submit">ساخت بریف تجاری</button>
      </form>
      {notice && <p className="backup-notice" role="status">{notice}</p>}
      {briefText && <div style={{ marginTop: 16 }}>
        <div className="panel-head"><strong>بریف تولید</strong><button type="button" onClick={() => copyText(briefText)}>کپی بریف</button></div>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", direction: "ltr", textAlign: "left", background: "#0d121b", border: "1px solid var(--line)", borderRadius: 10, padding: 16, color: "#d9e3f2", fontSize: 12, lineHeight: 1.8 }}>{briefText}</pre>
        <div className="panel-head" style={{ marginTop: 12 }}>
          <strong>تولید با هوش مصنوعی</strong>
          <span className="free-tag">ممکن است هزینه API داشته باشد</span>
        </div>
        <p className="hub-intro">تولید فقط پس از ورود به حساب انجام می‌شود. کلید API در گوشی ذخیره نمی‌شود. متن ۱ اعتبار و تصویر ۵ اعتبار مصرف می‌کند.</p>
        {usage && <p className="backup-notice" role="status">سهمیهٔ امروز: {usage.used} از {usage.limit} اعتبار مصرف شده؛ {usage.remaining} اعتبار باقی مانده است. سهمیه هر روز ساعت ۰۰:۰۰ UTC بازنشانی می‌شود.</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button type="button" disabled={Boolean(busy)} onClick={() => generate("text")}>{busy === "text" ? "در حال تولید..." : "تولید متن تبلیغاتی"}</button>
          <button type="button" disabled={Boolean(busy)} onClick={() => generate("image")}>{busy === "image" ? "در حال تولید تصویر..." : "تولید تصویر تبلیغاتی"}</button>
        </div>
      </div>}
      {output && <div style={{ marginTop: 16 }}>
        <div className="panel-head"><strong>محتوای تولیدشده</strong><button type="button" onClick={() => copyText(output)}>کپی متن</button></div>
        <pre dir="auto" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", textAlign: "start", background: "#0d121b", border: "1px solid var(--line)", borderRadius: 10, padding: 16, color: "#d9e3f2", fontSize: 13, lineHeight: 1.8 }}>{output}</pre>
      </div>}
      {image && <div style={{ marginTop: 16 }}>
        <div className="panel-head"><strong>تصویر تولیدشده</strong><a href={image} download="commercial-creative.png">ذخیره تصویر</a></div>
        <img src={image} alt="تصویر تبلیغاتی تولیدشده با هوش مصنوعی" style={{ display: "block", width: "100%", maxWidth: 720, height: "auto", borderRadius: 12 }} />
      </div>}
    </section>
  );
}
