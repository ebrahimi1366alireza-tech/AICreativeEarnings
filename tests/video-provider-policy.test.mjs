import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { listVideoProviders, getVideoProvider, canInvokeVideoProvider } = require("../lib/video-provider-policy.cjs");

test("lists free-first manual video tools without claiming a guaranteed free quota", () => {
  const providers = listVideoProviders();
  assert.ok(providers.some(item => item.id === "dreamina" && item.mode === "manual_web"));
  assert.ok(providers.some(item => item.id === "krea" && item.mode === "manual_web"));
  assert.ok(providers.some(item => item.id === "comfyui_wan" && item.mode === "self_hosted_open_source"));
  assert.ok(providers.every(item => item.apiEnabled === false));
  assert.ok(providers.filter(item => item.mode === "manual_web").every(item => item.freeQuota === "account_dependent"));
});

test("keeps Runway paid API disabled even when a caller passes budget approval", () => {
  assert.equal(getVideoProvider("runway_dev").mode, "paid_api_disabled");
  assert.equal(canInvokeVideoProvider("runway_dev", true), false);
});

test("does not invoke any provider API in this release", () => {
  for (const provider of listVideoProviders()) assert.equal(canInvokeVideoProvider(provider.id, true), false);
  assert.equal(getVideoProvider("unknown-provider"), null);
});
