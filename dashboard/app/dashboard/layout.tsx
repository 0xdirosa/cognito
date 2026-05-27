"use client";

import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { DataProvider } from "@/providers/data-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-56 flex-1 flex flex-col">
          <main className="flex-1 px-8 py-6 max-w-[1200px] w-full">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </DataProvider>
  );
}
