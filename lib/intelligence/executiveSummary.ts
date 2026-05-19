import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function buildExecutiveSummary(context: MiniBrainContext, insights: MiniBrainInsight[]) {
  const metrics = context.metrics || {};
  return {
    hot_leads: metrics.leads?.hot || insights.filter((item) => item.type === "lead_intelligence" && item.priority === "high").length,
    followups_due: insights.filter((item) => item.actionType === "draft_message").length,
    campaign_count: (context.campaigns || []).length,
    open_deals: metrics.deals?.open || (context.deals || []).filter((deal) => deal.status === "open").length,
    pipeline_value: metrics.deals?.open_value || (context.deals || []).reduce((sum, deal) => sum + Number(deal.value || 0), 0),
    overdue_tasks: metrics.tasks?.overdue || (context.tasks || []).filter((task) => task.status === "open" && task.due_date && new Date(task.due_date).getTime() < Date.now()).length,
    active_workflows: metrics.workflows?.active || (context.workflows || []).filter((workflow) => workflow.status === "active").length,
    upcoming_appointments: metrics.appointments?.upcoming || 0,
    urgent_insights: insights.filter((item) => item.priority === "urgent").length,
    high_priority_insights: insights.filter((item) => item.priority === "high").length,
  };
}
