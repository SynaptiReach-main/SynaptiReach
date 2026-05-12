import { NextResponse } from "next/server";

import { generateAutonomousCampaign } from "@/lib/marketing/ai/autonomous/generator";

export async function POST() {
  try {
    const campaign =
      await generateAutonomousCampaign();

    return NextResponse.json({
      success: true,
      campaign,
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
