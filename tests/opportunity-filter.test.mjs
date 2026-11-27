import test from "node:test";
import assert from "node:assert/strict";
import { isDisallowedOpportunity } from "../lib/opportunity-filter.mjs";

test("blocks game-install and game-testing reward tasks", () => {
  assert.equal(isDisallowedOpportunity("Install a mobile game and earn rewards"), true);
  assert.equal(isDisallowedOpportunity("Play games for money"), true);
});

test("blocks fake engagement and manipulation tasks", () => {
  assert.equal(isDisallowedOpportunity("Buy fake followers for a campaign"), true);
  assert.equal(isDisallowedOpportunity("Vote manipulation service"), true);
  assert.equal(isDisallowedOpportunity("Sell fake reviews"), true);
  assert.equal(isDisallowedOpportunity("Fake votes for a contest"), true);
  assert.equal(isDisallowedOpportunity("Paid followers campaign"), true);
});

test("blocks mandatory deposits, subscriptions, and withdrawal unlock fees", () => {
  assert.equal(isDisallowedOpportunity("Pay an upfront deposit before starting"), true);
  assert.equal(isDisallowedOpportunity("Mandatory paid membership required"), true);
  assert.equal(isDisallowedOpportunity("Fee to unlock withdrawals"), true);
});

test("keeps legitimate paid evaluation and music voting tasks eligible for review", () => {
  assert.equal(isDisallowedOpportunity("Paid music voting panel with one verified vote per participant"), false);
  assert.equal(isDisallowedOpportunity("Paid product research and honest usability feedback"), false);
});

test("handles non-string input safely", () => {
  assert.equal(isDisallowedOpportunity(null), false);
});
