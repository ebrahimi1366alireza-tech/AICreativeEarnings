import { NextResponse } from "next/server";
import { isDisallowedOpportunity } from "../../../../lib/opportunity-filter.mjs";
import { inferOpportunityStream } from "../../../../lib/opportunity-streams.mjs";
import { getOpportunitySourceSummary } from "../../../../lib/opportunity-sources.mjs";
import { normalizeSuperteamListings } from "../../../../lib/superteam-feed.mjs";
import { normalizeDealworkJobs } from "../../../../lib/dealwork-feed.mjs";
import { normalizeRemotiveJobs } from "../../../../lib/remotive-feed.mjs";

export const runtime = "nodejs";
export const revalidate = 900;

type DiscoveredItem = {
  id: string; title: string; company: string; url: string; sourceUrl?: string; location: string;
  types: string[]; salary: string; description: string; postedAt: string | null;
  score: number; contractType: boolean; source: string; stream: string;
  sourceType: "employment" | "freelance" | "request";
  budgetScope?: string; paymentNote?: string; actionNote?: string;
};

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
      if (isDisallowedOpportunity(text)) continue;
      // Telegram widget text is flattened to one line by plainText(), so stop each
      // field at the next known label instead of consuming the rest of the post.
      const titleMatch = text.match(/Freelance Opportunity:\s*(.+?)(?=💰|Budget:|🤝|With:|LaborX New job on LaborX\.com|Job Title:|\d+\s+views|$)/i)
        || text.match(/Job Title:\s*(.+?)(?=💰|Budget:|🤝|With:|LaborX New job on LaborX\.com|\d+\s+views|$)/i);
      if (!titleMatch) continue;
      const title = plainText(titleMatch[1], 180);
      // Some LaborX posts have generic titles while the creative service appears
      // only in the body. Match the full post to avoid silently dropping those briefs.
      const stream = inferOpportunityStream(`${title} ${text}`);
      if (!stream) continue;
      const budgetMatch = text.match(/Budget:\s*(.+?)(?=🤝|With:|LaborX New job on LaborX\.com|Job Title:|\d+\s+views|$)/i);
      const budget = budgetMatch ? plainText(budgetMatch[1], 60) : "در آگهی مشخص نشده";
      const companyMatch = text.match(/With:\s*(.+?)(?=LaborX New job on LaborX\.com|Job Title:|\d+\s+views|$)/i);
      const company = companyMatch ? plainText(companyMatch[1], 100) : "کارفرما طبق آگهی LaborX";
      const postMatch = chunk.match(/data-post="LaborXWeb3Jobs\/(\d+)"/);
      const postUrl = postMatch ? `https://t.me/LaborXWeb3Jobs/${postMatch[1]}` : "https://t.me/s/LaborXWeb3Jobs";
      const postedMatch = chunk.match(/<time[^>]*datetime="([^"]+)"/i);
      const postedAt = postedMatch && !Number.isNaN(Date.parse(postedMatch[1])) ? new Date(postedMatch[1]).toISOString() : null;
      found.set(url, {
        id: url, title, company, url, location: "طبق شرح سفارش",
        types: ["Freelance"], salary: budget, description: `سفارش فریلنسری «${title}» در LaborX از طرف ${company}. بودجه اعلامی: ${budget}.`, postedAt,
        score: 65 + (budget !== "در آگهی مشخص نشده" ? 5 : 0), contractType: true,
        source: "LaborX · کانال رسمی فرصت‌ها", stream, sourceType: "freelance",
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
      if (isDisallowedOpportunity(searchable)) continue;
      const stream = inferOpportunityStream(searchable);
      if (!stream) continue;
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
        score: 70, contractType: true,
        source: "Subnano · درخواست عمومی", stream, sourceType: "request",
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


async function fetchDealwork(warnings: string[]): Promise<DiscoveredItem[]> {
  try {
    const url = new URL("https://api.dealwork.ai/api/v1/jobs");
    url.searchParams.set("page", "1");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("sort", "newest");
    const response = await fetch(url.toString(), { headers: { Accept: "application/json" }, next: { revalidate: 900 }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return normalizeDealworkJobs(await response.json()) as DiscoveredItem[];
  } catch {
    warnings.push("فید عمومی Dealwork AI موقتاً دریافت نشد.");
    return [];
  }
}

async function fetchRemotive(warnings: string[]): Promise<DiscoveredItem[]> {
  try {
    // Remotive recommends no more than four API reads per day; cache for six hours.
    const response = await fetch("https://remotive.com/api/remote-jobs?limit=500", {
      headers: { Accept: "application/json" },
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    return normalizeRemotiveJobs(payload) as DiscoveredItem[];
  } catch {
    warnings.push("فید عمومی Remotive موقتاً دریافت نشد.");
    return [];
  }
}

async function fetchSuperteam(warnings: string[]): Promise<DiscoveredItem[]> {
  try {
    const response = await fetch("https://superteam.fun/api/listings?take=100&status=open", {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    return normalizeSuperteamListings(payload) as DiscoveredItem[];
  } catch {
    warnings.push("فید عمومی Superteam Earn موقتاً دریافت نشد.");
    return [];
  }
}


export async function GET() {
  const warnings: string[] = [];
  const [laborx, subnano, superteam, dealwork, remotive] = await Promise.all([
    fetchLaborX(warnings), fetchSubnano(warnings), fetchSuperteam(warnings), fetchDealwork(warnings), fetchRemotive(warnings)
  ]);
  const all = [...laborx, ...subnano, ...superteam, ...dealwork, ...remotive];
  const unique = new Map<string, DiscoveredItem>();
  for (const item of all) {
    if (!unique.has(item.url)) unique.set(item.url, item);
  }
  const jobs = [...unique.values()].sort((a, b) =>
    (b.sourceType === "freelance" ? 1 : 0) - (a.sourceType === "freelance" ? 1 : 0)
    || b.score - a.score
    || (Date.parse(b.postedAt || "") || 0) - (Date.parse(a.postedAt || "") || 0)
  ).slice(0, 100);

  if (!jobs.length && warnings.length >= 2) {
    return NextResponse.json({ error: "منابع عمومی فعلاً در دسترس نیستند.", jobs: [], warnings }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({
    source: ["LaborX", "Subnano", "Superteam Earn", "Dealwork AI", "Remotive"], sourceRegistry: getOpportunitySourceSummary(), fetchedAt: new Date().toISOString(),
    count: jobs.length, jobs, warnings,
    notice: "نتایج زنده LaborX، Subnano، Superteam Earn، Dealwork AI و Remotive با دسته‌بندی تصویر و طراحی، ویدئو، نویسندگی، موسیقی، رأی‌گیری/داوری مشروع، نظرسنجی و تحقیقات، و میکروتسک‌های مرورگری طبقه‌بندی می‌شوند؛ فید Remotive با رعایت کش شش‌ساعته (حداکثر چهار دریافت روزانه) و لینک‌دهی به منبع اصلی اضافه شده است. کلیدواژه‌های پاداش تماشای تبلیغ/ویدئو و گوش‌دادن به موسیقی نیز به دسته‌بندی اضافه شده‌اند، اما هنوز منبع اختصاصی PTC/reward متصل نیست و فقط آگهی‌های منطبق در پنج فید فعلی قابل شناسایی‌اند. بودجه Subnano تضمین یا وجه امانی نیست. روش پرداخت، پذیرش کشور، KYC، کارمزد و حقوق تجاری باید در صفحه اصلی هر مورد تأیید شود. هیچ درخواست یا اقدامی خودکار ارسال نمی‌شود."
  }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=600" } });
}
