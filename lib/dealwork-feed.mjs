import { inferOpportunityStream } from "./opportunity-streams.mjs";
import { isDisallowedOpportunity } from "./opportunity-filter.mjs";

function cleanText(value, max = 900) {
  if (typeof value !== "string") return "";
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ").trim().slice(0, max);
}

function safeDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
    ? new Date(value).toISOString() : null;
}

export function normalizeDealworkJobs(payload) {
  const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
  const results = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    if (!["posted", "bidding"].includes(row.status)) continue;
    if (row.visibility !== "public") continue;
    if (!["any", "human_only"].includes(row.eligibleWorkerTypes)) continue;
    if (typeof row.id !== "string" || !/^[0-9a-f-]{36}$/i.test(row.id)) continue;
    const title = cleanText(row.title, 180);
    const description = cleanText(row.description, 900);
    const tags = Array.isArray(row.tags) ? row.tags.filter((tag) => typeof tag === "string").join(" ") : "";
    const searchable = [title, description, cleanText(row.category, 60), tags].join(" ");
    const providerOffer = /\b(?:this is my offer|service offer|what i (?:sell|offer|deliver)|i am posting it here because this board is where buyers browse)\b/i.test(description)
      || /\bwhat i deliver\b/i.test(description) && /\b(?:ai agent|my services|my offering)\b/i.test(description);
    if (!title || providerOffer || /\b(?:subscription|membership plan|monthly plan)\b/i.test(title) || isDisallowedOpportunity(searchable)) continue;
    const stream = inferOpportunityStream(searchable);
    if (!stream) continue;
    const url = "https://api.dealwork.ai/explore/" + row.id;
    const amount = cleanText(row.fixedPrice || row.budgetMax || row.budgetMin || "", 32);
    const currency = cleanText(row.currency || "USD", 8);
    const budget = amount ? amount + " " + currency : "بودجه مشخص نشده";
    const funded = row.posterFunded === true;
    const deadline = safeDate(row.deadline || row.biddingDeadline);
    const poster = cleanText(row.posterDisplayName || "درخواست‌دهنده Dealwork", 90);
    results.push({
      id: "dealwork:" + row.id,
      title,
      company: poster,
      url,
      sourceUrl: "https://api.dealwork.ai/explore",
      location: cleanText([row.locationCountry, row.locationRegion].filter(Boolean).join(", "), 80) || "موقعیت در آگهی مشخص نشده",
      types: ["Freelance", cleanText(row.category || "Creative", 40)],
      salary: budget,
      description,
      postedAt: safeDate(row.createdAt),
      score: funded ? 78 : 68,
      contractType: true,
      source: "Dealwork AI · فید عمومی فقط‌خواندنی",
      stream,
      sourceType: "freelance",
      budgetScope: row.fixedPrice ? "قیمت ثابت اعلامی؛ شرایط قرارداد باید بررسی شود" : "محدوده بودجه اعلامی؛ مبلغ نهایی باید در قرارداد تأیید شود",
      paymentNote: funded
        ? "نشان تأمین وجه در فید فعال است؛ قبل از شروع، وضعیت escrow و کارمزد قرارداد را داخل صفحه رسمی دوباره بررسی کن."
        : "تأمین وجه escrow در داده عمومی تأیید نشده است؛ تا مشاهده وجه قفل‌شده در قرارداد هیچ کاری را شروع نکن.",
      actionNote: "پذیرش کشور، KYC، روش برداشت رمزارزی و حداقل برداشت برای حساب تو تأیید نشده است. مهلت: " + (deadline || "مشخص نشده") + ". هیچ پیشنهاد یا پیامی خودکار ارسال نمی‌شود."
    });
  }
  return results;
}
