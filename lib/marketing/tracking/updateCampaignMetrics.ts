import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function incrementMetric(
  campaignId: string,
  field: string
) {
  const {
    data: campaign,
  } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (!campaign) {
    return;
  }

  const current =
    campaign[field] || 0;

  await supabase
    .from("marketing_campaigns")
    .update({
      [field]:
        current + 1,
    })
    .eq("id", campaignId);

  await supabase
    .from("marketing_activity")
    .insert({
      title:
        "Campaign Engagement",
      description:
        `${field} updated for ${campaign.name}`,
    });
}
