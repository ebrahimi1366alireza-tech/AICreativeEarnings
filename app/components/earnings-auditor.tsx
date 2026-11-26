"use client";

import { useEffect, useMemo, useState } from "react";
import { auditEarning, summarizeEarnings } from "../../lib/earnings-auditor.mjs";

type AuditRecord = ReturnType<typeof auditEarning>;
const STORAGE_KEY = "creativeops-earnings-audit-v1";
const labels: Record<string, string> = {
  pending_payment: "در انتظار پرداخت",
  review_required: "نیازمند بررسی اطلاعات",
  disputed: "پرداخت مورد اختلاف",
  refunded: "بازپرداخت‌شده",
  amount_mismatch: "مغایرت مبلغ",
  received_reference_recorded: "دریافت ثبت‌شده با مرجع",
  received_unreferenced: "دریافت ثبت‌شده بدون مرجع"
};
const formatMoney = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 8 });

export default function EarningsAuditor() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState("");
  const [orderId, setOrderId] = useState("");
  const [currency, setCurrency] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [feeAmount, setFeeAmount] = useState("0");
  const [evidenceReference, setEvidenceReference] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecords(parsed as AuditRecord[]);
      }
    } catch { /* ignore invalid local data */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records, loaded]);

  const summaries = useMemo(() => summarizeEarnings(records), [records]);
  function addRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = auditEarning({ source, orderId, currency, expectedAmount, paymentStatus, receivedAmount, feeAmount, evidenceReference, transactionReference, paymentDate, notes });
    if (result.status === "review_required") {
      setNotice("اطلاعات ناقص یا نامعتبر است: " + result.missing.join("، "));
      return;
    }
    setRecords(current => [result, ...current]);
    setNotice("رکورد درآمد در همین مرورگر ذخیره شد. هیچ پرداختی به‌صورت مستقل تأیید نشده است.");
    setSource(""); setOrderId(""); setExpectedAmount(""); setPaymentStatus("pending");
    setReceivedAmount(""); setFeeAmount("0"); setEvidenceReference(""); setTransactionReference(""); setPaymentDate(""); setNotes("");
  }
  function removeRecord(index: number) {
    setRecords(current => current.filter((_, i) => i !== index));
  }
  return (
    <section className="panel earnings-auditor">
      <div className="panel-head"><div><span className="eyebrow">EARNINGS AUDITOR · MANUAL RECONCILIATION</span><h2>حسابرسی درآمد و تطبیق پرداخت</h2></div><span className="free-tag">بدون اتصال کیف پول</span></div>
      <p className="hub-intro">هر سفارش یا پرداخت را جداگانه ثبت کن. مبلغ مورد انتظار، مبلغ ناخالص دریافتی و کارمزد از هم تفکیک می‌شوند؛ فقط پرداخت‌های ثبت‌شده به‌عنوان دریافت‌شده در جمع دریافتی می‌آیند و همچنان تأیید مستقل نیستند.</p>
      <form className="opportunity-form" onSubmit={addRecord}>
        <input required value={source} onChange={e => setSource(e.target.value)} placeholder="منبع درآمد یا نام پلتفرم" aria-label="منبع درآمد"/>
        <input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="شناسه سفارش، اختیاری" aria-label="شناسه سفارش"/>
        <input required value={currency} onChange={e => setCurrency(e.target.value.toUpperCase())} placeholder="دارایی یا ارز، مثلاً USD، EUR، USDT یا BTC" aria-label="دارایی"/>
        <input required inputMode="decimal" value={expectedAmount} onChange={e => setExpectedAmount(e.target.value)} placeholder="مبلغ خالص مورد انتظار" aria-label="مبلغ مورد انتظار"/>
        <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} aria-label="وضعیت پرداخت">
          <option value="pending">در انتظار پرداخت</option>
          <option value="received">دریافت شده، طبق ثبت کاربر</option>
          <option value="disputed">مورد اختلاف</option>
          <option value="refunded">بازپرداخت شده</option>
        </select>
        {paymentStatus === "received" && <>
          <input required inputMode="decimal" value={receivedAmount} onChange={e => setReceivedAmount(e.target.value)} placeholder="مبلغ ناخالص دریافت‌شده" aria-label="مبلغ دریافتی"/>
          <input inputMode="decimal" value={feeAmount} onChange={e => setFeeAmount(e.target.value)} placeholder="کارمزد کسرشده" aria-label="کارمزد"/>
          <input value={transactionReference} onChange={e => setTransactionReference(e.target.value)} placeholder="شناسه تراکنش، اختیاری" aria-label="شناسه تراکنش"/>
          <input value={evidenceReference} onChange={e => setEvidenceReference(e.target.value)} placeholder="لینک مدرک یا رسید، اختیاری" aria-label="لینک مدرک"/>
          <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} aria-label="تاریخ پرداخت"/>
        </>}
        <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="یادداشت، شماره فاکتور یا توضیح مغایرت" aria-label="یادداشت"/>
        <button type="submit">ثبت و حسابرسی درآمد</button>
      </form>
      {notice && <p role="status" className="hub-intro">{notice}</p>}
      {summaries.length > 0 && <div className="discovery-assessment">
        <strong>خلاصه به تفکیک دارایی</strong>
        <div className="earnings-summary-grid">{summaries.map(item => <div className="earnings-summary-card" key={item.currency}>
          <strong>{item.currency}</strong>
          <span>مورد انتظار: {formatMoney(item.expected)}</span>
          <span>ثبت‌شده به‌عنوان دریافتی: {formatMoney(item.received)}</span>
          <span>معلق: {formatMoney(item.pending)}</span>
          <span>مغایرت‌ها: {item.mismatches} · رکوردها: {item.records}</span>
        </div>)}</div>
      </div>}
      <div className="earnings-record-list">
        {records.map((item, index) => <article className="discovery-assessment" key={`${item.source}-${item.orderId}-${index}`}>
          <div className="panel-head"><strong>{item.source} {item.orderId ? `· ${item.orderId}` : ""}</strong><span className="free-tag">{labels[item.status] || item.status}</span></div>
          <p>انتظار: {item.expectedAmount} {item.currency} · دریافتی خالص: {item.netReceivedAmount || "ثبت نشده"} {item.currency}</p>
          {item.status === "amount_mismatch" && <p>اختلاف خالص: {item.difference} {item.currency}</p>}
          {item.transactionReference && <p>شناسه تراکنش ثبت‌شده: {item.transactionReference}</p>}
          {item.evidenceReference && <p>مرجع مدرک ثبت‌شده: {item.evidenceReference}</p>}
          <small>تأیید پرداخت: فقط اظهار کاربر · بررسی مستقل مدرک: انجام نشده</small>
          {item.followUpDraft && <details><summary>پیش‌نویس پیگیری</summary><pre className="delivery-message-draft">{item.followUpDraft}</pre></details>}
          <button type="button" className="secondary-button" onClick={() => removeRecord(index)}>حذف رکورد</button>
        </article>)}
      </div>
      <p className="hub-intro">اطلاعات این دفتر در حافظه محلی همین مرورگر ذخیره می‌شود. پاک‌کردن داده‌های سایت یا تغییر دستگاه ممکن است آن را از دسترس خارج کند؛ از اطلاعات مهم نسخه پشتیبان بگیر.</p>
    </section>
  );
}
