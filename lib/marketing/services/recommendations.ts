import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

export async function createRecommendation(
  payload: any
) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_ai_recommendations")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getRecommendations(
  workspaceId: string
) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_ai_recommendations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}
