/**
 * agent-discovery.ts — Discovers registered ERC-8004 agents on Arc Testnet.
 * Queries Transfer events from IdentityRegistry to find all minted agent NFTs,
 * then reads ownerOf + tokenURI for each. Excludes Cognito (agentId 23745).
 */

import { publicClient } from "./public-client.js";
import { IDENTITY_REGISTRY } from "../config/constants.js";
import { getContract, parseAbiItem } from "viem";

export interface AgentProfile {
  agentId: string;
  owner: string;
  metadataUri: string;
  name: string;
  capabilities: string[];
}

const COGNITO_AGENT_ID = process.env.AGENT_ID ?? "23745";
const BLOCK_RANGE = 10000n;

function decodeMetadata(metadataUri: string): { name: string; capabilities: string[] } {
  // Try data URI: data:application/json;base64,...
  if (metadataUri.startsWith("data:application/json;base64,")) {
    try {
      const json = Buffer.from(
        metadataUri.replace("data:application/json;base64,", ""),
        "base64",
      ).toString("utf-8");
      const parsed = JSON.parse(json);
      return {
        name: parsed.name ?? "Unknown Agent",
        capabilities: parsed.capabilities ?? [],
      };
    } catch {
      // fall through
    }
  }
  // IPFS or other URI — no inline metadata to decode
  return { name: metadataUri.slice(0, 40) + "...", capabilities: [] };
}

export async function discoverAgents(): Promise<AgentProfile[]> {
  const latestBlock = await publicClient.getBlockNumber();
  const fromBlock = latestBlock > BLOCK_RANGE ? latestBlock - BLOCK_RANGE : 0n;

  // Query all Transfer events from IdentityRegistry
  const transferLogs = await publicClient.getLogs({
    address: IDENTITY_REGISTRY as `0x${string}`,
    event: parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ),
    fromBlock,
    toBlock: latestBlock,
  });

  // Collect unique tokenIds
  const seen = new Set<string>();
  for (const log of transferLogs) {
    const tokenId = log.args.tokenId?.toString();
    if (tokenId) seen.add(tokenId);
  }

  const identityContract = getContract({
    address: IDENTITY_REGISTRY as `0x${string}`,
    abi: [
      { name: "ownerOf", type: "function", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
      { name: "tokenURI", type: "function", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "string" }] },
    ],
    client: publicClient,
  });

  const agents: AgentProfile[] = [];

  for (const tokenId of seen) {
    // Exclude Cognito itself
    if (tokenId === COGNITO_AGENT_ID) continue;

    try {
      const owner = await identityContract.read.ownerOf([BigInt(tokenId)]);
      const tokenURI = await identityContract.read.tokenURI([BigInt(tokenId)]);
      const meta = decodeMetadata(tokenURI);

      agents.push({
        agentId: tokenId,
        owner,
        metadataUri: tokenURI,
        name: meta.name,
        capabilities: meta.capabilities,
      });
    } catch {
      // Skip agents that can't be read
    }
  }

  return agents;
}
