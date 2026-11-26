"use client";

import { useState } from "react";
import { reviewCreativeDeliverable } from "../../lib/quality-reviewer.mjs";

const checklist = [
  ["briefMatch", "محتوا با شرح سفارش و پیام اصلی تطبیق دارد"],
  ["formatMatch", "قالب، ابعاد، مدت و حجم فایل با سفارش سازگار است"],
  ["languageReviewed", "زبان، املا، زیرنویس و خوانایی بازبینی شده‌اند"],
  ["technicalReviewed", "کیفیت فنی خروجی در اندازه و دستگاه مقصد بررسی شده است"],
  ["originalityReviewed", "اصالت محتوا و نبود کپی‌برداری غیرمجاز بررسی شده است"],
  ["rightsDocumented", "منابع، مالکیت و مجوز استفاده تجاری مستند شده‌اند"],
  ["platformRulesChecked", "قوانین پلتفرم مقصد و محدودیت‌های انتشار بررسی شده‌اند"]
] as const;

export default function QualityReviewer() {
  const [brief, setBrief] = useState("");
  const [deliverable, setDeliverable] = useState("");
  const [format, setFormat] = useState("");
  const [rightsStatus, setRightsStatus] = useState("unknown");
  const [revisionLimit, setRevisionLimit] = useState("");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<ReturnType<typeof reviewCreativeDeliverable> | null>(null);

  function runReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(reviewCreativeDeliverable({ brief, deliverable, format, rightsStatus, revisionLimit, reviewerNotes, checks }));
  }

  const statusLabels: Record<string, string> = {
    blocked: "مسدود",
    revision_required: "نیازمند اصلاح",
    review_required: "نیازمند بررسی",
    ready_for_human_review: "آماده بازبینی نهایی انسانی"
  };

  return (
    <section className="panel quality-reviewer">
      <div className="panel-head"><div><span className="eyebrow">QUALITY REVIEWER · HUMAN GATE</span><h2>دستیار کنترل کیفیت و تحویل</h2></div><span className="free-tag">بدون ارسال خودکار</span></div>
      <p className="hub-intro">شرح سفارش و مشخصات خروجی را ثبت کن و چک‌لیست را پس از بررسی واقعی تکمیل کن. این ابزار فایل را تحلیل نمی‌کند و تیک‌ها را فقط به‌عنوان اظهار کاربر ثبت می‌کند.</p>
      <form className="opportunity-form" onSubmit={runReview}>
        <textarea required rows={3} value={brief} onChange={e => setBrief(e.target.value)} placeholder="شرح سفارش و معیارهای پذیرش مشتری" aria-label="شرح سفارش"/>
        <textarea required rows={3} value={deliverable} onChange={e => setDeliverable(e.target.value)} placeholder="توضیح فایل آماده‌شده، نسخه و محل نگهداری آن" aria-label="مشخصات خروجی"/>
        <input value={format} onChange={e => setFormat(e.target.value)} placeholder="فرمت و مشخصات فایل، مثلاً MP4 · 1080×1920 · 30s" aria-label="فرمت خروجی"/>
        <select value={rightsStatus} onChange={e => setRightsStatus(e.target.value)} aria-label="وضعیت حقوق محتوا">
          <option value="unknown">حقوق یا مجوز نامشخص</option>
          <option value="confirmed_owned">مالکیت و حق استفاده متعلق به سفارش‌دهنده است</option>
          <option value="licensed">مجوز معتبر و قابل استناد موجود است</option>
          <option value="client_permission">اجازه کتبی صاحب اثر موجود است</option>
          <option value="prohibited">استفاده تجاری ممنوع یا بدون اجازه است</option>
        </select>
        <input value={revisionLimit} onChange={e => setRevisionLimit(e.target.value)} placeholder="تعداد اصلاحات مجاز و باقی‌مانده" aria-label="محدودیت اصلاحات"/>
        <textarea rows={2} value={reviewerNotes} onChange={e => setReviewerNotes(e.target.value)} placeholder="ایرادها، اصلاحات لازم و یادداشت بازبین" aria-label="یادداشت بازبین"/>
        <div className="writing-order-fields">
          <strong>چک‌لیست بازبینی دستی</strong>
          {checklist.map(([key, label]) => <label className="received-check" key={key}><input type="checkbox" checked={checks[key] === true} onChange={e => setChecks(current => ({ ...current, [key]: e.target.checked }))}/>{label}</label>)}
        </div>
        <button type="submit">ارزیابی چک‌لیست تحویل</button>
      </form>
      {result && <div className="discovery-assessment" role="status">
        <strong>{statusLabels[result.status]} · امتیاز چک‌لیست {result.score}/100</strong>
        <p>{result.reason}</p>
        {result.missing.length > 0 && <p>اطلاعات ناقص: {result.missing.join("، ")}</p>}
        {result.unchecked.length > 0 && <><strong>موارد تکمیل‌نشده</strong><ul>{result.unchecked.map(item => <li key={item.key}>{item.label}</li>)}</ul></>}
        <strong>محدودیت‌های بررسی</strong>
        <ul>{result.limitations.map(item => <li key={item}>{item}</li>)}</ul>
        <small>فرمت ثبت‌شده: {result.format || "تعیین نشده"} · محدودیت اصلاحات: {result.revisionLimit || "تعیین نشده"} · بررسی فایل واقعی: انجام نشده</small>
      </div>}
    </section>
  );
}
