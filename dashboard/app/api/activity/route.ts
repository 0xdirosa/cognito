import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const path = join(process.cwd(), "public", "activity-log.json");
    const raw = readFileSync(path, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "activity-log.json not found" }, { status: 404 });
  }
}
