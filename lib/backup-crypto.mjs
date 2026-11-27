export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}
export function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}
export async function encryptBackupPayload(payload: unknown, password: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error("secure-context-required");
  const encoder = new TextEncoder();
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const material = await globalThis.crypto.subtle.importKey("raw", new Uint8Array(encoder.encode(password)).buffer, "PBKDF2", false, ["deriveKey"]);
  const key = await globalThis.crypto.subtle.deriveKey({ name: "PBKDF2", salt: new Uint8Array(salt).buffer, iterations: 310000, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const ciphertext = await globalThis.crypto.subtle.encrypt({ name: "AES-GCM", iv: new Uint8Array(iv).buffer }, key, new Uint8Array(encoder.encode(JSON.stringify(payload))).buffer);
  return JSON.stringify({ format: "ai-creative-earnings-backup", version: 2, kdf: "PBKDF2-SHA256", iterations: 310000, cipher: "AES-256-GCM", salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(ciphertext)) }, null, 2);
}
export async function decryptBackupPayload(envelope: Record<string, unknown>, password: string): Promise<unknown> {
  if (!globalThis.crypto?.subtle || envelope.format !== "ai-creative-earnings-backup" || envelope.version !== 2 || envelope.kdf !== "PBKDF2-SHA256" || envelope.cipher !== "AES-256-GCM" || envelope.iterations !== 310000 || typeof envelope.salt !== "string" || typeof envelope.iv !== "string" || typeof envelope.ciphertext !== "string") throw new Error("invalid-envelope");
  const salt = base64ToBytes(envelope.salt);
  const iv = base64ToBytes(envelope.iv);
  if (salt.length !== 16 || iv.length !== 12) throw new Error("invalid-envelope");
  const material = await globalThis.crypto.subtle.importKey("raw", new Uint8Array(new TextEncoder().encode(password)).buffer, "PBKDF2", false, ["deriveKey"]);
  const key = await globalThis.crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 310000, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const plaintext = await globalThis.crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv).buffer }, key, new Uint8Array(base64ToBytes(envelope.ciphertext)).buffer);
  return JSON.parse(new TextDecoder().decode(plaintext)) as unknown;
}
