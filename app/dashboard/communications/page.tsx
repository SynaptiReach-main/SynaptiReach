"use client";

import { useEffect, useState } from "react";
import { Bot, Loader2, Mail, MessageSquare, Phone, Search, Send, Share2 } from "lucide-react";

const channels = ["all", "email", "sms", "social", "call", "note", "internal"];
const statuses = ["all", "draft", "scheduled", "sent", "failed", "received"];

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<any[]>([]);
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiMeta, setAiMeta] = useState<any>(null);
  const [form, setForm] = useState({
    channel: "email",
    direction: "outbound",
    recipient: "",
    subject: "",
    content: "",
    status: "draft",
    lead_id: "",
    campaign_id: "",
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
      setAiMeta({
        provider: data.provider,
        model: data.model,
        fallback_used: data.fallback_used,
      });
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
        direction: "outbound",
        recipient: "",
        subject: "",
        content: "",
        status: "draft",
        lead_id: "",
        campaign_id: "",
      });
      setAiMeta(null);
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
    internal: communications.filter((item) => ["note", "internal"].includes(item.channel)).length,
    sent: communications.filter((item) => item.status === "sent").length,
    failed: communications.filter((item) => item.status === "failed").length,
    scheduled: communications.filter((item) => item.status === "scheduled").length,
  };

  const visibleCommunications = communications.filter((item) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return [item.subject, item.recipient, item.content, item.channel, item.status, item.lead_id, item.campaign_id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

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
          { label: "Internal", value: stats.internal, icon: MessageSquare },
          { label: "Sent", value: stats.sent, icon: Send },
          { label: "Failed", value: stats.failed, icon: MessageSquare },
          { label: "Scheduled", value: stats.scheduled, icon: MessageSquare },
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
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <Search className="text-gray-500" size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search communications..." className="bg-transparent outline-none text-sm text-white placeholder:text-gray-600" />
            </div>
            <select value={channel} onChange={(event) => setChannel(event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              {channels.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-cyan-300" /></div>
          ) : visibleCommunications.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
              No communications yet. Save a draft or connect send routes to start logging messages.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleCommunications.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="font-bold text-white">{item.subject || item.recipient || `${item.channel} communication`}</div>
                    <div className="text-xs text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{item.channel} - {item.status || "draft"} - {item.recipient || "No recipient"}</div>
                  <div className="text-sm text-gray-300">{item.content || ""}</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {item.lead_id && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">lead linked</span>}
                    {item.campaign_id && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">campaign linked</span>}
                    {item.direction && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">{item.direction}</span>}
                  </div>
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
              <option>note</option>
              <option>internal</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.direction} onChange={(event) => setForm({ ...form, direction: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
                <option>outbound</option>
                <option>inbound</option>
                <option>internal</option>
              </select>
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
                <option>draft</option>
                <option>scheduled</option>
                <option>sent</option>
                <option>failed</option>
                <option>received</option>
              </select>
            </div>
            <input value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} placeholder="Recipient" className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Subject" className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.lead_id} onChange={(event) => setForm({ ...form, lead_id: event.target.value })} placeholder="Lead ID" className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
              <input value={form.campaign_id} onChange={(event) => setForm({ ...form, campaign_id: event.target.value })} placeholder="Campaign ID" className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            </div>
            <textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Message" className="w-full min-h-[180px] rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            {aiMeta && (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                Drafted by {aiMeta.provider || "AI"} {aiMeta.model ? `- ${aiMeta.model}` : ""}{aiMeta.fallback_used ? " using fallback" : ""}
              </div>
            )}
            <button onClick={draftWithAI} disabled={aiLoading || submitting} className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 font-bold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60">
              {aiLoading ? "Drafting..." : "Draft with AI"}
            </button>
            <button onClick={saveCommunication} disabled={submitting || aiLoading || !form.content.trim()} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 p-3 font-black text-black flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              Save Communication
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
