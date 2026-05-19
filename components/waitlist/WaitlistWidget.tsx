"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const serviceOptions = ["Launch System", "Growth Engine", "Automation System", "Authority Builder", "Conversion Engine", "Growth Ops"];

export default function WaitlistWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    business_name: "",
    work_email: "",
    phone: "",
    industry: "",
    website_url: "",
    business_size: "",
    desired_plan: "Growth Managed",
    billing_preference: "SynaptiReach managed",
    main_goal: "",
    urgency: "Launch cohort",
    services_interested: [] as string[],
    consent_to_contact: false,
    website: "",
  });

  function update(key: string, value: any) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "global_public_waitlist" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Waitlist signup failed.");
      setStatus(data.duplicate
        ? `You are already on the waitlist at position ${data.signup?.waitlist_position || "recorded"}.`
        : `You are on the waitlist at position ${data.signup?.waitlist_position || "recorded"}.`);
      setForm((current) => ({ ...current, full_name: "", business_name: "", work_email: "", phone: "", main_goal: "", consent_to_contact: false }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Waitlist signup failed.");
    } finally {
      setLoading(false);
    }
  }

  if (pathname.startsWith("/demo") || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <section className="relative z-10 mx-auto mt-10 max-w-6xl px-5">
      <div className="rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-5 text-white shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Launch Cohort</div>
            <h2 className="mt-2 text-2xl font-black">We are opening the first launch cohort to 5 businesses.</h2>
            <p className="mt-2 text-sm text-cyan-50/65">Join the waitlist to be considered for the June 1 launch window.</p>
          </div>
          <button onClick={() => setOpen((value) => !value)} className="rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-3 font-black text-black">
            {open ? "Close Waitlist" : "Join Waitlist"}
          </button>
        </div>
        {open && (
          <form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-2">
            {status && <div className="md:col-span-2 rounded-2xl border border-green-400/20 bg-green-500/10 p-3 text-sm text-green-100">{status}</div>}
            {error && <div className="md:col-span-2 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}
            <input className="hidden" value={form.website} onChange={(event) => update("website", event.target.value)} tabIndex={-1} autoComplete="off" />
            <input required value={form.full_name} onChange={(event) => update("full_name", event.target.value)} placeholder="Full name" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <input value={form.business_name} onChange={(event) => update("business_name", event.target.value)} placeholder="Business name" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <input required type="email" value={form.work_email} onChange={(event) => update("work_email", event.target.value)} placeholder="Work email" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Phone optional" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <input value={form.industry} onChange={(event) => update("industry", event.target.value)} placeholder="Industry" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <input value={form.website_url} onChange={(event) => update("website_url", event.target.value)} placeholder="Website optional" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
            <select value={form.business_size} onChange={(event) => update("business_size", event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              <option value="">Business size</option>
              <option>Solo</option>
              <option>2-10</option>
              <option>11-50</option>
              <option>51+</option>
            </select>
            <select value={form.desired_plan} onChange={(event) => update("desired_plan", event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              <option>Basic BYOK</option>
              <option>Growth BYOK</option>
              <option>Premium BYOK</option>
              <option>Basic Managed</option>
              <option>Growth Managed</option>
              <option>Premium Managed</option>
            </select>
            <select value={form.billing_preference} onChange={(event) => update("billing_preference", event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              <option>SynaptiReach managed</option>
              <option>BYOK</option>
              <option>Not sure yet</option>
            </select>
            <select value={form.urgency} onChange={(event) => update("urgency", event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
              <option>Launch cohort</option>
              <option>This month</option>
              <option>Next quarter</option>
              <option>Researching</option>
            </select>
            <textarea value={form.main_goal} onChange={(event) => update("main_goal", event.target.value)} placeholder="Main goal" className="min-h-[96px] rounded-2xl border border-white/10 bg-black/30 p-3 text-white md:col-span-2" />
            <div className="md:col-span-2 flex flex-wrap gap-2">
              {serviceOptions.map((service) => (
                <button
                  type="button"
                  key={service}
                  onClick={() => update("services_interested", form.services_interested.includes(service) ? form.services_interested.filter((item) => item !== service) : [...form.services_interested, service])}
                  className={`rounded-full border px-3 py-2 text-xs ${form.services_interested.includes(service) ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-black/20 text-cyan-50/60"}`}
                >
                  {service}
                </button>
              ))}
            </div>
            <label className="md:col-span-2 flex items-center gap-2 text-sm text-cyan-50/70">
              <input type="checkbox" checked={form.consent_to_contact} onChange={(event) => update("consent_to_contact", event.target.checked)} />
              I consent to be contacted about SynaptiReach launch cohort availability.
            </label>
            <button disabled={loading} className="rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-3 font-black text-black disabled:opacity-60 md:col-span-2">
              {loading ? "Joining..." : "Join the Waitlist"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
