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

    const workspace =
      searchParams.get(
        "workspace"
      );

    const contact =
      searchParams.get(
        "contact"
      );

    if (
      !workspace ||
      !contact
    ) {
      return new Response(
        "Invalid unsubscribe request",
        {
          status: 400,
        }
      );
    }

    await supabase
      .from(
        "marketing_suppression_list"
      )
      .insert({
        workspace_id:
          workspace,

        contact,

        reason:
          "unsubscribe",
      });

    await supabase
      .from(
        "marketing_audit_logs"
      )
      .insert({
        workspace_id:
          workspace,

        action:
          "unsubscribe",

        metadata: {
          contact,
        },
      });

    return new Response(
      `
      <html>
        <body style="font-family:sans-serif;background:#050816;color:white;display:flex;justify-content:center;align-items:center;height:100vh;">
          <div style="padding:40px;border:1px solid rgba(255,255,255,0.1);border-radius:20px;">
            <h1>You have been unsubscribed.</h1>
            <p>You will no longer receive marketing messages.</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type":
            "text/html",
        },
      }
    );
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
