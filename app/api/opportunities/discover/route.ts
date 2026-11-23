import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

type JobicyJob = {
  id?: number | string;
  url?: string;
  jobTitle?: string;
  companyName?: string;
  jobIndustry?: string[];
  jobType?: string[];
  jobGeo?: string;
  jobExcerpt?: string;
  jobDescription?: string;
  pubDate?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
};

const SEARCH_TAGS = ["writer", "content writing", "copywriter", "SEO writer"];

function plainText(value: unknown, max = 420) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function normalize(job: JobicyJob) {
  if (!job || !job.url || !job.jobTitle) return null;
  let url: URL;
  try { url = new URL(job.url); } catch { return null; }
  if (url.protocol !== "https:" || url.hostname !== "jobicy.com") return null;

  const title = plainText(job.jobTitle, 180);
  const description = plainText(job.jobExcerpt || job.jobDescription, 420);
  const industries = Array.isArray(job.jobIndustry) ? job.jobIndustry.map(x => plainText(x, 60)).filter(Boolean) : [];
  const types = Array.isArray(job.jobType) ? job.jobType.map(x => plainText(x, 40)).filter(Boolean) : [];
  const searchable = `${title} ${description} ${industries.join(" ")}`.toLowerCase();
  const writingTerms = ["writer", "writing", "copywriter", "copywriting", "editor", "editing", "content", "blog", "article", "seo", "proofread", "proofreading"];
  if (!writingTerms.some(term => searchable.includes(term))) return null;

  const contractType = types.some(type => /freelance|contract|part.?time/i.test(type));
  const salaryKnown = Number.isFinite(job.salaryMin) || Number.isFinite(job.salaryMax);
  const salary = salaryKnown
    ? [job.salaryMin, job.salaryMax].filter(value => Number.isFinite(value)).join("–") + ` ${plainText(job.salaryCurrency || "", 12)}${job.salaryPeriod ? ` / ${plainText(job.salaryPeriod, 24)}` : ""}`
    : "در آگهی مشخص نشده";
  const postedAt = job.pubDate && !Number.isNaN(Date.parse(job.pubDate)) ? new Date(job.pubDate).toISOString() : null;
  const score = (writingTerms.some(term => title.toLowerCase().includes(term)) ? 45 : 25)
    + (contractType ? 25 : 0)
    + (salaryKnown ? 10 : 0)
    + (description ? 10 : 0);

  return {
    id: String(job.id ?? url.pathname),
    title,
    company: plainText(job.companyName || "کارفرما در آگهی مشخص نشده", 100),
    url: url.toString(),
    location: plainText(job.jobGeo || "محدوده جغرافیایی در آگهی مشخص نشده", 100),
    types,
    industries,
    salary,
    description,
    postedAt,
    score,
    contractType,
    source: "Jobicy"
  };
}

export async function GET() {
  const results = await Promise.allSettled(SEARCH_TAGS.map(async tag => {
    const url = new URL("https://jobicy.com/api/v2/remote-jobs");
    url.searchParams.set("count", "100");
    url.searchParams.set("tag", tag);
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`Jobicy returned HTTP ${response.status}`);
    const payload = await response.json();
    return Array.isArray(payload?.jobs) ? payload.jobs as JobicyJob[] : [];
  }));

  const byUrl = new Map<string, NonNullable<ReturnType<typeof normalize>>>();
  const warnings: string[] = [];
  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    if (result.status === "rejected") {
      warnings.push(`جستجوی «${SEARCH_TAGS[index]}» موقتاً پاسخ نداد.`);
      continue;
    }
    for (const raw of result.value) {
      const job = normalize(raw);
      if (!job) continue;
      const existing = byUrl.get(job.url);
      if (!existing || job.score > existing.score) byUrl.set(job.url, job);
    }
  }

  const jobs = [...byUrl.values()]
    .sort((a, b) => b.score - a.score || (Date.parse(b.postedAt || "") || 0) - (Date.parse(a.postedAt || "") || 0))
    .slice(0, 60);

  if (!jobs.length && warnings.length === SEARCH_TAGS.length) {
    return NextResponse.json({ error: "منبع Jobicy فعلاً در دسترس نیست.", jobs: [], warnings }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json({
    source: "Jobicy",
    sourceUrl: "https://jobicy.com/jobs-rss-feed",
    fetchedAt: new Date().toISOString(),
    count: jobs.length,
    jobs,
    warnings,
    notice: "این‌ها آگهی‌های دورکاری نوشتاری‌اند، نه الزاماً سفارش تکی مقاله. روش پرداخت، پذیرش کشور، KYC و حقوق استفاده تجاری در API تأیید نمی‌شود و باید در صفحه اصلی هر آگهی بررسی شود."
  }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800" } });
}
