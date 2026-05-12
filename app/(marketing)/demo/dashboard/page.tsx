"use client";

import { useEffect, useState, useRef } from "react";
import PipelineFunnel from "../components/PipelineFunnel";
import TeamPerformance from "../components/TeamPerformance";
import LiveActivityStream from "../components/LiveActivityStream";
import RevenueForecast from "../components/RevenueForecast";
import CustomerHealth from "../components/CustomerHealth";
import AutomationQueue from "../components/AutomationQueue";

function AnimatedNumber({ target, prefix = "", suffix = "", duration = 2000 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const steps = 60;
    const increment = target / steps;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setCurrent(Math.min(Math.round(increment * count), target));
      if (count >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{prefix}{current.toLocaleString()}{suffix}</>;
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = 40;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2} r="3" fill={color} />
    </svg>
  );
}

const STATS = [
  { label: "Monthly Revenue", value: 142500, prefix: "$", suffix: "", change: "+12.4%", up: true, spark: [98000, 105000, 112000, 108000, 119000, 128000, 142500] },
  { label: "Active Leads", value: 842, prefix: "", suffix: "", change: "+18%", up: true, spark: [520, 610, 580, 670, 720, 790, 842] },
  { label: "Conversion Rate", value: 34, prefix: "", suffix: "%", change: "+6.2%", up: true, spark: [22, 25, 28, 27, 30, 32, 34] },
  { label: "Avg Deal Size", value: 4800, prefix: "$", suffix: "", change: "+9.1%", up: true, spark: [3200, 3600, 3900, 4100, 4400, 4600, 4800] },
  { label: "Response Rate", value: 94, prefix: "", suffix: "%", change: "+6%", up: true, spark: [78, 81, 84, 86, 89, 92, 94] },
  { label: "Open Tasks", value: 37, prefix: "", suffix: "", change: "-4%", up: false, spark: [52, 49, 45, 48, 42, 39, 37] },
  { label: "Automations Live", value: 128, prefix: "", suffix: "", change: "+14%", up: true, spark: [80, 88, 95, 102, 110, 119, 128] },
  { label: "Customer Health", value: 91, prefix: "", suffix: "%", change: "+3%", up: true, spark: [82, 84, 86, 87, 89, 90, 91] },
];

const FUNNEL = [
  { stage: "Awareness", count: 4820, pct: 100, color: "#22d3ee" },
  { stage: "Interest", count: 2940, pct: 61, color: "#34d399" },
  { stage: "Consideration", count: 1580, pct: 33, color: "#a78bfa" },
  { stage: "Intent", count: 842, pct: 17, color: "#fb923c" },
  { stage: "Closed Won", count: 287, pct: 6, color: "#4ade80" },
];

const CHANNELS = [
  { name: "SMS Campaigns", revenue: 48200, leads: 312, rate: 38, color: "#22d3ee" },
  { name: "Email Sequences", revenue: 35100, leads: 248, rate: 29, color: "#34d399" },
  { name: "Google Ads", revenue: 28600, leads: 187, rate: 24, color: "#a78bfa" },
  { name: "Organic / SEO", revenue: 18400, leads: 95, rate: 19, color: "#fb923c" },
];

const ACTIVITIES = [
  { time: "2m ago", event: "New lead captured", detail: "Marcus Johnson — HVAC quote request", type: "lead" },
  { time: "5m ago", event: "Deal closed", detail: "$6,200 — Apex Roofing contract signed", type: "win" },
  { time: "11m ago", event: "SMS campaign sent", detail: "847 contacts — Spring promo blast", type: "campaign" },
  { time: "18m ago", event: "Follow-up triggered", detail: "AI sent re-engagement to 24 cold leads", type: "auto" },
  { time: "31m ago", event: "Appointment booked", detail: "Sarah Chen — consultation at 3pm", type: "book" },
  { time: "44m ago", event: "Review request sent", detail: "Post-service sequence — 12 clients", type: "auto" },
];

const TYPE_COLORS: Record<string, string> = {
  lead: "#22d3ee", win: "#4ade80", campaign: "#a78bfa", auto: "#fb923c", book: "#34d399"
};

