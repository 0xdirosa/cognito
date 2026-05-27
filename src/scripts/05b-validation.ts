/**
 * 05b-validation.ts — ERC-8004 two-step validation flow for Cognito agent.
 * Step 1: Owner requests validation from the validator wallet.
 * Step 2: Validator responds (100 = passed).
 * Verifies the on-chain validation status after completion.
 *
 * Prerequisites: run 01-05 first (agent ID + wallets must exist).
 */

import { publicClient } from "../lib/public-client.js";
import {
  VALIDATION_REGISTRY,
  ARC_EXPLORER,
} from "../config/constants.js";
import { waitForTransaction, executeContractCall } from "../lib/helpers.js";
import { keccak256, toHex, getContract } from "viem";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 5b: Validation Flow");
  console.log("═══════════════════════════════════════════\n");

  const ownerWalletId = process.env.OWNER_WALLET_ID;
  const ownerAddress = process.env.OWNER_WALLET_ADDRESS;
  const validatorWalletId = process.env.VALIDATOR_WALLET_ID;
  const validatorAddress = process.env.VALIDATOR_WALLET_ADDRESS;
  const agentId = process.env.AGENT_ID;

  if (!ownerWalletId || !validatorWalletId || !agentId) {
    throw new Error("Missing env vars. Run scripts 01-05 first.");
  }

  const requestURI = "data:application/json;base64," +
    Buffer.from(JSON.stringify({
      type: "kyc_verification",
      agent: "Cognito",
      agentId,
      standard: "ERC-8004",
    })).toString("base64");

  const requestHash = keccak256(
    toHex(`cognito_validation_request_${agentId}`),
  );

  console.log(`  Agent ID:       ${agentId}`);
  console.log(`  Owner:          ${ownerAddress}`);
  console.log(`  Validator:      ${validatorAddress}`);
  console.log(`  Request Hash:   ${requestHash}\n`);

  console.log("── Step 1: Owner requests validation ──");
  const reqTx = await executeContractCall({
    walletId: ownerWalletId,
    contractAddress: VALIDATION_REGISTRY,
    abiFunctionSignature: "validationRequest(address,uint256,string,bytes32)",
    abiParameters: [validatorAddress!, agentId, requestURI, requestHash],
  });

  await waitForTransaction(reqTx.data?.id!, "validation request");

  console.log("\n── Step 2: Validator responds ──");
  const resTx = await executeContractCall({
    walletId: validatorWalletId,
    contractAddress: VALIDATION_REGISTRY,
    abiFunctionSignature:
      "validationResponse(bytes32,uint8,string,bytes32,string)",
    abiParameters: [
      requestHash,
      "100",
      "",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "kyc_verified",
    ],
  });

  const txHash = await waitForTransaction(
    resTx.data?.id!,
    "validation response",
  );

  console.log("\n── Step 3: Verify validation ──");
  const validationContract = getContract({
    address: VALIDATION_REGISTRY as `0x${string}`,
    abi: [
      {
        name: "getValidationStatus",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "requestHash", type: "bytes32" }],
        outputs: [
          { name: "validatorAddress", type: "address" },
          { name: "agentId", type: "uint256" },
          { name: "response", type: "uint8" },
          { name: "responseHash", type: "bytes32" },
          { name: "tag", type: "string" },
          { name: "lastUpdate", type: "uint256" },
        ],
      },
    ],
    client: publicClient,
  });

  const [valAddr, , response, , tag] =
    await validationContract.read.getValidationStatus([requestHash]);

  console.log(`  Validator:  ${valAddr}`);
  console.log(`  Response:   ${response} (100 = passed)`);
  console.log(`  Tag:        ${tag}`);
  console.log(`  Tx:         ${ARC_EXPLORER}/tx/${txHash}`);

  const passed = response === 100;
  console.log(`  Result:     ${passed ? "✓ PASSED" : "✗ FAILED"}`);

  console.log(`\n── Validation Complete ──`);
  console.log("  Ready for: npm run verify-status\n");
}

main().catch((error: Error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
