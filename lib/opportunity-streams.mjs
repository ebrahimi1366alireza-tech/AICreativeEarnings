export const OPPORTUNITY_SEARCH_TAGS = [
  "ai video", "video editing", "graphic design", "image editing", "product photography",
  "paid surveys", "music evaluation", "website testing", "data annotation",
  "paid to watch ads", "watch videos for rewards", "paid video tasks",
  "paid to listen to music", "music listening rewards", "PTC ads",
  "social media tasks", "community engagement", "ambassador program", "marketing bounty",
  "paid social media promotion", "طراحی گرافیک", "طراحی بنر", "ویرایش عکس",
  "تدوین ویدئو", "ساخت ویدئو", "ساخت کلیپ", "نویسندگی", "تولید محتوا",
  "ترجمه", "مقاله نویسی", "تولید موسیقی", "ساخت آهنگ", "داوری موسیقی",
  "نظرسنجی پولی", "تحقیقات بازار", "تست وبسایت", "برچسب گذاری داده",
  "تماشای تبلیغات", "تماشای ویدئو با درآمد", "گوش دادن به موسیقی با درآمد",
  "تسک شبکه اجتماعی", "عضویت در تلگرام", "عضویت در دیسکورد", "کمپین سفیر برند"
];

const STREAM_TERMS = {
  "ویدئو": ["video editor", "video editing", "video producer", "short-form video", "promotional video", "promo video", "video campaign", "motion graphics", "motion designer", "ai video", "reels editor", "tiktok video", "تدوین ویدئو", "ادیت ویدئو", "ساخت ویدئو", "ساخت کلیپ", "کلیپ تبلیغاتی", "ویدئوی کوتاه", "ویدیو کوتاه", "موشن گرافیک"],
  "عکس و طراحی": ["graphic design", "graphic designer", "image editing", "photo editing", "product photography", "illustrator", "thumbnail design", "visual designer", "ai image", "ai art", "social media design", "banner design", "poster design", "طراحی گرافیک", "طراحی بنر", "طراحی پوستر", "طراحی کاور", "ویرایش عکس", "ادیت عکس", "عکاسی محصول", "تصویرسازی"],
  "نوشتن و مقاله": ["article writing", "write an article", "write articles", "article writer", "content writing", "blog writing", "copywriting", "technical writing", "seo writing", "proofreading", "editing", "translation", "research writing", "نویسندگی", "مقاله نویسی", "مقاله‌نویسی", "تولید محتوا", "کپی رایتینگ", "ترجمه", "ویراستاری", "نگارش مقاله"],
  "تولید آهنگ با هوش مصنوعی": ["music production", "song production", "ai music", "music composition", "soundtrack", "jingle", "audio production", "songwriting", "music generation", "تولید موسیقی", "ساخت آهنگ", "آهنگسازی", "ساخت موسیقی", "موسیقی تبلیغاتی", "تولید صوت"],
  "رأی‌گیری و داوری موسیقی": ["music voting", "song voting", "music judging", "song judging", "music rating panel", "audio evaluation", "track evaluation", "judge music contest", "داوری موسیقی", "ارزیابی موسیقی", "امتیازدهی آهنگ", "رأی‌گیری موسیقی", "داوری آهنگ"],
  "نظرسنجی و تحقیقات بازار": ["paid survey", "market research", "user research", "research study", "survey respondent", "focus group", "product research", "participant study", "نظرسنجی پولی", "نظرسنجی با درآمد", "تحقیقات بازار", "تحقیق کاربری", "گروه کانونی", "شرکت در نظرسنجی"],
  "میکروتسک و ارزیابی وب": ["microtask", "website testing", "usability testing", "data labeling", "data annotation", "content evaluation", "ai evaluation", "web research task", "تست وبسایت", "تست وب‌سایت", "آزمایش کاربردپذیری", "برچسب گذاری داده", "برچسب‌گذاری داده", "ارزیابی محتوا", "میکروتسک", "تسک مرورگری"],
  "تبلیغات، تماشای ویدئو و گوش دادن به موسیقی": ["paid to watch ads", "watch ads for money", "ad viewing rewards", "paid ad viewing", "watch videos for rewards", "paid video tasks", "video rewards", "paid to listen to music", "music listening rewards", "listen to music and earn", "paid music listening", "ptc ads", "paid to click", "reward videos", "تماشای تبلیغات", "تماشای آگهی", "تماشای ویدئو با درآمد", "تماشای ویدیو با درآمد", "گوش دادن به موسیقی با درآمد", "شنیدن موسیقی با پاداش", "کلیک تبلیغاتی پولی"],
  "وظایف شبکه‌های اجتماعی و کامیونیتی": ["social media tasks", "follow and join task", "follow instagram", "follow instagram account", "join telegram", "join telegram channel", "join discord", "join discord server", "social engagement task", "paid comment", "community engagement", "ambassador program", "brand ambassador", "marketing bounty", "creator campaign", "share a post", "repost campaign", "ugc campaign", "paid social media promotion", "content promotion bounty", "community moderator", "تسک شبکه اجتماعی", "وظایف شبکه اجتماعی", "عضویت در تلگرام", "عضویت در دیسکورد", "دنبال کردن صفحه", "کمپین سفیر برند", "مدیریت کامیونیتی", "تولید محتوای تبلیغاتی"]
};

export function inferOpportunityStream(value = "") {
  const text = String(value).toLowerCase();
  for (const [stream, terms] of Object.entries(STREAM_TERMS)) {
    if (terms.some((term) => text.includes(term))) return stream;
  }
  return null;
}
