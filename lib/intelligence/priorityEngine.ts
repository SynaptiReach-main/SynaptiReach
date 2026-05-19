import type { MiniBrainInsight } from "./types";

const priorityWeight = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function sortInsights(insights: MiniBrainInsight[]) {
  return [...insights].sort((a, b) => {
    const priorityDelta = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDelta) return priorityDelta;
    return b.confidence - a.confidence;
  });
}

export function averageConfidence(insights: MiniBrainInsight[]) {
  if (!insights.length) return 0.35;
  return Number(
    (
      insights.reduce((sum, item) => sum + item.confidence, 0) /
      insights.length
    ).toFixed(2)
  );
}
