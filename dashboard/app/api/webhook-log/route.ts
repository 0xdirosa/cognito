import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const logPath = join(process.cwd(), "public", "webhook-log.json");
    if (existsSync(logPath)) {
      const raw = readFileSync(logPath, "utf-8");
      return NextResponse.json(JSON.parse(raw));
    }
    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}
