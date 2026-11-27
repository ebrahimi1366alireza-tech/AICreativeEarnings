export const OPPORTUNITY_SEARCH_TAGS = [
  "ai video", "video editing", "graphic design", "image editing", "product photography",
  "paid surveys", "music evaluation", "website testing", "data annotation"
];

const STREAM_TERMS = {
  "ویدئو": ["video editor", "video editing", "video producer", "short-form video", "promotional video", "promo video", "video campaign", "motion graphics", "motion designer", "ai video", "reels editor", "tiktok video"],
  "عکس و طراحی": ["graphic design", "graphic designer", "image editing", "photo editing", "product photography", "illustrator", "thumbnail design", "visual designer", "ai image", "ai art", "social media design", "banner design", "poster design"],
  "نوشتن و مقاله": ["article writing", "write an article", "write articles", "article writer", "content writing", "blog writing", "copywriting", "technical writing", "seo writing", "proofreading", "editing", "translation", "research writing"],
  "تولید آهنگ با هوش مصنوعی": ["music production", "song production", "ai music", "music composition", "soundtrack", "jingle", "audio production", "songwriting", "music generation"],
  "رأی‌گیری و داوری موسیقی": ["music voting", "song voting", "music judging", "song judging", "music rating panel", "audio evaluation", "track evaluation", "judge music contest"],
  "نظرسنجی و تحقیقات بازار": ["paid survey", "market research", "user research", "research study", "survey respondent", "focus group", "product research", "participant study"],
  "میکروتسک و ارزیابی وب": ["microtask", "website testing", "usability testing", "data labeling", "data annotation", "content evaluation", "ai evaluation", "web research task"]
};

export function inferOpportunityStream(value = "") {
  const text = String(value).toLowerCase();
  for (const [stream, terms] of Object.entries(STREAM_TERMS)) {
    if (terms.some((term) => text.includes(term))) return stream;
  }
  return null;
}
