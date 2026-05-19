import { scoreDeal, weightedDealValue } from "./dealScoring";
import { insight, recordRef } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function pipelineInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const deals = context.deals || [];
  const openDeals = deals.filter((deal) => !["won", "lost", "archived"].includes(deal.status));
  const staleDeals = openDeals.filter((deal) => {
    const updatedAt = deal.updated_at || deal.created_at;
    return updatedAt && (Date.now() - new Date(updatedAt).getTime()) / 86400000 >= 14;
  });
  const highValue = openDeals
    .map((deal) => ({ ...deal, mini_brain_score: scoreDeal(deal), weighted_value: weightedDealValue(deal) }))
    .sort((a, b) => b.weighted_value - a.weighted_value)
    .slice(0, 5);
  const insights: MiniBrainInsight[] = [];

  if (staleDeals.length) {
    insights.push(insight({
      key: "stale-deals",
      type: "pipeline_intelligence",
      priority: staleDeals.length >= 5 ? "high" : "medium",
      title: "Stale pipeline opportunities",
      summary: `${staleDeals.length} open deal${staleDeals.length === 1 ? "" : "s"} have not moved in 14+ days.`,
      reasoning: [
        "Open deals lose conversion probability when they sit without activity.",
        "A review task or follow-up draft is safer than automatic outreach.",
      ],
      recommendedAction: "Review stale deals and create follow-up tasks for the highest-value opportunities.",
      actionType: "create_task",
      relatedRecords: staleDeals.slice(0, 5).map((item) => recordRef("deal", item, "Stale deal")),
      confidence: 0.84,
      trend: "down",
      metadata: { count: staleDeals.length },
    }));
  }

  if (highValue.length) {
    insights.push(insight({
      key: "high-value-forecast",
      type: "forecast",
      priority: "medium",
      title: "Top weighted pipeline value",
      summary: `The top ${highValue.length} open opportunities carry the strongest weighted revenue signal.`,
      reasoning: [
        "Weighted value combines deal value and close probability.",
        "Prioritizing these deals improves near-term revenue focus.",
      ],
      recommendedAction: "Review the top weighted opportunities and confirm next steps are assigned.",
      actionType: "review_record",
      relatedRecords: highValue.map((item) => recordRef("deal", item, "Weighted opportunity")),
      confidence: 0.75,
      score: highValue.reduce((sum, deal) => sum + Number(deal.weighted_value || 0), 0),
      trend: "unknown",
      metadata: { weighted_value: highValue.reduce((sum, deal) => sum + Number(deal.weighted_value || 0), 0) },
    }));
  }

  return insights;
}
