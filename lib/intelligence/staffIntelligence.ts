import { insight, recordRef } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function staffInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const staff = context.staff || [];
  const tasks = context.tasks || [];
  const insights: MiniBrainInsight[] = [];
  const unassigned = tasks.filter((task) =>
    task.status === "open" && !task.assigned_staff_id && (!task.assigned_to || task.assigned_to === "Owner / Me")
  );
  const overdueByStaff = staff
    .map((member) => ({
      member,
      overdue: tasks.filter((task) =>
        task.status === "open" &&
        task.assigned_staff_id === member.id &&
        task.due_date &&
        new Date(task.due_date).getTime() < Date.now()
      ),
    }))
    .filter((row) => row.overdue.length > 0)
    .sort((a, b) => b.overdue.length - a.overdue.length);

  if (staff.length && unassigned.length) {
    insights.push(insight({
      key: "unassigned-staff-work",
      type: "staff_team",
      priority: unassigned.length >= 10 ? "high" : "medium",
      title: "Open work needs an owner",
      summary: `${unassigned.length} open task${unassigned.length === 1 ? "" : "s"} are still assigned to the owner/default queue.`,
      reasoning: [
        "Unassigned work can hide bottlenecks even when staff members exist.",
        "Assignments remain review-gated and do not notify staff until the user confirms.",
      ],
      recommendedAction: "Review workload and assign the highest-impact tasks to available staff.",
      actionType: "assign_staff",
      relatedRecords: unassigned.slice(0, 5).map((task) => recordRef("task", task, "Unassigned task")),
      confidence: 0.82,
      trend: "unknown",
      metadata: { staff_count: staff.length, unassigned_count: unassigned.length },
    }));
  }

  if (overdueByStaff.length) {
    const top = overdueByStaff[0];
    insights.push(insight({
      key: "staff-overdue-workload",
      type: "staff_team",
      priority: top.overdue.length >= 5 ? "high" : "medium",
      title: "Staff workload needs review",
      summary: `${top.member.name || top.member.email || "A staff member"} has ${top.overdue.length} overdue assigned task${top.overdue.length === 1 ? "" : "s"}.`,
      reasoning: [
        "Overdue assigned tasks can indicate a capacity issue, missing handoff, or stale assignment.",
        "Reassignment should be reviewed by a user with staff/task permission.",
      ],
      recommendedAction: "Review overdue staff workload and reassign or reschedule tasks where appropriate.",
      actionType: "assign_staff",
      relatedRecords: top.overdue.slice(0, 5).map((task) => recordRef("task", task, "Overdue staff task")),
      confidence: 0.78,
      trend: "down",
      metadata: {
        staff_id: top.member.id,
        overdue_count: top.overdue.length,
      },
    }));
  }

  return insights;
}
