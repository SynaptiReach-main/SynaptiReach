import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
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
        "marketing_activity"
      )
      .insert({
        title:
          "Workflow Created",
        description:
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
