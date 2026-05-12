export {};
"use client";

import {
  Megaphone,
  Mail,
  MessageSquare,
  Bot,
  Sparkles,
  TrendingUp,
  Calendar,
  BarChart3,
  CheckCircle2,
  Clock3,
  Activity,
  Wand2,
  Zap,
  Globe,
  Send,
  Target,
  Users,
} from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6">

        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_40px_rgba(0,255,255,0.08)]">
              <Megaphone className="text-cyan-400" size={30} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Marketing Engine
              </h1>

              <p className="text-gray-400 mt-2">
                AI-powered multi-channel campaign management and automation
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            ["Campaigns", "18"],
            ["Reach", "142K"],
            ["CTR", "8.4%"],
            ["Conversions", "1,284"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">
                {label}
              </p>

              <p className="text-3xl font-bold text-white mt-2">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="2xl:col-span-2 space-y-8">

          {/* EMAIL */}
          <div className="bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <Mail className="text-cyan-400" size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Email Campaigns
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Automated outreach sequences and conversion funnels
                  </p>
                </div>
              </div>

              <button className="px-5 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all">
                New Campaign
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                ["Open Rate", "42.8%"],
                ["Click Rate", "11.2%"],
                ["Conversions", "248"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-black/30 border border-white/5 rounded-2xl p-5"
                >
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    {label}
                  </p>

                  <p className="text-3xl font-bold text-white mt-3">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-cyan-500/[0.03] border border-cyan-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <Bot className="text-cyan-400" size={20} />

                <h3 className="text-lg font-semibold text-white">
                  AI Email Assistant
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  "Generate Welcome Sequence",
                  "Write Promotional Blast",
                  "Optimize Subject Lines",
                ].map((tool) => (
                  <button
                    key={tool}
                    className="text-left p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={15} className="text-cyan-400" />
                      <span className="text-sm text-white">{tool}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      AI-assisted content generation
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SMS */}
          <div className="bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <MessageSquare className="text-emerald-400" size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    SMS Campaigns
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Automated messaging and follow-up systems
                  </p>
                </div>
              </div>

              <button className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-all">
                Launch SMS
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                ["Delivered", "96%"],
                ["Replies", "684"],
                ["Opt-ins", "2.1K"],
                ["Conversions", "194"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-black/30 border border-white/5 rounded-2xl p-5"
                >
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    {label}
                  </p>

                  <p className="text-3xl font-bold text-white mt-3">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <Bot className="text-emerald-400" size={20} />

                <h3 className="text-lg font-semibold text-white">
                  AI SMS Assistant
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  "Generate SMS Sequence",
                  "Write Follow-Ups",
                  "Optimize Reply Rates",
                ].map((tool) => (
                  <button
                    key={tool}
                    className="text-left p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Wand2 size={15} className="text-emerald-400" />
                      <span className="text-sm text-white">{tool}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      AI messaging optimization
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                  <Globe className="text-pink-400" size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Social Campaigns
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Facebook & Instagram ad automation and audience targeting
                  </p>
                </div>
              </div>

              <button className="px-5 py-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-300 hover:bg-pink-500/20 transition-all">
                Create Ad
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-6">

              <div className="bg-black/30 border border-white/5 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-white mb-5">
                  Facebook Campaigns
                </h3>

                <div className="space-y-4">
                  {[
                    ["Reach", "82K"],
                    ["Engagement", "6.2%"],
                    ["Conversions", "318"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between border-b border-white/5 pb-3"
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

              <div className="bg-black/30 border border-white/5 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-white mb-5">
                  Instagram Campaigns
                </h3>

                <div className="space-y-4">
                  {[
                    ["Reach", "61K"],
                    ["Engagement", "8.8%"],
                    ["Conversions", "244"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between border-b border-white/5 pb-3"
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

            <div className="bg-pink-500/[0.03] border border-pink-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <Bot className="text-pink-400" size={20} />

                <h3 className="text-lg font-semibold text-white">
                  AI Social Assistant
                </h3>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  "Generate Ad Copy",
                  "Create Captions",
                  "Suggest Hashtags",
                  "Optimize Targeting",
                ].map((tool) => (
                  <button
                    key={tool}
                    className="text-left p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-pink-500/40 hover:bg-pink-500/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={15} className="text-pink-400" />
                      <span className="text-sm text-white">{tool}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      AI creative generation
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">

          {/* RECENT ACTIVITY */}
          <div className="bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-cyan-400" size={20} />

              <h3 className="text-xl font-bold text-white">
                Campaign Activity
              </h3>
            </div>

            <div className="space-y-4">
              {[
                "Email campaign increased CTR by 14%",
                "Instagram campaign reached 12K users",
                "SMS reminders converted 42 leads",
                "AI generated new ad sequence",
                "Facebook spend optimized automatically",
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex gap-3 pb-4 border-b border-white/5 last:border-0"
                >
                  <CheckCircle2
                    className="text-cyan-400 mt-1"
                    size={15}
                  />

                  <div>
                    <p className="text-sm text-gray-300">
                      {activity}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {i + 1}h ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI RECOMMENDATIONS */}
          <div className="bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-emerald-400" size={20} />

              <h3 className="text-xl font-bold text-white">
                AI Recommendations
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Increase Email Send Time",
                  desc: "AI predicts 18% higher open rate at 8AM",
                },
                {
                  title: "Boost Instagram Spend",
                  desc: "Current ROAS outperforming Facebook by 2.3x",
                },
                {
                  title: "Retarget Abandoned Leads",
                  desc: "132 leads eligible for automated follow-up",
                },
              ].map((rec) => (
                <div
                  key={rec.title}
                  className="bg-black/30 border border-white/5 rounded-2xl p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {rec.title}
                  </p>

                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {rec.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING */}
          <div className="bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-purple-400" size={20} />

              <h3 className="text-xl font-bold text-white">
                Scheduled Campaigns
              </h3>
            </div>

            <div className="space-y-4">
              {[
                ["Friday Promo Blast", "8:00 AM"],
                ["Weekend SMS Push", "12:00 PM"],
                ["Instagram Reel Campaign", "3:30 PM"],
              ].map(([title, time]) => (
                <div
                  key={title}
                  className="flex items-center justify-between bg-black/30 border border-white/5 rounded-2xl p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled campaign
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock3 size={14} />
                    {time}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
