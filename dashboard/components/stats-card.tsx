import { type ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  subtext: string;
}

export function StatsCard({ label, value, icon, subtext }: StatsCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold text-white font-mono mb-0.5">{value}</p>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  );
}
