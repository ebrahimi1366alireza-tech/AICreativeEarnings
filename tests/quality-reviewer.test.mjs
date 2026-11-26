import test from "node:test";
import assert from "node:assert/strict";
import { reviewCreativeDeliverable } from "../lib/quality-reviewer.mjs";

const allChecks = Object.fromEntries([
  "briefMatch", "formatMatch", "languageReviewed", "technicalReviewed",
  "originalityReviewed", "rightsDocumented", "platformRulesChecked"
].map(key => [key, true]));
const complete = {
  brief: "Create a vertical product video for Instagram",
  deliverable: "Final MP4 v3 stored in approved project folder",
  format: "MP4, 1080x1920, 30 seconds",
  rightsStatus: "licensed",
  checks: allChecks
};

test("complete user-attested checklist only reaches human review, never auto-approval", () => {
  const result = reviewCreativeDeliverable(complete);
  assert.equal(result.status, "ready_for_human_review");
  assert.equal(result.score, 100);
  assert.equal(result.checksAreUserAttested, true);
  assert.equal(result.mediaInspectionPerformed, false);
});

test("unknown rights require correction even when all checklist boxes are checked", () => {
  const result = reviewCreativeDeliverable({ ...complete, rightsStatus: "unknown" });
  assert.equal(result.status, "revision_required");
  assert.equal(result.rightsEvidenceMissing, true);
});

test("prohibited commercial use blocks delivery", () => {
  const result = reviewCreativeDeliverable({ ...complete, rightsStatus: "prohibited" });
  assert.equal(result.status, "blocked");
});

test("unchecked quality criteria are listed for correction", () => {
  const result = reviewCreativeDeliverable({ ...complete, checks: { briefMatch: true } });
  assert.equal(result.status, "revision_required");
  assert.equal(result.unchecked.length, 6);
});

test("missing brief and deliverable details cannot pass review", () => {
  const result = reviewCreativeDeliverable({ brief: "", deliverable: "", rightsStatus: "licensed", checks: allChecks });
  assert.deepEqual(result.missing.sort(), ["brief", "deliverable"]);
  assert.equal(result.status, "revision_required");
});

test("non-evidenced rights labels fall back to unknown", () => {
  const result = reviewCreativeDeliverable({ ...complete, rightsStatus: "trust-me" });
  assert.equal(result.rightsStatus, "unknown");
  assert.equal(result.status, "revision_required");
});
