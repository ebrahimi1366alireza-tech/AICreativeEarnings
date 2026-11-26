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
