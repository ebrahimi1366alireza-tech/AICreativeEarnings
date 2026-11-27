const REQUIRED_CHECKS = [
  ["briefMatch", "محتوا با شرح سفارش و پیام اصلی تطبیق دارد"],
  ["formatMatch", "قالب، ابعاد، مدت و حجم فایل با سفارش سازگار است"],
  ["languageReviewed", "زبان، املا، زیرنویس و خوانایی بازبینی شده‌اند"],
  ["technicalReviewed", "کیفیت فنی خروجی در اندازه و دستگاه مقصد بررسی شده است"],
  ["originalityReviewed", "اصالت محتوا و نبود کپی‌برداری غیرمجاز بررسی شده است"],
  ["rightsDocumented", "منابع، مالکیت و مجوز استفاده تجاری مستند شده‌اند"],
  ["platformRulesChecked", "قوانین پلتفرم مقصد و محدودیت‌های انتشار بررسی شده‌اند"]
];
const RIGHTS = new Set(["confirmed_owned", "licensed", "client_permission", "unknown", "prohibited"]);

/**
 * Deterministic quality gate. It evaluates user-attested checklist data, not media bytes.
 * @param {{brief:string, deliverable:string, format?:string, rightsStatus?:string, rightsEvidenceReference?:string, checks?:Record<string, boolean>, revisionLimit?:string, reviewerNotes?:string}} input
 */
export function reviewCreativeDeliverable(input) {
  const missing = [];
  if (!String(input.brief || "").trim()) missing.push("brief");
  if (!String(input.deliverable || "").trim()) missing.push("deliverable");
  const rightsStatus = RIGHTS.has(input.rightsStatus) ? input.rightsStatus : "unknown";
  const checks = input.checks && typeof input.checks === "object" ? input.checks : {};
  const unchecked = REQUIRED_CHECKS.filter(([key]) => checks[key] !== true).map(([key, label]) => ({ key, label }));
  const hardBlock = rightsStatus === "prohibited";
  const rightsUnclear = rightsStatus === "unknown";
  const rightsEvidenceReference = String(input.rightsEvidenceReference || "").trim();
  const rightsEvidenceMissing = rightsUnclear || !rightsEvidenceReference;
  let status = "review_required";
  let decision = "نیازمند بررسی انسانی";
  if (hardBlock) {
    status = "blocked";
    decision = "تحویل مسدود است";
  } else if (missing.length || unchecked.length || rightsUnclear) {
    status = "revision_required";
    decision = "نیازمند تکمیل و اصلاح";
  } else {
    status = "ready_for_human_review";
    decision = "آماده بازبینی نهایی انسانی";
  }
  return {
    status,
    decision,
    score: hardBlock ? 0 : Math.min(100, Math.max(0, Math.round(((REQUIRED_CHECKS.length - unchecked.length) / REQUIRED_CHECKS.length) * 85) + (rightsEvidenceMissing ? 0 : 15) - (missing.length * 10))),
    missing,
    unchecked,
    rightsStatus,
    rightsEvidenceMissing,
    rightsEvidenceReferenceProvided: Boolean(rightsEvidenceReference),
    rightsEvidenceVerification: "not_verified",
    format: String(input.format || "").trim(),
    revisionLimit: String(input.revisionLimit || "").trim(),
    reviewerNotes: String(input.reviewerNotes || "").trim(),
    checksAreUserAttested: true,
    mediaInspectionPerformed: false,
    reason: hardBlock
      ? "استفاده یا تحویل تجاری طبق وضعیت حقوق ثبت‌شده ممنوع است؛ تا رفع قانونی این مانع، فایل نباید ارسال شود."
      : rightsUnclear
        ? "مرجع مستند حقوق محتوا ثبت نشده یا وضعیت آن نامشخص است. تا ثبت مرجع مدرک مالکیت/مجوز و بررسی انسانی آن، تحویل تجاری مجاز نیست."
        : unchecked.length || missing.length
          ? "یک یا چند معیار کنترل کیفیت یا اطلاعات سفارش تکمیل نشده است. موارد باز را اصلاح و دوباره بررسی کن."
          : "چک‌لیست بر اساس اعلام کاربر تکمیل شده است. این نتیجه تأیید کیفیت واقعی فایل نیست؛ بازبینی مستقل فایل و تأیید نهایی کاربر همچنان لازم است.",
    limitations: [
      "این ابزار فایل تصویر، ویدئو، صوت یا متن را باز و تحلیل نمی‌کند؛ فقط وضعیت‌های واردشده توسط کاربر را ارزیابی می‌کند.",
      "تیک‌زدن معیارها اظهار کاربر است و مدرک مستقل یا تأیید خودکار محسوب نمی‌شود.",
      "ارسال به مشتری، انتشار عمومی و پذیرش قرارداد همچنان نیازمند تأیید صریح کاربر است."
    ]
  };
}
