import { NextResponse } from "next/server";
import { tickTestWorkspace } from "@/lib/simulation/testWorkspaceSeed";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await tickTestWorkspace(request, body);
    return NextResponse.json({
      success: Boolean(result.allowed && result.ticked),
      ...result,
    }, { status: result.setupRequired ? 200 : result.allowed ? 200 : 403 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to advance test simulation.",
    }, { status: 500 });
  }
}
