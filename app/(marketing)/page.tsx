export {};
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeDashTab, setActiveDashTab] = useState("overview");
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 8);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const faqs = [
    {
      q: "What does SynaptiReach actually do?",
      a: "SynaptiReach combines CRM, AI agents, marketing automation, analytics, and customer communication into one intelligent operating system for service businesses."
    },
    {
      q: "Do I need technical experience?",
      a: "No. Everything is designed to be intuitive and easy to launch without technical setup."
    },
    {
      q: "Can this replace multiple tools?",
      a: "Yes. Most businesses replace separate CRM, email, SMS, automation, and pipeline tools with SynaptiReach."
    },
    {
      q: "How does the AI help?",
      a: "AI agents handle follow-ups, conversations, appointment booking, and lead qualification automatically."
    },
    {
      q: "Is this only for large businesses?",
      a: "No. SynaptiReach is built specifically for small and growing service businesses."
    },
    {
      q: "How quickly can I get started?",
      a: "Most users can get started the same day and begin automating workflows immediately."
    },
    {
      q: "Will this save me time?",
      a: "Yes. Businesses save hours every week by automating repetitive communication and operational tasks."
    },
    {
      q: "Can I try it before committing?",
      a: "Yes. You can explore the live demo or start a free trial before making a commitment."
    }
  ];

  const activities = [
    { icon: "🤖", text: "AI agent booked appointment with Marcus T.", time: "2s ago" },
    { icon: "📧", text: "Email campaign sent to 847 contacts", time: "1m ago" },
    { icon: "💬", text: "New inbound message from Sarah K.", time: "3m ago" },
    { icon: "✅", text: "Lead qualified: Riverside HVAC Co.", time: "5m ago" },
    { icon: "📱", text: "SMS follow-up sequence triggered", time: "8m ago" },
    { icon: "🎯", text: "Deal closed: $4,200 — Elite Roofing", time: "12m ago" },
    { icon: "🔔", text: "Overdue follow-up auto-reassigned", time: "15m ago" },
    { icon: "📊", text: "Weekly revenue report generated", time: "18m ago" },
  ];

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 px-4 py-12 max-w-7xl mx-auto space-y-24">

        {/* HERO */}
        <section className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
            AI-powered automation platform for service businesses
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Manage Leads, Marketing,
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Sales, and AI — In One System
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            SynaptiReach unifies CRM, automation, AI agents, messaging, campaigns,
            and analytics into one intelligent operating system built for growth.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              href="/trial"
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            >
              Start 14-Day Trial
            </Link>

            <Link
              href="/demo"
              className="px-7 py-3 rounded-xl bg-white/10 border border-white/10 text-sm hover:bg-white/15 transition backdrop-blur"
            >
              View Interactive Demo
            </Link>
          </div>

          <p className="text-gray-500 text-xs">
            Trusted by growing service businesses using AI to scale operations
          </p>
        </section>

        {/* DASHBOARD PREVIEW */}
        <section className="space-y-5">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Your Entire Business. One Dashboard.
            </h2>

            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Real-time conversations, AI agents, campaigns, revenue,
              pipeline activity, and automation performance — all unified.
            </p>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-500/10">

            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>

                <span className="text-xs text-gray-500">
                  app.synaptireach.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Live
                </span>

                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 flex items-center justify-center text-black text-xs font-bold">
                  A
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-3 border-b border-white/5 bg-black/20">
              {["overview", "pipeline", "conversations", "campaigns"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDashTab(tab)}
                  className={`px-3 py-1.5 text-xs rounded-t capitalize transition-all ${
                    activeDashTab === tab
                      ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5"
                      : "text-gray-600 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dashboard Body */}
            <div className="p-4">

              {/* KPI CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  {
                    label: "Monthly Revenue",
                    value: "$48,290",
                    delta: "↑ 18.4% vs last mo",
                    c: "cyan"
                  },
                  {
                    label: "Active Leads",
                    value: "1,847",
                    delta: "+94 captured today",
                    c: "green"
                  },
                  {
                    label: "Conversion Rate",
                    value: "34.2%",
                    delta: "↑ 2.1% this week",
                    c: "cyan"
                  },
                  {
                    label: "Booked Appointments",
                    value: "127",
                    delta: "+23 this week",
                    c: "green"
                  },
                ].map((k, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 transition"
                  >
                    <div className="text-gray-500 text-xs mb-1">
                      {k.label}
                    </div>

                    <div className="text-white font-bold text-xl leading-none">
                      {k.value}
                    </div>

                    <div
                      className={`text-xs mt-1.5 ${
                        k.c === "cyan"
                          ? "text-cyan-400"
                          : "text-green-400"
                      }`}
                    >
                      {k.delta}
                    </div>
                  </div>
                ))}
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* LEFT SIDE */}
                <div className="space-y-3 sm:col-span-2">

                  {/* REVENUE */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-white">
                        Revenue — May 2025
                      </span>

                      <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                        ↑ 18.4%
                      </span>
                    </div>

                    <div className="flex items-end gap-1 h-14">
                      {[28,40,35,55,48,66,60,75,70,84,79,95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div
                            className={`rounded-sm ${
                              i === 11
                                ? "bg-gradient-to-t from-cyan-400 to-green-400"
                                : "bg-white/15"
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-gray-600 text-xs mt-1.5">
                      <span>May 1</span>
                      <span>May 15</span>
                      <span>May 30</span>
                    </div>
                  </div>

                  {/* PIPELINE */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-white">
                        Sales Pipeline
                      </span>

                      <span className="text-xs text-gray-500">
                        $127,400 total value
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        {
                          stage: "New Leads",
                          count: 284,
                          value: "$18k",
                          pct: 90,
                          grad: "from-cyan-400/70 to-cyan-400/40"
                        },
                        {
                          stage: "Qualified",
                          count: 147,
                          value: "$42k",
                          pct: 68,
                          grad: "from-teal-400/70 to-teal-400/40"
                        },
                        {
                          stage: "Proposal",
                          count: 63,
                          value: "$38k",
                          pct: 46,
                          grad: "from-green-400/70 to-green-400/40"
                        },
                        {
                          stage: "Closing",
                          count: 29,
                          value: "$29k",
                          pct: 26,
                          grad: "from-emerald-500/70 to-emerald-500/40"
                        },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="text-xs text-gray-400 w-20 shrink-0">
                            {s.stage}
                          </div>

                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${s.grad}`}
                              style={{ width: `${s.pct}%` }}
                            />
                          </div>

                          <div className="text-xs text-gray-500 w-8 text-right">
                            {s.count}
                          </div>

                          <div className="text-xs text-green-400 w-10 text-right font-medium">
                            {s.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AUTOMATION + EMAIL */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-xs font-semibold text-white mb-2.5">
                        Active Automations
                      </div>

                      <div className="space-y-2">
                        {[
                          { name: "Lead Nurture", status: "running", runs: "2.4k" },
                          { name: "Appointment Reminder", status: "running", runs: "841" },
                          { name: "Re-engage Campaign", status: "paused", runs: "312" },
                          { name: "Review Request", status: "running", runs: "1.1k" },
                        ].map((a, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full inline-block ${
                                  a.status === "running"
                                    ? "bg-green-400 animate-pulse"
                                    : "bg-yellow-400"
                                }`}
                              />

                              <span className="text-xs text-gray-300">
                                {a.name}
                              </span>
                            </div>

                            <span className="text-xs text-gray-500">
                              {a.runs}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-xs font-semibold text-white mb-2.5">
                        Email Analytics
                      </div>

                      <div className="space-y-2">
                        {[
                          { label: "Open Rate", value: "47.3%", pct: 47 },
                          { label: "Click Rate", value: "18.9%", pct: 19 },
                          { label: "Replied", value: "6.2%", pct: 12 },
                          { label: "Converted", value: "3.8%", pct: 8 },
                        ].map((e, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-0.5">
                              <span className="text-gray-400">
                                {e.label}
                              </span>

                              <span className="text-cyan-400">
                                {e.value}
                              </span>
                            </div>

                            <div className="bg-white/10 rounded-full h-1 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-400 to-green-400 h-full rounded-full"
                                style={{ width: `${e.pct * 2}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-3">

                  {/* AI PANEL */}
                  <div className="bg-gradient-to-b from-cyan-500/10 to-black/10 border border-cyan-400/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 flex items-center justify-center text-black text-xs">
                        ⚡
                      </div>

                      <span className="text-xs font-semibold text-cyan-400">
                        AI Agent — Synapse
                      </span>

                      <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                        Active
                      </span>
                    </div>

                    <div className="bg-white/5 rounded-lg p-2 text-xs text-gray-300 leading-relaxed mb-2">
                      Today Synapse handled{" "}
                      <span className="text-cyan-400 font-medium">
                        47 conversations
                      </span>
                      , booked{" "}
                      <span className="text-green-400 font-medium">
                        12 appointments
                      </span>
                      , and recovered{" "}
                      <span className="text-cyan-400 font-medium">
                        $3,800
                      </span>{" "}
                      in stalled deals.
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: "Handled", value: "47" },
                        { label: "Booked", value: "12" },
                        { label: "Recovered", value: "$3.8k" },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className="bg-white/5 rounded-lg p-1.5 text-center"
                        >
                          <div className="text-white font-bold text-sm">
                            {s.value}
                          </div>

                          <div className="text-gray-500 text-xs">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NOTIFICATIONS */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">
                        Notifications
                      </span>

                      <span className="text-xs bg-cyan-400/20 text-cyan-400 px-1.5 py-0.5 rounded-full">
                        8 new
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activities.slice(0, 4).map((a, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 py-1 border-b border-white/5 last:border-0 transition-all duration-500 ${
                            i === pulseIndex % 4
                              ? "opacity-100"
                              : "opacity-60"
                          }`}
                        >
                          <span className="text-sm">{a.icon}</span>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-300 leading-tight">
                              {a.text}
                            </p>

                            <p className="text-xs text-gray-600">
                              {a.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HOT LEADS */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-xs font-semibold text-white mb-2">
                      Hot Leads
                    </div>

                    <div className="space-y-2">
                      {[
                        {
                          name: "Marcus T.",
                          co: "Riverside HVAC",
                          score: 94,
                          stage: "Closing"
                        },
                        {
                          name: "Sarah K.",
                          co: "Elite Roofing",
                          score: 87,
                          stage: "Proposal"
                        },
                        {
                          name: "Dan W.",
                          co: "ProPlumb LLC",
                          score: 78,
                          stage: "Qualified"
                        },
                      ].map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 py-1 border-b border-white/5 last:border-0"
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-xs font-bold text-black shrink-0">
                            {c.name[0]}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white font-medium">
                              {c.name}
                            </p>

                            <p className="text-xs text-gray-500 truncate">
                              {c.co}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs text-cyan-400 font-bold">
                              {c.score}
                            </div>

                            <div className="text-xs text-gray-600">
                              {c.stage}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/demo"
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-semibold text-sm inline-block hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            >
              Explore Interactive Demo →
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Built for Growth. Designed for Simplicity.
            </h2>

            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Replace disconnected tools with one intelligent operating system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: "🎯",
                title: "Smart CRM",
                desc: "Track leads, deals, conversations, and customer activity in real time."
              },
              {
                icon: "📣",
                title: "Marketing Automation",
                desc: "Launch email and SMS campaigns with automated workflows."
              },
              {
                icon: "🤖",
                title: "AI Agents",
                desc: "AI handles follow-ups, lead qualification, and appointment booking."
              },
              {
                icon: "⚡",
                title: "Workflow Automation",
                desc: "Automate repetitive tasks and streamline your operations."
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-cyan-400/20 transition-all group"
              >
                <div className="text-2xl mb-3">{f.icon}</div>

                <div className="font-semibold text-sm mb-2 group-hover:text-cyan-400 transition-colors">
                  {f.title}
                </div>

                <div className="text-gray-400 text-xs leading-relaxed">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="text-center space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Go Live in 4 Steps
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Connect leads",
              "Configure AI agents",
              "Launch automations",
              "Scale revenue"
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl py-6 px-4 text-sm"
              >
                {step}
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Simple Pricing
            </h2>

            <p className="text-gray-400 text-sm">
              No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              ["Basic Managed", "$49/mo"],
              ["Growth Managed", "$99/mo"],
              ["Premium Managed", "$199/mo"]
            ].map(([name, price], i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
              >
                <div className="font-semibold text-lg">{name}</div>

                <div className="text-3xl font-black my-4">
                  {price}
                </div>

                <button className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm">
                  Start 14-Day Trial
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-cyan-200/80">
            BYOK self-service starts at $29/mo when you connect your own provider keys.
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-xl px-4 py-3 bg-white/5 backdrop-blur transition-all duration-300 hover:bg-white/8"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full text-left text-sm font-medium flex items-center justify-between gap-2"
                >
                  <span>{faq.q}</span>

                  <span
                    className={`text-cyan-400 text-lg leading-none transition-transform duration-300 ${
                      openFAQ === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === i
                      ? "max-h-40 opacity-100 mt-3"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative text-center space-y-5 py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-green-500/5 rounded-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
              Ready to Scale with AI-Powered
              <br />

              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Automation?
              </span>
            </h2>

            <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
              Start your 14-day free trial and see how SynaptiReach can automate your growth.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/trial"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-bold text-sm hover:opacity-90 transition shadow-xl shadow-cyan-500/20"
              >
                Start 14-Day Trial
              </Link>

              <Link
                href="/demo"
                className="px-8 py-3.5 rounded-xl bg-white/10 border border-white/10 text-sm hover:bg-white/15 transition"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 pt-12 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-10">

            <div className="col-span-2 sm:col-span-1 space-y-3">
              <div className="font-extrabold text-base bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent tracking-tight">
                SynaptiReach
              </div>

              <p className="text-gray-500 text-xs leading-relaxed">
                AI-powered CRM, marketing automation, analytics,
                and growth platform for service businesses.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-white mb-3 uppercase tracking-wide">
                Product
              </div>

              <div className="space-y-2">
                {[
                  "CRM",
                  "AI Agents",
                  "Automation",
                  "Analytics",
                  "Pricing"
                ].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-xs text-gray-500 hover:text-cyan-400 transition"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-white mb-3 uppercase tracking-wide">
                Solutions
              </div>

              <div className="space-y-2">
                {[
                  "Agencies",
                  "HVAC",
                  "Roofing",
                  "Healthcare",
                  "Legal"
                ].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-xs text-gray-500 hover:text-cyan-400 transition"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-white mb-3 uppercase tracking-wide">
                Company
              </div>

              <div className="space-y-2">
                {[
                  "About",
                  "Blog",
                  "Careers",
                  "Contact"
                ].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-xs text-gray-500 hover:text-cyan-400 transition"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-white mb-3 uppercase tracking-wide">
                Legal
              </div>

              <div className="space-y-2">
                {[
                  "Privacy",
                  "Terms",
                  "Security",
                  "Support"
                ].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-xs text-gray-500 hover:text-cyan-400 transition"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              © 2025 SynaptiReach. All rights reserved.
            </p>

            <div className="flex gap-4">
              {["Privacy", "Terms", "Cookies", "Contact"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-400 transition"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
