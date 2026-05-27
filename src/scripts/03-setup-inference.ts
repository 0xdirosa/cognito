/**
 * 03-setup-inference.ts — Prepares the inference environment for Cognito.
 * Validates balances, configures the mock inference provider, and verifies
 * that both wallets are ready for the agent execution loop.
 *
 * Prerequisites: run 01 + 02 first. Owner wallet must be funded.
 */

import { getUsdcBalance, formatUsdc, printBalances, toUsdcMicro } from "../lib/helpers.js";
import { INFERENCE_PRICE_USDC, INFERENCE_COUNT } from "../config/constants.js";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 3: Setup Inference");
  console.log("═══════════════════════════════════════════\n");

  const ownerId = process.env.OWNER_WALLET_ID;
  const ownerAddress = process.env.OWNER_WALLET_ADDRESS;
  const validatorId = process.env.VALIDATOR_WALLET_ID;
  const validatorAddress = process.env.VALIDATOR_WALLET_ADDRESS;
  const agentId = process.env.AGENT_ID;

  if (!ownerId || !ownerAddress || !validatorId || !validatorAddress || !agentId) {
    throw new Error(
      "Missing environment variables. Run 01-create-wallets.ts and 02-register-agent.ts first.",
    );
  }

  const ownerBalance = await getUsdcBalance(ownerId);
  const validatorBalance = await getUsdcBalance(validatorId);

  console.log("── Wallet Status ──");
  console.log(`  Owner (Agent):     ${ownerAddress}`);
  console.log(`  Validator (Prov):  ${validatorAddress}`);
  console.log(`  Agent ID:          ${agentId}\n`);

  await printBalances([
    { label: "Owner", id: ownerId, address: ownerAddress },
    { label: "Validator", id: validatorId, address: validatorAddress },
  ]);

  // Calculate required balance — use BigInt to avoid floating point errors
  const priceMicro = toUsdcMicro(INFERENCE_PRICE_USDC);
  const totalCostMicro = priceMicro * BigInt(INFERENCE_COUNT);
  const bufferMicro = BigInt("10000"); // 0.01 USDC gas buffer
  const minRequiredMicro = totalCostMicro + bufferMicro;

  const ownerBalanceMicro = toUsdcMicro(ownerBalance);
  const sufficient = ownerBalanceMicro >= minRequiredMicro;

  console.log(`\n── Inference Plan ──`);
  console.log(`  Price per inference:  ${INFERENCE_PRICE_USDC} USDC`);
  console.log(`  Inference count:      ${INFERENCE_COUNT}`);
  console.log(`  Total inference cost: ${Number(totalCostMicro) / 1_000_000} USDC`);
  console.log(`  Recommended buffer:   ${Number(bufferMicro) / 1_000_000} USDC`);
  console.log(`  Minimum required:     ${Number(minRequiredMicro) / 1_000_000} USDC`);

  console.log(`\n  Owner balance:        ${Number(ownerBalanceMicro) / 1_000_000} USDC → ${sufficient ? "✓ SUFFICIENT" : "✗ INSUFFICIENT"}`);

  if (!sufficient) {
    console.log(`\n  ⚠️  Owner wallet needs at least ${Number(minRequiredMicro) / 1_000_000} USDC.`);
    console.log(`  Fund via: https://faucet.circle.com`);
    console.log(`  Address:  ${ownerAddress}\n`);
    throw new Error("Insufficient balance for inference loop.");
  }

  console.log(`\n── Mock Inference Provider ──`);
  console.log(`  Model:         cognito-mock-v1`);
  console.log(`  Provider:      Validator wallet (${validatorAddress})`);
  console.log(`  Payment token: USDC (Arc Testnet)`);
  console.log(`  Payment addr:  ${validatorAddress}`);
  console.log(`  Flow: query → pay → receive response → repeat`);

  console.log(`\n── Step 3 Complete ──`);
  console.log("  Inference environment ready.");
  console.log("  Ready for: npm run run-agent\n");
}

main().catch((error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
