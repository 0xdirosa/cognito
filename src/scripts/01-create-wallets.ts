/**
 * 01-create-wallets.ts — Creates two developer-controlled SCA wallets via Circle SDK
 * on Arc Testnet: one as the agent OWNER, one as the VALIDATOR.
 *
 * After creation, wallet IDs and addresses are saved to .env.
 * Manual step: fund the owner wallet with testnet USDC from the Circle Faucet.
 */

import { circleClient } from "../lib/circle-client.js";
import { CIRCLE_BLOCKCHAIN } from "../config/constants.js";
import { updateEnvFile, getUsdcBalance, formatUsdc } from "../lib/helpers.js";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 1: Create Wallets");
  console.log("═══════════════════════════════════════════\n");

  // Step 1a: Create Wallet Set
  console.log("── Creating wallet set ──");
  const walletSet = await circleClient.createWalletSet({
    name: "Cognito Agent Wallets",
  });
  const walletSetId = walletSet.data?.walletSet?.id;
  if (!walletSetId) throw new Error("Failed to create wallet set");
  console.log(`  Wallet Set ID: ${walletSetId}\n`);

  // Step 1b: Create 2 SCA wallets
  console.log("── Creating 2 SCA wallets on Arc Testnet ──");
  const walletsResponse = await circleClient.createWallets({
    blockchains: [CIRCLE_BLOCKCHAIN as any],
    count: 2,
    walletSetId,
    accountType: "SCA",
  });

  const ownerWallet = walletsResponse.data?.wallets?.[0];
  const validatorWallet = walletsResponse.data?.wallets?.[1];

  if (!ownerWallet || !validatorWallet) {
    throw new Error("Failed to create wallets — check Circle API response");
  }

  console.log(`  Owner:     ${ownerWallet.address} (ID: ${ownerWallet.id})`);
  console.log(`  Validator: ${validatorWallet.address} (ID: ${validatorWallet.id})\n`);

  // Step 1c: Save to .env
  console.log("── Saving wallet info to .env ──");
  updateEnvFile("OWNER_WALLET_ID", ownerWallet.id!);
  updateEnvFile("OWNER_WALLET_ADDRESS", ownerWallet.address!);
  updateEnvFile("VALIDATOR_WALLET_ID", validatorWallet.id!);
  updateEnvFile("VALIDATOR_WALLET_ADDRESS", validatorWallet.address!);
  console.log("  ✓ Wallet IDs and addresses saved to .env\n");

  // Step 1d: Check balances
  const ownerBalance = await getUsdcBalance(ownerWallet.id!);
  const valBalance = await getUsdcBalance(validatorWallet.id!);
  console.log("── Initial Balances ──");
  console.log(`  Owner:     ${formatUsdc(ownerBalance)} USDC`);
  console.log(`  Validator: ${formatUsdc(valBalance)} USDC\n`);

  // Step 1e: Manual faucet step
  console.log("═══════════════════════════════════════════");
  console.log("  ⚠️  MANUAL STEP — Fund the OWNER wallet");
  console.log("═══════════════════════════════════════════");
  console.log(`\n  Fund this wallet address with testnet USDC:`);
  console.log(`  → ${ownerWallet.address}`);
  console.log(`\n  Faucets:`);
  console.log(`  • Circle Faucet:   https://faucet.circle.com`);
  console.log(`  • Console Faucet:  https://console.circle.com/faucet`);
  console.log(`\n  • Select "Arc Testnet"`);
  console.log(`  • Paste the owner wallet address above`);
  console.log(`  • Recommended amount: at least 0.05 USDC`);
  console.log(`  (3 inferences × 0.001 USDC + gas buffer)\n`);

  const rl = createInterface({ input, output });
  await rl.question("Press Enter after the owner wallet is funded...");
  rl.close();

  // Step 1f: Verify funding
  console.log("\n── Verifying funding ──");
  const updatedBalance = await getUsdcBalance(ownerWallet.id!);
  console.log(`  Owner balance: ${formatUsdc(updatedBalance)} USDC`);

  if (updatedBalance === "0") {
    console.log("  ⚠️  Balance is still 0. Make sure faucet transaction completed.");
    console.log("  You can re-run this script or continue — but next steps may fail.");
  } else {
    console.log("  ✓ Owner wallet funded!\n");
  }

  console.log("── Step 1 Complete ──");
  console.log("  Ready for: npm run register-agent\n");
}

main().catch((error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
