import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function getCampaignAnalytics(
  workspaceId: string
) {
  const {
    data: campaigns,
  } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .eq(
      "workspace_id",
      workspaceId
    );

  const {
    data: events,
  } = await supabase
    .from(
      "marketing_tracking_events"
    )
    .select("*");

  const analytics =
    (campaigns || []).map(
      (campaign: any) => {
        const related =
          (events || []).filter(
            (event: any) =>
              event.campaign_id ===
              campaign.id
          );

        const opens =
          related.filter(
            (e: any) =>
              e.event_type ===
              "open"
          ).length;

        const clicks =
          related.filter(
            (e: any) =>
              e.event_type ===
              "click"
          ).length;

        const sent =
          campaign.sent_count ||
          1;

        const openRate =
          (
            (opens / sent) *
            100
          ).toFixed(1);

        const clickRate =
          (
            (clicks / sent) *
            100
          ).toFixed(1);

        const engagement =
          (
            opens * 1 +
            clicks * 3
          );

        return {
          ...campaign,

          opens,

          clicks,

          openRate,

          clickRate,

          engagement,
        };
      }
    );

  return analytics;
}
