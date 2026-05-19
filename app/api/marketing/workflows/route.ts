import { NextResponse } from "next/server";

import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

export async function GET() {
  try {
    const supabase = createMarketingSupabaseAdmin();

    const {
      data,
    } = await supabase
      .from(
        "marketing_workflows"
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

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

export async function POST(
  request: Request
) {
  try {
    const supabase = createMarketingSupabaseAdmin();

    const body =
      await request.json();

    const {
      data,
      error,
    } = await supabase
      .from(
        "marketing_workflows"
      )
      .insert(body)
      .select()
      .single();

    if (error) {
      throw error;
    }

    await supabase
      .from(
        "marketing_events"
      )
      .insert({
        type: "workflow",
        event_type: "workflow",
        action: "created",
        title: "Workflow Created",
        message:
          `${body.name} automation created.`,
        details:
          `${body.name} automation created.`,
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
