import { NextResponse }
from "next/server";

import {
  scoreCampaign,
} from "@/lib/marketing/intelligence/scoreCampaign";

import {
  getSendTimeRecommendation,
} from "@/lib/marketing/intelligence/getSendTimeRecommendation";

import {
  generateOptimizationRecommendations,
} from "@/lib/marketing/intelligence/generateOptimizationRecommendations";

export async function POST(
  request: Request
) {
  try {
    const campaign =
      await request.json();

    const score =
      scoreCampaign(
        campaign
      );

    const timing =
      getSendTimeRecommendation(
        campaign.type
      );

    const recommendations =
      generateOptimizationRecommendations(
        campaign
      );

    return NextResponse.json({
      success: true,

      intelligence: {
        score,

        timing,

        recommendations,
      },
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
