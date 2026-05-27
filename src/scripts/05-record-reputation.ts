/**
 * 05-record-reputation.ts — Records agent reputation on-chain via ERC-8004
 * ReputationRegistry. The VALIDATOR wallet (as independent third party) calls
 * giveFeedback() — per ERC-8004, agent owners cannot record their own reputation.
 *
 * Prerequisites: run 01-04 first.
 */

import { circleClient } from "../lib/circle-client.js";
import {
  REPUTATION_REGISTRY,
  ARC_EXPLORER,
} from "../config/constants.js";
import { waitForTransaction, executeContractCall } from "../lib/helpers.js";
import { keccak256, toHex } from "viem";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 5: Record Reputation");
  console.log("═══════════════════════════════════════════\n");

  const validatorWalletId = process.env.VALIDATOR_WALLET_ID;
  const validatorAddress = process.env.VALIDATOR_WALLET_ADDRESS;
  const agentId = process.env.AGENT_ID;

  if (!validatorWalletId || !validatorAddress || !agentId) {
    throw new Error(
      "Missing env vars. Run scripts 01-04 first.",
    );
  }

  // Reputation: score based on inference performance
  // Score 95/100 — high confidence, accurate responses, successful nanopayments
  const tag = "autonomous_inference";
  const score = "95";
  const scoreType = "0"; // 0 = raw score
  const feedbackHash = keccak256(toHex(tag));

  console.log(`  Agent ID:      ${agentId}`);
  console.log(`  Validator:     ${validatorAddress}`);
  console.log(`  Tag:           ${tag}`);
  console.log(`  Score:         ${score}/100`);
  console.log(`  Feedback Hash: ${feedbackHash}\n`);

  console.log("── Submitting feedback to ReputationRegistry ──");

  const reputationTx = await executeContractCall({
    walletId: validatorWalletId,
    contractAddress: REPUTATION_REGISTRY,
    abiFunctionSignature:
      "giveFeedback(uint256,int128,uint8,string,string,string,string,bytes32)",
    abiParameters: [agentId, score, scoreType, tag, "", "", "", feedbackHash],
  });

  const txHash = await waitForTransaction(
    reputationTx.data?.id!,
    "reputation feedback",
  );

  console.log(`\n  ✓ Reputation recorded on-chain!`);
  console.log(`  Explorer: ${ARC_EXPLORER}/tx/${txHash}`);
  console.log(`  Contract: ${ARC_EXPLORER}/address/${REPUTATION_REGISTRY}\n`);

  console.log("── Step 5 Complete ──");
  console.log("  Agent reputation is now on-chain.");
  console.log("  Ready for: npm run verify-status\n");
}

main().catch((error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
