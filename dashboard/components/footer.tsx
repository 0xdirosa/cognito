"use client";

import { useData } from "@/providers/data-provider";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const { activity, lastUpdated } = useData();
  const agentId = activity?.agent?.id ?? "23745";

  return (
    <footer className="md:ml-56 border-t text-xs px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-1" style={{
      borderColor: "var(--border)",
      background: "var(--bg-card)",
      color: "var(--text-muted)",
    }}>
      <span className="text-accent font-medium">Cognito</span>
      <span className="opacity-40">ERC-8004</span>
      <a
        href={`https://testnet.arcscan.app/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=${agentId}`}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-0.5 hover:text-accent transition-colors"
      >
        Agent #{agentId}
        <ExternalLink className="w-3 h-3" />
      </a>
      <span>Arc Testnet</span>
      <span className="sm:ml-auto opacity-60">Circle SDK · viem · Groq · Next.js</span>
      {lastUpdated && (
        <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
      )}
    </footer>
  );
}
