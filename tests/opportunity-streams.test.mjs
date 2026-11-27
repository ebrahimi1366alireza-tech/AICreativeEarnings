import test from "node:test";
import assert from "node:assert/strict";
import { inferOpportunityStream, OPPORTUNITY_SEARCH_TAGS } from "../lib/opportunity-streams.mjs";

test("classifies all seven requested income streams", () => {
  const examples = [
    ["Short-form video editor", "ویدئو"],
    ["Product photography and graphic design", "عکس و طراحی"],
    ["Technical article writing", "نوشتن و مقاله"],
    ["Write an Article on Fundraising Opportunities", "نوشتن و مقاله"],
    ["AI music production and soundtrack", "تولید آهنگ با هوش مصنوعی"],
    ["Paid music voting panel", "رأی‌گیری و داوری موسیقی"],
    ["Paid survey and market research study", "نظرسنجی و تحقیقات بازار"],
    ["Website usability testing microtask", "میکروتسک و ارزیابی وب"]
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
});
