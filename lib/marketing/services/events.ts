import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

export async function createMarketingEvent(
  payload: any
) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_events")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getMarketingEvents(
  workspaceId: string
) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_events")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", {
      ascending: false,
    })
    .limit(50);

  if (error) {
    throw error;
  }

  return data;
}
