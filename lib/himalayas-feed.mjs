import { inferOpportunityStream } from "./opportunity-streams.mjs";
import { isDisallowedOpportunity } from "./opportunity-filter.mjs";

function cleanText(value, max = 700) {
  if (typeof value !== "string") return "";
  return value.replace(/<script[\\s\\S]*?<\\/script>/gi, " ")
    .replace(/<style[\\s\\S]*?<\\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/\\s+/g, " ").trim().slice(0, max);
}

function safeHimalayasUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "himalayas.app" &&
      url.pathname.startsWith("/companies/") && url.pathname.includes("/jobs/") ? url.toString() : null;
  } catch { return null; }
}

export function normalizeHimalayasJobs(payload) {
  const jobs = Array.isArray(payload?.jobs) ? payload.jobs : [];
  const results = [];
  for (const job of jobs) {
    const url = safeHimalayasUrl(job?.guid || job?.applicationLink);
    if (!url || typeof job?.title !== "string") continue;
    const title = cleanText(job.title, 180);
    const description = cleanText(job.description || job.excerpt || "", 650);
    const searchable = [title, description, ...(Array.isArray(job.categories) ? job.categories : [])].join(" ");
    if (isDisallowedOpportunity(searchable)) continue;
    const stream = inferOpportunityStream(title) || inferOpportunityStream(searchable);
    if (!stream) continue;
    const employmentType = cleanText(job.employmentType || "غیرمشخص", 40);
    const freelance = /contract|freelance|part.?time/i.test(employmentType);
    const min = Number.isFinite(Number(job.minSalary)) && job.minSalary != null ? Number(job.minSalary) : null;
    const max = Number.isFinite(Number(job.maxSalary)) && job.maxSalary != null ? Number(job.maxSalary) : null;
    const currency = cleanText(job.currency || "ارز مشخص نشده", 12);
    const period = cleanText(job.salaryPeriod || "", 24);
    const salary = min != null || max != null
      ? `${min != null ? min.toLocaleString("en-US") : "?"}-${max != null ? max.toLocaleString("en-US") : "?"} ${currency}${period ? ` / ${period}` : ""}`
      : "حقوق در آگهی مشخص نشده";
    const restrictions = Array.isArray(job.locationRestrictions)
      ? job.locationRestrictions.filter((x) => typeof x === "string").slice(0, 12).join(", ")
      : "";
    const location = cleanText(restrictions || "محدوده جغرافیایی در آگهی مشخص نشده", 180);
    const postedAt = Number.isFinite(Number(job.pubDate)) && job.pubDate > 0
      ? new Date(Number(job.pubDate) * 1000).toISOString() : null;
    results.push({
      id: `himalayas-${cleanText(job.guid || title, 180)}`,
      title,
      company: cleanText(job.companyName || "کارفرما طبق Himalayas", 100),
      url,
      sourceUrl: "https://himalayas.app/jobs/api",
      location,
      types: [employmentType],
      salary,
      description,
      postedAt,
      score: 61 + (min != null || max != null ? 4 : 0) + (freelance ? 4 : 0),
      contractType: freelance,
      source: "Himalayas · فید عمومی مشاغل دورکار",
      stream,
      sourceType: freelance ? "freelance" : "employment",
      budgetScope: "حقوق اعلامی کارفرما؛ قرارداد و پرداخت باید جداگانه بررسی شوند",
      paymentNote: "Himalayas فقط آگهی را معرفی می‌کند؛ روش پرداخت، امکان برداشت رمزارزی و کارمزد برای این آگهی تأیید نشده است.",
      actionNote: `لینک اصلی Himalayas حفظ شده است. محدودیت جغرافیایی اعلامی: ${location}. پذیرش پاسپورت ایرانی، اقامت ارمنستان، KYC و روش پرداخت هنوز تأیید نشده‌اند.`
    });
  }
  return results;
}
