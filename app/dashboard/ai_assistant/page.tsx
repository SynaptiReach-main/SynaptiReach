"use client";

import {
  Bot,
  Sparkles,
  Brain,
  Cpu,
  Activity,
  MessageSquare,
  Wand2,
  Zap,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  Database,
} from "lucide-react";

export default function AIAssistantPage() {
  return (
    <main className="min-h-screen text-white">

      {/* HERO */}
      <section className="mb-10">

        <div className="flex items-center gap-4 mb-5">

          <div className="w-16 h-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
            <Bot
              className="text-cyan-300"
              size={30}
            />
          </div>

          <div>

            <h1 className="text-4xl font-black">
              AI Assistant Control Center
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Autonomous AI operations, CRM intelligence, and workflow execution
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">

          {[
            {
              label: "AI Agents Active",
              value: "8",
              icon: Brain,
            },
            {
              label: "Tasks Automated",
              value: "124",
              icon: Cpu,
            },
            {
              label: "Responses Generated",
              value: "3.2K",
              icon: MessageSquare,
            },
            {
              label: "System Accuracy",
              value: "98%",
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

        {/* LEFT SIDE */}
        <div className="xl:col-span-2 space-y-6">

          {/* AI AGENTS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-black">
                  Autonomous AI Agents
                </h2>

                <p className="text-sm text-gray-500">
                  Live AI systems managing your CRM infrastructure
                </p>

              </div>

              <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
                Live AI Systems
              </div>

            </div>

            <div className="space-y-4">

              {[
                {
                  name: "Lead Qualification Agent",
                  status: "Active",
                  load: "92%",
                },
                {
                  name: "Marketing Optimization AI",
                  status: "Learning",
                  load: "74%",
                },
                {
                  name: "Sales Pipeline Agent",
                  status: "Executing",
                  load: "88%",
                },
                {
                  name: "Customer Retention AI",
                  status: "Monitoring",
                  load: "61%",
                },
              ].map((agent) => (
                <div
                  key={agent.name}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >

                  <div className="flex items-center justify-between mb-4">

                    <div>

                      <h3 className="font-bold text-white">
                        {agent.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Status: {agent.status}
                      </p>

                    </div>

                    <div className="text-cyan-300 font-bold">
                      {agent.load}
                    </div>

                  </div>

                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
                      style={{
                        width: agent.load,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* AI TASK QUEUE */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-black">
                  AI Automation Queue
                </h2>

                <p className="text-sm text-gray-500">
                  Real-time autonomous CRM execution pipeline
                </p>

              </div>

              <Zap
                className="text-cyan-300"
                size={20}
              />

            </div>

            <div className="space-y-4">

              {[
                {
                  task: "Generating lead outreach emails",
                  time: "2m ago",
                },
                {
                  task: "Optimizing ad campaign targeting",
                  time: "4m ago",
                },
                {
                  task: "Updating customer sentiment analysis",
                  time: "7m ago",
                },
                {
                  task: "Processing workflow automations",
                  time: "12m ago",
                },
              ].map((task) => (
                <div
                  key={task.task}
                  className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 flex items-center justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-10 h-10 rounded-xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">

                      <Wand2
                        size={16}
                        className="text-cyan-300"
                      />

                    </div>

                    <div>

                      <div className="font-medium text-white">
                        {task.task}
                      </div>

                      <div className="text-sm text-gray-500">
                        AI execution event
                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">

                    <Clock3 size={14} />

                    {task.time}

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* AI STATUS */}
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">

                <Brain
                  className="text-cyan-300"
                  size={20}
                />

              </div>

              <div>

                <h2 className="text-xl font-black">
                  Neural Intelligence
                </h2>

                <p className="text-sm text-gray-400">
                  AI cognition systems operational
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {[
                "AI learning cycle active",
                "Customer behavior predictions updated",
                "CRM insights recalculated",
                "Automation engine synchronized",
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

          {/* AI PERFORMANCE */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <h2 className="text-xl font-black mb-5">
              AI Performance Metrics
            </h2>

            <div className="space-y-4">

              {[
                {
                  label: "Automation Accuracy",
                  value: "98%",
                },
                {
                  label: "Average Response Time",
                  value: "1.4s",
                },
                {
                  label: "Prediction Confidence",
                  value: "94%",
                },
                {
                  label: "Tasks Completed",
                  value: "12.8K",
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

          {/* AI INSIGHTS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center gap-3 mb-5">

              <Database
                className="text-cyan-300"
                size={20}
              />

              <h2 className="text-xl font-black">
                AI Insights Feed
              </h2>

            </div>

            <div className="space-y-4">

              {[
                "High-converting leads identified",
                "Customer churn probability reduced",
                "Marketing ROI increased 18%",
                "AI found automation bottleneck",
              ].map((insight) => (
                <div
                  key={insight}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center justify-between"
                >

                  <span className="text-sm text-gray-300">
                    {insight}
                  </span>

                  <ArrowUpRight
                    size={15}
                    className="text-cyan-300"
                  />

                </div>
              ))}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
