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
    campaign &&
    lead
  ) {
    await supabase
      .from(
        "marketing_tracking_events"
      )
      .insert({
        campaign_id:
          campaign,

        lead_id:
          lead,

        event_type:
          "open",
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
