export function LiveIndicator({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span
        className={`w-2 h-2 rounded-full ${
          active
            ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]"
            : "bg-[var(--text-muted)]"
        }`}
      />
      <span className={active ? "text-emerald-400" : "text-[var(--text-muted)]"}>
        {active ? "ACTIVE" : "IDLE"}
      </span>
    </span>
  );
}
