import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function calculateOpenRate(
  campaign: any
) {
  if (
    !campaign.delivered_count
  ) {
    return 0;
  }

  return (
    (campaign.opened_count ||
      0) /
    campaign.delivered_count
  ) * 100;
}

function calculateCTR(
  campaign: any
) {
  if (
    !campaign.opened_count
  ) {
    return 0;
  }

  return (
    (campaign.clicked_count ||
      0) /
    campaign.opened_count
  ) * 100;
}

function calculateConversionRate(
  campaign: any
) {
  if (
    !campaign.clicked_count
  ) {
    return 0;
  }

  return (
    (campaign.converted_count ||
      0) /
    campaign.clicked_count
  ) * 100;
}

function calculateHealthScore(
  campaign: any
) {
  const openRate =
    calculateOpenRate(
      campaign
    );

  const ctr =
    calculateCTR(
      campaign
    );

  const conversionRate =
    calculateConversionRate(
      campaign
    );

  return Math.round(
    openRate * 0.4 +
      ctr * 0.3 +
      conversionRate * 0.3
  );
}

function predictBestSendHour(
  campaigns: any[]
) {
  const hours: Record<
    number,
    number
  > = {};

  for (const campaign of campaigns) {
    if (
      !campaign.created_at
    ) {
      continue;
    }

    const hour =
      new Date(
        campaign.created_at
      ).getHours();

    const score =
      calculateHealthScore(
        campaign
      );

    hours[hour] =
      (hours[hour] || 0) +
      score;
  }

  const bestHour =
    Object.entries(hours)
      .sort(
        (a, b) =>
          b[1] - a[1]
      )[0]?.[0] || "9";

  return bestHour;
}

function generateRecommendation(
  campaign: any
) {
  const openRate =
    calculateOpenRate(
      campaign
    );

  const ctr =
    calculateCTR(
      campaign
    );

  if (openRate < 20) {
    return {
      title:
        "Improve Subject Lines",
      description:
        "AI detected low open rates. Use shorter high-curiosity subject lines.",
    };
  }

  if (ctr < 5) {
    return {
      title:
        "Improve CTA Placement",
      description:
        "AI detected low click-through rates. Move CTA higher in campaign body.",
    };
  }

  return {
    title:
      "Campaign Performing Well",
    description:
      "AI optimization engine detected strong engagement metrics.",
  };
}

export async function runOptimizer() {
  const {
    data: campaigns,
  } = await supabase
    .from("marketing_campaigns")
    .select("*");

  if (!campaigns) {
    return;
  }

  await supabase
    .from(
      "marketing_ai_recommendations"
    )
    .delete()
    .neq("id", "0");

  for (const campaign of campaigns) {
    const healthScore =
      calculateHealthScore(
        campaign
      );

    const recommendation =
      generateRecommendation(
        campaign
      );

    await supabase
      .from(
        "marketing_campaigns"
      )
      .update({
        ai_recommendations: [
          {
            healthScore,
            ...recommendation,
          },
        ],
      })
      .eq(
        "id",
        campaign.id
      );

    await supabase
      .from(
        "marketing_ai_recommendations"
      )
      .insert({
        recommendation_type:
          "campaign_optimization",
        priority:
          healthScore < 50
            ? "high"
            : "medium",
        title: recommendation.title,
        description: recommendation.description,
        estimated_impact:
          `Campaign health score ${healthScore}`,
      });
  }

  const bestHour =
    predictBestSendHour(
      campaigns
    );

  await supabase
    .from(
      "marketing_events"
    )
    .insert({
      type: "campaign_optimization",
      event_type: "campaign_optimization",
      action: "optimized",
      title: "AI Optimization Complete",
      message:
        `AI predicted ${bestHour}:00 as highest-performing send hour.`,
      details:
        `AI predicted ${bestHour}:00 as highest-performing send hour.`,
    });
}
