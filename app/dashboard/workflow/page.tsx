"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock,
  Eye,
  GitBranch,
  Loader2,
  Megaphone,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";
import OwnerFocusPanel from "@/components/dashboard/OwnerFocusPanel";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

const workflowTemplates = [
  {
    name: "New lead follow-up workflow",
    summary: "Creates a review task and draft follow-up when a new lead enters the CRM.",
    triggerType: "lead_created",
    condition: "Lead status is new and no owner follow-up exists.",
    action: "Create review task and draft first-touch message.",
    actions: ["create_review_task", "draft_email_follow_up", "notify_owner"],
  },
  {
    name: "Missed follow-up reminder",
    summary: "Flags leads and deals that have gone quiet after the expected follow-up window.",
    triggerType: "follow_up_overdue",
    condition: "Open task is overdue or lead has no recent communication.",
    action: "Create overdue follow-up task for review.",
    actions: ["create_high_priority_task", "notify_owner"],
  },
  {
    name: "Opened-not-clicked campaign follow-up",
    summary: "Recommends a lighter follow-up for leads who opened a campaign but did not click.",
    triggerType: "campaign_open_without_click",
    condition: "Campaign has opens and zero clicks or matching lead did not click.",
    action: "Draft follow-up campaign or task for review.",
    actions: ["create_campaign_recommendation", "draft_follow_up"],
  },
  {
    name: "Clicked-not-converted follow-up",
    summary: "Creates a review task for leads who clicked but have not converted.",
    triggerType: "campaign_click_without_conversion",
    condition: "Campaign has clicks and no conversion or matching lead is still open.",
    action: "Create follow-up task and draft next-step message for review.",
    actions: ["create_review_task", "draft_email_follow_up"],
  },
  {
    name: "High-intent lead alert",
    summary: "Surfaces conversion or request-info events so the owner can act quickly.",
    triggerType: "high_intent_event",
    condition: "Lead has conversion, click, request-info, or qualified status signal.",
    action: "Create alert notification and next-step task.",
    actions: ["create_notification", "create_priority_task"],
  },
  {
    name: "Appointment confirmation workflow",
    summary: "Creates a reviewable appointment suggestion when communication indicates a confirmed meeting.",
    triggerType: "appointment_intent_detected",
    condition: "Message text indicates a confirmed or requested appointment.",
    action: "Create appointment draft and notify owner.",
    actions: ["create_appointment_draft", "notify_owner"],
  },
  {
    name: "Appointment reminder workflow",
    summary: "Reminds the team to review upcoming internal appointments before they happen.",
    triggerType: "appointment_upcoming",
    condition: "Appointment starts within the configured reminder window.",
    action: "Create internal reminder notification.",
    actions: ["create_notification", "create_review_task"],
  },
  {
    name: "No-show follow-up workflow",
    summary: "Creates a review task after no-show appointments so leads do not disappear.",
    triggerType: "appointment_no_show",
    condition: "Appointment status is no-show or missed.",
    action: "Draft no-show follow-up for review.",
    actions: ["create_review_task", "draft_sms_follow_up"],
  },
  {
    name: "Stale deal recovery workflow",
    summary: "Flags open deals that have not moved recently and recommends the next action.",
    triggerType: "deal_stale",
    condition: "Open deal has no recent update or is past expected close date.",
    action: "Create deal recovery task and AI recommendation.",
    actions: ["create_deal_task", "create_ai_recommendation"],
  },
  {
    name: "Re-engagement campaign workflow",
    summary: "Suggests a campaign draft for cold or inactive leads.",
    triggerType: "lead_inactive_segment",
    condition: "Lead is cold, nurture, or inactive and has not engaged recently.",
    action: "Create reviewable re-engagement campaign recommendation.",
    actions: ["create_campaign_draft", "create_ai_recommendation"],
  },
  {
    name: "Review request workflow",
    summary: "Creates a post-conversion review request task for customers marked converted.",
    triggerType: "lead_converted",
    condition: "Lead status changed to converted.",
    action: "Create review request task for manual approval.",
    actions: ["create_review_task", "draft_email_follow_up"],
  },
  {
    name: "Lead scoring workflow",
    summary: "Runs safe scoring recommendations from recent lead and campaign activity.",
    triggerType: "lead_score_review",
    condition: "Lead has new interaction or stale score.",
    action: "Create score recommendation without overwriting high-value data.",
    actions: ["run_lead_scoring_agent", "create_ai_recommendation"],
  },
  {
    name: "Pipeline stage change notification workflow",
    summary: "Notifies the owner when a deal stage changes or a high-value deal needs attention.",
    triggerType: "deal_stage_changed",
    condition: "Deal stage changes or high-value open deal becomes stale.",
    action: "Create internal notification and follow-up task.",
    actions: ["create_notification", "create_deal_task"],
  },
  {
    name: "Trial ending and cap warning workflow",
    summary: "Surfaces trial and usage-cap risks before the user hits a hard limit.",
    triggerType: "trial_or_usage_warning",
    condition: "Trial is ending soon or usage reaches warning threshold.",
    action: "Create notification and billing review task.",
    actions: ["create_notification", "create_review_task"],
  },
  {
    name: "New communication response workflow",
    summary: "Creates a review task when a lead replies and needs a response.",
    triggerType: "new_inbound_communication",
    condition: "Inbound communication is received or conversation is unread.",
    action: "Create response task and optional AI draft for review.",
    actions: ["create_response_task", "draft_email_follow_up"],
  },
  {
    name: "Abandoned onboarding/setup reminder",
    summary: "Surfaces incomplete setup, provider, or import steps before launch readiness stalls.",
    triggerType: "setup_incomplete",
    condition: "Workspace setup, provider configuration, or first import is incomplete.",
    action: "Create setup review task and owner notification.",
    actions: ["create_review_task", "create_notification"],
  },
  {
    name: "Failed payment follow-up",
    summary: "Creates an internal billing review task when a failed payment event is detected.",
    triggerType: "billing_payment_failed",
    condition: "Billing event indicates failed payment or payment action required.",
    action: "Create billing review task without changing subscription status.",
    actions: ["create_review_task", "create_notification"],
  },
  {
    name: "Usage cap reached alert",
    summary: "Warns the owner before managed usage caps block automation.",
    triggerType: "usage_cap_warning",
    condition: "AI, email, SMS, or contacts usage reaches warning or hard-cap threshold.",
    action: "Create usage review notification and suggested upgrade task.",
    actions: ["create_notification", "create_review_task"],
  },
  {
    name: "Staff reassignment suggestion",
    summary: "Flags unassigned or overloaded work so the owner can rebalance tasks.",
    triggerType: "staff_workload_risk",
    condition: "Tasks are unassigned, overdue, or concentrated on one staff member.",
    action: "Create staff assignment review task.",
    actions: ["create_review_task", "suggest_staff_assignment"],
  },
  {
    name: "Quote/proposal follow-up",
    summary: "Creates a review task for proposal-stage deals that need a next step.",
    triggerType: "proposal_follow_up_due",
    condition: "Deal is in proposal or negotiation and has no recent activity.",
    action: "Create proposal follow-up task and optional message draft.",
    actions: ["create_deal_task", "draft_email_follow_up"],
  },
  {
    name: "Service request intake workflow",
    summary: "Routes consultation and service inquiries into a reviewable intake task.",
    triggerType: "service_request_created",
    condition: "New service request, contact inquiry, or waitlist signup mentions implementation help.",
    action: "Create intake task and internal notification.",
    actions: ["create_review_task", "create_notification"],
  },
];

