import type { MiniBrainInsight } from "./types";

export function nextBestAction(insights: MiniBrainInsight[]) {
  const top = insights[0];
  if (!top) return "No action needed yet. Add CRM activity to generate deterministic guidance.";
  return top.recommendedAction;
}
