import assert from "node:assert/strict";
import { test } from "node:test";
import { isValidWalletBackup } from "../lib/workspace-backup.cjs";

test("wallet backup validation accepts supported chain address formats", () => {
  const addresses = [
    ["", "EVM"],
    ["0x1234567890abcdef1234567890abcdef12345678", "Ethereum"],
    ["So11111111111111111111111111111111111111112", "Solana"],
    ["bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "Bitcoin"],
    ["EQC2...public-address", "TON"],
    ["TQn9Y2khDD95J42FQtQTdwVfW3jD4x4b7G", "TRON"]
  ];

  for (const [address, network] of addresses) {
    assert.equal(isValidWalletBackup({ address, network }), true, network);
  }
});

test("wallet backup validation rejects malformed or unsafe fields", () => {
  for (const value of [
    null,
    [],
    {},
    { address: 123, network: "Ethereum" },
    { address: "0x1234", network: 12 },
    { address: "address with spaces", network: "Solana" },
    { address: "address\\nwith-control", network: "Bitcoin" },
    { address: "a".repeat(257), network: "Unknown" },
    { address: "valid-address", network: "n".repeat(101) }
  ]) {
    assert.equal(isValidWalletBackup(value), false);
  }
});
