/**
 * CodeSnippet — curl example with copy button.
 */
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CODE = `curl -X POST https://cognito-dashboard.vercel.app/api/v1/inference \\
  -H "X-Cognito-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Hello, Cognito!"}'`;

export function CodeSnippet() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 pb-12 md:pb-16 animate-fade-in-up-delay-3">
      <div
        className="relative rounded-xl p-5 overflow-hidden"
        style={{
          background: "#020617",
          border: "1px solid var(--border)",
          boxShadow: "0 0 30px -10px rgba(6,182,212,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#eab308" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
          <span className="text-xs ml-2 font-mono" style={{ color: "var(--text-muted)" }}>Terminal</span>
        </div>

        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)", background: "var(--bg-surface)" }}
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        <pre className="text-sm font-mono leading-relaxed overflow-x-auto" style={{ color: "#e2e8f0" }}>
          <code>
            <span style={{ color: "#22c55e" }}>$</span>{" "}
            <span style={{ color: "var(--accent)" }}>curl</span>{" "}
            -X POST https://cognito-dashboard.vercel.app/api/v1/inference \<br />
            {"  "}-H <span style={{ color: "#fcd34d" }}>&quot;X-Cognito-API-Key: YOUR_KEY&quot;</span> \<br />
            {"  "}-H <span style={{ color: "#fcd34d" }}>&quot;Content-Type: application/json&quot;</span> \<br />
            {"  "}-d <span style={{ color: "#fcd34d" }}>&#39;{`{"prompt": "Hello, Cognito!"}`}&#39;</span>
          </code>
        </pre>
      </div>
    </section>
  );
}
