/**
 * 08-streaming-inference.ts — Streaming nanopayment inference for Cognito.
 * While the agent calls Groq for inference, it simultaneously streams
 * USDC micro-payments to the provider every second.
 *
 * Prerequisites: GROQ_API_KEY in .env, wallets funded, agent registered.
 */

import {
  ARC_EXPLORER,
  STREAMING_RATE_USDC,
} from "../config/constants.js";
import {
  getUsdcBalance,
  formatUsdc,
} from "../lib/helpers.js";
import { callInference } from "../lib/inference-client.js";
import { streamPayment } from "../lib/streaming-payment.js";
import { checkBudget } from "../lib/budget-manager.js";
import { sendWebhook } from "../lib/webhook.js";

const PROMPT = "As Cognito, an on-chain AI agent with ERC-8004 identity, " +
  "explain how streaming micropayments work while you're generating this response. " +
  "Describe what happens every second, and why this model is revolutionary for AI agents.";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 8: Streaming Inference");
  console.log("═══════════════════════════════════════════\n");

  const ownerId = process.env.OWNER_WALLET_ID;
  const ownerAddress = process.env.OWNER_WALLET_ADDRESS;
  const validatorAddress = process.env.VALIDATOR_WALLET_ADDRESS;
  const agentId = process.env.AGENT_ID;

  if (!ownerId || !ownerAddress || !validatorAddress || !agentId) {
    throw new Error("Missing env vars. Run scripts 01-03 first.");
  }

  const balanceBefore = await getUsdcBalance(ownerId);
  console.log(`  Agent ID:          ${agentId}`);
  console.log(`  Balance:           ${formatUsdc(balanceBefore)} USDC`);
  console.log(`  Stream rate:       ${STREAMING_RATE_USDC} USDC/sec`);
  console.log(`  Prompt:            "${PROMPT.slice(0, 80)}..."\n`);

  await sendWebhook("AGENT_STARTED", { script: "streaming-inference", model: "auto" });

  const ac = new AbortController();

  // Start streaming in background — do NOT await yet
  const streamPromise = streamPayment({
    walletId: ownerId,
    providerAddress: validatorAddress,
    ratePerSecond: STREAMING_RATE_USDC,
    signal: ac.signal,
  });

  // Run inference — wait for it to complete
  console.log("── Running inference (streaming in background) ──\n");
  const inferenceResult = await callInference(PROMPT);

  // Inference done — abort the stream
  ac.abort();

  // Now await the stream result (should resolve quickly after abort)
  const streamResult = await streamPromise;

  await new Promise((r) => setTimeout(r, 500));

  console.log(`\n── Inference Result ──`);
  console.log(`  Model:      ${inferenceResult.model}`);
  console.log(`  Response:   ${inferenceResult.response.slice(0, 200)}...`);
  console.log(`  Tokens:     ${inferenceResult.tokensUsed}`);
  console.log(`  Latency:    ${inferenceResult.latencyMs}ms\n`);

  console.log("── Streaming Summary ──");
  console.log(`  Payments:   ${streamResult.paymentCount}`);
  console.log(`  Total paid: ${streamResult.totalPaid} USDC`);
  console.log(`  Duration:   ${streamResult.durationMs}ms`);
  const tps = streamResult.durationMs > 0
    ? (streamResult.paymentCount / (streamResult.durationMs / 1000)).toFixed(1)
    : "0";
  console.log(`  Rate:       ${tps} tx/s`);

  if (streamResult.txHashes.length > 0) {
    console.log(`\n  Stream tx hashes (${streamResult.txHashes.length}):`);
    for (const h of streamResult.txHashes) {
      console.log(`    ${ARC_EXPLORER}/tx/${h}`);
    }
  }

  const balanceAfter = await getUsdcBalance(ownerId);
  console.log(`\n  Balance before: ${formatUsdc(balanceBefore)} USDC`);
  console.log(`  Balance after:  ${formatUsdc(balanceAfter)} USDC`);

  console.log(`\n── Step 8 Complete ──`);
  console.log("  Streaming inference demonstrated!");

  await sendWebhook("AGENT_STOPPED", { script: "streaming-inference", reason: "complete" });
  console.log("\n");
}

main().catch(async (error) => {
  await sendWebhook("AGENT_STOPPED", { script: "streaming-inference", reason: error.message ?? String(error) });
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
