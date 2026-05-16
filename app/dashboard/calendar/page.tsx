"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Edit2, Loader2, Plus, X } from "lucide-react";

const emptyAppointment = { id: "", title: "", starts_at: "", ends_at: "", location: "", notes: "", status: "scheduled", lead_id: "", deal_id: "" };

function formatDate(value?: string) {
  if (!value) return "No date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyAppointment);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/crm/appointments");
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to load appointments.");
      setAppointments(json.appointments || json.data || []);
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
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update appointment.");
    } finally {
      setActionLoading("");
    }
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center text-white"><Loader2 className="animate-spin text-cyan-300" size={34} /></main>;

  return (
    <main className="min-h-screen text-white">
      <section className="mb-8 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
        <div>
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">Real appointments</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Calendar</h1>
          <p className="mt-2 max-w-3xl text-gray-400">Track real CRM appointments and meeting follow-ups. No external calendar sync is enabled yet.</p>
        </div>
        <button onClick={() => { setForm(emptyAppointment); setOpen(true); }} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2"><Plus size={18} /> Add Appointment</button>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          ["Upcoming", appointments.filter((item) => item.status === "scheduled" && item.starts_at && new Date(item.starts_at).getTime() >= Date.now()).length],
          ["Completed", appointments.filter((item) => item.status === "completed").length],
          ["Cancelled", appointments.filter((item) => item.status === "cancelled").length],
          ["No Show", appointments.filter((item) => item.status === "no_show").length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <CalendarDays className="mb-4 text-cyan-300" size={20} />
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4">
        {appointments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">No appointments yet. Add a real appointment when a lead books time.</div>
        ) : appointments.map((appointment) => (
          <div key={appointment.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
