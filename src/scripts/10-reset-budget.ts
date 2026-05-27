/**
 * 10-reset-budget.ts — Manually reset Cognito daily spending counter.
 * Sets spent = 0 for the current day. Budget limit unchanged.
 */

import { resetBudget, checkBudget } from "../lib/budget-manager.js";
import { formatUsdc } from "../lib/helpers.js";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Reset Daily Budget");
  console.log("═══════════════════════════════════════════\n");

  const status = resetBudget();

  console.log(`  Date:      ${status.resetAt}`);
  console.log(`  Spent:     ${status.spent} USDC`);
  console.log(`  Limit:     ${status.limit} USDC`);
  console.log(`  Remaining: ${status.remaining} USDC`);
  console.log(`  Status:    ${status.isExceeded ? "EXCEEDED" : "ACTIVE"}`);

  console.log("\n── Budget reset complete ──\n");
}

main().catch((error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
