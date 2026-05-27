/**
 * 11-agent-commerce.ts — Agent-to-agent payment demo for Cognito.
 * Discovers all ERC-8004 agents on Arc Testnet, selects one with matching
 * capabilities, and pays USDC as a service fee. Falls back to paying the
 * Cognito validator wallet if no external agents are found.
 *
 * Prerequisites: run 01-03 first (wallets + agent must exist).
 */

import { discoverAgents, type AgentProfile } from "../lib/agent-discovery.js";
import { payAgent } from "../lib/agent-payment.js";
import { ARC_EXPLORER } from "../config/constants.js";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 11: Agent-to-Agent Commerce");
  console.log("═══════════════════════════════════════════\n");

  const ownerWalletId = process.env.OWNER_WALLET_ID;
  const validatorAddress = process.env.VALIDATOR_WALLET_ADDRESS;
  const agentId = process.env.AGENT_ID;

  if (!ownerWalletId || !validatorAddress || !agentId) {
    throw new Error("Missing env vars. Run scripts 01-03 first.");
  }

  // Step 1: Discover agents
  console.log("── Step 1: Discovering agents on Arc Testnet ──");
  const agents = await discoverAgents();

  console.log(`  Found ${agents.length} other agent(s) on-chain (excluding Cognito #${agentId})`);

  for (const a of agents) {
    console.log(`  • Agent #${a.agentId}: ${a.name} (${a.capabilities.join(", ") || "no capabilities"})`);
  }

  // Step 2: Select a target agent
  console.log("\n── Step 2: Selecting target agent ──");

  let target: AgentProfile | null = null;
  let isFallback = false;

  // Try to find an agent with "inference" capability
  const inferenceAgents = agents.filter((a) =>
    a.capabilities.some((c) => c.toLowerCase().includes("inference")),
  );

  if (inferenceAgents.length > 0) {
    target = inferenceAgents[0];
    console.log(`  Selected: Agent #${target.agentId} (${target.name})`);
    console.log(`  Capabilities: ${target.capabilities.join(", ")}`);
  } else if (agents.length > 0) {
    target = agents[0];
    console.log(`  No inference-capable agent found. Selected: Agent #${target.agentId}`);
  } else {
    // Fallback: pay validator wallet
    console.log("  No external agents found on Arc Testnet.");
    console.log("  Running fallback demo → paying validator wallet as 'external agent'");
    isFallback = true;
  }

  // Step 3: Pay the agent
  const PAYMENT_AMOUNT = "0.001";
  const recipient = target?.owner ?? validatorAddress;
  const reason = isFallback
    ? "Agent-to-Agent Demo (Fallback — self-validator)"
    : `Service fee to Agent #${target!.agentId}`;

  console.log(`\n── Step 3: Paying ${PAYMENT_AMOUNT} USDC ──`);
  console.log(`  Recipient: ${recipient}`);
  console.log(`  Reason:    ${reason}`);

  const result = await payAgent(ownerWalletId, recipient, PAYMENT_AMOUNT, reason);

  console.log(`\n  ✓ Payment sent!`);
  console.log(`  Tx: ${ARC_EXPLORER}/tx/${result.txHash}`);
  console.log(`  Amount: ${result.amount} USDC`);

  if (target) {
    console.log(`  Agent:  #${target.agentId} (${target.name})`);
    console.log(`  Owner:  ${target.owner}`);
    console.log(`  Explorer: ${ARC_EXPLORER}/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=${target.agentId}`);
  }

  console.log(`\n── Step 11 Complete ──`);
  console.log("  Agent-to-agent commerce demonstrated!\n");
}

main().catch((error: Error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
