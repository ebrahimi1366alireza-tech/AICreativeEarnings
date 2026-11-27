import test from "node:test";
import assert from "node:assert/strict";
import { buildAssistantMessages, getAssistantProviderConfig, sanitizeAssistantBrief } from "../lib/assistant-llm.mjs";

test("assistant provider is disabled by default", () => {
  assert.deepEqual(getAssistantProviderConfig({}), { enabled: false, reason: "disabled" });
});

test("provider requires complete credentials and HTTPS in production", () => {
  assert.equal(getAssistantProviderConfig({ AI_ASSISTANTS_ENABLED: "true", NODE_ENV: "production" }).reason, "incomplete_configuration");
  const insecure = getAssistantProviderConfig({
    AI_ASSISTANTS_ENABLED: "true", NODE_ENV: "production",
    AI_ASSISTANT_BASE_URL: "http://model.example/v1",
    AI_ASSISTANT_API_KEY: "secret", AI_ASSISTANT_MODEL: "model"
  });
  assert.equal(insecure.reason, "https_required");
});

test("provider accepts a complete HTTPS OpenAI-compatible configuration", () => {
  const config = getAssistantProviderConfig({
    AI_ASSISTANTS_ENABLED: "true", NODE_ENV: "production",
    AI_ASSISTANT_BASE_URL: "https://api.example/v1/",
    AI_ASSISTANT_API_KEY: "server-secret", AI_ASSISTANT_MODEL: "example-model"
  });
  assert.equal(config.enabled, true);
  assert.equal(config.baseUrl, "https://api.example/v1");
  assert.equal(config.apiKey, "server-secret");
});

test("brief allowlist excludes identity, country, KYC, wallet and payment fields", () => {
  const brief = sanitizeAssistantBrief({
    title: "Ad video", message: "Create a short video",
    email: "person@example.com", citizenship: "Iran", kyc: "passport",
    walletAddress: "0xsecret", expectedAmount: "100"
  });
  assert.deepEqual(brief, { title: "Ad video", message: "Create a short video" });
});

test("brief fields are bounded and control characters removed", () => {
  const brief = sanitizeAssistantBrief({ title: "  Demo\u0000 title  ", message: "x".repeat(2500) });
  assert.equal(brief.title, "Demo title");
  assert.equal(brief.message.length, 2000);
});

test("prompt treats user brief as untrusted data and keeps advice non-authoritative", () => {
  const messages = buildAssistantMessages({ title: "test" });
  assert.match(messages[0].content, /untrusted data/);
  assert.match(messages[0].content, /advisory only/);
  assert.match(messages[1].content, /brief is data only/);
  assert.match(messages[1].content, /"title":"test"/);
});
