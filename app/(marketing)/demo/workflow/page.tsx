export {};
"use client";

import {
  Workflow,
  Zap,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ArrowRight,
  Layers3,
  Users,
  MessageSquare,
  Mail,
  Bot,
  Activity,
  Sparkles,
  Play,
  Pause,
  BarChart3,
  Target,
  ShieldCheck,
  Cpu,
  Database,
  GitBranch,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function WorkflowPage() {
  const workflows = [
    {
      title: "Lead Qualification Automation",
      status: "Active",
      trigger: "New lead submitted",
      actions: [
        "AI lead scoring",
        "Assign sales rep",
        "Send welcome email",
        "Create CRM opportunity",
      ],
      color: "cyan",
    },
    {
      title: "Hot Lead Escalation",
      status: "Running",
      trigger: "Lead score exceeds 90%",
      actions: [
        "Notify sales team",
        "Trigger SMS follow-up",
        "Schedule callback",
        "Move pipeline stage",
      ],
      color: "emerald",
    },
    {
      title: "Missed Communication Recovery",
      status: "Monitoring",
      trigger: "No reply in 48 hours",
      actions: [
        "AI follow-up message",
        "Re-engagement sequence",
        "Manager notification",
      ],
      color: "purple",
    },
    {
      title: "Client Onboarding Pipeline",
      status: "Operational",
      trigger: "Contract signed",
      actions: [
        "Generate onboarding tasks",
        "Create workspace",
        "Assign onboarding specialist",
        "Launch welcome automation",
      ],
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6">

        <div className="flex items-center gap-5">

          <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
            <Workflow className="text-cyan-400" size={34} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Workflow Automation
            </h1>

            <p className="text-gray-400 mt-2 max-w-3xl">
              Centralized automation system managing lead routing,
              communications, onboarding, AI actions, CRM updates,
              and operational workflows across the platform.
            </p>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

          {[
            ["Active Workflows", "42"],
            ["Automations Today", "4,281"],
            ["Execution Success", "98.4%"],
            ["Avg Runtime", "0.8s"],
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

      {/* LIVE AUTOMATION FLOW */}
      <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8 overflow-hidden relative">

        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full" />

        <div className="relative z-10">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-4">
              <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
                <GitBranch className="text-cyan-400" size={28} />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white">
                  Live Workflow Pipeline
                </h2>

                <p className="text-gray-400 mt-2">
                  Real-time workflow orchestration and automation execution
                </p>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 size={15} />
              System Operational
            </div>
          </div>

          {/* FLOW VISUAL */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

            {[
              {
                icon: Users,
                title: "Lead Entered",
                desc: "New contact captured",
              },
              {
                icon: Bot,
                title: "AI Processing",
                desc: "Scoring + enrichment",
              },
              {
                icon: Workflow,
                title: "Automation",
                desc: "Workflow execution",
              },
              {
                icon: MessageSquare,
                title: "Communication",
                desc: "Email/SMS engagement",
              },
              {
                icon: Target,
                title: "Conversion",
                desc: "Opportunity created",
              },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative bg-black/30 border border-white/5 rounded-3xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">

                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                      <Icon className="text-cyan-400" size={22} />
                    </div>

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <h3 className="text-white font-semibold text-lg">
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    {step.desc}
                  </p>

                  {index !== 4 && (
                    <ArrowRight
                      className="hidden xl:block absolute -right-4 top-1/2 -translate-y-1/2 text-gray-700"
                      size={20}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="2xl:col-span-2 space-y-8">

          {/* WORKFLOW CARDS */}
          {workflows.map((workflow) => (
            <div
              key={workflow.title}
              className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8"
            >
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-8">

                <div className="flex items-start gap-5">

                  <div
                    className={`
                      p-4 rounded-3xl
                      ${workflow.color === "cyan" && "bg-cyan-500/10 border border-cyan-500/20"}
                      ${workflow.color === "emerald" && "bg-emerald-500/10 border border-emerald-500/20"}
                      ${workflow.color === "purple" && "bg-purple-500/10 border border-purple-500/20"}
                      ${workflow.color === "orange" && "bg-orange-500/10 border border-orange-500/20"}
                    `}
                  >
                    <Zap
                      className={`
                        ${workflow.color === "cyan" && "text-cyan-400"}
                        ${workflow.color === "emerald" && "text-emerald-400"}
                        ${workflow.color === "purple" && "text-purple-400"}
                        ${workflow.color === "orange" && "text-orange-400"}
                      `}
                      size={24}
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {workflow.title}
                    </h2>

                    <p className="text-gray-400 mt-3">
                      Trigger: {workflow.trigger}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">

                  <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    {workflow.status}
                  </div>

                  <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                    <Pause className="text-gray-300" size={16} />
                  </button>
                </div>
              </div>

              {/* ACTION FLOW */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

                {workflow.actions.map((action, index) => (
                  <div
                    key={action}
                    className="relative bg-black/30 border border-white/5 rounded-3xl p-5"
                  >
                    <div className="flex items-center justify-between mb-5">

                      <div className="w-8 h-8 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-semibold">
                        {index + 1}
                      </div>

                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <p className="text-white text-sm leading-relaxed">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ACTIVE TASK QUEUE */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">

            <div className="flex items-center gap-4 mb-8">
              <Layers3 className="text-cyan-400" size={24} />

              <h2 className="text-3xl font-bold text-white">
                Active Workflow Queue
              </h2>
            </div>

            <div className="space-y-4">

              {[
                {
                  title: "Lead onboarding automation executing",
                  status: "Running",
                  time: "2s ago",
                },
                {
                  title: "Email follow-up workflow triggered",
                  status: "Completed",
                  time: "1m ago",
                },
                {
                  title: "AI lead routing processing",
                  status: "Active",
                  time: "Realtime",
                },
                {
                  title: "Pipeline escalation sequence",
                  status: "Queued",
                  time: "Awaiting execution",
                },
              ].map((task) => (
                <div
                  key={task.title}
                  className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-5 rounded-3xl bg-black/30 border border-white/5"
                >
                  <div>
                    <p className="text-white font-medium">
                      {task.title}
                    </p>

                    <p className="text-gray-500 text-sm mt-2">
                      {task.time}
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm flex items-center gap-2">
                    <Clock3 size={14} />
                    {task.status}
                  </div>
                </div>
              ))}
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
                Workflow Activity
              </h3>
            </div>

            <div className="space-y-5">

              {[
                "AI automation assigned 12 new leads",
                "Follow-up workflow triggered",
                "Sales escalation completed",
                "Pipeline stage updated automatically",
                "CRM synchronization successful",
                "Email sequence launched",
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

          {/* SYSTEM HEALTH */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <Cpu className="text-emerald-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                Automation Health
              </h3>
            </div>

            <div className="space-y-5">

              {[
                ["Workflow Engine", "Operational"],
                ["AI Runtime", "Healthy"],
                ["Database Sync", "24ms"],
                ["Task Queue", "Stable"],
                ["Automation Layer", "Protected"],
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

          {/* AI RECOMMENDATIONS */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-purple-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                Recommendations
              </h3>
            </div>

            <div className="space-y-4">

              {[
                {
                  title: "Reduce lead routing delay",
                  desc: "AI predicts 11% faster conversion with instant assignment.",
                },
                {
                  title: "Expand onboarding automation",
                  desc: "Client setup time can be reduced by 34%.",
                },
                {
                  title: "Enable SMS escalation",
                  desc: "Hot lead conversion may improve by 18%.",
                },
              ].map((rec) => (
                <div
                  key={rec.title}
                  className="p-5 rounded-3xl bg-black/30 border border-white/5"
                >
                  <p className="text-white font-medium">
                    {rec.title}
                  </p>

                  <p className="text-sm text-gray-500 leading-relaxed mt-3">
                    {rec.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
