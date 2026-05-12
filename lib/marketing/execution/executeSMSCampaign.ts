import twilio from "twilio";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function executeSMSCampaign(
  campaign: any,
  sid: string,
  token: string
) {
  const client =
    twilio(sid, token);

  const stagger =
    campaign.stagger_size || 50;

  const {
    data: leads,
  } = await supabase
    .from("leads")
    .select("*")
    .limit(stagger);

  let success = 0;

  for (const lead of leads || []) {
    if (!lead.phone) {
      continue;
    }

    try {
      await client.messages.create({
        body:
          campaign.content,

        from:
          process.env
            .TWILIO_PHONE_NUMBER,

        to:
          lead.phone,
      });

      success++;
    } catch (error) {
      console.error(error);
    }
  }

  await supabase
    .from("marketing_campaigns")
    .update({
      status: "completed",
    })
    .eq("id", campaign.id);

  return {
    success,
  };
}
