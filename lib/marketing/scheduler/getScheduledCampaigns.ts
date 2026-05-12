import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function getScheduledCampaigns() {
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
