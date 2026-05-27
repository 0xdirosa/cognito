"use client";

import { useData } from "@/providers/data-provider";
import { formatUsdc, truncateTx } from "@/lib/utils";
import {
  Radio,
  Play,
  Square,
  TrendingUp,
  ExternalLink,
  AlertTriangle,
  RotateCw,
  FlaskConical,
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const isLocal =
  typeof window !== "undefined" &&
  (process.env.NEXT_PUBLIC_IS_LOCAL === "true" || window.location.hostname === "localhost");

const DEMO_RATE = 0.0001;
const DEMO_DURATION_SEC = 5;
const DEMO_TICK_MS = 1000;

export default function StreamingPayments() {
  const { activity, loading, error, refresh } = useData();
  const [streamState, setStreamState] = useState<"idle" | "running">("idle");
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoDone, setDemoDone] = useState(false);
  const [demoTick, setDemoTick] = useState(0);
  const [demoTotal, setDemoTotal] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startStream = useCallback(async () => {
    if (!isLocal) return;
    setStreamState("running");
    try {
      await fetch("/api/streaming/start", { method: "POST" });
    } catch {}
    setStreamState("idle");
    refresh();
  }, [refresh]);

  const stopStream = useCallback(async () => {
    await fetch("/api/streaming/stop", { method: "POST" });
    setStreamState("idle");
  }, []);

  // Demo mode — client-side simulation
  const startDemo = useCallback(() => {
    setDemoRunning(true);
    setDemoDone(false);
    setDemoTick(0);
    setDemoTotal(0);
    const iv = setInterval(() => {
      setDemoTick((t) => {
        const next = t + 1;
        setDemoTotal(next * DEMO_RATE);
        if (next >= DEMO_DURATION_SEC) {
          clearInterval(iv);
          intervalRef.current = null;
          setDemoRunning(false);
          setDemoDone(true);
          return DEMO_DURATION_SEC;
        }
        return next;
      });
    }, DEMO_TICK_MS);
    intervalRef.current = iv;
  }, []);

  const stopDemo = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDemoRunning(false);
    setDemoDone(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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

  const balance = activity?.wallets?.owner?.balance ?? "0";

  // Chart data — live during demo
  const chartData = Array.from({ length: demoTick + 2 }, (_, i) => ({
    sec: i,
    balance: Number(balance) - i * DEMO_RATE,
  }));

  // Simulated tx log entries
  const simTxs = Array.from({ length: demoTick }, (_, i) => ({
    id: i + 1,
    amount: "0.0001",
    hash: `0x${"demo_tx_".slice(0, 8)}${String(i + 1).padStart(4, "0")}...`,
    status: "simulated",
  }));

  const isStreaming = streamState === "running" || demoRunning;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Streaming Payments</h1>

      {!isLocal && (
        <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-6 text-sm" style={{
          background: "var(--warning-bg)",
          borderColor: "var(--warning-border)",
          borderWidth: 1,
          color: "var(--warning-text)",
        }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Streaming hanya tersedia di local dev environment (
            <code style={{ color: "var(--warning-text)", fontWeight: 600 }}>npm run dev</code>
            ). Halaman ini dalam read-only mode.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <Radio className="w-4 h-4" /> Rate
          </div>
          <p className="text-2xl font-bold text-accent font-mono">{DEMO_RATE}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">USDC / second</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <TrendingUp className="w-4 h-4" /> Status
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isStreaming
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-slate-600"
              }`}
            />
            <span
              className={`text-xl font-bold ${
                isStreaming ? "text-emerald-400" : "text-[var(--text-secondary)]"
              }`}
            >
              {isStreaming ? "STREAMING" : "IDLE"}
            </span>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <TrendingUp className="w-4 h-4" /> Streamed
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {demoTotal.toFixed(4)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            USDC total ({demoTick} tx)
          </p>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Demo Controls</h2>
          <span className="px-2 py-0.5 rounded text-xs bg-cyan-400/10 text-cyan-400 font-medium">
            Client-side simulation
          </span>
        </div>
        <div className="flex gap-3">
          {!demoRunning && !demoDone && (
            <button
              onClick={startDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium"
            >
              <FlaskConical className="w-4 h-4" /> Run Demo
            </button>
          )}
          {demoRunning && (
            <button
              onClick={stopDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors text-sm font-medium"
            >
              <Square className="w-4 h-4" /> Stop Demo
            </button>
          )}
          {demoDone && (
            <button
              onClick={startDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-colors text-sm font-medium"
            >
              <RotateCw className="w-4 h-4" /> Run Again
            </button>
          )}
        </div>

        {/* Demo Summary */}
        {demoDone && (
          <div className="mt-4 px-4 py-3 bg-cyan-400/5 border border-cyan-400/20 rounded-lg text-sm text-cyan-300">
            Demo complete: {DEMO_DURATION_SEC} payments × {DEMO_RATE} USDC ={" "}
            {demoTotal.toFixed(4)} USDC streamed in {DEMO_DURATION_SEC} seconds
          </div>
        )}

        {/* Local controls */}
        {isLocal && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Live Stream</h2>
            <div className="flex gap-3">
              <button
                onClick={startStream}
                disabled={streamState === "running"}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-30 transition-colors text-sm font-medium"
              >
                <Play className="w-4 h-4" /> Start Live
              </button>
              <button
                onClick={stopStream}
                disabled={streamState !== "running"}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 transition-colors text-sm font-medium"
              >
                <Square className="w-4 h-4" /> Stop Live
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
          {demoRunning ? "Balance Decreasing (live)" : "Balance During Stream"}
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="sec" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(v) => v.toFixed(4)}
              />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
                formatter={(value: number) => [`${value.toFixed(6)} USDC`, "Balance"]}
              />
              <Line type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Micro-Transaction Log */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Micro-Transaction Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--text-secondary)]">
                <th className="py-3 px-4 font-medium">#</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Tx Hash</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-secondary)]">
              {simTxs.length === 0 && (
                <tr className="border-b border-[var(--border)]/50">
                  <td className="py-3 px-4 font-mono text-[var(--text-muted)]">1</td>
                  <td className="py-3 px-4 font-mono text-accent">0.0001 USDC</td>
                  <td className="py-3 px-4">
                    <a
                      href="https://testnet.arcscan.app/tx/0x5d81d5a5c48c342d0c95d471b2377601be2a4a569e3c5d2e778de6fd099a1e83"
                      target="_blank"
                      rel="noopener"
                      className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                      title="0x5d81d5a5c48c342d0c95d471b2377601be2a4a569e3c5d2e778de6fd099a1e83"
                    >
                      {truncateTx("0x5d81d5a5c48c342d0c95d471b2377601be2a4a569e3c5d2e778de6fd099a1e83")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs bg-emerald-400/10 text-emerald-400">
                      confirmed
                    </span>
                  </td>
                </tr>
              )}
              {simTxs.map((tx, i) => (
                <tr key={tx.id} className="border-b border-[var(--border)]/50">
                  <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{tx.id}</td>
                  <td className="py-3 px-4 font-mono text-accent">{tx.amount} USDC</td>
                  <td className="py-3 px-4 font-mono text-xs text-cyan-400">
                    {tx.hash}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs bg-cyan-400/10 text-cyan-400">
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
