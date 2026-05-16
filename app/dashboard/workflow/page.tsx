"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  GitBranch,
  Loader2,
  Megaphone,
  MessageSquare,
  PlayCircle,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export default function WorkflowPage() {
  const [data, setData] = useState<any>(null);
  const [agents, setAgents] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [creating, setCreating] = useState(false);
  const [workflowAction, setWorkflowAction] = useState("");
  const [error, setError] = useState("");

  async function loadData(runAgents = false) {
    try {
      setError("");
      if (runAgents) setRunning(true);
      else setLoading(true);

      const [dashboardRes, agentsRes] = await Promise.all([
        fetch("/api/crm/dashboard"),
        fetch("/api/crm/agents/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent: runAgents ? "workflow" : "deterministic" }),
        }),
      ]);

      const dashboardData = await dashboardRes.json();
      const agentData = await agentsRes.json();

      if (!dashboardRes.ok || !dashboardData.success) {
        throw new Error(dashboardData?.error || "Failed to load workflow data.");
      }

      setData(dashboardData.data);
      if (agentData.success) setAgents(agentData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load workflow data.");
    } finally {
      setLoading(false);
      setRunning(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createReviewWorkflow() {
    try {
      setCreating(true);
      setError("");
      const response = await fetch("/api/crm/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Review-only lead follow-up workflow",
          status: "draft",
          triggerType: "lead_no_recent_communication",
          condition: "Lead has no recent outbound communication",
          action: "Create a task or draft follow-up for review",
          actions: ["create_review_task", "draft_follow_up"],
          metadata: { source: "workflow_page" },
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to create workflow.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create workflow.");
    } finally {
      setCreating(false);
    }
  }

  async function updateWorkflowStatus(workflow: any, status: string) {
    try {
      setWorkflowAction(`${workflow.id}:${status}`);
      setError("");
      const response = await fetch("/api/crm/workflows", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...workflow, status }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to update workflow.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update workflow.");
    } finally {
      setWorkflowAction("");
    }
  }

  async function runWorkflowTest(workflow: any) {
    try {
      setWorkflowAction(`${workflow.id}:run`);
      setError("");
      const response = await fetch("/api/crm/workflows/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow_id: workflow.id }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to log workflow run.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to log workflow run.");
    } finally {
      setWorkflowAction("");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-300" size={34} />
      </main>
    );
  }

  const metrics = data?.metrics || { leads: {}, campaigns: {}, communications: {} };
  const recommendations = agents?.recommendations || data?.agents?.recommendations || [];
  const recentActivity = data?.activity?.slice(0, 6) || [];
  const followups = agents?.followups || [];
  const topCampaigns = agents?.top_campaigns || [];
  const workflows = data?.workflows || [];

  return (
    <main className="min-h-screen text-white">
      <section className="mb-8 rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-6 md:p-8 shadow-2xl shadow-cyan-500/5">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
              <Workflow className="text-cyan-300" size={32} />
            </div>
            <div>
              <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
                Real CRM automation
              </div>
              <h1 className="text-4xl font-black tracking-tight">Workflow Automation</h1>
              <p className="mt-2 max-w-3xl text-gray-400">
                Reviewable workflow recommendations from real leads, campaigns, communications, and CRM activity. No external messages are sent automatically.
              </p>
            </div>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={running}
            className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 flex items-center gap-2"
          >
            {running ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
            Run Agent Review
          </button>
          <button
            onClick={createReviewWorkflow}
            disabled={creating}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2"
          >
            {creating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            Create Draft Workflow
          </button>
        </div>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          ["Leads", metrics.leads.total || 0, Users],
          ["Follow-ups Due", agents?.summary?.followups_due || 0, MessageSquare],
          ["Scheduled Campaigns", metrics.campaigns.scheduled || 0, Megaphone],
          ["Active Workflows", metrics.workflows?.active || 0, Workflow],
          ["Workflow Runs", metrics.workflows?.runs || 0, PlayCircle],
          ["Agent Confidence", `${Math.round((agents?.confidence || 0) * 100)}%`, Bot],
        ].map(([label, value, Icon]: any) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <Icon className="mb-4 text-cyan-300" size={20} />
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
        <div className="2xl:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="text-cyan-300" size={22} />
              <h2 className="text-2xl font-black">Workflow Recommendations</h2>
            </div>
            {recommendations.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                No workflow recommendations yet. Add leads, campaigns, or communications to generate automation guidance.
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((item: any, index: number) => (
                  <div key={index} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-black text-white">{item.title || item.type || "Workflow recommendation"}</h3>
                        <p className="mt-1 text-sm text-gray-400">{item.description || item.action || "Review before acting."}</p>
                      </div>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">
                        {item.priority || "review"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-5">
              <GitBranch className="text-cyan-300" size={22} />
              <h2 className="text-2xl font-black">Saved Workflows</h2>
            </div>
            {workflows.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                No saved workflows yet. Create a draft workflow from real CRM signals, then review it before activating.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {workflows.map((workflow: any) => (
                  <div key={workflow.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <Zap className="mb-3 text-cyan-300" size={20} />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-black">{workflow.name}</h3>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{workflow.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">{workflow.trigger_type || "Manual review"} - {workflow.action || "Review before running."}</p>
                    <div className="mt-3 text-xs text-gray-500">Last run: {formatDate(workflow.last_run_at)}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button disabled={workflowAction === `${workflow.id}:active`} onClick={() => updateWorkflowStatus(workflow, "active")} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60">Activate</button>
                      <button disabled={workflowAction === `${workflow.id}:paused`} onClick={() => updateWorkflowStatus(workflow, "paused")} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">Pause</button>
                      <button disabled={workflowAction === `${workflow.id}:run`} onClick={() => runWorkflowTest(workflow)} className="rounded-xl border border-green-400/20 bg-green-500/10 px-3 py-2 text-xs font-bold text-green-100 disabled:opacity-60">Log Test Run</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-5">
              <GitBranch className="text-cyan-300" size={22} />
              <h2 className="text-2xl font-black">Reviewable Workflow Cards</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <Zap className="mb-3 text-cyan-300" size={20} />
                <h3 className="font-black">Lead Follow-Up Workflow</h3>
                <p className="mt-2 text-sm text-gray-400">{followups.length} real leads currently need follow-up according to agent review.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <CheckCircle2 className="mb-3 text-cyan-300" size={20} />
                <h3 className="font-black">Campaign Optimization Workflow</h3>
                <p className="mt-2 text-sm text-gray-400">{topCampaigns.length} campaigns have enough recent data for review or variant suggestions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
            <div className="flex items-center gap-3 mb-5">
              <Activity className="text-cyan-300" size={20} />
              <h2 className="text-xl font-black">Recent Automation Signals</h2>
            </div>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-sm text-gray-400">No activity signals yet.</div>
              ) : recentActivity.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="font-bold text-white">{item.action || item.type || "Activity"}</div>
                  <div className="text-sm text-gray-500">{item.details || item.message || ""}</div>
                  <div className="mt-2 text-xs text-gray-600">{formatDate(item.created_at)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-black mb-4">Safety</h2>
            <p className="text-sm text-gray-400">
              Workflow actions are recommendations only. SynaptiReach will not send external email, SMS, or social posts without explicit user action.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
