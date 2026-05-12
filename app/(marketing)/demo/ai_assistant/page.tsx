export {};
"use client";

import { useState } from "react";

import {
  Bot,
  BrainCircuit,
  Sparkles,
  Activity,
  Cpu,
  Database,
  ShieldCheck,
  MessageSquare,
  Mail,
  Megaphone,
  Workflow,
  CheckCircle2,
  Clock3,
  ArrowRight,
  TrendingUp,
  Globe,
  Layers3,
  Send,
  User,
} from "lucide-react";

export default function AIAssistantPage() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Welcome to SynaptiReach AI Assistant. I can help with CRM management, campaigns, workflows, automations, reporting, onboarding, lead tracking, and platform guidance.",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    let response =
      "I can help optimize your workflows, campaigns, lead pipeline, automations, and customer engagement across your SynaptiReach platform.";

    const lower = input.toLowerCase();

    if (lower.includes("lead")) {
      response =
        "Your current pipeline contains 842 active leads with 126 marked as hot opportunities. AI recommends immediate follow-up for 24 high-conversion prospects.";
    }

    if (
      lower.includes("campaign") ||
      lower.includes("marketing")
    ) {
      response =
        "Your top performing campaign currently is Instagram Retargeting with a 6.8% conversion rate. AI recommends increasing spend allocation by 18%.";
    }

    if (
      lower.includes("workflow") ||
      lower.includes("automation")
    ) {
      response =
        "Workflow automations are operating normally. 42 automations executed successfully today with a 98.4% success rate.";
    }

    if (
      lower.includes("email") ||
      lower.includes("sms")
    ) {
      response =
        "AI communication systems are active. Email open rate is 42.8% and SMS engagement is outperforming email by 14% this week.";
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        role: "assistant",
        text: response,
      },
    ]);

    setInput("");
  };

  const aiModules = [
    {
      title: "Email AI",
      description: "Generate outreach sequences and follow-ups",
      icon: Mail,
      tools: [
        "Cold Outreach Generator",
        "Follow-Up Automation",
        "Subject Line Optimizer",
      ],
    },
    {
      title: "SMS AI",
      description: "Automate lead engagement messaging",
      icon: MessageSquare,
      tools: [
        "Lead Follow-Up",
        "Reminder Campaigns",
        "Retention Messaging",
      ],
    },
    {
      title: "Marketing AI",
      description: "Generate ads and campaign strategy",
      icon: Megaphone,
      tools: [
        "Ad Copy Generator",
        "Campaign Strategy",
        "Audience Suggestions",
      ],
    },
    {
      title: "Workflow AI",
      description: "Automate internal operations",
      icon: Workflow,
      tools: [
        "Task Routing",
        "Pipeline Automation",
        "Lead Assignment",
      ],
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6">

        <div className="flex items-center gap-5">
          <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
            <Bot className="text-cyan-400" size={34} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              AI Assistant
            </h1>

            <p className="text-gray-400 mt-2 max-w-2xl">
              Intelligent platform assistant for workflows, campaigns,
              lead management, automation, analytics, and operational support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            ["AI Actions", "4,281"],
            ["Live Requests", "384"],
            ["Automation Rate", "98.4%"],
            ["Avg Response", "1.2s"],
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

      {/* LIVE AI ASSISTANT */}
      <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] overflow-hidden">

        <div className="border-b border-white/10 p-6 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
              <BrainCircuit className="text-cyan-400" size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                SynaptiReach AI Assistant
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Ask questions about your CRM, campaigns, leads, automations, and platform tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
            <CheckCircle2 size={14} />
            Online
          </div>
        </div>

        {/* CHAT */}
        <div className="p-6 h-[500px] overflow-y-auto space-y-5 bg-gradient-to-b from-transparent to-cyan-500/[0.02]">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[80%] rounded-3xl p-5 border
                  ${
                    message.role === "user"
                      ? "bg-cyan-500/10 border-cyan-500/20"
                      : "bg-black/40 border-white/10"
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-3">
                  {message.role === "assistant" ? (
                    <Bot size={16} className="text-cyan-400" />
                  ) : (
                    <User size={16} className="text-white" />
                  )}

                  <span className="text-xs uppercase tracking-widest text-gray-500">
                    {message.role === "assistant"
                      ? "AI Assistant"
                      : "User"}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-gray-200">
                  {message.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="border-t border-white/10 p-5">

          <div className="flex gap-4">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI assistant anything about your platform..."
              className="
                flex-1
                bg-black/40
                border border-white/10
                rounded-2xl
                px-5
                py-4
                text-white
                outline-none
                focus:border-cyan-500/40
              "
            />

            <button
              onClick={sendMessage}
              className="
                px-6
                rounded-2xl
                bg-cyan-500/10
                border border-cyan-500/20
                text-cyan-300
                hover:bg-cyan-500/20
                transition-all
                flex items-center gap-2
              "
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* AI CORE */}
      <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8 overflow-hidden relative">

        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full" />

        <div className="relative z-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

            <div className="flex items-center gap-5">

              <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
                <Cpu className="text-cyan-400" size={30} />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white">
                  Athena Neural Core
                </h2>

                <p className="text-gray-400 mt-2">
                  Real-time orchestration and AI automation layer
                </p>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              All Systems Operational
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {[
              ["Inference Load", "72%"],
              ["Memory Usage", "18.4GB"],
              ["AI Requests", "384"],
              ["Security Layer", "Protected"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-black/30 border border-white/5 rounded-3xl p-5"
              >
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  {label}
                </p>

                <p className="text-2xl font-bold text-white mt-3">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODULE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {aiModules.map((module) => {
          const Icon = module.icon;

          return (
            <div
              key={module.title}
              className="bg-[#0b0b0b]/90 border border-white/10 rounded-[30px] p-7"
            >
              <div className="flex items-start gap-4 mb-6">

                <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                  <Icon className="text-cyan-400" size={24} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {module.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                {module.tools.map((tool) => (
                  <button
                    key={tool}
                    className="w-full text-left flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles
                        size={16}
                        className="text-cyan-400"
                      />

                      <span className="text-sm text-white">
                        {tool}
                      </span>
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-gray-500"
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
