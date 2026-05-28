import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognito — Pay-per-Inference AI API",
  description:
    "Access powerful AI models with USDC nanopayments. No subscription. No credit card. Just pay per request. Built on Arc Testnet with ERC-8004 identity.",
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
