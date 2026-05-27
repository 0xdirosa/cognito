/**
 * public-client.ts — Viem public client for reading on-chain data from Arc Testnet.
 */

import { createPublicClient, http } from "viem";
import { arcTestnet } from "viem/chains";
import { ARC_RPC_URL } from "../config/constants.js";

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(ARC_RPC_URL),
});
