import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { decryptBackupPayload, encryptBackupPayload } from "../lib/backup-crypto.mjs";

Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });

const sample = {
  app: "AI Creative Earnings",
  schemaVersion: 1,
  opportunities: [{ id: "one", title: "Test", status: "open" }],
  kycRecords: [{ id: "laborx", platform: "LaborX", iranianPassport: "unknown" }],
  kycCitizenship: "IR"
};

test("encrypted backup round-trips without exposing plaintext", async () => {
  const file = await encryptBackupPayload(sample, "a-strong-test-password");
  const envelope = JSON.parse(file);
  assert.equal(envelope.version, 2);
  assert.equal(envelope.cipher, "AES-256-GCM");
  assert.equal(file.includes("laborx"), false);
  assert.deepEqual(await decryptBackupPayload(envelope, "a-strong-test-password"), sample);
});

test("wrong password is rejected", async () => {
  const envelope = JSON.parse(await encryptBackupPayload(sample, "a-strong-test-password"));
  await assert.rejects(() => decryptBackupPayload(envelope, "wrong-password"));
});

test("tampered ciphertext is rejected", async () => {
  const envelope = JSON.parse(await encryptBackupPayload(sample, "a-strong-test-password"));
  const bytes = Uint8Array.from(atob(envelope.ciphertext), c => c.charCodeAt(0));
  bytes[0] ^= 1;
  envelope.ciphertext = btoa(String.fromCharCode(...bytes));
  await assert.rejects(() => decryptBackupPayload(envelope, "a-strong-test-password"));
});

test("invalid envelope parameters are rejected", async () => {
  await assert.rejects(() => decryptBackupPayload({ format: "wrong", version: 2 }, "password"));
});
