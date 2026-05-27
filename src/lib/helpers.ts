/**
 * helpers.ts — Shared utility functions: transaction polling, balance checks,
 * metadata URI encoding, and formatting.
 */

import { circleClient } from "./circle-client.js";
import {
  TX_POLL_MAX_ATTEMPTS,
  TX_POLL_INTERVAL_MS,
  ARC_EXPLORER,
} from "../config/constants.js";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// -- Circle SDK type workarounds -------------------------------------------
// The SDK's TS types are overly strict (TokenInfo union, missing blockchain
// field). These shallow wrappers assert the runtime shape the API accepts.

export interface ContractExecInput {
  walletId: string;
  contractAddress: string;
  abiFunctionSignature: string;
  abiParameters: any[];
  fee?: { type: "level"; config: { feeLevel: "MEDIUM" } };
}

export interface TransferInput {
  walletId: string;
  tokenAddress: string;
  blockchain: string;
  destinationAddress: string;
  amount: string[];
  fee?: { type: "level"; config: { feeLevel: "MEDIUM" } };
}

export async function executeContractCall(input: ContractExecInput) {
  return circleClient.createContractExecutionTransaction({
    ...input,
    fee: input.fee ?? { type: "level", config: { feeLevel: "MEDIUM" } },
  } as any);
}

export async function executeTransferCall(input: TransferInput) {
  return circleClient.createTransaction({
    ...input,
    fee: input.fee ?? { type: "level", config: { feeLevel: "MEDIUM" } },
  } as any);
}

/**
 * Poll for Circle transaction completion. Returns txHash on success.
 */
export async function waitForTransaction(
  txId: string,
  label: string,
): Promise<string> {
  process.stdout.write(`  Waiting for ${label}`);
  for (let i = 0; i < TX_POLL_MAX_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, TX_POLL_INTERVAL_MS));
    const { data } = await circleClient.getTransaction({ id: txId });
    if (data?.transaction?.state === "COMPLETE" && data.transaction.txHash) {
      const txHash = data.transaction.txHash!;
      console.log(` ✓\n  Tx: ${ARC_EXPLORER}/tx/${txHash}`);
      return txHash;
    }
    if (data?.transaction?.state === "FAILED") {
      throw new Error(`${label} failed onchain`);
    }
    process.stdout.write(".");
  }
  throw new Error(`${label} timed out after ${TX_POLL_MAX_ATTEMPTS} attempts`);
}

/**
 * Get USDC balance for a Circle wallet by ID.
 * Prefers the ERC-20 (non-native) USDC token with 6 decimals.
 */
export async function getUsdcBalance(walletId: string): Promise<string> {
  const balances = await circleClient.getWalletTokenBalance({ id: walletId });
  const usdc = balances.data?.tokenBalances?.find(
    (b) => b.token?.symbol === "USDC" && !b.token?.isNative,
  );
  return usdc?.amount ?? "0";
}

const MICRO = 1_000_000n;

/**
 * Convert USDC display amount string to BigInt microseconds.
 * E.g., "20" → 20000000n, "0.001" → 1000n.
 * Uses string splitting to avoid IEEE 754 floating point errors.
 */
export function toUsdcMicro(amount: string): bigint {
  const [intPart = "0", fracPart = "0"] = amount.split(".");
  const paddedFrac = fracPart.padEnd(6, "0").slice(0, 6);
  return BigInt(intPart) * MICRO + BigInt(paddedFrac);
}

/**
 * Circle API returns USDC amount in display format (e.g., "20" = 20 USDC).
 * Format to 6 decimal places for consistent display.
 */
export function formatUsdc(amount: string): string {
  return Number(amount).toFixed(6);
}

/**
 * Print USDC balances for multiple wallets.
 */
export async function printBalances(
  wallets: Array<{ label: string; id: string; address: string }>,
): Promise<void> {
  console.log("\n  Balances:");
  for (const w of wallets) {
    const raw = await getUsdcBalance(w.id);
    console.log(`    ${w.label}: ${formatUsdc(raw)} USDC (${w.address})`);
  }
}

/**
 * Encode agent metadata JSON file to a base64 data URI for ERC-8004 registration.
 */
export function encodeMetadataURI(metadataPath?: string): string {
  const path =
    metadataPath ?? resolve(__dirname, "..", "metadata", "agent-metadata.json");
  const raw = readFileSync(path, "utf-8");
  const json = JSON.stringify(JSON.parse(raw)); // normalize
  return `data:application/json;base64,${Buffer.from(json).toString("base64")}`;
}

/**
 * Update a key=value pair in the .env file.
 */
export function updateEnvFile(
  key: string,
  value: string,
  envPath?: string,
): void {
  const path = envPath ?? resolve(__dirname, "..", "..", ".env");
  let content = readFileSync(path, "utf-8");
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}`;
  }
  writeFileSync(path, content);
}
