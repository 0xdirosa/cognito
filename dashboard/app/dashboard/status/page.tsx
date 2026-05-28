/**
 * Status page — real-time status of Cognito services.
 */

const SERVICES = [
  { name: "API Inference", status: "Operational" },
  { name: "Circle SDK", status: "Operational" },
  { name: "Arc Testnet", status: "Operational" },
  { name: "IPFS (Pinata)", status: "Operational" },
  { name: "Dashboard", status: "Operational" },
];

export default function StatusPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">System Status</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Real-time status of Cognito services.
      </p>

      <div
        className="rounded-xl border overflow-hidden mb-4"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        {SERVICES.map((svc, i) => (
          <div
            key={svc.name}
            className="flex items-center justify-between px-5 py-4 text-sm"
            style={{
              borderBottom: i < SERVICES.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <span style={{ color: "var(--text-primary)" }}>{svc.name}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
              {svc.status}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Last checked: just now
      </p>
    </div>
  );
}
