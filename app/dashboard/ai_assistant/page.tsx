"use client";

import { useEffect, useState } from "react";
import { Bot, Brain, Loader2, Send, Sparkles, Zap } from "lucide-react";

const prompts = [
  "What should I do next?",
  "Which leads need follow-up?",
  "Which campaign is performing best?",
  "Suggest a campaign for qualified leads.",
  "Draft a follow-up for cold leads.",
];

export default function AIAssistantPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [agentLoading, setAgentLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAgents() {
    try {
      setAgentLoading(true);
      const response = await fetch("/api/crm/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "deterministic" }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to run CRM agents.");
      }

      setAgentData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to run CRM agents.");
    } finally {
      setAgentLoading(false);
    }
  }

  useEffect(() => {
    loadAgents();
  }, []);

  async function askAI(nextMessage = message) {
    try {
      if (!nextMessage.trim()) return;
      setLoading(true);
      setError("");
      setMessages((current) => [...current, { role: "user", content: nextMessage }]);
      setMessage("");

      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: nextMessage }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "AI assistant failed.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          data_used: data.data_used,
          provider: data.provider,
          model: data.model,
          fallback_used: data.fallback_used,
        },
      ]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "AI assistant failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
            <Bot className="text-cyan-300" size={30} />
          </div>
          <div>
            <h1 className="text-4xl font-black">AI Assistant Control Center</h1>
            <p className="text-sm text-gray-500 mt-1">
              Server-side CRM intelligence using real leads, campaigns, activity, and communications.
            </p>
          </div>
        </div>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black">CRM Assistant</h2>
              <p className="text-sm text-gray-500">Ask about follow-ups, campaigns, segments, and next actions.</p>
            </div>
            <Sparkles className="text-cyan-300" size={22} />
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {prompts.map((prompt) => (
              <button key={prompt} onClick={() => askAI(prompt)} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-300">
                {prompt}
              </button>
            ))}
          </div>

          <div className="min-h-[360px] space-y-4 rounded-3xl border border-white/10 bg-black/30 p-5">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-20">
                No assistant conversation yet. Start with a suggested prompt.
              </div>
            )}
            {messages.map((item, index) => (
              <div key={index} className={`rounded-2xl p-4 ${item.role === "user" ? "bg-cyan-500/10 border border-cyan-400/20" : "bg-white/[0.03] border border-white/10"}`}>
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">{item.role}</div>
                {item.provider && (
                  <div className="mb-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-cyan-100">
                      {item.provider} / {item.model}
                    </span>
                    {item.fallback_used && (
                      <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-2 py-1 text-yellow-100">
                        fallback used
                      </span>
                    )}
                  </div>
                )}
                <div className="text-sm text-gray-200 whitespace-pre-wrap">{item.content}</div>
              </div>
            ))}
            {loading && <Loader2 className="animate-spin text-cyan-300" />}
          </div>

          <div className="mt-4 flex gap-3">
            <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && askAI()} placeholder="Ask your CRM assistant..." className="flex-1 rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
            <button onClick={() => askAI()} disabled={loading} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 font-black text-black flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              Ask
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
            <div className="flex items-center gap-3 mb-5">
              <Brain className="text-cyan-300" size={22} />
              <h2 className="text-xl font-black">Autonomous Agents</h2>
            </div>
            {agentLoading ? (
              <Loader2 className="animate-spin text-cyan-300" />
            ) : (
              <div className="space-y-3">
                {[
                  ["Hot Leads", agentData?.summary?.hot_leads || 0],
                  ["Follow-ups Due", agentData?.summary?.followups_due || 0],
                  ["Campaigns Reviewed", agentData?.summary?.campaign_count || 0],
                  ["Confidence", `${Math.round((agentData?.confidence || 0) * 100)}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center justify-between">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="font-black text-cyan-300">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-5">
              <Zap className="text-cyan-300" size={20} />
              <h2 className="text-xl font-black">Recommendations</h2>
            </div>
            <div className="space-y-3">
              {(agentData?.recommendations || []).length === 0 && (
                <div className="text-sm text-gray-500">No recommendations yet.</div>
              )}
              {(agentData?.recommendations || []).map((item: any, index: number) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="font-bold text-white">{item.title}</div>
                  <div className="text-sm text-gray-400 mt-1">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
