/**
 * FeaturesSection — 3 feature cards for the landing page.
 */
import { Zap, Shield, Cpu } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Pay Per Use",
    description: "0.001 USDC per inference. No subscriptions, no minimums, no hidden fees. Pay only for what you use.",
  },
  {
    icon: Shield,
    title: "On-chain Settlement",
    description: "Every transaction is recorded on Arc Testnet. Fully transparent, fully verifiable.",
  },
  {
    icon: Cpu,
    title: "Multi-Model",
    description: "Groq and Gemini with auto-fallback. Choose by strategy: cheapest, fastest, or best quality.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
          Why Cognito
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          Built for developers, settled on-chain
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl p-6 transition-colors"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <f.icon className="w-8 h-8 mb-4" style={{ color: "var(--accent)" }} />
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
