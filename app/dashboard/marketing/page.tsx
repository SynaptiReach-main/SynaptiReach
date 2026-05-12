"use client";

import {
  Megaphone,
  Mail,
  MousePointerClick,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function MarketingPage() {
  return (
    <main className="min-h-screen text-white">

      {/* HERO */}
      <section className="mb-10">

        <div className="flex items-center gap-3 mb-4">

          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Megaphone
              className="text-cyan-400"
              size={26}
            />
          </div>

          <div>

            <h1 className="text-4xl font-black">
              Marketing Command Center
            </h1>

            <p className="text-gray-500 text-sm">
              AI-powered campaign management and growth tracking
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">

          {[
            {
              label: "Campaigns Active",
              value: "12",
              icon: Target,
            },
            {
              label: "Lead Conversion",
              value: "18.4%",
              icon: TrendingUp,
            },
            {
              label: "Email Open Rate",
              value: "42%",
              icon: Mail,
            },
            {
              label: "Traffic Growth",
              value: "+28%",
              icon: Users,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between mb-5">

                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Icon
                      size={18}
                      className="text-cyan-300"
                    />
                  </div>

                  <Sparkles
                    size={16}
                    className="text-green-400"
                  />

                </div>

                <div className="text-3xl font-black mb-1">
                  {item.value}
                </div>

                <div className="text-sm text-gray-500">
                  {item.label}
                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* CAMPAIGNS */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* ACTIVE CAMPAIGNS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-black">
                  Active Campaigns
                </h2>

                <p className="text-sm text-gray-500">
                  Live AI-managed marketing campaigns
                </p>

              </div>

              <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
                Live Tracking
              </div>

            </div>

            <div className="space-y-4">

              {[
                {
                  name: "AI Outreach Funnel",
                  progress: "84%",
                  status: "Scaling",
                },
                {
                  name: "Lead Retargeting Campaign",
                  progress: "62%",
                  status: "Optimizing",
                },
                {
                  name: "Email Automation Blast",
                  progress: "91%",
                  status: "Performing",
                },
                {
                  name: "Social Growth Engine",
                  progress: "48%",
                  status: "Learning",
                },
              ].map((campaign) => (
                <div
                  key={campaign.name}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >

                  <div className="flex items-center justify-between mb-3">

                    <div>

                      <h3 className="font-bold text-white">
                        {campaign.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Status: {campaign.status}
                      </p>

                    </div>

                    <div className="text-cyan-300 font-bold">
                      {campaign.progress}
                    </div>

                  </div>

                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
                      style={{
                        width: campaign.progress,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* PERFORMANCE */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-black">
                  Performance Overview
                </h2>

                <p className="text-sm text-gray-500">
                  AI marketing performance metrics
                </p>

              </div>

              <BarChart3
                size={20}
                className="text-cyan-300"
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {[
                {
                  label: "Ad Spend ROI",
                  value: "4.8x",
                },
                {
                  label: "Cost Per Lead",
                  value: "$14",
                },
                {
                  label: "Audience Reach",
                  value: "248K",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >

                  <div className="text-gray-500 text-sm mb-2">
                    {metric.label}
                  </div>

                  <div className="text-3xl font-black">
                    {metric.value}
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* AI ENGINE */}
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
                <Sparkles
                  className="text-cyan-300"
                  size={20}
                />
              </div>

              <div>

                <h2 className="font-black text-xl">
                  AI Optimization
                </h2>

                <p className="text-sm text-gray-400">
                  Autonomous marketing intelligence
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {[
                "AI adjusted ad targeting",
                "Email campaign optimized",
                "Lead scoring recalculated",
                "Traffic spike detected",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >

                  <div className="w-2 h-2 rounded-full bg-green-400" />

                  {item}

                </div>
              ))}

            </div>

          </div>

          {/* CHANNELS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <h2 className="text-xl font-black mb-5">
              Traffic Sources
            </h2>

            <div className="space-y-4">

              {[
                {
                  source: "Organic Search",
                  value: "42%",
                },
                {
                  source: "Email Funnels",
                  value: "26%",
                },
                {
                  source: "Paid Ads",
                  value: "19%",
                },
                {
                  source: "Social Media",
                  value: "13%",
                },
              ].map((source) => (
                <div
                  key={source.source}
                  className="space-y-2"
                >

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-gray-300">
                      {source.source}
                    </span>

                    <span className="text-cyan-300 font-semibold">
                      {source.value}
                    </span>

                  </div>

                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
                      style={{
                        width: source.value,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* CLICK EVENTS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center gap-3 mb-5">

              <MousePointerClick
                className="text-cyan-300"
                size={20}
              />

              <h2 className="text-xl font-black">
                Engagement Signals
              </h2>

            </div>

            <div className="space-y-4">

              {[
                "High CTR on onboarding ads",
                "Returning visitors increased",
                "Lead engagement up 17%",
                "AI detected viral content",
              ].map((signal) => (
                <div
                  key={signal}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300"
                >
                  {signal}
                </div>
              ))}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
