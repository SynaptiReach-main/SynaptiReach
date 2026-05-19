import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function anomalyInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const campaigns = context.campaigns || [];
  const failed = (context.communications || []).filter((item) => item.status === "failed").length;
  const sent = (context.communications || []).filter((item) => item.status === "sent").length;
  const insights: MiniBrainInsight[] = [];

  if (sent >= 10 && failed / sent >= 0.2) {
    insights.push(insight({
      key: "message-failure-rate",
      type: "anomaly",
      priority: "high",
      title: "Message failure rate looks unusual",
      summary: "Failed communications are high relative to sent messages.",
      reasoning: ["High failure rates can indicate provider setup, bad contact data, or compliance risk."],
      recommendedAction: "Pause retries and review failed communication records.",
      actionType: "review_record",
      relatedRecords: [],
      confidence: 0.78,
      trend: "down",
      metadata: { failed, sent },
    }));
  }

  if (campaigns.some((campaign) => Number(campaign.unsubscribed_count || 0) > 10)) {
    insights.push(insight({
      key: "unsubscribe-spike",
      type: "anomaly",
      priority: "high",
      title: "Unsubscribe spike detected",
      summary: "One or more campaigns show elevated unsubscribe counts.",
      reasoning: ["High unsubscribe volume may indicate poor audience fit or over-messaging."],
      recommendedAction: "Review campaign targeting before sending another sequence.",
      actionType: "review_campaign",
      relatedRecords: [],
      confidence: 0.76,
      trend: "down",
    }));
  }

  return insights;
}
