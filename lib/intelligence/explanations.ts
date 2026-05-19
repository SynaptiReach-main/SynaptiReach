import type { MiniBrainInsight } from "./types";

export function explainInsight(insight: MiniBrainInsight) {
  return [
    `${insight.title}: ${insight.summary}`,
    ...insight.reasoning.map((item) => `- ${item}`),
    `Recommended action: ${insight.recommendedAction}`,
    `Confidence: ${Math.round(insight.confidence * 100)}%`,
  ].join("\n");
}

export function summarizeInsights(insights: MiniBrainInsight[], limit = 5) {
  if (!insights.length) {
    return "No urgent built-in intelligence findings were detected from the available CRM data.";
  }

  return insights
    .slice(0, limit)
    .map((insight, index) => `${index + 1}. ${insight.title} - ${insight.summary}`)
    .join("\n");
}
