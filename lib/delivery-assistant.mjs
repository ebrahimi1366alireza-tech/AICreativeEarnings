const ALLOWED_QC = new Set(["ready_for_human_review", "revision_required", "blocked", "not_reviewed"]);
const ALLOWED_RIGHTS = new Set(["confirmed_owned", "licensed", "client_permission", "unknown", "prohibited"]);

/**
 * Build a supervised delivery pack. This function never uploads or sends anything.
 * @param {{orderId?:string, brief?:string, clientName?:string, deliveryChannel?:string, version?:string, requiredAssets?:string[], includedAssets?:string[], format?:string, qcStatus?:string, rightsStatus?:string, outstanding?:string[], deadline?:string, revisionNotes?:string}} input
 */
export function prepareDeliveryPack(input) {
  const missing = [];
  const orderId = String(input.orderId || "").trim();
  const brief = String(input.brief || "").trim();
  const requiredAssets = [...new Set((Array.isArray(input.requiredAssets) ? input.requiredAssets : []).map(v => String(v).trim()).filter(Boolean))];
  const includedAssets = [...new Set((Array.isArray(input.includedAssets) ? input.includedAssets : []).map(v => String(v).trim()).filter(Boolean))];
  if (!orderId) missing.push("orderId");
  if (!brief) missing.push("brief");
  if (!requiredAssets.length) missing.push("requiredAssets");
  if (!includedAssets.length) missing.push("includedAssets");
  const includedSet = new Set(includedAssets.map(v => v.toLocaleLowerCase()));
  const absentAssets = requiredAssets.filter(v => !includedSet.has(v.toLocaleLowerCase()));
  const qcStatus = ALLOWED_QC.has(input.qcStatus) ? input.qcStatus : "not_reviewed";
  const rightsStatus = ALLOWED_RIGHTS.has(input.rightsStatus) ? input.rightsStatus : "unknown";
  const outstanding = (Array.isArray(input.outstanding) ? input.outstanding : []).map(v => String(v).trim()).filter(Boolean);
  const rightsBlocked = rightsStatus === "prohibited" || rightsStatus === "unknown";
  const qcBlocked = qcStatus !== "ready_for_human_review";
  let status = "ready_for_human_approval";
  if (rightsStatus === "prohibited" || qcStatus === "blocked") status = "blocked";
  else if (missing.length || absentAssets.length || rightsBlocked || qcBlocked || outstanding.length) status = "revision_required";
  const clientName = String(input.clientName || "").trim();
  const version = String(input.version || "").trim();
  const format = String(input.format || "").trim();
  const channel = String(input.deliveryChannel || "").trim();
  const deadline = String(input.deadline || "").trim();
  const revisionNotes = String(input.revisionNotes || "").trim();
  const manifest = includedAssets.map(name => ({ name, version: version || "not_recorded", format: format || "not_recorded", location: "not_provided" }));
  const message = [
    clientName ? `Hello ${clientName},` : "Hello,",
    `The delivery package for order ${orderId || "[order ID]"} is being prepared.`,
    `Brief: ${brief || "[brief not recorded]"}`,
    `Included files: ${includedAssets.length ? includedAssets.join(", ") : "[no files listed]"}.`,
    version ? `Version: ${version}.` : "",
    format ? `Format: ${format}.` : "",
    "Please review the package and share any feedback through the agreed channel.",
    "This is a draft message only and has not been sent."
  ].filter(Boolean).join("\n\n");
  return {
    status,
    decision: status === "blocked" ? "تحویل مسدود است" : status === "revision_required" ? "بسته تحویل نیازمند تکمیل یا اصلاح است" : "بسته برای تأیید نهایی انسانی آماده است",
    orderId,
    clientName,
    recipientProvided: Boolean(clientName),
    deliveryChannel: channel,
    deadline,
    version,
    format,
    manifest,
    requiredAssets,
    includedAssets,
    absentAssets,
    missing,
    outstanding,
    qcStatus,
    rightsStatus,
    rightsEvidenceVerification: "not_verified",
    revisionNotes,
    clientMessageDraft: message,
    sendPerformed: false,
    uploadPerformed: false,
    humanApprovalRequired: true,
    limitations: [
      "وجود، سلامت، نام و محتوای فایل‌ها به‌صورت مستقل بررسی نشده است؛ فهرست دارایی‌ها فقط بر اساس ورودی کاربر ساخته می‌شود.",
      "وضعیت کنترل کیفیت و حقوق محتوا از منبع بیرونی دریافت یا راستی‌آزمایی نمی‌شود.",
      "هیچ فایل بارگذاری، پیامی ارسال، مشتری‌ای تماس‌گیری یا اقدامی در پلتفرم مقصد انجام نمی‌شود."
    ]
  };
}
