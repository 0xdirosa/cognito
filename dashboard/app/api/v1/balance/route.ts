import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const p = join(process.cwd(), "public", "activity-log.json");
    if (!existsSync(p)) return NextResponse.json({ success: false, error: "No data" }, { status: 404 });
    const raw = JSON.parse(readFileSync(p, "utf-8"));
    return NextResponse.json({
      success: true,
      data: { owner: raw.wallets.owner.balance, validator: raw.wallets.validator.balance },
    });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
