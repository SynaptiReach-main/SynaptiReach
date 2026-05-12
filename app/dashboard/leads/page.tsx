"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Search, Plus, Filter, Phone, Mail, Clock3, Users, TrendingUp, Target, Sparkles, CheckCircle2, ChevronDown, ChevronUp, X } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  score: number;
  source: string;
  notes: string;
  created_at: string;
};

type Communication = {
  id: string;
  lead_id: string;
  channel: string;
  direction: string;
  content: string;
  created_at: string;
};

type Pipeline = {
  id: string;
  lead_id: string;
  stage: string;
  value: number;
  probability: number;
  created_at: string;
};

type Task = {
  id: string;
  title: string;
  status: string;
  due_date: string;
  assigned_to: string;
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#22d3ee", contacted: "#a78bfa", qualified: "#fb923c",
  converted: "#4ade80", lost: "#f87171", "follow up": "#fbbf24",
};

const CHANNEL_COLORS: Record<string, string> = {
  sms: "#22d3ee", email: "#a78bfa", call: "#34d399", whatsapp: "#4ade80",
};

const STAGES = ["new", "contacted", "qualified", "proposal", "negotiation", "closed won", "closed lost"];

function ScoreBadge({ score }: { score: number }) {
  const color = score > 70 ? "#4ade80" : score > 40 ? "#fb923c" : "#f87171";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-black font-mono" style={{ color }}>{score}</span>
    </div>
  );
}

