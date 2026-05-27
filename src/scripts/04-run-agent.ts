/**
 * 04-run-agent.ts — Autonomous agent execution loop for Cognito.
 * The agent sends real inference requests to Google Gemini, pays USDC
 * nanopayments per-request, and logs responses on-chain. Runs
 * INFERENCE_COUNT cycles to demonstrate the full autonomous payment flow.
 *
 * Prerequisites: run 01, 02, 03 first. GEMINI_API_KEY must be in .env.
 */

import {
  USDC_CONTRACT,
  CIRCLE_BLOCKCHAIN,
  INFERENCE_PRICE_USDC,
  INFERENCE_COUNT,
  ARC_EXPLORER,
} from "../config/constants.js";
import {
  waitForTransaction,
  getUsdcBalance,
  formatUsdc,
  toUsdcMicro,
  executeTransferCall,
} from "../lib/helpers.js";
import { callInference, type InferenceResult } from "../lib/inference-client.js";
import { checkBudget, recordSpend } from "../lib/budget-manager.js";
import { sendWebhook } from "../lib/webhook.js";

// Cognito describes itself — 3 identity-focused prompts
const PROMPTS = [
  "Describe yourself as an autonomous AI agent with on-chain identity on Arc Testnet. What makes you different from traditional AI agents?",
  "You are Cognito, an ERC-8004 registered agent. Explain how your nanopayment system works and why it matters.",
  "As Cognito, reflect on your last inference session. What did you pay, and what did you learn?",
];

interface InferenceLog {
  index: number;
  prompt: string;
  paymentTxHash: string;
  paymentAmount: string;
  result: InferenceResult;
  timestamp: string;
}

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 4: Agent Execution Loop");
  console.log("═══════════════════════════════════════════\n");

  const ownerId = process.env.OWNER_WALLET_ID;
  const ownerAddress = process.env.OWNER_WALLET_ADDRESS;
  const validatorAddress = process.env.VALIDATOR_WALLET_ADDRESS;
  const agentId = process.env.AGENT_ID;

  if (!ownerId || !ownerAddress || !validatorAddress || !agentId) {
    throw new Error("Missing env vars. Run scripts 01-03 first.");
  }

  const initialBalance = await getUsdcBalance(ownerId);
  console.log(`  Agent ID:        ${agentId}`);
  console.log(`  Initial balance: ${formatUsdc(initialBalance)} USDC`);
  console.log(`  Inference count: ${INFERENCE_COUNT}`);
  console.log(`  Price/inference: ${INFERENCE_PRICE_USDC} USDC`);

  const budget = checkBudget();
  console.log(`  Daily budget:    ${budget.spent}/${budget.limit} USDC (${budget.isExceeded ? "EXCEEDED" : "ACTIVE"})`);

  await sendWebhook("AGENT_STARTED", { script: "agent-loop", model: "auto" });
  console.log("");

  const inferenceLogs: InferenceLog[] = [];
  let consecutiveFailures = 0;

  for (let i = 0; i < INFERENCE_COUNT; i++) {
    const index = i + 1;
    const prompt = PROMPTS[i];

    console.log(`── Inference #${index}/${INFERENCE_COUNT} ──`);
    console.log(`  Prompt: "${prompt.slice(0, 80)}..."`);

    try {
      // Budget check
      const budgetStatus = checkBudget();
      if (budgetStatus.isExceeded) {
        console.log(`  ✗ Daily budget exceeded: ${budgetStatus.spent}/${budgetStatus.limit} USDC. Skipping inference.`);
        continue;
      }

      // Check balance before paying
      const balanceBefore = await getUsdcBalance(ownerId);
      const balanceMicro = toUsdcMicro(balanceBefore);
      if (balanceMicro < toUsdcMicro(INFERENCE_PRICE_USDC)) {
        console.log(`  ✗ Insufficient balance: ${formatUsdc(balanceBefore)} USDC. Stopping loop.`);
        break;
      }

      console.log(`  Paying ${INFERENCE_PRICE_USDC} USDC to provider...`);
      const paymentTx = await executeTransferCall({
        walletId: ownerId,
        tokenAddress: USDC_CONTRACT,
        blockchain: CIRCLE_BLOCKCHAIN,
        destinationAddress: validatorAddress,
        amount: [INFERENCE_PRICE_USDC],
      });

      const txHash = await waitForTransaction(
        paymentTx.data?.id!,
        `inference #${index} payment`,
      );

      console.log(`  Calling Groq (llama-3.1-8b-instant)...`);
      const result = await callInference(prompt);

      console.log(`  Model:      ${result.model}`);
      console.log(`  Response:   ${result.response.slice(0, 200)}${result.response.length > 200 ? "..." : ""}`);
      console.log(`  Tokens:     ${result.tokensUsed}`);
      console.log(`  Latency:    ${result.latencyMs}ms`);
      console.log(`  Payment Tx: ${ARC_EXPLORER}/tx/${txHash}\n`);

      inferenceLogs.push({
        index,
        prompt,
        paymentTxHash: txHash,
        paymentAmount: INFERENCE_PRICE_USDC,
        result,
        timestamp: new Date().toISOString(),
      });
      consecutiveFailures = 0;
    } catch (err: any) {
      console.log(`  ✗ Inference #${index} failed: ${err.message ?? err}`);
      consecutiveFailures++;
      if (consecutiveFailures >= 2) {
        await sendWebhook("INFERENCE_FAILED", { error: err.message ?? String(err), consecutiveFailures });
      }
      console.log("  Continuing to next inference...\n");
    }

    if (i < INFERENCE_COUNT - 1) {
      console.log("  Waiting 3s before next inference...\n");
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  const finalBalance = await getUsdcBalance(ownerId);
  const totalPaidMicro = BigInt(inferenceLogs.length) * toUsdcMicro(INFERENCE_PRICE_USDC);

  console.log("═══ Inference Summary ═══");
  console.log(`  Total inferences:   ${inferenceLogs.length}/${INFERENCE_COUNT}`);
  console.log(`  Total USDC paid:    ${Number(totalPaidMicro) / 1_000_000}`);
  console.log(`  Initial balance:    ${formatUsdc(initialBalance)} USDC`);
  console.log(`  Final balance:      ${formatUsdc(finalBalance)} USDC`);
  console.log(`\n  Transaction hashes:`);
  for (const log of inferenceLogs) {
    console.log(`    #${log.index}: ${ARC_EXPLORER}/tx/${log.paymentTxHash}`);
  }

  console.log(`\n── Step 4 Complete ──`);
  console.log("  All inference payments recorded on-chain.");

  await sendWebhook("INFERENCE_COMPLETE", {
    totalInferences: inferenceLogs.length,
    totalPaid: Number(totalPaidMicro) / 1_000_000,
    balance: formatUsdc(finalBalance),
  });

  console.log("  Ready for: npm run record-reputation\n");
}

main().catch((error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
