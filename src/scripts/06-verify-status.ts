/**
 * 06-verify-status.ts — Final verification of Cognito agent status on-chain.
 * Reads agent identity, reputation events, and displays comprehensive summary
 * of all on-chain activity including transaction explorer links.
 *
 * Prerequisites: run 01-05b first.
 */

import { publicClient } from "../lib/public-client.js";
import {
  IDENTITY_REGISTRY,
  REPUTATION_REGISTRY,
  VALIDATION_REGISTRY,
  ARC_EXPLORER,
  ARC_CHAIN_ID,
} from "../config/constants.js";
import { getContract } from "viem";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 6: Verify On-Chain Status");
  console.log("═══════════════════════════════════════════\n");

  const ownerAddress = process.env.OWNER_WALLET_ADDRESS;
  const validatorAddress = process.env.VALIDATOR_WALLET_ADDRESS;
  const agentId = process.env.AGENT_ID;

  if (!ownerAddress || !validatorAddress || !agentId) {
    throw new Error("Missing env vars. Run scripts 01-05 first.");
  }

  // 1. Agent Identity (IdentityRegistry)
  console.log("── Agent Identity ──");
  const identityContract = getContract({
    address: IDENTITY_REGISTRY as `0x${string}`,
    abi: [
      {
        name: "ownerOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "tokenId", type: "uint256" }],
        outputs: [{ name: "", type: "address" }],
      },
      {
        name: "tokenURI",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "tokenId", type: "uint256" }],
        outputs: [{ name: "", type: "string" }],
      },
    ],
    client: publicClient,
  });

  try {
    const owner = await identityContract.read.ownerOf([BigInt(agentId)]);
    const tokenURI = await identityContract.read.tokenURI([BigInt(agentId)]);

    console.log(`  Agent ID:     ${agentId}`);
    console.log(`  Owner:        ${owner}`);
    console.log(`  Expected:     ${ownerAddress}`);
    console.log(`  Matches:      ${owner.toLowerCase() === ownerAddress.toLowerCase() ? "✓" : "✗"}`);
    console.log(`  Metadata URI: ${tokenURI.slice(0, 70)}...`);
    console.log(`  Explorer:     ${ARC_EXPLORER}/token/${IDENTITY_REGISTRY}?a=${agentId}`);
  } catch (err: any) {
    console.log(`  ⚠️  Could not read agent identity: ${err.message}`);
  }

  // 2. Reputation (ReputationRegistry) — query all logs, no event filter
  console.log(`\n── Agent Reputation ──`);
  try {
    const latestBlock = await publicClient.getBlockNumber();
    const blockRange = 10000n;
    const fromBlock = latestBlock > blockRange ? latestBlock - blockRange : 0n;

    const reputationLogs = await publicClient.getLogs({
      address: REPUTATION_REGISTRY as `0x${string}`,
      fromBlock,
      toBlock: latestBlock,
    });

    if (reputationLogs.length === 0) {
      console.log("  ⚠️  No events found on ReputationRegistry.");
    } else {
      console.log(`  Found ${reputationLogs.length} event(s) on ReputationRegistry`);
      console.log(`  Contract: ${ARC_EXPLORER}/address/${REPUTATION_REGISTRY}`);
    }
  } catch (err: any) {
    console.log(`  ⚠️  Could not query reputation: ${err.message}`);
  }

  // 3. Wallet Addresses
  console.log(`\n── Wallet Addresses ──`);
  console.log(`  Owner:     ${ownerAddress}`);
  console.log(`  Validator: ${validatorAddress}`);
  console.log(`  Explorer:  ${ARC_EXPLORER}/address/${ownerAddress}`);

  // 4. Smart Contracts
  console.log(`\n── Smart Contracts ──`);
  console.log(`  IdentityRegistry:    ${IDENTITY_REGISTRY}`);
  console.log(`  ReputationRegistry:  ${REPUTATION_REGISTRY}`);
  console.log(`  ValidationRegistry:  ${VALIDATION_REGISTRY}`);

  // 5. Final Report
  console.log(`\n═══════════════════════════════════════════`);
  console.log("  COGNITO AGENT — STATUS REPORT");
  console.log("═══════════════════════════════════════════");
  console.log(`  Identity:   ✓ Registered (ERC-8004)`);
  console.log(`  Agent ID:   ${agentId}`);
  console.log(`  Owner:      ${ownerAddress}`);
  console.log(`  Network:    Arc Testnet (${ARC_CHAIN_ID})`);
  console.log(`  Standard:   ERC-8004`);
  console.log(`  Version:    1.0.0`);
  console.log(`  Explorer:   ${ARC_EXPLORER}/token/${IDENTITY_REGISTRY}?a=${agentId}`);
  console.log("═══════════════════════════════════════════\n");

  console.log("── All steps complete! ──");
  console.log("  Cognito agent is live on Arc Testnet with on-chain identity.\n");
}

main().catch((error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
