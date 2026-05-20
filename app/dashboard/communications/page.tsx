"use client";

import { useEffect, useState } from "react";
import { Bot, Eye, Loader2, Mail, MessageSquare, Phone, Search, Send, Share2, X } from "lucide-react";
import { aiClient } from "@/src/ai/aiClient";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";
import SimpleMetricModal, { type SimpleMetricDetail } from "@/components/dashboard/SimpleMetricModal";

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
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<SimpleMetricDetail | null>(null);
  const [reply, setReply] = useState({ channel: "email", subject: "", content: "" });
  const [replyAiMeta, setReplyAiMeta] = useState<any>(null);
  const [replyAiLoading, setReplyAiLoading] = useState(false);
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
      const [response, dashboardResponse] = await Promise.all([
        fetch(`/api/crm/communications?channel=${channel}&status=${status}`),
        fetch("/api/crm/dashboard"),
      ]);
      const data = await response.json();
      const dashboardData = await dashboardResponse.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to load communications.");
      }

      setCommunications(data.communications || data.data || []);
      if (dashboardData?.success) setLeads(dashboardData.data?.leads || []);
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
      const data = await aiClient.runTask("draft_followup", {
        messages: [
          {
            role: "system",
            content:
              "You are SynaptiReach's communication drafting agent. Draft concise CRM outreach. Return only the message content.",
          },
          {
            role: "user",
            content: `Draft a ${form.channel} message for ${form.recipient || "a CRM lead"}. Goal: ${form.content || "follow up and move the relationship forward"}.`,
          },
        ],
      });

      if (!data.text) {
        throw new Error(data?.error || "AI draft failed.");
      }

      setForm((current) => ({ ...current, content: data.text || "" }));
      setAiMeta({
        provider: data.providerUsed,
        model: data.providerUsed,
        fallback_used: data.fallbackUsed,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "AI draft failed.");
    } finally {
      setAiLoading(false);
    }
  }

  async function draftReplyWithAI() {
    if (!selectedConversation) return;
    try {
      setReplyAiLoading(true);
      setError("");
      const recent = selectedConversation.messages
        .slice(-4)
        .map((message: any) => `${message.direction || "unknown"} ${message.channel}: ${message.content || message.subject || ""}`)
        .join("\n");
      const data = await aiClient.runTask("draft_followup", {
        messages: [
          {
            role: "system",
            content:
              "You are SynaptiReach's communication drafting agent. Draft concise review-ready CRM outreach. Return only the message content.",
          },
          {
            role: "user",
            content: `Draft a ${reply.channel} response for ${selectedConversation.name}. Recent conversation:\n${recent}\nGoal: move the relationship forward without claiming anything not in the CRM.`,
          },
        ],
      });

      if (!data.text) {
        throw new Error(data?.error || "AI reply draft failed.");
      }

      setReply((current) => ({ ...current, content: data.text || "" }));
      setReplyAiMeta({
        provider: data.providerUsed,
        model: data.providerUsed,
        fallback_used: data.fallbackUsed,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "AI reply draft failed.");
    } finally {
      setReplyAiLoading(false);
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

  async function saveConversationReply(status: "draft" | "scheduled" = "draft") {
    if (!selectedConversation) return;
    try {
      setSubmitting(true);
      setError("");
      if (!reply.content.trim()) {
        setError("Enter a reply before saving.");
        return;
      }

      const response = await fetch("/api/crm/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: reply.channel,
          direction: "outbound",
          recipient: selectedConversation.recipient || "",
          subject: reply.subject || selectedConversation.subject || "",
          content: reply.content,
          status,
          lead_id: selectedConversation.lead_id || "",
          campaign_id: selectedConversation.campaign_id || "",
          metadata: {
            conversation_key: selectedConversation.key,
            review_gated: true,
            source: "communications_conversation_drawer",
          },
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to save reply.");
      }

      setReply({ channel: "email", subject: "", content: "" });
      setReplyAiMeta(null);
      await loadData();
      setSelectedConversation(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save reply.");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmSendCommunication(item: any) {
    if (!["email", "sms"].includes(item.channel)) {
      setError("Only email and SMS are supported for confirmed external sending.");
      return;
    }
    const confirmed = window.confirm(
      `Send this ${item.channel.toUpperCase()} to ${item.recipient || "the selected recipient"} now? This external action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await fetch("/api/crm/communications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communication_id: item.id, confirm: true }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to send communication.");
      }
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send communication.");
      await loadData();
    } finally {
      setSubmitting(false);
    }
  }

  const leadById = new Map(leads.map((lead) => [lead.id, lead]));

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

  const conversations = Array.from(
    visibleCommunications.reduce((map, item) => {
      const recipientKey = item.recipient ? String(item.recipient).toLowerCase() : "";
      const key = item.lead_id ? `lead:${item.lead_id}` : recipientKey ? `recipient:${recipientKey}` : `communication:${item.id}`;
      const lead = item.lead_id ? leadById.get(item.lead_id) : null;
      const current = map.get(key) || {
        key,
        lead_id: item.lead_id || null,
        campaign_id: item.campaign_id || null,
        name: lead?.name || item.recipient || item.subject || "Unlinked contact",
        recipient: item.recipient || lead?.email || lead?.phone || "",
        subject: item.subject || "",
        channel: item.channel || "email",
        status: item.status || "draft",
        unread: 0,
        latest_at: item.created_at,
        latest_preview: item.content || item.subject || "",
        messages: [],
      };
      current.messages.push(item);
      current.unread += item.direction === "inbound" || item.status === "received" ? 1 : 0;
      const currentTime = current.latest_at ? new Date(current.latest_at).getTime() : 0;
      const itemTime = item.created_at ? new Date(item.created_at).getTime() : 0;
      if (itemTime >= currentTime) {
        current.latest_at = item.created_at;
        current.latest_preview = item.content || item.subject || "";
        current.channel = item.channel || current.channel;
        current.status = item.status || current.status;
        current.campaign_id = item.campaign_id || current.campaign_id;
      }
      map.set(key, current);
      return map;
    }, new Map<string, any>()).values()
  )
    .map((conversation: any) => ({
      ...conversation,
      messages: conversation.messages.sort(
        (a: any, b: any) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      ),
    }))
    .sort((a: any, b: any) => new Date(b.latest_at || 0).getTime() - new Date(a.latest_at || 0).getTime());

  return (
    <main className="min-h-screen text-white">
      <QueryRecordFocus keys={["conversationId", "communicationId", "leadId"]} />
      <SimpleMetricModal metric={selectedMetric} onClose={() => setSelectedMetric(null)} />
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

      <MiniBrainInsightPanel
        title="Communication Intelligence"
        subtitle="Response urgency, buying signals, appointment intent, safe templates, and readiness checks."
        types={["communication_intelligence", "safety_compliance"]}
      />

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
          const records = communications.filter((communication) => {
            if (item.label === "Total") return true;
            if (item.label === "Email") return communication.channel === "email";
            if (item.label === "SMS") return communication.channel === "sms";
            if (item.label === "Social") return communication.channel === "social";
            if (item.label === "Calls") return communication.channel === "call";
            if (item.label === "Internal") return ["note", "internal"].includes(communication.channel);
            return communication.status === item.label.toLowerCase();
          });
          return (
            <button
              key={item.label}
              onClick={() => setSelectedMetric({
                title: item.label,
                value: item.value,
                records,
                description: `${item.label} communication records from the current workspace filters.`,
                href: "/dashboard/communications",
              })}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-cyan-500/10"
            >
              <Icon className="text-cyan-300 mb-4" size={20} />
              <div className="text-3xl font-black">{item.value}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </button>
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
                  {item.direction === "outbound" && ["draft", "scheduled", "failed"].includes(item.status || "draft") && ["email", "sms"].includes(item.channel) && (
                    <button
                      onClick={() => confirmSendCommunication(item)}
                      disabled={submitting}
                      className="mt-4 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-100 disabled:opacity-60"
                    >
                      Confirm Send
                    </button>
                  )}
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

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Conversation Chains</h2>
            <p className="mt-1 text-sm text-gray-400">
              Grouped from real CRM communication records by lead or recipient. Replies are saved as review-gated drafts.
            </p>
          </div>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">
            {conversations.length} chain{conversations.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-cyan-300" /></div>
        ) : conversations.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
            No conversation chains match the current filters. Save or import real communications to build timelines.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {conversations.map((conversation: any) => (
              <button
                key={conversation.key}
                data-record-id={conversation.key}
                data-conversation-id={conversation.messages[0]?.conversation_id || conversation.messages[0]?.id || conversation.key}
                data-lead-id={conversation.lead_id || undefined}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setReply({
                    channel: ["email", "sms"].includes(conversation.channel) ? conversation.channel : "email",
                    subject: conversation.subject || "",
                    content: "",
                  });
                  setReplyAiMeta(null);
                }}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/[0.04]"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="font-black text-white">{conversation.name}</div>
                  <div className="text-xs text-gray-500">{conversation.latest_at ? new Date(conversation.latest_at).toLocaleString() : ""}</div>
                </div>
                <div className="mb-3 text-sm text-gray-400 line-clamp-2">{conversation.latest_preview || "No preview available."}</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-bold text-cyan-100">{conversation.channel}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">{conversation.status}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-gray-300">{conversation.messages.length} messages</span>
                  {conversation.unread > 0 && <span className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 font-bold text-green-100">{conversation.unread} unread</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm md:items-center">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-[#050505] p-6 shadow-2xl shadow-cyan-500/10">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                  <Eye size={14} />
                  Conversation
                </div>
                <h3 className="text-2xl font-black">{selectedConversation.name}</h3>
                <p className="mt-2 text-sm text-gray-400">
                  {selectedConversation.recipient || "No recipient"} {selectedConversation.lead_id ? "- linked lead" : "- unlinked contact"}
                </p>
              </div>
              <button onClick={() => setSelectedConversation(null)} className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                {selectedConversation.messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl border p-4 ${
                      message.direction === "inbound" || message.status === "received"
                        ? "border-cyan-400/20 bg-cyan-500/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-bold text-white">{message.subject || `${message.channel} message`}</div>
                      <div className="text-xs text-gray-500">{message.created_at ? new Date(message.created_at).toLocaleString() : ""}</div>
                    </div>
                    <div className="mb-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">{message.channel}</span>
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">{message.direction || "outbound"}</span>
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">{message.status || "draft"}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-gray-300">{message.content || ""}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5">
                <h4 className="mb-4 text-lg font-black">Draft Response</h4>
                <div className="space-y-3">
                  <select value={reply.channel} onChange={(event) => setReply({ ...reply, channel: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
                    <option>email</option>
                    <option>sms</option>
                  </select>
                  <input value={reply.subject} onChange={(event) => setReply({ ...reply, subject: event.target.value })} placeholder="Subject" className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                  <textarea value={reply.content} onChange={(event) => setReply({ ...reply, content: event.target.value })} placeholder="Review-gated response draft" className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                  {replyAiMeta && (
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                      Drafted by {replyAiMeta.provider || "AI"} {replyAiMeta.model ? `- ${replyAiMeta.model}` : ""}{replyAiMeta.fallback_used ? " using fallback" : ""}
                    </div>
                  )}
                  <button onClick={draftReplyWithAI} disabled={replyAiLoading || submitting} className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 font-bold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60">
                    {replyAiLoading ? "Drafting..." : "Draft Reply with AI"}
                  </button>
                  <button onClick={() => saveConversationReply("draft")} disabled={submitting || !reply.content.trim()} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 p-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-60">
                    Save Review Draft
                  </button>
                  <button onClick={() => saveConversationReply("scheduled")} disabled={submitting || !reply.content.trim()} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
                    Queue for Review
                  </button>
                  <p className="text-xs text-gray-500">
                    External sending remains review-gated. These actions save real communication records and do not contact the lead automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
