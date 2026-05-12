export {};
"use client";

import PipelineFunnel from "../components/PipelineFunnel";
import TeamPerformance from "../components/TeamPerformance";
import LiveActivityStream from "../components/LiveActivityStream";
import RevenueForecast from "../components/RevenueForecast";
import CustomerHealth from "../components/CustomerHealth";
import AutomationQueue from "../components/AutomationQueue";

const stats = [
  {
    label: "Monthly Revenue",
    value: "$142.5k",
    change: "+12.4%",
  },
  {
    label: "Active Leads",
    value: "842",
    change: "+18%",
  },
  {
    label: "Open Tasks",
    value: "37",
    change: "-4%",
  },
  {
    label: "Response Rate",
    value: "94%",
    change: "+6%",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl p-8">

        {/* GLOW */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 left-0 w-72 h-72 bg-cyan-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 text-xs tracking-widest uppercase mb-5">
              Live Operations
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
              SynaptiReach
              <span className="block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Executive Dashboard
              </span>
            </h1>

            <p className="text-gray-400 mt-5 max-w-2xl leading-relaxed">
              Unified operational command center for pipeline management,
              client activity, automation systems, communications,
              and revenue growth tracking.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[320px]">
            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Active Automations
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                128
              </h2>

              <p className="text-emerald-400 text-sm mt-1">
                +14% this week
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Team Utilization
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                87%
              </h2>

              <p className="text-cyan-300 text-sm mt-1">
                High productivity
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* MAIN STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border border-white/10
              bg-[#0b0b0b]/90
              backdrop-blur-xl
              p-6
              hover:border-cyan-400/20
              transition-all
              duration-300
            "
          >

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
            </div>

            <div className="relative z-10">
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                {s.label}
              </p>

              <div className="flex items-end justify-between mt-4">
                <h2 className="text-4xl font-black text-white">
                  {s.value}
                </h2>

                <span className="text-emerald-400 text-sm font-medium">
                  {s.change}
                </span>
              </div>

              <div className="mt-5 h-[2px] rounded-full bg-white/5 overflow-hidden">
                <div className="w-2/3 h-full bg-gradient-to-r from-cyan-400 to-emerald-300" />
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* PRIMARY GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="2xl:col-span-8 space-y-6">

          <div className="
            rounded-3xl
            border border-white/10
            bg-[#0b0b0b]/90
            backdrop-blur-xl
            p-2
          ">
            <PipelineFunnel />
          </div>

          <div className="
            rounded-3xl
            border border-white/10
            bg-[#0b0b0b]/90
            backdrop-blur-xl
            p-2
          ">
            <RevenueForecast />
          </div>

        </div>

        {/* RIGHT */}
        <div className="2xl:col-span-4 space-y-6">

          <div className="
            rounded-3xl
            border border-white/10
            bg-[#0b0b0b]/90
            backdrop-blur-xl
            p-2
          ">
            <TeamPerformance />
          </div>

          <div className="
            rounded-3xl
            border border-white/10
            bg-[#0b0b0b]/90
            backdrop-blur-xl
            p-2
          ">
            <LiveActivityStream />
          </div>

        </div>

      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="
          rounded-3xl
          border border-white/10
          bg-[#0b0b0b]/90
          backdrop-blur-xl
          p-2
        ">
          <CustomerHealth />
        </div>

        <div className="
          rounded-3xl
          border border-white/10
          bg-[#0b0b0b]/90
          backdrop-blur-xl
          p-2
        ">
          <AutomationQueue />
        </div>

        {/* NOTIFICATIONS */}
        <div className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-[#0b0b0b]/90
          backdrop-blur-xl
          p-6
        ">

          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[100px]" />

          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-white text-xl font-bold">
                Notifications
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Important operational alerts
              </p>
            </div>

            <div className="space-y-4">

              {[
                {
                  title: "Enterprise demos scheduled",
                  detail: "3 high-value prospects confirmed today",
                },
                {
                  title: "Campaign exceeded targets",
                  detail: "CTR improved by 18.2% in healthcare vertical",
                },
                {
                  title: "Client onboarding completed",
                  detail: "Nova Medical workspace activated",
                },
                {
                  title: "Pipeline conversion increase",
                  detail: "Sales conversions rose 12% this week",
                },
              ].map((n) => (
                <div
                  key={n.title}
                  className="
                    rounded-2xl
                    border border-white/5
                    bg-black/20
                    p-4
                    hover:border-cyan-400/20
                    transition-all
                  "
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 animate-pulse" />

                    <div>
                      <p className="text-white text-sm font-medium">
                        {n.title}
                      </p>

                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        {n.detail}
                      </p>
                    </div>
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
