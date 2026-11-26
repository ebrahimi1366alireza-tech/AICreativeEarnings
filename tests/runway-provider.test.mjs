import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { cleanPrompt, estimateRunwayCost, buildRunwayRequest } = require("../lib/runway-provider.cjs");

test("uses low-cost image generation and quotes its cost", () => {
  const request = buildRunwayRequest("image", "A premium product photograph");
  assert.equal(request.endpoint, "/v1/text_to_image");
  assert.equal(request.body.model, "gen4_image_turbo");
  assert.equal(estimateRunwayCost("image").usd, 0.02);
});

test("uses low-resolution five-second video and quotes its cost", () => {
  const request = buildRunwayRequest("video", "A short cinematic coffee ad");
  assert.equal(request.endpoint, "/v1/text_to_video");
  assert.equal(request.body.model, "seedance2_5_flash");
  assert.equal(request.body.ratio, "480:854");
  assert.equal(request.body.duration, 5);
  assert.equal(estimateRunwayCost("video").usd, 0.65);
});

test("rejects empty prompts and unsupported media types", () => {
  assert.throws(() => buildRunwayRequest("image", " "), /prompt is required/);
  assert.throws(() => estimateRunwayCost("audio"), /unsupported/);
});

test("removes control characters and bounds prompt length", () => {
  assert.equal(cleanPrompt("hello\nworld"), "hello world");
  assert.equal(cleanPrompt("x".repeat(1500)).length, 1000);
});
