export function bytesToBase64(bytes: Uint8Array): string;
export function base64ToBytes(value: string): Uint8Array;
export function encryptBackupPayload(payload: unknown, password: string): Promise<string>;
export function decryptBackupPayload(envelope: Record<string, unknown>, password: string): Promise<unknown>;
