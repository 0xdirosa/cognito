/**
 * budget-manager.ts — Daily budget management for Cognito agent.
 * Tracks USDC spending per day in budget-state.json at project root.
 * Auto-resets at midnight. All calculations use BigInt to avoid
 * IEEE 754 floating point errors.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { toUsdcMicro, formatUsdc, getUsdcBalance } from "./helpers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = resolve(__dirname, "..", "..", "budget-state.json");

export interface BudgetStatus {
  allowed: boolean;
  spent: string;
  limit: string;
  remaining: string;
  resetAt: string;
  isExceeded: boolean;
}

interface BudgetState {
  date: string;
  spent: string;
  limit: string;
  lastTx: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): BudgetState {
  const defaultLimit = process.env.DAILY_BUDGET_USDC ?? "0.05";
  const defaultState: BudgetState = {
    date: today(),
    spent: "0",
    limit: defaultLimit,
    lastTx: new Date().toISOString(),
  };

  if (!existsSync(STATE_PATH)) {
    return defaultState;
  }

  try {
    const raw = readFileSync(STATE_PATH, "utf-8");
    const state = JSON.parse(raw) as BudgetState;

    // Auto-reset if date changed
    if (state.date !== today()) {
      return { ...defaultState, limit: state.limit ?? defaultLimit };
    }

    // Validate fields
    return {
      date: state.date ?? today(),
      spent: state.spent ?? "0",
      limit: state.limit ?? defaultLimit,
      lastTx: state.lastTx ?? new Date().toISOString(),
    };
  } catch {
    return defaultState;
  }
}

function saveState(state: BudgetState): void {
  const dir = resolve(STATE_PATH, "..");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

export function checkBudget(): BudgetStatus {
  const state = loadState();
  const spentMicro = toUsdcMicro(state.spent);
  const limitMicro = toUsdcMicro(state.limit);
  const remainingMicro = limitMicro - spentMicro;
  const isExceeded = remainingMicro <= 0n;

  return {
    allowed: !isExceeded,
    spent: state.spent,
    limit: state.limit,
    remaining: String(Number(remainingMicro) / 1_000_000),
    resetAt: `${state.date}T23:59:59Z`,
    isExceeded,
  };
}

export function recordSpend(amount: string): void {
  const state = loadState();
  const currentMicro = toUsdcMicro(state.spent);
  const spendMicro = toUsdcMicro(amount);
  const newMicro = currentMicro + spendMicro;
  state.spent = String(Number(newMicro) / 1_000_000);
  state.lastTx = new Date().toISOString();
  saveState(state);
}

export function resetBudget(): BudgetStatus {
  const limit = (process.env.DAILY_BUDGET_USDC ?? "0.05");
  const state: BudgetState = {
    date: today(),
    spent: "0",
    limit,
    lastTx: new Date().toISOString(),
  };
  saveState(state);
  return checkBudget();
}

export function getRemainingBudget(): string {
  return checkBudget().remaining;
}
