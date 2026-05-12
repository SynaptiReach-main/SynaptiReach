"use client";

import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

interface Props {
  analytics: any;
}

export default function AnalyticsCharts({
  analytics,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <div className="mb-5">

            <h2 className="text-2xl font-black text-white">
              Conversion Funnel
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Campaign conversion performance
            </p>

          </div>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <FunnelChart>

                <Tooltip />

                <Funnel
                  dataKey="value"
                  data={
                    analytics.funnel
                  }
                  isAnimationActive
                />

              </FunnelChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <div className="mb-5">

            <h2 className="text-2xl font-black text-white">
              Engagement Trends
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Open and click performance trends
            </p>

          </div>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={
                  analytics.trends
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="opened"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                />

                <Area
                  type="monotone"
                  dataKey="clicked"
                  stroke="#4ade80"
                  fill="#4ade80"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

        <div className="mb-5">

          <h2 className="text-2xl font-black text-white">
            Top Campaigns
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Highest-converting campaigns
          </p>

        </div>

        <div className="h-[350px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={
                analytics.topCampaigns
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="converted_count"
                fill="#22d3ee"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}
