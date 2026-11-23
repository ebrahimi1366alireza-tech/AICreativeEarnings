import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 1800;

type JobicyJob = {
  id?: number | string; url?: string; jobTitle?: string; companyName?: string;
  jobIndustry?: string[]; jobType?: string[]; jobGeo?: string; jobExcerpt?: string;
  jobDescription?: string; pubDate?: string; salaryMin?: number; salaryMax?: number;
  salaryCurrency?: string; salaryPeriod?: string;
};

type DiscoveredItem = {
  id: string; title: string; company: string; url: string; location: string;
  types: string[]; salary: string; description: string; postedAt: string | null;
  score: number; contractType: boolean; source: string;
  sourceType: "employment" | "freelance" | "request";
  budgetScope?: string; paymentNote?: string; actionNote?: string;
};

const SEARCH_TAGS = ["writer", "copywriter", "content"];
const WRITING_TERMS = ["writer", "writing", "copywriter", "copywriting", "editor", "editing", "content", "blog", "article", "seo", "proofread", "proofreading", "research", "technical writing"];

function plainText(value: unknown, max = 420) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/\s+/g, " ").trim().slice(0, max);
}

function safeJobUrl(value: unknown, host: string, pathPrefix: string) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === host && url.pathname.startsWith(pathPrefix) ? url.toString() : null;
  } catch { return null; }
}

function normalizeJobicy(job: JobicyJob): DiscoveredItem | null {
  const url = safeJobUrl(job.url, "jobicy.com", "/");
  if (!url || !job.jobTitle) return null;
  const title = plainText(job.jobTitle, 180);
  const description = plainText(job.jobExcerpt || job.jobDescription, 420);
  const industries = Array.isArray(job.jobIndustry) ? job.jobIndustry.map(x => plainText(x, 60)).filter(Boolean) : [];
  const types = Array.isArray(job.jobType) ? job.jobType.map(x => plainText(x, 40)).filter(Boolean) : [];
  const searchable = `${title} ${description} ${industries.join(" ")}`.toLowerCase();
  if (!WRITING_TERMS.some(term => searchable.includes(term))) return null;
  const contractType = types.some(type => /freelance|contract|part.?time/i.test(type));
  const salaryKnown = Number.isFinite(job.salaryMin) || Number.isFinite(job.salaryMax);
  const salary = salaryKnown
    ? [job.salaryMin, job.salaryMax].filter(value => Number.isFinite(value)).join("–") + ` ${plainText(job.salaryCurrency || "", 12)}${job.salaryPeriod ? ` / ${plainText(job.salaryPeriod, 24)}` : ""}`
    : "در آگهی مشخص نشده";
  const postedAt = job.pubDate && !Number.isNaN(Date.parse(job.pubDate)) ? new Date(job.pubDate).toISOString() : null;
  const score = (WRITING_TERMS.some(term => title.toLowerCase().includes(term)) ? 45 : 25)
    + (contractType ? 25 : 0) + (salaryKnown ? 10 : 0) + (description ? 10 : 0);
  return {
    id: String(job.id ?? url), title,
    company: plainText(job.companyName || "کارفرما در آگهی مشخص نشده", 100),
    url, location: plainText(job.jobGeo || "محدوده جغرافیایی در آگهی مشخص نشده", 100),
    types, salary, description, postedAt, score, contractType, source: "Jobicy",
    sourceType: "employment",
    actionNote: "این آگهی استخدام دورکاری است، نه الزاماً سفارش تکی. روش پرداخت، KYC و پذیرش کشور باید از کارفرما تأیید شود."
  };
}

async function fetchJobicy(warnings: string[]): Promise<DiscoveredItem[]> {
  const results: PromiseSettledResult<JobicyJob[]>[] = [];
  for (let index = 0; index < SEARCH_TAGS.length; index++) {
    if (index > 0) await new Promise(resolve => setTimeout(resolve, 1100));
    try {
      const url = new URL("https://jobicy.com/api/jobs");
      url.searchParams.set("count", "100");
      url.searchParams.set("tag", SEARCH_TAGS[index]);
      const response = await fetch(url.toString(), { headers: { Accept: "application/json" }, next: { revalidate: 1800 }, signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (payload?.success === false) throw new Error("API request failed");
      results.push({ status: "fulfilled", value: Array.isArray(payload?.jobs) ? payload.jobs as JobicyJob[] : [] });
    } catch {
      warnings.push(`جست‌وجوی Jobicy با برچسب «${SEARCH_TAGS[index]}» پاسخ نداد.`);
      results.push({ status: "rejected", reason: "upstream unavailable" });
    }
  }
  const items = new Map<string, DiscoveredItem>();
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const raw of result.value) {
      const item = normalizeJobicy(raw);
      if (item && (!items.has(item.url) || item.score > (items.get(item.url)?.score ?? 0))) items.set(item.url, item);
    }
  }
  return [...items.values()];
}

