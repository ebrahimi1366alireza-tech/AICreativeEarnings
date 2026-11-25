"use client";

import { useState } from "react";

type SalesBrief = {
  product: string;
  buyer: string;
  market: string;
  channel: string;
  format: string;
  language: string;
  benefit: string;
  notes: string;
};

export default function SalesContentStudio() {
  const [brief, setBrief] = useState<SalesBrief>({
    product: "",
    buyer: "",
    market: "جهانی",
    channel: "بازار سفارش‌های فریلنسری",
    format: "تصویر تبلیغاتی محصول",
    language: "انگلیسی",
    benefit: "",
    notes: ""
  });
  const [output, setOutput] = useState("");
  const [notice, setNotice] = useState("");

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
      "Purpose: create an original commercial asset for sale to a client or digital-content buyer. This is NOT an Instagram page-management task.",
      `Product/service: ${brief.product.trim()}`,
      `Target buyer: ${brief.buyer.trim()}`,
      `Target market: ${brief.market}`,
      `Sales channel: ${brief.channel}`,
      `Deliverable: ${brief.format}`,
      `Output language: ${brief.language}`,
      `Main selling benefit: ${brief.benefit.trim() || "Research and propose a defensible benefit; do not invent product claims."}`,
      `Client requirements: ${brief.notes.trim() || "None supplied"}`,
      "",
      "Required output:",
      "1. A concise creative concept and rationale for the target buyer.",
      "2. A production-ready script/layout/image-generation prompt appropriate to the deliverable.",
      "3. Exact copy/headline/CTA where relevant.",
      "4. A quality-control checklist for dimensions, legibility, factual accuracy, originality, and commercial-use rights.",
      "5. A delivery checklist and suggested file formats.",
      "Do not invent client approval, guaranteed sales, product features, licensing rights, or a confirmed buyer. Flag missing facts clearly."
    ].join("\n");
    setOutput(prompt);
    setNotice("بریف آماده شد. این هنوز خروجی نهایی تصویر یا ویدئو نیست؛ برای تولید واقعی باید موتور AI و ابزار رسانه‌ای به سرور متصل شوند.");
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(output);
      setNotice("بریف تولید کپی شد.");
    } catch {
      setNotice("کپی خودکار در این مرورگر در دسترس نیست؛ متن را دستی انتخاب و کپی کن.");
    }
  }

  return (
    <section className="panel" id="sales-studio" style={{ marginTop: 18 }}>
      <div className="panel-head">
        <div><span className="eyebrow">COMMERCIAL CONTENT WORKBENCH</span><h2>استودیوی تولید محتوای قابل فروش</h2></div>
        <span className="free-tag">بدون اتصال اینستاگرام</span>
      </div>
      <p className="hub-intro">برای سفارش مشتری یا فروش فایل دیجیتال، بریف تولید بساز. خروجی برای تولید دارایی تجاری است، نه مدیریت پیج اجتماعی.</p>
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
      {output && <div style={{ marginTop: 16 }}>
        <div className="panel-head"><strong>بریف آمادهٔ تولید</strong><button type="button" onClick={copyBrief}>کپی بریف</button></div>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", direction: "ltr", textAlign: "left", background: "#0d121b", border: "1px solid var(--line)", borderRadius: 10, padding: 16, color: "#d9e3f2", fontSize: 12, lineHeight: 1.8 }}>{output}</pre>
      </div>}
    </section>
  );
}
