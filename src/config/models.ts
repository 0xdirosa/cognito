/**
 * models.ts — AI model registry for multi-provider inference.
 * Defines available models with cost/latency/quality metadata,
 * strategy-based model selection, and auto-filtering by available API keys.
 */

export interface ModelConfig {
  provider: "groq" | "gemini";
  model: string;
  costPer1kTokens: number;  // USD per 1000 tokens
  avgLatencyMs: number;
  quality: number;           // 1-10 ranking
  apiKeyEnv: string;         // env variable name for API key
}

const ALL_MODELS: ModelConfig[] = [
  {
    provider: "groq",
    model: "llama-3.1-8b-instant",
    costPer1kTokens: 0.05,
    avgLatencyMs: 800,
    quality: 7,
    apiKeyEnv: "GROQ_API_KEY",
  },
  {
    provider: "gemini",
    model: "gemini-2.0-flash",
    costPer1kTokens: 0.00,
    avgLatencyMs: 1500,
    quality: 8,
    apiKeyEnv: "GEMINI_API_KEY",
  },
];

export type ModelStrategy = "cheapest" | "fastest" | "best";

/**
 * Filter available models by checking which API keys are present.
 * Logs a warning for each excluded model.
 */
export function getAvailableModels(): ModelConfig[] {
  const available = ALL_MODELS.filter((m) => {
    const hasKey = !!process.env[m.apiKeyEnv];
    if (!hasKey) {
      process.stdout.write(`  ⚠ ${m.apiKeyEnv} not set — ${m.model} disabled\n`);
    }
    return hasKey;
  });

  if (available.length === 0) {
    throw new Error("No AI model API keys found in environment. Set GROQ_API_KEY or GEMINI_API_KEY.");
  }

  return available;
}

/**
 * Select the best model based on strategy.
 * "cheapest" = lowest cost, "fastest" = lowest latency, "best" = highest quality
 */
export function selectModel(
  strategy: ModelStrategy,
  models: ModelConfig[],
): ModelConfig {
  if (models.length === 1) {
    return models[0];
  }

  switch (strategy) {
    case "cheapest":
      return [...models].sort((a, b) => a.costPer1kTokens - b.costPer1kTokens)[0];
    case "fastest":
      return [...models].sort((a, b) => a.avgLatencyMs - b.avgLatencyMs)[0];
    case "best":
      return [...models].sort((a, b) => b.quality - a.quality)[0];
  }
}

export function getStrategy(): ModelStrategy {
  const env = process.env.MODEL_STRATEGY;
  if (env === "fastest" || env === "best" || env === "cheapest") return env;
  return "cheapest";
}
