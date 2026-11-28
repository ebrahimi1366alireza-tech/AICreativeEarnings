import test from "node:test";
import assert from "node:assert/strict";
import { getOpportunitySourceSummary, OPPORTUNITY_SOURCES } from "../lib/opportunity-sources.mjs";

test("keeps all 27 reviewed platforms in the source registry", () => {
  assert.equal(OPPORTUNITY_SOURCES.length, 27);
  assert.equal(new Set(OPPORTUNITY_SOURCES.map((source) => source.name)).size, 26);
});

test("marks the six implemented public feeds as connected live sources", () => {
  const summary = getOpportunitySourceSummary();
  assert.equal(summary.connected, 6);
  assert.deepEqual(
    summary.sources.filter((source) => source.status === "connected").map((source) => source.name).sort(),
    ["Dealwork AI", "Himalayas", "LaborX", "Remotive", "Subnano", "Superteam Earn"]
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


test("marks Dealwork AI public read-only jobs API as connected", () => {
  const dealwork = OPPORTUNITY_SOURCES.find((source) => source.name === "Dealwork AI");
  assert.equal(dealwork?.status, "connected");
  assert.equal(dealwork?.integration, "public_jobs_api");
  assert.match(dealwork?.note || "", /برداشت رمزارزی/);
});

test("marks Remotive public remote jobs API as connected with attribution and conservative cache", () => {
  const remotive = OPPORTUNITY_SOURCES.find((source) => source.name === "Remotive");
  assert.equal(remotive?.status, "connected");
  assert.equal(remotive?.integration, "public_jobs_api");
  assert.match(remotive?.note || "", /شش‌ساعته/);
  assert.match(remotive?.note || "", /لینک اصلی/);
});


test("marks Himalayas public jobs API as a connected source with human review for country and payout", () => {
  const himalayas = OPPORTUNITY_SOURCES.find((source) => source.name === "Himalayas");
  assert.equal(himalayas?.status, "connected");
  assert.equal(himalayas?.integration, "public_jobs_api");
  assert.match(himalayas?.note || "", /شش‌ساعته/);
  assert.match(himalayas?.note || "", /محدودیت کشور/);
});
