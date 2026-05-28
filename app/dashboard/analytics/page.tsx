"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  CheckCircle2,
  CalendarDays,
  Loader2,
  Megaphone,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import OwnerFocusPanel from "@/components/dashboard/OwnerFocusPanel";

type RangeKey = "7d" | "30d" | "90d" | "all";

const rangeLabels: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Past month",
  "90d": "Last 90 days",
  all: "All time",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value || 0);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function inRange(row: any, field: string, range: RangeKey) {
  if (range === "all") return true;
  const dateValue = row?.[field] || row?.created_at || row?.updated_at;
  if (!dateValue) return false;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return Date.now() - new Date(dateValue).getTime() <= days * 86400000;
}

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function SimpleBar({ label, value, total }: { label: string; value: number; total: number }) {
  const width = Math.max(percent(value, total), value > 0 ? 8 : 0);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold text-white">{formatNumber(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState<RangeKey>("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/crm/dashboard");
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json?.error || "Failed to load analytics.");
      }
      setData(json.data || {});
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const analytics = useMemo(() => {
    const leads = (data?.leads || []).filter((row: any) => inRange(row, "created_at", range));
    const campaigns = (data?.campaigns || []).filter((row: any) => inRange(row, "created_at", range));
    const communications = (data?.communications || []).filter((row: any) => inRange(row, "created_at", range));
    const deals = (data?.deals || []).filter((row: any) => inRange(row, "created_at", range));
    const tasks = (data?.tasks || []).filter((row: any) => inRange(row, "created_at", range));
    const workflows = (data?.workflows || []).filter((row: any) => inRange(row, "created_at", range));
    const workflowRuns = (data?.workflowRuns || []).filter((row: any) => inRange(row, "started_at", range));
    const agentRuns = (data?.agentRuns || []).filter((row: any) => inRange(row, "created_at", range));
    const appointments = (data?.appointments || []).filter((row: any) => inRange(row, "starts_at", range));
    const activity = (data?.activity || []).filter((row: any) => inRange(row, "created_at", range));

    const campaignDelivered = campaigns.reduce((sum: number, item: any) => sum + Number(item.delivered_count || 0), 0);
    const campaignOpened = campaigns.reduce((sum: number, item: any) => sum + Number(item.opened_count || 0), 0);
    const campaignClicked = campaigns.reduce((sum: number, item: any) => sum + Number(item.clicked_count || 0), 0);
    const campaignConverted = campaigns.reduce((sum: number, item: any) => sum + Number(item.converted_count || 0), 0);
    const pipelineValue = deals.reduce((sum: number, item: any) => sum + Number(item.value || 0), 0);

    return {
      leads,
      campaigns,
      communications,
      deals,
      tasks,
      workflows,
      workflowRuns,
      agentRuns,
      appointments,
      activity,
      campaignDelivered,
      campaignOpened,
      campaignClicked,
      campaignConverted,
      pipelineValue,
      hasData:
        leads.length ||
        campaigns.length ||
        communications.length ||
        deals.length ||
        tasks.length ||
        workflows.length ||
        workflowRuns.length ||
        agentRuns.length ||
        appointments.length ||
        activity.length,
    };
  }, [data, range]);

  const leadStatus = ["new", "contacted", "qualified", "nurture", "converted", "lost"].map((status) => ({
    label: status,
    value: analytics.leads.filter((lead: any) => lead.status === status).length,
  }));
  const maxLeadStatus = Math.max(...leadStatus.map((item) => item.value), 1);

  const communicationChannels = ["email", "sms", "social", "note", "internal"].map((channel) => ({
    label: channel,
    value: analytics.communications.filter((item: any) => item.channel === channel).length,
  }));
  const maxCommunication = Math.max(...communicationChannels.map((item) => item.value), 1);
  const completedTasks = analytics.tasks.filter((task: any) => task.status === "completed").length;
  const overdueTasks = analytics.tasks.filter((task: any) => {
    if (task.status === "completed" || !task.due_date) return false;
    return new Date(task.due_date).getTime() < Date.now();
  });
  const completedAppointments = analytics.appointments.filter((appointment: any) =>
    ["completed", "showed"].includes(appointment.status)
  ).length;
  const noShowAppointments = analytics.appointments.filter((appointment: any) =>
    ["no_show", "no-show"].includes(appointment.status)
  );
  const metricCards = [
    {
      key: "total_leads",
      label: "Total Leads",
      value: formatNumber(analytics.leads.length),
      icon: Users,
      records: analytics.leads,
      context: `${percent(analytics.leads.filter((lead: any) => lead.status === "converted").length, analytics.leads.length)}% converted in ${rangeLabels[range]}.`,
      action: "Review lead segments",
      href: "/dashboard/leads",
    },
    {
      key: "conversion_rate",
      label: "Conversion Rate",
      value: `${percent(analytics.leads.filter((lead: any) => lead.status === "converted").length, analytics.leads.length)}%`,
      icon: TrendingUp,
      records: analytics.leads.filter((lead: any) => ["converted", "qualified", "lost"].includes(lead.status)),
      context: "Calculated from real lead statuses in the selected date range.",
      action: "Open leads pipeline",
      href: "/dashboard/leads",
    },
    {
      key: "campaign_performance",
      label: "Campaign Performance",
      value: formatNumber(analytics.campaigns.length),
      icon: Megaphone,
      records: analytics.campaigns,
      context: `${formatNumber(analytics.campaignDelivered)} delivered, ${formatNumber(analytics.campaignOpened)} opened, ${formatNumber(analytics.campaignClicked)} clicked, ${formatNumber(analytics.campaignConverted)} converted.`,
      action: "Review campaigns",
      href: "/dashboard/marketing",
    },
    {
      key: "communications",
      label: "Communication Volume",
      value: formatNumber(analytics.communications.length),
      icon: MessageSquare,
      records: analytics.communications,
      context: "Includes real email, SMS, social, note, and internal communication records in range.",
      action: "Open communications",
      href: "/dashboard/communications",
    },
    {
      key: "pipeline_value",
      label: "Pipeline Value",
      value: formatCurrency(analytics.pipelineValue),
      icon: TrendingUp,
      records: analytics.deals,
      context: `${formatNumber(analytics.deals.filter((deal: any) => deal.status === "open").length)} open deals, ${formatNumber(analytics.deals.filter((deal: any) => deal.status === "won" || deal.stage === "won").length)} won, ${formatNumber(analytics.deals.filter((deal: any) => deal.status === "lost" || deal.stage === "lost").length)} lost.`,
      action: "Open pipeline",
      href: "/dashboard/pipeline",
    },
    {
      key: "workflow_health",
      label: "Workflow Health",
      value: formatNumber(analytics.workflowRuns.length),
      icon: Workflow,
      records: analytics.workflowRuns,
      context: `${formatNumber(analytics.workflowRuns.filter((run: any) => run.status === "failed").length)} failed workflow runs in range.`,
      action: "Review workflows",
      href: "/dashboard/workflow",
    },
    {
      key: "task_health",
      label: "Task Completion",
      value: `${percent(completedTasks, analytics.tasks.length)}%`,
      icon: CheckCircle2,
      records: analytics.tasks,
      context: `${formatNumber(overdueTasks.length)} overdue tasks and ${formatNumber(completedTasks)} completed tasks in range.`,
      action: "Open tasks",
      href: "/dashboard/tasks",
    },
    {
      key: "appointments",
      label: "Appointments",
      value: formatNumber(analytics.appointments.length),
      icon: CalendarDays,
      records: analytics.appointments,
      context: `${formatNumber(completedAppointments)} completed and ${formatNumber(noShowAppointments.length)} no-show appointments in range.`,
      action: "Open calendar",
      href: "/dashboard/calendar",
    },
    {
      key: "ai_reviews",
      label: "AI Review Activity",
      value: formatNumber(analytics.agentRuns.length),
      icon: Bot,
      records: analytics.agentRuns,
      context: `${formatNumber(analytics.agentRuns.filter((run: any) => run.status === "failed").length)} failed AI review checks in range. Provider metadata is shown when available.`,
      action: "Open CRM Intelligence",
      href: "/dashboard/ai_assistant",
    },
    {
      key: "activity",
      label: "Activity Events",
      value: formatNumber(analytics.activity.length),
      icon: Activity,
      records: analytics.activity,
      context: "Real campaign and CRM activity records in the selected range.",
      action: "Review dashboard",
      href: "/dashboard",
    },
  ];
  const selectedMetricCard = metricCards.find((item) => item.key === selectedMetric);

  return (
    <main className="min-h-screen text-white">
      {selectedMetricCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-start justify-between gap-4 border-b border-cyan-400/10 p-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Analytics Detail - {rangeLabels[range]}
                </div>
                <h2 className="mt-1 text-2xl font-black">{selectedMetricCard.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-cyan-50/60">
                  {selectedMetricCard.context}
                </p>
              </div>
              <button
                onClick={() => setSelectedMetric(null)}
                className="rounded-2xl border border-white/10 px-3 py-2 text-sm font-bold text-cyan-100 hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="grid max-h-[62vh] gap-4 overflow-y-auto p-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-gray-500">Current value</div>
                  <div className="mt-2 text-3xl font-black text-white">{selectedMetricCard.value}</div>
                </div>
                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.05] p-4">
                  <div className="text-sm font-bold text-cyan-100">Recommended action</div>
                  <p className="mt-2 text-sm text-cyan-50/60">{selectedMetricCard.action}</p>
                  <a
                    href={selectedMetricCard.href}
                    className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-2 text-sm font-black text-black"
                  >
                    Open related page
                  </a>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(JSON.stringify(selectedMetricCard.records, null, 2))}
                  className="w-full rounded-2xl border border-cyan-400/20 px-4 py-3 text-sm font-bold text-cyan-100 hover:bg-cyan-500/10"
                >
                  Copy records JSON
                </button>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
                  Related Records
                </h3>
                {selectedMetricCard.records.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-sm text-gray-400">
                    No real records are available for this metric in the selected range.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedMetricCard.records.slice(0, 60).map((record: any, index: number) => (
                      <div key={record.id || index} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="font-bold text-white">
                          {record.name || record.title || record.subject || record.email || record.action || record.type || record.agent || "CRM record"}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {record.status || record.stage || record.channel || record.provider || record.source || "No status"}
                          {record.value ? ` - ${formatCurrency(Number(record.value || 0))}` : ""}
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          {record.created_at || record.started_at || record.starts_at
                            ? new Date(record.created_at || record.started_at || record.starts_at).toLocaleString()
                            : "No timestamp"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-500/20 bg-cyan-500/10">
            <BarChart3 className="text-cyan-300" size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-black md:text-4xl">Analytics & Reporting</h1>
            <p className="mt-1 text-sm text-gray-500">
              Real CRM performance across leads, campaigns, pipeline, communications, workflows, and CRM intelligence.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(rangeLabels) as RangeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`rounded-2xl border px-4 py-2 text-sm font-bold transition ${
                range === key
                  ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/[0.03] text-gray-400 hover:text-white"
              }`}
            >
              {rangeLabels[key]}
            </button>
          ))}
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {data?.schemaWarnings?.length > 0 && (
        <div className="mb-6 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          Some analytics tables are not available yet. Apply the CRM migrations listed in the testing checklist.
        </div>
      )}

      <OwnerFocusPanel
        items={[
          {
            label: "Date range",
            value: rangeLabels[range],
            detail: "The cards and charts below are filtered to this range, so compare trends after choosing the period you care about.",
            action: "Adjust range above",
            tone: "neutral",
          },
          {
            label: "Data readiness",
            value: analytics.hasData ? "Ready" : "Empty",
            detail: analytics.hasData
              ? "Analytics are built from real CRM records across leads, deals, campaigns, communications, tasks, appointments, and workflows."
              : "Analytics stay empty until real CRM records exist.",
            href: analytics.hasData ? "/dashboard/analytics" : "/dashboard/leads",
            action: analytics.hasData ? "Review details" : "Add real records",
            tone: analytics.hasData ? "green" : "yellow",
          },
          {
            label: "Owner decision",
            detail: "Use analytics for direction, then open the related page before changing campaigns, follow-ups, or billing decisions.",
            href: "/dashboard",
            action: "Return to dashboard",
            tone: "cyan",
          },
        ]}
      />

      <MiniBrainInsightPanel
        title="Analytics Intelligence"
        subtitle="Business health, trend interpretation, forecast, and anomaly signals from deterministic CRM rules."
        types={["business_health", "forecast", "anomaly", "pipeline_intelligence"]}
      />

      {loading ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
          <Loader2 className="animate-spin text-cyan-300" size={28} />
        </div>
      ) : !analytics.hasData ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <BarChart3 className="mx-auto mb-4 text-cyan-300" size={34} />
          <h2 className="text-2xl font-black">No real analytics data yet</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-500">
            Analytics will populate from real leads, deals, campaigns, communications, workflow runs, tasks, appointments, and AI review checks.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => setSelectedMetric(item.key)}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-400/35 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-500/10">
                      <Icon className="text-cyan-300" size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{item.label}</div>
                </button>
              );
            })}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 text-xl font-black">Lead Conversion</h2>
              <div className="space-y-4">
                {leadStatus.map((item) => (
                  <SimpleBar key={item.label} label={item.label} value={item.value} total={maxLeadStatus} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 text-xl font-black">Campaign Performance</h2>
              <div className="space-y-4">
                <SimpleBar label="Delivered" value={analytics.campaignDelivered} total={Math.max(analytics.campaignDelivered, 1)} />
                <SimpleBar label="Opened" value={analytics.campaignOpened} total={Math.max(analytics.campaignDelivered, 1)} />
                <SimpleBar label="Clicked" value={analytics.campaignClicked} total={Math.max(analytics.campaignDelivered, 1)} />
                <SimpleBar label="Converted" value={analytics.campaignConverted} total={Math.max(analytics.campaignDelivered, 1)} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 text-xl font-black">Communication Volume</h2>
              <div className="space-y-4">
                {communicationChannels.map((item) => (
                  <SimpleBar key={item.label} label={item.label} value={item.value} total={maxCommunication} />
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 text-xl font-black">Recent Campaign Events</h2>
              <div className="space-y-3">
                {analytics.activity.slice(0, 8).map((item: any) => (
                  <div key={item.id || item.created_at} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="font-bold text-white">{item.action || item.type || "Activity"}</div>
                    <div className="mt-1 text-sm text-gray-400">{item.details || item.message || "No details recorded."}</div>
                    <div className="mt-2 text-xs text-gray-600">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "No timestamp"}
                    </div>
                  </div>
                ))}
                {analytics.activity.length === 0 && <p className="text-sm text-gray-500">No campaign events in this range.</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 text-xl font-black">AI Review & Workflow Health</h2>
              <div className="space-y-3">
                {[
                  ["Completed AI review checks", analytics.agentRuns.filter((run: any) => run.status !== "failed").length],
                  ["Failed AI review checks", analytics.agentRuns.filter((run: any) => run.status === "failed").length],
                  ["Active workflows", analytics.workflows.filter((workflow: any) => workflow.status === "active").length],
                  ["Paused workflows", analytics.workflows.filter((workflow: any) => workflow.status === "paused").length],
                  ["Failed workflow runs", analytics.workflowRuns.filter((run: any) => run.status === "failed").length],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="font-black text-cyan-300">{formatNumber(Number(value))}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
