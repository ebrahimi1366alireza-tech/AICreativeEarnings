import test from "node:test";
import assert from "node:assert/strict";
import { normalizeRemotiveJobs } from "../lib/remotive-feed.mjs";

const job = (overrides = {}) => ({
  id: 123, url: "https://remotive.com/remote-jobs/design/creative-designer-123",
  title: "Creative Video Editor", company_name: "Example Studio", category: "Design",
  job_type: "contract", publication_date: "2026-11-27T10:00:00",
  candidate_required_location: "Worldwide", salary: "$20-$35 per hour",
  description: "<p>Edit short-form video campaigns.</p>", ...overrides
});

test("normalizes a valid creative remote job and attributes Remotive", () => {
  const [result] = normalizeRemotiveJobs({ jobs: [job()] });
  assert.equal(result.source, "Remotive · فید رسمی فرصت‌های دورکاری");
  assert.equal(result.stream, "ویدئو");
  assert.equal(result.sourceType, "freelance");
  assert.equal(result.contractType, true);
  assert.equal(result.location, "Worldwide");
  assert.match(result.actionNote, /۲۴ ساعت/);
  assert.equal(result.url, job().url);
});

test("keeps full-time creative roles distinct from freelance contracts", () => {
  const [result] = normalizeRemotiveJobs({ jobs: [job({ job_type: "full_time", title: "Graphic Designer" })] });
  assert.equal(result.stream, "عکس و طراحی");
  assert.equal(result.sourceType, "employment");
  assert.equal(result.contractType, false);
});

test("ignores unrelated jobs and prohibited game-install offers", () => {
  assert.deepEqual(normalizeRemotiveJobs({ jobs: [
    job({ title: "Senior Backend Engineer", description: "Build APIs" }),
    job({ title: "Install mobile game and earn", description: "Game testing" })
  ] }), []);
});

test("rejects non-Remotive and unsafe URLs", () => {
  assert.deepEqual(normalizeRemotiveJobs({ jobs: [
    job({ url: "http://remotive.com/remote-jobs/design/x" }),
    job({ url: "https://evil.example/remote-jobs/design/x" }),
    job({ url: "https://remotive.com.evil.example/remote-jobs/design/x" }),
    job({ url: "https://remotive.com/jobs/x" })
  ] }), []);
});

test("handles malformed API payloads without throwing", () => {
  assert.deepEqual(normalizeRemotiveJobs(null), []);
  assert.deepEqual(normalizeRemotiveJobs({ jobs: "not-an-array" }), []);
  assert.deepEqual(normalizeRemotiveJobs({ jobs: [null, {}, job({ id: null })] }), []);
});
