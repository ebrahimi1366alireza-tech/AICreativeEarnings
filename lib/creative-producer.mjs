const TYPES = new Set(["image", "video", "audio", "text"]);
const RIGHTS = new Set(["owned", "licensed", "client_supplied", "unknown"]);

/**
 * Build a no-cost, tool-agnostic production plan. This does not generate assets.
 * @param {{contentType:string, platform:string, product:string, audience:string, message:string, specifications?:string, existingAssets?:string, rights?:string, budget?:string}} input
 */
export function buildCreativeProductionPlan(input) {
  const contentType = String(input.contentType || "").trim();
  const missing = [];
  if (!TYPES.has(contentType)) missing.push("contentType");
  for (const key of ["platform", "product", "audience", "message"]) {
    if (!String(input[key] || "").trim()) missing.push(key);
  }
  const rights = RIGHTS.has(input.rights) ? input.rights : "unknown";
  const budget = String(input.budget || "0").trim();
  const zeroBudget = /^(0|0\.0+|free|رایگان|صفر)$/i.test(budget);
  const stages = [
    "تبدیل شرح سفارش به فهرست تحویل‌دادنی‌ها و معیار پذیرش",
    "بررسی دارایی‌های موجود، ابعاد، مدت، قالب و محدودیت پلتفرم",
    "تهیه طرح/سناریو/متن یا دستور تولید متناسب با نوع محتوا",
    "تولید پیش‌نویس فقط با ابزار و سهمیه‌ای که پیش از استفاده بررسی شده باشد",
    "بازبینی انسانی، اصلاح و آماده‌سازی نسخه نهایی",
    "بسته‌بندی فایل‌ها، نام‌گذاری، مشخصات خروجی و یادداشت تحویل"
  ];
  const quality = [
    "انطباق کامل با شرح سفارش و پیام اصلی",
    "رعایت ابعاد، مدت، فرمت و محدودیت حجم فایل",
    "خوانایی، وضوح و کیفیت فنی در دستگاه مقصد",
    "اصالت محتوا و نبود عناصر کپی‌شده یا دارای مجوز نامشخص",
    "ثبت منابع، مجوزها و اجازه استفاده تجاری",
    "بازبینی نهایی انسانی و تأیید کاربر پیش از ارسال"
  ];
  return {
    ready: missing.length === 0,
    missing,
    contentType: TYPES.has(contentType) ? contentType : "unknown",
    rights,
    budget,
    budgetApprovalRequired: !zeroBudget,
    stages,
    quality,
    toolPolicy: "هیچ ابزار یا سهمیه‌ای رایگان فرض نمی‌شود. پیش از تولید، هزینه، محدودیت منطقه‌ای، واترمارک و مجوز تجاری همان ابزار و همان خروجی بررسی شود.",
    rightsWarning: rights === "unknown" ? "حقوق دارایی‌ها نامشخص است؛ تا روشن‌شدن مالکیت یا مجوز، خروجی برای استفاده تجاری آماده نیست." : "مدرک مالکیت/مجوز و اجازه استفاده تجاری باید پیش از تحویل ثبت و بازبینی شود.",
    summary: missing.length ? "برای ساخت برنامه دقیق، اطلاعات اصلی سفارش ناقص است." : "برنامه تولید آماده است؛ این خروجی برنامه‌ریزی است و به معنی تولید فایل یا تأیید هزینه و مجوز نیست."
  };
}
