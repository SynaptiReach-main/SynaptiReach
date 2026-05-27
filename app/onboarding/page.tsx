"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  FileUp,
  Gauge,
  Loader2,
  Lock,
  Mail,
  Rocket,
  ShieldCheck,
  Upload,
  UserPlus,
  Users,
  Wand2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";

type WizardData = {
  businessType: string;
  businessProfile: {
    businessName: string;
    industry: string;
    website: string;
    contactEmail: string;
    phone: string;
    address: string;
    timezone: string;
    teamSize: string;
    productsServices: string;
    audience: string;
  };
  plan: {
    planSlug: string;
    billingIntent: "start_trial" | "checkout_now" | "continue_later" | "checkout_started";
  };
  ai: {
    mode: "managed" | "byok" | "local" | "";
    provider: string;
    model: string;
    openaiKey: string;
    geminiKey: string;
    openrouterKey: string;
    anthropicKey: string;
    brandVoice: string;
    tone: string;
  };
  integrations: {
    emailMode: "managed" | "byok" | "skip" | "";
    senderEmail: string;
    resendApiKey: string;
    smsMode: "managed" | "byok" | "skip" | "";
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioFromNumber: string;
    socialMode: "connect" | "skip" | "";
    socialChannels: string[];
    ayrshareApiKey: string;
    calendarMode: "connect" | "skip" | "";
  };
  leads: {
    setupMode: "csv" | "manual" | "skip" | "";
    starterLead: {
      name: string;
      email: string;
      phone: string;
      company: string;
      notes: string;
    };
  };
  staff: {
    setupMode: "invite" | "solo" | "";
    members: Array<{ name: string; email: string; phone: string; title: string }>;
  };
  automation: {
    requireApproval: boolean;
    allowAutoAssign: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    smsComplianceAck: boolean;
    noAutoSendAck: boolean;
  };
};

const initialData: WizardData = {
  businessType: "",
  businessProfile: {
    businessName: "",
    industry: "",
    website: "",
    contactEmail: "",
    phone: "",
    address: "",
    timezone: "America/Chicago",
    teamSize: "",
    productsServices: "",
    audience: "",
  },
  plan: {
    planSlug: "growth-managed",
    billingIntent: "continue_later",
  },
  ai: {
    mode: "",
    provider: "",
    model: "",
    openaiKey: "",
    geminiKey: "",
    openrouterKey: "",
    anthropicKey: "",
    brandVoice: "",
    tone: "professional",
  },
  integrations: {
    emailMode: "",
    senderEmail: "",
    resendApiKey: "",
    smsMode: "",
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioFromNumber: "",
    socialMode: "",
    socialChannels: [],
    ayrshareApiKey: "",
    calendarMode: "",
  },
  leads: {
    setupMode: "",
    starterLead: {
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },
  },
  staff: {
    setupMode: "",
    members: [{ name: "", email: "", phone: "", title: "" }],
  },
  automation: {
    requireApproval: true,
    allowAutoAssign: false,
    quietHoursEnabled: true,
    quietHoursStart: "20:00",
    quietHoursEnd: "08:00",
    smsComplianceAck: false,
    noAutoSendAck: false,
  },
};

const steps = [
  { id: "welcome", label: "Welcome", icon: Rocket },
  { id: "profile", label: "Profile", icon: Building2 },
  { id: "plan", label: "Plan", icon: CreditCard },
  { id: "billing", label: "Billing", icon: Lock },
  { id: "ai", label: "AI Mode", icon: Bot },
  { id: "integrations", label: "Integrations", icon: Mail },
  { id: "leads", label: "Leads", icon: Upload },
  { id: "staff", label: "Staff", icon: UserPlus },
  { id: "safety", label: "Safety", icon: ShieldCheck },
  { id: "launch", label: "Launch", icon: Gauge },
];

const businessTypes = [
  ["service", "Service business", "Appointments, estimates, follow-up, reviews, and recurring work."],
  ["professional", "Professional services", "Pipeline, consultations, documents, billing checkpoints, and client communication."],
  ["local", "Local business", "Lead capture, reputation, repeat visits, offers, and customer messaging."],
  ["hybrid", "Hybrid operation", "Sales pipeline, projects, customer support, campaigns, and automation."],
];

