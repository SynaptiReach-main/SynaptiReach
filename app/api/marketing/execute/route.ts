import { NextResponse } from "next/server";

import { executeCampaign } from "@/lib/marketing/execution/executeCampaign";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    await executeCampaign(
      body.campaignId
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
