"use client";

import { Copy, Check, ExternalLink, Shield } from "lucide-react";
import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_COGNITO_API_KEY_MASKED ?? "cog_••••••••••••••••";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/agent",
    desc: "Get agent identity and metadata",
    vercel: true,
    sampleResponse: `{
  "success": true,
  "data": {
    "id": "23745",
    "name": "Cognito",
    "standard": "ERC-8004",
    "network": "Arc Testnet",
    "owner": "0x2b33...cd2c",
    "metadataUri": "ipfs://Qm...",
    "reputationScore": "95",
    "validation": { "status": "PASSED", "response": 100 }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/inference",
    desc: "List inference history (paginated)",
    vercel: true,
    sampleResponse: `{
  "success": true,
  "data": [{ "index": 1, "timestamp": "...", "tokens": 360, "amount": "0.001", "model": "llama-3.1-8b-instant" }],
  "pagination": { "page": 1, "limit": 10, "total": 6 }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/inference/3",
    desc: "Get single inference by ID",
    vercel: true,
    sampleResponse: `{
  "success": true,
  "data": { "index": 3, "tokens": 225, "model": "llama-3.1-8b-instant", "txHash": "0x621c..." }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/balance",
    desc: "Get wallet balances",
    vercel: true,
    sampleResponse: `{
  "success": true,
  "data": { "owner": "19.979400", "validator": "20.020600" }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/budget",
    desc: "Get daily budget status",
    vercel: true,
    sampleResponse: `{
  "success": true,
  "data": { "limit": "0.05", "spent": "0.003", "remaining": "0.047", "isExceeded": false }
}`,
  },
  {
    method: "POST",
    path: "/api/v1/inference",
    desc: "Trigger a new inference (requires local env)",
    vercel: false,
    sampleResponse: `{
  "success": false,
  "error": "Inference trigger requires local environment with Circle SDK",
  "code": "LOCAL_ONLY"
}`,
  },
];

export default function ApiDocs() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCurl = (method: string, path: string) => {
    const curl = `curl -X ${method} https://cognito-dashboard.vercel.app${path} \\
  -H "X-Cognito-API-Key: cog_your_key"`;
    navigator.clipboard.writeText(curl);
    setCopied(path);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">REST API</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Public API for external applications to interact with Cognito agent.
      </p>

      {/* Getting Started */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Getting Started
        </h2>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p>All endpoints require authentication via the <code className="text-accent bg-slate-800 px-1.5 py-0.5 rounded text-xs">X-Cognito-API-Key</code> header.</p>
          <p className="font-mono text-xs bg-[var(--bg-surface)] rounded p-2 mt-2">
            curl -H &quot;X-Cognito-API-Key: {API_KEY}&quot; https://cognito-dashboard.vercel.app/api/v1/agent
          </p>
          <p className="text-xs text-slate-600">Rate limit: 10 requests/minute per IP</p>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-3">
        {ENDPOINTS.map((ep) => (
          <div key={ep.method + ep.path} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  ep.method === "GET" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>
                  {ep.method}
                </span>
                <code className="text-[var(--text-primary)] text-sm font-mono">{ep.path}</code>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  ep.vercel
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-amber-400/10 text-amber-400"
                }`}>
                  {ep.vercel ? "✅ Vercel OK" : "⚠️ Local Only"}
                </span>
                <button
                  onClick={() => copyCurl(ep.method, ep.path)}
                  className="p-1.5 hover:bg-[var(--bg-surface)] rounded transition-colors text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  title="Copy curl"
                >
                  {copied === ep.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="px-5 py-3">
              <p className="text-sm text-[var(--text-secondary)] mb-2">{ep.desc}</p>
              <pre className="text-xs text-slate-300 bg-slate-800 rounded p-3 overflow-x-auto font-mono">
                {ep.sampleResponse}
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm text-amber-300">
        <strong>Note:</strong> The <code className="text-amber-200">POST /api/v1/inference</code> endpoint
        requires local environment access to Circle SDK. All GET endpoints work in production.
      </div>
    </div>
  );
}
