import test from "node:test";
import assert from "node:assert/strict";
import { assessOpportunity, parseOpportunityEvidence } from "../lib/opportunity-triage.mjs";

const evidence = Object.fromEntries([
  "country", "citizenship", "kyc", "payout", "asset",
  "network", "minimum", "fee", "entryCost"
].map((field) => [field, `https://official.example/${field}`]));

const eligibleForReview = {
  sourceUrl: "https://market.example/listing/123",
  countryCheck: "مجاز بودن کشور تأیید شده",
  citizenshipAcceptance: "تابعیت ایرانی پذیرفته می‌شود",
  payout: "کیف پول مستقیم",
  deposit: "بدون هزینه ثبت‌نام/اشتراک، سپرده یا خرید اجباری",
  paymentAsset: "USDC",
  network: "Base",
  minimum: "بدون حداقل برداشت",
  fee: "۷.۵٪",
  kyc: "بدون KYC",
  evidenceByField: evidence
};

test("complete evidence only becomes ready for human approval, never auto-approved", () => {
  const result = assessOpportunity(eligibleForReview);
  assert.equal(result.status, "ready_for_user_approval");
  assert.equal(result.decision, "آماده بررسی نهایی کاربر");
  assert.equal(result.score, 100);
});

test("missing country or citizenship proof remains review-required", () => {
  const result = assessOpportunity({ ...eligibleForReview, countryCheck: "هنوز بررسی نشده", evidenceByField: { ...evidence, country: "" } });
  assert.equal(result.status, "review_required");
  assert.ok(result.missingEvidence.includes("country"));
});

test("a deposit is an automatic rejection", () => {
  const result = assessOpportunity({ ...eligibleForReview, deposit: "سپرده یا خرید اجباری دارد" });
  assert.equal(result.status, "ineligible");
  assert.equal(result.score, 0);
});

test("identity-document KYC is rejected under the current project rules", () => {
  const result = assessOpportunity({ ...eligibleForReview, kyc: "مدرک هویتی/پاسپورت" });
  assert.equal(result.status, "ineligible");
});

test("non-HTTPS or malformed evidence cannot satisfy a requirement", () => {
  const result = assessOpportunity({ ...eligibleForReview, evidenceByField: { ...evidence, payout: "http://insecure.example/payout" } });
  assert.equal(result.status, "review_required");
  assert.ok(result.missingEvidence.includes("payout"));
});

test("evidence parser accepts only known fields and HTTPS URLs", () => {
  const parsed = parseOpportunityEvidence([
    "country=https://official.example/country",
    "payout=http://insecure.example/payout",
    "unknown=https://official.example/unknown",
    "kyc=https://official.example/kyc"
  ].join("\n"));
  assert.deepEqual(Object.keys(parsed).sort(), ["country", "kyc"]);
});

test("missing source URL cannot be treated as a verified opportunity", () => {
  const result = assessOpportunity({ ...eligibleForReview, sourceUrl: "" });
  assert.equal(result.status, "review_required");
  assert.ok(result.missingEvidence.includes("source"));
});
