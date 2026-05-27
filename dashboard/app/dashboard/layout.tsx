"use client";

import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { DataProvider } from "@/providers/data-provider";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <DataProvider>
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="md:ml-56 flex-1 flex flex-col min-w-0">
          {/* Mobile header bar */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b" style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded hover:bg-[var(--bg-surface)] transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold tracking-tight" style={{ color: "var(--accent)" }}>COGNITO</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>#23745</span>
          </div>
          <main className="flex-1 px-4 md:px-8 py-4 md:py-6 max-w-[1200px] w-full">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </DataProvider>
  );
}
