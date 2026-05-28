/**
 * PricingSection — simple pricing table for the landing page.
 */

const PRICING_ROWS = [
  { model: "llama-3.1-8b-instant", per1k: "0.001", speed: "Fast", badge: "⚡" },
  { model: "gemini-2.0-flash", per1k: "0.002", speed: "Medium", badge: "" },
];

export function PricingSection() {
  return (
    <section id="pricing" className="max-w-3xl mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
          Pricing
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          Simple, transparent pricing
        </h2>
        <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          Pay per 1,000 tokens. No hidden costs. All payments settled in USDC on-chain.
        </p>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="grid grid-cols-3 px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <span>Model</span>
          <span>Per 1K Tokens</span>
          <span>Speed</span>
        </div>

        {PRICING_ROWS.map((row) => (
          <div
            key={row.model}
            className="grid grid-cols-3 px-5 py-4 text-sm items-center"
            style={{ borderBottom: row.model === "gemini-2.0-flash" ? "none" : "1px solid var(--border)" }}
          >
            <span className="font-mono" style={{ color: "var(--text-primary)" }}>{row.model}</span>
            <span className="font-mono font-medium" style={{ color: "var(--accent)" }}>{row.per1k} USDC</span>
            <span>
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: row.speed === "Fast" ? "rgba(34,197,94,0.1)" : "var(--bg-surface)",
                  color: row.speed === "Fast" ? "#22c55e" : "var(--text-secondary)",
                }}
              >
                {row.badge}{row.speed}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
