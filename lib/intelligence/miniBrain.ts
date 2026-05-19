import { buildExecutiveSummary } from "./executiveSummary";
import { buildMiniBrainHelperResults } from "./helperResults";
import { nextBestAction } from "./nextBestAction";
import { averageConfidence, sortInsights } from "./priorityEngine";
import { insightToRecommendation, nextActionsFromInsights } from "./recommendations";
import { dedupeInsights, miniBrainRuleRegistry, runRegisteredRules } from "./ruleRegistry";
import { buildMiniBrainScores } from "./scorecards";
import type { MiniBrainContext, MiniBrainResult } from "./types";

export function runMiniBrain(context: MiniBrainContext): MiniBrainResult {
  const generatedAt = new Date().toISOString();
  const insights = sortInsights(dedupeInsights(runRegisteredRules(context)));
  const scores = buildMiniBrainScores(context, insights);
  const helperResults = buildMiniBrainHelperResults(context, insights, scores);

  return {
    success: true,
    generatedAt,
    summary: {
      ...buildExecutiveSummary(context, insights),
      next_best_action: nextBestAction(insights),
      insight_count: insights.length,
      scorecards: scores,
    },
    scores,
    helperResults,
    insights,
    recommendations: insights.map(insightToRecommendation),
    actions: nextActionsFromInsights(insights),
    confidence: averageConfidence(insights),
    data_used: {
      leads: (context.leads || []).length,
      campaigns: (context.campaigns || []).length,
      communications: (context.communications || []).length,
      activity: (context.activity || []).length,
      deals: (context.deals || []).length,
      tasks: (context.tasks || []).length,
      workflows: (context.workflows || []).length,
      workflowRuns: (context.workflowRuns || []).length,
      appointments: (context.appointments || []).length,
      agentRuns: (context.agentRuns || []).length,
      notifications: (context.notifications || []).length,
      staff: (context.staff || []).length,
      usage: (context.usage || []).length,
      providerConnections: (context.providerConnections || []).length,
      scores: scores.length,
      helperResults: Object.keys(helperResults).filter((key) => {
        const value = (helperResults as Record<string, unknown>)[key];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      }),
      rules: miniBrainRuleRegistry.map((rule) => rule.metadata.id),
    },
    provider: "mini_brain",
    model: "deterministic-rules",
    fallback_used: false,
    provider_errors: [],
    provider_warnings: [],
  };
}
