import { NextResponse } from "next/server";

import { incrementMetric } from "@/lib/marketing/tracking/updateCampaignMetrics";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const campaignId =
      body.campaignId;

    const event =
      body.event;

    if (
      event === "opened"
    ) {
      await incrementMetric(
        campaignId,
        "opened_count"
      );
    }

    if (
      event === "clicked"
    ) {
      await incrementMetric(
        campaignId,
        "clicked_count"
      );
    }

    if (
      event === "converted"
    ) {
      await incrementMetric(
        campaignId,
        "converted_count"
      );
    }

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
