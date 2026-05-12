import { NextResponse } from "next/server";

import { runLeadScoring } from "@/lib/marketing/leads/scoring";

export async function GET() {
  try {
    const leads =
      await runLeadScoring();

    return NextResponse.json({
      success: true,
      data: leads,
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
