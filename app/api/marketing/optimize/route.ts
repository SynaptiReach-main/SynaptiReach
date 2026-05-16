import { NextResponse } from "next/server";

import { runOptimizer } from "@/lib/marketing/ai/optimizer";

export async function GET() {
  try {
    await runOptimizer();

    return NextResponse.json({
      success: true,
      provider: null,
      model: null,
      fallback_used: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}
