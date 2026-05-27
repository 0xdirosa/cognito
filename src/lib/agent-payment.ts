/**
 * agent-payment.ts — Transfers USDC from Cognito owner wallet to an external agent owner.
 * Uses the executeTransferCall helper (Circle SDK wrapper) for on-chain nanopayments.
 */

import { USDC_CONTRACT, CIRCLE_BLOCKCHAIN } from "../config/constants.js";
import { executeTransferCall, waitForTransaction } from "./helpers.js";

export interface AgentPaymentResult {
  txHash: string;
  amount: string;
  recipient: string;
  reason: string;
}

export async function payAgent(
  ownerWalletId: string,
  recipientAddress: string,
  amount: string,
  reason: string,
): Promise<AgentPaymentResult> {
  const tx = await executeTransferCall({
    walletId: ownerWalletId,
    tokenAddress: USDC_CONTRACT,
    blockchain: CIRCLE_BLOCKCHAIN,
    destinationAddress: recipientAddress,
    amount: [amount],
  });

  const txHash = await waitForTransaction(tx.data?.id!, `pay agent ${recipientAddress.slice(0, 10)}`);

  return { txHash, amount, recipient: recipientAddress, reason };
}
