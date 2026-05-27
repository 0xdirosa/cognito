/**
 * inference-client.ts — Multi-provider AI inference client.
 * Supports Groq (llama-3.1-8b-instant) and Gemini (gemini-2.0-flash).
 * Auto-filters by available API keys, with per-provider retry and fallback.
 */

import {
  type ModelConfig,
  getAvailableModels,
  selectModel,
  getStrategy,
} from "../config/models.js";

const MAX_RETRIES_PER_PROVIDER = 3;
const BASE_DELAY_MS = 2000;

export interface InferenceResult {
  model: string;
  provider: string;
  prompt: string;
  response: string;
  tokensUsed: number;
  latencyMs: number;
}

function getGroqUrl(apiKey: string): string {
  return "https://api.groq.com/openai/v1/chat/completions";
}

function getGeminiUrl(apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
}

async function callGroq(prompt: string, config: ModelConfig): Promise<InferenceResult> {
  const apiKey = process.env[config.apiKeyEnv];
  if (!apiKey) throw new Error(`${config.apiKeyEnv} not found`);

  const start = Date.now();
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: config.model, messages: [{ role: "user", content: prompt }], max_tokens: 300 }),
  });

  if (!res.ok) throw new Error(`Groq ${res.status}`);

  const data = await res.json() as any;
  return {
    model: config.model,
    provider: config.provider,
    prompt,
    response: data?.choices?.[0]?.message?.content ?? "",
    tokensUsed: data?.usage?.total_tokens ?? 0,
    latencyMs: Date.now() - start,
  };
}

async function callGemini(prompt: string, config: ModelConfig): Promise<InferenceResult> {
  const apiKey = process.env[config.apiKeyEnv];
  if (!apiKey) throw new Error(`${config.apiKeyEnv} not found`);

  const start = Date.now();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}`);

  const data = await res.json() as any;
  return {
    model: config.model,
    provider: config.provider,
    prompt,
    response: data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
    tokensUsed: data?.usageMetadata?.totalTokenCount ?? 0,
    latencyMs: Date.now() - start,
  };
}

/**
 * Call AI inference with automatic provider selection and fallback.
 * If primary provider fails, tries next available provider.
 */
export async function callInference(prompt: string): Promise<InferenceResult> {
  const models = getAvailableModels();
  const strategy = getStrategy();
  const primary = selectModel(strategy, models);

  process.stdout.write(`  Strategy: ${strategy} → ${primary.model} (${primary.provider})\n`);

  // Try all models in priority order; primary first, then fallback
  const ordered = [primary, ...models.filter((m) => m !== primary)];

  for (const config of ordered) {
    for (let attempt = 0; attempt < MAX_RETRIES_PER_PROVIDER; attempt++) {
      if (attempt > 0) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
      }

      try {
        const caller = config.provider === "groq" ? callGroq : callGemini;
        return await caller(prompt, config);
      } catch (err: any) {
        const isLastAttempt = attempt === MAX_RETRIES_PER_PROVIDER - 1;
        if (isLastAttempt) {
          process.stdout.write(`  ✗ ${config.model} failed after ${MAX_RETRIES_PER_PROVIDER} attempts — trying next provider\n`);
        }
        if (!isLastAttempt) continue;
      }
    }
  }

  throw new Error("All AI providers failed");
}
