import { insight, recordRef } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

function rate(part: number, total: number) {
  return total > 0 ? part / total : 0;
}

export function campaignInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const campaigns = context.campaigns || [];
  const insights: MiniBrainInsight[] = [];
  const underperforming = campaigns.filter((campaign) => {
    const delivered = Number(campaign.delivered_count || 0);
    const opened = Number(campaign.opened_count || 0);
    return delivered >= 20 && rate(opened, delivered) < 0.15;
  });
  const openedNoClicks = campaigns.filter((campaign) =>
    Number(campaign.opened_count || 0) >= 10 && Number(campaign.clicked_count || 0) === 0
  );

  if (underperforming.length) {
    insights.push(insight({
      key: "underperforming-campaigns",
      type: "campaign_intelligence",
      priority: "medium",
      title: "Campaign open rates need attention",
      summary: `${underperforming.length} campaign${underperforming.length === 1 ? "" : "s"} have low open rates after meaningful delivery volume.`,
      reasoning: [
        "Delivered volume is high enough to evaluate performance.",
        "Open rate below 15% usually points to subject, audience, or timing issues.",
      ],
      recommendedAction: "Review subject lines, audience segment, and send timing before sending another variant.",
      actionType: "review_campaign",
      relatedRecords: underperforming.slice(0, 5).map((item) => recordRef("campaign", item, "Campaign")),
      confidence: 0.8,
      trend: "down",
      metadata: { count: underperforming.length },
    }));
  }

  if (openedNoClicks.length) {
    insights.push(insight({
      key: "opened-no-clicks",
      type: "workflow_intelligence",
      priority: "medium",
      title: "Opened-not-clicked follow-up opportunity",
      summary: `${openedNoClicks.length} campaign${openedNoClicks.length === 1 ? "" : "s"} generated opens without clicks.`,
      reasoning: [
        "Opens show attention, but missing clicks suggest CTA or offer friction.",
        "A review-gated follow-up workflow can recover interest safely.",
      ],
      recommendedAction: "Create a draft follow-up workflow for opened-not-clicked contacts.",
      actionType: "create_workflow",
      relatedRecords: openedNoClicks.slice(0, 5).map((item) => recordRef("campaign", item, "Opened campaign")),
      confidence: 0.76,
      trend: "flat",
      metadata: { count: openedNoClicks.length },
    }));
  }

  return insights;
}
