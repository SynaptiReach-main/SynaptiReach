import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function onboardingInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const settings = context.settings || {};
  const warnings = [...(context.schemaWarnings || []), ...(context.workspaceWarnings || [])];
  const insights: MiniBrainInsight[] = [];

  if (warnings.length) {
    insights.push(insight({
      key: "setup-warnings",
      type: "onboarding_setup",
      priority: "high",
      title: "Workspace setup needs attention",
      summary: "Some CRM setup checks returned warnings.",
      reasoning: warnings.slice(0, 3),
      recommendedAction: "Review settings and schema setup before relying on automation.",
      actionType: "fix_setup",
      relatedRecords: [],
      confidence: 0.88,
      trend: "unknown",
      metadata: { warnings },
    }));
  }

  if (!settings || Object.keys(settings).length === 0) {
    insights.push(insight({
      key: "missing-settings",
      type: "onboarding_setup",
      priority: "medium",
      title: "CRM settings are not fully configured",
      summary: "Built-in intelligence could not find a complete CRM settings record.",
      reasoning: ["Settings define workspace goals, provider state, and safe automation defaults."],
      recommendedAction: "Open settings and complete the CRM setup fields.",
      actionType: "fix_setup",
      relatedRecords: [],
      confidence: 0.7,
      trend: "unknown",
    }));
  }

  return insights;
}
