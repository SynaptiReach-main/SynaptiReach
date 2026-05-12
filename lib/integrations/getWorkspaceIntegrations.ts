import { createClient } from "@supabase/supabase-js";

import {
  decrypt,
} from "@/lib/security/encryption";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getWorkspaceIntegrations(
  workspaceId: string
) {
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
    .single();

  if (error) {
    throw error;
  }

  return {
    resend_api_key:
      data?.resend_api_key
        ? decrypt(
            data.resend_api_key
          )
        : null,

    twilio_sid:
      data?.twilio_sid
        ? decrypt(
            data.twilio_sid
          )
        : null,

    twilio_token:
      data?.twilio_token
        ? decrypt(
            data.twilio_token
          )
        : null,

    ayrshare_key:
      data?.ayrshare_key
        ? decrypt(
            data.ayrshare_key
          )
        : null,

    gemini_key:
      data?.gemini_key
        ? decrypt(
            data.gemini_key
          )
        : null,
  };
}
