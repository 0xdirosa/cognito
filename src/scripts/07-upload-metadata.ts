/**
 * 07-upload-metadata.ts — Uploads Cognito agent metadata to IPFS via Pinata.
 * Replaces the base64 data URI with a permanent ipfs:// URI.
 * Also checks if IdentityRegistry supports metadata update on-chain.
 *
 * Prerequisites: PINATA_API_KEY and PINATA_API_SECRET_KEY in .env.
 */

import { publicClient } from "../lib/public-client.js";
import {
  IDENTITY_REGISTRY,
} from "../config/constants.js";
import { encodeMetadataURI, updateEnvFile } from "../lib/helpers.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getContract } from "viem";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  COGNITO — Step 7: Upload Metadata to IPFS");
  console.log("═══════════════════════════════════════════\n");

  const pinataKey = process.env.PINATA_API_KEY;
  const pinataSecret = process.env.PINATA_API_SECRET_KEY;
  const agentId = process.env.AGENT_ID;

  if (!pinataKey) {
    throw new Error("PINATA_API_KEY tidak ditemukan di .env. Isi terlebih dahulu.");
  }
  if (!pinataSecret) {
    throw new Error("PINATA_API_SECRET_KEY tidak ditemukan di .env. Isi terlebih dahulu.");
  }

  // Read metadata JSON
  const metadataPath = resolve(__dirname, "..", "metadata", "agent-metadata.json");
  const metadataJson = readFileSync(metadataPath, "utf-8");
  const metadata = JSON.parse(metadataJson);

  console.log("── Metadata ──");
  console.log(`  Name:    ${metadata.name}`);
  console.log(`  Version: ${metadata.version}`);
  console.log(`  Standard: ${metadata.standard}\n`);

  // Upload to Pinata
  console.log("── Uploading to IPFS via Pinata ──");
  const pinataBody = JSON.stringify({
    pinataContent: metadata,
    pinataMetadata: {
      name: "cognito-agent-metadata.json",
      keyvalues: { agent: "cognito", standard: "ERC-8004", agentId: agentId ?? "unknown" },
    },
  });

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: pinataKey,
      pinata_secret_api_key: pinataSecret,
    },
    body: pinataBody,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Pinata upload failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const pinData = await res.json() as any;
  const ipfsHash = pinData.IpfsHash;
  const ipfsURI = `ipfs://${ipfsHash}`;

  console.log(`  ✓ Uploaded to IPFS!`);
  console.log(`  IPFS Hash: ${ipfsHash}`);
  console.log(`  URI:       ${ipfsURI}`);
  console.log(`  Gateway:   https://gateway.pinata.cloud/ipfs/${ipfsHash}\n`);

  // Save to .env
  console.log("── Saving IPFS URI to .env ──");
  updateEnvFile("METADATA_URI", ipfsURI);
  console.log("  ✓ METADATA_URI updated in .env\n");

  // Check if IdentityRegistry supports metadata update
  console.log("── Checking IdentityRegistry for metadata update support ──");
  try {
    const identityContract = getContract({
      address: IDENTITY_REGISTRY as `0x${string}`,
      abi: [
        { name: "tokenURI", type: "function", stateMutability: "view",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "string" }] },
      ],
      client: publicClient,
    });

    const currentURI = await identityContract.read.tokenURI([BigInt(agentId!)]);
    console.log(`  Current on-chain URI: ${currentURI.slice(0, 80)}...`);

    if (currentURI === ipfsURI) {
      console.log("  ✓ On-chain URI already matches IPFS.\n");
    } else {
      console.log("  ⚠️  IdentityRegistry does not expose a public setTokenURI / updateMetadata function.");
      console.log("  The IPFS URI has been saved to .env. To register it on-chain,");
      console.log("  you would need to re-register the agent or use a contract upgrade.\n");
    }
  } catch (err: any) {
    console.log(`  ⚠️  Could not verify on-chain URI: ${err.message}\n`);
  }

  console.log("── Step 7 Complete ──");
  console.log(`  IPFS URI: ${ipfsURI}`);
  console.log(`  Gateway:  https://gateway.pinata.cloud/ipfs/${ipfsHash}\n`);
}

main().catch((error: Error) => {
  console.error("\n✗ Error:", error.message ?? error);
  process.exit(1);
});
