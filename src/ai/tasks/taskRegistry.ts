import type { AITaskDefinition } from "../aiTypes";

export const taskRegistry = {
  lead_summary: {
    name: "lead_summary",
    localAllowed: true,
    estimatedComplexity: "light",
    requiresLongContext: false,
  },
  draft_followup: {
    name: "draft_followup",
    localAllowed: true,
    estimatedComplexity: "light",
    requiresLongContext: false,
  },
  score_lead: {
    name: "score_lead",
    localAllowed: true,
    estimatedComplexity: "light",
    requiresLongContext: false,
  },
  customer_persona_simulation: {
    name: "customer_persona_simulation",
    localAllowed: true,
    estimatedComplexity: "medium",
    requiresLongContext: false,
  },
  campaign_ideas: {
    name: "campaign_ideas",
    localAllowed: true,
    estimatedComplexity: "medium",
    requiresLongContext: false,
  },
  pipeline_analysis: {
    name: "pipeline_analysis",
    localAllowed: true,
    estimatedComplexity: "medium",
    requiresLongContext: true,
  },
  investor_report: {
    name: "investor_report",
    localAllowed: false,
    estimatedComplexity: "heavy",
    requiresLongContext: true,
  },
  autonomous_simulation: {
    name: "autonomous_simulation",
    localAllowed: false,
    estimatedComplexity: "heavy",
    requiresLongContext: true,
  },
} satisfies Record<string, AITaskDefinition>;

export type RegisteredAITaskName = keyof typeof taskRegistry;

export function getTaskDefinition(task: string): AITaskDefinition {
  return (
    taskRegistry[task as RegisteredAITaskName] || {
      name: task,
      localAllowed: false,
      estimatedComplexity: "heavy",
      requiresLongContext: true,
    }
  );
}
