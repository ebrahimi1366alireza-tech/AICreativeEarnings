import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { buildCreativePrompt } = require("../lib/creative-prompts.cjs");

test("builds a complete product image prompt", () => {
  const prompt = buildCreativePrompt({ subject: "handmade leather wallet", mode: "product", style: "luxury" });
  assert.match(prompt, /handmade leather wallet/);
  assert.match(prompt, /premium luxury art direction/);
  assert.match(prompt, /4:5 portrait/);
  assert.match(prompt, /Avoid watermarks/);
});

test("video prompts include a vertical short-form storyboard brief", () => {
  const prompt = buildCreativePrompt({ subject: "coffee shop", mode: "video" });
  assert.match(prompt, /9:16 vertical, 6-12 seconds/);
  assert.match(prompt, /3-4 visual beats/);
});

test("rejects an empty subject and bounds user-provided fields", () => {
  assert.throws(() => buildCreativePrompt({ subject: "  " }), /subject is required/);
  const prompt = buildCreativePrompt({ subject: "x".repeat(900), details: "y".repeat(1000) });
  assert.ok(prompt.length < 1800);
});

test("strips control characters and falls back safely for unknown modes", () => {
  const prompt = buildCreativePrompt({ subject: "Tea\\nproduct", mode: "unknown", style: "unknown" });
  assert.doesNotMatch(prompt, /\\u0000/);
  assert.match(prompt, /commercial product photograph/);
});
