"use client";

import { useData } from "@/providers/data-provider";
import { formatUsdc, truncateTx } from "@/lib/utils";
import { DollarSign, TrendingUp, ArrowUpRight, ExternalLink } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px" }}>
      <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>
        Inference #{d.index}
      </p>
      <p style={{ color: "#e2e8f0", fontSize: 13, marginBottom: 2 }}>
        Time: {d.fullTime}
      </p>
      <p style={{ color: "#22d3ee", fontSize: 13, fontFamily: "monospace", marginBottom: 2 }}>
        Amount: {d.amount.toFixed(6)} USDC
      </p>
      <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 2 }}>
        Model: {d.model.split("-").slice(0, 3).join("-")}
      </p>
      <p style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace" }}>
        Tx: {d.txHash.slice(0, 10)}...{d.txHash.slice(-4)}
      </p>
    </div>
  );
}

function BarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px" }}>
      <p style={{ color: "#e2e8f0", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>
        {d.date}: {d.total.toFixed(6)} USDC
      </p>
      <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>
        {d.count} inference{d.count !== 1 ? "s" : ""}
      </p>
      <p style={{ color: "#64748b", fontSize: 11 }}>
        🧠 Groq: {d.groqCount ?? 0} | 🔮 Gemini: {d.geminiCount ?? 0}
      </p>
    </div>
  );
}

const PAYMENT_HISTORY = [
  { time: "15:03", amount: 0.001, model: "llama-3.1-8b-instant", txHash: "0x29f2b366c9f9280c85a13de7590e1b345ec8a7df4c4637abac160078310fbd63", index: 1, fullTime: "2026-05-26 15:03:00" },
  { time: "15:03", amount: 0.001, model: "llama-3.1-8b-instant", txHash: "0x01d47ff6f625bec5ecb35c76441c49c6bb28971a8ebda5ac48cd11a48db0f2d1", index: 2, fullTime: "2026-05-26 15:03:15" },
  { time: "15:03", amount: 0.001, model: "llama-3.1-8b-instant", txHash: "0x621c17e63291edfff8d1c54b6a140b81ab765b7bbab8c027b0a8449c98a62caf", index: 3, fullTime: "2026-05-26 15:03:30" },
  { time: "15:25", amount: 0.001, model: "llama-3.1-8b-instant", txHash: "0x96a96983dbdea4d1603d59e6742735f2590841314e1c80eb46030d3375e436da", index: 4, fullTime: "2026-05-26 15:25:00" },
  { time: "15:25", amount: 0.001, model: "llama-3.1-8b-instant", txHash: "0x33602876b4d4bc3afa7ec0f0ddd480359da0449286647fa99d37f0b0c6b82901", index: 5, fullTime: "2026-05-26 15:25:15" },
  { time: "15:25", amount: 0.001, model: "llama-3.1-8b-instant", txHash: "0xc05a773695412d27075a5e06b7bfae737ed1ccaf2d5f307119f3632502755f12", index: 6, fullTime: "2026-05-26 15:25:30" },
];

const TRANSACTIONS = [
  { type: "Inference", amount: "0.001", hash: "0x96a96983dbdea4d1603d59e6742735f2590841314e1c80eb46030d3375e436da", status: "Confirmed" },
  { type: "Inference", amount: "0.001", hash: "0x33602876b4d4bc3afa7ec0f0ddd480359da0449286647fa99d37f0b0c6b82901", status: "Confirmed" },
  { type: "Inference", amount: "0.001", hash: "0xc05a773695412d27075a5e06b7bfae737ed1ccaf2d5f307119f3632502755f12", status: "Confirmed" },
  { type: "Stream", amount: "0.0001", hash: "0x5d81d5a5c48c342d0c95d471b2377601be2a4a569e3c5d2e778de6fd099a1e83", status: "Confirmed" },
  { type: "Inference", amount: "0.001", hash: "0x29f2b366c9f9280c85a13de7590e1b345ec8a7df4c4637abac160078310fbd63", status: "Confirmed" },
  { type: "Inference", amount: "0.001", hash: "0x01d47ff6f625bec5ecb35c76441c49c6bb28971a8ebda5ac48cd11a48db0f2d1", status: "Confirmed" },
  { type: "Inference", amount: "0.001", hash: "0x621c17e63291edfff8d1c54b6a140b81ab765b7bbab8c027b0a8449c98a62caf", status: "Confirmed" },
]

function BarChartSection() {
  const daily = PAYMENT_HISTORY.reduce((acc, p) => {
    const day = p.fullTime.split(" ")[0]; // "2026-05-26"
    if (!acc[day]) {
      acc[day] = { total: 0, count: 0, groqCount: 0, geminiCount: 0 };
    }
    acc[day].total += p.amount;
    acc[day].count += 1;
    if (p.model.toLowerCase().includes("gemini")) acc[day].geminiCount! += 1;
    else acc[day].groqCount! += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; groqCount: number; geminiCount: number }>);

  const barData = Object.entries(daily).map(([date, v]) => ({
    date: date.slice(5), // "05-26"
    total: v.total,
    count: v.count,
    groqCount: v.groqCount,
    geminiCount: v.geminiCount,
  }));

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">USDC Spent Per Day</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => formatUsdc(String(v))} />
            <Tooltip content={<BarTooltip />} />
            <Bar dataKey="total" fill="#06b6d4" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function PaymentAnalytics() {
  const { activity, loading, error } = useData();

  if (loading && !activity) {
    return <div className="text-[var(--text-secondary)] py-20 text-center">Loading...</div>;
  }

  if (error && !activity) {
    return (
      <div className="text-[var(--text-secondary)] py-20 text-center">
        <p className="text-lg font-medium mb-2">Error loading data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const totalSpent = "0.006";
  const avgCost = (Number(totalSpent) / 6).toFixed(4);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Payment Analytics</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <DollarSign className="w-4 h-4" />
            Avg Cost / Inference
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">{avgCost}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">USDC</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <TrendingUp className="w-4 h-4" />
            Total Spent
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">{totalSpent}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">USDC across 6 inferences</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <ArrowUpRight className="w-4 h-4" />
            Projected / Month
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">~0.09</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">@ 3 inferences/day</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">USDC Spent Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PAYMENT_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => formatUsdc(String(v))} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="amount" stroke="#22d3ee" strokeWidth={2} dot={{ fill: "#22d3ee", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart — per day aggregate */}
      <BarChartSection />

      {/* Transaction Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">All Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--text-secondary)]">
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Tx Hash</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-secondary)]">
              {TRANSACTIONS.map((tx, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-surface)]/30">
                  <td className="py-3 px-4">{tx.type}</td>
                  <td className="py-3 px-4 font-mono text-accent">{tx.amount} USDC</td>
                  <td className="py-3 px-4">
                    <a
                      href={`https://testnet.arcscan.app/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener"
                      className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                      title={tx.hash}
                    >
                      {truncateTx(tx.hash)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs bg-emerald-400/10 text-emerald-400">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
