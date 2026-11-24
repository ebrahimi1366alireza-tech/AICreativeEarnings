import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 900;

type DiscoveredItem = {
  id: string; title: string; company: string; url: string; sourceUrl?: string; location: string;
  types: string[]; salary: string; description: string; postedAt: string | null;
  score: number; contractType: boolean; source: string; stream: string;
  sourceType: "employment" | "freelance" | "request";
  budgetScope?: string; paymentNote?: string; actionNote?: string;
};

const SEARCH_TAGS = ["ai video", "video editing", "graphic design", "image editing", "product photography"];
const STREAM_TERMS: Record<string, string[]> = {
  "ویدئو": ["video editor", "video editing", "video producer", "short-form video", "motion graphics", "motion designer", "ai video", "reels editor", "tiktok video"],
  "عکس و طراحی": ["graphic design", "graphic designer", "image editing", "photo editing", "product photography", "illustrator", "thumbnail design", "visual designer", "ai image", "ai art", "social media design", "banner design", "poster design"],
  "نوشتن و مقاله": ["article writing", "content writing", "blog writing", "copywriting", "technical writing", "seo writing", "proofreading", "editing", "translation", "research writing"],
  "تولید آهنگ با هوش مصنوعی": ["music production", "song production", "ai music", "music composition", "soundtrack", "jingle", "audio production", "songwriting", "music generation"],
  "رأی‌گیری و داوری موسیقی": ["music review", "song review", "music reviewer", "rate music", "rate songs", "music judging", "judge music", "song rating", "music feedback", "track feedback", "listen and review music", "playlist review"],
  "نظرسنجی و تحقیقات بازار": ["paid survey", "online survey", "survey response", "survey participant", "market research", "consumer research", "questionnaire", "polling", "paid poll", "user research", "research participant"]
};
function inferStream(value: string): string | null {
  const text = value.toLowerCase();
  for (const [stream, terms] of Object.entries(STREAM_TERMS)) {
    if (terms.some(term => text.includes(term))) return stream;
  }
  return null;
}

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
      // Telegram widget text is flattened to one line by plainText(), so stop each
      // field at the next known label instead of consuming the rest of the post.
      const titleMatch = text.match(/Freelance Opportunity:\s*(.+?)(?=💰|Budget:|🤝|With:|LaborX New job on LaborX\.com|Job Title:|\d+\s+views|$)/i)
        || text.match(/Job Title:\s*(.+?)(?=💰|Budget:|🤝|With:|LaborX New job on LaborX\.com|\d+\s+views|$)/i);
      if (!titleMatch) continue;
      const title = plainText(titleMatch[1], 180);
      // Match the title and full post together: LaborX titles can be generic
      // while the description contains the actual image/video deliverable.
      const stream = inferStream(`${title} ${text}`);
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
      const stream = inferStream(searchable);
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
        score: 70 + (currency === "USDC" ? 5 : 0), contractType: true,
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


export async function GET() {
  const warnings: string[] = [];
  const [laborx, subnano] = await Promise.all([
    fetchLaborX(warnings), fetchSubnano(warnings)
  ]);
  const all = [...laborx, ...subnano];
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
    source: ["LaborX", "Subnano"], fetchedAt: new Date().toISOString(),
    count: jobs.length, jobs, warnings,
    notice: "نتایج زنده LaborX و Subnano می‌توانند سفارش‌های مرتبط با تصویر و طراحی، ویدئو، نویسندگی و مقاله، تولید آهنگ با هوش مصنوعی، رأی‌گیری/داوری موسیقی و نظرسنجی/تحقیقات بازار را نمایش دهند؛ البته فقط مواردی که در متن آگهی با این دسته‌ها تطبیق داشته باشند. این دو منبع، جایگزین فید اختصاصی نظرسنجی یا داوری موسیقی نیستند. بودجه Subnano تضمین یا وجه امانی نیست. روش پرداخت، پذیرش کشور، KYC، کارمزد و حقوق تجاری باید در صفحه اصلی هر مورد تأیید شود. هیچ درخواست یا اقدامی خودکار ارسال نمی‌شود."
  }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=600" } });
}
