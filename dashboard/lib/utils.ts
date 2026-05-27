export function formatAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatUsdc(amount: string): string {
  return Number(amount).toFixed(6);
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function truncateTx(hash: string): string {
  if (!hash || hash.length < 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function copyToClipboard(text: string): void {
  if (typeof navigator !== "undefined") {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

export function downloadCsv(csv: string, filename: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Get a shortened display name and emoji icon for an AI model.
 * Handles common model name patterns.
 */
export function getModelBadge(model: string): { icon: string; shortName: string; provider: string } {
  const lower = model.toLowerCase();
  if (lower.includes("llama")) return { icon: "🧠", shortName: "llama 3.1", provider: "groq" };
  if (lower.includes("gemini")) return { icon: "🔮", shortName: "gemini 2.0", provider: "gemini" };
  if (lower.includes("gpt")) return { icon: "🪙", shortName: model.split("-").slice(0, 2).join(" "), provider: "openai" };
  const parts = model.split("-");
  return { icon: "🤖", shortName: parts.slice(0, 2).join(" "), provider: parts[0] ?? "unknown" };
}
