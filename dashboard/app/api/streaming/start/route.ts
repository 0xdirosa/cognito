import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NEXT_PUBLIC_IS_LOCAL !== "true") {
    return NextResponse.json(
      { error: "Streaming tidak tersedia di production", reason: "Requires local Circle SDK environment" },
      { status: 501 },
    );
  }

  return NextResponse.json({ status: "started", message: "Streaming initiated" });
}
