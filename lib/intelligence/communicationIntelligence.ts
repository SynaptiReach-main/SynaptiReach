import { insight, recordRef } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function communicationInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const communications = context.communications || [];
  const unread = communications.filter((item) => item.direction === "inbound" || item.status === "received");
  const failed = communications.filter((item) => item.status === "failed");
  const insights: MiniBrainInsight[] = [];

  if (unread.length) {
    insights.push(insight({
      key: "unread-inbound",
      type: "communication_intelligence",
      priority: unread.length >= 5 ? "urgent" : "high",
      title: "Inbound replies need review",
      summary: `${unread.length} inbound conversation${unread.length === 1 ? "" : "s"} may need a response.`,
      reasoning: [
        "Inbound or received communications are customer intent signals.",
        "Review-gated drafting can prepare replies without sending externally.",
      ],
      recommendedAction: "Review inbound replies and draft responses for qualified conversations.",
      actionType: "draft_message",
      relatedRecords: unread.slice(0, 5).map((item) => recordRef("communication", item, "Inbound reply")),
      confidence: 0.86,
      trend: "unknown",
      metadata: { count: unread.length },
    }));
  }

  if (failed.length) {
    insights.push(insight({
      key: "failed-messages",
      type: "safety_compliance",
      priority: "medium",
      title: "Failed messages should be checked",
      summary: `${failed.length} communication${failed.length === 1 ? "" : "s"} failed delivery.`,
      reasoning: ["Failed sends can hide broken provider setup or invalid contact data."],
      recommendedAction: "Review failed messages before retrying any external send.",
      actionType: "review_record",
      relatedRecords: failed.slice(0, 5).map((item) => recordRef("communication", item, "Failed message")),
      confidence: 0.78,
      trend: "unknown",
      metadata: { count: failed.length },
    }));
  }

  return insights;
}
