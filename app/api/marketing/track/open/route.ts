import { createClient }
from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const pixel =
  Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
    "base64"
  );

export async function GET(
  request: Request
) {
  const {
    searchParams,
  } = new URL(request.url);

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
          "open",
      });

    const { data: existing } = await supabase
      .from("marketing_campaigns")
      .select("opened_count")
      .eq("id", campaign)
      .maybeSingle();

    await supabase
      .from("marketing_campaigns")
      .update({
        opened_count: Number(existing?.opened_count || 0) + 1,
      })
      .eq("id", campaign);

    await supabase
      .from("marketing_events")
      .insert({
        campaign_id: campaign,
        action: "opened",
        type: "open",
        event_type: "open",
        title: "Campaign opened",
        message: "Tracking pixel loaded",
        details: "Tracking pixel loaded",
        metadata: {
          lead,
        },
      });
  }

  return new Response(pixel, {
    headers: {
      "Content-Type":
        "image/gif",

      "Cache-Control":
        "no-store",
    },
  });
}
