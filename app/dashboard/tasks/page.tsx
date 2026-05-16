"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Loader2, Plus, Save, Search, Trash2, X } from "lucide-react";

const emptyTask = { id: "", title: "", details: "", status: "open", priority: "medium", due_date: "", lead_id: "", deal_id: "", campaign_id: "" };

function formatDate(value?: string) {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyTask);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/crm/tasks");
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to load tasks.");
      setTasks(json.tasks || json.data || []);
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
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const metrics = useMemo(() => ({
    open: tasks.filter((task) => task.status === "open").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    high: tasks.filter((task) => ["high", "urgent"].includes(task.priority)).length,
    overdue: tasks.filter((task) => task.status === "open" && task.due_date && new Date(task.due_date).getTime() < Date.now()).length,
  }), [tasks]);

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

  if (loading) return <main className="min-h-screen flex items-center justify-center text-white"><Loader2 className="animate-spin text-cyan-300" size={34} /></main>;

  return (
    <main className="min-h-screen text-white">
      <section className="mb-8 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
        <div>
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">Follow-up system</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Tasks & Follow-Ups</h1>
          <p className="mt-2 max-w-3xl text-gray-400">Manage real CRM tasks, due dates, priorities, and AI-recommended follow-up work.</p>
        </div>
        <button onClick={() => { setForm(emptyTask); setOpen(true); }} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2"><Plus size={18} /> Add Task</button>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

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
      </div>

      <section className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">No real tasks yet. Add a follow-up task or run the agent review to find next actions.</div>
        ) : filtered.map((task) => (
          <div key={task.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="font-black text-lg">{task.title}</div>
              <div className="mt-1 text-sm text-gray-500">{task.details || "No details"}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-cyan-100">{task.status}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">{task.priority}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">{formatDate(task.due_date)}</span>
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
            </div>
            <button disabled={saving || !form.title.trim()} onClick={saveTask} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save Task"}</button>
          </div>
        </div>
      )}
    </main>
  );
}
