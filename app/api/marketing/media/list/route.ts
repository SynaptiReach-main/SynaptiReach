import { NextResponse }
from "next/server";

import { createClient }
from "@supabase/supabase-js";

const supabase = createClient(
  process.env
    .NEXT_PUBLIC_SUPABASE_URL || "",

  process.env
    .SUPABASE_SERVICE_ROLE_KEY || ""
);

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

    const {
      data,
      error,
    } = await supabase
      .from(
        "marketing_media"
      )
      .select("*")
      .eq(
        "workspace_id",
        workspaceId
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      media: data,
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