export default function DashboardPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#060810] text-white p-4 md:p-6 space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap');
        .stat-card { transition: all 0.3s cubic-bezier(.4,0,.2,1); }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(34,211,238,0.3) !important; }
        .pulse-dot { animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite; }
        @keyframes pulse-ring { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .bar-fill { transition: width 1.5s cubic-bezier(.4,0,.2,1); }
        .glow-cyan { box-shadow: 0 0 40px rgba(34,211,238,0.12); }
        .glow-green { box-shadow: 0 0 40px rgba(52,211,153,0.10); }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 40px 40px; }
      `}</style>

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0d18] glow-cyan grid-bg p-6 md:p-8">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/8 blur-[120px] pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase">Live Operations</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight">
              SynaptiReach
              <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Executive Command
              </span>
            </h1>
            <p className="text-gray-500 mt-3 text-sm max-w-lg leading-relaxed">
              Unified AI operations center — pipeline, revenue, automation, and client intelligence in real time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <div className="rounded-xl border border-white/8 bg-black/40 p-4">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-mono">Active Automations</p>
              <h2 className="text-3xl font-black text-white mt-2"><AnimatedNumber target={128} /></h2>
              <p className="text-emerald-400 text-xs mt-1 font-mono">+14% this week</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-black/40 p-4">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-mono">Team Utilization</p>
              <h2 className="text-3xl font-black text-white mt-2"><AnimatedNumber target={87} suffix="%" /></h2>
              <p className="text-cyan-400 text-xs mt-1 font-mono">Peak efficiency</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-black/40 p-4">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-mono">AI Messages Sent</p>
              <h2 className="text-3xl font-black text-white mt-2"><AnimatedNumber target={4821} /></h2>
              <p className="text-purple-400 text-xs mt-1 font-mono">Today</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-black/40 p-4">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-mono">Revenue / Lead</p>
              <h2 className="text-3xl font-black text-white mt-2"><AnimatedNumber target={169} prefix="$" /></h2>
              <p className="text-orange-400 text-xs mt-1 font-mono">+8.3% vs last mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* STAT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card rounded-xl border border-white/8 bg-[#0a0d18] p-4 flex flex-col justify-between min-h-[110px]">
            <p className="text-gray-600 text-[10px] uppercase tracking-widest font-mono leading-tight">{s.label}</p>
            <div>
              <div className="flex items-end justify-between mt-2">
                <h2 className="text-2xl font-black text-white">
                  <AnimatedNumber target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </h2>
                <SparkLine data={s.spark} color={s.up ? "#34d399" : "#f87171"} />
              </div>
              <span className={`text-xs font-mono mt-1 inline-block ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-5">

        {/* LEFT COL */}
        <div className="2xl:col-span-8 space-y-5">

          {/* PIPELINE FUNNEL */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold">Conversion Funnel</h3>
                <p className="text-gray-600 text-xs mt-0.5 font-mono">Real-time pipeline stages</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 rounded-full">4,820 total entries</span>
            </div>
            <div className="space-y-3">
              {FUNNEL.map((f, i) => (
                <div key={f.stage} className="flex items-center gap-4">
                  <span className="text-gray-500 text-xs font-mono w-4">{i + 1}</span>
                  <div className="w-28 text-sm font-medium text-gray-300 shrink-0">{f.stage}</div>
                  <div className="flex-1 h-8 rounded-lg bg-white/4 overflow-hidden relative">
                    <div className="bar-fill h-full rounded-lg opacity-80" style={{ width: `${f.pct}%`, background: `linear-gradient(90deg, ${f.color}40, ${f.color}90)`, borderRight: `2px solid ${f.color}` }} />
                  </div>
                  <span className="text-white font-black font-mono text-sm w-16 text-right">{f.count.toLocaleString()}</span>
                  <span className="font-mono text-xs w-10 text-right" style={{ color: f.color }}>{f.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHANNEL PERFORMANCE */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold">Channel Performance</h3>
                <p className="text-gray-600 text-xs mt-0.5 font-mono">Revenue attribution by source</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHANNELS.map((c) => (
                <div key={c.name} className="rounded-xl border border-white/6 bg-black/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm">{c.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: c.color, background: `${c.color}15`, border: `1px solid ${c.color}30` }}>{c.rate}% conv.</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-black text-white">${c.revenue.toLocaleString()}</p>
                      <p className="text-gray-600 text-xs font-mono mt-1">{c.leads} leads generated</p>
                    </div>
                    <div className="w-16 h-8 relative">
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 rounded-full bg-white/8">
                        <div className="h-full rounded-full bar-fill" style={{ width: `${c.rate * 2.5}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REVENUE FORECAST */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-2">
            <RevenueForecast />
          </div>

          {/* PIPELINE */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-2">
            <PipelineFunnel />
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="2xl:col-span-4 space-y-5">

          {/* LIVE ACTIVITY */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Live Activity</h3>
                <p className="text-gray-600 text-xs mt-0.5 font-mono">Last 60 minutes</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-400 text-xs font-mono">Live</span>
              </div>
            </div>
            <div className="space-y-3">
              {ACTIVITIES.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: TYPE_COLORS[a.type] }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white truncate">{a.event}</p>
                      <span className="text-gray-600 text-xs font-mono shrink-0">{a.time}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{a.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI PERFORMANCE SCORE */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-5">
            <h3 className="text-lg font-bold mb-4">AI Performance Score</h3>
            <div className="space-y-3">
              {[
                { label: "Lead Response Speed", score: 96, color: "#22d3ee" },
                { label: "Message Personalization", score: 88, color: "#34d399" },
                { label: "Follow-up Consistency", score: 94, color: "#a78bfa" },
                { label: "Conversion Optimization", score: 79, color: "#fb923c" },
                { label: "Client Retention", score: 91, color: "#4ade80" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-400 font-medium">{m.label}</span>
                    <span className="font-black font-mono" style={{ color: m.color }}>{m.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                    <div className="bar-fill h-full rounded-full" style={{ width: `${m.score}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TEAM */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-2">
            <TeamPerformance />
          </div>

          {/* CUSTOMER HEALTH */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-2">
            <CustomerHealth />
          </div>

          {/* NOTIFICATIONS */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-5">
            <h3 className="text-lg font-bold mb-4">Alerts & Notifications</h3>
            <div className="space-y-3">
              {[
                { title: "3 enterprise demos confirmed", detail: "High-value prospects booked today", urgent: true },
                { title: "Campaign exceeded targets", detail: "CTR +18.2% in healthcare vertical", urgent: false },
                { title: "Nova Medical workspace live", detail: "Client onboarding completed", urgent: false },
                { title: "Pipeline conversion +12%", detail: "Sales conversions rising this week", urgent: false },
              ].map((n, i) => (
                <div key={i} className={`rounded-xl border p-3.5 ${n.urgent ? "border-cyan-400/25 bg-cyan-400/5" : "border-white/6 bg-black/20"}`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.urgent ? "bg-cyan-400 pulse-dot" : "bg-gray-600"}`} />
                    <div>
                      <p className="text-sm font-semibold text-white">{n.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{n.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AUTOMATION QUEUE */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-2">
            <AutomationQueue />
          </div>

          {/* LIVE ACTIVITY STREAM */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18] p-2">
            <LiveActivityStream />
          </div>

        </div>
      </div>
    </div>
  );
}
