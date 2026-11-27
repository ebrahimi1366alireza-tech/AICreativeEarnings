/**
 * Evidence-first opportunity triage.
 * This is a deterministic review helper, not an AI model or an eligibility guarantee.
 *
 * @typedef {Record<string, string>} EvidenceMap
 * @typedef {{
 *  sourceUrl?: string, countryCheck?: string, citizenshipAcceptance?: string,
 *  payout?: string, deposit?: string, paymentAsset?: string, network?: string,
 *  minimum?: string, fee?: string, kyc?: string, stream?: string,
 *  evidenceByField?: EvidenceMap
 * }} OpportunityInput
 */

const REQUIRED_EVIDENCE_FIELDS = [
  "country",
  "citizenship",
  "kyc",
  "payout",
  "asset",
  "network",
  "minimum",
  "fee",
  "entryCost"
];

const UNKNOWN_VALUES = new Set(["", "نامشخص", "هنوز بررسی نشده", "بررسی نشده", "unknown"]);

/** @param {string} value */
function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Parse one evidence URL per line using "field=https://..." format.
 * @param {string} raw
 * @returns {EvidenceMap}
 */
export function parseOpportunityEvidence(raw) {
  /** @type {EvidenceMap} */
  const result = {};
  for (const line of String(raw || "").split(/\r?\n/)) {
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const url = line.slice(separator + 1).trim();
    if (REQUIRED_EVIDENCE_FIELDS.includes(field) && isHttpsUrl(url)) result[field] = url;
  }
  return result;
}

/**
 * @param {OpportunityInput} input
 * @returns {{score:number, decision:string, status:"ineligible"|"review_required"|"ready_for_user_approval", reason:string, missingEvidence:string[], evidenceVerification:"not_verified"}}
 */
export function assessOpportunity(input) {
  const hardReject = [];
  if (input.countryCheck === "کشور مسدود است") hardReject.push("کشور محل اقامت در منبع بررسی‌شده مسدود است.");
  if (input.citizenshipAcceptance === "تابعیت ایرانی پذیرفته نمی‌شود") hardReject.push("تابعیت ایرانی طبق مدرک ثبت‌شده پذیرفته نمی‌شود.");
  if (["سپرده یا خرید اجباری دارد", "هزینه ثبت‌نام یا اشتراک اجباری دارد"].includes(input.deposit || "")) {
    hardReject.push("هزینه ورود، اشتراک اجباری، سپرده یا خرید اجباری با سیاست پروژه سازگار نیست.");
  }
  if (input.payout && !["کیف پول مستقیم", "رمزارز از طریق قرارداد به کیف پول"].includes(input.payout) && input.payout !== "نامشخص") {
    hardReject.push("روش پرداخت با پرداخت رمزارزی به کیف پول شخصی سازگار نیست.");
  }
  if (hardReject.length) {
    return { score: 0, decision: "رد خودکار", status: "ineligible", reason: hardReject.join(" "), missingEvidence: [], evidenceVerification: "not_verified" };
  }

  const values = {
    country: input.countryCheck === "مجاز بودن کشور تأیید شده",
    citizenship: input.citizenshipAcceptance === "تابعیت ایرانی پذیرفته می‌شود",
    // KYC is reviewable: passport, address/tax proof, liveness, and other
    // documented checks must be assessed against the user's profile, never auto-rejected.
    kyc: !UNKNOWN_VALUES.has(String(input.kyc || "").trim()),
    payout: ["کیف پول مستقیم", "رمزارز از طریق قرارداد به کیف پول"].includes(input.payout || ""),
    asset: !UNKNOWN_VALUES.has(String(input.paymentAsset || "").trim()),
    network: !UNKNOWN_VALUES.has(String(input.network || "").trim()),
    minimum: !UNKNOWN_VALUES.has(String(input.minimum || "").trim()),
    fee: !UNKNOWN_VALUES.has(String(input.fee || "").trim()),
    entryCost: input.deposit === "بدون هزینه ثبت‌نام/اشتراک، سپرده یا خرید اجباری"
  };

  const missingEvidence = REQUIRED_EVIDENCE_FIELDS.filter(field => {
    const url = input.evidenceByField?.[field] || "";
    return !values[field] || !isHttpsUrl(url);
  });
  const sourceIsSecure = isHttpsUrl(input.sourceUrl || "");
  const verifiedCount = REQUIRED_EVIDENCE_FIELDS.length - missingEvidence.length;
  const score = Math.round((verifiedCount / REQUIRED_EVIDENCE_FIELDS.length) * 90 + (sourceIsSecure ? 10 : 0));

  if (missingEvidence.length || !sourceIsSecure) {
    const missing = [...missingEvidence];
    if (!sourceIsSecure) missing.push("source");
    return {
      score: Math.min(score, 79),
      decision: "نیازمند بررسی مستند",
      status: "review_required",
      reason: "اطلاعات یا سند رسمی برای همه موارد ضروری کامل نیست. هیچ فرصت ناقصی واجد شرایط یا تأییدشده محسوب نمی‌شود.",
      missingEvidence: missing,
      evidenceVerification: "not_verified"
    };
  }

  return {
    score: 79,
    decision: "نیازمند راستی‌آزمایی انسانی لینک‌ها",
    status: "review_required",
    reason: "برای همه شروط لینک HTTPS ثبت شده، اما محتوای لینک‌ها، رسمی‌بودن منبع و ارتباط هر صفحه با شرط مربوطه هنوز بررسی نشده است. تا زمان راستی‌آزمایی محتوای شواهد، این فرصت نمی‌تواند آماده تأیید نهایی یا واجد شرایط تلقی شود.",
    missingEvidence: ["content_verification"],
    evidenceVerification: "not_verified"
  };
}

export const opportunityEvidenceFields = REQUIRED_EVIDENCE_FIELDS;
