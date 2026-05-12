import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import {
  encrypt,
} from "@/lib/security/encryption";

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

    const encrypted = {
      workspace_id:
        body.workspace_id,

      resend_api_key:
        body.resend_api_key
          ? encrypt(
              body.resend_api_key
            )
          : null,

      twilio_sid:
        body.twilio_sid
          ? encrypt(
              body.twilio_sid
            )
          : null,

      twilio_token:
        body.twilio_token
          ? encrypt(
              body.twilio_token
            )
          : null,

      ayrshare_key:
        body.ayrshare_key
          ? encrypt(
              body.ayrshare_key
            )
          : null,

      gemini_key:
        body.gemini_key
          ? encrypt(
              body.gemini_key
            )
          : null,
    };

    const {
      data,
      error,
    } = await supabase
      .from(
        "workspace_integrations"
      )
      .upsert(
        encrypted
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

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
