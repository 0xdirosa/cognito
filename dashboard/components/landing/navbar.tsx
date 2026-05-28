/**
 * LandingNavbar — top navigation bar for the public landing page.
 */
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/dashboard/api", label: "Docs" },
];

export function LandingNavbar() {
  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--bg-primary) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 select-none">
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            COGNITO
          </span>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full animate-blink"
            style={{ background: "var(--accent)" }}
          />
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}

          <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
            Status
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
            <span className="text-emerald-400">Operational</span>
          </span>
        </div>

        <Link
          href="/dashboard/api"
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{
            background: "var(--accent)",
            color: "#020617",
          }}
        >
          Get API Key
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}
