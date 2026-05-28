/**
 * Dashboard Overview — platform-feel hero, stats, quick actions, budget.
 */
"use client";

import { useData } from "@/providers/data-provider";
import { SkeletonCard } from "@/components/skeleton-card";
import { LiveIndicator } from "@/components/live-indicator";
import { formatAddress, formatUsdc, timeAgo } from "@/lib/utils";
import { useState, useEffect } from "react";
import { WalletCard } from "@/components/wallet-card";
import { StatsCard } from "@/components/stats-card";
import { BudgetCard } from "@/components/budget-card";
import Link from "next/link";
import {
  Brain,
  DollarSign,
  Star,
  Clock,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  KeyRound,
  BarChart2,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function DashboardOverview() {
  const { activity, loading, error, lastUpdated, refresh } = useData();

  if (loading && !activity) {
    return (
      <div>
        <div className="h-8 w-48 bg-[var(--bg-surface)] rounded animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error && !activity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
        <p className="text-lg font-medium mb-2">Unable to load data</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={refresh}
          className="mt-4 px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
        <p className="text-lg font-medium mb-2">No activity data yet</p>
        <p className="text-sm">Run `npm run export-activity` to generate data.</p>
      </div>
    );
  }

  const { agent, wallets, identity, reputation, validation, budget } = activity;
  const score = agent.reputationScore ?? reputation.lastScore ?? "N/A";
  const inferenceCount = budget.spent ? Math.round(Number(budget.spent) / 0.001) : 6;
  const totalPaid = budget.spent || "0.006";

  const firstInference = new Date("2026-05-26T15:03:00Z");
  const now = new Date();
  const diffMs = now.getTime() - firstInference.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffHours / 24);
  const sinceStr = diffDays > 0 ? `${diffDays}d ${diffHours % 24}h` : `${diffHours}h`;
  const sinceDate = firstInference.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      {/* Hero Header */}
      <div
        className="rounded-xl border p-5 sm:p-6 mb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(6,182,212,0.04), transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Cognito</h1>
              <LiveIndicator active={true} />
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="font-mono">Agent #{agent.id}</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium">
                ERC-8004
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded" style={{ background: "rgba(34,197,94,0.1)" }}>
              <CheckCircle className="w-3 h-3" />
              {validation.status}
            </div>
            <span className="text-xs text-[var(--text-muted)]">
              {lastUpdated && `Updated ${timeAgo(lastUpdated)}`}
            </span>
            <button
              onClick={refresh}
              className="p-2 hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
              title="Refresh"
              style={{ color: "var(--text-muted)" }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard
          label="Total Inferences"
          value={String(inferenceCount)}
          icon={<Brain className="w-4 h-4" />}
          subtext={`${inferenceCount} sessions`}
        />
        <StatsCard
          label="Total USDC Paid"
          value={Number(totalPaid).toFixed(4)}
          icon={<DollarSign className="w-4 h-4" />}
          subtext="Cumulative"
        />
        <StatsCard
          label="Reputation Score"
          value={String(score)}
          icon={<Star className="w-4 h-4" />}
          subtext="/ 100"
        />
        <StatsCard
          label="Since Registered"
          value={sinceStr}
          icon={<Clock className="w-4 h-4" />}
          subtext={sinceDate}
          progress={Math.min((diffHours / (30 * 24)) * 100, 100)}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickActionCard
            href="/dashboard/api-keys"
            icon={<KeyRound className="w-5 h-5" />}
            label="Get API Key"
            desc="Manage your API credentials"
            accent="#22d3ee"
          />
          <QuickActionCard
            href="/dashboard/usage"
            icon={<BarChart2 className="w-5 h-5" />}
            label="View Usage"
            desc="Track costs and analytics"
            accent="#a78bfa"
          />
          <QuickActionCard
            href="/dashboard/api"
            icon={<BookOpen className="w-5 h-5" />}
            label="Read Docs"
            desc="API reference and examples"
            accent="#f472b6"
          />
        </div>
      </div>

      {/* Budget Card */}
      <BudgetCard budget={budget} />

      {/* Wallet Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <WalletCard
          label="Owner Wallet"
          address={wallets.owner.address}
          balance={wallets.owner.balance}
          showQr={true}
        />
        <WalletCard
          label="Validator Wallet"
          address={wallets.validator.address}
          balance={wallets.validator.balance}
          showQr={false}
        />
      </div>

      {/* Identity Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">On-Chain Identity</h2>
          <a
            href={identity.explorerUrl}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1 text-xs text-accent hover:underline font-mono"
          >
            ArcScan <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div>
            <p className="text-[var(--text-muted)] mb-1">Agent ID</p>
            <p className="font-mono text-[var(--text-primary)]">#{identity.tokenId}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Owner</p>
            <p className="font-mono text-[var(--text-primary)]" title={identity.owner}>
              {formatAddress(identity.owner)}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Contract</p>
            <p className="font-mono text-[var(--text-primary)]">
              {formatAddress(identity.contractAddress)}
            </p>
          </div>
        </div>
      </div>

      {/* Validation Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Validation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div>
            <p className="text-[var(--text-muted)] mb-1">Status</p>
            <p className="text-emerald-400 font-medium">{validation.status}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Validator</p>
            <p className="font-mono text-[var(--text-primary)]" title={validation.validatorAddress ?? ""}>
              {validation.validatorAddress ? formatAddress(validation.validatorAddress) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Response Score</p>
            <p className="text-emerald-400 font-mono">{validation.response}/100</p>
          </div>
        </div>
      </div>

      {/* Alert History Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Alert History</h2>
        <AlertHistoryCard />
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  label,
  desc,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border p-4 flex items-center gap-4 transition-all duration-200 hover:border-cyan-400/30 group"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}15`, color: accent }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: "var(--text-muted)" }} />
    </Link>
  );
}

function AlertHistoryCard() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/webhook-log")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  const recent = events.slice(-5).reverse();

  if (recent.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">No recent alerts</p>;
  }

  return (
    <div className="space-y-3">
      {recent.map((e, i) => (
        <div key={i} className="flex items-center justify-between text-sm border-b border-[var(--border)]/50 pb-2 last:border-0">
          <div>
            <span className="text-[var(--text-secondary)] font-medium">{e.event}</span>
            <span className="text-[var(--text-muted)] ml-2 text-xs">
              {new Date(e.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">{e.agentId}</span>
        </div>
      ))}
    </div>
  );
}
