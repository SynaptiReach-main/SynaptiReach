"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, Clock, Loader2, Plus, Save, Search, Trash2, UserPlus, X } from "lucide-react";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";

const emptyTask = {
  id: "",
  title: "",
  details: "",
  status: "open",
  priority: "medium",
  due_date: "",
  lead_id: "",
  deal_id: "",
  campaign_id: "",
  assigned_to: "Owner / Me",
  assigned_staff_id: "",
};

function formatDate(value?: string) {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [context, setContext] = useState<any>(null);
  const [agents, setAgents] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyTask);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([]);
  const [recommendationAssignees, setRecommendationAssignees] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [response, dashboardResponse, staffResponse] = await Promise.all([
        fetch("/api/crm/tasks"),
        fetch("/api/crm/dashboard"),
        fetch("/api/crm/staff"),
      ]);
      const json = await response.json();
      const dashboardJson = await dashboardResponse.json().catch(() => ({}));
      const staffJson = await staffResponse.json().catch(() => ({}));
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to load tasks.");
      setTasks(json.tasks || json.data || []);
      if (dashboardJson?.success) {
        setContext(dashboardJson.data);
        setAgents(dashboardJson.data?.agents || null);
      }
      if (staffJson?.success) setStaff(staffJson.staff || staffJson.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = [task.title, task.details, task.priority, task.status, task.lead_id, task.deal_id, task.campaign_id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      const isOverdue = task.status === "open" && task.due_date && new Date(task.due_date).getTime() < Date.now();
      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter ||
        (statusFilter === "overdue" && isOverdue);
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesAssignee =
        assigneeFilter === "all" ||
        (assigneeFilter === "owner" && !task.assigned_staff_id && (!task.assigned_to || task.assigned_to === "Owner / Me")) ||
        task.assigned_staff_id === assigneeFilter ||
        task.assigned_to === assigneeFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter]);

  const metrics = useMemo(() => ({
    open: tasks.filter((task) => task.status === "open").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    high: tasks.filter((task) => ["high", "urgent"].includes(task.priority)).length,
    overdue: tasks.filter((task) => task.status === "open" && task.due_date && new Date(task.due_date).getTime() < Date.now()).length,
  }), [tasks]);

  const staffOptions = useMemo(() => [
    { id: "owner", label: "Owner / Me", assigned_to: "Owner / Me", assigned_staff_id: "" },
    ...staff.map((member) => ({
      id: member.id,
      label: member.name || member.email || "Staff member",
      assigned_to: member.name || member.email || "Staff member",
      assigned_staff_id: member.id,
    })),
  ], [staff]);

  const taskRecommendations = useMemo(() => {
    const leads = context?.leads || [];
    const deals = context?.deals || [];
    const communications = context?.communications || [];
    const appointments = context?.appointments || [];
    const campaigns = context?.campaigns || [];
    const agentFollowups = agents?.followups || [];
    const staleDeals = agents?.stale_deals || [];
    const overdueTasks = agents?.overdue_tasks || [];
    const now = Date.now();
    const tomorrow = new Date(now + 86400000).toISOString().slice(0, 16);
    const twoDays = new Date(now + 2 * 86400000).toISOString().slice(0, 16);

    const inboundCommunications = communications.filter((item: any) => item.direction === "inbound" || item.status === "received");
    const noShowAppointments = appointments.filter((item: any) => item.status === "no_show" || item.status === "no-show");
    const highIntentCampaigns = campaigns.filter((campaign: any) => Number(campaign.clicked_count || 0) > 0 || Number(campaign.converted_count || 0) > 0);

    return [
      ...agentFollowups.slice(0, 4).map((lead: any) => ({
        id: `followup:${lead.id}`,
        title: `Follow up with ${lead.name || lead.email || "lead"}`,
        reason: "This lead has no recent communication and is still active in the CRM.",
        priority: lead.temperature === "hot" ? "urgent" : "high",
        due_date: tomorrow,
        lead_id: lead.id,
      })),
      ...staleDeals.slice(0, 3).map((deal: any) => ({
        id: `deal:${deal.id}`,
        title: `Recover stale deal: ${deal.title || deal.name || "Untitled deal"}`,
        reason: "This open deal has not moved recently or may be past its expected close date.",
        priority: Number(deal.value || 0) > 5000 ? "urgent" : "high",
        due_date: tomorrow,
        deal_id: deal.id,
      })),
      ...inboundCommunications.slice(0, 3).map((message: any) => ({
        id: `communication:${message.id}`,
        title: `Respond to ${message.recipient || "lead communication"}`,
        reason: "A real inbound or received communication is waiting for review.",
        priority: "high",
        due_date: tomorrow,
        lead_id: message.lead_id || "",
        campaign_id: message.campaign_id || "",
      })),
      ...appointments
        .filter((appointment: any) => appointment.status === "scheduled" && appointment.starts_at && new Date(appointment.starts_at).getTime() > now)
        .slice(0, 2)
        .map((appointment: any) => ({
          id: `appointment:${appointment.id}`,
          title: `Prepare for appointment: ${appointment.title || "Upcoming meeting"}`,
          reason: `Appointment is scheduled for ${formatDate(appointment.starts_at)}.`,
          priority: "medium",
          due_date: appointment.starts_at ? appointment.starts_at.slice(0, 16) : tomorrow,
          lead_id: appointment.lead_id || "",
          deal_id: appointment.deal_id || "",
        })),
      ...noShowAppointments.slice(0, 2).map((appointment: any) => ({
        id: `noshow:${appointment.id}`,
        title: `Follow up after no-show: ${appointment.title || "Appointment"}`,
        reason: "No-show appointments should get a reviewable follow-up task.",
        priority: "high",
        due_date: tomorrow,
        lead_id: appointment.lead_id || "",
        deal_id: appointment.deal_id || "",
      })),
      ...highIntentCampaigns.slice(0, 2).map((campaign: any) => ({
        id: `campaign:${campaign.id}`,
        title: `Review high-intent campaign responses: ${campaign.subject || campaign.name || campaign.type}`,
        reason: "This campaign has click or conversion activity that may require follow-up.",
        priority: "medium",
        due_date: twoDays,
        campaign_id: campaign.id,
      })),
      ...overdueTasks.slice(0, 2).map((task: any) => ({
        id: `overdue-task:${task.id}`,
        title: `Reassign or complete overdue task: ${task.title}`,
        reason: "This task is already overdue and needs owner attention.",
        priority: "urgent",
        due_date: tomorrow,
        lead_id: task.lead_id || "",
        deal_id: task.deal_id || "",
        campaign_id: task.campaign_id || "",
      })),
    ].filter((item) => !dismissedRecommendations.includes(item.id));
  }, [context, agents, dismissedRecommendations]);

  function editTask(task: any) {
    setForm({ ...emptyTask, ...task, due_date: task.due_date ? task.due_date.slice(0, 16) : "" });
    setOpen(true);
  }

  async function saveTask() {
    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/crm/tasks", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to save task.");
      setOpen(false);
      setForm(emptyTask);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save task.");
    } finally {
      setSaving(false);
    }
  }

  async function updateTask(task: any, status: string) {
    try {
      setActionLoading(`${task.id}:${status}`);
      setError("");
      const response = await fetch("/api/crm/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to update task.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update task.");
    } finally {
      setActionLoading("");
    }
  }

  async function runTaskReview() {
    try {
      setReviewing(true);
      setError("");
      setSuccess("");
      const response = await fetch("/api/crm/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "tasks" }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to run task review.");
      setAgents(json);
      setSuccess(`AI task review logged with ${json.recommendations?.length || 0} CRM recommendation${json.recommendations?.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to run task review.");
    } finally {
      setReviewing(false);
    }
  }

  async function approveRecommendation(recommendation: any) {
    try {
      setActionLoading(`${recommendation.id}:approve`);
      setError("");
      setSuccess("");
      const assigneeId = recommendationAssignees[recommendation.id] || "owner";
      const assignee = staffOptions.find((item) => item.id === assigneeId) || staffOptions[0];
      const response = await fetch("/api/crm/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recommendation.title,
          details: recommendation.reason,
          priority: recommendation.priority || "medium",
          status: "open",
          due_date: recommendation.due_date || "",
          lead_id: recommendation.lead_id || "",
          deal_id: recommendation.deal_id || "",
          campaign_id: recommendation.campaign_id || "",
          assigned_to: assignee.assigned_to,
          assigned_staff_id: assignee.assigned_staff_id,
          metadata: {
            source: "ai_task_recommendation",
            recommendation_id: recommendation.id,
            review_gated: true,
          },
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to create recommended task.");
      setDismissedRecommendations((current) => [...current, recommendation.id]);
      setSuccess("Recommended task created for review.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create recommended task.");
    } finally {
      setActionLoading("");
    }
  }

  function denyRecommendation(recommendation: any) {
    setDismissedRecommendations((current) => [...current, recommendation.id]);
    setSuccess("Recommendation dismissed for this session.");
  }

  function assignRecommendation(recommendation: any) {
    const current = recommendationAssignees[recommendation.id] || "owner";
    const currentIndex = staffOptions.findIndex((item) => item.id === current);
    const next = staffOptions[(currentIndex + 1) % staffOptions.length] || staffOptions[0];
    setRecommendationAssignees((values) => ({ ...values, [recommendation.id]: next.id }));
    setSuccess(`Recommendation assigned to ${next.label}. Approve it to create the task.`);
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center text-white"><Loader2 className="animate-spin text-cyan-300" size={34} /></main>;

  return (
    <main className="min-h-screen text-white">
      <QueryRecordFocus keys={["taskId"]} />
      <section className="mb-8 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
        <div>
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">Follow-up system</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Tasks & Follow-Ups</h1>
          <p className="mt-2 max-w-3xl text-gray-400">Manage real CRM tasks, due dates, priorities, and AI-recommended follow-up work.</p>
        </div>
        <button onClick={() => { setForm(emptyTask); setOpen(true); }} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2"><Plus size={18} /> Add Task</button>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {success && <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">{success}</div>}

      <MiniBrainInsightPanel
        title="Task Intelligence"
        subtitle="Today’s focus, overdue impact, staffing, and safe follow-up task suggestions."
        types={["task_intelligence", "staff_team", "next_best_action"]}
      />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[["Open", metrics.open, Clock], ["Completed", metrics.completed, CheckCircle2], ["High Priority", metrics.high, AlertTriangle], ["Overdue", metrics.overdue, AlertTriangle]].map(([label, value, Icon]: any) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <Icon className="mb-4 text-cyan-300" size={20} />
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </section>

      <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Search className="text-gray-500" size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="w-full bg-transparent outline-none text-white placeholder:text-gray-600" />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-black/40 p-3 text-white outline-none">
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-black/40 p-3 text-white outline-none">
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-black/40 p-3 text-white outline-none">
          <option value="all">All assignees</option>
          {staffOptions.map((member) => <option key={member.id} value={member.id}>{member.label}</option>)}
        </select>
      </div>

      <section className="mb-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Bot className="text-cyan-300" size={22} />
            <div>
              <h2 className="text-2xl font-black">AI Task Recommendations</h2>
              <p className="mt-1 text-sm text-gray-400">Generated from real leads, stale deals, overdue follow-ups, appointments, campaign interactions, and communications.</p>
            </div>
          </div>
          <button onClick={runTaskReview} disabled={reviewing} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 font-bold text-cyan-100 disabled:opacity-60">
            {reviewing ? "Reviewing..." : "Run Task Review"}
          </button>
        </div>
        {taskRecommendations.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
            No task recommendations right now. Add leads, deals, appointments, communications, or campaign interactions to generate next actions.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {taskRecommendations.map((recommendation) => {
              const assigneeId = recommendationAssignees[recommendation.id] || "owner";
              const assignee = staffOptions.find((item) => item.id === assigneeId) || staffOptions[0];
              return (
                <div key={recommendation.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-black text-white">{recommendation.title}</h3>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">{recommendation.priority}</span>
                  </div>
                  <p className="text-sm text-gray-400">{recommendation.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">Due {formatDate(recommendation.due_date)}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">Assigned: {assignee.label}</span>
                    {recommendation.lead_id && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">lead linked</span>}
                    {recommendation.deal_id && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">deal linked</span>}
                    {recommendation.campaign_id && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">campaign linked</span>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => approveRecommendation(recommendation)} disabled={Boolean(actionLoading)} className="rounded-xl border border-green-400/20 bg-green-500/10 px-3 py-2 text-xs font-bold text-green-100 disabled:opacity-60">
                      {actionLoading === `${recommendation.id}:approve` ? "Creating..." : "Approve"}
                    </button>
                    <button onClick={() => denyRecommendation(recommendation)} disabled={Boolean(actionLoading)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">Deny</button>
                    <button onClick={() => assignRecommendation(recommendation)} disabled={Boolean(actionLoading)} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60">Assign</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">No real tasks yet. Add a follow-up task or run the agent review to find next actions.</div>
        ) : filtered.map((task) => (
          <div key={task.id} data-record-id={task.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="font-black text-lg">{task.title}</div>
              <div className="mt-1 text-sm text-gray-500">{task.details || "No details"}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-cyan-100">{task.status}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">{task.priority}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">{formatDate(task.due_date)}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">assigned: {task.assigned_to || "Owner / Me"}</span>
                {task.lead_id && <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">lead linked</span>}
                {task.deal_id && <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">deal linked</span>}
                {task.campaign_id && <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">campaign linked</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateTask(task, "completed")}
                disabled={task.status === "completed" || Boolean(actionLoading)}
                className="rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-green-100 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading === `${task.id}:completed` ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                Complete
              </button>
              <button onClick={() => editTask(task)} disabled={Boolean(actionLoading)} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"><Save size={16} /></button>
              <button onClick={() => updateTask(task, "archived")} disabled={Boolean(actionLoading)} className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-100 disabled:cursor-not-allowed disabled:opacity-60">
                {actionLoading === `${task.id}:archived` ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              </button>
            </div>
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-cyan-400/20 bg-[#080808] p-6">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">{form.id ? "Edit Task" : "Add Task"}</h2><button onClick={() => setOpen(false)} className="rounded-xl border border-white/10 p-2"><X size={18} /></button></div>
            <div className="grid gap-4">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Details" className="min-h-28 rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <div className="grid gap-4 md:grid-cols-3">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none"><option value="open">open</option><option value="completed">completed</option><option value="overdue">overdue</option></select>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none"><option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="urgent">urgent</option></select>
                <input type="datetime-local" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <input value={form.lead_id || ""} onChange={(e) => setForm({ ...form, lead_id: e.target.value })} placeholder="Lead ID" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
                <input value={form.deal_id || ""} onChange={(e) => setForm({ ...form, deal_id: e.target.value })} placeholder="Deal ID" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
                <input value={form.campaign_id || ""} onChange={(e) => setForm({ ...form, campaign_id: e.target.value })} placeholder="Campaign ID" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              </div>
              <select
                value={form.assigned_staff_id || "owner"}
                onChange={(e) => {
                  const selected = staffOptions.find((member) => member.id === e.target.value) || staffOptions[0];
                  setForm({ ...form, assigned_staff_id: selected.assigned_staff_id, assigned_to: selected.assigned_to });
                }}
                className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none"
              >
                {staffOptions.map((member) => <option key={member.id} value={member.id}>{member.label}</option>)}
              </select>
            </div>
            <button disabled={saving || !form.title.trim()} onClick={saveTask} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save Task"}</button>
          </div>
        </div>
      )}
    </main>
  );
}
