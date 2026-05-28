/**
 * LandingFooter — footer for the public landing page.
 */
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-6 text-xs" style={{ color: "var(--text-muted)" }}>
        <span>Cognito © 2026 · Built on Arc + Circle</span>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/api" className="hover:text-[var(--accent)] transition-colors">
            Docs
          </Link>
          <a
            href="https://github.com/0xdirosa/cognito"
            target="_blank"
            rel="noopener"
            className="hover:text-[var(--accent)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
