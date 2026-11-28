import test from "node:test";
import assert from "node:assert/strict";
import { normalizeHimalayasJobs } from "../lib/himalayas-feed.mjs";

const job = (overrides = {}) => ({
  title: "Graphic Designer",
  excerpt: "Create visual assets and social media graphics for remote campaigns.",
  description: "Design brand graphics, product images, and campaign visuals.",
  companyName: "Example Studio",
  employmentType: "Contract",
  minSalary: 25,
  maxSalary: 40,
  salaryPeriod: "hourly",
  currency: "USD",
  locationRestrictions: ["Worldwide", "Europe"],
  pubDate: 1795856105,
  guid: "https://himalayas.app/companies/example/jobs/graphic-designer",
  applicationLink: "https://himalayas.app/companies/example/jobs/graphic-designer?utm_source=api",
  categories: ["Design", "Graphic-Design"],
  ...overrides
});

test("normalizes a creative Himalayas job and preserves the original listing", () => {
  const [result] = normalizeHimalayasJobs({ jobs: [job()] });
  assert.equal(result.stream, "عکس و طراحی");
  assert.equal(result.sourceType, "freelance");
  assert.equal(result.contractType, true);
  assert.equal(result.location, "Worldwide, Europe");
  assert.match(result.salary, /25-40 USD \/ hourly/);
  assert.equal(result.url, job().guid);
  assert.equal(result.source, "Himalayas · فید عمومی مشاغل دورکار");
});

test("keeps full-time creative roles distinct from freelance contracts", () => {
  const [result] = normalizeHimalayasJobs({ jobs: [job({ employmentType: "Full Time", title: "Video Editor" })] });
  assert.equal(result.stream, "ویدئو");
  assert.equal(result.sourceType, "employment");
  assert.equal(result.contractType, false);
});

test("ignores unrelated and prohibited game-install listings", () => {
  assert.deepEqual(normalizeHimalayasJobs({ jobs: [
    job({ title: "Sales Representative", description: "Close sales and manage pipeline.", categories: ["Sales"] }),
    job({ title: "Install mobile game and earn", description: "Game testing tasks." })
  ] }), []);
});

test("rejects external or malformed listing URLs", () => {
  assert.deepEqual(normalizeHimalayasJobs({ jobs: [
    job({ guid: "https://evil.example/companies/example/jobs/x" }),
    job({ guid: "http://himalayas.app/companies/example/jobs/x" }),
    job({ guid: "https://himalayas.app/jobs/x" })
  ] }), []);
});

test("handles malformed payloads and missing salary safely", () => {
  assert.deepEqual(normalizeHimalayasJobs(null), []);
  assert.deepEqual(normalizeHimalayasJobs({ jobs: "invalid" }), []);
  const [result] = normalizeHimalayasJobs({ jobs: [job({ minSalary: null, maxSalary: null, currency: null })] });
  assert.equal(result.salary, "حقوق در آگهی مشخص نشده");
});
