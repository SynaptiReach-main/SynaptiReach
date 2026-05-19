import { NextResponse } from "next/server";
import { seedTestWorkspace } from "@/lib/simulation/testWorkspaceSeed";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await seedTestWorkspace(request, body);
    return NextResponse.json({
      success: Boolean(result.allowed && result.seeded),
      ...result,
    }, { status: result.setupRequired ? 200 : result.allowed ? 200 : 403 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to seed test simulation workspace.",
    }, { status: 500 });
  }
}
