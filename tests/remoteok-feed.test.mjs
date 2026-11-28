import test from "node:test";
import assert from "node:assert/strict";
import { normalizeRemoteOkJobs } from "../lib/remoteok-feed.mjs";

const job = (overrides = {}) => ({
  id: "12345",
  slug: "remote-graphic-designer-example-12345",
  position: "Graphic Designer",
  company: "Example Studio",
  location: "Worldwide",
  tags: ["design", "contract"],
  description: "Create product graphics, campaign visuals, and social media assets.",
  salary_min: 60000,
  salary_max: 80000,
  date: "2026-11-27T09:00:00Z",
  original: true,
  ...overrides
});

test("normalizes a creative Remote OK listing with attribution and salary", () => {
  const [result] = normalizeRemoteOkJobs([{ legal: "API terms" }, job()]);
  assert.equal(result.stream, "عکس و طراحی");
  assert.equal(result.sourceType, "freelance");
  assert.equal(result.contractType, true);
  assert.equal(result.company, "Example Studio");
  assert.match(result.salary, /60,000-80,000/);
  assert.equal(result.url, "https://remoteok.com/remote-jobs/remote-graphic-designer-example-12345");
  assert.equal(result.source, "Remote OK · فید عمومی فرصت‌های دورکار");
});

test("keeps employment roles distinct from contract roles", () => {
  const [result] = normalizeRemoteOkJobs([job({ position: "Video Editor", tags: ["video", "full-time"] })]);
  assert.equal(result.stream, "ویدئو");
  assert.equal(result.sourceType, "employment");
  assert.equal(result.contractType, false);
});

test("ignores unrelated, duplicate, and prohibited game-install listings", () => {
  assert.deepEqual(normalizeRemoteOkJobs([
    job({ position: "Account Manager", description: "Manage client accounts and sales." }),
    job({ original: false }),
    job({ position: "Install mobile game and earn", description: "Game testing." })
  ]), []);
});

test("rejects unsafe slugs and handles malformed payloads", () => {
  assert.deepEqual(normalizeRemoteOkJobs(null), []);
  assert.deepEqual(normalizeRemoteOkJobs({ jobs: [job()] }), []);
  assert.deepEqual(normalizeRemoteOkJobs([job({ slug: "https://evil.example/x" })]), []);
});
