import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

export async function getRetryCampaigns() {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from(
      "marketing_campaign_logs"
    )
    .select("*")
    .eq(
      "status",
      "failed"
    )
    .lt(
      "retry_count",
      3
    );

  if (error) {
    throw error;
  }

  return data || [];
}
