import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ status: "stopped", message: "Streaming stop signal sent" });
}
