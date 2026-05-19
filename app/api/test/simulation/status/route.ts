import { NextResponse } from "next/server";
import { getTestSimulationStatus } from "@/lib/simulation/testWorkspaceSeed";

export async function GET(request: Request) {
  try {
    const status = await getTestSimulationStatus(request);
    return NextResponse.json({
      success: Boolean(status.allowed),
      ...status,
    }, { status: status.setupRequired ? 200 : status.allowed ? 200 : 403 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to load test simulation status.",
    }, { status: 500 });
  }
}
