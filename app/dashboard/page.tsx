"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Workspace = {
  id: string;
  name: string;
  industry: string;
  monthly_revenue: number;
  yearly_revenue: number;
  lead_count: number;
  open_tasks: number;
  response_rate: number;
  integrations: string[];
  onboarding_data: any;
  intelligence: any;
  ai_ceo_state: any;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  score: number;
  source: string;
  created_at: string;
};

type Task = {
  id: string;
  title: string;
  status: string;
  assigned_to: string;
  due_date: string;
  created_at: string;
};

type Pipeline = {
  id: string;
  stage: string;
  probability: number;
  value: number;
  lead_id: string;
  created_at: string;
};

type Automation = {
  id: string;
  name: string;
  trigger_event: string;
  action_type: string;
  enabled: boolean;
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

type AiDecision = {
  id: string;
  decision_type: string;
  reasoning: string;
  confidence: number;
  created_at: string;
};

function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!target) return;
    const steps = 60;
    const increment = target / steps;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setCurrent(Math.min(Math.round(increment * count), target));
      if (count >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{prefix}{current.toLocaleString()}{suffix}</>;
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2} r="2.5" fill={color} />
    </svg>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="text-gray-600 text-sm font-mono">No {label} yet — populates as data comes in.</p>;
}

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
  converted: "#4ade80", lost: "#f87171", open: "#22d3ee",
  done: "#4ade80", overdue: "#f87171",
};

const CHANNEL_COLORS: Record<string, string> = {
  sms: "#22d3ee", email: "#a78bfa", call: "#34d399", whatsapp: "#4ade80",
};

const PERSONALITY_LABELS: Record<string, string> = {
  executive: "Apex Commander", hustler: "Revenue Titan",
  specialist: "Precision Operator", advisor: "Trusted Advisor",
};

