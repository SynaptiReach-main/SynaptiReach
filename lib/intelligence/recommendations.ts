import type { MiniBrainInsight } from "./types";

export function insightToRecommendation(insight: MiniBrainInsight) {
  return {
    id: insight.id,
    type: insight.type,
    priority: insight.priority,
    title: insight.title,
    description: insight.summary,
    reasoning: insight.reasoning,
    action: insight.actionType,
    recommended_action: insight.recommendedAction,
    confidence: insight.confidence,
    related_records: insight.relatedRecords,
    source: insight.source,
    metadata: insight.metadata || {},
  };
}

export function nextActionsFromInsights(insights: MiniBrainInsight[]) {
  return Array.from(new Set(insights.map((insight) => insight.actionType)));
}
