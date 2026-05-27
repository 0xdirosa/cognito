import { type ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  subtext: string;
}

export function StatsCard({ label, value, icon, subtext }: StatsCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)] font-mono mb-0.5">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{subtext}</p>
    </div>
  );
}
