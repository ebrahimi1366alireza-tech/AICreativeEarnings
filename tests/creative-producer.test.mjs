import test from "node:test";
import assert from "node:assert/strict";
import { buildCreativeProductionPlan } from "../lib/creative-producer.mjs";

test("builds a complete production plan without running generation tools", () => {
  const plan = buildCreativeProductionPlan({ contentType: "video", platform: "Instagram", product: "coffee", audience: "local customers", message: "fresh roasted coffee", rights: "owned", budget: "0" });
  assert.equal(plan.ready, true);
  assert.equal(plan.budgetApprovalRequired, false);
  assert.ok(plan.stages.length >= 5);
  assert.ok(plan.quality.some(item => item.includes("مجوز")));
});

test("unknown rights remain blocked by a warning", () => {
  const plan = buildCreativeProductionPlan({ contentType: "image", platform: "Shopify", product: "shoes", audience: "buyers", message: "comfort", budget: "0" });
  assert.equal(plan.ready, true);
  assert.equal(plan.rights, "unknown");
  assert.match(plan.rightsWarning, /نامشخص/);
});

test("missing required brief fields are reported", () => {
  const plan = buildCreativeProductionPlan({ contentType: "audio", platform: "", product: "podcast", audience: "", message: "" });
  assert.equal(plan.ready, false);
  assert.deepEqual(plan.missing.sort(), ["audience", "message", "platform"]);
});

test("nonzero budgets require explicit user approval", () => {
  const plan = buildCreativeProductionPlan({ contentType: "text", platform: "website", product: "service", audience: "customers", message: "benefit", budget: "5 USD" });
  assert.equal(plan.budgetApprovalRequired, true);
});
