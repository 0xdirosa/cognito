/**
 * HeroSection — headline, subheadline, CTAs, and live counter.
 */
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 pt-28 pb-16 text-center">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
          Pay-per-Inference{" "}
          <span className="typing-ai-api" style={{ color: "var(--accent)" }}>
            AI API
          </span>
        </h1>
      </div>

      <p className="animate-fade-in-up-delay-1 mt-5 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Access powerful AI models with USDC nanopayments.
        No subscription. No credit card. Just pay per request.
      </p>

      <div className="animate-fade-in-up-delay-2 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/dashboard/api"
          className="inline-flex items-center gap-2 text-base font-medium px-6 py-3 rounded-lg transition-all hover:brightness-110"
          style={{ background: "var(--accent)", color: "#020617" }}
        >
          Start for Free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <span
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          Built on Arc Testnet · ERC-8004
        </span>
      </div>

      <div className="animate-fade-in-up-delay-3 mt-10 inline-flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
        <span style={{ color: "#22c55e" }}>✓</span>
        <span>6 inferences processed</span>
        <span className="font-mono" style={{ color: "var(--accent)" }}>· 0.006 USDC settled</span>
      </div>
    </section>
  );
}
