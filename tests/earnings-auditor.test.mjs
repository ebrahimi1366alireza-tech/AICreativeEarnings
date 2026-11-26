import test from "node:test";
import assert from "node:assert/strict";
import { auditEarning, summarizeEarnings } from "../lib/earnings-auditor.mjs";

const base = {
  source: "Example client",
  orderId: "JOB-42",
  currency: "USDT",
  expectedAmount: "100",
  paymentStatus: "received",
  receivedAmount: "105",
  feeAmount: "5",
  evidenceReference: "https://example.invalid/receipt",
  transactionReference: "0xabc123"
};

test("exact net receipt is recorded but never independently verified", () => {
  const result = auditEarning(base);
  assert.equal(result.status, "received_reference_recorded");
  assert.equal(result.netReceivedAmount, "100");
  assert.equal(result.referenceVerification, "not_verified");
  assert.equal(result.paymentVerification, "user_attested_only");
  assert.equal(result.paymentClaimAcceptedAsVerified, false);
});

test("pending payment is not counted as received income", () => {
  const result = auditEarning({ ...base, paymentStatus: "pending", receivedAmount: "", feeAmount: "0" });
  assert.equal(result.status, "pending_payment");
  assert.equal(result.netReceivedAmount, "");
  assert.match(result.followUpDraft, /following up on the payment/);
});

test("net amount mismatch is flagged", () => {
  const result = auditEarning({ ...base, receivedAmount: "90", feeAmount: "2" });
  assert.equal(result.status, "amount_mismatch");
  assert.equal(result.netReceivedAmount, "88");
  assert.equal(result.difference, "-12");
});

test("received amount without a reference remains explicitly unreferenced", () => {
  const result = auditEarning({ ...base, evidenceReference: "", transactionReference: "" });
  assert.equal(result.status, "received_unreferenced");
  assert.equal(result.referenceRecorded, false);
});

test("disputed and refunded payments are not treated as received income", () => {
  assert.equal(auditEarning({ ...base, paymentStatus: "disputed" }).status, "disputed");
  assert.equal(auditEarning({ ...base, paymentStatus: "refunded" }).status, "refunded");
});

test("missing or malformed required fields require review", () => {
  const result = auditEarning({ source: "", currency: "USDT", expectedAmount: "NaN", paymentStatus: "received" });
  assert.equal(result.status, "review_required");
  assert.ok(result.missing.includes("source"));
  assert.ok(result.missing.includes("expectedAmount"));
  assert.ok(result.missing.includes("receivedAmount"));
});

test("fee cannot exceed received gross amount", () => {
  const result = auditEarning({ ...base, receivedAmount: "10", feeAmount: "11" });
  assert.equal(result.status, "review_required");
  assert.ok(result.missing.includes("feeExceedsReceived"));
});

test("summary separates expected, pending, received, and mismatches by asset", () => {
  const records = [
    auditEarning({ ...base }),
    auditEarning({ ...base, paymentStatus: "pending", receivedAmount: "", feeAmount: "0", orderId: "JOB-43" }),
    auditEarning({ ...base, receivedAmount: "90", feeAmount: "0", orderId: "JOB-44" })
  ];
  const summary = summarizeEarnings(records).find(item => item.currency === "USDT");
  assert.equal(summary.records, 3);
  assert.equal(summary.expected, 300);
  assert.equal(summary.received, 190);
  assert.equal(summary.pending, 100);
  assert.equal(summary.mismatches, 1);
});

test("decimal arithmetic preserves token precision", () => {
  const result = auditEarning({ ...base, expectedAmount: "0.123456789012345678", receivedAmount: "0.123456789012345679", feeAmount: "0.000000000000000001" });
  assert.equal(result.status, "received_reference_recorded");
  assert.equal(result.netReceivedAmount, "0.123456789012345678");
});

test("no wallet, blockchain, or external-message action is performed", () => {
  const result = auditEarning(base);
  assert.equal(result.walletAccessPerformed, false);
  assert.equal(result.blockchainLookupPerformed, false);
  assert.equal(result.externalMessageSent, false);
});
