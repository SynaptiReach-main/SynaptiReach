import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function processBatch(
  campaignId: string,
  leads: any[],
  processor: Function
) {
  let success = 0;

  let failed = 0;

  for (const lead of leads) {
    try {
      await processor(lead);

      success++;

      await supabase
        .from(
          "marketing_campaign_logs"
        )
        .insert({
          campaign_id:
            campaignId,

          lead_id:
            lead.id,

          status:
            "sent",
        });
    } catch (error: any) {
      failed++;

      await supabase
        .from(
          "marketing_campaign_logs"
        )
        .insert({
          campaign_id:
            campaignId,

          lead_id:
            lead.id,

          status:
            "failed",

          error:
            error.message,
        });
    }
  }

  return {
    success,
    failed,
  };
}
