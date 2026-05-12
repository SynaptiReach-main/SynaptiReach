import { NextResponse } from "next/server";

import {
  getCampaignAnalytics,
} from "@/lib/marketing/analytics/getCampaignAnalytics";

export async function GET(
  request: Request
) {
  try {
    const {
      searchParams,
    } = new URL(request.url);

    const workspaceId =
      searchParams.get(
        "workspaceId"
      );

    if (!workspaceId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "workspaceId required",
        },
        {
          status: 400,
        }
      );
    }

    const analytics =
      await getCampaignAnalytics(
        workspaceId
      );

    return NextResponse.json({
      success: true,
      analytics,
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
