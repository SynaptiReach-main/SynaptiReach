import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

function safeDivide(
  a: number,
  b: number
) {
  if (!b || b === 0) {
    return 0;
  }

  return a / b;
}

export async function getDashboardAnalytics() {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data: campaigns,
  } = await supabase
    .from("marketing_campaigns")
    .select("*");

  const totals = {
    delivered: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
  };

  for (const campaign of campaigns || []) {
    totals.delivered +=
      campaign.delivered_count || 0;

    totals.opened +=
      campaign.opened_count || 0;

    totals.clicked +=
      campaign.clicked_count || 0;

    totals.converted +=
      campaign.converted_count || 0;
  }

  const openRate =
    safeDivide(
      totals.opened,
      totals.delivered
    ) * 100;

  const ctr =
    safeDivide(
      totals.clicked,
      totals.opened
    ) * 100;

  const conversionRate =
    safeDivide(
      totals.converted,
      totals.clicked
    ) * 100;

  const funnel = [
    {
      stage: "Delivered",
      value:
        totals.delivered,
    },

    {
      stage: "Opened",
      value:
        totals.opened,
    },

    {
      stage: "Clicked",
      value:
        totals.clicked,
    },

    {
      stage: "Converted",
      value:
        totals.converted,
    },
  ];

  const trends = campaigns
    ?.slice(-7)
    ?.map((campaign) => ({
      name:
        campaign.name,
      delivered:
        campaign.delivered_count || 0,
      opened:
        campaign.opened_count || 0,
      clicked:
        campaign.clicked_count || 0,
      converted:
        campaign.converted_count || 0,
    }));

  const topCampaigns =
    [...(campaigns || [])]
      .sort(
        (a, b) =>
          (b.converted_count ||
            0) -
          (a.converted_count ||
            0)
      )
      .slice(0, 5);

  return {
    totals,
    openRate,
    ctr,
    conversionRate,
    funnel,
    trends,
    topCampaigns,
  };
}
