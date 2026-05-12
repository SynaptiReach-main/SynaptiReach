export {};
"use client";

import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Target,
  Clock3,
  AlertCircle,
  CheckCircle2,
  Users,
  Sparkles,
} from "lucide-react";

const leads = [
  {
    name: "Nova Medical Group",
    stage: "Qualified",
    owner: "Sarah K.",
    value: "$18,400",
    status: "Hot",
    source: "LinkedIn Campaign",
    lastContact: "2h ago",
  },
  {
    name: "Atlas Logistics",
    stage: "Proposal",
    owner: "Michael T.",
    value: "$42,000",
    status: "Negotiation",
    source: "Inbound Demo",
    lastContact: "45m ago",
  },
  {
    name: "Elevate Fitness",
    stage: "Discovery",
    owner: "Emma R.",
    value: "$8,200",
    status: "Warm",
    source: "Instagram Ads",
    lastContact: "1d ago",
  },
  {
    name: "Vertex Construction",
    stage: "Closed Won",
    owner: "David L.",
    value: "$61,000",
    status: "Converted",
    source: "Referral",
    lastContact: "3h ago",
  },
  {
    name: "BluePeak Dental",
    stage: "Contacted",
    owner: "Alex M.",
    value: "$14,700",
    status: "Follow Up",
    source: "Cold Outreach",
    lastContact: "20m ago",
  },
];

const pipeline = [
  { label: "New Leads", count: 148, color: "from-cyan-400 to-cyan-300" },
  { label: "Contacted", count: 96, color: "from-sky-400 to-cyan-300" },
  { label: "Qualified", count: 58, color: "from-emerald-400 to-cyan-300" },
  { label: "Proposal", count: 27, color: "from-purple-400 to-cyan-300" },
  { label: "Closed", count: 14, color: "from-green-400 to-emerald-300" },
];

