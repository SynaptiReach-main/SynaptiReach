import { clampScore, scoreBand } from "./scoringConfig";
import type { MiniBrainContext, MiniBrainInsight, MiniBrainScore } from "./types";

function metricValue(context: MiniBrainContext, section: string, key: string) {
  const sectionValue = (context.metrics as any)?.[section] || {};
  return Number(sectionValue[key] || 0);
}

function score(label: string, value: number, reasons: string[], nextAction?: string, metadata?: Record<string, unknown>): MiniBrainScore {
  const normalized = clampScore(value);
  return {
    label,
    score: normalized,
    maxScore: 100,
    band: scoreBand(normalized),
    reasons,
    nextAction,
    metadata,
  };
}

export function buildMiniBrainScores(context: MiniBrainContext, insights: MiniBrainInsight[]): MiniBrainScore[] {
  const totalLeads = metricValue(context, "leads", "total");
  const convertedLeads = metricValue(context, "leads", "converted");
  const qualifiedLeads = metricValue(context, "leads", "qualified");
  const overdueTasks = metricValue(context, "tasks", "overdue");
  const openTasks = metricValue(context, "tasks", "open");
  const openDeals = metricValue(context, "deals", "open");
  const openDealValue = metricValue(context, "deals", "open_value");
  const delivered = metricValue(context, "campaigns", "delivered");
  const opened = metricValue(context, "campaigns", "opened");
  const clicked = metricValue(context, "campaigns", "clicked");
  const failedMessages = metricValue(context, "communications", "failed");
  const totalMessages = metricValue(context, "communications", "total");
  const providerSetupRequired = metricValue(context, "providers", "setup_required");
  const providerTotal = metricValue(context, "providers", "total");
  const urgentInsights = insights.filter((item) => item.priority === "urgent").length;
  const highInsights = insights.filter((item) => item.priority === "high").length;
  const schemaWarnings = context.schemaWarnings?.length || 0;
  const workspaceWarnings = context.workspaceWarnings?.length || 0;

  const conversionSignal = totalLeads > 0 ? ((convertedLeads + qualifiedLeads * 0.45) / totalLeads) * 100 : 45;
  const taskDrag = openTasks > 0 ? Math.min(35, (overdueTasks / openTasks) * 35) : 0;
  const riskDrag = urgentInsights * 8 + highInsights * 3 + schemaWarnings * 8 + workspaceWarnings * 4;

  const campaignHealth =
    delivered > 0
      ? ((opened / delivered) * 55 + (clicked / delivered) * 120 + (failedMessages > 0 ? -8 : 0))
      : 52;

  const providerReadiness =
    providerTotal > 0 ? 100 - Math.min(65, (providerSetupRequired / providerTotal) * 65) : 58;

  return [
    score(
      "Business health",
      52 + conversionSignal * 0.28 + Math.min(16, openDeals * 2) - taskDrag - riskDrag,
      [
        `${totalLeads} leads, ${qualifiedLeads} qualified, and ${convertedLeads} converted records are in the current workspace context.`,
        `${overdueTasks} overdue task${overdueTasks === 1 ? "" : "s"} and ${urgentInsights} urgent insight${urgentInsights === 1 ? "" : "s"} reduce the score.`,
      ],
      "Review top risks first, then assign the highest-confidence next actions.",
      { total_leads: totalLeads, urgent_insights: urgentInsights }
    ),
    score(
      "Pipeline focus",
      45 + Math.min(35, openDeals * 3) + Math.min(20, openDealValue / 50000) - Math.min(18, overdueTasks * 2),
      [
        `${openDeals} open deal${openDeals === 1 ? "" : "s"} are contributing to forecast focus.`,
        `Open pipeline value is ${openDealValue}, with overdue tasks treated as forecast risk.`,
      ],
      "Confirm next steps on the highest-value or stalest opportunities.",
      { open_deals: openDeals, open_value: openDealValue }
    ),
    score(
      "Marketing efficiency",
      42 + Math.min(30, campaignHealth) + Math.min(16, clicked / 5) - Math.min(12, failedMessages * 2),
      [
        `${delivered} delivered, ${opened} opened, and ${clicked} clicked campaign events were evaluated.`,
        "Failed messages and low click-through signals lower this deterministic score.",
      ],
      "Review underperforming campaigns and draft a follow-up workflow for engaged non-clickers.",
      { delivered, opened, clicked }
    ),
    score(
      "Setup readiness",
      providerReadiness - schemaWarnings * 10 - workspaceWarnings * 6,
      [
        `${providerSetupRequired} provider connection${providerSetupRequired === 1 ? "" : "s"} need setup or attention.`,
        `${schemaWarnings + workspaceWarnings} schema/workspace warning${schemaWarnings + workspaceWarnings === 1 ? "" : "s"} are present.`,
      ],
      "Finish missing provider/setup items before approving external sends.",
      { provider_total: providerTotal, provider_setup_required: providerSetupRequired }
    ),
    score(
      "CRM hygiene",
      82 - Math.min(30, overdueTasks * 3) - Math.min(20, failedMessages * 4) - Math.min(20, highInsights * 2),
      [
        `${overdueTasks} overdue task${overdueTasks === 1 ? "" : "s"} and ${failedMessages} failed communication${failedMessages === 1 ? "" : "s"} need cleanup.`,
        `${totalMessages} communication record${totalMessages === 1 ? "" : "s"} are available for review-gated follow-up checks.`,
      ],
      "Batch overdue work, review failed messages, and keep duplicate cleanup human-confirmed.",
      { overdue_tasks: overdueTasks, failed_messages: failedMessages }
    ),
  ];
}
