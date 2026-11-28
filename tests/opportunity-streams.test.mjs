import test from "node:test";
import assert from "node:assert/strict";
import { inferOpportunityStream, OPPORTUNITY_SEARCH_TAGS } from "../lib/opportunity-streams.mjs";

test("classifies requested income streams in English", () => {
  const examples = [
    ["Short-form video editor", "ویدئو"],
    ["Product photography and graphic design", "عکس و طراحی"],
    ["Technical article writing", "نوشتن و مقاله"],
    ["Write an Article on Fundraising Opportunities", "نوشتن و مقاله"],
    ["AI music production and soundtrack", "تولید آهنگ با هوش مصنوعی"],
    ["Paid music voting panel", "رأی‌گیری و داوری موسیقی"],
    ["Paid survey and market research study", "نظرسنجی و تحقیقات بازار"],
    ["Website usability testing microtask", "میکروتسک و ارزیابی وب"],
    ["Get paid to watch ads and videos", "تبلیغات، تماشای ویدئو و گوش دادن به موسیقی"],
    ["Paid to listen to music rewards", "تبلیغات، تماشای ویدئو و گوش دادن به موسیقی"],
    ["PTC ads and paid to click", "تبلیغات، تماشای ویدئو و گوش دادن به موسیقی"],
    ["Follow Instagram and join Telegram community task", "وظایف شبکه‌های اجتماعی و کامیونیتی"],
    ["Discord community engagement and ambassador program", "وظایف شبکه‌های اجتماعی و کامیونیتی"],
    ["Paid social media promotion marketing bounty", "وظایف شبکه‌های اجتماعی و کامیونیتی"]
  ];
  for (const [brief, expected] of examples) assert.equal(inferOpportunityStream(brief), expected);
});

test("classifies Persian listings across the seven income streams", () => {
  const examples = [
    ["سفارش تدوین ویدئو و ساخت کلیپ تبلیغاتی", "ویدئو"],
    ["طراحی گرافیک و بنر برای محصول", "عکس و طراحی"],
    ["نگارش مقاله و تولید محتوا", "نوشتن و مقاله"],
    ["ساخت آهنگ و تولید موسیقی", "تولید آهنگ با هوش مصنوعی"],
    ["داوری موسیقی و امتیازدهی آهنگ", "رأی‌گیری و داوری موسیقی"],
    ["شرکت در نظرسنجی پولی و تحقیقات بازار", "نظرسنجی و تحقیقات بازار"],
    ["تست وب‌سایت و برچسب‌گذاری داده", "میکروتسک و ارزیابی وب"],
    ["تماشای تبلیغات و گوش دادن به موسیقی با درآمد", "تبلیغات، تماشای ویدئو و گوش دادن به موسیقی"],
    ["عضویت در تلگرام و کمپین سفیر برند", "وظایف شبکه‌های اجتماعی و کامیونیتی"]
  ];
  for (const [brief, expected] of examples) assert.equal(inferOpportunityStream(brief), expected);
});

test("returns null for unrelated tasks", () => {
  assert.equal(inferOpportunityStream("Install this mobile game"), null);
  assert.equal(inferOpportunityStream("نصب اجباری بازی موبایل"), null);
});

test("includes discovery keywords for the newly added streams", () => {
  for (const tag of ["paid surveys", "music evaluation", "website testing", "paid to watch ads", "paid to listen to music", "social media tasks", "ambassador program", "تدوین ویدئو", "نظرسنجی پولی", "تماشای تبلیغات"]) {
    assert.ok(OPPORTUNITY_SEARCH_TAGS.includes(tag));
  }
});
