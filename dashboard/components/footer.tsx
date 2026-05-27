"use client";

import { useData } from "@/providers/data-provider";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const { activity, lastUpdated } = useData();
  const agentId = activity?.agent?.id ?? "23745";

  return (
    <footer className="ml-56 border-t border-slate-800 bg-slate-900 text-xs text-slate-600 px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-accent font-medium">Cognito</span>
        <span>·</span>
        <span>ERC-8004</span>
        <span>·</span>
        <a
          href={`https://testnet.arcscan.app/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=${agentId}`}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-0.5 hover:text-accent transition-colors"
        >
          Agent #{agentId}
          <ExternalLink className="w-3 h-3" />
        </a>
        <span>·</span>
        <span>Arc Testnet</span>
      </div>
      <div className="flex items-center gap-3">
        <span>Circle SDK · viem · Groq · Next.js</span>
        {lastUpdated && (
          <>
            <span className="text-slate-700">|</span>
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </>
        )}
      </div>
    </footer>
  );
}
