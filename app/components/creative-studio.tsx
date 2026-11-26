"use client";

import { useState } from "react";
import { buildCreativePrompt, type CreativeMode, type CreativeStyle } from "@/lib/creative-prompts.cjs";

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

  function generateBrief(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setPrompt(buildCreativePrompt({ mode, style, subject, audience, platform, language, details }));
      setNotice("پرامپت آماده شد؛ آن را در ابزار تولید تصویر یا ویدئو وارد کن.");
    } catch {
      setNotice("موضوع یا محصول را وارد کن.");
      setPrompt("");
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
      <div className="panel-head"><div><span className="eyebrow">AI CREATIVE WORKBENCH</span><h2>کارگاه آماده‌سازی تولید محتوا</h2></div><span className="free-tag">بدون هزینه API</span></div>
      <p className="hub-intro">برای عکس محصول، تبلیغ، بنر یا ویدئوی کوتاه، بریف و پرامپت ساختاریافته بساز. این بخش آفلاین است و خودش تصویر یا ویدئو تولید نمی‌کند؛ خروجی را در ابزار انتخابی خودت استفاده کن.</p>
      <form className="creative-form" onSubmit={generateBrief}>
        <label>نوع خروجی<select value={mode} onChange={e => setMode(e.target.value)}><option value="product">عکس محصول</option><option value="social">تبلیغ شبکه اجتماعی</option><option value="video">ویدئوی کوتاه</option><option value="banner">بنر تبلیغاتی</option></select></label>
        <label>سبک بصری<select value={style} onChange={e => setStyle(e.target.value)}><option value="photoreal">واقع‌گرایانه</option><option value="minimal">مینیمال</option><option value="luxury">لوکس</option><option value="vibrant">رنگی و پرانرژی</option><option value="editorial">ادیتوریال</option></select></label>
        <label className="creative-wide">موضوع / محصول<input value={subject} onChange={e => setSubject(e.target.value)} maxLength={500} required placeholder="مثلاً کفش چرمی دست‌دوز، قهوه تخصصی، غذای ایرانی"/></label>
        <label>مخاطب هدف<input value={audience} onChange={e => setAudience(e.target.value)} maxLength={180} placeholder="مثلاً خریداران آنلاین"/></label>
        <label>محل انتشار<input value={platform} onChange={e => setPlatform(e.target.value)} maxLength={120}/></label>
        <label>زبان نوشته داخل خروجی<input value={language} onChange={e => setLanguage(e.target.value)} maxLength={60}/></label>
        <label className="creative-wide">جزئیات و محدودیت‌های مشتری<textarea value={details} onChange={e => setDetails(e.target.value)} maxLength={700} rows={3} placeholder="رنگ، زاویه دوربین، پس‌زمینه، ویژگی واقعی محصول، موارد ممنوع..."/></label>
        <button type="submit">ساخت پرامپت تولید</button>
      </form>
      {prompt && <div className="creative-output"><div className="panel-head"><strong>پرامپت آماده استفاده</strong><div className="creative-actions"><button type="button" onClick={copyPrompt}>کپی متن</button><button type="button" onClick={downloadPrompt}>دانلود TXT</button></div></div><pre dir="auto">{prompt}</pre></div>}
      <p className="backup-notice" role="status">{notice || "برای استفاده تجاری، مجوز ابزار و مدل انتخابی و حقوق دارایی‌های استفاده‌شده را جداگانه بررسی کن."}</p>
    </section>
  );
}
