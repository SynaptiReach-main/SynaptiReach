import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function safetyInsights(_context: MiniBrainContext): MiniBrainInsight[] {
  return [
    insight({
      key: "review-gated-safety",
      type: "safety_compliance",
      priority: "low",
      title: "External actions remain review-gated",
      summary: "Mini-brain recommendations can draft, queue, and guide, but do not send externally by themselves.",
      reasoning: [
        "Review-gated autonomy prevents irreversible sends or billing actions without human confirmation.",
      ],
      recommendedAction: "Review each drafted action before sending email, SMS, social posts, or billing changes.",
      actionType: "no_action",
      relatedRecords: [],
      confidence: 1,
      trend: "flat",
    }),
  ];
}
