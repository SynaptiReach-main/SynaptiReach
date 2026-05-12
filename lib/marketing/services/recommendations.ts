import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createRecommendation(
  payload: any
) {
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
