import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createMarketingEvent(
  payload: any
) {
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