export default function DashboardPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [aiDecisions, setAiDecisions] = useState<AiDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview"|"leads"|"pipeline"|"messages"|"automations"|"ai">("overview");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = "/signin"; return; }

      const { data: ws } = await supabase.from("workspaces").select("*").eq("owner_id", session.user.id).maybeSingle();
      if (!ws) { setLoading(false); return; }
      setWorkspace(ws);

      const [leadsRes, tasksRes, pipelineRes, autoRes, commsRes, aiRes] = await Promise.all([
        supabase.from("leads").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("tasks").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("pipelines").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
        supabase.from("automations").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
        supabase.from("communications").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }).limit(30),
        supabase.from("ai_decisions").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }).limit(20),
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (tasksRes.data) setTasks(tasksRes.data);
      if (pipelineRes.data) setPipeline(pipelineRes.data);
      if (autoRes.data) setAutomations(autoRes.data);
      if (commsRes.data) setCommunications(commsRes.data);
      if (aiRes.data) setAiDecisions(aiRes.data);
      setLoading(false);
    }
    load();

    // Real-time subscriptions
    const channel = supabase.channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (payload) => {
        if (payload.eventType === "INSERT") setLeads(p => [payload.new as Lead, ...p.slice(0, 49)]);
        if (payload.eventType === "UPDATE") setLeads(p => p.map(l => l.id === payload.new.id ? payload.new as Lead : l));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        if (payload.eventType === "INSERT") setTasks(p => [payload.new as Task, ...p.slice(0, 19)]);
        if (payload.eventType === "UPDATE") setTasks(p => p.map(t => t.id === payload.new.id ? payload.new as Task : t));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "communications" }, (payload) => {
        if (payload.eventType === "INSERT") setCommunications(p => [payload.new as Communication, ...p.slice(0, 29)]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-[#060810] text-white flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
    </main>
  );

  if (!workspace) return (
    <main className="min-h-screen bg-[#060810] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-bold mb-4">No workspace found.</p>
        <a href="/onboarding" className="text-cyan-400 underline">Complete onboarding</a>
      </div>
    </main>
  );

  const od = workspace.onboarding_data || {};
  const aiPersonality = od.aiPersonality || "—";
  const responseTime = od.responseTime || "—";
  const services: string[] = od.services || [];
  const integrations: string[] = workspace.integrations || od.integrations || [];
  const peakMonths: string[] = od.peakMonths || [];
  const slowMonths: string[] = od.slowMonths || [];
  const monthlyRevenue = workspace.monthly_revenue || Number(od.monthlyRevenue) || 0;
  const yearlyRevenue = workspace.yearly_revenue || Number(od.yearlyRevenue) || 0;
  const customerLTV = Number(od.customerLTV) || 0;
  const roiTarget = od.roiTarget || "—";
  const priorities: string[] = workspace.ai_ceo_state?.priorities || [];

  // Computed metrics
  const newLeads = leads.filter(l => l.status === "new").length;
  const convertedLeads = leads.filter(l => l.status === "converted").length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;
  const openTasks = tasks.filter(t => t.status === "open").length;
  const pipelineValue = pipeline.reduce((sum, p) => sum + (p.value || 0), 0);
  const weightedPipeline = pipeline.reduce((sum, p) => sum + ((p.value || 0) * (p.probability || 0) / 100), 0);
  const activeAutomations = automations.filter(a => a.enabled).length;
  const inboundMessages = communications.filter(c => c.direction === "inbound").length;
  const outboundMessages = communications.filter(c => c.direction === "outbound").length;
  const avgLeadScore = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + (l.score || 0), 0) / leads.length) : 0;

  const STATS = [
    { label: "Monthly Revenue", value: monthlyRevenue, prefix: "$", suffix: "", color: "#22d3ee", spark: monthlyRevenue ? [monthlyRevenue * 0.7, monthlyRevenue * 0.8, monthlyRevenue * 0.85, monthlyRevenue * 0.9, monthlyRevenue * 0.95, monthlyRevenue] : [] },
    { label: "Pipeline Value", value: Math.round(pipelineValue), prefix: "$", suffix: "", color: "#34d399", spark: [] },
    { label: "Total Leads", value: leads.length, prefix: "", suffix: "", color: "#fb923c", spark: [] },
    { label: "Conversion Rate", value: conversionRate, prefix: "", suffix: "%", color: "#4ade80", spark: [] },
    { label: "Open Tasks", value: openTasks, prefix: "", suffix: "", color: "#f87171", spark: [] },
    { label: "Automations", value: activeAutomations, prefix: "", suffix: "", color: "#a78bfa", spark: [] },
    { label: "Messages Sent", value: outboundMessages, prefix: "", suffix: "", color: "#22d3ee", spark: [] },
    { label: "Avg Lead Score", value: avgLeadScore, prefix: "", suffix: "", color: "#34d399", spark: [] },
  ];

  // Pipeline stages
  const STAGES = ["prospecting", "qualified", "proposal", "negotiation", "closed won", "closed lost"];
  const stageData = STAGES.map(stage => ({
    stage,
    count: pipeline.filter(p => p.stage?.toLowerCase() === stage).length,
    value: pipeline.filter(p => p.stage?.toLowerCase() === stage).reduce((s, p) => s + (p.value || 0), 0),
  }));
  const maxStageCount = Math.max(...stageData.map(s => s.count), 1);

  // Lead sources
  const sourceMap: Record<string, number> = {};
  leads.forEach(l => { if (l.source) sourceMap[l.source] = (sourceMap[l.source] || 0) + 1; });
  const sources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Channel breakdown
  const channelMap: Record<string, number> = {};
  communications.forEach(c => { if (c.channel) channelMap[c.channel] = (channelMap[c.channel] || 0) + 1; });

  const TABS = ["overview", "leads", "pipeline", "messages", "automations", "ai"] as const;

  return (
    <div className="min-h-screen bg-[#060810] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap');
        .stat-card { transition: all 0.3s cubic-bezier(.4,0,.2,1); }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(34,211,238,0.3) !important; }
        .pulse-dot { animation: pulse-ring 2s infinite; }
        @keyframes pulse-ring { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .bar-fill { transition: width 1.5s cubic-bezier(.4,0,.2,1); }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 40px 40px; }
        .tab-active { border-bottom: 2px solid #22d3ee; color: #22d3ee; }
      `}</style>

      <div className="p-4 md:p-6 space-y-5">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0d18] grid-bg p-6 md:p-8">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/8 blur-[120px] pointer-events-none" />
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase">{workspace.industry} · Live</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight">
                {workspace.name}
                <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">AI Workspace</span>
              </h1>
              <p className="text-gray-500 mt-3 text-sm max-w-lg">
                <span className="text-cyan-300 font-semibold">{PERSONALITY_LABELS[aiPersonality] || aiPersonality}</span>
                {" · "}<span className="text-emerald-300 font-semibold">{responseTime}</span>
                {roiTarget !== "—" && <>{" · "}<span className="text-purple-300 font-semibold">ROI Target: {roiTarget}%</span></>}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/8 bg-black/40 p-4 text-center">
                <p className="text-gray-600 text-xs font-mono uppercase">Plan</p>
                <p className="text-xl font-black mt-1 capitalize">{od.plan || "—"}</p>
                <p className="text-cyan-400 text-xs font-mono mt-1">{od.trialChoice === "keep_trial" ? "Trial" : "Active"}</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/40 p-4 text-center">
                <p className="text-gray-600 text-xs font-mono uppercase">LTV</p>
                <p className="text-xl font-black mt-1">{customerLTV ? `$${customerLTV.toLocaleString()}` : "—"}</p>
                <p className="text-emerald-400 text-xs font-mono mt-1">Per customer</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/40 p-4 text-center">
                <p className="text-gray-600 text-xs font-mono uppercase">New Leads</p>
                <p className="text-xl font-black mt-1 text-cyan-400">{newLeads}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">Uncontacted</p>
              </div>
            </div>
          </div>
        </div>

        {/* STAT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="stat-card rounded-xl border border-white/8 bg-[#0a0d18] p-4 flex flex-col justify-between min-h-[100px]">
              <p className="text-gray-600 text-[10px] uppercase tracking-widest font-mono">{s.label}</p>
              <div className="flex items-end justify-between mt-2">
                <h2 className="text-2xl font-black">
                  {s.value > 0 ? <AnimatedNumber target={s.value} prefix={s.prefix} suffix={s.suffix} /> : <span className="text-gray-700">—</span>}
                </h2>
                {s.spark.length > 1 && <SparkLine data={s.spark} color={s.color} />}
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-1 border-b border-white/8 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-colors ${activeTab === tab ? "tab-active" : "text-gray-500 hover:text-gray-300"}`}>
              {tab}
              {tab === "leads" && leads.length > 0 && <span className="ml-2 text-xs bg-cyan-400/15 text-cyan-400 px-1.5 py-0.5 rounded-full">{leads.length}</span>}
              {tab === "messages" && communications.length > 0 && <span className="ml-2 text-xs bg-purple-400/15 text-purple-400 px-1.5 py-0.5 rounded-full">{communications.length}</span>}
              {tab === "automations" && <span className="ml-2 text-xs bg-emerald-400/15 text-emerald-400 px-1.5 py-0.5 rounded-full">{activeAutomations}</span>}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* PIPELINE SUMMARY */}
            <div className="xl:col-span-2 rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold">Pipeline Stages</h3>
                  <p className="text-gray-600 text-xs font-mono">Weighted value: ${Math.round(weightedPipeline).toLocaleString()}</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 rounded-full">${pipelineValue.toLocaleString()} total</span>
              </div>
              {pipeline.length > 0 ? (
                <div className="space-y-3">
                  {stageData.filter(s => s.count > 0).map(s => (
                    <div key={s.stage} className="flex items-center gap-3">
                      <span className="text-gray-400 text-xs font-mono capitalize w-24 shrink-0">{s.stage}</span>
                      <div className="flex-1 h-7 rounded-lg bg-white/4 overflow-hidden">
                        <div className="bar-fill h-full rounded-lg bg-gradient-to-r from-cyan-400/50 to-cyan-400/80 flex items-center px-3"
                          style={{ width: `${(s.count / maxStageCount) * 100}%` }}>
                          <span className="text-xs font-bold text-white">{s.count}</span>
                        </div>
                      </div>
                      <span className="text-gray-400 font-mono text-xs w-20 text-right">${s.value.toLocaleString()}</span>
                    </div>
                  ))}
                  {stageData.every(s => s.count === 0) && <EmptyState label="pipeline deals" />}
                </div>
              ) : <EmptyState label="pipeline data" />}
            </div>

            {/* RECENT ACTIVITY */}
            <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                  <span className="text-emerald-400 text-xs font-mono">Live</span>
                </div>
              </div>
              {communications.length > 0 ? (
                <div className="space-y-3">
                  {communications.slice(0, 8).map(c => (
                    <div key={c.id} className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: CHANNEL_COLORS[c.channel] || "#666" }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <p className="text-xs font-semibold text-white capitalize">{c.channel} {c.direction}</p>
                          <span className="text-gray-600 text-xs font-mono shrink-0">{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{c.content || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyState label="activity" />}
            </div>

            {/* LEAD SOURCES */}
            <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
              <h3 className="text-lg font-bold mb-4">Lead Sources</h3>
              {sources.length > 0 ? (
                <div className="space-y-3">
                  {sources.map(([source, count]) => (
                    <div key={source} className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm capitalize w-24 shrink-0">{source}</span>
                      <div className="flex-1 h-5 rounded-full bg-white/4 overflow-hidden">
                        <div className="bar-fill h-full rounded-full bg-gradient-to-r from-purple-400/60 to-purple-400"
                          style={{ width: `${(count / leads.length) * 100}%` }} />
                      </div>
                      <span className="text-gray-400 font-mono text-xs w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              ) : <EmptyState label="lead source data" />}
            </div>

            {/* TASKS */}
            <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Open Tasks</h3>
                <span className="text-xs font-mono text-orange-400 border border-orange-400/20 bg-orange-400/5 px-2 py-1 rounded-full">{openTasks} open</span>
              </div>
              {tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.filter(t => t.status === "open").slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-start gap-3 rounded-xl border border-white/6 bg-black/20 px-3 py-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{t.title}</p>
                        {t.due_date && <p className="text-xs text-gray-600 font-mono mt-0.5">Due {new Date(t.due_date).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  ))}
                  {tasks.filter(t => t.status === "open").length === 0 && <p className="text-emerald-400 text-sm font-mono">All tasks complete ✓</p>}
                </div>
              ) : <EmptyState label="tasks" />}
            </div>

            {/* SEASONAL + SERVICES */}
            <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold mb-3">Seasonal Intelligence</h3>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">Peak</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {peakMonths.length > 0 ? peakMonths.map(m => <span key={m} className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold">{m}</span>) : <span className="text-gray-600 text-xs font-mono">—</span>}
                </div>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">Slow</p>
                <div className="flex flex-wrap gap-1.5">
                  {slowMonths.length > 0 ? slowMonths.map(m => <span key={m} className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-400/20 text-red-300 text-xs font-bold">{m}</span>) : <span className="text-gray-600 text-xs font-mono">—</span>}
                </div>
              </div>
              <div className="border-t border-white/6 pt-4">
                <h3 className="text-base font-bold mb-3">Active Services</h3>
                {services.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {services.map(s => <span key={s} className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs">✓ {s}</span>)}
                  </div>
                ) : <EmptyState label="services" />}
              </div>
            </div>

          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">All Leads</h3>
                <p className="text-gray-600 text-xs font-mono">{leads.length} total · {newLeads} new · {convertedLeads} converted</p>
              </div>
              <div className="flex gap-2">
                {["new", "contacted", "qualified", "converted", "lost"].map(s => (
                  <span key={s} className="text-xs px-2 py-1 rounded-full font-mono capitalize"
                    style={{ color: STATUS_COLORS[s], background: `${STATUS_COLORS[s]}15`, border: `1px solid ${STATUS_COLORS[s]}30` }}>
                    {leads.filter(l => l.status === s).length} {s}
                  </span>
                ))}
              </div>
            </div>
            {leads.length > 0 ? (
              <div className="rounded-2xl border border-white/8 bg-[#0a0d18] overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/6 text-xs text-gray-600 font-mono uppercase tracking-widest">
                  <span className="col-span-3">Name</span>
                  <span className="col-span-3">Contact</span>
                  <span className="col-span-2">Source</span>
                  <span className="col-span-2">Status</span>
                  <span className="col-span-1 text-right">Score</span>
                  <span className="col-span-1 text-right">Added</span>
                </div>
                {leads.map(l => (
                  <div key={l.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/4 hover:bg-white/2 transition-colors">
                    <span className="col-span-3 text-sm font-semibold text-white truncate">{l.name || "—"}</span>
                    <div className="col-span-3 min-w-0">
                      <p className="text-xs text-gray-400 truncate">{l.email || "—"}</p>
                      <p className="text-xs text-gray-600 truncate">{l.phone || "—"}</p>
                    </div>
                    <span className="col-span-2 text-xs text-gray-400 capitalize">{l.source || "—"}</span>
                    <span className="col-span-2">
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize font-mono"
                        style={{ color: STATUS_COLORS[l.status] || "#666", background: `${STATUS_COLORS[l.status] || "#666"}15` }}>
                        {l.status}
                      </span>
                    </span>
                    <span className="col-span-1 text-right text-sm font-black" style={{ color: l.score > 70 ? "#4ade80" : l.score > 40 ? "#fb923c" : "#f87171" }}>{l.score || 0}</span>
                    <span className="col-span-1 text-right text-xs text-gray-600 font-mono">{timeAgo(l.created_at)}</span>
                  </div>
                ))}
              </div>
            ) : <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-12 text-center"><EmptyState label="leads" /></div>}
          </div>
        )}

        {/* PIPELINE TAB */}
        {activeTab === "pipeline" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Pipeline</h3>
                <p className="text-gray-600 text-xs font-mono">Total: ${pipelineValue.toLocaleString()} · Weighted: ${Math.round(weightedPipeline).toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {STAGES.map(stage => {
                const deals = pipeline.filter(p => p.stage?.toLowerCase() === stage);
                const stageValue = deals.reduce((s, p) => s + (p.value || 0), 0);
                return (
                  <div key={stage} className="rounded-2xl border border-white/8 bg-[#0a0d18] p-4">
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest capitalize mb-3">{stage}</p>
                    <p className="text-2xl font-black text-white">{deals.length}</p>
                    <p className="text-xs text-cyan-400 font-mono mt-1">${stageValue.toLocaleString()}</p>
                    <div className="mt-3 space-y-1.5">
                      {deals.slice(0, 3).map(d => (
                        <div key={d.id} className="text-xs text-gray-400 truncate rounded-lg bg-white/4 px-2 py-1">
                          ${(d.value || 0).toLocaleString()} · {Math.round(d.probability || 0)}%
                        </div>
                      ))}
                      {deals.length > 3 && <p className="text-xs text-gray-600 font-mono">+{deals.length - 3} more</p>}
                      {deals.length === 0 && <p className="text-xs text-gray-700 font-mono">Empty</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Communications</h3>
                <p className="text-gray-600 text-xs font-mono">{inboundMessages} inbound · {outboundMessages} outbound</p>
              </div>
              <div className="flex gap-2">
                {Object.entries(channelMap).map(([ch, count]) => (
                  <span key={ch} className="text-xs px-2 py-1 rounded-full font-mono capitalize"
                    style={{ color: CHANNEL_COLORS[ch] || "#888", background: `${CHANNEL_COLORS[ch] || "#888"}15` }}>
                    {ch} {count}
                  </span>
                ))}
              </div>
            </div>
            {communications.length > 0 ? (
              <div className="rounded-2xl border border-white/8 bg-[#0a0d18] overflow-hidden">
                {communications.map(c => (
                  <div key={c.id} className="flex gap-4 px-5 py-4 border-b border-white/4 hover:bg-white/2 transition-colors">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: CHANNEL_COLORS[c.channel] || "#666" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono capitalize px-2 py-0.5 rounded-full"
                          style={{ color: CHANNEL_COLORS[c.channel] || "#888", background: `${CHANNEL_COLORS[c.channel] || "#888"}15` }}>{c.channel}</span>
                        <span className={`text-xs font-mono ${c.direction === "inbound" ? "text-emerald-400" : "text-cyan-400"}`}>{c.direction}</span>
                        <span className="text-gray-600 text-xs font-mono ml-auto">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-300">{c.content || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-12 text-center"><EmptyState label="messages" /></div>}
          </div>
        )}

        {/* AUTOMATIONS TAB */}
        {activeTab === "automations" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold">Automations</h3>
              <p className="text-gray-600 text-xs font-mono">{activeAutomations} active · {automations.length - activeAutomations} paused</p>
            </div>
            {automations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {automations.map(a => (
                  <div key={a.id} className={`rounded-2xl border p-5 ${a.enabled ? "border-emerald-400/20 bg-emerald-400/3" : "border-white/6 bg-[#0a0d18]"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-sm text-white">{a.name}</h4>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${a.enabled ? "text-emerald-400 bg-emerald-400/15" : "text-gray-500 bg-white/5"}`}>
                        {a.enabled ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 capitalize">Trigger: <span className="text-gray-300">{a.trigger_event || "—"}</span></p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">Action: <span className="text-gray-300">{a.action_type || "—"}</span></p>
                    <p className="text-xs text-gray-600 font-mono mt-2">{timeAgo(a.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-12 text-center"><EmptyState label="automations" /></div>}
          </div>
        )}

        {/* AI TAB */}
        {activeTab === "ai" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* AI DECISIONS */}
            <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
              <h3 className="text-lg font-bold mb-1">AI Decision Log</h3>
              <p className="text-gray-600 text-xs font-mono mb-4">Every action your AI has taken</p>
              {aiDecisions.length > 0 ? (
                <div className="space-y-3">
                  {aiDecisions.map(d => (
                    <div key={d.id} className="rounded-xl border border-white/6 bg-black/20 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-cyan-400 capitalize">{d.decision_type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-600">{timeAgo(d.created_at)}</span>
                          {d.confidence != null && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                              style={{ color: d.confidence > 0.7 ? "#4ade80" : "#fb923c", background: d.confidence > 0.7 ? "#4ade8015" : "#fb923c15" }}>
                              {Math.round(d.confidence * 100)}% conf.
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{d.reasoning || "—"}</p>
                    </div>
                  ))}
                </div>
              ) : <EmptyState label="AI decisions" />}
            </div>

            {/* AI CEO PRIORITIES + PERFORMANCE */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
                <h3 className="text-lg font-bold mb-1">AI CEO Priorities</h3>
                <p className="text-gray-600 text-xs font-mono mb-4">Strategic objectives</p>
                {priorities.length > 0 ? (
                  <div className="space-y-2">
                    {priorities.map((p, i) => (
                      <div key={p} className="flex items-start gap-3 rounded-xl border border-white/6 bg-black/20 px-4 py-3">
                        <span className="text-cyan-400 font-black font-mono text-sm shrink-0">{i + 1}.</span>
                        <p className="text-gray-300 text-sm">{p}</p>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState label="AI priorities" />}
              </div>

              <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
                <h3 className="text-lg font-bold mb-1">AI Performance</h3>
                <p className="text-gray-600 text-xs font-mono mb-4">Populates with real interactions</p>
                <div className="space-y-3">
                  {[
                    { label: "Lead Response Speed", key: "response_speed" },
                    { label: "Follow-up Consistency", key: "followup" },
                    { label: "Conversion Optimization", key: "conversion" },
                    { label: "Client Retention", key: "retention" },
                    { label: "Message Personalization", key: "personalization" },
                  ].map(m => {
                    const score = workspace.ai_ceo_state?.[m.key] || 0;
                    return (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400">{m.label}</span>
                          <span className="font-black font-mono text-cyan-400">{score > 0 ? score : "—"}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                          <div className="bar-fill h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
