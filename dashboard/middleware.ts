/**
 * middleware.ts — Auth + rate limiting for /api/v1/* routes.
 * Only protects v1 API endpoints. Dashboard UI and internal API
 * (/api/activity, /api/balances, etc.) are excluded.
 *
 * Rate limiter: in-memory counter per IP, 10 req/minute.
 * Limitation: resets on Vercel cold start (acceptable for current scope).
 */

import { NextResponse, type NextRequest } from "next/server";

const API_KEY = process.env.COGNITO_API_KEY ?? "";
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60000;

const rateStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/api/v1/")) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("x-cognito-api-key");
  if (!authHeader || authHeader !== API_KEY || !API_KEY) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — provide valid X-Cognito-API-Key header", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded — 10 requests/minute", code: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/v1/:path*",
};
