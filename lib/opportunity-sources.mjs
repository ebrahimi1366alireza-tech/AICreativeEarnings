export const OPPORTUNITY_SOURCES = [
  { name: "Subnano", url: "https://subnano.ai/", status: "connected", integration: "public_api", note: "درخواست‌های عمومی از API خوانده می‌شوند؛ بودجه تضمین پرداخت نیست." },
  { name: "Microworker.app", url: "https://microworker.app/eligibility/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ feed رسمی و پذیرش تابعیت باید بررسی شود." },
  { name: "Loopuman", url: "https://loopuman.com/browse-tasks", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ API عمومی قابل اتکا هنوز متصل نیست." },
  { name: "SurveyTokens", url: "https://surveytokens.org/terms", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ شرایط کشور و API باید بررسی شود." },
  { name: "Taskmarket", url: "https://taskmarket.dev/tasks", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ دسترسی عمومی و شرایط هر تسک نیازمند بررسی است." },
  { name: "Monero.Jobs", url: "https://monero.jobs/jobs", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ feed و ریسک معامله مستقیم باید بررسی شود." },
  { name: "XmrBazaar", url: "https://xmrbazaar.com/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ بازار همتا‌به‌همتا، نه feed تأییدشده." },
  { name: "GIMI", url: "https://gimi.xyz/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ مسیر پرداخت و دسترسی عمومی نیازمند بررسی است." },
  { name: "make.fun", url: "https://make.fun/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ bountyها و شرایط منطقه‌ای باید جداگانه بررسی شوند." },
  { name: "Superteam Earn", url: "https://superteam.fun/earn", status: "connected", integration: "public_listings_api", note: "فید عمومی read-only برای bounty و project متصل است؛ کشور، KYC و جزئیات پاداش همچنان باید دستی بررسی شوند." },
  { name: "Human Protocol", url: "https://www.humanprotocol.org/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ پروژه و شرایط مشارکت نیازمند بررسی است." },
  { name: "ClipFlip", url: "https://clipflip.com/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ هویت منبع و feed نیازمند بررسی است." },
  { name: "Airaa", url: "https://airaa.com/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ API عمومی تأیید نشده است." },
  { name: "ClipRush.net", url: "https://cliprush.net/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ دامنه و feed نیازمند راستی‌آزمایی است." },
  { name: "MoltJobs", url: "https://moltjobs.com/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ feed رسمی و escrow واقعی نیازمند بررسی است." },
  { name: "HireForHumans", url: "https://hireforhumans.com/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ تابلوی کار زنده هنوز متصل نشده است." },
  { name: "PublicAI Trajector", url: "https://publicai.io/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ API و مجوز داده باید بررسی شوند." },
  { name: "LaborX", url: "https://laborx.com/", status: "connected", integration: "public_telegram_feed", note: "آگهی‌های عمومی کانال LaborX دریافت می‌شوند." },
  { name: "CryptoTask", url: "https://www.cryptotask.org/en", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ feed عمومی و دارایی پرداخت باید بررسی شوند." },
  { name: "Dework", url: "https://app.dework.xyz/bounties", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ bountyها به توکن/پرداخت‌کننده وابسته‌اند." },
  { name: "Open Bounty", url: "https://openbounty.app/", status: "catalog_only", integration: "not_connected", note: "API عمومی فهرست bounty دارد، اما مستندات فعلی آن را testnet معرفی می‌کنند؛ پرداخت واقعی mainnet تأیید نشده و به همین دلیل feed زنده متصل نمی‌شود." },
  { name: "Web3.Career", url: "https://web3.career/pay-in-crypto-jobs", status: "catalog_only", integration: "not_connected", note: "کاتالوگ سرنخ شغلی؛ پرداخت‌کننده مستقیم نیست." },
  { name: "CryptoJobs.com", url: "https://www.cryptojobs.com/public/jobs", status: "catalog_only", integration: "not_connected", note: "کاتالوگ سرنخ شغلی؛ روش پرداخت کارفرما باید بررسی شود." },
  { name: "Worqen", url: "https://worqen.com/legal/terms", status: "restricted", integration: "not_connected", note: "طبق شرایط رسمی ثبت‌شده در کاتالوگ، تابعیت ایرانی ممنوع است؛ برای این پروفایل قابل استفاده نیست." },
  { name: "Anoworks", url: "https://anoworks.com/", status: "catalog_only", integration: "not_connected", note: "کاتالوگ؛ تسک‌های تعامل مصنوعی باید حذف شوند." }
];

export function getOpportunitySourceSummary() {
  const connected = OPPORTUNITY_SOURCES.filter((source) => source.status === "connected").length;
  const restricted = OPPORTUNITY_SOURCES.filter((source) => source.status === "restricted").length;
  return {
    total: OPPORTUNITY_SOURCES.length,
    connected,
    catalogOnly: OPPORTUNITY_SOURCES.filter((source) => source.status === "catalog_only").length,
    restricted,
    sources: OPPORTUNITY_SOURCES
  };
}