const industries = [
  "HVAC",
  "Roofing",
  "Plumbing",
  "Electrical",
  "Healthcare",
  "Dental",
  "Legal",
  "Real Estate",
  "Insurance",
  "Financial Services",
  "Agency",
  "Marketing",
  "Consulting",
  "Ecommerce",
  "Restaurant",
  "Fitness",
  "Automotive",
  "Home Services",
  "Other",
];

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(text: string) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must include a header row and at least one lead row.");
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce((row: Record<string, string>, header, index) => {
      row[header] = cells[index] || "";
      return row;
    }, {});
  });
}

function textValue(value: any) {
  return typeof value === "string" ? value : "";
}

function mergePayload(payload: any): WizardData {
  return {
    ...initialData,
    ...(payload || {}),
    businessProfile: { ...initialData.businessProfile, ...(payload?.businessProfile || {}) },
    plan: { ...initialData.plan, ...(payload?.plan || {}) },
    ai: { ...initialData.ai, ...(payload?.ai || {}), openaiKey: "", geminiKey: "", openrouterKey: "", anthropicKey: "" },
    integrations: {
      ...initialData.integrations,
      ...(payload?.integrations || {}),
      resendApiKey: "",
      twilioAuthToken: "",
      twilioAccountSid: "",
      ayrshareApiKey: "",
    },
    leads: {
      ...initialData.leads,
      ...(payload?.leads || {}),
      starterLead: { ...initialData.leads.starterLead, ...(payload?.leads?.starterLead || {}) },
    },
    staff: {
      ...initialData.staff,
      ...(payload?.staff || {}),
      members: Array.isArray(payload?.staff?.members) && payload.staff.members.length > 0 ? payload.staff.members : initialData.staff.members,
    },
    automation: { ...initialData.automation, ...(payload?.automation || {}) },
  };
}

