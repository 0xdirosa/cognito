export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="h-3 w-20 bg-[var(--bg-surface)] rounded mb-3" />
      <div className="h-6 w-32 bg-[var(--bg-surface)] rounded mb-1" />
      <div className="h-3 w-16 bg-[var(--bg-surface)] rounded" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-[var(--bg-card)] border border-[var(--border)] rounded" />
      ))}
    </div>
  );
}
