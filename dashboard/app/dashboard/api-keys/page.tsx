/**
 * API Keys page — manage API keys + quick start guide.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound, Copy, Check, ArrowRight } from "lucide-react";

const KEY_HINT = "cog_****hqiw";
const CODE = `curl -X POST https://cognito-dashboard.vercel.app/api/v1/inference \\
  -H "X-Cognito-API-Key: ${KEY_HINT}" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Hello, Cognito!"}'`;

export default function ApiKeysPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">API Keys</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Manage your API keys for accessing the Cognito inference API.
      </p>

      <div
        className="rounded-xl border p-10 flex flex-col items-center justify-center text-center mb-6"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <KeyRound className="w-10 h-10 mb-4" style={{ color: "var(--text-muted)" }} />
        <p className="text-sm text-[var(--text-secondary)] max-w-sm">
          API Key management coming soon. For now, use the key from your .env file.
        </p>

        <div
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm"
          style={{
            background: "var(--bg-surface)",
            color: "var(--accent)",
          }}
        >
          <span style={{ color: "var(--text-secondary)" }}>Current key:</span>
          {KEY_HINT}
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-3">
          Use with <code className="bg-[var(--bg-surface)] px-1 rounded">X-Cognito-API-Key</code> header
        </p>
      </div>

      {/* Quick Start */}
      <div
        className="rounded-xl border p-6"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Quick Start</h2>

        <div
          className="relative rounded-lg p-4 mb-4 overflow-x-auto"
          style={{
            background: "#020617",
            border: "1px solid var(--border)",
          }}
        >
          <CopyButton text={CODE} />
          <pre className="text-sm font-mono leading-relaxed" style={{ color: "#e2e8f0" }}>
            <code>
              <span style={{ color: "#22c55e" }}>$</span>{" "}
              <span style={{ color: "var(--accent)" }}>curl</span>{" "}
              -X POST https://cognito-dashboard.vercel.app/api/v1/inference \<br />
              {"  "}-H <span style={{ color: "#fcd34d" }}>&quot;X-Cognito-API-Key: {KEY_HINT}&quot;</span> \<br />
              {"  "}-H <span style={{ color: "#fcd34d" }}>&quot;Content-Type: application/json&quot;</span> \<br />
              {"  "}-d <span style={{ color: "#fcd34d" }}>&#39;{`{"prompt": "Hello, Cognito!"}`}&#39;</span>
            </code>
          </pre>
        </div>

        <Link
          href="/dashboard/api"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          View Full API Docs
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-lg transition-colors"
      style={{ color: "var(--text-muted)", background: "var(--bg-surface)" }}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}
