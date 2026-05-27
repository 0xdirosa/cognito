"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Brain,
  CreditCard,
  Fingerprint,
  Radio,
  Code,
  Sun,
  Moon,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/inference", label: "Inference", icon: Brain },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/identity", label: "Identity", icon: Fingerprint },
  { href: "/dashboard/streaming", label: "Streaming", icon: Radio },
  { href: "/dashboard/api", label: "API", icon: Code },
];

export function Sidebar() {
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
    <aside className="w-56 border-r h-screen flex flex-col fixed left-0 top-0" style={{
      background: "var(--bg-sidebar)",
      borderColor: "var(--border)",
    }}>
      <div className="px-5 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--accent)" }}>COGNITO</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Agent Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-accent/10 text-accent font-medium"
                  : "hover:bg-slate-800/50"
              }`}
              style={{
                color: active ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors hover:bg-slate-800/30"
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
  );
}