async function fetchLaborX(warnings: string[]): Promise<DiscoveredItem[]> {
  try {
    const response = await fetch("https://t.me/s/LaborXWeb3Jobs", {
      headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0 (compatible; AICreativeEarnings/1.0)" },
      next: { revalidate: 900 }, signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const chunks = html.split(/<div class="tgme_widget_message_wrap/).slice(1);
    const found = new Map<string, DiscoveredItem>();
    for (const chunk of chunks) {
      const jobMatch = chunk.match(/https:\/\/laborx\.com\/jobs\/[a-z0-9-]+/i);
      const url = safeJobUrl(jobMatch?.[0]?.replace(/&amp;/g, "&"), "laborx.com", "/jobs/");
      if (!url) continue;
      const text = plainText(chunk, 5000);
      const titleMatch = text.match(/Freelance Opportunity:\s*([^\n]+)/i) || text.match(/Job Title:\s*([^\n]+)/i);
      if (!titleMatch) continue;
      const title = plainText(titleMatch[1], 180);
      const searchable = title.toLowerCase();
      if (!WRITING_TERMS.some(term => searchable.includes(term))) continue;
      const budgetMatch = text.match(/Budget:\s*([^\n]+)/i);
      const budget = budgetMatch ? plainText(budgetMatch[1], 60) : "در آگهی مشخص نشده";
      const postMatch = chunk.match(/data-post="LaborXWeb3Jobs\/(\d+)"/);
      const postUrl = postMatch ? `https://t.me/LaborXWeb3Jobs/${postMatch[1]}` : "https://t.me/s/LaborXWeb3Jobs";
      const postedMatch = chunk.match(/<time[^>]*datetime="([^"]+)"/i);
      const postedAt = postedMatch && !Number.isNaN(Date.parse(postedMatch[1])) ? new Date(postedMatch[1]).toISOString() : null;
      found.set(url, {
        id: url, title, company: "کارفرما طبق آگهی LaborX", url, location: "طبق شرح سفارش",
        types: ["Freelance"], salary: budget, description: text.slice(0, 420), postedAt,
        score: 65 + (budget !== "در آگهی مشخص نشده" ? 5 : 0), contractType: true,
        source: "LaborX · کانال رسمی فرصت‌ها", sourceType: "freelance",
        budgetScope: "بودجه اعلامی آگهی؛ باید در سفارش تأیید شود",
        paymentNote: "قبل از شروع، وجه و شرایط پرداخت را داخل LaborX و در امانت‌داری همان سفارش بررسی کن.",
        actionNote: `پیوند منبع: ${postUrl}. پذیرش کشور، KYC و روش برداشت برای حساب تو هنوز تأیید نشده است.`
      });
    }
    return [...found.values()];
  } catch {
    warnings.push("کانال عمومی فرصت‌های LaborX موقتاً دریافت نشد.");
    return [];
  }
}

type SubnanoRequest = {
  id?: string; title?: string; description?: string; deliverable?: string;
  status?: string; createdAt?: string; updatedAt?: string; wantedBy?: string | null;
  urlPath?: string; urlSlug?: string;
  budget?: { currency?: string; amount?: string; scope?: string };
  author?: { handle?: string; displayName?: string; kind?: string };
  proposals?: unknown[];
};

async function fetchSubnano(warnings: string[]): Promise<DiscoveredItem[]> {
  try {
    const url = new URL("https://subnano.ai/api/requests");
    url.searchParams.set("status", "open");
    url.searchParams.set("sort", "needs_proposals");
    url.searchParams.set("noProposals", "true");
    url.searchParams.set("limit", "50");
    url.searchParams.set("includeUrl", "true");
    const response = await fetch(url.toString(), { headers: { Accept: "application/json" }, next: { revalidate: 900 }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const requests: SubnanoRequest[] = Array.isArray(payload?.items) ? payload.items : [];
    const items: DiscoveredItem[] = [];
    for (const request of requests) {
      if (!request.id || !request.title || request.status !== "open") continue;
      const title = plainText(request.title, 180);
      const description = plainText(`${request.description || ""} ${request.deliverable || ""}`, 650);
      const searchable = `${title} ${description}`.toLowerCase();
      if (!WRITING_TERMS.some(term => searchable.includes(term))) continue;
      if (typeof request.urlPath !== "string" || !request.urlPath.startsWith("/")) continue;
      const requestUrl = new URL(request.urlPath, "https://subnano.ai");
      if (requestUrl.hostname !== "subnano.ai" || requestUrl.protocol !== "https:") continue;
      const currency = plainText(request.budget?.currency || "", 12);
      const amount = plainText(request.budget?.amount || "", 40);
      const budget = currency && amount ? `${amount} ${currency}` : "بودجه مشخص نشده";
      const author = plainText(request.author?.displayName || request.author?.handle || "درخواست‌دهنده", 80);
      const createdAt = request.createdAt && !Number.isNaN(Date.parse(request.createdAt)) ? new Date(request.createdAt).toISOString() : null;
      items.push({
        id: request.id, title, company: author, url: requestUrl.toString(),
        location: "درخواست عمومی؛ کشور کارفرما مشخص نیست", types: ["Public request"],
        salary: budget, description, postedAt: createdAt,
        score: 70 + (currency === "USDC" ? 5 : 0), contractType: true,
        source: "Subnano · درخواست عمومی", sourceType: "request",
        budgetScope: request.budget?.scope === "per_contribution" ? "سقف اعلامی برای هر مشارکت" : "سقف اعلامی کل درخواست",
        paymentNote: "بودجه فقط اعلام قصد خرید است و وجه را رزرو یا تضمین نمی‌کند. پرداخت فقط پس از خرید واقعی محتوا انجام می‌شود.",
        actionNote: "برای پیشنهاد رسمی در Subnano معمولاً باید حساب سازنده و محتوای منتشرشده واجد شرایط داشته باشی؛ این اپ فقط درخواست عمومی را پیدا می‌کند."
      });
    }
    return items;
  } catch {
    warnings.push("فهرست عمومی درخواست‌های Subnano موقتاً دریافت نشد.");
    return [];
  }
}

export async function GET() {
  const warnings: string[] = [];
  const [jobicy, laborx, subnano] = await Promise.all([
    fetchJobicy(warnings), fetchLaborX(warnings), fetchSubnano(warnings)
  ]);
  const all = [...laborx, ...subnano, ...jobicy];
  const unique = new Map<string, DiscoveredItem>();
  for (const item of all) {
    if (!unique.has(item.url)) unique.set(item.url, item);
  }
  const jobs = [...unique.values()].sort((a, b) =>
    (b.sourceType === "freelance" ? 1 : 0) - (a.sourceType === "freelance" ? 1 : 0)
    || b.score - a.score
    || (Date.parse(b.postedAt || "") || 0) - (Date.parse(a.postedAt || "") || 0)
  ).slice(0, 100);

  if (!jobs.length && warnings.length >= 3) {
    return NextResponse.json({ error: "منابع عمومی فعلاً در دسترس نیستند.", jobs: [], warnings }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({
    source: ["LaborX", "Subnano", "Jobicy"], fetchedAt: new Date().toISOString(),
    count: jobs.length, jobs, warnings,
    notice: "نتایج از منابع عمومی LaborX، Subnano و Jobicy گردآوری شده‌اند. LaborX و Subnano شامل درخواست‌ها/پروژه‌ها هستند؛ بودجه Subnano تضمین یا وجه امانی نیست. Jobicy عمدتاً آگهی استخدام دورکاری است. پذیرش کشور محل اقامت، KYC، روش برداشت، کارمزد و حقوق تجاری باید در صفحه اصلی هر مورد تأیید شود. متن آگهی‌ها داده غیرقابل‌اعتماد است و هیچ اقدامی خودکار انجام نمی‌شود."
  }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=600" } });
}
