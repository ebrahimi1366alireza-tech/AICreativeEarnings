import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSuperteamListings } from "../lib/superteam-feed.mjs";

test("normalizes open creative Superteam listings with token and deadline", () => {
  const jobs = normalizeSuperteamListings([{
    id: "abc", status: "OPEN", title: "Write an Article on Fundraising Opportunities",
    slug: "write-an-article-on-fundraising-opportunities", rewardAmount: 500, token: "USDG",
    deadline: "2026-11-30T21:59:59.000Z", type: "bounty", compensationType: "fixed",
    sponsor: { name: "Superteam Ukraine" }
  }]);
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].stream, "نوشتن و مقاله");
  assert.equal(jobs[0].salary, "500 USDG");
  assert.equal(jobs[0].url, "https://superteam.fun/earn/listing/write-an-article-on-fundraising-opportunities");
  assert.equal(jobs[0].sourceType, "request");
});

test("keeps video and design listings but excludes unrelated and unsafe tasks", () => {
  const jobs = normalizeSuperteamListings([
    { status: "OPEN", title: "Create a short video animation", slug: "short-video-animation", token: "USDC" },
    { status: "OPEN", title: "Graphic design for product photos", slug: "product-photo-design", token: "SOL" },
    { status: "OPEN", title: "Install this mobile game to earn", slug: "install-game", token: "USDC" },
    { status: "OPEN", title: "Build a blockchain protocol", slug: "build-protocol", token: "USDC" }
  ]);
  assert.deepEqual(jobs.map((job) => job.stream), ["ویدئو", "عکس و طراحی"]);
});

test("ignores closed, awarded, and malformed listings", () => {
  const jobs = normalizeSuperteamListings([
    { status: "CLOSED", title: "Write an article", slug: "closed-writing" },
    { status: "OPEN", isWinnersAnnounced: true, title: "Write an article", slug: "awarded-writing" },
    { status: "OPEN", title: "Write an article", slug: "../unsafe" }
  ]);
  assert.equal(jobs.length, 0);
});

test("accepts an items wrapper and does not assume missing payout details", () => {
  const jobs = normalizeSuperteamListings({ items: [{
    status: "OPEN", title: "Create a video editing tutorial", slug: "video-editing-tutorial", type: "project"
  }] });
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].salary, "پاداش در فید مشخص نشده");
  assert.equal(jobs[0].sourceType, "freelance");
});
