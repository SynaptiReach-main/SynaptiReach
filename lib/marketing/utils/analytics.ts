export function calculateCampaignAnalytics(
  campaigns: any[]
) {
  const totalCampaigns =
    campaigns.length;

  const delivered =
    campaigns.reduce(
      (acc, c) =>
        acc + (
          c.delivered_count || 0
        ),
      0
    );

  const opened =
    campaigns.reduce(
      (acc, c) =>
        acc + (
          c.opened_count || 0
        ),
      0
    );

  const clicked =
    campaigns.reduce(
      (acc, c) =>
        acc + (
          c.clicked_count || 0
        ),
      0
    );

  const converted =
    campaigns.reduce(
      (acc, c) =>
        acc + (
          c.converted_count || 0
        ),
      0
    );

  return {
    totalCampaigns,
    delivered,
    opened,
    clicked,
    converted,

    openRate:
      delivered > 0
        ? (
            opened /
            delivered
          ) * 100
        : 0,

    clickRate:
      delivered > 0
        ? (
            clicked /
            delivered
          ) * 100
        : 0,

    conversionRate:
      delivered > 0
        ? (
            converted /
            delivered
          ) * 100
        : 0,
  };
}
