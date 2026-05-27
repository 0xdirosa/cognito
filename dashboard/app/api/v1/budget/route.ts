import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { readFileSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const logPath = join(process.cwd(), "public", "activity-log.json");
    if (existsSync(logPath)) {
      const raw = JSON.parse(readFileSync(logPath, "utf-8"));
      if (raw.budget) return NextResponse.json({ success: true, data: raw.budget });
    }
    return NextResponse.json({ success: true, data: { limit: "0.05", spent: "0", remaining: "0.05", isExceeded: false } });
  } catch { return NextResponse.json({ success: true, data: { limit: "0.05", spent: "0", remaining: "0.05", isExceeded: false } }); }
}
