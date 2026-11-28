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
  assert.equal(result.status, "review_required");
  assert.equal(result.decision, "نیازمند راستی‌آزمایی انسانی لینک‌ها");
  assert.equal(result.score, 79);
  assert.ok(result.missingEvidence.includes("content_verification"));
  assert.equal(result.evidenceVerification, "not_verified");
  assert.match(result.reason, /محتوای لینک‌ها/);
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

test("passport KYC remains eligible for documented human review, not auto-approved", () => {
  const result = assessOpportunity({ ...eligibleForReview, kyc: "مدرک هویتی/پاسپورت" });
  assert.equal(result.status, "review_required");
  assert.ok(result.missingEvidence.includes("content_verification"));
  assert.equal(result.evidenceVerification, "not_verified");
});

test("address and tax-document KYC remains reviewable rather than auto-rejected", () => {
  const result = assessOpportunity({ ...eligibleForReview, kyc: "مدرک آدرس/مالیات" });
  assert.equal(result.status, "review_required");
  assert.ok(result.missingEvidence.includes("content_verification"));
});

test("unknown KYC requirements remain unresolved", () => {
  const result = assessOpportunity({ ...eligibleForReview, kyc: "نامشخص" });
  assert.equal(result.status, "review_required");
  assert.ok(result.missingEvidence.includes("kyc"));
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

test("evidence URLs reject embedded credentials and local-only hosts", () => {
  const parsed = parseOpportunityEvidence([
    "country=https://user:secret@official.example/country",
    "kyc=https://localhost/kyc",
    "payout=https://127.0.0.1/payout",
    "asset=https://official.example/asset"
  ].join("\n"));
  assert.deepEqual(Object.keys(parsed), ["asset"]);
});

test("a source URL with embedded credentials is not accepted as secure evidence", () => {
  const result = assessOpportunity({
    ...eligibleForReview,
    sourceUrl: "https://user:secret@market.example/listing/123"
  });
  assert.equal(result.status, "review_required");
  assert.ok(result.missingEvidence.includes("source"));
});
