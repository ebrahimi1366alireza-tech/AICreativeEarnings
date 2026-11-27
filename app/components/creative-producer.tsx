"use client";

import { useState } from "react";
import { buildCreativeProductionPlan } from "../../lib/creative-producer.mjs";

export default function CreativeProducer() {
  const [contentType, setContentType] = useState("image");
  const [platform, setPlatform] = useState("");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [message, setMessage] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [existingAssets, setExistingAssets] = useState("");
  const [rights, setRights] = useState("unknown");
  const [budget, setBudget] = useState("0");
  const [plan, setPlan] = useState<ReturnType<typeof buildCreativeProductionPlan> | null>(null);

  function createPlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPlan(buildCreativeProductionPlan({ contentType, platform, product, audience, message, specifications, existingAssets, rights, budget }));
  }

  const typeNames: Record<string, string> = { image: "تصویر و طراحی", video: "ویدئو", audio: "صوت و موسیقی", text: "متن و کپی‌رایتینگ" };
  return (
    <section className="panel creative-producer">
      <div className="panel-head"><div><span className="eyebrow">CREATIVE PRODUCER · NO-COST PLANNER</span><h2>دستیار برنامه‌ریز تولید محتوا</h2></div><span className="free-tag">بدون تولید پولی</span></div>
      <p className="hub-intro">شرح سفارش را وارد کن تا برنامه تولید، مراحل اجرا و چک‌لیست کنترل کیفیت ساخته شود. این دستیار فایل تولید نمی‌کند و هیچ ابزار، اعتبار یا API را اجرا نمی‌کند.</p>
      <form className="opportunity-form" onSubmit={createPlan}>
        <select value={contentType} onChange={e => setContentType(e.target.value)} aria-label="نوع محتوا"><option value="image">تصویر و طراحی</option><option value="video">ویدئو</option><option value="audio">صوت و موسیقی</option><option value="text">متن و کپی‌رایتینگ</option></select>
        <input required value={platform} onChange={e => setPlatform(e.target.value)} placeholder="پلتفرم مقصد، مثلاً Instagram یا YouTube" aria-label="پلتفرم مقصد"/>
        <input required value={product} onChange={e => setProduct(e.target.value)} placeholder="محصول یا خدمت" aria-label="محصول یا خدمت"/>
        <input required value={audience} onChange={e => setAudience(e.target.value)} placeholder="مخاطب هدف" aria-label="مخاطب هدف"/>
        <textarea required rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="پیام اصلی و هدف محتوا" aria-label="پیام اصلی"/>
        <textarea rows={2} value={specifications} onChange={e => setSpecifications(e.target.value)} placeholder="ابعاد، مدت، زبان، فرمت و محدودیت‌ها" aria-label="مشخصات محتوا"/>
        <textarea rows={2} value={existingAssets} onChange={e => setExistingAssets(e.target.value)} placeholder="دارایی‌های موجود: لوگو، عکس محصول، متن، موسیقی و ..." aria-label="دارایی‌های موجود"/>
        <select value={rights} onChange={e => setRights(e.target.value)} aria-label="وضعیت حقوق دارایی‌ها"><option value="unknown">حقوق و مجوز نامشخص</option><option value="owned">دارایی متعلق به سفارش‌دهنده است</option><option value="licensed">دارای مجوز معتبر</option><option value="client_supplied">توسط مشتری ارائه شده، مجوز باید تأیید شود</option></select>
        <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="سقف بودجه ابزار، صفر یعنی بدون هزینه" aria-label="بودجه ابزار"/>
        <button type="submit">ساخت برنامه تولید</button>
      </form>
      {plan && <div className="discovery-assessment" role="status">
        <strong>{plan.summary}</strong>
        <p>نوع خروجی: {typeNames[plan.contentType] || "نامشخص"} · بودجه: {plan.budget} · {plan.budgetApprovalRequired ? "هزینه نیازمند تأیید صریح کاربر است" : "برنامه با فرض بودجه صفر تنظیم شده است"}</p>
        <p>{plan.toolPolicy}</p><p>{plan.rightsWarning}</p>
        {plan.missing.length > 0 && <p>اطلاعات ناقص: {plan.missing.join("، ")}</p>}
        <strong>مراحل تولید</strong><ol>{plan.stages.map(item => <li key={item}>{item}</li>)}</ol>
        <strong>چک‌لیست کیفیت و تحویل</strong><ul>{plan.quality.map(item => <li key={item}>{item}</li>)}</ul>
        <small>مشخصات ثبت‌شده: {specifications || "هنوز تعیین نشده"} · دارایی‌های موجود: {existingAssets || "هنوز تعیین نشده"}</small>
      </div>}
    </section>
  );
}
