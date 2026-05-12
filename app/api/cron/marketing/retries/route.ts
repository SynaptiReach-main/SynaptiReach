import { NextResponse } from "next/server";

import {
  getRetryCampaigns,
} from "@/lib/marketing/queue/getRetryCampaigns";

import { createClient }
from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET() {
  try {
    const retries =
      await getRetryCampaigns();

    for (const retry of retries) {
      await supabase
        .from(
          "marketing_campaign_logs"
        )
        .update({
          retry_count:
            (retry.retry_count || 0) + 1,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          retry.id
        );
    }

    return NextResponse.json({
      success: true,
      retried:
        retries.length,
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
