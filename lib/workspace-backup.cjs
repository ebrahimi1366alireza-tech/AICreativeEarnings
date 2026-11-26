"use strict";

/**
 * Validate the wallet fields in a portable workspace backup.
 * Addresses are intentionally chain-agnostic: EVM, Solana, Bitcoin, TON,
 * TRON, and other public address formats must survive export/import unchanged.
 */
function isValidWalletBackup(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  if (typeof value.address !== "string" || typeof value.network !== "string") return false;
  if (value.address.length > 256 || value.network.length > 100) return false;
  if (/[\\s\\u0000-\\u001f\\u007f]/.test(value.address)) return false;
  return true;
}

module.exports = { isValidWalletBackup };
