import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createCampaign(payload: any) {
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
