"use client";

import { useState } from "react";
import { prepareDeliveryPack } from "../../lib/delivery-assistant.mjs";

const statusLabels: Record<string, string> = {
  blocked: "مسدود",
  revision_required: "نیازمند تکمیل یا اصلاح",
  ready_for_human_approval: "آماده تأیید نهایی انسانی"
};

function lines(value: string) {
  return value.split("\\n").map(item => item.trim()).filter(Boolean);
}

export default function DeliveryAssistant() {
  const [orderId, setOrderId] = useState("");
  const [brief, setBrief] = useState("");
  const [clientName, setClientName] = useState("");
  const [deliveryChannel, setDeliveryChannel] = useState("");
  const [version, setVersion] = useState("");
  const [requiredAssetsText, setRequiredAssetsText] = useState("");
  const [includedAssetsText, setIncludedAssetsText] = useState("");
  const [format, setFormat] = useState("");
  const [qcStatus, setQcStatus] = useState("not_reviewed");
  const [rightsStatus, setRightsStatus] = useState("unknown");
  const [outstandingText, setOutstandingText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [revisionNotes, setRevisionNotes] = useState("");
  const [result, setResult] = useState<ReturnType<typeof prepareDeliveryPack> | null>(null);

  function buildPack(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(prepareDeliveryPack({
      orderId, brief, clientName, deliveryChannel, version,
      requiredAssets: lines(requiredAssetsText),
      includedAssets: lines(includedAssetsText),
      format, qcStatus, rightsStatus,
      outstanding: lines(outstandingText), deadline, revisionNotes
    }));
  }

  return (
    <section className="panel delivery-assistant">
      <div className="panel-head"><div><span className="eyebrow">DELIVERY ASSISTANT · HUMAN APPROVAL</span><h2>دستیار آماده‌سازی بسته تحویل</h2></div><span className="free-tag">بدون آپلود یا ارسال</span></div>
      <p className="hub-intro">اطلاعات سفارش و فهرست فایل‌ها را وارد کن. نام فایل‌ها و وضعیت QC صرفاً بر اساس اطلاعات ثبت‌شده‌اند و این ابزار وجود یا سلامت فایل را بررسی نمی‌کند.</p>
      <form className="opportunity-form" onSubmit={buildPack}>
        <input required value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="شناسه سفارش" aria-label="شناسه سفارش"/>
        <textarea required rows={2} value={brief} onChange={e => setBrief(e.target.value)} placeholder="شرح سفارش و خروجی مورد انتظار" aria-label="شرح سفارش"/>
        <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="نام مشتری، در صورت ثبت‌شدن" aria-label="نام مشتری"/>
        <input value={deliveryChannel} onChange={e => setDeliveryChannel(e.target.value)} placeholder="کانال توافق‌شده تحویل، بدون اطلاعات تماس حدسی" aria-label="کانال تحویل"/>
        <input value={version} onChange={e => setVersion(e.target.value)} placeholder="نسخه خروجی، مثلاً v2" aria-label="نسخه"/>
        <textarea rows={3} value={requiredAssetsText} onChange={e => setRequiredAssetsText(e.target.value)} placeholder={"فهرست فایل‌های موردنیاز، هر فایل در یک خط"} aria-label="فایل‌های موردنیاز"/>
        <textarea rows={3} value={includedAssetsText} onChange={e => setIncludedAssetsText(e.target.value)} placeholder={"فهرست فایل‌های آماده، هر فایل در یک خط"} aria-label="فایل‌های آماده"/>
        <input value={format} onChange={e => setFormat(e.target.value)} placeholder="فرمت، ابعاد و مدت خروجی" aria-label="فرمت خروجی"/>
        <select value={qcStatus} onChange={e => setQcStatus(e.target.value)} aria-label="وضعیت کنترل کیفیت">
          <option value="not_reviewed">کنترل کیفیت انجام نشده</option>
          <option value="revision_required">نیازمند اصلاح</option>
          <option value="blocked">مسدود</option>
          <option value="ready_for_human_review">چک‌لیست QC تکمیل و آماده بازبینی انسانی</option>
        </select>
        <select value={rightsStatus} onChange={e => setRightsStatus(e.target.value)} aria-label="وضعیت حقوق محتوا">
          <option value="unknown">حقوق یا مجوز نامشخص</option>
          <option value="confirmed_owned">مالکیت تأییدشده توسط کاربر</option>
          <option value="licensed">مجوز ثبت‌شده توسط کاربر</option>
          <option value="client_permission">اجازه مشتری ثبت شده</option>
          <option value="prohibited">استفاده تجاری ممنوع</option>
        </select>
        <textarea rows={2} value={outstandingText} onChange={e => setOutstandingText(e.target.value)} placeholder={"اقدام‌ها و اصلاحات باقی‌مانده، هر مورد در یک خط"} aria-label="موارد باقی‌مانده"/>
        <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="مهلت تحویل، اختیاری" aria-label="مهلت تحویل"/>
        <textarea rows={2} value={revisionNotes} onChange={e => setRevisionNotes(e.target.value)} placeholder="یادداشت نسخه و تغییرات انجام‌شده" aria-label="یادداشت اصلاحات"/>
        <button type="submit">ساخت بسته تحویل</button>
      </form>
      {result && <div className="discovery-assessment" role="status">
        <strong>{statusLabels[result.status]}</strong>
        <p>{result.decision}</p>
        {result.missing.length > 0 && <p>اطلاعات ثبت‌نشده: {result.missing.join("، ")}</p>}
        {result.absentAssets.length > 0 && <><strong>فایل‌های موردنیازِ فهرست‌نشده</strong><ul>{result.absentAssets.map(item => <li key={item}>{item}</li>)}</ul></>}
        {result.outstanding.length > 0 && <><strong>موارد باز</strong><ul>{result.outstanding.map(item => <li key={item}>{item}</li>)}</ul></>}
        <strong>مانیفست فایل‌ها</strong>
        {result.manifest.length ? <ul>{result.manifest.map(item => <li key={item.name}>{item.name} · {item.version} · {item.format}</li>)}</ul> : <p>هنوز فایلی در فهرست خروجی ثبت نشده است.</p>}
        <strong>پیش‌نویس پیام مشتری</strong>
        <pre className="delivery-message-draft">{result.clientMessageDraft}</pre>
        <small>مشتری/گیرنده: {result.recipientProvided ? result.clientName : "نام ثبت نشده"} · کانال: {result.deliveryChannel || "ثبت نشده"} · مهلت: {result.deadline || "ثبت نشده"} · QC: {result.qcStatus} · حقوق: {result.rightsStatus}</small>
        <ul>{result.limitations.map(item => <li key={item}>{item}</li>)}</ul>
        <strong>ارسال انجام نشده · آپلود انجام نشده · تأیید انسانی الزامی است.</strong>
      </div>}
    </section>
  );
}
