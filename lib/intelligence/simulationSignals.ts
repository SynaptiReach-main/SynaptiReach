import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function simulationSignalMetadata(insights: MiniBrainInsight[]) {
  return {
    insight_count: insights.length,
    high_priority_count: insights.filter((item) => ["urgent", "high"].includes(item.priority)).length,
    generated_by: "mini_brain",
  };
}

export function simulationInsights(context: MiniBrainContext): MiniBrainInsight[] {
  if (!context.isTestWorkspace) return [];

  return [
    insight({
      key: "test-workspace-simulation",
      type: "simulation",
      priority: "low",
      title: "Simulation workspace intelligence enabled",
      summary: "This workspace can use deterministic simulation-aware recommendations because it is explicitly marked as test data.",
      reasoning: [
        "Simulation insights are only returned when the workspace context is marked test-only.",
        "Normal workspaces receive real-data deterministic intelligence only.",
      ],
      recommendedAction: "Use simulation controls to seed or tick test data when local secrets are configured.",
      actionType: "no_action",
      relatedRecords: [],
      confidence: 0.9,
      trend: "unknown",
      metadata: {
        is_test_workspace: true,
        simulation_source: "synaptireach_test_workspace",
      },
    }),
  ];
}
