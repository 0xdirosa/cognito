/**
 * StatsCard — metric card with hover effect and watermark icon.
 */
import { type ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  subtext: string;
  progress?: number; // 0-100 for "Since Registered" progress bar
}

export function StatsCard({ label, value, icon, subtext, progress }: StatsCardProps) {
  return (
    <div
      className="rounded-xl border p-5 relative overflow-hidden transition-all duration-200 hover:border-cyan-400/30"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Watermark icon */}
      <div className="absolute -right-3 -bottom-2 opacity-[0.04] pointer-events-none" style={{ color: "var(--text-primary)" }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2 relative z-10">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)] font-mono mb-0.5 relative z-10">{value}</p>
      <p className="text-xs text-[var(--text-muted)] mb-1 relative z-10">{subtext}</p>

      {progress !== undefined && (
        <div className="w-full bg-[var(--bg-surface)] rounded-full h-1 relative z-10">
          <div
 className="h-1 rounded-full bg-accent transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
