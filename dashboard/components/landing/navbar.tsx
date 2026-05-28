/**
 * LandingNavbar — top navigation bar for the public landing page.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/dashboard/api", label: "Docs" },
];

export function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--bg-primary) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 select-none shrink-0">
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            COGNITO
          </span>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full animate-blink"
            style={{ background: "var(--accent)" }}
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* Desktop CTA + Mobile menu toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/api"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors shrink-0"
            style={{
              background: "var(--accent)",
              color: "#020617",
            }}
          >
            <span className="hidden sm:inline">Get API Key</span>
            <span className="sm:hidden">API Key</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)", background: "var(--bg-surface)" }}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-3 space-y-3"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="inline-flex items-center gap-1.5 text-xs pt-1" style={{ color: "var(--text-secondary)" }}>
            Status
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
            <span className="text-emerald-400">Operational</span>
          </div>
        </div>
      )}
    </nav>
  );
}
