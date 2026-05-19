import type { MiniBrainInsight } from "./types";

export function routeForInsight(insight: MiniBrainInsight) {
  const first = Array.isArray(insight.relatedRecords) ? insight.relatedRecords[0] : null;
  const type = String(first?.type || "").toLowerCase();
  const id = first?.id ? encodeURIComponent(String(first.id)) : "";
  if (id && type.includes("lead")) return `/dashboard/leads?leadId=${id}`;
  if (id && (type.includes("deal") || type.includes("pipeline"))) return `/dashboard/pipeline?dealId=${id}`;
  if (id && type.includes("task")) return `/dashboard/tasks?taskId=${id}`;
  if (id && (type.includes("appointment") || type.includes("calendar"))) return `/dashboard/calendar?appointmentId=${id}`;
  if (id && (type.includes("campaign") || type.includes("marketing"))) return `/dashboard/marketing?campaignId=${id}`;
  if (id && (type.includes("conversation") || type.includes("communication") || type.includes("message"))) return `/dashboard/communications?conversationId=${id}`;
  if (id && type.includes("workflow")) return `/dashboard/workflow?workflowId=${id}`;
  if (insight.type === "lead_intelligence") return "/dashboard/leads";
  if (insight.type === "deal_intelligence" || insight.type === "pipeline_intelligence" || insight.type === "forecast") return "/dashboard/pipeline";
  if (insight.type === "communication_intelligence") return "/dashboard/communications";
  if (insight.type === "campaign_intelligence") return "/dashboard/marketing";
  if (insight.type === "workflow_intelligence") return "/dashboard/workflow";
  if (insight.type === "task_intelligence") return "/dashboard/tasks";
  if (insight.type === "appointment_intelligence") return "/dashboard/calendar";
  if (insight.type === "billing_usage_intelligence" || insight.type === "onboarding_setup") return "/dashboard/settings#billing";
  return "/dashboard/ai_assistant";
}

export function safeActionLabel(actionType: MiniBrainInsight["actionType"]) {
  const labels: Record<MiniBrainInsight["actionType"], string> = {
    create_task: "Draft task",
    draft_message: "Draft message",
    create_workflow: "Draft workflow",
    notify_user: "Create notification",
    suggest_upgrade: "Review plan",
    review_record: "Review record",
    assign_staff: "Assign staff",
    schedule_appointment: "Schedule appointment",
    review_campaign: "Review campaign",
    review_billing: "Review billing",
    fix_setup: "Fix setup",
    flag_risk: "Flag risk",
    open_modal: "Open details",
    no_action: "No action",
  };

  return labels[actionType] || "Review";
}
