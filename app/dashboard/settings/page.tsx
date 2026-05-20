"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Database, KeyRound, Loader2, Settings, Sparkles, UserPlus, XCircle, Zap } from "lucide-react";
import { COMMITMENT_DISCOUNTS, CREDIT_PACKS, MANAGED_PLANS, SELF_SERVICE_BYOK_PLANS, SUBSCRIPTION_PLANS, TRIAL_PLANS } from "@/lib/billing/plans";
import { SERVICE_CATALOG } from "@/lib/billing/services";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";
import SimpleMetricModal, { type SimpleMetricDetail } from "@/components/dashboard/SimpleMetricModal";

const defaultForm = {
  business_name: "",
  industry: "",
  website: "",
  contact_email: "",
  phone: "",
  default_sender_name: "",
  default_sender_email: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
  brand_voice: "",
  tone: "professional",
  cta_style: "",
  audience_description: "",
  automation_level: "review_required",
};

const defaultStaffForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  title: "",
  status: "invited",
  permissions: ["dashboard:view", "leads:view", "tasks:view"],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [integrations, setIntegrations] = useState<Record<string, any>>({});
  const [aiProviders, setAiProviders] = useState<any>(null);
  const [providerConnections, setProviderConnections] = useState<any[]>([]);
  const [billing, setBilling] = useState<any>(null);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [creditPackPurchases, setCreditPackPurchases] = useState<any[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [staffPermissions, setStaffPermissions] = useState<string[]>([]);
  const [staffForm, setStaffForm] = useState<any>(defaultStaffForm);
  const [providerKeys, setProviderKeys] = useState({ gemini: "", openrouter: "", openai: "", openrouter_model: "" });
  const [integrationKeys, setIntegrationKeys] = useState({ resend: "", twilioAccountSid: "", twilioAuthToken: "", ayrshare: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<SimpleMetricDetail | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<any>(null);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");
      const [response, staffResponse, simulationResponse] = await Promise.all([
        fetch("/api/crm/settings"),
        fetch("/api/crm/staff"),
        fetch("/api/test/simulation/status"),
      ]);
      const data = await response.json();
      const staffData = await staffResponse.json().catch(() => ({}));
      const simulationData = await simulationResponse.json().catch(() => null);

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to load settings.");
      }

      setSettings(data.settings);
      setIntegrations(data.integrations || {});
      setAiProviders(data.aiProviders || null);
      setProviderConnections(data.providerConnections || []);
      setBilling(data.billing || null);
      setUsage(data.usage || {});
      setCreditPackPurchases(data.creditPackPurchases || []);
      if (staffData?.success) {
        setStaffMembers(staffData.staff || staffData.data || []);
        setStaffPermissions(staffData.permissions || []);
      }
      setSimulationStatus(simulationData?.allowed ? simulationData : null);
      setForm({ ...defaultForm, ...(data.settings || {}) });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function saveSettings() {
    return saveSettingsPatch(form, "Settings saved.");
  }

  async function saveSettingsPatch(values: any, message: string) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: settings?.id, ...values }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to save settings.");
      }

      setSettings(data.settings);
      setSuccess(message);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProviderKeys(type: "ai" | "integration") {
    try {
      setSavingSection(type);
      setError("");
      setSuccess("");
      const aiConnections = [
        providerKeys.gemini && { provider: "gemini", provider_type: "ai", secret: providerKeys.gemini },
        providerKeys.openrouter && {
          provider: "openrouter",
          provider_type: "ai",
          secret: providerKeys.openrouter,
          model: providerKeys.openrouter_model || aiProviders?.openrouter_model || "openrouter/free",
        },
        providerKeys.openai && { provider: "openai", provider_type: "ai", secret: providerKeys.openai },
      ].filter(Boolean);
      const integrationConnections = [
        integrationKeys.resend && { provider: "resend", provider_type: "integration", secret: integrationKeys.resend },
        integrationKeys.twilioAccountSid && {
          provider: "twilio_account_sid",
          provider_type: "integration",
          secret: integrationKeys.twilioAccountSid,
        },
        integrationKeys.twilioAuthToken && {
          provider: "twilio_auth_token",
          provider_type: "integration",
          secret: integrationKeys.twilioAuthToken,
        },
        integrationKeys.ayrshare && { provider: "ayrshare", provider_type: "integration", secret: integrationKeys.ayrshare },
      ].filter(Boolean);

      const connections = type === "ai" ? aiConnections : integrationConnections;
      if (connections.length === 0) {
        setError("Enter at least one key before saving.");
        return;
      }

      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "provider_connections", connections }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to save keys.");
      setProviderKeys({ gemini: "", openrouter: "", openai: "", openrouter_model: "" });
      setIntegrationKeys({ resend: "", twilioAccountSid: "", twilioAuthToken: "", ayrshare: "" });
      setSuccess(type === "ai" ? "AI provider keys saved server-side." : "Integration keys saved server-side.");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save keys.");
    } finally {
      setSavingSection("");
    }
  }

  async function createCreditPackIntent(pack: string) {
    try {
      setSavingSection(pack);
      setError("");
      setSuccess("");
      const priceMatch = pack.match(/\$(\d+)/);
      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "credit_pack_intent",
          pack,
          price_cents: priceMatch ? Number(priceMatch[1]) * 100 : null,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to create checkout intent.");
      if (data.checkoutUrl) {
        setSuccess("Stripe Checkout session created. Redirecting to Stripe for review and payment.");
        window.location.assign(data.checkoutUrl);
        return;
      }
      setSuccess(data.setupRequired
        ? "Credit pack checkout intent recorded. Add Stripe env vars to enable live checkout."
        : "Credit pack checkout intent recorded for review.");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create checkout intent.");
    } finally {
      setSavingSection("");
    }
  }

  async function openBillingPortal() {
    try {
      setSavingSection("billing_portal");
      setError("");
      setSuccess("");
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Billing Portal is not available yet.");
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      setSuccess("Billing Portal setup is required before payment methods can be managed.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to open Billing Portal.");
    } finally {
      setSavingSection("");
    }
  }

  async function startSubscriptionCheckout(planSlug: string) {
    try {
      setSavingSection(`subscription_${planSlug}`);
      setError("");
      setSuccess("");
      const response = await fetch("/api/billing/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planSlug }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to create subscription checkout.");
      }
      if (data.checkoutUrl) {
        setSuccess("Stripe subscription checkout created. Redirecting to Stripe for trial and payment review.");
        window.location.assign(data.checkoutUrl);
        return;
      }
      setSuccess(data.setupRequired
        ? "Subscription intent recorded. Add Stripe subscription price env vars before live checkout."
        : "Subscription intent recorded for review.");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create subscription checkout.");
    } finally {
      setSavingSection("");
    }
  }

  async function requestService(itemName: string) {
    try {
      setSavingSection(`service_${itemName}`);
      setError("");
      setSuccess("");
      const response = await fetch("/api/crm/services/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to request service consultation.");
      setSuccess(`${itemName} consultation request saved. SynaptiReach will review before any purchase or checkout.`);
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to request service consultation.");
    } finally {
      setSavingSection("");
    }
  }

  async function runSimulationAction(action: "seed" | "tick" | "reset" | "pause" | "resume") {
    try {
      setSavingSection(`simulation_${action}`);
      setError("");
      setSuccess("");
      const endpoint = action === "resume" ? "pause" : action;
      const response = await fetch(`/api/test/simulation/${endpoint}`, {
        method: action === "seed" || action === "tick" || action === "reset" || action === "pause" || action === "resume" ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "pause" ? { paused: true } : action === "resume" ? { paused: false } : {}),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.reason || data?.error || "Simulation action failed.");
      }
      setSuccess(
        action === "seed"
          ? "Test workspace seeded with simulated CRM data."
          : action === "tick"
            ? `Simulation advanced to day ${data.simulation_day}.`
            : action === "reset"
              ? "Test workspace simulation data reset."
              : action === "pause"
                ? "Test workspace simulation paused."
                : "Test workspace simulation resumed."
      );
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Simulation action failed.");
    } finally {
      setSavingSection("");
    }
  }

  async function saveStaffMember() {
    try {
      setSavingSection("staff");
      setError("");
      setSuccess("");
      if (!staffForm.name && !staffForm.email) {
        setError("Enter a staff name or email before saving.");
        return;
      }
      const response = await fetch("/api/crm/staff", {
        method: staffForm.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffForm),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to save staff member.");
      setStaffForm(defaultStaffForm);
      setSuccess(staffForm.id ? "Staff member updated." : "Staff member invited.");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save staff member.");
    } finally {
      setSavingSection("");
    }
  }

  function editStaff(member: any) {
    setStaffForm({
      id: member.id,
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      title: member.title || "",
      status: member.status || "invited",
      permissions: member.permissions || [],
    });
  }

  function toggleStaffPermission(permission: string) {
    setStaffForm((current: any) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item: string) => item !== permission)
        : [...current.permissions, permission],
    }));
  }

  const connectionByProvider = providerConnections.reduce((map: Record<string, any>, connection) => {
    map[connection.provider] = connection;
    return map;
  }, {});
  const selectedPlanName = billing?.plan_tier || billing?.metadata?.selected_plan || "Growth Trial";
  const selectedPlan = [...TRIAL_PLANS, ...SUBSCRIPTION_PLANS].find((plan) => plan.name === selectedPlanName);
  const stripeStatus = integrations.stripe || {};
  const stripeReady = Boolean(stripeStatus.checkoutEnabled || stripeStatus.configured);

  return (
    <main className="min-h-screen text-white">
      <QueryRecordFocus keys={["settingsId"]} hashIds={["billing", "usage", "providers", "services"]} />
      <SimpleMetricModal metric={selectedMetric} onClose={() => setSelectedMetric(null)} />
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs mb-4">
          <Settings size={14} />
          Workspace Settings
        </div>
        <h1 className="text-5xl font-black mb-4 leading-tight">
          CRM
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            {" "}Settings
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Business profile, AI behavior, and integration status without exposing secrets.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-16"><Loader2 className="animate-spin text-cyan-300" /></div>
      ) : (
        <>
          {error && <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
          {success && <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">{success}</div>}
          {simulationStatus && (
            <div className="mb-5 rounded-3xl border border-green-400/20 bg-green-500/10 p-5 text-sm text-green-100">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-green-200">Simulated Test Workspace</div>
                  <div className="mt-2 text-white">
                    {simulationStatus.seeded
                      ? `Seeded. Day ${simulationStatus.state?.simulation_day || 0}. Last tick ${simulationStatus.state?.last_tick_at ? new Date(simulationStatus.state.last_tick_at).toLocaleString() : "not run yet"}.`
                      : "Configured but not seeded yet."}
                  </div>
                  <div className="mt-1 text-xs text-green-100/70">
                    Version {simulationStatus.simulationVersion}. These controls are hidden from normal workspaces.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["seed", "Seed"],
                    ["tick", "Run Tick"],
                    [simulationStatus.state?.paused ? "resume" : "pause", simulationStatus.state?.paused ? "Resume" : "Pause"],
                    ["reset", "Reset"],
                  ].map(([action, label]) => (
                    <button
                      key={action}
                      onClick={() => runSimulationAction(action as any)}
                      disabled={savingSection === `simulation_${action}`}
                      className="rounded-2xl border border-green-300/20 bg-black/30 px-4 py-3 text-xs font-black text-green-100 disabled:opacity-60"
                    >
                      {savingSection === `simulation_${action}` ? "Working..." : label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <MiniBrainInsightPanel
            title="Setup & Usage Intelligence"
            subtitle="Provider readiness, BYOK setup, billing usage, and launch-readiness checks without exposing secrets."
            types={["billing_usage_intelligence", "onboarding_setup", "safety_compliance", "simulation"]}
          />

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div id="providers" className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-2xl font-black">Business Profile</h2>
                  <button onClick={() => saveSettingsPatch({
                    business_name: form.business_name,
                    industry: form.industry,
                    website: form.website,
                    contact_email: form.contact_email,
                    phone: form.phone,
                    default_sender_name: form.default_sender_name,
                    default_sender_email: form.default_sender_email,
                    timezone: form.timezone,
                  }, "Business profile saved.")} disabled={saving} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60">
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["business_name", "Business Name"],
                    ["industry", "Industry"],
                    ["website", "Website"],
                    ["contact_email", "Contact Email"],
                    ["phone", "Phone"],
                    ["timezone", "Timezone"],
                    ["default_sender_name", "Default Sender Name"],
                    ["default_sender_email", "Default Sender Email"],
                  ].map(([key, label]) => (
                    <input
                      key={key}
                      value={(form as any)[key] || ""}
                      onChange={(event) => updateField(key, event.target.value)}
                      placeholder={label}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-cyan-300" size={22} />
                    <h2 className="text-2xl font-black">AI Settings</h2>
                  </div>
                  <button onClick={() => saveSettingsPatch({
                    brand_voice: form.brand_voice,
                    tone: form.tone,
                    cta_style: form.cta_style,
                    audience_description: form.audience_description,
                    automation_level: form.automation_level,
                  }, "AI settings saved.")} disabled={saving} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60">
                    {saving ? "Saving..." : "Save AI Settings"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={form.brand_voice || ""} onChange={(event) => updateField("brand_voice", event.target.value)} placeholder="Brand Voice" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input value={form.tone || ""} onChange={(event) => updateField("tone", event.target.value)} placeholder="Tone" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input value={form.cta_style || ""} onChange={(event) => updateField("cta_style", event.target.value)} placeholder="Preferred CTA Style" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <select value={form.automation_level || "review_required"} onChange={(event) => updateField("automation_level", event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                    <option value="review_required">Review Required</option>
                    <option value="assistive">Assistive</option>
                    <option value="recommend_only">Recommend Only</option>
                  </select>
                </div>
                <textarea value={form.audience_description || ""} onChange={(event) => updateField("audience_description", event.target.value)} placeholder="Audience Description" className="mt-4 w-full min-h-[140px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
              </div>

              <button onClick={saveSettings} disabled={saving} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-6 py-4 font-black text-black flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                Save Settings
              </button>

              <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <KeyRound className="text-cyan-300" size={22} />
                  <h2 className="text-2xl font-black">Connect Your AI Keys</h2>
                </div>
                <p className="mb-4 text-sm text-gray-400">
                  SynaptiReach keys are never shown. Your BYOK keys are encrypted server-side and displayed only as configured/missing after save.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="password" value={providerKeys.gemini} onChange={(event) => setProviderKeys({ ...providerKeys, gemini: event.target.value })} placeholder="Gemini API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={providerKeys.openrouter} onChange={(event) => setProviderKeys({ ...providerKeys, openrouter: event.target.value })} placeholder="OpenRouter API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input value={providerKeys.openrouter_model} onChange={(event) => setProviderKeys({ ...providerKeys, openrouter_model: event.target.value })} placeholder="OpenRouter model (default openrouter/free)" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={providerKeys.openai} onChange={(event) => setProviderKeys({ ...providerKeys, openai: event.target.value })} placeholder="OpenAI key (optional premium)" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                </div>
                <button onClick={() => saveProviderKeys("ai")} disabled={savingSection === "ai"} className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60">
                  {savingSection === "ai" ? "Saving..." : "Save AI Provider Keys"}
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Database className="text-cyan-300" size={22} />
                  <h2 className="text-2xl font-black">Connect Sending Integrations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="password" value={integrationKeys.resend} onChange={(event) => setIntegrationKeys({ ...integrationKeys, resend: event.target.value })} placeholder="Resend API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.twilioAccountSid} onChange={(event) => setIntegrationKeys({ ...integrationKeys, twilioAccountSid: event.target.value })} placeholder="Twilio Account SID" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.twilioAuthToken} onChange={(event) => setIntegrationKeys({ ...integrationKeys, twilioAuthToken: event.target.value })} placeholder="Twilio Auth Token" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.ayrshare} onChange={(event) => setIntegrationKeys({ ...integrationKeys, ayrshare: event.target.value })} placeholder="Ayrshare API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                </div>
                <button onClick={() => saveProviderKeys("integration")} disabled={savingSection === "integration"} className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 disabled:opacity-60">
                  {savingSection === "integration" ? "Saving..." : "Save Integration Keys"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 h-fit">
              <div className="flex items-center gap-3 mb-5">
                <Database className="text-cyan-300" size={22} />
                <h2 className="text-xl font-black">Integration Status</h2>
              </div>
              <div className="space-y-3">
                {Object.entries({
                  Supabase: integrations.supabase,
                  Resend: integrations.resend,
                  Twilio: integrations.twilio,
                  Ayrshare: integrations.ayrshare,
                  Stripe: stripeReady,
                  "Vercel Cron": integrations.vercelCron,
                }).map(([label, configured]) => (
                  <button
                    key={label}
                    onClick={() => setSelectedMetric({
                      title: `${label} Integration`,
                      value: configured ? "Configured" : "Missing",
                      description: configured
                        ? `${label} appears configured from server-side settings. Secrets are never displayed.`
                        : `${label} setup is missing or disabled. Configure the provider server-side or through saved provider connections.`,
                      records: providerConnections.filter((connection) => String(connection.provider || "").toLowerCase().includes(label.toLowerCase())),
                      href: "/dashboard/settings#providers",
                    })}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center justify-between text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <span className="text-sm text-gray-300">{label}</span>
                    <span className={`flex items-center gap-2 text-sm font-bold ${configured ? "text-cyan-300" : "text-red-200"}`}>
                      {configured ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {configured ? "Configured" : "Missing"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6 h-fit">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="text-cyan-300" size={22} />
                <h2 className="text-xl font-black">AI Providers</h2>
              </div>
              <div className="space-y-3">
                {[
                  ["Gemini", "gemini"],
                  ["OpenRouter", "openrouter"],
                  ["OpenAI", "openai"],
                ].map(([label, key]) => {
                  const configured = Boolean(aiProviders?.configured?.[key]);
                  const enabled = Boolean(aiProviders?.enabled?.[key]);
                  const openAIDisabled =
                    key === "openai" && aiProviders?.openai_enabled === false;
                  const priority =
                    (aiProviders?.priority || []).indexOf(key) + 1;
                  const statusText = openAIDisabled
                    ? "Disabled"
                    : enabled
                      ? "Configured"
                      : "Missing";
                  const statusClass = openAIDisabled
                    ? "text-gray-400"
                    : enabled
                      ? "text-cyan-300"
                      : "text-red-200";

                  return (
                    <div key={key} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-300">{label}</span>
                        <span className={`flex items-center gap-2 text-sm font-bold ${statusClass}`}>
                          {enabled ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          {statusText}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {priority > 0 ? `Priority ${priority}` : "Not in active priority"}
                      </div>
                      {connectionByProvider[key]?.key_label && (
                        <div className="text-xs text-gray-500 mt-1">BYOK saved: {connectionByProvider[key].key_label}</div>
                      )}
                      {key === "openrouter" && (
                        <div className="text-xs text-gray-500 mt-1">
                          Model {aiProviders?.openrouter_model || integrations.openrouter?.model || "openrouter/free"}
                        </div>
                      )}
                      {key === "openai" && openAIDisabled && (
                        <div className="text-xs text-gray-500 mt-1">
                          Enable with AI_ENABLE_OPENAI=true for premium-only usage.
                        </div>
                      )}
                      {configured && !enabled && !openAIDisabled && (
                        <div className="text-xs text-gray-500 mt-1">
                          Key is present but provider is not active.
                        </div>
                      )}
                    </div>
                  );
                })}
                {aiProviders?.warnings?.length > 0 && (
                  <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-xs text-yellow-100">
                    {aiProviders.warnings.map((warning: any) => warning.reason).join(". ")}
                  </div>
                )}
              </div>
            </div>

            <div id="billing" className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 h-fit xl:col-span-3">
              <div className="flex items-center gap-3 mb-5">
                <Zap className="text-cyan-300" size={22} />
                <h2 className="text-xl font-black">Trial, Caps & Billing Rules</h2>
              </div>
              <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                14-day free trial. No managed SMS during trial unless the user connects their own Twilio/BYOK provider. Trial caps are hard caps, no overages. Commit before your trial ends and save up to 30%.
              </div>
              <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  ["Plan", selectedPlanName],
                  ["Status", billing?.status || "trial/setup required"],
                  ["Billing Mode", billing?.billing_mode || "not selected"],
                  ["Trial Ends", billing?.trial_ends_at ? new Date(billing.trial_ends_at).toLocaleString() : "not set"],
                ].map(([label, value]) => (
                  <button
                    key={label}
                    onClick={() => setSelectedMetric({
                      title: String(label),
                      value: String(value),
                      description: `${label} is pulled from the workspace billing account. Subscription and payment state still require Stripe webhook confirmation.`,
                      records: billing ? [billing] : [],
                      href: "/dashboard/settings#billing",
                    })}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">{label}</div>
                    <div className="mt-2 font-black text-white">{value}</div>
                  </button>
                ))}
              </div>
              <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  ["AI", usage.ai || usage.ai_actions || 0, selectedPlan?.aiActions || "select plan"],
                  ["Email", usage.email || usage.emails || 0, selectedPlan?.emails || "select plan"],
                  ["SMS", usage.sms || 0, selectedPlan?.sms || "select plan"],
                  ["Contacts", usage.contacts || 0, selectedPlan?.contacts || "select plan"],
                ].map(([label, used, cap]) => (
                  <button
                    key={label}
                    onClick={() => setSelectedMetric({
                      title: `${label} Usage`,
                      value: `${used} used`,
                      description: `Current usage against the selected plan cap. Managed plans use hard caps and no surprise overages.`,
                      records: [{ type: label, used, cap, plan: selectedPlan?.name || selectedPlanName }],
                      href: "/dashboard/settings#usage",
                    })}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="text-sm text-gray-400">{label}</div>
                    <div className="mt-2 text-xl font-black">{used} used</div>
                    <div className="text-xs text-gray-500">out of {cap}</div>
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Selected tier</div>
                    <div className="mt-2 text-xl font-black text-white">{selectedPlan?.name || selectedPlanName}</div>
                  </div>
                  {selectedPlan && "price" in selectedPlan && <div className="text-xl font-black text-cyan-300">{selectedPlan.price}</div>}
                </div>
                {selectedPlan ? (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 text-sm text-gray-400">
                    <div>AI: <span className="text-white">{selectedPlan.aiActions}</span></div>
                    <div>Email: <span className="text-white">{selectedPlan.emails}</span></div>
                    <div>SMS: <span className="text-white">{selectedPlan.sms}</span></div>
                    <div>Contacts: <span className="text-white">{selectedPlan.contacts}</span></div>
                    <div>Agents: <span className="text-white">{selectedPlan.agents}</span></div>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-400">No selected plan record found yet. Complete onboarding or billing setup to store the selected tier.</div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {COMMITMENT_DISCOUNTS.map((item) => (
                  <span key={item.duration} className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-300">
                    {item.duration}: {item.discount} off
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <CreditCard className="text-cyan-300" size={18} />
                    <h3 className="font-black">Payment Method</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    {stripeReady
                      ? "Stripe Checkout is configured for credit-pack payment review. Saved payment-method management still requires a dedicated billing portal route."
                      : "Stripe/payment integration is not connected yet. Add Stripe env vars before collecting or updating payment methods."}
                  </p>
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-400">
                    Status: {stripeReady ? `Stripe ${stripeStatus.mode || "configured"}` : "setup required"}
                    {stripeStatus.webhookConfigured ? " · Webhook configured" : " · Webhook missing"}
                  </div>
                  <button
                    onClick={openBillingPortal}
                    disabled={!stripeReady || savingSection === "billing_portal"}
                    className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-gray-500"
                  >
                    {savingSection === "billing_portal"
                      ? "Opening..."
                      : stripeReady
                        ? "Open Billing Portal"
                        : "Connect billing provider required"}
                  </button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <h3 className="font-black">Usage Cost Rules</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    BYOK users pay their own provider usage separately. SynaptiReach-managed plans consume included credits and require credit packs or an upgrade after caps are reached.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.04] p-5">
                <h3 className="text-xl font-black">Select a Paid Plan</h3>
                <p className="mt-2 text-sm text-cyan-50/65">
                  After the 14-day trial, your selected plan renews automatically unless canceled before the trial ends. Checkout is hosted by Stripe, and no subscription is marked active until Stripe confirms it.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <div key={plan.slug} className={`rounded-2xl border p-4 ${selectedPlanName === plan.name ? "border-cyan-300/50 bg-cyan-400/10" : "border-white/10 bg-black/30"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-black text-white">{plan.name}</div>
                          <div className="text-xs text-gray-500">{plan.billingMode === "byok" ? "Bring your own provider keys" : "SynaptiReach-managed credits"}</div>
                        </div>
                        <div className="font-black text-cyan-200">{plan.price}</div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        {plan.overCapBehavior}
                      </div>
                      <button
                        onClick={() => startSubscriptionCheckout(plan.slug)}
                        disabled={Boolean(savingSection)}
                        className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60"
                      >
                        {savingSection === `subscription_${plan.slug}` ? "Creating..." : stripeReady ? "Start Stripe Trial Checkout" : "Record Subscription Intent"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="mb-3 text-xl font-black">Credit Packs</h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {CREDIT_PACKS.map((pack) => (
                    <div key={pack} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">{pack}</div>
                      <button onClick={() => createCreditPackIntent(pack)} disabled={Boolean(savingSection)} className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60">
                        {savingSection === pack ? "Creating..." : stripeReady ? "Start Stripe Checkout" : "Create Checkout Intent"}
                      </button>
                    </div>
                  ))}
                </div>
                {creditPackPurchases.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                    {creditPackPurchases.length} credit pack intent{creditPackPurchases.length === 1 ? "" : "s"} recorded for review.
                  </div>
                )}
              </div>
            </div>

            <div id="services" className="rounded-3xl border border-cyan-400/15 bg-cyan-500/[0.04] p-6 h-fit xl:col-span-3">
              <div className="mb-5 flex items-center gap-3">
                <Sparkles className="text-cyan-300" size={22} />
                <h2 className="text-xl font-black">Services, Bundles & Retainers</h2>
              </div>
              <p className="mb-5 text-sm text-cyan-50/65">
                Request a 30-minute SynaptiReach consultation before purchasing implementation services. Requests are stored for review and do not trigger payment.
              </p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {SERVICE_CATALOG.map((item) => (
                  <div key={`${item.serviceType}-${item.itemName}`} className={`rounded-2xl border p-4 ${item.popular ? "border-cyan-300/45 bg-cyan-400/10" : "border-white/10 bg-black/30"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black text-white">{item.itemName}</div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                      <div className="font-black text-cyan-200">{item.priceLabel}</div>
                    </div>
                    {item.popular && <div className="mt-2 text-xs font-black text-green-200">MOST POPULAR</div>}
                    <button
                      onClick={() => requestService(item.itemName)}
                      disabled={Boolean(savingSection)}
                      className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:opacity-60"
                    >
                      {savingSection === `service_${item.itemName}` ? "Requesting..." : "Request Consultation"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 h-fit xl:col-span-3">
              <div className="mb-5 flex items-center gap-3">
                <UserPlus className="text-cyan-300" size={22} />
                <h2 className="text-xl font-black">Staff & Permissions</h2>
              </div>
              <p className="mb-5 text-sm text-gray-400">
                Staff records and granted permissions are stored server-side. The UI exposes allowed actions, and API routes can enforce these permissions through the shared workspace access helpers.
              </p>
              <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5">
                  <h3 className="mb-4 font-black">{staffForm.id ? "Edit Staff Member" : "Add Staff Member"}</h3>
                  <div className="grid gap-3">
                    <input value={staffForm.name} onChange={(event) => setStaffForm({ ...staffForm, name: event.target.value })} placeholder="Name" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                    <input value={staffForm.email} onChange={(event) => setStaffForm({ ...staffForm, email: event.target.value })} placeholder="Email" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                    <input value={staffForm.phone} onChange={(event) => setStaffForm({ ...staffForm, phone: event.target.value })} placeholder="Phone" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                    <input value={staffForm.title} onChange={(event) => setStaffForm({ ...staffForm, title: event.target.value })} placeholder="Title" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                    <select value={staffForm.status} onChange={(event) => setStaffForm({ ...staffForm, status: event.target.value })} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
                      <option value="invited">invited</option>
                      <option value="active">active</option>
                      <option value="paused">paused</option>
                      <option value="archived">archived</option>
                    </select>
                  </div>
                  <div className="mt-4 max-h-52 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-gray-500">Permissions</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {staffPermissions.map((permission) => (
                        <label key={permission} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300">
                          <input
                            type="checkbox"
                            checked={staffForm.permissions.includes(permission)}
                            onChange={() => toggleStaffPermission(permission)}
                          />
                          {permission}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={saveStaffMember} disabled={savingSection === "staff"} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-3 text-sm font-black text-black disabled:opacity-60">
                      {savingSection === "staff" ? "Saving..." : "Save Staff"}
                    </button>
                    {staffForm.id && (
                      <button onClick={() => setStaffForm(defaultStaffForm)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-white">Cancel Edit</button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {staffMembers.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                      No staff records yet. Add staff when you are ready to delegate CRM access.
                    </div>
                  ) : staffMembers.map((member) => (
                    <div key={member.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-black text-white">{member.name || member.email}</div>
                          <div className="text-sm text-gray-500">{member.title || member.email || "Staff member"}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{member.status}</span>
                          <button onClick={() => editStaff(member)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white">Edit</button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(member.permissions || []).slice(0, 10).map((permission: string) => (
                          <span key={permission} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-300">{permission}</span>
                        ))}
                        {(member.permissions || []).length > 10 && <span className="text-xs text-gray-500">+{member.permissions.length - 10} more</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
