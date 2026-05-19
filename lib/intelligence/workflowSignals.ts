import { insight, recordRef } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function workflowSignalInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const workflows = context.workflows || [];
  const runs = context.workflowRuns || [];
  const activeCount = workflows.filter((workflow) => workflow.status === "active").length;
  const failedRuns = runs.filter((run) => run.status === "failed");
  const insights: MiniBrainInsight[] = [];

  if (!activeCount && (context.leads || []).length > 0) {
    insights.push(insight({
      key: "no-active-workflows",
      type: "workflow_intelligence",
      priority: "medium",
      title: "No active nurture workflow",
      summary: "Leads exist, but no active workflow is currently recorded.",
      reasoning: ["Manual follow-up becomes harder as lead volume grows."],
      recommendedAction: "Create a review-only nurture workflow draft for stale and new leads.",
      actionType: "create_workflow",
      relatedRecords: [],
      confidence: 0.72,
      trend: "unknown",
    }));
  }

  if (failedRuns.length) {
    insights.push(insight({
      key: "failed-workflow-runs",
      type: "workflow_intelligence",
      priority: "high",
      title: "Workflow runs failed",
      summary: `${failedRuns.length} workflow run${failedRuns.length === 1 ? "" : "s"} failed.`,
      reasoning: ["Failed workflow runs can block follow-up and automation queues."],
      recommendedAction: "Review failed workflow runs before enabling more automation.",
      actionType: "review_record",
      relatedRecords: failedRuns.slice(0, 5).map((item) => recordRef("workflow_run", item, "Failed run")),
      confidence: 0.82,
      trend: "down",
      metadata: { count: failedRuns.length },
    }));
  }

  return insights;
}
