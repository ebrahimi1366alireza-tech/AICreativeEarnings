"use client";

import { useState } from "react";
import { runAssistantPipeline } from "../../lib/assistant-pipeline.mjs";

type PipelineResult = ReturnType<typeof runAssistantPipeline>;
const initial = { title: "", sourceUrl: "", countryCheck: "", citizenshipAcceptance: "", payout: "", deposit: "", paymentAsset: "", network: "", minimum: "", fee: "", kyc: "", evidenceText: "", contentType: "image", platform: "", product: "", audience: "", message: "", specifications: "", existingAssets: "", rights: "unknown", rightsEvidenceReference: "", budget: "0", currency: "", expectedAmount: "" };
const labels: Record<string, string> = { opportunity_triage: "بررسی فرصت", creative_production: "برنامه تولید", quality_review: "کنترل کیفیت", delivery_preparation: "آماده‌سازی تحویل", earnings_audit: "حسابرسی درآمد" };

export default function AssistantPipeline() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [notice, setNotice] = useState("");
  const [aiConsent, setAiConsent] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const update = (key: keyof typeof initial, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function requestAiAdvice() {
    if (!aiConsent) {
      setNotice("برای ارسال بریف به سرویس خارجی، ابتدا رضایت صریح را فعال کن.");
      return;
    }
    setAiBusy(true);
    setAiAdvice("");
    try {
      const response = await fetch("/api/assistants/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allowExternalProcessing: true,
          brief: {
            title: form.title,
            contentType: form.contentType,
            platform: form.platform,
            product: form.product,
            audience: form.audience,
            message: form.message,
            specifications: form.specifications
          }
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "دریافت پیشنهاد هوش مصنوعی انجام نشد.");
      setAiAdvice(String(data.advice || ""));
      setNotice("پیشنهاد هوش مصنوعی دریافت شد؛ این خروجی فقط مشورتی است و تأیید نهایی نیست.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "ارتباط با دستیار برقرار نشد.");
    } finally {
      setAiBusy(false);
    }
  }
  function run(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = runAssistantPipeline({ ...form, id: crypto.randomUUID() });
    setResult(next);
    setNotice(next.ok ? "پنج دستیار به‌ترتیب اجرا شدند و خروجی هر مرحله به مرحله بعد منتقل شد." : next.error || "خطا در اجرای زنجیره");
    if (next.ok) localStorage.setItem("creativeops-last-assistant-pipeline-v1", JSON.stringify(next));
  }
  return <section className="panel" id="assistant-pipeline">
    <div className="panel-head"><div><span className="eyebrow">CONNECTED ASSISTANT PIPELINE</span><h2>اجرای زنجیره‌ای پنج دستیار</h2></div><span className="free-tag">اجرای محلی · بدون هزینه API</span></div>
    <p className="hub-intro">یک‌بار اطلاعات پروژه را وارد کن. مدیر هماهنگی، بررسی فرصت، برنامه تولید، کنترل کیفیت، آماده‌سازی تحویل و دفتر درآمد را پشت‌سرهم اجرا می‌کند و خروجی هر مرحله را به مرحله بعد می‌دهد.</p>
    <form className="opportunity-form" onSubmit={run}>
      <strong>۱. مشخصات پروژه و فرصت</strong>
      <input required value={form.title} onChange={e=>update("title",e.target.value)} placeholder="عنوان پروژه" aria-label="عنوان پروژه"/>
      <input value={form.sourceUrl} onChange={e=>update("sourceUrl",e.target.value)} placeholder="لینک فرصت با HTTPS" aria-label="لینک فرصت"/>
      <input value={form.countryCheck} onChange={e=>update("countryCheck",e.target.value)} placeholder="پذیرش کشور محل اقامت" aria-label="پذیرش کشور"/>
      <input value={form.citizenshipAcceptance} onChange={e=>update("citizenshipAcceptance",e.target.value)} placeholder="پذیرش تابعیت" aria-label="پذیرش تابعیت"/>
      <input value={form.payout} onChange={e=>update("payout",e.target.value)} placeholder="روش پرداخت و برداشت" aria-label="روش پرداخت"/>
      <input value={form.deposit} onChange={e=>update("deposit",e.target.value)} placeholder="هزینه ورود، سپرده یا خرید اجباری" aria-label="هزینه ورود"/>
      <input value={form.paymentAsset} onChange={e=>update("paymentAsset",e.target.value)} placeholder="ارز پرداخت" aria-label="ارز پرداخت"/>
      <input value={form.network} onChange={e=>update("network",e.target.value)} placeholder="شبکه پرداخت" aria-label="شبکه"/>
      <input value={form.minimum} onChange={e=>update("minimum",e.target.value)} placeholder="حداقل برداشت" aria-label="حداقل برداشت"/>
      <input value={form.fee} onChange={e=>update("fee",e.target.value)} placeholder="کارمزد" aria-label="کارمزد"/>
      <input value={form.kyc} onChange={e=>update("kyc",e.target.value)} placeholder="شرایط KYC" aria-label="KYC"/>
      <textarea rows={3} value={form.evidenceText} onChange={e=>update("evidenceText",e.target.value)} placeholder={"مدارک رسمی، هر خط به شکل field=https://...\nمثال: country=https://example.com/country"} aria-label="مدارک رسمی"/>
      <strong>۲. بریف تولید محتوا</strong>
      <select value={form.contentType} onChange={e=>update("contentType",e.target.value)} aria-label="نوع محتوا"><option value="image">تصویر</option><option value="video">ویدئو</option><option value="audio">صوت</option><option value="text">متن</option></select>
      <input required value={form.platform} onChange={e=>update("platform",e.target.value)} placeholder="پلتفرم مقصد" aria-label="پلتفرم مقصد"/>
      <input required value={form.product} onChange={e=>update("product",e.target.value)} placeholder="محصول یا خدمت" aria-label="محصول"/>
      <input required value={form.audience} onChange={e=>update("audience",e.target.value)} placeholder="مخاطب هدف" aria-label="مخاطب"/>
      <textarea required rows={3} value={form.message} onChange={e=>update("message",e.target.value)} placeholder="شرح سفارش و پیام اصلی" aria-label="شرح سفارش"/>
      <textarea rows={2} value={form.specifications} onChange={e=>update("specifications",e.target.value)} placeholder="ابعاد، فرمت، زبان و محدودیت‌ها" aria-label="مشخصات"/>
      <input value={form.existingAssets} onChange={e=>update("existingAssets",e.target.value)} placeholder="دارایی‌های موجود، هر مورد در یک خط" aria-label="دارایی‌های موجود"/>
      <select value={form.rights} onChange={e=>update("rights",e.target.value)} aria-label="حقوق محتوا"><option value="unknown">حقوق نامشخص</option><option value="owned">مالکیت خودم</option><option value="licensed">دارای مجوز</option><option value="client_supplied">ارائه‌شده توسط مشتری</option></select>
      <input value={form.rightsEvidenceReference} onChange={e=>update("rightsEvidenceReference",e.target.value)} placeholder="مرجع مجوز یا مالکیت" aria-label="مدرک حقوق محتوا"/>
      <input value={form.budget} onChange={e=>update("budget",e.target.value)} placeholder="بودجه ابزار، صفر یعنی رایگان" aria-label="بودجه ابزار"/>
      <strong>۳. پیش‌نویس حساب درآمد</strong>
      <input value={form.currency} onChange={e=>update("currency",e.target.value)} placeholder="ارز مورد انتظار، اختیاری" aria-label="ارز"/>
      <input value={form.expectedAmount} onChange={e=>update("expectedAmount",e.target.value)} placeholder="مبلغ مورد انتظار، اختیاری" aria-label="مبلغ مورد انتظار"/>
      <button type="submit">اجرای پنج دستیار و انتقال خروجی‌ها</button>
    </form>
    <div className="panel" style={{marginTop:16}}>
      <strong>۴. مشاوره اختیاری مدل هوش مصنوعی</strong>
      <p className="hub-intro">این بخش فقط بریف خلاقانه را ارسال می‌کند. اطلاعات تابعیت، KYC، کیف پول، پرداخت و درآمد به سرویس مدل فرستاده نمی‌شوند. اتصال در نسخه فعلی خاموش است مگر اینکه مدیر سایت، ارائه‌دهنده را در تنظیمات سرور فعال کند.</p>
      <label style={{display:"flex",gap:8,alignItems:"flex-start",margin:"12px 0"}}>
        <input type="checkbox" checked={aiConsent} onChange={event=>setAiConsent(event.target.checked)} />
        <span>رضایت می‌دهم بریف تولید محتوا برای پردازش به ارائه‌دهنده مدل هوش مصنوعی متصل‌شده به سرور ارسال شود.</span>
      </label>
      <button type="button" onClick={requestAiAdvice} disabled={aiBusy || !form.title || !form.message}>{aiBusy ? "در حال دریافت پیشنهاد..." : "دریافت پیشنهاد هوش مصنوعی"}</button>
      {aiAdvice && <article className="saved-opportunity" style={{marginTop:12}}><strong>پیشنهاد مشورتی مدل</strong><pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{aiAdvice}</pre><p className="opportunity-meta">این متن به‌تنهایی مجوز محتوا، کیفیت، تحویل یا پرداخت را تأیید نمی‌کند.</p></article>}
    </div>
    {notice && <p className="backup-notice" role="status">{notice}</p>}
    {result?.ok && <div className="discovery-assessment">
      <strong>{result.project?.title} · گزارش اجرای زنجیره</strong>
      <div className="saved-opportunities">{result.stages?.map(stage=><article className="saved-opportunity" key={stage.id}><div><strong>{labels[stage.id]} · {stage.assistant}</strong><p>وضعیت: {stage.status}</p><p className="opportunity-meta">{stage.handoff}</p><details><summary>مشاهده خروجی ساختاریافته</summary><pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{JSON.stringify(stage.output,null,2)}</pre></details></div></article>)}</div>
      <strong>محدودیت‌ها و کنترل انسانی</strong>
      <ul>{result.limitations?.map(item=><li key={item}>{item}</li>)}</ul>
      <button type="button" onClick={()=>{navigator.clipboard?.writeText(JSON.stringify(result,null,2));setNotice("گزارش JSON برای کپی آماده شد؛ در صورت پشتیبانی مرورگر کپی می‌شود.");}}>کپی گزارش کامل</button>
    </div>}
  </section>;
}
