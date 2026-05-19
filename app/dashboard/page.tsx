"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Cpu,
  DollarSign,
  GitBranch,
  BarChart3,
  Loader2,
  Mail,
  Megaphone,
  MessageSquare,
  Plus,
  RefreshCw,
  Share2,
  Target,
  Upload,
  Users,
  Workflow,
  ListTodo,
  XCircle,
} from "lucide-react";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import LeadCsvImportModal from "@/components/leads/LeadCsvImportModal";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function formatMoney(value?: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function recommendationHref(action?: string) {
  if (action === "review_pipeline") return "/dashboard/pipeline";
  if (action === "review_record") return "/dashboard";
  if (action === "review_tasks") return "/dashboard/tasks";
  if (action === "create_task") return "/dashboard/tasks";
  if (action === "create_workflow_suggestion") return "/dashboard/workflow";
  if (action === "create_workflow") return "/dashboard/workflow";
  if (action === "create_variant") return "/dashboard/marketing";
  if (action === "review_campaign") return "/dashboard/marketing";
  if (action === "draft_follow_up") return "/dashboard/communications";
  if (action === "draft_message") return "/dashboard/communications";
  if (action === "review_lead") return "/dashboard/leads";
  if (action === "schedule_appointment") return "/dashboard/calendar";
  if (action === "review_billing") return "/dashboard/settings";
  if (action === "fix_setup") return "/dashboard/settings";
  if (action === "assign_staff") return "/dashboard/tasks";
  return "/dashboard/ai_assistant";
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/crm/dashboard");
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json?.error || "Failed to load CRM dashboard.");
      }

      setData(json.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load CRM dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    window.addEventListener("marketing-data-refresh", loadDashboard);
    window.addEventListener("crm-leads-imported", loadDashboard);
    return () => {
      window.removeEventListener("marketing-data-refresh", loadDashboard);
      window.removeEventListener("crm-leads-imported", loadDashboard);
    };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-300" size={34} />
      </main>
    );
  }

  const metrics = data?.metrics || {
    leads: {},
    campaigns: {},
    communications: {},
  };
  const recentLeads = data?.leads?.slice(0, 6) || [];
  const recentActivity = data?.activity?.slice(0, 6) || [];
  const recentCommunications = data?.communications?.slice(0, 5) || [];
  const recommendations = data?.agents?.recommendations || [];
  const topInsights = (data?.agents?.insights || []).slice(0, 5);
  const topCampaigns = data?.campaigns?.slice(0, 4) || [];
  const agentSummary = data?.agents?.summary || {};
  const recentTasks = data?.tasks?.slice(0, 5) || [];
  const recentDeals = data?.deals?.slice(0, 5) || [];
  const recentAgentRuns = data?.agentRuns?.slice(0, 5) || [];
  const staleDeals = data?.agents?.stale_deals || [];
  const overdueTasks = data?.agents?.overdue_tasks || [];
  const followups = data?.agents?.followups || [];
  const upcomingAppointments = (data?.appointments || [])
    .filter((appointment: any) => appointment.status === "scheduled")
    .slice(0, 5);
  const metricCards = [
    { key: "leads", label: "Leads", value: metrics.leads.total || 0, icon: Users, href: "/dashboard/leads", records: data?.leads || [] },
    { key: "new_leads", label: "New Leads", value: metrics.leads.new || 0, icon: Plus, href: "/dashboard/leads", records: (data?.leads || []).filter((lead: any) => lead.status === "new") },
    { key: "qualified_leads", label: "Qualified", value: metrics.leads.qualified || 0, icon: Target, href: "/dashboard/leads", records: (data?.leads || []).filter((lead: any) => lead.status === "qualified") },
    { key: "converted_leads", label: "Converted Leads", value: metrics.leads.converted || 0, icon: CheckCircle2, href: "/dashboard/leads", records: (data?.leads || []).filter((lead: any) => lead.status === "converted") },
    { key: "scheduled_campaigns", label: "Scheduled Campaigns", value: metrics.campaigns.scheduled || 0, icon: CalendarClock, href: "/dashboard/marketing", records: (data?.campaigns || []).filter((campaign: any) => campaign.status === "scheduled") },
    { key: "active_campaigns", label: "Active Campaigns", value: metrics.campaigns.active || 0, icon: Megaphone, href: "/dashboard/marketing", records: (data?.campaigns || []).filter((campaign: any) => ["active", "processing"].includes(campaign.status)) },
    { key: "cancelled_campaigns", label: "Cancelled Campaigns", value: metrics.campaigns.cancelled || 0, icon: XCircle, href: "/dashboard/marketing", records: (data?.campaigns || []).filter((campaign: any) => campaign.status === "cancelled") },
    { key: "campaign_opens", label: "Campaign Opens", value: metrics.campaigns.opened || 0, icon: Mail, href: "/dashboard/marketing", records: data?.campaigns || [] },
    { key: "campaign_clicks", label: "Campaign Clicks", value: metrics.campaigns.clicked || 0, icon: Activity, href: "/dashboard/marketing", records: data?.campaigns || [] },
    { key: "communications", label: "Communications", value: metrics.communications.total || 0, icon: MessageSquare, href: "/dashboard/communications", records: data?.communications || [] },
    { key: "pipeline_value", label: "Pipeline Value", value: formatMoney(metrics.deals?.open_value || 0), icon: DollarSign, href: "/dashboard/pipeline", records: data?.deals || [] },
    { key: "open_deals", label: "Open Deals", value: metrics.deals?.open || 0, icon: Target, href: "/dashboard/pipeline", records: (data?.deals || []).filter((deal: any) => deal.status === "open") },
    { key: "won_deals", label: "Won Deals", value: metrics.deals?.won || 0, icon: CheckCircle2, href: "/dashboard/pipeline", records: (data?.deals || []).filter((deal: any) => deal.stage === "won" || deal.status === "won") },
    { key: "lost_deals", label: "Lost Deals", value: metrics.deals?.lost || 0, icon: XCircle, href: "/dashboard/pipeline", records: (data?.deals || []).filter((deal: any) => deal.stage === "lost" || deal.status === "lost") },
    { key: "open_tasks", label: "Open Tasks", value: metrics.tasks?.open || 0, icon: ListTodo, href: "/dashboard/tasks", records: (data?.tasks || []).filter((task: any) => task.status === "open") },
    { key: "overdue_tasks", label: "Overdue Tasks", value: metrics.tasks?.overdue || 0, icon: CalendarClock, href: "/dashboard/tasks", records: overdueTasks },
    { key: "appointments", label: "Appointments", value: metrics.appointments?.upcoming || 0, icon: CalendarDays, href: "/dashboard/calendar", records: upcomingAppointments },
    { key: "active_workflows", label: "Active Workflows", value: metrics.workflows?.active || 0, icon: Workflow, href: "/dashboard/workflow", records: (data?.workflows || []).filter((workflow: any) => workflow.status === "active") },
    { key: "workflow_runs", label: "Workflow Runs", value: metrics.workflows?.runs || 0, icon: GitBranch, href: "/dashboard/workflow", records: data?.workflowRuns || [] },
  ];
  const selectedMetricConfig = metricCards.find((item) => item.key === selectedMetric);
  const dealStages = ["new", "qualified", "proposal", "negotiation", "won", "lost"].map((stage) => {
    const stageDeals = (data?.deals || []).filter((deal: any) => deal.stage === stage);
    return {
      stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum: number, deal: any) => sum + Number(deal.value || 0), 0),
    };
  });

  return (
    <main className="min-h-screen text-white">
      <LeadCsvImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={loadDashboard}
      />
      {selectedMetricConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-start justify-between gap-4 border-b border-cyan-400/10 p-5">
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Metric Detail</div>
                <h2 className="mt-1 text-2xl font-black">{selectedMetricConfig.label}</h2>
                <p className="mt-1 text-sm text-cyan-50/55">
                  {selectedMetricConfig.records.length} real record{selectedMetricConfig.records.length === 1 ? "" : "s"} behind this metric.
                </p>
              </div>
              <button onClick={() => setSelectedMetric(null)} className="rounded-2xl border border-white/10 p-2 text-cyan-100 hover:bg-white/5">
                <XCircle size={20} />
              </button>
            </div>
            <div className="max-h-[62vh] overflow-y-auto p-5">
              {selectedMetricConfig.records.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-cyan-50/55">
                  No real records currently match this metric.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedMetricConfig.records.slice(0, 50).map((record: any, index: number) => (
                    <div key={record.id || index} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">
                        {record.name || record.title || record.subject || record.email || record.action || record.type || "CRM record"}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {record.status || record.stage || record.channel || record.source || "No status"} {record.value ? `- ${formatMoney(record.value)}` : ""}
                      </div>
                      <div className="mt-2 text-xs text-gray-600">{formatDate(record.created_at || record.due_date || record.starts_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 border-t border-cyan-400/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <a href={selectedMetricConfig.href} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 text-center font-black text-black">
                Open related page
              </a>
              <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(selectedMetricConfig.records, null, 2))} className="rounded-2xl border border-cyan-400/20 px-5 py-3 font-bold text-cyan-100">
                Copy records JSON
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="mb-8">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs mb-4">
              <Activity size={14} />
              Autonomous CRM Dashboard
            </div>
            <h1 className="text-5xl font-black leading-tight">
              SynaptiReach
              <span className="block bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                CRM Command Center
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mt-3">
              Real leads, campaigns, communications, activity, and AI next actions from Supabase.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={18} /> Refresh
            </button>
            <a href="/dashboard/leads" className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2">
              <Plus size={18} /> Create Lead
            </a>
            <button onClick={() => setImportOpen(true)} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 flex items-center gap-2">
              <Upload size={18} /> Import CSV
            </button>
            <a href="/dashboard/pipeline" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <DollarSign size={18} /> View Pipeline
            </a>
            <a href="/dashboard/tasks" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <ListTodo size={18} /> Add Task
            </a>
            <a href="/dashboard/analytics" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <BarChart3 size={18} /> View Analytics
            </a>
            <a href="/dashboard/workflow" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <GitBranch size={18} /> Create Workflow
            </a>
            <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <Mail size={18} /> Email Campaign
            </a>
            <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <MessageSquare size={18} /> SMS Campaign
            </a>
            <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <Share2 size={18} /> Social Campaign
            </a>
            <a href="/dashboard/ai_assistant" className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 flex items-center gap-2">
              <Bot size={18} /> Ask AI
            </a>
          </div>
        </div>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {(data?.schemaWarnings || []).length > 0 && (
        <div className="mb-6 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          {data.schemaWarnings[0]}
        </div>
      )}

      <MiniBrainInsightPanel
        title="Executive Mini-Brain"
        subtitle="CRM-wide scorecards, record helpers, risks, opportunities, and review-gated next actions."
        limit={6}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {metricCards.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => setSelectedMetric(item.key)} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-400/35 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-11 h-11 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center mb-4">
                <Icon className="text-cyan-300" size={20} />
              </div>
              <div className="text-3xl font-black">{item.value}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </button>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6 shadow-2xl shadow-cyan-500/5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Built-in Intelligence</div>
                <h2 className="mt-1 text-2xl font-black">Mini-Brain Executive Signals</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Deterministic, zero-cost CRM reasoning runs before external AI and keeps all external actions review-gated.
                </p>
              </div>
              <a href="/dashboard/ai_assistant" className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100">
                Open Command Center
              </a>
            </div>
            {topInsights.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-gray-400">
                No urgent built-in intelligence findings were detected from the current CRM data.
              </div>
            ) : (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {topInsights.map((item: any) => (
                  <div key={item.id || item.title} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-xs font-bold text-cyan-100">
                        {item.priority || "medium"}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-gray-400">
                        {Math.round(Number(item.confidence || 0) * 100)}% confidence
                      </span>
                    </div>
                    <div className="mt-3 font-bold text-white">{item.title}</div>
                    <div className="mt-1 text-sm text-gray-400">{item.summary}</div>
                    {(item.reasoning || []).length > 0 && (
                      <div className="mt-3 border-t border-white/10 pt-3 text-xs text-gray-500">
                        {(item.reasoning || []).slice(0, 2).join(" ")}
                      </div>
                    )}
                    <a href={recommendationHref(item.actionType)} className="mt-3 inline-flex rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100">
                      Review safely
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-6 shadow-2xl shadow-cyan-500/5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-black">Autonomous Agent Status</h2>
                <p className="text-sm text-gray-500">Real CRM agents reviewing leads, campaigns, communications, and follow-up signals.</p>
              </div>
              <span className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100">Review mode</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                ["Hot Leads", agentSummary.hot_leads || 0, Users],
                ["Follow-ups Due", agentSummary.followups_due || 0, MessageSquare],
                ["Campaigns Reviewed", agentSummary.campaign_count || 0, Megaphone],
                ["Open Deals", agentSummary.open_deals || 0, Target],
                ["Overdue Tasks", agentSummary.overdue_tasks || 0, ListTodo],
                ["Active Workflows", agentSummary.active_workflows || 0, Workflow],
                ["Agent Runs", metrics.agents?.runs || 0, Bot],
                ["Appointments", agentSummary.upcoming_appointments || 0, CalendarDays],
                ["Confidence", `${Math.round((data?.agents?.confidence || 0) * 100)}%`, Cpu],
              ].map(([label, value, Icon]: any) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <Icon className="mb-3 text-cyan-300" size={19} />
                  <div className="text-2xl font-black">{value}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-black mb-5">Recent Leads</h2>
            {recentLeads.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                No leads yet. Create or import your first lead to start the CRM pipeline.
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white">{lead.name || lead.email || lead.phone || "Unnamed lead"}</div>
                      <div className="text-sm text-gray-500">{lead.email || lead.phone || "No contact"} - {lead.source || "unknown source"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{lead.status || "new"}</span>
                      <span className="text-sm font-black text-cyan-300">{lead.score || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-black">Follow-Up Command Queue</h2>
                <p className="text-sm text-gray-500">Real overdue tasks, stale deals, and leads needing communication.</p>
              </div>
              <a href="/dashboard/tasks" className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100">
                Open Tasks
              </a>
            </div>
            {overdueTasks.length === 0 && staleDeals.length === 0 && followups.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                No urgent follow-ups detected from current CRM activity.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">Overdue Tasks</div>
                  <div className="mt-2 text-3xl font-black text-cyan-300">{overdueTasks.length}</div>
                  <div className="mt-3 space-y-2">
                    {overdueTasks.slice(0, 3).map((task: any) => (
                      <a key={task.id} href="/dashboard/tasks" className="block rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
                        {task.title}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">Stale Deals</div>
                  <div className="mt-2 text-3xl font-black text-cyan-300">{staleDeals.length}</div>
                  <div className="mt-3 space-y-2">
                    {staleDeals.slice(0, 3).map((deal: any) => (
                      <a key={deal.id} href="/dashboard/pipeline" className="block rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
                        {deal.title || "Untitled deal"} - {formatMoney(deal.value)}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">Leads To Contact</div>
                  <div className="mt-2 text-3xl font-black text-cyan-300">{followups.length}</div>
                  <div className="mt-3 space-y-2">
                    {followups.slice(0, 3).map((lead: any) => (
                      <a key={lead.id} href="/dashboard/leads" className="block rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
                        {lead.name || lead.email || "Unnamed lead"}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-black mb-5">Pipeline Summary</h2>
            <div className="mb-6 rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.04] p-4">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Deal Flow</div>
                  <div className="text-sm text-gray-500">Open value, stage movement, stale deals, and next actions.</div>
                </div>
                <a href="/dashboard/pipeline" className="rounded-xl border border-cyan-400/20 px-4 py-2 text-sm font-bold text-cyan-100">Open Pipeline</a>
              </div>
              <div className="grid gap-3 md:grid-cols-6">
                {dealStages.map((stage) => (
                  <div key={stage.stage} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="text-xs uppercase text-gray-500">{stage.stage}</div>
                    <div className="mt-2 text-xl font-black text-white">{stage.count}</div>
                    <div className="text-xs text-cyan-200">{formatMoney(stage.value)}</div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400" style={{ width: `${Math.min(100, stage.count * 18)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
              {["new", "contacted", "qualified", "nurture", "converted", "lost"].map((status) => (
                <div key={status} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">{status}</div>
                  <div className="mt-2 text-2xl font-black text-cyan-300">
                    {data?.leads?.filter((lead: any) => lead.status === status).length || 0}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentDeals.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-gray-400">
                  No real deals yet. Add opportunities on the Pipeline page.
                </div>
              ) : recentDeals.map((deal: any) => (
                <div key={deal.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="font-bold">{deal.title}</div>
                  <div className="text-sm text-gray-500">{deal.stage || "new"} - {formatMoney(Number(deal.value || 0))}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-black mb-5">Campaign Performance</h2>
            {topCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                No campaigns yet. Schedule an email, SMS, or social campaign to populate performance.
              </div>
            ) : (
              <div className="space-y-3">
                {topCampaigns.map((campaign: any) => (
                  <div key={campaign.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="font-bold text-white">{campaign.subject || campaign.name || `${campaign.type || "Marketing"} Campaign`}</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                      <span className="text-gray-400">Delivered: <b className="text-white">{campaign.delivered_count || 0}</b></span>
                      <span className="text-gray-400">Opened: <b className="text-white">{campaign.opened_count || 0}</b></span>
                      <span className="text-gray-400">Clicked: <b className="text-white">{campaign.clicked_count || 0}</b></span>
                      <span className="text-gray-400">Converted: <b className="text-white">{campaign.converted_count || 0}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
            <div className="flex items-center gap-3 mb-5">
              <Bot className="text-cyan-300" size={22} />
              <h2 className="text-xl font-black">AI Next Actions</h2>
            </div>
            <div className="space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-sm text-gray-400">No recommendations yet. Add leads or campaigns to generate CRM guidance.</div>
              ) : recommendations.map((item: any, index: number) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="font-bold text-white">{item.title}</div>
                  <div className="text-sm text-gray-400 mt-1">{item.description}</div>
                  <a href={recommendationHref(item.action)} className="mt-3 inline-flex rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100">
                    Review action
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-black mb-5">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.length === 0 && recentCommunications.length === 0 ? (
                <div className="text-sm text-gray-400">No activity yet.</div>
              ) : (
                <>
                  {recentActivity.map((item: any) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">{item.action || item.type || item.title || "Activity"}</div>
                      <div className="text-sm text-gray-500">{item.details || item.message || item.description || ""}</div>
                      <div className="text-xs text-gray-600 mt-2">{formatDate(item.created_at)}</div>
                    </div>
                  ))}
                  {recentCommunications.map((item: any) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">{item.subject || `${item.channel} communication`}</div>
                      <div className="text-sm text-gray-500">{item.content || ""}</div>
                      <div className="text-xs text-gray-600 mt-2">{formatDate(item.created_at)}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-black mb-5">Agent Run Log</h2>
            <div className="space-y-3">
              {recentAgentRuns.length === 0 ? (
                <div className="text-sm text-gray-400">No agent runs logged yet. Run an agent review from Workflow or AI Assistant.</div>
              ) : recentAgentRuns.map((run: any) => (
                <div key={run.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-white">{run.agent || run.type || "CRM agent"}</div>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100">{run.status || "completed"}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{run.provider || "local"} {run.model ? `- ${run.model}` : ""}</div>
                  <div className="text-xs text-gray-600 mt-2">{formatDate(run.created_at)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-black mb-5">Quick Campaigns</h2>
            <div className="grid grid-cols-1 gap-3">
              <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center gap-3 text-white"><Mail className="text-cyan-300" size={18} /> Email Campaign</a>
              <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center gap-3 text-white"><MessageSquare className="text-cyan-300" size={18} /> SMS Campaign</a>
              <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center gap-3 text-white"><Share2 className="text-cyan-300" size={18} /> Social Campaign</a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-5">
              <Workflow className="text-cyan-300" size={20} />
              <h2 className="text-xl font-black">Workflow Overview</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                {metrics.leads.total || 0} leads available for scoring and follow-up workflows.
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                {metrics.campaigns.scheduled || 0} scheduled campaigns can feed reminder and conversion workflows.
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                {metrics.workflows?.active || 0} active workflows and {metrics.workflows?.runs || 0} recorded workflow runs.
              </div>
              <a href="/dashboard/workflow" className="block rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 font-bold text-cyan-100">
                Review workflow recommendations
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-black mb-5">Tasks & Appointments</h2>
            <div className="space-y-3">
              {recentTasks.length === 0 && upcomingAppointments.length === 0 ? (
                <div className="text-sm text-gray-400">No tasks or appointments yet.</div>
              ) : (
                <>
                  {recentTasks.map((task: any) => (
                    <div key={task.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.priority || "medium"} - {formatDate(task.due_date)}</div>
                    </div>
                  ))}
                  {upcomingAppointments.map((appointment: any) => (
                    <div key={appointment.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">{appointment.title}</div>
                      <div className="text-sm text-gray-500">{formatDate(appointment.starts_at)}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
