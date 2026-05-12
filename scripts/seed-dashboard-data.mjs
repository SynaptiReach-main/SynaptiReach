import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const workspaceId = "88972717-05ab-46f8-bef8-c4bddef2bdf6";

await supabase.from("pipeline_stages").delete().eq("workspace_id", workspaceId);
await supabase.from("activities").delete().eq("workspace_id", workspaceId);
await supabase.from("automation_tasks").delete().eq("workspace_id", workspaceId);
await supabase.from("customer_health").delete().eq("workspace_id", workspaceId);
await supabase.from("team_performance").delete().eq("workspace_id", workspaceId);
await supabase.from("revenue_forecasts").delete().eq("workspace_id", workspaceId);

await supabase.from("pipeline_stages").insert([
  {
    workspace_id: workspaceId,
    name: "New Leads",
    count: 248,
    position: 1,
    color: "from-cyan-500/40 to-cyan-500/10"
  },
  {
    workspace_id: workspaceId,
    name: "Contacted",
    count: 186,
    position: 2,
    color: "from-sky-500/40 to-sky-500/10"
  },
  {
    workspace_id: workspaceId,
    name: "Qualified",
    count: 121,
    position: 3,
    color: "from-blue-500/40 to-blue-500/10"
  },
  {
    workspace_id: workspaceId,
    name: "Proposal Sent",
    count: 74,
    position: 4,
    color: "from-indigo-500/40 to-indigo-500/10"
  },
  {
    workspace_id: workspaceId,
    name: "Negotiation",
    count: 38,
    position: 5,
    color: "from-violet-500/40 to-violet-500/10"
  },
  {
    workspace_id: workspaceId,
    name: "Closed Won",
    count: 19,
    position: 6,
    color: "from-emerald-500/40 to-emerald-500/10"
  }
]);

await supabase.from("activities").insert([
  {
    workspace_id: workspaceId,
    message: "New enterprise lead assigned to Sarah",
    type: "lead"
  },
  {
    workspace_id: workspaceId,
    message: "AI responded to inbound inquiry",
    type: "ai"
  },
  {
    workspace_id: workspaceId,
    message: "Healthcare campaign launched",
    type: "marketing"
  },
  {
    workspace_id: workspaceId,
    message: "Pipeline status updated for Apex Logistics",
    type: "pipeline"
  },
  {
    workspace_id: workspaceId,
    message: "Client onboarding completed",
    type: "onboarding"
  }
]);

await supabase.from("automation_tasks").insert([
  {
    workspace_id: workspaceId,
    task: "Lead qualification workflow",
    status: "Running"
  },
  {
    workspace_id: workspaceId,
    task: "Email follow-up sequence",
    status: "Queued"
  },
  {
    workspace_id: workspaceId,
    task: "CRM synchronization",
    status: "Completed"
  }
]);

await supabase.from("customer_health").insert([
  {
    workspace_id: workspaceId,
    name: "Apex Logistics",
    health: "Excellent",
    usage: 92
  },
  {
    workspace_id: workspaceId,
    name: "Nova Medical",
    health: "Stable",
    usage: 74
  }
]);

await supabase.from("team_performance").insert([
  {
    workspace_id: workspaceId,
    name: "Sarah Chen",
    deals: 14,
    close_rate: 32
  },
  {
    workspace_id: workspaceId,
    name: "Marcus Reed",
    deals: 11,
    close_rate: 28
  }
]);

await supabase.from("revenue_forecasts").insert([
  {
    workspace_id: workspaceId,
    month: "Jan",
    value: 42
  },
  {
    workspace_id: workspaceId,
    month: "Feb",
    value: 51
  },
  {
    workspace_id: workspaceId,
    month: "Mar",
    value: 48
  },
  {
    workspace_id: workspaceId,
    month: "Apr",
    value: 64
  }
]);

console.log("SEEDED LIVE DASHBOARD DATA");
process.exit(0);
