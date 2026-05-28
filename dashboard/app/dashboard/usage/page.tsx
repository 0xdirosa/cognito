/**
 * Usage page — shows payment stats with link to full Payments page.
 */
import Link from "next/link";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowRight } from "lucide-react";

export default function UsagePage() {
  const avgCost = "0.0010";
  const totalSpent = "0.006";
  const projected = "~0.09";

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Usage &amp; Analytics</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Track your API usage and costs.
      </p>

      <div
        className="rounded-xl border p-4 mb-6 text-sm flex items-center gap-3"
        style={{
          background: "var(--warning-bg)",
          borderColor: "var(--warning-border)",
          color: "var(--warning-text)",
        }}
      >
        <span>ℹ️</span>
        <span>Full usage analytics coming soon. Showing current payment data.</span>
      </div>

      {/* Stats cards — mirrored from Payments page */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
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
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">{projected}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">@ 3 inferences/day</p>
        </div>
      </div>

      <Link
        href="/dashboard/payments"
        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        style={{ color: "var(--accent)" }}
      >
        View Full Payment Details
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
