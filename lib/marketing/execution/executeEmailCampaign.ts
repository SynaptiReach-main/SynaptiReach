import { Resend } from "resend";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function executeEmailCampaign(
  campaign: any,
  apiKey: string
) {
  const resend =
    new Resend(apiKey);

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
    try {
      await resend.emails.send({
        from:
          "marketing@synaptireach.ai",

        to: lead.email,

        subject:
          campaign.subject,

        html:
          campaign.content,
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
