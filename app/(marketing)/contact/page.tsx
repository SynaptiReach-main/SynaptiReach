"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/sections/Footer";

const inquiryTypes = ["Service consultation", "Support", "Waitlist", "Trial question", "Partnership", "General inquiry"];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    inquiry_type: "Service consultation",
    service: "",
    support_topic: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service") || "";
    const inquiry = params.get("inquiry") || "";
    setForm((current) => ({
      ...current,
      service,
      inquiry_type: inquiry || (service ? "Service consultation" : current.inquiry_type),
    }));
  }, []);

  function update(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_page" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Contact form failed.");
      setStatus(data.emailSetupRequired
        ? "Your message was saved. SynaptiReach email notification needs Resend setup, but the submission is recorded."
        : "Your message was sent. SynaptiReach will respond within 24-48 hours.");
      setForm((current) => ({ ...current, name: "", company: "", email: "", phone: "", message: "", support_topic: "" }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Contact form failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-16 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
          CONTACT SYNAPTIREACH
        </div>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          Talk Through Your
          <span className="block bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
            CRM Growth Plan
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-cyan-50/70">
          Use this form for service consultations, support, launch cohort waitlist questions, provider setup, and trial planning. Service and bundle purchases start with a 30-minute video consultation.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={submit} className="rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur md:p-8">
          {status && <div className="mb-4 rounded-2xl border border-green-400/20 bg-green-500/10 p-4 text-sm text-green-100">{status}</div>}
          {error && <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
          <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Full name" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
            <input value={form.company} onChange={(event) => update("company", event.target.value)} placeholder="Company" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
            <input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="Work email" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
            <input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Phone optional" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
            <select value={form.inquiry_type} onChange={(event) => update("inquiry_type", event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
              {inquiryTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
            <input value={form.service} onChange={(event) => update("service", event.target.value)} placeholder="Service or bundle of interest" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
          </div>
          <input value={form.support_topic} onChange={(event) => update("support_topic", event.target.value)} placeholder="Support topic or setup question" className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
          <textarea required value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us what you want to build, fix, automate, or evaluate." className="mt-4 min-h-[150px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
          <button disabled={loading} className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-6 py-3 font-black text-black disabled:opacity-60">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <aside className="space-y-4">
          {[
            ["Expected response", "Most inquiries receive a response within 24-48 hours."],
            ["Consultation language", "Services, bundles, and retainers require a 30-minute video consultation before purchase."],
            ["Support inquiries", "Include the CRM page, provider, billing state, or workflow you need help with."],
            ["Waitlist inquiries", "Mention your industry, desired plan, urgency, and launch goals."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-5 backdrop-blur">
              <h2 className="font-black text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-cyan-50/65">{body}</p>
            </div>
          ))}
        </aside>
      </section>
      <Footer />
    </main>
  );
}
