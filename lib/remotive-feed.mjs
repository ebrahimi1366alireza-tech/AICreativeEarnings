import { inferOpportunityStream } from "./opportunity-streams.mjs";
import { isDisallowedOpportunity } from "./opportunity-filter.mjs";

function cleanText(value, max = 700) {
  if (typeof value !== "string") return "";
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ").trim().slice(0, max);
}

function safeRemotiveUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "remotive.com" &&
      url.pathname.startsWith("/remote-jobs/") ? url.toString() : null;
  } catch { return null; }
}

export function normalizeRemotiveJobs(payload) {
  const jobs = Array.isArray(payload?.jobs) ? payload.jobs : [];
  const results = [];
  for (const job of jobs) {
    const url = safeRemotiveUrl(job?.url);
    if (!url || job?.id == null || typeof job?.title !== "string") continue;
    const title = cleanText(job.title, 180);
    const description = cleanText(job.description || "", 650);
    const searchable = \`\${title} \${description} \${cleanText(job.category || "", 80)}\`;
    if (isDisallowedOpportunity(searchable)) continue;
    const stream = inferOpportunityStream(searchable);
    if (!stream) continue;
    const jobType = cleanText(job.job_type || "غیرمشخص", 40).toLowerCase();
    const freelance = ["freelance", "contract"].includes(jobType);
    const postedAt = typeof job.publication_date === "string" && !Number.isNaN(Date.parse(job.publication_date))
      ? new Date(job.publication_date).toISOString() : null;
    const location = cleanText(job.candidate_required_location || "محدوده جغرافیایی در آگهی مشخص نشده", 140);
    const salary = cleanText(job.salary || "حقوق در آگهی مشخص نشده", 100);
    results.push({
      id: \`remotive-\${job.id}\`, title,
      company: cleanText(job.company_name || "کارفرما طبق Remotive", 100),
      url, location, types: [jobType], salary, description, postedAt,
      score: 62 + (salary !== "حقوق در آگهی مشخص نشده" ? 4 : 0) + (freelance ? 4 : 0),
      contractType: freelance,
      source: "Remotive · فید رسمی فرصت‌های دورکاری",
      stream,
      sourceType: freelance ? "freelance" : "employment",
      budgetScope: "حقوق یا مبلغ اعلامی کارفرما؛ پرداخت و قرارداد تضمین نشده است",
      paymentNote: "Remotive فقط آگهی را معرفی می‌کند؛ پرداخت مستقیم کارفرماست و باید قبل از اقدام بررسی شود.",
      actionNote: "آگهی با تأخیر حدود ۲۴ ساعت از Remotive دریافت می‌شود. منبع و لینک اصلی حفظ شده‌اند؛ پذیرش کشور، پاسپورت، KYC و روش پرداخت تأیید نشده‌اند."
    });
  }
  return results;
}
