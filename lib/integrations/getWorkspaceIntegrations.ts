import { createClient } from "@supabase/supabase-js";

import {
  decrypt,
} from "@/lib/security/encryption";

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase setup required. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  );
}

export async function getWorkspaceIntegrations(
  workspaceId: string
) {
  if (!workspaceId) {
    return null;
  }

  const supabase =
    getSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from(
      "workspace_integrations"
    )
    .select("*")
    .eq(
      "workspace_id",
      workspaceId
    )
    .maybeSingle();

  if (error) {
    console.error(error);

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    resend_api_key:
      decrypt(
        data.resend_api_key
      ),

    twilio_sid:
      decrypt(
        data.twilio_sid
      ),

    twilio_token:
      decrypt(
        data.twilio_token
      ),

    ayrshare_key:
      decrypt(
        data.ayrshare_key
      ),

    gemini_key:
      decrypt(
        data.gemini_key
      ),
  };
}
