import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

export async function getScheduledCampaigns() {
  const supabase = createMarketingSupabaseAdmin();
  const now =
    new Date().toISOString();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .eq(
      "status",
      "scheduled"
    )
    .lte(
      "scheduled_for",
      now
    );

  if (error) {
    throw error;
  }

  return data || [];
}