function renderAction(action: any) {
  if (typeof action === "string") return action.replace(/_/g, " ");
  if (action?.label) return action.label;
  if (action?.type) return String(action.type).replace(/_/g, " ");
  return "Review action";
}

export default function WorkflowPage() {
  const [data, setData] = useState<any>(null);
  const [agents, setAgents] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [creating, setCreating] = useState(false);
  const [workflowAction, setWorkflowAction] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [lastRunMessage, setLastRunMessage] = useState("");
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
      if (agentData.success) {
        setAgents(agentData);
        if (runAgents) {
          setLastRunMessage(
            `Agent review completed with ${agentData.recommendations?.length || 0} reviewable recommendation${agentData.recommendations?.length === 1 ? "" : "s"}.`
          );
        }
      }
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

  async function createReviewWorkflow(template = workflowTemplates[0]) {
    try {
      setCreating(true);
      setError("");
      const response = await fetch("/api/crm/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.name,
          status: "draft",
          triggerType: template.triggerType,
          condition: template.condition,
          action: template.action,
          actions: template.actions,
          metadata: {
            source: "workflow_page",
            summary: template.summary,
            review_gated: true,
            external_sends: "manual_approval_required",
          },
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to create workflow.");
      setLastRunMessage(`Draft workflow created: ${json.workflow?.name || template.name}. Review it before activating.`);
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
      setLastRunMessage(`Workflow ${status === "active" ? "activated" : status === "paused" ? "paused" : "updated"}: ${workflow.name}.`);
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
      setLastRunMessage(`Safe manual test logged for ${workflow.name}. No external messages were sent.`);
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
  const workflowRuns = data?.workflow_runs || data?.workflowRuns || [];
  const activeWorkflows = workflows.filter((workflow: any) => workflow.status === "active").length;
  const pausedWorkflows = workflows.filter((workflow: any) => workflow.status === "paused").length;
  const draftWorkflows = workflows.filter((workflow: any) => workflow.status === "draft").length;
  const failedRuns = workflows.reduce((sum: number, workflow: any) => sum + Number(workflow.failure_count || 0), 0);
  const dashboardLeads = data?.leads || [];
  const dashboardDeals = data?.deals || [];
  const dashboardTasks = data?.tasks || [];
  const dashboardAppointments = data?.appointments || [];
  const dashboardCommunications = data?.communications || [];
  const workflowSignals = [
    {
      label: "Leads needing follow-up",
      count: followups.length,
      records: followups,
      meaning: "Leads that need a timely owner response or follow-up task.",
      action: "Open leads and create review-gated follow-up tasks.",
      href: "/dashboard/leads",
    },
    {
      label: "Hot leads",
      count: dashboardLeads.filter((lead: any) => Number(lead.score || 0) >= 80 || lead.temperature === "hot").length,
      records: dashboardLeads.filter((lead: any) => Number(lead.score || 0) >= 80 || lead.temperature === "hot"),
      meaning: "High-score or hot-temperature leads that should not wait.",
      action: "Review the lead and draft a human-approved response.",
      href: "/dashboard/leads",
    },
    {
      label: "Stale deals",
      count: dashboardDeals.filter((deal: any) => deal.metadata?.stale || (deal.status === "open" && deal.updated_at && Date.now() - new Date(deal.updated_at).getTime() >= 14 * 86400000)).length,
      records: dashboardDeals.filter((deal: any) => deal.metadata?.stale || (deal.status === "open" && deal.updated_at && Date.now() - new Date(deal.updated_at).getTime() >= 14 * 86400000)),
      meaning: "Open deals that have not moved recently.",
      action: "Create a deal recovery task or proposal follow-up.",
      href: "/dashboard/pipeline",
    },
    {
      label: "Overdue tasks",
      count: dashboardTasks.filter((task: any) => task.status === "overdue").length,
      records: dashboardTasks.filter((task: any) => task.status === "overdue"),
      meaning: "Tasks already past their due window.",
      action: "Prioritize or reassign the task.",
      href: "/dashboard/tasks",
    },
    {
      label: "Upcoming appointments",
      count: dashboardAppointments.filter((appointment: any) => appointment.status === "scheduled").length,
      records: dashboardAppointments.filter((appointment: any) => appointment.status === "scheduled"),
      meaning: "Scheduled meetings that may need prep, reminders, or follow-up.",
      action: "Review appointment prep and confirmation.",
      href: "/dashboard/calendar",
    },
    {
      label: "No-show appointments",
      count: dashboardAppointments.filter((appointment: any) => appointment.status === "no_show" || appointment.status === "no-show").length,
      records: dashboardAppointments.filter((appointment: any) => appointment.status === "no_show" || appointment.status === "no-show"),
      meaning: "Missed meetings that need a recovery follow-up.",
      action: "Create a no-show recovery task.",
      href: "/dashboard/calendar",
    },
    {
      label: "New inbound replies",
      count: dashboardCommunications.filter((item: any) => item.direction === "inbound" && item.status !== "read").length,
      records: dashboardCommunications.filter((item: any) => item.direction === "inbound" && item.status !== "read"),
      meaning: "Inbound messages likely waiting for a reply.",
      action: "Open communications and draft a reviewed response.",
      href: "/dashboard/communications",
    },
    {
      label: "Campaigns ready for review",
      count: topCampaigns.length,
      records: topCampaigns,
      meaning: "Campaigns with enough activity to review performance or next steps.",
      action: "Review performance and approve a safe follow-up.",
      href: "/dashboard/marketing",
    },
    {
      label: "Pending recommendations",
      count: recommendations.length,
      records: recommendations,
      meaning: "CRM Intelligence recommendations waiting for review.",
      action: "Approve, deny, or convert to a safe draft action.",
      href: "/dashboard/ai_assistant",
    },
    {
      label: "Workflow runs failed",
      count: failedRuns,
      records: workflows.filter((workflow: any) => Number(workflow.failure_count || 0) > 0),
      meaning: "Workflow drafts or tests with failed run history.",
      action: "Open the workflow detail and review conditions before activating.",
      href: "/dashboard/workflow",
    },
  ];

  return (
    <main className="min-h-screen text-white">
      <QueryRecordFocus keys={["workflowId"]} />
      {selectedSignal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-start justify-between gap-4 border-b border-cyan-400/10 p-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Workflow Signal</div>
                <h2 className="mt-1 text-2xl font-black">{selectedSignal.label}</h2>
                <p className="mt-1 text-sm text-cyan-50/55">{selectedSignal.meaning}</p>
              </div>
              <button onClick={() => setSelectedSignal(null)} className="rounded-2xl border border-white/10 p-2 text-cyan-100 hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[62vh] overflow-y-auto p-5">
              <div className="mb-4 rounded-2xl border border-green-400/20 bg-green-500/10 p-4 text-sm text-green-100">
                Recommended action: {selectedSignal.action}
              </div>
              {selectedSignal.records.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-cyan-50/55">
                  No real records currently match this signal.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSignal.records.slice(0, 30).map((record: any, index: number) => (
                    <div key={record.id || index} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">{record.name || record.title || record.subject || record.email || record.action || record.type || "Related record"}</div>
                      <div className="mt-1 text-sm text-gray-500">{record.status || record.stage || record.channel || record.priority || "Needs review"}</div>
                      <div className="mt-2 text-xs text-gray-600">{formatDate(record.created_at || record.updated_at || record.due_date || record.starts_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-cyan-400/10 p-5">
              <a href={selectedSignal.href} className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black">
                Open related page
              </a>
            </div>
          </div>
        </div>
      )}
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
            onClick={() => createReviewWorkflow(workflowTemplates[0])}
            disabled={creating}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2"
          >
            {creating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            Create Draft Workflow
          </button>
        </div>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {lastRunMessage && (
        <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          {lastRunMessage}
        </div>
      )}

      <OwnerFocusPanel
        items={[
          {
            label: "Drafts to review",
            value: draftWorkflows,
            detail: "Draft workflows are safe to inspect before any activation or test run.",
            action: "Review saved workflows",
            tone: draftWorkflows > 0 ? "yellow" : "neutral",
          },
          {
            label: "Failed runs",
            value: failedRuns,
            detail: "Failed workflow runs should be checked before adding more automation.",
            action: "Open run signals",
            tone: failedRuns > 0 ? "yellow" : "green",
          },
          {
            label: "Safety",
            detail: "Workflow templates create drafts. External email, SMS, and social actions are not sent automatically.",
            href: "/dashboard/settings",
            action: "Review automation policy",
            tone: "green",
          },
        ]}
      />

      <MiniBrainInsightPanel
        title="Workflow Intelligence"
        subtitle="Automation opportunities, failed-run risk, pending approvals, and safe workflow draft suggestions."
        types={["workflow_intelligence", "task_intelligence", "communication_intelligence"]}
      />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          ["Leads", metrics.leads.total || 0, Users],
          ["Follow-ups Due", agents?.summary?.followups_due || 0, MessageSquare],
          ["Scheduled Campaigns", metrics.campaigns.scheduled || 0, Megaphone],
          ["Active Workflows", metrics.workflows?.active || activeWorkflows, Workflow],
          ["Draft / Paused", `${draftWorkflows}/${pausedWorkflows}`, Clock],
          ["Failed Runs", failedRuns, AlertTriangle],
          ["Workflow Runs", metrics.workflows?.runs || workflowRuns.length || 0, PlayCircle],
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
                  <div key={workflow.id} data-record-id={workflow.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <Zap className="text-cyan-300" size={20} />
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{workflow.status}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-black">{workflow.name}</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">{workflow.metadata?.summary || workflow.action || "Review before running."}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="text-gray-500">Trigger</div>
                        <div className="mt-1 font-bold text-white">{workflow.trigger_type || "Manual review"}</div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="text-gray-500">Runs</div>
                        <div className="mt-1 font-bold text-white">{Number(workflow.success_count || 0) + Number(workflow.failure_count || 0)} total</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-green-100">{workflow.success_count || 0} success</span>
                      <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-red-100">{workflow.failure_count || 0} failed</span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">Last run: {formatDate(workflow.last_run_at) || "Never"}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => setSelectedWorkflow(workflow)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white flex items-center gap-1">
                        <Eye size={14} />
                        Details
                      </button>
                      <button disabled={workflowAction === `${workflow.id}:${workflow.status === "active" ? "paused" : "active"}`} onClick={() => updateWorkflowStatus(workflow, workflow.status === "active" ? "paused" : "active")} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60">
                        {workflow.status === "active" ? "Pause" : "Activate"}
                      </button>
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
              <h2 className="text-2xl font-black">Review-Gated Workflow Templates</h2>
            </div>
            <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              These templates create draft workflows only. External email, SMS, and social actions stay manual-review gated.
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {workflowTemplates.map((template) => (
                <div key={template.name} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <ShieldCheck className="mb-3 text-cyan-300" size={20} />
                  <h3 className="font-black">{template.name}</h3>
                  <p className="mt-2 text-sm text-gray-400">{template.summary}</p>
                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <div><span className="text-gray-300">Trigger:</span> {template.triggerType}</div>
                    <div><span className="text-gray-300">Condition:</span> {template.condition}</div>
                    <div><span className="text-gray-300">Action:</span> {template.action}</div>
                  </div>
                  <button
                    disabled={creating}
                    onClick={() => createReviewWorkflow(template)}
                    className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60"
                  >
                    Create Draft
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-green-400/20 bg-green-500/[0.05] p-6">
            <div className="flex items-center gap-3 mb-5">
              <CalendarClock className="text-green-300" size={20} />
              <h2 className="text-xl font-black">Live Workflow Signals</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              {workflowSignals.map((signal) => (
                <button
                  key={signal.label}
                  onClick={() => setSelectedSignal(signal)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                >
                  <span>{signal.label}</span>
                  <span className="font-black text-white">{signal.count}</span>
                </button>
              ))}
            </div>
          </div>

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

      {selectedWorkflow && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm md:items-center">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-[#050505] p-6 shadow-2xl shadow-cyan-500/10">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                  Review-gated workflow
                </div>
                <h3 className="text-2xl font-black">{selectedWorkflow.name}</h3>
                <p className="mt-2 text-sm text-gray-400">{selectedWorkflow.metadata?.summary || selectedWorkflow.action || "Review before running."}</p>
              </div>
              <button onClick={() => setSelectedWorkflow(null)} className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Trigger</div>
                <div className="mt-2 font-bold text-white">{selectedWorkflow.trigger_type || "Manual review"}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Status</div>
                <div className="mt-2 font-bold text-white">{selectedWorkflow.status}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:col-span-2">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Conditions</div>
                <div className="mt-2 text-sm text-gray-300">{selectedWorkflow.condition || "No saved condition."}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:col-span-2">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Actions</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(selectedWorkflow.actions) && selectedWorkflow.actions.length > 0 ? selectedWorkflow.actions : [selectedWorkflow.action || "Review action"]).map((action: any, index: number) => (
                    <span key={`${renderAction(action)}-${index}`} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">
                      {renderAction(action)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-2xl font-black">{selectedWorkflow.success_count || 0}</div>
                <div className="text-xs text-gray-500">Successful review tests</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-2xl font-black">{selectedWorkflow.failure_count || 0}</div>
                <div className="text-xs text-gray-500">Failed runs</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-bold">{formatDate(selectedWorkflow.last_run_at) || "Never"}</div>
                <div className="text-xs text-gray-500">Last run</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 p-4 text-sm text-green-100">
              Manual test runs only write an internal workflow-run log. They do not send email, SMS, or social messages.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