function LeadDrawer({ lead, communications, pipeline, tasks, onClose }: {
  lead: Lead;
  communications: Communication[];
  pipeline: Pipeline[];
  tasks: Task[];
  onClose: () => void;
}) {
  const leadComms = communications.filter(c => c.lead_id === lead.id);
  const leadPipeline = pipeline.filter(p => p.lead_id === lead.id);
  const [activeSection, setActiveSection] = useState<"overview"|"messages"|"pipeline"|"tasks">("overview");

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#0a0d18] border-l border-white/8 h-full overflow-y-auto shadow-2xl">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap');`}</style>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0a0d18] border-b border-white/8 p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">{lead.name || "Unknown Lead"}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono capitalize"
                  style={{ color: STATUS_COLORS[lead.status] || "#888", background: `${STATUS_COLORS[lead.status] || "#888"}20` }}>
                  {lead.status}
                </span>
                {lead.source && <span className="text-xs text-gray-500 font-mono">{lead.source}</span>}
                <span className="text-xs text-gray-600 font-mono">{timeAgo(lead.created_at)}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
              <X size={20} />
            </button>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap gap-4 mt-4">
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors">
                <Mail size={13} />{lead.email}
              </a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 transition-colors">
                <Phone size={13} />{lead.phone}
              </a>
            )}
          </div>

          {/* Score */}
          <div className="mt-3">
            <ScoreBadge score={lead.score || 0} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-white/6 -mb-5 pb-0">
            {(["overview","messages","pipeline","tasks"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveSection(tab)}
                className={`px-3 py-2 text-xs font-semibold capitalize transition-colors border-b-2 ${activeSection === tab ? "border-cyan-400 text-cyan-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
                {tab}
                {tab === "messages" && leadComms.length > 0 && <span className="ml-1 text-[10px] bg-purple-400/15 text-purple-400 px-1 rounded-full">{leadComms.length}</span>}
                {tab === "pipeline" && leadPipeline.length > 0 && <span className="ml-1 text-[10px] bg-cyan-400/15 text-cyan-400 px-1 rounded-full">{leadPipeline.length}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4">

          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/8 bg-black/30 p-4">
                  <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">Lead Score</p>
                  <p className="text-3xl font-black mt-1" style={{ color: lead.score > 70 ? "#4ade80" : lead.score > 40 ? "#fb923c" : "#f87171" }}>{lead.score || 0}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/30 p-4">
                  <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">Messages</p>
                  <p className="text-3xl font-black mt-1 text-white">{leadComms.length}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/30 p-4">
                  <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">Pipeline Deals</p>
                  <p className="text-3xl font-black mt-1 text-white">{leadPipeline.length}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/30 p-4">
                  <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">Total Value</p>
                  <p className="text-3xl font-black mt-1 text-cyan-400">${leadPipeline.reduce((s, p) => s + (p.value || 0), 0).toLocaleString()}</p>
                </div>
              </div>

              {lead.notes && (
                <div className="rounded-xl border border-white/8 bg-black/20 p-4">
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">Notes</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{lead.notes}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="rounded-xl border border-white/8 bg-black/20 p-4">
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3">Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <p className="text-xs text-gray-400">Lead created <span className="text-gray-600 font-mono">{timeAgo(lead.created_at)}</span></p>
                  </div>
                  {leadComms.slice(0, 3).map(c => (
                    <div key={c.id} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CHANNEL_COLORS[c.channel] || "#666" }} />
                      <p className="text-xs text-gray-400 truncate">{c.channel} {c.direction} <span className="text-gray-600 font-mono">{timeAgo(c.created_at)}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeSection === "messages" && (
            <div className="space-y-3">
              {leadComms.length > 0 ? leadComms.map(c => (
                <div key={c.id} className={`rounded-xl border p-4 ${c.direction === "inbound" ? "border-emerald-400/20 bg-emerald-400/3 ml-4" : "border-white/8 bg-black/20 mr-4"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono capitalize"
                        style={{ color: CHANNEL_COLORS[c.channel] || "#888", background: `${CHANNEL_COLORS[c.channel] || "#888"}20` }}>{c.channel}</span>
                      <span className={`text-xs font-mono ${c.direction === "inbound" ? "text-emerald-400" : "text-cyan-400"}`}>{c.direction}</span>
                    </div>
                    <span className="text-xs text-gray-600 font-mono">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-300">{c.content || "—"}</p>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm font-mono">No messages yet</p>
                </div>
              )}
            </div>
          )}

          {/* PIPELINE */}
          {activeSection === "pipeline" && (
            <div className="space-y-3">
              {leadPipeline.length > 0 ? leadPipeline.map(p => (
                <div key={p.id} className="rounded-xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold capitalize text-white">{p.stage}</span>
                    <span className="text-xs font-mono text-cyan-400">{timeAgo(p.created_at)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 font-mono uppercase">Value</p>
                      <p className="text-xl font-black text-white mt-0.5">${(p.value || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-mono uppercase">Probability</p>
                      <p className="text-xl font-black text-emerald-400 mt-0.5">{p.probability || 0}%</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${p.probability || 0}%` }} />
                  </div>
                  {/* Stage progress */}
                  <div className="mt-3 flex gap-1">
                    {STAGES.slice(0, 6).map(s => (
                      <div key={s} className={`flex-1 h-1 rounded-full transition-all ${STAGES.indexOf(p.stage?.toLowerCase()) >= STAGES.indexOf(s) ? "bg-cyan-400" : "bg-white/8"}`} />
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm font-mono">No pipeline deals for this lead</p>
                </div>
              )}
            </div>
          )}

          {/* TASKS */}
          {activeSection === "tasks" && (
            <div className="space-y-3">
              {tasks.length > 0 ? tasks.map(t => (
                <div key={t.id} className="rounded-xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={15} className={t.status === "done" ? "text-emerald-400 mt-0.5" : "text-gray-600 mt-0.5"} />
                    <div className="flex-1">
                      <p className={`text-sm ${t.status === "done" ? "text-gray-500 line-through" : "text-white"}`}>{t.title}</p>
                      {t.due_date && <p className="text-xs text-gray-600 font-mono mt-1">Due {new Date(t.due_date).toLocaleDateString()}</p>}
                      {t.assigned_to && <p className="text-xs text-gray-600 mt-0.5">Assigned: {t.assigned_to}</p>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${t.status === "done" ? "text-emerald-400 bg-emerald-400/15" : "text-orange-400 bg-orange-400/15"}`}>{t.status}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm font-mono">No tasks for this lead</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", source: "" });
  const [adding, setAdding] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = "/signin"; return; }

      const { data: ws } = await supabase.from("workspaces").select("id").eq("owner_id", session.user.id).maybeSingle();
      if (!ws) { setLoading(false); return; }
      setWorkspaceId(ws.id);

      const [leadsRes, commsRes, pipelineRes, tasksRes] = await Promise.all([
        supabase.from("leads").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
        supabase.from("communications").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
        supabase.from("pipelines").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
        supabase.from("tasks").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (commsRes.data) setCommunications(commsRes.data);
      if (pipelineRes.data) setPipeline(pipelineRes.data);
      if (tasksRes.data) setTasks(tasksRes.data);
      setLoading(false);
    }
    load();

    const channel = supabase.channel("leads-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (payload) => {
        if (payload.eventType === "INSERT") setLeads(p => [payload.new as Lead, ...p]);
        if (payload.eventType === "UPDATE") setLeads(p => p.map(l => l.id === payload.new.id ? payload.new as Lead : l));
        if (payload.eventType === "DELETE") setLeads(p => p.filter(l => l.id !== payload.old.id));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "communications" }, (payload) => {
        setCommunications(p => [payload.new as Communication, ...p]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function addLead() {
    if (!workspaceId || !newLead.name) return;
    setAdding(true);
    const { data, error } = await supabase.from("leads").insert({
      workspace_id: workspaceId,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      source: newLead.source,
      status: "new",
      score: 0,
    }).select().single();
    if (!error && data) {
      setLeads(p => [data, ...p]);
      setNewLead({ name: "", email: "", phone: "", source: "" });
      setShowAddForm(false);
    }
    setAdding(false);
  }

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const newLeads = leads.filter(l => l.status === "new").length;
  const hotLeads = leads.filter(l => l.score >= 70).length;
  const convertedLeads = leads.filter(l => l.status === "converted").length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;
  const avgDealValue = pipeline.length > 0 ? Math.round(pipeline.reduce((s, p) => s + (p.value || 0), 0) / pipeline.length) : 0;

  const PIPELINE_STAGES = [
    { label: "New Leads", count: newLeads, color: "from-cyan-400 to-cyan-300" },
    { label: "Contacted", count: leads.filter(l => l.status === "contacted").length, color: "from-sky-400 to-cyan-300" },
    { label: "Qualified", count: leads.filter(l => l.status === "qualified").length, color: "from-emerald-400 to-cyan-300" },
    { label: "Proposal", count: pipeline.filter(p => p.stage === "proposal").length, color: "from-purple-400 to-cyan-300" },
    { label: "Closed", count: convertedLeads, color: "from-green-400 to-emerald-300" },
  ];
  const maxPipelineCount = Math.max(...PIPELINE_STAGES.map(s => s.count), 1);

  if (loading) return (
    <main className="min-h-screen bg-[#060810] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
    </main>
  );

  return (
    <div className="min-h-screen bg-[#060810] text-white p-4 md:p-6 space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap');
        .lead-row { transition: all 0.2s; cursor: pointer; }
        .lead-row:hover { background: rgba(255,255,255,0.02); }
        .pulse-dot { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .bar-fill { transition: width 1.2s cubic-bezier(.4,0,.2,1); }
      `}</style>

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0d18] p-6 md:p-8">
        <div className="absolute -top-20 left-0 w-72 h-72 bg-cyan-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-72 h-72 bg-emerald-500/8 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
              <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Lead Operations · Live</span>
            </div>
            <h1 className="text-4xl font-black">Sales Pipeline</h1>
            <p className="text-gray-500 mt-2 text-sm">{leads.length} total leads · {hotLeads} hot · {conversionRate}% conversion rate</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddForm(true)}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all flex items-center gap-2 text-sm">
              <Plus size={16} /> Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* ADD LEAD FORM */}
      {showAddForm && (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">New Lead</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: "name", placeholder: "Full Name *" },
              { key: "email", placeholder: "Email" },
              { key: "phone", placeholder: "Phone" },
              { key: "source", placeholder: "Source" },
            ].map(f => (
              <input key={f.key} placeholder={f.placeholder}
                value={(newLead as any)[f.key]}
                onChange={e => setNewLead(p => ({ ...p, [f.key]: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-400/40 transition-colors" />
            ))}
          </div>
          <button onClick={addLead} disabled={adding || !newLead.name}
            className="mt-3 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-sm transition-all">
            {adding ? "Adding..." : "Add Lead"}
          </button>
        </div>
      )}

      {/* KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: leads.length, icon: <Users size={16} />, color: "#22d3ee" },
          { label: "Hot Leads", value: hotLeads, icon: <Sparkles size={16} />, color: "#fb923c" },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: <TrendingUp size={16} />, color: "#4ade80" },
          { label: "Avg Deal Size", value: avgDealValue ? `$${avgDealValue.toLocaleString()}` : "—", icon: <Target size={16} />, color: "#a78bfa" },
        ].map(card => (
          <div key={card.label} className="rounded-2xl border border-white/8 bg-[#0a0d18] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15`, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <h2 className="text-3xl font-black text-white">{card.value}</h2>
            <p className="text-gray-500 text-xs mt-1 font-mono uppercase tracking-widest">{card.label}</p>
          </div>
        ))}
      </div>

      {/* PIPELINE OVERVIEW */}
      <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
        <h2 className="text-lg font-bold mb-5">Pipeline Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.label} className="relative overflow-hidden rounded-xl border border-white/8 bg-black/30 p-4">
              <div className={`absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r ${stage.color}`} />
              <p className="text-gray-500 text-xs font-mono">{stage.label}</p>
              <h3 className="text-3xl font-black text-white mt-3">{stage.count}</h3>
              <div className="mt-3 h-1.5 rounded-full bg-white/6 overflow-hidden">
                <div className={`bar-fill h-full rounded-full bg-gradient-to-r ${stage.color}`}
                  style={{ width: `${(stage.count / maxPipelineCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="rounded-2xl border border-white/8 bg-[#0a0d18] overflow-hidden">
        <div className="p-5 border-b border-white/6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 rounded-xl border border-white/8 bg-black/30 px-4 py-2.5">
            <Search size={15} className="text-gray-500 shrink-0" />
            <input placeholder="Search leads by name or email..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-white placeholder-gray-600 w-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "new", "contacted", "qualified", "converted", "lost"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${filterStatus === s ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
                {s} {s === "all" ? `(${leads.length})` : `(${leads.filter(l => l.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div>
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/4 text-xs text-gray-600 font-mono uppercase tracking-widest">
              <span className="col-span-3">Name</span>
              <span className="col-span-3">Contact</span>
              <span className="col-span-2">Source</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-1 text-right">Score</span>
              <span className="col-span-1 text-right">Added</span>
            </div>
            {filtered.map(lead => (
              <div key={lead.id} className="lead-row grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/4"
                onClick={() => setSelectedLead(lead)}>
                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[lead.status] || "#666" }} />
                  <span className="text-sm font-semibold text-white truncate">{lead.name || "—"}</span>
                </div>
                <div className="col-span-3 min-w-0">
                  <p className="text-xs text-gray-400 truncate">{lead.email || "—"}</p>
                  <p className="text-xs text-gray-600 truncate font-mono">{lead.phone || "—"}</p>
                </div>
                <span className="col-span-2 text-xs text-gray-500 capitalize self-center">{lead.source || "—"}</span>
                <span className="col-span-2 self-center">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono capitalize"
                    style={{ color: STATUS_COLORS[lead.status] || "#888", background: `${STATUS_COLORS[lead.status] || "#888"}15` }}>
                    {lead.status}
                  </span>
                </span>
                <div className="col-span-1 self-center flex justify-end">
                  <span className="text-sm font-black font-mono" style={{ color: lead.score > 70 ? "#4ade80" : lead.score > 40 ? "#fb923c" : "#f87171" }}>{lead.score || 0}</span>
                </div>
                <span className="col-span-1 text-right text-xs text-gray-600 font-mono self-center">{timeAgo(lead.created_at)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-600 text-sm font-mono">{search || filterStatus !== "all" ? "No leads match your filters." : "No leads yet — add your first lead above."}</p>
          </div>
        )}
      </div>

      {/* LEAD DRAWER */}
      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          communications={communications}
          pipeline={pipeline}
          tasks={tasks}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
