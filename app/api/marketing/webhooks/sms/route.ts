import { NextResponse } from "next/server";

import { incrementMetric } from "@/lib/marketing/tracking/updateCampaignMetrics";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    await incrementMetric(
      body.campaignId,
      "clicked_count"
    );

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
