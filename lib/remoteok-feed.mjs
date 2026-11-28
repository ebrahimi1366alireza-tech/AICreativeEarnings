import { inferOpportunityStream } from "./opportunity-streams.mjs";
import { isDisallowedOpportunity } from "./opportunity-filter.mjs";

function cleanText(value, max = 700) {
  if (typeof value !== "string") return "";
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ").trim().slice(0, max);
}

function safeRemoteOkUrl(slug) {
  if (typeof slug !== "string" || !/^[a-z0-9-]+-\d+$/i.test(slug)) return null;
  return "https://remoteok.com/remote-jobs/" + slug;
}

export function normalizeRemoteOkJobs(payload) {
  const rows = Array.isArray(payload) ? payload : [];
  const results = [];
  for (const job of rows) {
    if (!job || typeof job !== "object" || job.original === false) continue;
    const url = safeRemoteOkUrl(job.slug);
    if (!url || typeof job.position !== "string") continue;
    const title = cleanText(job.position, 180);
    const description = cleanText(job.description || "", 650);
    const searchable = [title, description].join(" ");
    if (isDisallowedOpportunity(searchable)) continue;
    const stream = inferOpportunityStream(title) || inferOpportunityStream(searchable);
    if (!stream) continue;
    const tags = Array.isArray(job.tags) ? job.tags.filter((tag) => typeof tag === "string") : [];
    const freelance = tags.some((tag) => /contract|freelance/i.test(tag));
    const min = Number.isFinite(Number(job.salary_min)) && job.salary_min != null && Number(job.salary_min) > 0
      ? Number(job.salary_min) : null;
    const max = Number.isFinite(Number(job.salary_max)) && job.salary_max != null && Number(job.salary_max) > 0
      ? Number(job.salary_max) : null;
    const salary = min != null || max != null
      ? `$${min != null ? min.toLocaleString("en-US") : "?"}-${max != null ? max.toLocaleString("en-US") : "?"} (period not specified)`
      : "حقوق در آگهی مشخص نشده";
    const date = typeof job.date === "string" && !Number.isNaN(Date.parse(job.date))
      ? new Date(job.date).toISOString() : null;
    results.push({
      id: `remoteok-${job.id || job.slug}`,
      title,
      company: cleanText(job.company || "کارفرما طبق Remote OK", 100),
      url,
      sourceUrl: "https://remoteok.com/api",
      location: cleanText(job.location || "محدوده جغرافیایی در آگهی مشخص نشده", 160),
      types: tags.slice(0, 8),
      salary,
      description,
      postedAt: date,
      score: 60 + (min != null || max != null ? 4 : 0) + (freelance ? 4 : 0),
      contractType: freelance,
      source: "Remote OK · فید عمومی فرصت‌های دورکار",
      stream,
      sourceType: freelance ? "freelance" : "employment",
      budgetScope: "حقوق اعلامی آگهی؛ دوره پرداخت و قرارداد باید جداگانه بررسی شوند",
      paymentNote: "Remote OK فقط آگهی را معرفی می‌کند؛ روش پرداخت، امکان برداشت رمزارزی و کارمزد برای این آگهی تأیید نشده است.",
      actionNote: "لینک اصلی Remote OK و نام منبع حفظ شده‌اند. پذیرش پاسپورت ایرانی، محدودیت کشور، KYC و روش پرداخت هنوز تأیید نشده‌اند."
    });
  }
  return results;
}
