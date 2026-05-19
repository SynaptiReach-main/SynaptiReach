import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

export async function createCampaign(
  payload: any
) {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from("marketing_campaigns")
    .insert({
      workspace_id:
        payload.workspace_id,

      name:
        payload.name,

      channel:
        payload.channel,

      status:
        payload.status ||
        "scheduled",

      audience:
        payload.audience,

      content:
        payload.content,

      subject:
        payload.subject,

      scheduled_for:
        payload.scheduled_for,

      stagger_size:
        payload.stagger_size,

      metadata:
        payload.metadata || {},
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
