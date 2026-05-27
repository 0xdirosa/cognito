/**
 * webhook.ts — Sends webhook events to external URL and logs to webhook-log.json.
 * Retries 3x with exponential backoff, fails silently on network errors.
 * Log history is capped at 100 entries (FIFO).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = resolve(__dirname, "..", "..", "webhook-log.json");
const MAX_LOG_ENTRIES = 100;

export interface WebhookPayload {
  event: string;
  timestamp: string;
  agentId: string;
  data: Record<string, any>;
}

/** In-memory history, synced to disk after each append */
let logCache: WebhookPayload[] | null = null;

function loadLog(): WebhookPayload[] {
  if (logCache) return logCache;
  if (!existsSync(LOG_PATH)) {
    logCache = [];
    return logCache;
  }
  try {
    logCache = JSON.parse(readFileSync(LOG_PATH, "utf-8"));
  } catch {
    logCache = [];
  }
  return logCache;
}

function saveLog(): void {
  const arr = loadLog();
  // FIFO — drop oldest if overflow
  while (arr.length > MAX_LOG_ENTRIES) arr.shift();
  writeFileSync(LOG_PATH, JSON.stringify(arr, null, 2));
}

function appendLog(payload: WebhookPayload): void {
  const arr = loadLog();
  arr.push(payload);
  saveLog();
}

export function getWebhookLog(): WebhookPayload[] {
  return loadLog();
}

/** Send a single POST to WEBHOOK_URL, return true on success */
async function attemptPost(url: string, payload: WebhookPayload): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Send a webhook event. Retries 3x with exponential backoff.
 * Always logs to webhook-log.json regardless of delivery success.
 * Fails silently — never throws.
 */
export async function sendWebhook(
  event: string,
  data: Record<string, any> = {},
): Promise<void> {
  const webhookUrl = process.env.WEBHOOK_URL;
  const agentId = process.env.AGENT_ID ?? "unknown";

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    agentId,
    data,
  };

  // Always log locally
  appendLog(payload);

  // No URL configured → skip
  if (!webhookUrl) return;

  // Retry 3x
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 2000 * Math.pow(2, attempt)));
    }
    const ok = await attemptPost(webhookUrl, payload);
    if (ok) return;
  }
}
