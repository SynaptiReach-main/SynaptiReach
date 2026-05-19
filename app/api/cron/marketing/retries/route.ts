import { NextResponse } from "next/server";

import {
  getRetryCampaigns,
} from "@/lib/marketing/queue/getRetryCampaigns";

import { createClient }
from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          setup_required: true,
          error:
            "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 503 }
      );
    }

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
