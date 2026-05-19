import { createMarketingSupabaseAdmin }
from "@/lib/marketing/supabaseAdmin";

export async function GET(
  request: Request
) {
  const supabase =
    createMarketingSupabaseAdmin();

  const {
    searchParams,
  } = new URL(request.url);

  const url =
    searchParams.get(
      "url"
    );

  const campaign =
    searchParams.get(
      "campaign"
    );

  const lead =
    searchParams.get(
      "lead"
    );

  if (
    campaign
  ) {
    await supabase
      .from(
        "marketing_tracking_events"
      )
      .insert({
        campaign_id:
          campaign,

        lead_id:
          lead || null,

        event_type:
          "click",

        metadata: {
          url,
        },
      });

    const { data: existing } = await supabase
      .from("marketing_campaigns")
      .select("clicked_count")
      .eq("id", campaign)
      .maybeSingle();

    await supabase
      .from("marketing_campaigns")
      .update({
        clicked_count: Number(existing?.clicked_count || 0) + 1,
      })
      .eq("id", campaign);

    await supabase
      .from("marketing_events")
      .insert({
        campaign_id: campaign,
        action: "clicked",
        type: "click",
        event_type: "click",
        title: "Campaign link clicked",
        message: url || "Tracked campaign link clicked",
        details: url || "Tracked campaign link clicked",
        metadata: {
          lead,
          url,
        },
      });
  }

  return Response.redirect(
    url || "/"
  );
}
