import { NextResponse } from "next/server";
import { pauseTestWorkspace } from "@/lib/simulation/testWorkspaceSeed";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await pauseTestWorkspace(request, Boolean(body.paused ?? true), body);
    return NextResponse.json({
      success: Boolean(result.allowed),
      ...result,
    }, { status: result.setupRequired ? 200 : result.allowed ? 200 : 403 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to update test simulation pause state.",
    }, { status: 500 });
  }
}
