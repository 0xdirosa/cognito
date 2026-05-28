/**
 * Sidebar — dashboard navigation with section grouping.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  KeyRound,
  BarChart2,
  Activity,
  Brain,
  CreditCard,
  Fingerprint,
  Radio,
  Code,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

const PLATFORM_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart2 },
  { href: "/dashboard/status", label: "Status", icon: Activity },
];

const AGENT_ITEMS = [
  { href: "/dashboard/inference", label: "Inference", icon: Brain },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/identity", label: "Identity", icon: Fingerprint },
  { href: "/dashboard/streaming", label: "Streaming", icon: Radio },
];

const API_ITEMS = [
  { href: "/dashboard/api", label: "API Docs", icon: Code },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function NavSection({ label, items, pathname }: { label: string; items: typeof PLATFORM_ITEMS; pathname: string }) {
  return (
    <div className="mb-4">
      <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <div className="space-y-1">
        {items.map(({ href, label: itemLabel, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-accent/10 text-accent font-medium"
                  : "hover:bg-[var(--bg-surface)]"
              }`}
              style={{
                color: active ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              <Icon className="w-4 h-4" />
              {itemLabel}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`w-56 border-r h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{
          background: "var(--bg-sidebar)",
          borderColor: "var(--border)",
        }}
      >
        <div className="px-5 py-6 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--accent)" }}>COGNITO</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Platform</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded hover:bg-[var(--bg-surface)] transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <NavSection label="Platform" items={PLATFORM_ITEMS} pathname={pathname} />
        <NavSection label="Agent" items={AGENT_ITEMS} pathname={pathname} />
        <NavSection label="API" items={API_ITEMS} pathname={pathname} />
      </nav>

      {/* Theme Toggle */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors hover:bg-[var(--bg-surface)]"
          style={{ color: "var(--text-secondary)" }}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "Light" : "Dark"} Mode
        </button>
      </div>

      <div className="px-5 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
        Arc Testnet · Agent #23745
      </div>
    </aside>
    </>
  );
}
