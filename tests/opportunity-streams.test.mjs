import test from "node:test";
import assert from "node:assert/strict";
import { inferOpportunityStream, OPPORTUNITY_SEARCH_TAGS } from "../lib/opportunity-streams.mjs";

test("classifies requested income streams", () => {
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

test("returns null for unrelated tasks", () => {
  assert.equal(inferOpportunityStream("Install this mobile game"), null);
});

test("includes discovery keywords for the newly added streams", () => {
  assert.ok(OPPORTUNITY_SEARCH_TAGS.includes("paid surveys"));
  assert.ok(OPPORTUNITY_SEARCH_TAGS.includes("music evaluation"));
  assert.ok(OPPORTUNITY_SEARCH_TAGS.includes("website testing"));
  assert.ok(OPPORTUNITY_SEARCH_TAGS.includes("paid to watch ads"));
  assert.ok(OPPORTUNITY_SEARCH_TAGS.includes("paid to listen to music"));
  assert.ok(OPPORTUNITY_SEARCH_TAGS.includes("social media tasks"));
  assert.ok(OPPORTUNITY_SEARCH_TAGS.includes("ambassador program"));
});
