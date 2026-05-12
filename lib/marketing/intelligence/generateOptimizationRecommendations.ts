export function generateOptimizationRecommendations(
  campaign: any
) {
  const recommendations =
    [];

  if (
    !campaign.subject ||
    campaign.subject.length <
      10
  ) {
    recommendations.push(
      "Increase subject line length for better open rates."
    );
  }

  if (
    !campaign.media?.length
  ) {
    recommendations.push(
      "Campaigns with media typically perform better."
    );
  }

  if (
    !campaign.segment
  ) {
    recommendations.push(
      "Targeted audience segments increase conversions."
    );
  }

  if (
    !campaign.stagger_size
  ) {
    recommendations.push(
      "Enable stagger sending to improve deliverability."
    );
  }

  recommendations.push(
    "Best performing campaigns use urgency and personalization."
  );

  recommendations.push(
    "AI recommends A/B testing subject lines."
  );

  return recommendations;
}