function inputClass() {
  return "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/70";
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-cyan-100/60">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "complete"
      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
      : status === "pending"
        ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-100"
        : status === "skipped"
          ? "border-white/15 bg-white/5 text-slate-300"
          : "border-red-300/25 bg-red-500/10 text-red-100";

  return <span className={`rounded-full border px-2 py-1 text-[11px] font-bold uppercase ${styles}`}>{status}</span>;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);
  const [sessionToken, setSessionToken] = useState("");
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<any>({});
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  const step = steps[activeStep];
  const selectedPlan = useMemo(
    () => SUBSCRIPTION_PLANS.find((plan) => plan.slug === data.plan.planSlug),
    [data.plan.planSlug]
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/signup");
        return;
      }

      setSessionToken(session.access_token);

      const response = await fetch("/api/onboarding/save", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Could not load onboarding state.");
        setLoading(false);
        return;
      }

      if (result.payload) {
        setData(mergePayload(result.payload));
      } else {
        const storedType = localStorage.getItem("synaptireach_business_type");
        if (storedType) setData((current) => ({ ...current, businessType: storedType }));
      }
      setWorkspaceId(result.workspace?.id || null);
      setReadiness(result.readiness || null);
      setSnapshot(result.snapshot || {});
      setCompletedSteps(result.session?.metadata?.completed_steps || []);
      setSkippedSteps(result.session?.metadata?.skipped_steps || {});
      setLoading(false);
    }

    load();
  }, [router]);

  function updateSection<K extends keyof WizardData>(section: K, patch: Partial<WizardData[K]>) {
    setData((current) => ({
      ...current,
      [section]: {
        ...(current[section] as any),
        ...patch,
      },
    }));
  }

  function updateNested<K extends keyof WizardData, T extends keyof WizardData[K]>(section: K, key: T, value: WizardData[K][T]) {
    setData((current) => ({
      ...current,
      [section]: {
        ...(current[section] as any),
        [key]: value,
      },
    }));
  }

  async function save(options: { silent?: boolean; complete?: boolean; includeCsv?: boolean } = {}) {
    if (!sessionToken) return null;
    setSaving(true);
    setError("");
    if (!options.silent) setMessage("");

    const nextCompleted = Array.from(new Set([...completedSteps, step.id]));

    const response = await fetch(options.complete ? "/api/onboarding/complete" : "/api/onboarding/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        payload: data,
        completedSteps: nextCompleted,
        skippedSteps,
        currentStep: step.id,
        complete: Boolean(options.complete),
        leadRows: options.includeCsv ? csvRows : [],
        importFileName: options.includeCsv ? csvFileName : null,
      }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok || !result.success) {
      setError(result.error || "Onboarding save failed.");
      return null;
    }

    setWorkspaceId(result.workspace?.id || workspaceId);
    setReadiness(result.readiness || readiness);
    setSnapshot(result.snapshot || snapshot);
    setCompletedSteps(nextCompleted);
    setData((current) => ({
      ...current,
      ai: { ...current.ai, openaiKey: "", geminiKey: "", openrouterKey: "", anthropicKey: "" },
      integrations: { ...current.integrations, resendApiKey: "", twilioAuthToken: "", twilioAccountSid: "", ayrshareApiKey: "" },
    }));
    if (!options.silent) {
      setMessage(options.includeCsv && result.importResult ? `Saved. Imported ${result.importResult.imported_count} lead record(s).` : "Onboarding progress saved.");
    }
    return result;
  }

  async function next() {
    const result = await save({ silent: true });
    if (result) setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function skipCurrent() {
    setSkippedSteps((current) => ({ ...current, [step.id]: true }));
    next();
  }

  async function handleCsv(file?: File | null) {
    try {
      if (!file) return;
      const rows = parseCsv(await file.text());
      setCsvRows(rows);
      setCsvFileName(file.name);
      updateNested("leads", "setupMode", "csv");
      setMessage(`${rows.length} CSV row(s) ready to import. Use Import CSV to write them to the CRM.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse CSV.");
    }
  }

  async function startCheckout() {
    const saved = await save({ silent: true });
    if (!saved) return;
    setCheckoutBusy(true);
    setError("");
    const response = await fetch("/api/billing/subscription/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        plan: data.plan.planSlug,
        workspace_id: saved.workspace?.id || workspaceId,
        email: snapshot?.settings?.contact_email || data.businessProfile.contactEmail,
        name: data.businessProfile.businessName,
      }),
    });
    const result = await response.json();
    setCheckoutBusy(false);

    if (result.checkoutUrl) {
      updateSection("plan", { billingIntent: "checkout_started" });
      window.location.href = result.checkoutUrl;
      return;
    }

    setReadiness(result.readiness || readiness);
    setError(result.error || "Checkout is not ready yet. Billing can be completed later from Settings.");
  }

  async function activate() {
    const result = await save({ complete: true });
    if (result) router.push("/dashboard");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-white/[0.04] px-5 py-4">
          <Loader2 className="animate-spin text-cyan-200" size={18} />
          Loading onboarding state
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(74,222,128,0.10),transparent_30%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_1fr_320px]">
        <aside className="rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-4 backdrop-blur-xl">
          <div className="mb-5">
            <div className="text-2xl font-black tracking-tight">
              Synapti<span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">Reach</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">First-run CRM workspace setup</p>
          </div>

          <div className="space-y-1">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeStep;
              const done = completedSteps.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                    active ? "border border-cyan-300/30 bg-cyan-300/10 text-cyan-50" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${done ? "bg-cyan-300/15 text-cyan-100" : "bg-white/[0.04]"}`}>
                    {done ? <Check size={16} /> : <Icon size={16} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-400">
            Save/resume is backed by the real workspace onboarding session. Secrets are stored server-side only when submitted.
          </div>
        </aside>

        <section className="rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-5 backdrop-blur-xl md:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/70">Step {activeStep + 1} of {steps.length}</div>
              <h1 className="mt-2 text-2xl font-black md:text-3xl">{step.label}</h1>
              <p className="mt-1 text-sm text-slate-400">
                Prepare the CRM with real workspace state. Anything skipped remains visible as pending setup.
              </p>
            </div>
            <button
              type="button"
              onClick={() => save()}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-50 disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
              Save
            </button>
          </div>

          {error ? (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
              <AlertTriangle className="mt-0.5 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          ) : null}
          {message ? (
            <div className="mb-5 rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-50">{message}</div>
          ) : null}

          {step.id === "welcome" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h2 className="text-xl font-black">Choose the operating model</h2>
                <p className="mt-2 text-sm text-slate-400">
                  This only tunes setup defaults and readiness guidance. It does not create simulated CRM records.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {businessTypes.map(([id, label, description]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setData((current) => ({ ...current, businessType: id }))}
                    className={`rounded-2xl border p-4 text-left transition ${
                      data.businessType === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25"
                    }`}
                  >
                    <div className="font-black">{label}</div>
                    <p className="mt-2 text-sm text-slate-400">{description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step.id === "profile" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Business name">
                <input className={inputClass()} value={data.businessProfile.businessName} onChange={(event) => updateSection("businessProfile", { businessName: event.target.value })} />
              </Field>
              <Field label="Industry">
                <select className={inputClass()} value={data.businessProfile.industry} onChange={(event) => updateSection("businessProfile", { industry: event.target.value })}>
                  <option value="">Select industry</option>
                  {industries.map((industry) => <option key={industry}>{industry}</option>)}
                </select>
              </Field>
              <Field label="Contact email">
                <input className={inputClass()} value={data.businessProfile.contactEmail} onChange={(event) => updateSection("businessProfile", { contactEmail: event.target.value })} type="email" />
              </Field>
              <Field label="Phone">
                <input className={inputClass()} value={data.businessProfile.phone} onChange={(event) => updateSection("businessProfile", { phone: event.target.value })} />
              </Field>
              <Field label="Website">
                <input className={inputClass()} value={data.businessProfile.website} onChange={(event) => updateSection("businessProfile", { website: event.target.value })} />
              </Field>
              <Field label="Team size">
                <input className={inputClass()} value={data.businessProfile.teamSize} onChange={(event) => updateSection("businessProfile", { teamSize: event.target.value })} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Address">
                  <input className={inputClass()} value={data.businessProfile.address} onChange={(event) => updateSection("businessProfile", { address: event.target.value })} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Products and services">
                  <textarea className={inputClass()} rows={3} value={data.businessProfile.productsServices} onChange={(event) => updateSection("businessProfile", { productsServices: event.target.value })} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Primary audience">
                  <textarea className={inputClass()} rows={3} value={data.businessProfile.audience} onChange={(event) => updateSection("businessProfile", { audience: event.target.value })} />
                </Field>
              </div>
            </div>
          ) : null}

          {step.id === "plan" ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <button
                    key={plan.slug}
                    type="button"
                    onClick={() => updateSection("plan", { planSlug: plan.slug })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      data.plan.planSlug === plan.slug ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black">{plan.name}</div>
                        <div className="mt-1 text-sm font-bold text-cyan-100">{plan.price}</div>
                      </div>
                      {plan.popular ? <span className="rounded-full border border-cyan-300/30 px-2 py-1 text-[10px] font-black text-cyan-100">POPULAR</span> : null}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{plan.contacts} contacts, {plan.aiActions} AI actions, {plan.workflowRuns} workflows.</p>
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-black">Selected: {selectedPlan?.name || "None"}</div>
                <p className="mt-1 text-sm text-slate-400">
                  Onboarding stores this as plan intent. It does not mark the workspace paid or subscribed.
                </p>
              </div>
            </div>
          ) : null}

          {step.id === "billing" ? (
            <div className="space-y-4">
              {[
                ["start_trial", "Start 14-day trial through Stripe", "Creates a Stripe Checkout session when you press Continue to Checkout."],
                ["checkout_now", "Set up billing now", "Use Stripe Checkout for secure payment setup. No card data touches SynaptiReach."],
                ["continue_later", "Continue without billing", "Marks billing as setup required so Settings and readiness stay honest."],
              ].map(([id, label, description]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => updateSection("plan", { billingIntent: id as any })}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    data.plan.billingIntent === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25"
                  }`}
                >
                  <div className="font-black">{label}</div>
                  <p className="mt-1 text-sm text-slate-400">{description}</p>
                </button>
              ))}
              <button
                type="button"
                onClick={startCheckout}
                disabled={checkoutBusy || data.plan.billingIntent === "continue_later"}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-3 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutBusy ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                Continue to Stripe Checkout
              </button>
            </div>
          ) : null}

          {step.id === "ai" ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["managed", "SynaptiReach Managed", "Use platform-managed AI capacity when available."],
                  ["byok", "Bring Your Own Keys", "Store provider keys encrypted server-side."],
                  ["local", "Local Connector", "Optional future connector; does not block CRM launch."],
                ].map(([id, label, description]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateSection("ai", { mode: id as any })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      data.ai.mode === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25"
                    }`}
                  >
                    <div className="font-black">{label}</div>
                    <p className="mt-1 text-sm text-slate-400">{description}</p>
                  </button>
                ))}
              </div>
              {data.ai.mode === "byok" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Provider">
                    <select className={inputClass()} value={data.ai.provider} onChange={(event) => updateSection("ai", { provider: event.target.value })}>
                      <option value="">Select provider</option>
                      <option value="openai">OpenAI</option>
                      <option value="gemini">Gemini</option>
                      <option value="openrouter">OpenRouter</option>
                      <option value="anthropic">Anthropic</option>
                    </select>
                  </Field>
                  <Field label="Model">
                    <input className={inputClass()} value={data.ai.model} onChange={(event) => updateSection("ai", { model: event.target.value })} />
                  </Field>
                  <Field label="OpenAI key">
                    <input className={inputClass()} type="password" value={data.ai.openaiKey} onChange={(event) => updateSection("ai", { openaiKey: event.target.value })} />
                  </Field>
                  <Field label="Gemini key">
                    <input className={inputClass()} type="password" value={data.ai.geminiKey} onChange={(event) => updateSection("ai", { geminiKey: event.target.value })} />
                  </Field>
                  <Field label="OpenRouter key">
                    <input className={inputClass()} type="password" value={data.ai.openrouterKey} onChange={(event) => updateSection("ai", { openrouterKey: event.target.value })} />
                  </Field>
                  <Field label="Anthropic key">
                    <input className={inputClass()} type="password" value={data.ai.anthropicKey} onChange={(event) => updateSection("ai", { anthropicKey: event.target.value })} />
                  </Field>
                </div>
              ) : null}
              <Field label="Brand voice">
                <textarea className={inputClass()} rows={3} value={data.ai.brandVoice} onChange={(event) => updateSection("ai", { brandVoice: event.target.value })} />
              </Field>
            </div>
          ) : null}

          {step.id === "integrations" ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="font-black">Email</h2>
                <select className={inputClass()} value={data.integrations.emailMode} onChange={(event) => updateSection("integrations", { emailMode: event.target.value as any })}>
                  <option value="">Choose email setup</option>
                  <option value="managed">Managed email, verify domain later</option>
                  <option value="byok">Use my Resend key</option>
                  <option value="skip">Skip for now</option>
                </select>
                <input className={inputClass()} placeholder="Sender email" value={data.integrations.senderEmail} onChange={(event) => updateSection("integrations", { senderEmail: event.target.value })} />
                {data.integrations.emailMode === "byok" ? <input className={inputClass()} type="password" placeholder="Resend API key" value={data.integrations.resendApiKey} onChange={(event) => updateSection("integrations", { resendApiKey: event.target.value })} /> : null}
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="font-black">SMS</h2>
                <select className={inputClass()} value={data.integrations.smsMode} onChange={(event) => updateSection("integrations", { smsMode: event.target.value as any })}>
                  <option value="">Choose SMS setup</option>
                  <option value="managed">Managed SMS, compliance review required</option>
                  <option value="byok">Use my Twilio account</option>
                  <option value="skip">Skip for now</option>
                </select>
                {data.integrations.smsMode === "byok" ? (
                  <>
                    <input className={inputClass()} placeholder="Twilio Account SID" value={data.integrations.twilioAccountSid} onChange={(event) => updateSection("integrations", { twilioAccountSid: event.target.value })} />
                    <input className={inputClass()} type="password" placeholder="Twilio Auth Token" value={data.integrations.twilioAuthToken} onChange={(event) => updateSection("integrations", { twilioAuthToken: event.target.value })} />
                    <input className={inputClass()} placeholder="Twilio From Number" value={data.integrations.twilioFromNumber} onChange={(event) => updateSection("integrations", { twilioFromNumber: event.target.value })} />
                  </>
                ) : null}
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="font-black">Social</h2>
                <select className={inputClass()} value={data.integrations.socialMode} onChange={(event) => updateSection("integrations", { socialMode: event.target.value as any })}>
                  <option value="">Choose social setup</option>
                  <option value="connect">Prepare social connection</option>
                  <option value="skip">Skip for now</option>
                </select>
                <input className={inputClass()} type="password" placeholder="Ayrshare key, optional" value={data.integrations.ayrshareApiKey} onChange={(event) => updateSection("integrations", { ayrshareApiKey: event.target.value })} />
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="font-black">Calendar</h2>
                <select className={inputClass()} value={data.integrations.calendarMode} onChange={(event) => updateSection("integrations", { calendarMode: event.target.value as any })}>
                  <option value="">Choose calendar setup</option>
                  <option value="connect">Prepare Google Calendar connection</option>
                  <option value="skip">Skip for now</option>
                </select>
                <p className="text-sm text-slate-400">OAuth connection is completed later from provider settings.</p>
              </div>
            </div>
          ) : null}

          {step.id === "leads" ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["csv", "Import CSV"],
                  ["manual", "Create starter lead"],
                  ["skip", "Start empty"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateNested("leads", "setupMode", id as any)}
                    className={`rounded-2xl border p-4 text-left font-black ${
                      data.leads.setupMode === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {data.leads.setupMode === "csv" ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-4">
                    <FileUp className="text-cyan-200" />
                    <span className="text-sm">{csvFileName || "Choose CSV file"}</span>
                    <input type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => handleCsv(event.target.files?.[0])} />
                  </label>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-400">
                    <span>{csvRows.length} row(s) parsed</span>
                    <button type="button" onClick={() => save({ includeCsv: true })} disabled={csvRows.length === 0 || saving} className="rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-2 font-black text-black disabled:opacity-50">
                      Import CSV
                    </button>
                  </div>
                </div>
              ) : null}
              {data.leads.setupMode === "manual" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {(["name", "email", "phone", "company"] as const).map((key) => (
                    <Field key={key} label={`Starter lead ${key}`}>
                      <input className={inputClass()} value={textValue(data.leads.starterLead[key])} onChange={(event) => updateSection("leads", { starterLead: { ...data.leads.starterLead, [key]: event.target.value } })} />
                    </Field>
                  ))}
                  <div className="md:col-span-2">
                    <Field label="Notes">
                      <textarea className={inputClass()} rows={3} value={data.leads.starterLead.notes} onChange={(event) => updateSection("leads", { starterLead: { ...data.leads.starterLead, notes: event.target.value } })} />
                    </Field>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step.id === "staff" ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["invite", "Invite staff later"],
                  ["solo", "Solo workspace for now"],
                ].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => updateNested("staff", "setupMode", id as any)} className={`rounded-2xl border p-4 text-left font-black ${data.staff.setupMode === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"}`}>{label}</button>
                ))}
              </div>
              {data.staff.setupMode === "invite" ? (
                <div className="space-y-3">
                  {data.staff.members.map((member, index) => (
                    <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-4">
                      {(["name", "email", "phone", "title"] as const).map((key) => (
                        <input
                          key={key}
                          className={inputClass()}
                          placeholder={key}
                          value={member[key]}
                          onChange={(event) => {
                            const members = [...data.staff.members];
                            members[index] = { ...members[index], [key]: event.target.value };
                            updateSection("staff", { members });
                          }}
                        />
                      ))}
                    </div>
                  ))}
                  <button type="button" onClick={() => updateSection("staff", { members: [...data.staff.members, { name: "", email: "", phone: "", title: "" }] })} className="rounded-xl border border-cyan-300/20 px-4 py-2 text-sm font-bold text-cyan-50">
                    Add another
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {step.id === "safety" ? (
            <div className="space-y-4">
              {[
                ["requireApproval", "Require manual approval before AI sends email, SMS, or social posts."],
                ["allowAutoAssign", "Allow internal task assignment suggestions and low-risk routing."],
                ["quietHoursEnabled", "Respect quiet hours for reminders and outreach queues."],
                ["smsComplianceAck", "I understand SMS requires consent, opt-out handling, and provider compliance review."],
                ["noAutoSendAck", "I understand onboarding will not auto-send customer messages or auto-charge outside Stripe Checkout."],
              ].map(([key, label]) => (
                <label key={key} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean((data.automation as any)[key])}
                    onChange={(event) => updateSection("automation", { [key]: event.target.checked } as any)}
                    className="mt-1"
                  />
                  <span>{label}</span>
                </label>
              ))}
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Quiet hours start">
                  <input className={inputClass()} type="time" value={data.automation.quietHoursStart} onChange={(event) => updateSection("automation", { quietHoursStart: event.target.value })} />
                </Field>
                <Field label="Quiet hours end">
                  <input className={inputClass()} type="time" value={data.automation.quietHoursEnd} onChange={(event) => updateSection("automation", { quietHoursEnd: event.target.value })} />
                </Field>
              </div>
            </div>
          ) : null}

          {step.id === "launch" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-cyan-100/70">Launch readiness</div>
                    <div className="mt-1 text-5xl font-black">{readiness?.score ?? 0}%</div>
                  </div>
                  <Wand2 className="text-cyan-100" size={42} />
                </div>
                <p className="mt-3 text-sm text-cyan-50/75">
                  Pending or skipped items remain available from Settings and CRM setup pages.
                </p>
              </div>
              <div className="space-y-2">
                {(readiness?.checks || []).map((check: any) => (
                  <div key={check.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                    <div>
                      <div className="text-sm font-bold">{check.label}</div>
                      {check.detail ? <div className="text-xs text-slate-400">{check.detail}</div> : null}
                    </div>
                    <StatusPill status={check.status} />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/settings" className="rounded-xl border border-cyan-300/20 px-4 py-2 text-sm font-bold text-cyan-50">Open Settings</Link>
                <Link href="/dashboard/leads" className="rounded-xl border border-cyan-300/20 px-4 py-2 text-sm font-bold text-cyan-50">Open Leads</Link>
                <button type="button" onClick={activate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-2 font-black text-black">
                  <Rocket size={16} />
                  Activate and Enter CRM
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={back} disabled={activeStep === 0} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-40">
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex gap-3">
              {step.id !== "launch" ? (
                <button type="button" onClick={skipCurrent} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300">
                  Skip for now
                </button>
              ) : null}
              {step.id !== "launch" ? (
                <button type="button" onClick={next} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-2 font-black text-black disabled:opacity-60">
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                  Continue
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 font-black">
              <Gauge size={18} className="text-cyan-200" />
              Readiness
            </div>
            <div className="text-4xl font-black">{readiness?.score ?? 0}%</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-green-300" style={{ width: `${readiness?.score ?? 0}%` }} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 font-black">
              <Users size={18} className="text-cyan-200" />
              Saved State
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between gap-3"><span>Workspace</span><span className="truncate text-white">{workspaceId ? "Created" : "Pending"}</span></div>
              <div className="flex justify-between gap-3"><span>Leads</span><span className="text-white">{snapshot?.leads?.length || 0}</span></div>
              <div className="flex justify-between gap-3"><span>Staff</span><span className="text-white">{snapshot?.staff?.length || 0}</span></div>
              <div className="flex justify-between gap-3"><span>Providers</span><span className="text-white">{snapshot?.providerConnections?.length || 0}</span></div>
              <div className="flex justify-between gap-3"><span>Billing</span><span className="truncate text-white">{snapshot?.billing?.status || "not saved"}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50">
            <div className="mb-2 flex items-center gap-2 font-black">
              <AlertTriangle size={16} />
              Manual setup remains explicit
            </div>
            Stripe confirmation, verified Resend domains, Twilio compliance, Google OAuth, and social connections stay pending until their providers confirm them.
          </div>
        </aside>
      </div>
    </main>
  );
}
