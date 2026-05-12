import { NextResponse } from "next/server";

import {
  createCampaign,
} from "@/lib/marketing/scheduler/createCampaign";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const campaign =
      await createCampaign(
        body
      );

    return NextResponse.json({
      success: true,
      campaign,
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
