import test from "node:test";
import assert from "node:assert/strict";
import { classifyCryptoOpportunity, rankCryptoOpportunities } from "../lib/crypto-opportunity-finder.mjs";

const base = {
  title: "Paid smart contract security bounty",
  description: "Authorized vulnerability disclosure program with a defined reward.",
  sourceUrl: "https://example.org/bounty"
};

test("keeps unknown KYC and country eligibility visible for human review", () => {
  const result = classifyCryptoOpportunity(base);
  assert.equal(result.accepted, true);
  assert.equal(result.status, "needs_review");
  assert.match(result.reasons.join(" "), /ارمنستان/);
  assert.match(result.reasons.join(" "), /پاسپورت ایرانی/);
});

test("rejects airdrops because they are not guaranteed paid work", () => {
  const result = classifyCryptoOpportunity({ ...base, title: "Airdrop claim campaign" });
  assert.equal(result.accepted, false);
  assert.equal(result.status, "rejected");
});

test("rejects mandatory deposits and membership fees", () => {
  const result = classifyCryptoOpportunity({ ...base, description: "Pay to apply. Deposit required." });
  assert.equal(result.accepted, false);
  assert.equal(result.status, "rejected");
});

test("rejects fiat-only payouts under the current project policy", () => {
  const result = classifyCryptoOpportunity({ ...base, payout: "fiat_only" });
  assert.equal(result.accepted, false);
});

test("marks fully documented direct-wallet opportunities for human review, never auto-approval", () => {
  const result = classifyCryptoOpportunity({
    ...base,
    payout: "escrow_to_wallet",
    countryEligibility: "eligible",
    iranianPassport: "accepted",
    kyc: "passport_and_liveness"
  });
  assert.equal(result.status, "ready_for_human_review");
});

test("rejects non-HTTPS and credential-bearing source links", () => {
  assert.equal(classifyCryptoOpportunity({ ...base, sourceUrl: "http://example.org" }).accepted, false);
  assert.equal(classifyCryptoOpportunity({ ...base, sourceUrl: "https://user:pass@example.org" }).accepted, false);
});

test("ranks documented escrow-to-wallet work ahead of unknown payout leads", () => {
  const ranked = rankCryptoOpportunities([
    { ...base, title: "Freelance article writing task" },
    { ...base, title: "Freelance design commission", payout: "escrow_to_wallet", countryEligibility: "eligible", iranianPassport: "accepted", kyc: "passport" }
  ]);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].title, "Freelance design commission");
});
