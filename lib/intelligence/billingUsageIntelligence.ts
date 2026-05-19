import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function billingUsageInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const settingsUsage = context.settings?.usage || context.settings?.metadata?.usage || {};
  const eventUsage = (context.usage || []).reduce((totals: Record<string, number>, event) => {
    const key = event.usage_type || "unknown";
    totals[key] = (totals[key] || 0) + Number(event.quantity || 0);
    return totals;
  }, {});
  const usage = { ...settingsUsage, ...eventUsage };
  const aiUsed = Number(usage.ai_actions_used || usage.ai || usage.ai_action || 0);
  const aiCap = Number(usage.ai_actions_cap || usage.ai_cap || context.billing?.metadata?.ai_cap || 0);
  const emailUsed = Number(usage.email || usage.email_send || usage.email_sent || 0);
  const smsUsed = Number(usage.sms || usage.sms_send || usage.sms_sent || 0);
  const insights: MiniBrainInsight[] = [];

  if (aiCap > 0 && aiUsed / aiCap >= 0.85) {
    insights.push(insight({
      key: "ai-cap-warning",
      type: "billing_usage_intelligence",
      priority: aiUsed >= aiCap ? "urgent" : "high",
      title: "AI usage is near the account cap",
      summary: `AI usage is at ${aiUsed} of ${aiCap} included actions.`,
      reasoning: ["Usage caps protect managed-provider costs and prevent surprise overages."],
      recommendedAction: "Review usage and consider BYOK, credit packs, or an upgrade before running heavy AI tasks.",
      actionType: "review_billing",
      relatedRecords: [],
      confidence: 0.86,
      score: Math.round((aiUsed / aiCap) * 100),
      trend: "up",
      metadata: { aiUsed, aiCap },
    }));
  }

  if ((emailUsed || smsUsed) && !context.billing) {
    insights.push(insight({
      key: "usage-without-billing-account",
      type: "billing_usage_intelligence",
      priority: "medium",
      title: "Usage exists before billing is fully connected",
      summary: "Communication usage is recorded, but no billing account record was loaded.",
      reasoning: [
        "Usage should be visible before caps or trials are enforced.",
        "Billing actions remain checkout/webhook-gated and are not changed by mini-brain.",
      ],
      recommendedAction: "Review billing setup and usage caps before enabling high-volume sends.",
      actionType: "review_billing",
      relatedRecords: [],
      confidence: 0.7,
      trend: "unknown",
      metadata: { emailUsed, smsUsed },
    }));
  }

  return insights;
}
