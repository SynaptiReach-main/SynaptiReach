import { appointmentInsights } from "./appointmentIntelligence";
import { anomalyInsights } from "./anomalyDetection";
import { billingUsageInsights } from "./billingUsageIntelligence";
import { businessHealthInsights } from "./businessHealth";
import { campaignInsights } from "./campaignIntelligence";
import { communicationInsights } from "./communicationIntelligence";
import { crmHygieneInsights } from "./crmHygiene";
import { leadInsights } from "./leadIntelligence";
import { onboardingInsights } from "./onboardingIntelligence";
import { pipelineInsights } from "./pipelineIntelligence";
import { safetyInsights } from "./safetyChecks";
import { simulationInsights } from "./simulationSignals";
import { staffInsights } from "./staffIntelligence";
import { taskInsights } from "./taskIntelligence";
import type { MiniBrainContext, MiniBrainInsight, MiniBrainRuleMetadata } from "./types";
import { workflowSignalInsights } from "./workflowSignals";

export type MiniBrainRule = {
  domain: MiniBrainInsight["type"];
  metadata: MiniBrainRuleMetadata;
  run: (context: MiniBrainContext) => MiniBrainInsight[];
};

export const miniBrainRuleRegistry: MiniBrainRule[] = [
  rule("lead-intelligence", "lead_intelligence", "high", ["leads"], ["draft_message", "create_task", "review_record"], "/dashboard/leads", leadInsights),
  rule("communication-intelligence", "communication_intelligence", "high", ["communications"], ["draft_message", "review_record"], "/dashboard/communications", communicationInsights),
  rule("campaign-intelligence", "campaign_intelligence", "medium", ["campaigns"], ["review_campaign", "create_workflow"], "/dashboard/marketing", campaignInsights),
  rule("pipeline-intelligence", "pipeline_intelligence", "high", ["deals"], ["create_task", "review_record"], "/dashboard/pipeline", pipelineInsights),
  rule("task-intelligence", "task_intelligence", "high", ["tasks"], ["assign_staff", "create_task"], "/dashboard/tasks", taskInsights),
  rule("appointment-intelligence", "appointment_intelligence", "medium", ["appointments"], ["schedule_appointment", "draft_message"], "/dashboard/calendar", appointmentInsights),
  rule("workflow-signals", "workflow_intelligence", "medium", ["workflows", "workflowRuns"], ["create_workflow", "review_record"], "/dashboard/workflow", workflowSignalInsights),
  rule("billing-usage", "billing_usage_intelligence", "high", ["billing", "usage", "settings"], ["review_billing", "suggest_upgrade"], "/dashboard/settings", billingUsageInsights),
  rule("onboarding", "onboarding_setup", "medium", ["settings"], ["fix_setup"], "/dashboard/settings", onboardingInsights),
  rule("staff", "staff_team", "medium", ["staff", "tasks"], ["assign_staff"], "/dashboard/tasks", staffInsights),
  rule("anomalies", "anomaly", "medium", ["metrics"], ["flag_risk"], "/dashboard/analytics", anomalyInsights),
  rule("business-health", "business_health", "medium", ["metrics"], ["review_record", "no_action"], "/dashboard/analytics", businessHealthInsights),
  rule("crm-hygiene", "safety_compliance", "medium", ["leads", "tasks", "deals"], ["review_record"], "/dashboard", crmHygieneInsights),
  rule("safety", "safety_compliance", "urgent", ["settings"], ["fix_setup", "review_record"], "/dashboard/settings", safetyInsights),
  rule("simulation", "simulation", "low", ["settings"], ["no_action"], "/dashboard/settings", simulationInsights),
];

function rule(
  id: string,
  domain: MiniBrainInsight["type"],
  severity: MiniBrainRuleMetadata["severity"],
  requiredInputs: MiniBrainRuleMetadata["requiredInputs"],
  actionTypes: MiniBrainRuleMetadata["actionTypes"],
  destination: string,
  run: (context: MiniBrainContext) => MiniBrainInsight[]
): MiniBrainRule {
  return {
    domain,
    metadata: {
      id,
      category: domain,
      severity,
      requiredInputs,
      actionTypes,
      destination,
      enabledByDefault: true,
    },
    run,
  };
}

export function runRegisteredRules(context: MiniBrainContext) {
  return miniBrainRuleRegistry.flatMap((rule) =>
    rule.run(context).map((insight) => ({
      ...insight,
      metadata: {
        ...(insight.metadata || {}),
        rule_id: rule.metadata.id,
        rule_category: rule.metadata.category,
        destinationPage: rule.metadata.destination,
        review_required: insight.actionType !== "no_action",
      },
    }))
  );
}

export function dedupeInsights(insights: MiniBrainInsight[]) {
  const seen = new Set<string>();
  return insights.filter((insight) => {
    const key = `${insight.id}:${insight.actionType}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
