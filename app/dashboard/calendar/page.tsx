"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarDays, CheckCircle2, Edit2, Loader2, MessageSquare, Plus, Sparkles, X } from "lucide-react";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";
import SimpleMetricModal, { type SimpleMetricDetail } from "@/components/dashboard/SimpleMetricModal";
import OwnerFocusPanel from "@/components/dashboard/OwnerFocusPanel";

const emptyAppointment = { id: "", title: "", starts_at: "", ends_at: "", location: "", notes: "", status: "scheduled", lead_id: "", deal_id: "" };

function formatDate(value?: string) {
  if (!value) return "No date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [context, setContext] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyAppointment);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<SimpleMetricDetail | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [response, dashboardResponse] = await Promise.all([
        fetch("/api/crm/appointments"),
        fetch("/api/crm/dashboard"),
      ]);
      const json = await response.json();
      const dashboardJson = await dashboardResponse.json().catch(() => ({}));
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to load appointments.");
      setAppointments(json.appointments || json.data || []);
      if (dashboardJson?.success) setContext(dashboardJson.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveAppointment() {
    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/crm/appointments", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to save appointment.");
      await createNotification({
        title: form.id ? "Appointment updated" : "Appointment created",
        message: `${form.title} is ${form.status || "scheduled"}.`,
        type: "appointment",
        priority: "normal",
        record_type: "appointment",
        record_id: json.appointment?.id || form.id || null,
        href: "/dashboard/calendar",
      });
      setSuccess(form.id ? "Appointment updated and notification logged." : "Appointment created and notification logged.");
      setOpen(false);
      setForm(emptyAppointment);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save appointment.");
    } finally {
      setSaving(false);
    }
  }

  async function cancelAppointment(id: string) {
    try {
      setActionLoading(`${id}:cancel`);
      setError("");
      const response = await fetch(`/api/crm/appointments?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to cancel appointment.");
      await createNotification({
        title: "Appointment cancelled",
        message: json.appointment?.title || "An appointment was cancelled.",
        type: "appointment",
        priority: "high",
        record_type: "appointment",
        record_id: id,
        href: "/dashboard/calendar",
      });
      setSuccess("Appointment cancelled and notification logged.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to cancel appointment.");
    } finally {
      setActionLoading("");
    }
  }

  function editAppointment(appointment: any) {
    setForm({
      ...emptyAppointment,
      ...appointment,
      starts_at: appointment.starts_at ? appointment.starts_at.slice(0, 16) : "",
      ends_at: appointment.ends_at ? appointment.ends_at.slice(0, 16) : "",
    });
    setOpen(true);
  }

  async function updateAppointmentStatus(appointment: any, status: string) {
    try {
      setActionLoading(`${appointment.id}:${status}`);
      setError("");
      const response = await fetch("/api/crm/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...appointment, status }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to update appointment.");
      await createNotification({
        title: `Appointment ${status}`,
        message: appointment.title || "Appointment status updated.",
        type: "appointment",
        priority: status === "no_show" ? "high" : "normal",
        record_type: "appointment",
        record_id: appointment.id,
        href: "/dashboard/calendar",
      });
      setSuccess(`Appointment marked ${status}.`);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update appointment.");
    } finally {
      setActionLoading("");
    }
  }

  async function createNotification(payload: any) {
    await fetch("/api/crm/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
  }

  function openAppointmentSuggestion(source: any) {
    const lead = (context?.leads || []).find((item: any) => item.id === source.lead_id);
    setForm({
      ...emptyAppointment,
      title: `Appointment with ${lead?.name || source.recipient || "lead"}`,
      starts_at: "",
      ends_at: "",
      status: "scheduled",
      lead_id: source.lead_id || "",
      deal_id: source.deal_id || "",
      notes: `Review appointment intent from ${source.channel || "communication"}: ${source.content || source.subject || ""}`,
    });
    setOpen(true);
  }

  async function notifyAppointmentSuggestion(source: any) {
    try {
      setActionLoading(`${source.id}:notify`);
      setError("");
      await createNotification({
        title: "Appointment intent detected",
        message: source.content || source.subject || "A lead may be ready to schedule an appointment.",
        type: "appointment_intent",
        priority: "high",
        record_type: "communication",
        record_id: source.id,
        href: "/dashboard/calendar",
      });
      setSuccess("Appointment intent notification created. Review the draft before scheduling.");
      openAppointmentSuggestion(source);
    } finally {
      setActionLoading("");
    }
  }

  async function createReminderNotification(appointment: any) {
    try {
      setActionLoading(`${appointment.id}:reminder`);
      setError("");
      await createNotification({
        title: "Upcoming appointment reminder",
        message: `${appointment.title || "Appointment"} starts ${formatDate(appointment.starts_at)}.`,
        type: "appointment",
        priority: "high",
        record_type: "appointment",
        record_id: appointment.id,
        href: "/dashboard/calendar",
      });
      setSuccess("Reminder notification created.");
    } finally {
      setActionLoading("");
    }
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center text-white"><Loader2 className="animate-spin text-cyan-300" size={34} /></main>;

  const now = Date.now();
  const appointmentIntentSuggestions = (context?.communications || [])
    .filter((item: any) => {
      const text = `${item.subject || ""} ${item.content || ""}`.toLowerCase();
      return (
        (item.direction === "inbound" || item.status === "received") &&
        /(appointment|meeting|book|schedule|available|confirmed|confirm|call|consult)/i.test(text)
      );
    })
    .slice(0, 6);
  const upcomingAppointments = appointments
    .filter((item) => item.status === "scheduled" && item.starts_at && new Date(item.starts_at).getTime() >= now)
    .slice(0, 6);

  return (
    <main className="min-h-screen text-white">
      <QueryRecordFocus keys={["appointmentId"]} />
      <SimpleMetricModal metric={selectedMetric} onClose={() => setSelectedMetric(null)} />
      <section className="mb-8 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
        <div>
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">Real appointments</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Calendar</h1>
          <p className="mt-2 max-w-3xl text-gray-400">Track real CRM appointments and meeting follow-ups. No external calendar sync is enabled yet.</p>
        </div>
        <button onClick={() => { setForm(emptyAppointment); setOpen(true); }} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2"><Plus size={18} /> Add Appointment</button>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {success && <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">{success}</div>}

      <OwnerFocusPanel
        items={[
          {
            label: "Upcoming",
            value: upcomingAppointments.length,
            detail: "Use upcoming appointments to prepare notes and create internal reminders before the meeting.",
            action: "Review schedule",
            tone: upcomingAppointments.length > 0 ? "cyan" : "neutral",
          },
          {
            label: "Booking intent",
            value: appointmentIntentSuggestions.length,
            detail: "Recent communications that mention scheduling are suggestions only until you review and save them.",
            action: "Review appointment drafts",
            tone: appointmentIntentSuggestions.length > 0 ? "yellow" : "green",
          },
          {
            label: "Calendar setup",
            detail: "Internal appointments work now. External calendar sync remains setup-required until connected in Settings.",
            href: "/dashboard/settings#providers",
            action: "Check integrations",
            tone: "neutral",
          },
        ]}
      />

      <MiniBrainInsightPanel
        title="Appointment Intelligence"
        subtitle="No-show risk, meeting prep, appointment intent, and review-gated follow-up signals."
        types={["appointment_intelligence", "communication_intelligence"]}
      />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          ["Upcoming", appointments.filter((item) => item.status === "scheduled" && item.starts_at && new Date(item.starts_at).getTime() >= Date.now()).length, appointments.filter((item) => item.status === "scheduled" && item.starts_at && new Date(item.starts_at).getTime() >= Date.now())],
          ["Completed", appointments.filter((item) => item.status === "completed").length, appointments.filter((item) => item.status === "completed")],
          ["Cancelled", appointments.filter((item) => item.status === "cancelled").length, appointments.filter((item) => item.status === "cancelled")],
          ["No Show", appointments.filter((item) => item.status === "no_show").length, appointments.filter((item) => item.status === "no_show")],
        ].map(([label, value, records]: any) => (
          <button key={label} onClick={() => setSelectedMetric({ title: label, value, records, description: `${label} appointment records from the current workspace.`, href: "/dashboard/calendar" })} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-cyan-500/10">
            <CalendarDays className="mb-4 text-cyan-300" size={20} />
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </button>
        ))}
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
          <div className="mb-5 flex items-center gap-3">
            <Sparkles className="text-cyan-300" size={22} />
            <div>
              <h2 className="text-2xl font-black">Appointment Workflow Suggestions</h2>
              <p className="mt-1 text-sm text-gray-400">Detected from real inbound communications. Suggestions require manual review before scheduling.</p>
            </div>
          </div>
          {appointmentIntentSuggestions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
              No appointment intent found in recent communications.
            </div>
          ) : (
            <div className="space-y-3">
              {appointmentIntentSuggestions.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-white">{item.recipient || item.subject || "Lead communication"}</div>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">{item.channel}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-gray-400">{item.content || item.subject || "Review this communication."}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => notifyAppointmentSuggestion(item)} disabled={Boolean(actionLoading)} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60">
                      {actionLoading === `${item.id}:notify` ? "Creating..." : "Create Notification + Draft"}
                    </button>
                    <button onClick={() => openAppointmentSuggestion(item)} disabled={Boolean(actionLoading)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">Review Draft</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center gap-3">
            <Bell className="text-cyan-300" size={22} />
            <div>
              <h2 className="text-2xl font-black">Upcoming Appointment Notifications</h2>
              <p className="mt-1 text-sm text-gray-400">Create internal reminders. External calendar sync is not enabled.</p>
            </div>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
              No upcoming scheduled appointments.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment: any) => (
                <div key={appointment.id} data-record-id={appointment.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white">{appointment.title}</div>
                      <div className="text-sm text-gray-500">{formatDate(appointment.starts_at)}</div>
                    </div>
                    <button onClick={() => createReminderNotification(appointment)} disabled={Boolean(actionLoading)} className="rounded-xl border border-green-400/20 bg-green-500/10 px-3 py-2 text-xs font-bold text-green-100 disabled:opacity-60">
                      {actionLoading === `${appointment.id}:reminder` ? "Creating..." : "Create Reminder"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4">
        {appointments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">No appointments yet. Add a real appointment when a lead books time.</div>
        ) : appointments.map((appointment) => (
          <div key={appointment.id} data-record-id={appointment.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3"><CalendarDays className="text-cyan-300" size={20} /></div>
              <div>
                <div className="font-black text-lg">{appointment.title}</div>
                <div className="text-sm text-gray-500">{formatDate(appointment.starts_at)} {appointment.location ? `- ${appointment.location}` : ""}</div>
                <div className="mt-2 text-sm text-gray-400">{appointment.notes || "No notes"}</div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {appointment.lead_id && <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">lead linked</span>}
                  {appointment.deal_id && <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">deal linked</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">{appointment.status}</span>
              <button onClick={() => editAppointment(appointment)} disabled={Boolean(actionLoading)} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"><Edit2 size={15} /></button>
              {appointment.status === "scheduled" && (
                <button onClick={() => updateAppointmentStatus(appointment, "completed")} disabled={Boolean(actionLoading)} className="rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-2 text-sm text-green-100 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
                  {actionLoading === `${appointment.id}:completed` ? <Loader2 className="animate-spin" size={15} /> : <CheckCircle2 size={15} />}
                  Complete
                </button>
              )}
              {appointment.status === "scheduled" && <button onClick={() => updateAppointmentStatus(appointment, "no_show")} disabled={Boolean(actionLoading)} className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-100 disabled:cursor-not-allowed disabled:opacity-60">No Show</button>}
              {appointment.status !== "cancelled" && <button onClick={() => cancelAppointment(appointment.id)} disabled={Boolean(actionLoading)} className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-100 disabled:cursor-not-allowed disabled:opacity-60">{actionLoading === `${appointment.id}:cancel` ? "Cancelling..." : "Cancel"}</button>}
            </div>
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-cyan-400/20 bg-[#080808] p-6">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">{form.id ? "Edit Appointment" : "Add Appointment"}</h2><button onClick={() => setOpen(false)} className="rounded-xl border border-white/10 p-2"><X size={18} /></button></div>
            <div className="grid gap-4">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Appointment title" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location or meeting link" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <div className="grid gap-4 md:grid-cols-3">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none">
                  <option value="scheduled">scheduled</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                  <option value="no_show">no_show</option>
                </select>
                <input value={form.lead_id || ""} onChange={(e) => setForm({ ...form, lead_id: e.target.value })} placeholder="Lead ID" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
                <input value={form.deal_id || ""} onChange={(e) => setForm({ ...form, deal_id: e.target.value })} placeholder="Deal ID" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              </div>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="min-h-28 rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
            </div>
            <button disabled={saving || !form.title.trim() || !form.starts_at} onClick={saveAppointment} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save Appointment"}</button>
          </div>
        </div>
      )}
    </main>
  );
}
