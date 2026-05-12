import { NextResponse } from "next/server";

import { runOptimizer } from "@/lib/marketing/ai/optimizer";

export async function GET() {
  try {
    await runOptimizer();

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}
