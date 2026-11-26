import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { after, before, test } from "node:test";

const host = "http://127.0.0.1:3100";
let server;

before(async () => {
  server = spawn(process.execPath, [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3100"
  ], {
    env: { ...process.env, PORT: "3100", HOSTNAME: "127.0.0.1" },
    stdio: "ignore"
  });

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js server exited before becoming ready (code ${server.exitCode}).`);
    }
    try {
      const response = await fetch(`${host}/api/auth/status`);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  server.kill("SIGTERM");
  throw new Error("Next.js production server did not become ready within 30 seconds.");
});

after(() => {
  if (server && server.exitCode === null) server.kill("SIGTERM");
});

test("dashboard serves the Persian RTL application", async () => {
  const response = await fetch(host);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /text\/html/i);
  const html = await response.text();
  assert.match(html, /AI Creative Earnings/);
  assert.match(html, /اول سفارش معتبر/);
});

test("auth status endpoint returns a safe signed-out state", async () => {
  const response = await fetch(`${host}/api/auth/status`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.connected, false);
  assert.equal(body.profile, null);
  assert.equal(typeof body.emailAuthConfigured, "boolean");
});

test("legacy workspace endpoint rejects unauthenticated access", async () => {
  const response = await fetch(`${host}/api/workspace`);
  assert.equal(response.status, 401);
  const body = await response.json();
  assert.equal(typeof body.error, "string");
});

test("cloud workspace sync endpoint rejects unauthenticated access", async () => {
  const response = await fetch(`${host}/api/workspace/sync`);
  assert.equal(response.status, 401);
  const body = await response.json();
  assert.equal(typeof body.error, "string");
});

test("opportunity discovery returns a valid live-feed contract", async () => {
  const response = await fetch(`${host}/api/opportunities/discover`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000)
  });
  const body = await response.json();
  assert.ok(response.status === 200 || response.status === 502);

  if (response.status === 502) {
    assert.equal(typeof body.error, "string");
    assert.ok(Array.isArray(body.jobs));
    assert.equal(body.jobs.length, 0);
    assert.ok(Array.isArray(body.warnings));
    assert.ok(body.warnings.length >= 2);
    return;
  }

  assert.deepEqual(body.source, ["LaborX", "Subnano"]);
  assert.ok(Number.isFinite(Date.parse(body.fetchedAt)));
  assert.ok(Array.isArray(body.jobs));
  assert.equal(body.count, body.jobs.length);
  assert.ok(Array.isArray(body.warnings));
  assert.equal(typeof body.notice, "string");

  const seen = new Set();
  for (const job of body.jobs) {
    assert.equal(typeof job.id, "string");
    assert.equal(typeof job.title, "string");
    assert.ok(job.title.length > 0);
    assert.ok(["LaborX · کانال رسمی فرصت‌ها", "Subnano · درخواست عمومی"].includes(job.source));
    assert.ok(["freelance", "request"].includes(job.sourceType));
    assert.ok(["ویدئو", "عکس و طراحی", "نوشتن و مقاله", "تولید آهنگ با هوش مصنوعی"].includes(job.stream));
    assert.ok(Number.isFinite(job.score) && job.score >= 0 && job.score <= 100);
    assert.equal(typeof job.salary, "string");
    assert.equal(typeof job.description, "string");
    assert.ok(job.postedAt === null || Number.isFinite(Date.parse(job.postedAt)));
    const url = new URL(job.url);
    assert.equal(url.protocol, "https:");
    assert.ok(["laborx.com", "subnano.ai"].includes(url.hostname));
    assert.ok(!seen.has(job.url), `Duplicate opportunity URL: ${job.url}`);
    seen.add(job.url);
  }
});

test("creative generation status requires an authenticated account", async () => {
  const response = await fetch(`${host}/api/creative/status`);
  assert.equal(response.status, 401);
  const body = await response.json();
  assert.equal(typeof body.error, "string");
});

test("creative generation endpoint rejects unauthenticated requests before provider use", async () => {
  const response = await fetch(`${host}/api/creative/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "image", prompt: "test prompt", confirmed: true })
  });
  assert.equal(response.status, 401);
});

test("creative task polling requires an authenticated account", async () => {
  const response = await fetch(`${host}/api/creative/tasks/550e8400-e29b-41d4-a716-446655440000`);
  assert.equal(response.status, 401);
});
