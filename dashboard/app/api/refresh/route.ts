import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function POST() {
  const logPath = join(process.cwd(), "public", "activity-log.json");

  if (existsSync(logPath)) {
    const raw = readFileSync(logPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({
      ...data,
      note: "Live refresh hanya tersedia di local environment",
    });
  }

  return NextResponse.json({
    error: "No activity log found",
    note: "Run export-activity locally and redeploy to update",
  }, { status: 200 });
}
