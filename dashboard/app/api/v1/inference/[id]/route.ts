import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const INFERENCE_HISTORY = [
    { index: 1, timestamp: "2026-05-26T15:03:00Z", prompt: "Describe yourself as an autonomous AI agent...", response: "I exist as a digital entity...", tokens: 360, latencyMs: 1371, amount: "0.001", txHash: "0x29f2b366c9f9280c85a13de7590e1b345ec8a7df4c4637abac160078310fbd63", model: "llama-3.1-8b-instant" },
    { index: 2, timestamp: "2026-05-26T15:03:15Z", prompt: "You are Cognito, an ERC-8004...", response: "As Cognito, my nanopayment system...", tokens: 360, latencyMs: 870, amount: "0.001", txHash: "0x01d47ff6f625bec5ecb35c76441c49c6bb28971a8ebda5ac48cd11a48db0f2d1", model: "llama-3.1-8b-instant" },
    { index: 3, timestamp: "2026-05-26T15:03:30Z", prompt: "As Cognito, reflect...", response: "I don't have personal memories...", tokens: 225, latencyMs: 585, amount: "0.001", txHash: "0x621c17e63291edfff8d1c54b6a140b81ab765b7bbab8c027b0a8449c98a62caf", model: "llama-3.1-8b-instant" },
    { index: 4, timestamp: "2026-05-26T15:25:00Z", prompt: "Describe yourself...", response: "I am Cognito, living on Arc Testnet...", tokens: 270, latencyMs: 1020, amount: "0.001", txHash: "0x96a96983dbdea4d1603d59e6742735f2590841314e1c80eb46030d3375e436da", model: "llama-3.1-8b-instant" },
    { index: 5, timestamp: "2026-05-26T15:25:15Z", prompt: "Explain nanopayments...", response: "Nanopayments let me pay per-token...", tokens: 310, latencyMs: 940, amount: "0.001", txHash: "0x33602876b4d4bc3afa7ec0f0ddd480359da0449286647fa99d37f0b0c6b82901", model: "llama-3.1-8b-instant" },
    { index: 6, timestamp: "2026-05-26T15:25:30Z", prompt: "Reflect on inference...", response: "Streaming inference was demonstrated...", tokens: 382, latencyMs: 1488, amount: "0.001", txHash: "0xc05a773695412d27075a5e06b7bfae737ed1ccaf2d5f307119f3632502755f12", model: "llama-3.1-8b-instant" },
  ];

  const id = parseInt(params.id);
  const item = INFERENCE_HISTORY.find((i) => i.index === id);

  if (!item) {
    return NextResponse.json({ success: false, error: "Inference not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: item });
}
