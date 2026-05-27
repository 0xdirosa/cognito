import { type ActivityLog, type Balances } from "@/lib/types";

// Reads activity-log.json from public/ directory
export async function fetchActivity(): Promise<ActivityLog> {
  const res = await fetch("/api/activity");
  if (!res.ok) throw new Error(`Activity API error: ${res.status}`);
  return res.json();
}

export async function fetchBalances(): Promise<Balances> {
  const res = await fetch("/api/balances");
  if (!res.ok) throw new Error(`Balances API error: ${res.status}`);
  return res.json();
}

export async function refreshActivity(): Promise<ActivityLog> {
  const res = await fetch("/api/refresh", { method: "POST" });
  if (!res.ok) throw new Error(`Refresh API error: ${res.status}`);
  return res.json();
}
