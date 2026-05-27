import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognito Dashboard",
  description: "Cognito — Autonomous AI agent with ERC-8004 identity on Arc Testnet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased min-h-screen" style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}>
        {children}
      </body>
    </html>
  );
}
