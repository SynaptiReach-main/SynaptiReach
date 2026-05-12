"use client";

import {
  Workflow,
  Zap,
  CheckCircle2,
  Clock3,
  Activity,
  ArrowRight,
  Bot,
  Cpu,
  Layers3,
  Sparkles,
  PlayCircle,
  PauseCircle,
  GitBranch,
} from "lucide-react";

export default function WorkflowPage() {
  return (
    <main className="min-h-screen text-white">

      {/* HERO */}
      <section className="mb-10">

        <div className="flex items-center gap-4 mb-5">

          <div className="w-16 h-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
            <Workflow
              className="text-cyan-300"
              size={30}
            />
          </div>

          <div>

            <h1 className="text-4xl font-black">
              Workflow Automation Engine
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              AI-powered operational workflows and autonomous business execution
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">

          {[
            {
              label: "Active Workflows",
              value: "18",
              icon: Workflow,
            },
            {
              label: "Tasks Automated",
              value: "2.8K",
              icon: Zap,
            },
            {
              label: "Execution Success",
              value: "99%",
              icon: CheckCircle2,
            },
            {
              label: "Live Processes",
              value: "43",
              icon: Activity,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >

                <div className="flex items-center justify-between mb-5">

                  <div className="w-11 h-11 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
                    <Icon
                      className="text-cyan-300"
                      size={18}
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

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* ACTIVE WORKFLOWS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-black">
                  Active Workflow Pipelines
                </h2>

                <p className="text-sm text-gray-500">
                  Real-time AI execution systems
                </p>

              </div>

              <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
                Live Automation
              </div>

            </div>

            <div className="space-y-4">

              {[
                {
                  name: "Lead Qualification Pipeline",
                  status: "Running",
                  progress: "92%",
                },
                {
                  name: "Customer Follow-Up Sequence",
                  status: "Executing",
                  progress: "78%",
                },
                {
                  name: "Marketing Campaign Automation",
                  status: "Optimizing",
                  progress: "86%",
                },
                {
                  name: "AI Sales Workflow",
                  status: "Monitoring",
                  progress: "63%",
                },
              ].map((workflow) => (
                <div
                  key={workflow.name}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >

                  <div className="flex items-center justify-between mb-4">

                    <div>

                      <h3 className="font-bold text-white">
                        {workflow.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Status: {workflow.status}
                      </p>

                    </div>

                    <div className="text-cyan-300 font-bold">
                      {workflow.progress}
                    </div>

                  </div>

                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
                      style={{
                        width: workflow.progress,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* PROCESS FLOW */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-black">
                  AI Process Flow
                </h2>

                <p className="text-sm text-gray-500">
                  Autonomous operational workflow chain
                </p>

              </div>

              <GitBranch
                className="text-cyan-300"
                size={20}
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {[
                "Lead Captured",
                "AI Qualification",
                "Workflow Triggered",
                "Customer Conversion",
              ].map((step, index) => (
                <div
                  key={step}
                  className="relative rounded-2xl border border-white/10 bg-black/30 p-5"
                >

                  <div className="w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center mb-4">

                    <span className="font-black text-cyan-300">
                      {index + 1}
                    </span>

                  </div>

                  <div className="font-semibold text-white text-sm">
                    {step}
                  </div>

                  {index < 3 && (
                    <ArrowRight
                      size={18}
                      className="hidden md:block absolute -right-3 top-1/2 text-cyan-300"
                    />
                  )}

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* AUTOMATION STATUS */}
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">

                <Bot
                  className="text-cyan-300"
                  size={20}
                />

              </div>

              <div>

                <h2 className="text-xl font-black">
                  Automation Status
                </h2>

                <p className="text-sm text-gray-400">
                  AI workflow systems online
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {[
                "CRM automations synchronized",
                "AI trigger systems active",
                "Lead routing operational",
                "Customer lifecycle monitoring enabled",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >

                  <CheckCircle2
                    size={15}
                    className="text-green-400"
                  />

                  {item}

                </div>
              ))}

            </div>

          </div>

          {/* WORKFLOW METRICS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <h2 className="text-xl font-black mb-5">
              Workflow Metrics
            </h2>

            <div className="space-y-4">

              {[
                {
                  label: "Automation Efficiency",
                  value: "96%",
                },
                {
                  label: "Average Runtime",
                  value: "2.1s",
                },
                {
                  label: "Tasks Completed",
                  value: "18.4K",
                },
                {
                  label: "Workflow Accuracy",
                  value: "99.2%",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center justify-between"
                >

                  <span className="text-gray-400 text-sm">
                    {metric.label}
                  </span>

                  <span className="font-bold text-cyan-300">
                    {metric.value}
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* LIVE OPERATIONS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center gap-3 mb-5">

              <Layers3
                className="text-cyan-300"
                size={20}
              />

              <h2 className="text-xl font-black">
                Live Operations
              </h2>

            </div>

            <div className="space-y-4">

              {[
                {
                  label: "Workflow Engine",
                  status: "Running",
                  icon: PlayCircle,
                },
                {
                  label: "AI Processing",
                  status: "Active",
                  icon: Cpu,
                },
                {
                  label: "Queue Monitor",
                  status: "Monitoring",
                  icon: Clock3,
                },
                {
                  label: "Automation Sync",
                  status: "Online",
                  icon: PauseCircle,
                },
              ].map((operation) => {
                const Icon = operation.icon;

                return (
                  <div
                    key={operation.label}
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center justify-between"
                  >

                    <div className="flex items-center gap-3">

                      <Icon
                        size={16}
                        className="text-cyan-300"
                      />

                      <span className="text-sm text-gray-300">
                        {operation.label}
                      </span>

                    </div>

                    <span className="text-xs font-semibold text-green-400">
                      {operation.status}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
