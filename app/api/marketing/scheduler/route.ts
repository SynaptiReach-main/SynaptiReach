import { NextResponse } from "next/server";

import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

export async function GET() {
  try {
    const supabase = createMarketingSupabaseAdmin();

    const now =
      new Date().toISOString();

    const {
      data: campaigns,
    } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .eq(
        "status",
        "scheduled"
      )
      .lte(
        "scheduled_for",
        now
      );

    for (const campaign of campaigns || []) {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/marketing/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            campaignId:
              campaign.id,
          }),
        }
      );
    }

    return NextResponse.json({
      success: true,
      executed:
        campaigns?.length ||
        0,
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
