import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      data: campaign,
    } = await supabase
      .from(
        "marketing_campaigns"
      )
      .select("*")
      .eq(
        "id",
        body.campaignId
      )
      .single();

    if (!campaign) {
      return NextResponse.json(
        {
          error:
            "Campaign not found",
        },
        {
          status: 404,
        }
      );
    }

    const clone = {
      ...campaign,
      id: undefined,
      name:
        `${campaign.name} Copy`,
      created_at:
        undefined,
    };

    const {
      data,
    } = await supabase
      .from(
        "marketing_campaigns"
      )
      .insert(clone)
      .select()
      .single();

    await supabase
      .from(
        "marketing_events"
      )
      .insert({
        type: "campaign_clone",
        event_type: "campaign_clone",
        action: "cloned",
        title: "Campaign Cloned",
        message:
          `${campaign.name || campaign.subject || campaign.id} duplicated successfully.`,
        details:
          `${campaign.name || campaign.subject || campaign.id} duplicated successfully.`,
        campaign_id:
          campaign.id,
      });

    return NextResponse.json({
      success: true,
      data,
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
