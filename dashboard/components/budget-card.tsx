import { formatUsdc } from "@/lib/utils";
import type { BudgetInfo } from "@/lib/types";

export function BudgetCard({ budget }: { budget: BudgetInfo }) {
  const spent = Number(budget.spent);
  const limit = Number(budget.limit);
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const exceeded = budget.isExceeded;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-300">Daily Budget</h2>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            exceeded
              ? "bg-rose-400/10 text-rose-400"
              : "bg-emerald-400/10 text-emerald-400"
          }`}
        >
          {exceeded ? "PAUSED" : "ACTIVE"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            exceeded ? "bg-rose-400" : "bg-accent"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500 text-xs mb-0.5">Spent</p>
          <p className="font-mono text-white">
            {formatUsdc(budget.spent)} / {formatUsdc(budget.limit)} USDC
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-0.5">Remaining</p>
          <p className={`font-mono ${exceeded ? "text-rose-400" : "text-accent"}`}>
            {formatUsdc(budget.remaining)} USDC
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-3">
        Resets daily at 00:00 UTC
      </p>
    </div>
  );
}
