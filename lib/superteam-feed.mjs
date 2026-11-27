import { inferOpportunityStream } from "./opportunity-streams.mjs";
import { isDisallowedOpportunity } from "./opportunity-filter.mjs";

export function normalizeSuperteamListings(payload) {
  const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
  const normalized = [];
  for (const row of rows) {
    if (!row || typeof row !== "object" || String(row.status || "").toUpperCase() !== "OPEN" || row.isWinnersAnnounced === true) continue;
    if (typeof row.title !== "string" || typeof row.slug !== "string" || !/^[a-z0-9-]+$/i.test(row.slug)) continue;
    const title = row.title.trim().slice(0, 180);
    const sponsor = typeof row.sponsor?.name === "string" ? row.sponsor.name.trim().slice(0, 100) : "کارفرمای Superteam";
    const stream = inferOpportunityStream(title);
    if (!stream || isDisallowedOpportunity(title)) continue;
    const token = typeof row.token === "string" ? row.token.trim().slice(0, 16) : "";
    const amount = typeof row.rewardAmount === "number" && Number.isFinite(row.rewardAmount) && row.rewardAmount >= 0
      ? String(row.rewardAmount)
      : "";
    const reward = amount && token ? `${amount} ${token}` : amount ? amount : "پاداش در فید مشخص نشده";
    const deadline = typeof row.deadline === "string" && !Number.isNaN(Date.parse(row.deadline))
      ? new Date(row.deadline).toISOString()
      : null;
    const type = typeof row.type === "string" ? row.type.toLowerCase() : "listing";
    const url = `https://superteam.fun/earn/listing/${row.slug}`;
    normalized.push({
      id: `superteam:${String(row.id || row.slug)}`,
      title,
      company: sponsor,
      url,
      sourceUrl: "https://superteam.fun/earn",
      location: "طبق آگهی اصلی؛ پذیرش ارمنستان هنوز بررسی نشده",
      types: [type],
      salary: reward,
      description: `فرصت ${type} از ${sponsor}. شرح کامل، شرایط شرکت و معیار انتخاب را در صفحه رسمی آگهی بررسی کن.`,
      postedAt: null,
      score: 72,
      contractType: true,
      source: "Superteam Earn · فید عمومی",
      stream,
      sourceType: type === "project" ? "freelance" : "request",
      budgetScope: row.compensationType === "variable" ? "مبلغ متغیر؛ محدوده باید در صفحه آگهی تأیید شود" : "پاداش اعلامی فید؛ پرداخت تضمین‌شده نیست",
      paymentNote: `دارایی اعلامی: ${token || "نامشخص"}. شبکه، کارمزد، حداقل برداشت، شرایط کشور و KYC باید در صفحه آگهی و حساب بررسی شوند.`,
      actionNote: `مهلت اعلامی: ${deadline || "مشخص نشده"}. ارسال درخواست/اثر فقط دستی و پس از بررسی شرایط انجام شود.`
    });
  }
  return normalized;
}
