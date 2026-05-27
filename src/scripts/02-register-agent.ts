/**
 * 02-register-agent.ts — Registers the Cognito AI agent on-chain via ERC-8004 IdentityRegistry.
 * Mints an identity NFT for the agent and retrieves the on-chain agent ID.
 *
 * Prerequisites: run 01-create-wallets.ts first, and fund the owner wallet.
 */

import { publicClient } from "../lib/public-client.js";
import { IDENTITY_REGISTRY } from "../config/constants.js";
import {
  waitForTransaction,
  encodeMetadataURI,
  updateEnvFile,
  executeContractCall,
} from "../lib/helpers.js";
import { parseAbiItem, getContract } from "viem";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 2: Register Agent Identity");
  console.log("═══════════════════════════════════════════\n");

  const ownerWalletId = process.env.OWNER_WALLET_ID;
  const ownerAddress = process.env.OWNER_WALLET_ADDRESS;
  if (!ownerWalletId || !ownerAddress) {
    throw new Error(
      "OWNER_WALLET_ID or OWNER_WALLET_ADDRESS not set. Run 01-create-wallets.ts first.",
    );
  }

  const metadataURI = process.env.METADATA_URI || encodeMetadataURI();
  console.log("── Metadata URI ──");
  console.log(`  ${metadataURI.slice(0, 80)}...\n`);

  console.log("── Registering agent on IdentityRegistry ──");
  const registerTx = await executeContractCall({
    walletId: ownerWalletId,
    contractAddress: IDENTITY_REGISTRY,
    abiFunctionSignature: "register(string)",
    abiParameters: [metadataURI],
  });

  await waitForTransaction(registerTx.data?.id!, "agent registration");

  console.log("\n── Retrieving agent ID from on-chain events ──");
  const latestBlock = await publicClient.getBlockNumber();
  const blockRange = 10000n;
  const fromBlock = latestBlock > blockRange ? latestBlock - blockRange : 0n;

  const transferLogs = await publicClient.getLogs({
    address: IDENTITY_REGISTRY as `0x${string}`,
    event: parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ),
    args: { to: ownerAddress as `0x${string}` },
    fromBlock,
    toBlock: latestBlock,
  });

  if (transferLogs.length === 0) {
    throw new Error("No Transfer events found — registration may have failed");
  }

  const agentId =
    transferLogs[transferLogs.length - 1].args.tokenId!.toString();

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

  const onChainOwner = await identityContract.read.ownerOf([BigInt(agentId)]);
  const tokenURI = await identityContract.read.tokenURI([BigInt(agentId)]);

  console.log(`  Agent ID:     ${agentId}`);
  console.log(`  Owner:        ${onChainOwner}`);
  console.log(`  Token URI:    ${tokenURI.slice(0, 80)}...`);
  console.log("  ✓ Agent registered on-chain!\n");

  console.log("── Saving agent info to .env ──");
  updateEnvFile("AGENT_ID", agentId);
  updateEnvFile("METADATA_URI", metadataURI);
  console.log("  ✓ AGENT_ID and METADATA_URI saved to .env\n");

  console.log("── Step 2 Complete ──");
  console.log("  Agent ID:", agentId);
  console.log("  Ready for: npm run setup-inference\n");
}

main().catch((error: Error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
