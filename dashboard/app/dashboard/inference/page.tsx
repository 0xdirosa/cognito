"use client";

import { useData } from "@/providers/data-provider";
import { formatUsdc, truncateTx, downloadCsv, getModelBadge } from "@/lib/utils";
import { ExternalLink, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

// Hardcoded inference history from earlier runs
const INFERENCE_HISTORY = [
  { index: 1, timestamp: "2026-05-26T15:03:00Z", prompt: "Describe yourself as an autonomous AI agent with on-chain identity on Arc Testnet...", response: "I exist as a digital entity, identified by a unique on-chain address on Arc Testnet. My identity serves as the foundation for decentralized autonomy.", tokens: 360, latencyMs: 1371, amount: "0.001", txHash: "0x29f2b366c9f9280c85a13de7590e1b345ec8a7df4c4637abac160078310fbd63", model: "llama-3.1-8b-instant" },
  { index: 2, timestamp: "2026-05-26T15:03:15Z", prompt: "You are Cognito, an ERC-8004 registered agent. Explain how your nanopayment system works...", response: "As Cognito, my nanopayment system transfers USDC micro-amounts on Arc every time I run inference. This creates an accountability trail.", tokens: 360, latencyMs: 870, amount: "0.001", txHash: "0x01d47ff6f625bec5ecb35c76441c49c6bb28971a8ebda5ac48cd11a48db0f2d1", model: "llama-3.1-8b-instant" },
  { index: 3, timestamp: "2026-05-26T15:03:30Z", prompt: "As Cognito, reflect on your last inference session...", response: "I don't have personal memories, but I can share that 3 nanopayments were performed, each costing 0.001 USDC on Arc Testnet.", tokens: 225, latencyMs: 585, amount: "0.001", txHash: "0x621c17e63291edfff8d1c54b6a140b81ab765b7bbab8c027b0a8449c98a62caf", model: "llama-3.1-8b-instant" },
  { index: 4, timestamp: "2026-05-26T15:25:00Z", prompt: "Describe yourself as an autonomous AI agent...", response: "I am Cognito, living on Arc Testnet's ERC-8004 registry. I pay for every thought with USDC.", tokens: 270, latencyMs: 1020, amount: "0.001", txHash: "0x96a96983dbdea4d1603d59e6742735f2590841314e1c80eb46030d3375e436da", model: "llama-3.1-8b-instant" },
  { index: 5, timestamp: "2026-05-26T15:25:15Z", prompt: "You are Cognito, explain nanopayments...", response: "Nanopayments let me pay per-token. Every word I generate costs a fraction of a cent.", tokens: 310, latencyMs: 940, amount: "0.001", txHash: "0x33602876b4d4bc3afa7ec0f0ddd480359da0449286647fa99d37f0b0c6b82901", model: "llama-3.1-8b-instant" },
  { index: 6, timestamp: "2026-05-26T15:25:30Z", prompt: "Reflect on your inference session...", response: "Streaming inference was demonstrated — paying per second during thought generation.", tokens: 382, latencyMs: 1488, amount: "0.001", txHash: "0xc05a773695412d27075a5e06b7bfae737ed1ccaf2d5f307119f3632502755f12", model: "llama-3.1-8b-instant" },
];

const PAGE_SIZE = 5;

export default function InferenceHistory() {
  const { activity, loading, error } = useData();
  const [page, setPage] = useState(0);

  const paginated = useMemo(() => {
    const start = page * PAGE_SIZE;
    return INFERENCE_HISTORY.slice(start, start + PAGE_SIZE);
  }, [page]);

  const totalPages = Math.ceil(INFERENCE_HISTORY.length / PAGE_SIZE);

  const handleExportCsv = () => {
    const header = "Index,Timestamp,Prompt,Response,Tokens,Latency (ms),Model,Amount (USDC),Tx Hash";
    const rows = INFERENCE_HISTORY.map(
      (r) => `"${r.index}","${r.timestamp}","${r.prompt.slice(0, 80)}","${r.response.slice(0, 80)}",${r.tokens},${r.latencyMs},${r.model},${r.amount},${r.txHash}`,
    );
    downloadCsv([header, ...rows].join("\n"), "cognito-inference-history.csv");
  };

  if (loading && !activity) {
    return <div className="text-slate-400 py-20 text-center">Loading...</div>;
  }

  if (error && !activity) {
    return (
      <div className="text-slate-400 py-20 text-center">
        <p className="text-lg font-medium mb-2">Error loading data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Inference History</h1>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="py-3 px-4 font-medium w-8">#</th>
                <th className="py-3 px-4 font-medium w-16">Time</th>
                <th className="py-3 px-4 font-medium">Prompt</th>
                <th className="py-3 px-4 font-medium">Response</th>
                <th className="py-3 px-4 font-medium w-20">Tokens</th>
                <th className="py-3 px-4 font-medium w-24">Latency</th>
                <th className="py-3 px-4 font-medium w-36">Model</th>
                <th className="py-3 px-4 font-medium w-24">Amount</th>
                <th className="py-3 px-4 font-medium w-44">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {paginated.map((r) => (
                <tr key={r.index} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono text-slate-500">{r.index}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">
                    {new Date(r.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-3 px-4 max-w-[180px] truncate" title={r.prompt}>
                    {r.prompt.slice(0, 60)}...
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate text-slate-400" title={r.response}>
                    {r.response.slice(0, 80)}...
                  </td>
                  <td className="py-3 px-4 font-mono">{r.tokens}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{r.latencyMs}ms</td>
                  <td className="py-3 px-4" title={`Provider: ${getModelBadge(r.model).provider} | Model: ${r.model}`}>
                    <span className="text-sm mr-1">{getModelBadge(r.model).icon}</span>
                    <span className="font-mono text-xs text-accent">{getModelBadge(r.model).shortName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-accent">{formatUsdc(r.amount)} USDC</td>
                  <td className="py-3 px-4">
                    <a
                      href={`https://testnet.arcscan.app/tx/${r.txHash}`}
                      target="_blank"
                      rel="noopener"
                      className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                      title={r.txHash}
                    >
                      {truncateTx(r.txHash)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
          <span>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, INFERENCE_HISTORY.length)} of {INFERENCE_HISTORY.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" /> Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  i === page
                    ? "bg-accent/20 text-accent"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            >
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
