import { insight, recordRef } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function taskInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const tasks = context.tasks || [];
  const overdue = tasks.filter((task) => task.status === "open" && task.due_date && new Date(task.due_date).getTime() < Date.now());
  const unassigned = tasks.filter((task) => task.status === "open" && !task.assigned_to && !task.owner_id);
  const insights: MiniBrainInsight[] = [];

  if (overdue.length) {
    insights.push(insight({
      key: "overdue-tasks",
      type: "task_intelligence",
      priority: overdue.length >= 10 ? "urgent" : "high",
      title: "Overdue tasks need triage",
      summary: `${overdue.length} open task${overdue.length === 1 ? "" : "s"} are past due.`,
      reasoning: ["Overdue CRM tasks often represent stalled follow-up or missed commitments."],
      recommendedAction: "Triage overdue tasks, close completed items, and reassign blocked work.",
      actionType: "assign_staff",
      relatedRecords: overdue.slice(0, 5).map((item) => recordRef("task", item, "Overdue task")),
      confidence: 0.9,
      trend: "down",
      metadata: { count: overdue.length },
    }));
  }

  if (unassigned.length) {
    insights.push(insight({
      key: "unassigned-tasks",
      type: "staff_team",
      priority: "medium",
      title: "Tasks need owners",
      summary: `${unassigned.length} open task${unassigned.length === 1 ? "" : "s"} do not have an owner.`,
      reasoning: ["Unassigned work is less likely to be completed on time."],
      recommendedAction: "Assign owners to open tasks before creating more automation.",
      actionType: "assign_staff",
      relatedRecords: unassigned.slice(0, 5).map((item) => recordRef("task", item, "Unassigned task")),
      confidence: 0.74,
      trend: "unknown",
      metadata: { count: unassigned.length },
    }));
  }

  return insights;
}