export default function LeadsPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="
        relative
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-[#0b0b0b]/90
        backdrop-blur-xl
        p-8
      ">

        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 w-72 h-72 bg-cyan-500/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 w-72 h-72 bg-emerald-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          <div>
            <div className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-500/10
              text-cyan-300
              text-xs
              uppercase
              tracking-[0.2em]
              mb-5
            ">
              Lead Operations
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white">
              Sales Pipeline
            </h1>

            <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
              Manage incoming leads, monitor conversion activity,
              prioritize opportunities, and track pipeline performance
              across your organization.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="
              px-5
              py-3
              rounded-2xl
              bg-cyan-500
              hover:bg-cyan-400
              text-black
              font-semibold
              transition-all
              flex
              items-center
              gap-2
            ">
              <Plus size={18} />
              Add Lead
            </button>

            <button className="
              px-5
              py-3
              rounded-2xl
              border
              border-white/10
              bg-black/30
              hover:border-cyan-400/30
              text-white
              transition-all
              flex
              items-center
              gap-2
            ">
              <Filter size={18} />
              Filters
            </button>
          </div>

        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {[
          {
            label: "Total Leads",
            value: "842",
            change: "+18%",
            icon: <Users size={18} />,
          },
          {
            label: "Hot Leads",
            value: "63",
            change: "+11%",
            icon: <Sparkles size={18} />,
          },
          {
            label: "Conversion Rate",
            value: "28%",
            change: "+4%",
            icon: <TrendingUp size={18} />,
          },
          {
            label: "Avg Deal Size",
            value: "$24.8k",
            change: "+7%",
            icon: <Target size={18} />,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#0b0b0b]/90
              backdrop-blur-xl
              p-6
            "
          >

            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="
                  w-11
                  h-11
                  rounded-xl
                  bg-cyan-500/10
                  border
                  border-cyan-400/20
                  flex
                  items-center
                  justify-center
                  text-cyan-300
                ">
                  {card.icon}
                </div>

                <span className="text-emerald-400 text-sm font-medium">
                  {card.change}
                </span>
              </div>

              <h2 className="text-3xl font-black text-white mt-5">
                {card.value}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {card.label}
              </p>
            </div>

          </div>
        ))}

      </div>

      {/* PIPELINE OVERVIEW */}
      <div className="
        rounded-3xl
        border
        border-white/10
        bg-[#0b0b0b]/90
        backdrop-blur-xl
        p-8
      ">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Pipeline Overview
            </h2>

            <p className="text-gray-500 mt-1">
              Live lead progression across the sales funnel
            </p>
          </div>

          <div className="
            px-4
            py-2
            rounded-xl
            border
            border-emerald-400/20
            bg-emerald-500/10
            text-emerald-300
            text-sm
          ">
            +12% conversion growth
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

          {pipeline.map((stage, i) => (
            <div
              key={stage.label}
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-black/30
                p-5
              "
            >

              <div className={`
                absolute
                top-0
                left-0
                h-1
                w-full
                bg-gradient-to-r
                ${stage.color}
              `} />

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {stage.label}
                </span>

                {i !== pipeline.length - 1 && (
                  <ArrowUpRight
                    size={16}
                    className="text-cyan-400"
                  />
                )}
              </div>

              <h3 className="text-4xl font-black text-white mt-6">
                {stage.count}
              </h3>

              <div className="mt-5 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  style={{
                    width: `${100 - i * 15}%`,
                  }}
                  className={`
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    ${stage.color}
                  `}
                />
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">

        {/* LEADS TABLE */}
        <div className="
          2xl:col-span-8
          rounded-3xl
          border
          border-white/10
          bg-[#0b0b0b]/90
          backdrop-blur-xl
          overflow-hidden
        ">

          <div className="p-6 border-b border-white/5">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Active Leads
                </h2>

                <p className="text-gray-500 mt-1">
                  Recently updated opportunities
                </p>
              </div>

              <div className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-black/30
                px-4
                py-3
                min-w-[280px]
              ">
                <Search size={18} className="text-gray-500" />

                <input
                  placeholder="Search leads..."
                  className="
                    bg-transparent
                    outline-none
                    w-full
                    text-sm
                    placeholder:text-gray-500
                  "
                />
              </div>

            </div>

          </div>

          <div className="divide-y divide-white/5">

            {leads.map((lead) => (
              <div
                key={lead.name}
                className="
                  p-6
                  hover:bg-white/[0.03]
                  transition-all
                "
              >

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold text-lg">
                        {lead.name}
                      </h3>

                      <span className="
                        px-2
                        py-1
                        rounded-full
                        bg-cyan-500/10
                        border
                        border-cyan-400/20
                        text-cyan-300
                        text-xs
                      ">
                        {lead.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 mt-3 text-sm text-gray-500">

                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        {lead.owner}
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        {lead.source}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3 size={14} />
                        {lead.lastContact}
                      </div>

                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">

                    <div className="text-right">
                      <p className="text-gray-500 text-xs uppercase">
                        Deal Value
                      </p>

                      <h4 className="text-white font-bold text-xl">
                        {lead.value}
                      </h4>
                    </div>

                    <div className="
                      px-4
                      py-2
                      rounded-xl
                      border
                      border-white/10
                      bg-black/30
                      text-white
                      text-sm
                    ">
                      {lead.stage}
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="2xl:col-span-4 space-y-6">

          {/* TASKS */}
          <div className="
            rounded-3xl
            border
            border-white/10
            bg-[#0b0b0b]/90
            backdrop-blur-xl
            p-6
          ">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                Priority Tasks
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Immediate sales actions
              </p>
            </div>

            <div className="space-y-4">

              {[
                "Follow up with Atlas Logistics",
                "Send proposal to Nova Medical",
                "Review hot lead scoring updates",
                "Schedule onboarding call",
              ].map((task) => (
                <div
                  key={task}
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-2xl
                    border
                    border-white/5
                    bg-black/20
                  "
                >
                  <CheckCircle2
                    size={18}
                    className="text-cyan-400 mt-0.5"
                  />

                  <div>
                    <p className="text-white text-sm">
                      {task}
                    </p>

                    <p className="text-gray-500 text-xs mt-1">
                      Due within next 4 hours
                    </p>
                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* ACTIVITY */}
          <div className="
            rounded-3xl
            border
            border-white/10
            bg-[#0b0b0b]/90
            backdrop-blur-xl
            p-6
          ">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                Recent Activity
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Live CRM updates
              </p>
            </div>

            <div className="space-y-4">

              {[
                {
                  title: "Lead converted to proposal",
                  time: "12 min ago",
                },
                {
                  title: "New inbound demo booked",
                  time: "26 min ago",
                },
                {
                  title: "AI lead score updated",
                  time: "1h ago",
                },
                {
                  title: "Pipeline moved to negotiation",
                  time: "2h ago",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="
                    flex
                    gap-3
                    p-4
                    rounded-2xl
                    border
                    border-white/5
                    bg-black/20
                  "
                >
                  <div className="
                    w-2
                    h-2
                    rounded-full
                    bg-cyan-400
                    mt-2
                    animate-pulse
                  " />

                  <div>
                    <p className="text-white text-sm">
                      {item.title}
                    </p>

                    <p className="text-gray-500 text-xs mt-1">
                      {item.time}
                    </p>
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
