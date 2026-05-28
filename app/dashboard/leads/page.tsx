"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Bot,
  BriefcaseBusiness,
  Edit2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Save,
  Search,
  Tag,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import LeadCsvImportModal from "@/components/leads/LeadCsvImportModal";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";
import OwnerFocusPanel from "@/components/dashboard/OwnerFocusPanel";

const statuses = ["new", "contacted", "qualified", "nurture", "converted", "lost"];
const statusColors: Record<string, string> = {
  new: "text-cyan-200 border-cyan-400/20 bg-cyan-500/10",
  contacted: "text-purple-200 border-purple-400/20 bg-purple-500/10",
  qualified: "text-yellow-100 border-yellow-400/20 bg-yellow-500/10",
  nurture: "text-blue-100 border-blue-400/20 bg-blue-500/10",
  converted: "text-green-100 border-green-400/20 bg-green-500/10",
  lost: "text-red-100 border-red-400/20 bg-red-500/10",
};

const emptyLead = {
  id: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "",
  status: "new",
  score: 0,
  notes: "",
  tags: "",
};

function formatDate(value?: string) {
  if (!value) return "Never";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
}

function scoreLabel(score: number) {
  if (score >= 70) return "Hot";
  if (score >= 40) return "Warm";
  return "Cold";
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [communications, setCommunications] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [campaignInteractions, setCampaignInteractions] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [agentData, setAgentData] = useState<any>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyLead);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [leadsRes, commsRes, agentsRes] = await Promise.all([
        fetch("/api/crm/leads"),
        fetch("/api/crm/communications"),
        fetch("/api/crm/agents/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent: "deterministic" }),
        }),
      ]);

      const leadsData = await leadsRes.json();
      const commsData = await commsRes.json();
      const agentsData = await agentsRes.json();
      const [tasksRes, dealsRes, dashboardRes] = await Promise.all([
        fetch("/api/crm/tasks"),
        fetch("/api/crm/deals"),
        fetch("/api/crm/dashboard"),
      ]);
      const tasksData = await tasksRes.json();
      const dealsData = await dealsRes.json();
      const dashboardData = await dashboardRes.json();

      if (!leadsRes.ok || !leadsData.success) {
        throw new Error(leadsData?.error || "Failed to load leads.");
      }

      setLeads(leadsData.leads || leadsData.data || []);
      setCommunications(commsData.communications || commsData.data || []);
      setTasks(tasksData.tasks || tasksData.data || []);
      setDeals(dealsData.deals || dealsData.data || []);
      setCampaignInteractions(
        [
          ...(dashboardData?.data?.activity || []),
          ...(dashboardData?.data?.campaigns || []),
        ]
      );
      if (agentsData.success) setAgentData(agentsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLeadActivity(leadId: string) {
    const response = await fetch(`/api/crm/leads/activity?lead_id=${encodeURIComponent(leadId)}`);
    const data = await response.json();
    setActivity(data.activities || []);
  }

  useEffect(() => {
    loadData();
    window.addEventListener("crm-leads-imported", loadData);
    return () => window.removeEventListener("crm-leads-imported", loadData);
  }, []);

  async function saveLead() {
    try {
      setSaving(true);
      setError("");
      const method = form.id ? "PATCH" : "POST";
      const response = await fetch("/api/crm/leads", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          metadata: {
            ...(form.metadata || {}),
            tags: String(form.tags || "")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          },
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to save lead.");
      }

      setForm(emptyLead);
      setFormOpen(false);
      setSelected(data.lead);
      await loadData();
      await loadLeadActivity(data.lead.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save lead.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(lead: any, status: string) {
    try {
      setActionLoading(`status-${status}`);
      setError("");
      const response = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, status }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.error || "Failed to update status.");
      setSelected(data.lead);
      await loadData();
      await loadLeadActivity(data.lead.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update status.");
    } finally {
      setActionLoading("");
    }
  }

  async function archiveLead(lead: any) {
    try {
      setActionLoading("archive");
      setError("");
      const response = await fetch(`/api/crm/leads?id=${encodeURIComponent(lead.id)}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.error || "Failed to archive lead.");
      setSelected(null);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to archive lead.");
    } finally {
      setActionLoading("");
    }
  }

  async function addNote() {
    if (!selected || !note.trim()) return;

    try {
      setActionLoading("note");
      setError("");
      const response = await fetch("/api/crm/leads/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: selected.id,
          type: "note",
          title: "Lead note",
          details: note,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.error || "Failed to add note.");
      setNote("");
      await loadLeadActivity(selected.id);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add note.");
    } finally {
      setActionLoading("");
    }
  }

  function openCreate() {
    setForm(emptyLead);
    setFormOpen(true);
  }

  function openEdit(lead: any) {
    setForm({
      ...emptyLead,
      ...lead,
      tags: Array.isArray(lead.metadata?.tags) ? lead.metadata.tags.join(", ") : "",
    });
    setFormOpen(true);
  }

  async function selectLead(lead: any) {
    setSelected(lead);
    await loadLeadActivity(lead.id);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads
      .filter((lead) => {
        const matchesSearch =
          !q ||
          [lead.name, lead.email, lead.phone, lead.company, lead.source]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(q));
        const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
        const matchesSource = sourceFilter === "all" || (lead.source || "unknown") === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        if (sortBy === "score") return Number(b.score || 0) - Number(a.score || 0);
        if (sortBy === "status") return String(a.status || "").localeCompare(String(b.status || ""));
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [leads, search, statusFilter, sourceFilter, sortBy]);

  const sources = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.source || "unknown"))).sort(),
    [leads]
  );

  const leadComms = selected
    ? communications.filter((item) => item.lead_id === selected.id)
    : [];
  const leadTasks = selected ? tasks.filter((item) => item.lead_id === selected.id) : [];
  const leadDeals = selected ? deals.filter((item) => item.lead_id === selected.id) : [];
  const leadCampaignInteractions = selected
    ? campaignInteractions.filter((item) => {
        const metadata = item.metadata || {};
        return (
          item.lead_id === selected.id ||
          metadata.lead_id === selected.id ||
          metadata.email === selected.email ||
          metadata.lead_email === selected.email ||
          (selected.email && String(item.message || item.details || "").includes(selected.email))
        );
      })
    : [];
  const agentLead = selected
    ? (agentData?.scored_leads || []).find((lead: any) => lead.id === selected.id)
    : null;

  const metrics = {
    total: leads.length,
    new: leads.filter((lead) => lead.status === "new").length,
    qualified: leads.filter((lead) => lead.status === "qualified").length,
    converted: leads.filter((lead) => lead.status === "converted").length,
    hot: leads.filter((lead) => Number(lead.score || 0) >= 70).length,
  };

  async function createFollowUpTask(lead: any) {
    try {
      setActionLoading("task");
      setError("");
      const response = await fetch("/api/crm/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          title: `Follow up with ${lead.name || lead.email || "lead"}`,
          details: agentLead
            ? `AI signal: ${agentLead.temperature} lead with recommended score ${agentLead.recommended_score}.`
            : "Follow up from lead detail panel.",
          priority: Number(lead.score || 0) >= 70 ? "high" : "medium",
          status: "open",
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          metadata: { source: "leads_page" },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to create task.");
      await loadLeadActivity(lead.id);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create task.");
    } finally {
      setActionLoading("");
    }
  }

  async function convertToDeal(lead: any) {
    try {
      setActionLoading("deal");
      setError("");
      const response = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          title: `${lead.name || lead.company || "Lead"} opportunity`,
          company: lead.company || null,
          stage: lead.status === "qualified" ? "qualified" : "new",
          status: "open",
          value: 0,
          probability: Number(lead.score || 0) >= 70 ? 60 : 25,
          notes: lead.notes || null,
          metadata: { source: "lead_conversion", lead_email: lead.email || null },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to create deal.");
      await updateStatus(lead, "qualified");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create deal.");
    } finally {
      setActionLoading("");
    }
  }

  async function draftMessage(lead: any) {
    try {
      setActionLoading("draft");
      setError("");
      const response = await fetch("/api/crm/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          channel: lead.phone ? "sms" : "email",
          recipient: lead.email || lead.phone || null,
          subject: lead.email ? `Follow-up for ${lead.name || "your request"}` : null,
          content: agentLead
            ? `Hi ${lead.name || "there"}, following up because ${agentLead.temperature} engagement was detected.`
            : `Hi ${lead.name || "there"}, following up from SynaptiReach.`,
          status: "draft",
          metadata: { source: "lead_detail_panel", review_required: true },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to create draft.");
      await fetch("/api/crm/leads/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          type: "communication",
          title: "Draft message created",
          details: "Review-gated draft communication was created from the lead profile.",
          metadata: { communication_id: data.communication?.id },
        }),
      });
      await loadData();
      await loadLeadActivity(lead.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create draft.");
    } finally {
      setActionLoading("");
    }
  }

  async function runAINextStepReview(lead: any) {
    try {
      setActionLoading("ai-review");
      setError("");
      const response = await fetch("/api/crm/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "lead_scoring", lead_id: lead.id }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to run AI review.");
      setAgentData(data);
      await fetch("/api/crm/leads/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          type: "ai_review",
          title: "AI next-step review",
          details: data.summary?.text || data.summary || "AI review completed for this lead.",
          metadata: { provider: data.provider, model: data.model, fallback_used: data.fallback_used },
        }),
      });
      await loadLeadActivity(lead.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to run AI review.");
    } finally {
      setActionLoading("");
    }
  }

  return (
    <main className="min-h-screen text-white">
      <QueryRecordFocus keys={["leadId"]} />
      <LeadCsvImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={loadData}
      />
      <section className="mb-8">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs mb-4">
              <Users size={14} />
              Lead Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Sales
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                {" "}Pipeline
              </span>
            </h1>
            <p className="text-gray-400 mt-3 max-w-3xl">
              Real lead records, follow-up history, activity notes, and AI scoring guidance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setImportOpen(true)} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 flex items-center gap-2 w-fit">
              <Upload size={18} />
              Import CSV
            </button>
            <button onClick={openCreate} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2 w-fit">
              <Plus size={18} />
              Create Lead
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <OwnerFocusPanel
        items={[
          {
            label: "Highest intent",
            value: metrics.hot,
            detail: "Hot leads should be reviewed first because they are most likely to need a timely response.",
            action: "Filter or sort by score",
            tone: metrics.hot > 0 ? "yellow" : "cyan",
          },
          {
            label: "Starter records",
            value: metrics.total,
            detail: "Create a lead manually or import a real CSV when the list is empty. Test data belongs only in test workspaces.",
            action: "Create or import leads",
            tone: "cyan",
          },
          {
            label: "Next safe step",
            detail: "Select a lead to see contact history, linked work, notes, and review-gated recommendations before acting.",
            action: "Open a lead profile",
            tone: "green",
          },
        ]}
      />

      <MiniBrainInsightPanel
        title="Lead Intelligence"
        subtitle="Lead fit, intent, freshness, duplicates, and review-gated next steps generated without external AI."
        types={["lead_intelligence", "safety_compliance"]}
      />

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          ["Total", metrics.total],
          ["New", metrics.new],
          ["Qualified", metrics.qualified],
          ["Converted", metrics.converted],
          ["Hot", metrics.hot],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-gray-500" size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone, source..." className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 pl-12 text-white" />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
              <option value="all">All statuses</option>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
              <option value="all">All sources</option>
              {sources.map((source) => <option key={source} value={source}>{source}</option>)}
            </select>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
              <option value="newest">Newest</option>
              <option value="score">Score</option>
              <option value="status">Status</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center p-16"><Loader2 className="animate-spin text-cyan-300" /></div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-10 text-center text-gray-400">
              No leads found. Create your first lead or adjust filters.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((lead) => (
                <button key={lead.id} data-record-id={lead.id} onClick={() => selectLead(lead)} className="w-full text-left rounded-2xl border border-white/10 bg-black/30 p-4 hover:border-cyan-400/30 transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{lead.name || lead.email || lead.phone || "Unnamed lead"}</div>
                      <div className="text-sm text-gray-500 truncate">{lead.company || lead.source || "No company/source"} - {lead.email || lead.phone || "No contact"}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[lead.status] || statusColors.new}`}>{lead.status || "new"}</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-300">{scoreLabel(Number(lead.score || 0))}: {lead.score || 0}</span>
                      {(lead.metadata?.tags || []).slice(0, 2).map((tag: string) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-400">
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs text-gray-500">{formatDate(lead.last_interaction || lead.created_at)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5 h-fit">
          {!selected ? (
            <div className="text-center py-14 text-gray-400">
              <User className="mx-auto mb-4 text-cyan-300" size={32} />
              Select a lead to view profile, activity, campaign interactions, and AI next step.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">{selected.name || "Unnamed lead"}</h2>
                  <p className="text-sm text-gray-400">{selected.company || selected.source || "No company/source"}</p>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-xl border border-white/10 bg-black/30 p-2 text-gray-400"><X size={16} /></button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.email && <a href={`mailto:${selected.email}`} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-cyan-100 flex items-center gap-2"><Mail size={14} />{selected.email}</a>}
                {selected.phone && <a href={`tel:${selected.phone}`} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-cyan-100 flex items-center gap-2"><Phone size={14} />{selected.phone}</a>}
              </div>

              {Array.isArray(selected.metadata?.tags) && selected.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selected.metadata.tags.map((tag: string) => (
                    <span key={tag} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-300 flex items-center gap-2">
                      <Tag size={13} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Status</div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selected, status)}
                      disabled={Boolean(actionLoading)}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 ${selected.status === status ? statusColors[status] : "border-white/10 bg-black/30 text-gray-400"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="text-cyan-300" size={18} />
                  <div className="font-bold text-white">AI Recommended Next Step</div>
                </div>
                <p className="text-sm text-gray-300">
                  {agentLead
                    ? `${agentLead.temperature} lead. Recommended score ${agentLead.recommended_score}. ${agentLead.temperature === "hot" ? "Prioritize direct follow-up." : agentLead.temperature === "warm" ? "Send a value-focused nurture message." : "Add to a low-pressure nurture segment."}`
                    : "Run CRM intelligence or add more activity to generate a stronger recommendation."}
                </p>
                <button
                  onClick={() => runAINextStepReview(selected)}
                  disabled={actionLoading === "ai-review"}
                  className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60"
                >
                  {actionLoading === "ai-review" ? "Reviewing..." : "Run AI next-step review"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => openEdit(selected)} disabled={Boolean(actionLoading)} className="rounded-2xl border border-white/10 bg-black/30 p-3 font-bold text-white flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"><Edit2 size={16} /> Edit</button>
                <button onClick={() => archiveLead(selected)} disabled={Boolean(actionLoading)} className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 font-bold text-red-100 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
                  {actionLoading === "archive" ? <Loader2 className="animate-spin" size={16} /> : <Archive size={16} />}
                  Archive
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button disabled={actionLoading === "task"} onClick={() => createFollowUpTask(selected)} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 font-bold text-cyan-100 flex items-center justify-center gap-2 disabled:opacity-60">
                  {actionLoading === "task" ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                  Create Follow-Up
                </button>
                <button disabled={actionLoading === "deal"} onClick={() => convertToDeal(selected)} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 font-bold text-cyan-100 flex items-center justify-center gap-2 disabled:opacity-60">
                  {actionLoading === "deal" ? <Loader2 className="animate-spin" size={16} /> : <BriefcaseBusiness size={16} />}
                  Convert To Deal
                </button>
                <button disabled={actionLoading === "draft"} onClick={() => draftMessage(selected)} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 font-bold text-cyan-100 flex items-center justify-center gap-2 disabled:opacity-60 md:col-span-2">
                  {actionLoading === "draft" ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                  Draft Review-Gated Message
                </button>
              </div>

              <div>
                <div className="font-bold text-white mb-3">Add Note</div>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} className="w-full min-h-[100px] rounded-2xl border border-white/10 bg-black/30 p-3 text-white" placeholder="Write a note..." />
                <button onClick={addNote} disabled={actionLoading === "note" || !note.trim()} className="mt-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-2 font-black text-black disabled:cursor-not-allowed disabled:opacity-60">
                  {actionLoading === "note" ? "Saving..." : "Save Note"}
                </button>
              </div>

              <div>
                <div className="font-bold text-white mb-3">Tasks / Follow-Ups</div>
                <div className="space-y-2">
                  {leadTasks.length === 0 ? (
                    <div className="text-sm text-gray-500">No linked tasks yet.</div>
                  ) : leadTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                      <div className="text-sm font-bold text-white">{task.title}</div>
                      <div className="text-sm text-gray-400">{task.priority || "medium"} - {task.status}</div>
                      <div className="text-xs text-gray-600 mt-1">{formatDate(task.due_date)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-white mb-3">Linked Deals</div>
                <div className="space-y-2">
                  {leadDeals.length === 0 ? (
                    <div className="text-sm text-gray-500">No linked deals yet.</div>
                  ) : leadDeals.map((deal) => (
                    <div key={deal.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                      <div className="text-sm font-bold text-white">{deal.title}</div>
                      <div className="text-sm text-gray-400">{deal.stage || "new"} - ${Number(deal.value || 0).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-white mb-3">Campaign Interactions</div>
                <div className="space-y-2">
                  {leadCampaignInteractions.length === 0 ? (
                    <div className="text-sm text-gray-500">No campaign interactions found for this lead.</div>
                  ) : leadCampaignInteractions.slice(0, 6).map((item, index) => (
                    <div key={item.id || index} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                      <div className="text-sm font-bold text-white">{item.subject || item.action || item.type || "Campaign interaction"}</div>
                      <div className="text-sm text-gray-400">{item.details || item.message || item.status || "No details recorded."}</div>
                      <div className="text-xs text-gray-600 mt-1">{formatDate(item.created_at || item.send_date)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-white mb-3">Activity & Communication History</div>
                <div className="space-y-2">
                  {activity.length === 0 && leadComms.length === 0 ? <div className="text-sm text-gray-500">No activity yet.</div> : null}
                  {activity.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                      <div className="text-sm font-bold text-white">{item.title || item.type}</div>
                      <div className="text-sm text-gray-400">{item.details}</div>
                      <div className="text-xs text-gray-600 mt-1">{formatDate(item.created_at)}</div>
                    </div>
                  ))}
                  {leadComms.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                      <div className="text-sm font-bold text-white flex items-center gap-2"><MessageSquare size={14} />{item.channel} {item.status}</div>
                      <div className="text-sm text-gray-400">{item.content}</div>
                      <div className="text-xs text-gray-600 mt-1">{formatDate(item.created_at)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </section>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-3xl border border-cyan-500/20 bg-[#061018] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-black">{form.id ? "Edit Lead" : "Create Lead"}</h2>
              <button onClick={() => setFormOpen(false)} className="rounded-xl border border-white/10 bg-black/30 p-2 text-gray-400"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["name", "Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["company", "Company"],
                ["source", "Source"],
                ["score", "Score"],
                ["tags", "Tags, comma separated"],
              ].map(([key, label]) => (
                <input key={key} value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: key === "score" ? Number(event.target.value) : event.target.value })} placeholder={label} type={key === "score" ? "number" : "text"} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
              ))}
              <select value={form.status || "new"} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            <textarea value={form.notes || ""} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" className="mt-4 w-full min-h-[120px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
            <button onClick={saveLead} disabled={saving} className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Lead
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
