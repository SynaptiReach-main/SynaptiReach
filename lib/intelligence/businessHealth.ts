import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function businessHealthInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const metrics = context.metrics || {};
  const openDeals = Number(metrics.deals?.open || 0);
  const followups = Number(metrics.leads?.total || 0) - Number(metrics.leads?.converted || 0);
  const overdue = Number(metrics.tasks?.overdue || 0);
  const score = Math.max(0, Math.min(100, 70 + openDeals * 2 - overdue * 4 - Math.max(0, followups - 50)));

  return [
    insight({
      key: "business-health",
      type: "business_health",
      priority: score < 50 ? "high" : score < 70 ? "medium" : "low",
      title: "CRM business health score",
      summary: `Deterministic business health score is ${Math.round(score)} out of 100.`,
      reasoning: [
        "Score considers open pipeline, unconverted lead load, and overdue tasks.",
        "It is deterministic and does not require external AI.",
      ],
      recommendedAction: score < 70 ? "Review overdue tasks and stale opportunities first." : "Maintain current operating cadence.",
      actionType: score < 70 ? "review_record" : "no_action",
      relatedRecords: [],
      confidence: 0.68,
      score: Math.round(score),
      trend: "unknown",
      metadata: { openDeals, followups, overdue },
    }),
  ];
}
