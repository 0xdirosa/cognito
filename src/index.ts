/**
 * index.ts — Full workflow orchestrator for Cognito agent.
 * Runs all 7 steps sequentially: create wallets, register agent,
 * setup inference, run agent loop, record reputation, validation, verify status.
 *
 * Usage: npm start
 */

import { execSync } from "node:child_process";

const SCRIPTS = [
  { name: "01-create-wallets", file: "src/scripts/01-create-wallets.ts" },
  { name: "02-register-agent", file: "src/scripts/02-register-agent.ts" },
  { name: "03-setup-inference", file: "src/scripts/03-setup-inference.ts" },
  { name: "04-run-agent", file: "src/scripts/04-run-agent.ts" },
  { name: "05-record-reputation", file: "src/scripts/05-record-reputation.ts" },
  { name: "05b-validation", file: "src/scripts/05b-validation.ts" },
  { name: "06-verify-status", file: "src/scripts/06-verify-status.ts" },
];

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║         COGNITO — Full Workflow          ║");
  console.log("║   ERC-8004 Agent + USDC Nanopayments     ║");
  console.log("╚══════════════════════════════════════════╝\n");

  for (let i = 0; i < SCRIPTS.length; i++) {
    const { name, file } = SCRIPTS[i];
    const step = i + 1;

    console.log(`\n▶ Running step ${step}/${SCRIPTS.length}: ${name}`);
    console.log("─".repeat(44));

    try {
      execSync(`npx tsx ${file}`, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
    } catch (err: any) {
      console.error(`\n✗ Step ${step} failed: ${name}`);
      console.error(`  ${err.message}`);
      process.exit(1);
    }

    if (i === 0) {
      console.log("\n⚠️  Wallet creation complete. Check .env for wallet IDs.");
      console.log("⚠️  Remember to fund the owner wallet before continuing.\n");
    }
  }

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   ✓ COGNITO — Full Workflow Complete    ║");
  console.log("╚══════════════════════════════════════════╝\n");
}

main();
