/**
 * streaming-payment.ts — Interval-based USDC nanopayment stream.
 * Transfers micro-amounts every second while inference runs in parallel.
 * Uses AbortSignal for clean shutdown. No extra dependencies.
 */

import {
  USDC_CONTRACT,
  CIRCLE_BLOCKCHAIN,
  STREAMING_MIN_AMOUNT_USDC,
  STREAMING_RATE_USDC,
  STREAMING_INTERVAL_MS,
} from "../config/constants.js";
import { toUsdcMicro, executeTransferCall, waitForTransaction } from "./helpers.js";

export interface StreamPaymentParams {
  walletId: string;
  providerAddress: string;
  ratePerSecond: string;
  signal: AbortSignal;
}

export interface StreamPaymentResult {
  totalPaid: string;
  txHashes: string[];
  paymentCount: number;
  durationMs: number;
}

export async function streamPayment(
  params: StreamPaymentParams,
): Promise<StreamPaymentResult> {
  const { walletId, providerAddress, ratePerSecond, signal } = params;

  const rateMicro = toUsdcMicro(ratePerSecond);
  const minMicro = toUsdcMicro(STREAMING_MIN_AMOUNT_USDC);

  if (rateMicro < minMicro) {
    console.warn(`  ⚠️  Rate ${ratePerSecond} below minimum ${STREAMING_MIN_AMOUNT_USDC}. Using minimum.`);
  }

  const actualRate = rateMicro >= minMicro ? ratePerSecond : STREAMING_MIN_AMOUNT_USDC;
  const txHashes: string[] = [];
  const start = Date.now();
  let aborted = false;

  signal.addEventListener("abort", () => { aborted = true; });

  // Keep paying at interval until aborted
  while (!aborted) {
    if (signal.aborted) break;

    try {
      const tx = await executeTransferCall({
        walletId,
        tokenAddress: USDC_CONTRACT,
        blockchain: CIRCLE_BLOCKCHAIN,
        destinationAddress: providerAddress,
        amount: [actualRate],
      });

      const txHash = await waitForTransaction(tx.data?.id!, "stream payment");
      txHashes.push(txHash);
      process.stdout.write(`  → Stream tx: ${txHash.slice(0, 16)}...\n`);
    } catch (err: any) {
      process.stdout.write(`  ⚠️  Stream tx skipped: ${err.message?.slice(0, 80)}\n`);
    }

    if (!aborted && !signal.aborted) {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, STREAMING_INTERVAL_MS);
        const onAbort = () => { clearTimeout(timer); resolve(); };
        signal.addEventListener("abort", onAbort, { once: true });
      });
    }
  }

  const durationMs = Date.now() - start;
  const totalPaidMicro = BigInt(txHashes.length) * toUsdcMicro(actualRate);
  const totalPaid = String(Number(totalPaidMicro) / 1_000_000);

  return { totalPaid, txHashes, paymentCount: txHashes.length, durationMs };
}
