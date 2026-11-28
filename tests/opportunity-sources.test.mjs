import test from "node:test";
import assert from "node:assert/strict";
import { getOpportunitySourceSummary, OPPORTUNITY_SOURCES } from "../lib/opportunity-sources.mjs";

test("keeps all 25 reviewed platforms in the source registry", () => {
  assert.equal(OPPORTUNITY_SOURCES.length, 25);
  assert.equal(new Set(OPPORTUNITY_SOURCES.map((source) => source.name)).size, 25);
});

test("marks the three implemented public feeds as connected live sources", () => {
  const summary = getOpportunitySourceSummary();
  assert.equal(summary.connected, 3);
  assert.deepEqual(
    summary.sources.filter((source) => source.status === "connected").map((source) => source.name).sort(),
    ["LaborX", "Subnano", "Superteam Earn"]
  );
});

test("keeps the known restricted platform distinct from unconnected sources", () => {
  const worqen = OPPORTUNITY_SOURCES.find((source) => source.name === "Worqen");
  assert.equal(worqen?.status, "restricted");
  assert.equal(getOpportunitySourceSummary().restricted, 1);
});

test("every registry entry has a valid HTTPS source link and explicit state", () => {
  for (const source of OPPORTUNITY_SOURCES) {
    assert.equal(new URL(source.url).protocol, "https:");
    assert.ok(["connected", "catalog_only", "restricted"].includes(source.status));
    assert.ok(source.integration);
  }
});


test("keeps Dealwork AI review-only until human payout eligibility is verified", () => {
  const dealwork = OPPORTUNITY_SOURCES.find((source) => source.name === "Dealwork AI");
  assert.equal(dealwork?.status, "catalog_only");
  assert.equal(dealwork?.integration, "public_board_not_connected");
  assert.match(dealwork?.note || "", /برداشت رمزارزی/);
});
