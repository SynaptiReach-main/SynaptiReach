"use client";

import { useEffect, useState } from "react";
import { Bot, Loader2, Mail, MessageSquare, Phone, Send, Share2 } from "lucide-react";

const channels = ["all", "email", "sms", "social", "call"];
const statuses = ["all", "draft", "sent", "failed", "scheduled"];

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<any[]>([]);
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    channel: "email",
    recipient: "",
    subject: "",
    content: "",
    status: "draft",
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `/api/crm/communications?channel=${channel}&status=${status}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to load communications.");
      }

      setCommunications(data.communications || data.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load communications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [channel, status]);

  async function draftWithAI() {
    try {
      setAiLoading(true);
      setError("");
      const response = await fetch("/api/marketing/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Draft a ${form.channel} message for ${form.recipient || "a CRM lead"}. Goal: ${form.content || "follow up and move the relationship forward"}.`,
          system:
            "You are SynaptiReach's communication drafting agent. Draft concise CRM outreach. Return only the message content.",
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "AI draft failed.");
      }

      setForm((current) => ({ ...current, content: data.text || "" }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "AI draft failed.");
    } finally {
      setAiLoading(false);
    }
  }

  async function saveCommunication() {
    try {
      setSubmitting(true);
      setError("");

      if (!form.content.trim()) {
        setError("Enter message content before saving.");
        return;
      }

      const response = await fetch("/api/crm/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to save communication.");
      }

      setForm({
        channel: "email",
        recipient: "",
        subject: "",
        content: "",
        status: "draft",
      });
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save communication.");
    } finally {
      setSubmitting(false);
    }
  }

  const stats = {
    total: communications.length,
    email: communications.filter((item) => item.channel === "email").length,
    sms: communications.filter((item) => item.channel === "sms").length,
    social: communications.filter((item) => item.channel === "social").length,
    call: communications.filter((item) => item.channel === "call").length,
  };

  return (
    <main className="min-h-screen text-white">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs mb-4">
          <MessageSquare size={14} />
          Communications Hub
        </div>
        <h1 className="text-5xl font-black mb-4 leading-tight">
          Customer
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            {" "}Communications
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Real CRM communication logs, AI drafts, and outbound message records.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, icon: MessageSquare },
          { label: "Email", value: stats.email, icon: Mail },
          { label: "SMS", value: stats.sms, icon: Phone },
          { label: "Social", value: stats.social, icon: Share2 },
          { label: "Calls", value: stats.call, icon: Phone },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <Icon className="text-cyan-300 mb-4" size={20} />
              <div className="text-3xl font-black">{item.value}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          );
        })}
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap gap-3 mb-5">
            <select value={channel} onChange={(event) => setChannel(event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              {channels.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-cyan-300" /></div>
          ) : communications.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
              No communications yet. Save a draft or connect send routes to start logging messages.
            </div>
          ) : (
            <div className="space-y-3">
              {communications.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="font-bold text-white">{item.subject || item.recipient || `${item.channel} communication`}</div>
                    <div className="text-xs text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{item.channel} - {item.status || "draft"} - {item.recipient || "No recipient"}</div>
                  <div className="text-sm text-gray-300">{item.content || ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bot className="text-cyan-300" size={20} />
            <h2 className="text-xl font-black">Compose</h2>
          </div>
          <div className="space-y-3">
            <select value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              <option>email</option>
              <option>sms</option>
              <option>social</option>
              <option>call</option>
            </select>
            <input value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} placeholder="Recipient" className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Subject" className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Message" className="w-full min-h-[180px] rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <button onClick={draftWithAI} disabled={aiLoading} className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 font-bold text-cyan-100">
              {aiLoading ? "Drafting..." : "Draft with AI"}
            </button>
            <button onClick={saveCommunication} disabled={submitting} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 p-3 font-black text-black flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              Save Communication
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
