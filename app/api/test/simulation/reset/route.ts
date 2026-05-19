import { NextResponse } from "next/server";
import { resetTestWorkspace } from "@/lib/simulation/testWorkspaceSeed";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await resetTestWorkspace(request, body);
    return NextResponse.json({
      success: Boolean(result.allowed && result.reset),
      ...result,
    }, { status: result.setupRequired ? 200 : result.allowed ? 200 : 403 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to reset test simulation workspace.",
    }, { status: 500 });
  }
}
