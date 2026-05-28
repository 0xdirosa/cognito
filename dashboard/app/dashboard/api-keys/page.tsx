/**
 * API Keys page — manage API keys for Cognito inference API.
 */
import { KeyRound } from "lucide-react";

export default function ApiKeysPage() {
  const keyHint = "cog_****hqiw";

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">API Keys</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Manage your API keys for accessing the Cognito inference API.
      </p>

      <div
        className="rounded-xl border p-10 flex flex-col items-center justify-center text-center"
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
          {keyHint}
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-3">
          Use with <code className="bg-[var(--bg-surface)] px-1 rounded">X-Cognito-API-Key</code> header
        </p>
      </div>
    </div>
  );
}
