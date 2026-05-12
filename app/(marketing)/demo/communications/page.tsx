export {};
"use client";

import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  Bot,
  Sparkles,
  Users,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Activity,
  TrendingUp,
  Bell,
  Inbox,
  Reply,
  Megaphone,
  MessagesSquare,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Globe,
} from "lucide-react";

export default function CommunicationsPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6">

        <div className="flex items-center gap-5">

          <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
            <MessagesSquare className="text-cyan-400" size={34} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Communications Center
            </h1>

            <p className="text-gray-400 mt-2 max-w-3xl">
              Unified communications dashboard for email, SMS,
              client conversations, AI-generated responses,
              notifications, and live engagement tracking.
            </p>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

          {[
            ["Unread Messages", "84"],
            ["Response Rate", "94.2%"],
            ["Avg Reply Time", "3m"],
            ["Messages Today", "1,284"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-[#0b0b0b]/90 border border-white/10 rounded-3xl p-5"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">
                {label}
              </p>

              <p className="text-2xl font-bold text-white mt-3">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="2xl:col-span-2 space-y-8">

          {/* LIVE INBOX */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

              <div className="flex items-center gap-4">
                <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
                  <Inbox className="text-cyan-400" size={28} />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Unified Inbox
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Live customer conversations and support activity
                  </p>
                </div>
              </div>

              <button className="px-5 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/20 transition-all">
                Open Inbox
              </button>
            </div>

            <div className="space-y-4">

              {[
                {
                  name: "Sarah Mitchell",
                  channel: "Email",
                  msg: "Need help setting up automation workflows",
                  status: "Awaiting Reply",
                  time: "2m ago",
                  color: "cyan",
                },
                {
                  name: "Michael Torres",
                  channel: "SMS",
                  msg: "Can I upgrade my subscription plan?",
                  status: "AI Suggested Reply Ready",
                  time: "6m ago",
                  color: "emerald",
                },
                {
                  name: "Apex Roofing",
                  channel: "Facebook",
                  msg: "Interested in CRM migration support",
                  status: "Assigned to Sales",
                  time: "11m ago",
                  color: "purple",
                },
                {
                  name: "Taylor Agency",
                  channel: "Instagram",
                  msg: "Need onboarding assistance for new staff",
                  status: "Resolved",
                  time: "18m ago",
                  color: "orange",
                },
              ].map((conversation) => (
                <div
                  key={conversation.name}
                  className="bg-black/30 border border-white/5 rounded-3xl p-5 hover:border-cyan-500/20 transition-all"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                    <div className="flex items-start gap-4">

                      <div
                        className={`
                          mt-1 w-3 h-3 rounded-full
                          ${conversation.color === "cyan" && "bg-cyan-400"}
                          ${conversation.color === "emerald" && "bg-emerald-400"}
                          ${conversation.color === "purple" && "bg-purple-400"}
                          ${conversation.color === "orange" && "bg-orange-400"}
                        `}
                      />

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-white font-semibold">
                            {conversation.name}
                          </h3>

                          <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400">
                            {conversation.channel}
                          </span>
                        </div>

                        <p className="text-gray-300 mt-3 leading-relaxed">
                          {conversation.msg}
                        </p>

                        <p className="text-xs text-gray-500 mt-3">
                          {conversation.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">

                      <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
                        {conversation.status}
                      </div>

                      <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                        <Reply size={16} className="text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHANNELS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* EMAIL */}
            <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-7">

              <div className="flex items-center gap-4 mb-7">

                <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
                  <Mail className="text-cyan-400" size={24} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Email Center
                  </h3>

                  <p className="text-gray-400 mt-1 text-sm">
                    Campaign and support communication management
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {[
                  ["Sent Today", "842"],
                  ["Open Rate", "42.8%"],
                  ["Pending Replies", "28"],
                  ["AI Drafts Ready", "16"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-white/5 pb-4"
                  >
                    <span className="text-gray-400 text-sm">
                      {label}
                    </span>

                    <span className="text-white font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-1 gap-3">

                {[
                  "Generate AI Email Reply",
                  "Create Follow-Up Sequence",
                  "Optimize Subject Line",
                ].map((tool) => (
                  <button
                    key={tool}
                    className="text-left p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles size={16} className="text-cyan-400" />

                      <span className="text-white text-sm">
                        {tool}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SMS */}
            <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-7">

              <div className="flex items-center gap-4 mb-7">

                <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                  <MessageSquare className="text-emerald-400" size={24} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    SMS Center
                  </h3>

                  <p className="text-gray-400 mt-1 text-sm">
                    Text communication and automated outreach
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {[
                  ["Messages Sent", "1,482"],
                  ["Reply Rate", "61%"],
                  ["Pending Responses", "14"],
                  ["Automation Triggers", "93"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-white/5 pb-4"
                  >
                    <span className="text-gray-400 text-sm">
                      {label}
                    </span>

                    <span className="text-white font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-1 gap-3">

                {[
                  "Generate AI SMS Reply",
                  "Create Reminder Sequence",
                  "Optimize Engagement",
                ].map((tool) => (
                  <button
                    key={tool}
                    className="text-left p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Bot size={16} className="text-emerald-400" />

                      <span className="text-white text-sm">
                        {tool}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI RESPONSE ASSISTANT */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8 overflow-hidden relative">

            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="flex items-center gap-4 mb-8">

                <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
                  <Bot className="text-cyan-400" size={28} />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white">
                    AI Communications Assistant
                  </h2>

                  <p className="text-gray-400 mt-2">
                    AI-powered response generation and engagement assistance
                  </p>
                </div>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-3xl p-6">

                <div className="flex items-start gap-4 mb-6">

                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Bot className="text-cyan-400" size={18} />
                  </div>

                  <div>
                    <p className="text-white font-medium">
                      Suggested AI Reply
                    </p>

                    <p className="text-gray-300 mt-4 leading-relaxed">
                      “Absolutely — I can help you configure your
                      automation workflows. Based on your current setup,
                      I recommend enabling lead routing and onboarding
                      sequences first. Would you like me to walk you
                      through setup step-by-step?”
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">

                  {[
                    "Send Reply",
                    "Regenerate",
                    "Shorten Response",
                    "Professional Tone",
                  ].map((action) => (
                    <button
                      key={action}
                      className="px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/20 transition-all"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">

          {/* LIVE ACTIVITY */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-cyan-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                Live Activity
              </h3>
            </div>

            <div className="space-y-5">

              {[
                "AI replied to support request",
                "Sales follow-up message sent",
                "Client onboarding email triggered",
                "SMS reminder automation executed",
                "Instagram inquiry assigned to support",
                "AI generated new email response",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 pb-5 border-b border-white/5 last:border-0"
                >
                  <div className="mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      {i + 1}m ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ALERTS */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-orange-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                Priority Alerts
              </h3>
            </div>

            <div className="space-y-4">

              {[
                {
                  title: "Hot lead awaiting response",
                  desc: "Potential high-value client inactive for 12 minutes.",
                },
                {
                  title: "Support queue increasing",
                  desc: "Response volume up 18% in last hour.",
                },
                {
                  title: "Client escalation detected",
                  desc: "AI flagged conversation for manual review.",
                },
              ].map((alert) => (
                <div
                  key={alert.title}
                  className="p-5 rounded-3xl bg-black/30 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="text-orange-400" size={16} />

                    <p className="text-white font-medium">
                      {alert.title}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {alert.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-emerald-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                Communication Performance
              </h3>
            </div>

            <div className="space-y-5">

              {[
                ["Customer Satisfaction", "96%"],
                ["AI Accuracy", "94.4%"],
                ["Avg Resolution Time", "8m"],
                ["Escalation Rate", "2.1%"],
                ["Automation Success", "98.2%"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/5 pb-4"
                >
                  <span className="text-gray-400 text-sm">
                    {label}
                  </span>

                  <span className="text-white font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
