import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

export async function createCampaign(payload: any) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_campaigns")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createCampaignStep(payload: any) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_campaign_steps")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCampaigns(workspaceId: string) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_campaigns")
    .select(`
      *,
      marketing_campaign_steps(*)
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCampaignStatus(
  campaignId: string,
  status: string
) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_campaigns")
    .update({
      status,
    })
    .eq("id", campaignId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
