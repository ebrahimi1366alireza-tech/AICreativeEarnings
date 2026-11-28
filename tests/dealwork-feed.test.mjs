import test from "node:test";
import assert from "node:assert/strict";
import { normalizeDealworkJobs } from "../lib/dealwork-feed.mjs";

const base = {
  id: "12345678-1234-1234-1234-123456789abc",
  title: "Short-form video editing for product launch",
  description: "Create three short promotional videos from supplied footage.",
  category: "video",
  tags: ["video editing", "creative"],
  status: "posted",
  visibility: "public",
  eligibleWorkerTypes: "any",
  jobMode: "bidding",
  fixedPrice: "150.0000",
  createdAt: "2026-11-28T00:00:00.000Z",
  deadline: "2026-12-10T00:00:00.000Z",
  posterDisplayName: "Example Client",
  posterFunded: false
};

test("normalizes a public creative job and labels unconfirmed escrow", () => {
  const [job] = normalizeDealworkJobs({ data: [base] });
  assert.equal(job.title, base.title);
  assert.equal(job.stream, "ویدئو");
  assert.equal(job.url, "https://api.dealwork.ai/explore/" + base.id);
  assert.match(job.paymentNote, /تأمین وجه escrow.*تأیید نشده/);
  assert.match(job.actionNote, /KYC/);
});

test("funded flag changes note but still requires contract-level verification", () => {
  const [job] = normalizeDealworkJobs({ data: [{ ...base, posterFunded: true }] });
  assert.match(job.paymentNote, /دوباره بررسی کن/);
});

test("ignores private, closed, and AI-only jobs", () => {
  const rows = [
    { ...base, visibility: "private" },
    { ...base, status: "completed" },
    { ...base, eligibleWorkerTypes: "ai_only" }
  ];
  assert.deepEqual(normalizeDealworkJobs({ data: rows }), []);
});

test("excludes game-install and upfront-deposit offers", () => {
  const rows = [
    { ...base, title: "Install this mobile game and earn" },
    { ...base, description: "A mandatory deposit is required before you start." }
  ];
  assert.deepEqual(normalizeDealworkJobs({ data: rows }), []);
});

test("ignores unrelated listings and malformed identifiers", () => {
  const rows = [
    { ...base, title: "Weekly subscription service for market data", description: "Buy a subscription." },
    { ...base, id: "not-a-uuid" }
  ];
  assert.deepEqual(normalizeDealworkJobs({ data: rows }), []);
});

test("accepts bidding status and safely handles missing dates and budget", () => {
  const [job] = normalizeDealworkJobs({ data: [{ ...base, status: "bidding", deadline: "invalid", createdAt: null, fixedPrice: null, budgetMax: null }] });
  assert.equal(job.postedAt, null);
  assert.equal(job.salary, "بودجه مشخص نشده");
  assert.match(job.actionNote, /مشخص نشده/);
});


test("excludes provider advertisements that are selling services rather than hiring workers", () => {
  const rows = [
    { ...base, title: "AI research briefs and technical writing", description: "This is my offer, not a task I am hiring for. I am an autonomous AI agent. I deliver sourced research briefs." },
    { ...base, title: "SERVICE OFFER — content writing", description: "What I sell: writing and research services. Place a bid at my tier price." },
    { ...base, title: "Research and data service", description: "I am posting it here because this board is where buyers browse. Send me a topic and I will deliver a report." }
  ];
  assert.deepEqual(normalizeDealworkJobs({ data: rows }), []);
});


test("excludes AI-agent posters even when their listing looks like a normal creative job", () => {
  const rows = [
    { ...base, posterType: "ai_agent", title: "Creative video editing", description: "I create short promotional videos for your product." },
    { ...base, posterType: "ai_agent", title: "Graphic design", description: "Design banners and product images." }
  ];
  assert.deepEqual(normalizeDealworkJobs({ data: rows }), []);
});


test("keeps AI-agent posts that explicitly hire a human worker", () => {
  const [job] = normalizeDealworkJobs({ data: [{
    ...base,
    posterType: "ai_agent",
    title: "Human reviewer needed for Persian video subtitles",
    description: "I need a human worker to review Persian subtitles and report timing and translation errors."
  }] });
  assert.equal(job.title, "Human reviewer needed for Persian video subtitles");
});
