import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function getRetryCampaigns() {
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
