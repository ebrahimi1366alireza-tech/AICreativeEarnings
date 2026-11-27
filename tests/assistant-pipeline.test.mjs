import test from "node:test";
import assert from "node:assert/strict";
import { runAssistantPipeline } from "../lib/assistant-pipeline.mjs";

const brief = {
  id: "pipe-1", title: "Product campaign", sourceUrl: "https://market.example/job",
  countryCheck: "needs review", citizenshipAcceptance: "needs review", payout: "unknown", deposit: "unknown",
  paymentAsset: "USDC", network: "Base", minimum: "unknown", fee: "unknown", kyc: "unknown",
  contentType: "image", platform: "Shopify", product: "coffee", audience: "buyers", message: "Show premium coffee",
  specifications: "Square image, English", existingAssets: "logo.png", rights: "unknown", budget: "0",
  currency: "USD", expectedAmount: "100"
};

test("runs five assistants in order and transfers outputs into downstream stages", () => {
  const result = runAssistantPipeline(brief);
  assert.equal(result.ok, true);
  assert.deepEqual(result.stages.map((stage) => stage.id), ["opportunity_triage", "creative_production", "quality_review", "delivery_preparation", "earnings_audit"]);
  assert.match(result.stages[2].output.reason, /حقوق|مجوز/);
  assert.equal(result.stages[3].output.qcStatus, result.stages[2].output.status);
  assert.equal(result.stages[3].output.orderId, "Product campaign");
  assert.equal(result.stages[4].output.paymentStatus, "pending");
  assert.equal(result.project.externalActionsPerformed, false);
});

test("keeps unknown rights, incomplete QC, and delivery assets blocked from approval", () => {
  const result = runAssistantPipeline(brief);
  assert.equal(result.stages[2].output.status, "revision_required");
  assert.equal(result.stages[3].output.status, "revision_required");
  assert.equal(result.stages[3].output.sendPerformed, false);
  assert.equal(result.stages[3].output.uploadPerformed, false);
});

test("rejects empty project titles", () => {
  assert.deepEqual(runAssistantPipeline({ title: " " }), { ok: false, error: "عنوان پروژه الزامی است." });
});

test("does not claim received income or perform external actions", () => {
  const result = runAssistantPipeline({ ...brief, rights: "licensed", rightsEvidenceReference: "https://example.test/license" });
  assert.equal(result.stages[4].output.status, "pending_payment");
  assert.equal(result.stages[4].output.paymentClaimAcceptedAsVerified, false);
  assert.equal(result.stages[4].output.walletAccessPerformed, false);
  assert.equal(result.stages[4].output.externalMessageSent, false);
});
