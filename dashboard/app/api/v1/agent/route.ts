import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const p = join(process.cwd(), "public", "activity-log.json");
    if (!existsSync(p)) return NextResponse.json({ success: false, error: "No data", code: "NO_DATA" }, { status: 404 });
    const raw = JSON.parse(readFileSync(p, "utf-8"));
    return NextResponse.json({
      success: true,
      data: {
        id: raw.agent.id,
        name: raw.agent.name,
        address: raw.agent.address,
        standard: raw.agent.standard,
        network: raw.agent.network,
        reputationScore: raw.agent.reputationScore,
        validation: raw.validation,
        capabilities: ["inference","nanopayments","autonomous-execution","on-chain-identity"],
      },
    });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
