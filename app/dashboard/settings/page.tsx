"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Database,
  KeyRound,
  Loader2,
  Mail,
  MessageSquare,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  UserPlus,
  XCircle,
  Zap,
} from "lucide-react";
import { COMMITMENT_DISCOUNTS, CREDIT_PACKS, MANAGED_PLANS, SELF_SERVICE_BYOK_PLANS, SUBSCRIPTION_PLANS, TRIAL_PLANS } from "@/lib/billing/plans";
import { SERVICE_CATALOG } from "@/lib/billing/services";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";
import SimpleMetricModal, { type SimpleMetricDetail } from "@/components/dashboard/SimpleMetricModal";
import BillingPurchaseHistory from "@/components/settings/BillingPurchaseHistory";
import OwnerFocusPanel from "@/components/dashboard/OwnerFocusPanel";

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

const defaultAutomationPolicy = {
  mode: "assisted",
  external_communication_safety: "review_required",
  internal_action_safety: "review_required",
  categories: {
    email_replies: "review_required",
    sms_replies: "review_required",
    internal_tasks: "review_required",
    lead_scoring_updates: "review_required",
    deal_pipeline_updates: "review_required",
    appointment_suggestions: "review_required",
    workflow_recommendations: "review_required",
    campaign_recommendations: "review_required",
    intake_notifications: "review_required",
  },
};

const automationModeLabels: Record<string, string> = {
  conservative: "Conservative",
  assisted: "Assisted",
  autonomous_allowed: "Autonomous Where Allowed",
  review_required: "Conservative",
  recommend_only: "Conservative",
};

const behaviorLabels: Record<string, string> = {
  review_required: "Review Needed First",
  auto_safe: "Auto-Apply Where Safe",
  disabled: "Disabled",
};

const categoryLabels: Record<string, string> = {
  email_replies: "Email replies",
  sms_replies: "SMS replies",
  internal_tasks: "Internal tasks",
  lead_scoring_updates: "Lead scoring updates",
  deal_pipeline_updates: "Deal and pipeline updates",
  appointment_suggestions: "Appointment suggestions",
  workflow_recommendations: "Workflow recommendations",
  campaign_recommendations: "Campaign recommendations",
  intake_notifications: "Contact, waitlist, and service intake notifications",
};

function billingModeLabel(value: string | null | undefined) {
  if (value === "byok") return "Bring Your Own Key";
  if (value === "managed" || value === "synaptireach_managed") return "SynaptiReach Managed";
  return value ? String(value) : "Not selected";
}

function planDisplayName(value: string | null | undefined) {
  return (value || "Not selected").replace(/\bBYOK\b/g, "Bring Your Own Key");
}

function statusLabel(value: any) {
  if (value === true) return "Configured";
  if (value === false || value === null || value === undefined) return "Setup Required";
  if (typeof value === "object") {
    if (value.status === "disabled") return "Disabled";
    if (value.configured || value.enabled || value.checkoutEnabled) return "Configured";
    if (value.status === "missing") return "Setup Required";
  }
  return "Review";
}

function parseCreditPack(pack: string) {
  const amount = pack.match(/\$(\d+)/);
  const name = pack.split(":")[0]?.trim() || pack;
  const detail = pack.split(":").slice(1).join(":").trim() || pack;
  return {
    name,
    detail,
    label: pack,
    amountCents: amount ? Number(amount[1]) * 100 : null,
    priceLabel: amount ? `$${amount[1]}` : "Price pending",
  };
}

function serviceGroupLabel(category: string) {
  if (category.includes("Execution")) return "Marketing Execution";
  if (category.includes("Strategy")) return "Strategy";
  if (category.includes("Advanced")) return "Advanced Marketing";
  if (category.includes("AI Services")) return "AI Services";
  if (category.includes("Branding & SEO")) return "Branding & SEO";
  if (category.includes("Social & GMB")) return "Social & Google Business Profile";
  if (category.includes("Service Bundles")) return "Service Bundles";
  if (category.includes("Retainers")) return "Recurring Retainers";
  return category;
}

function SettingsSection({
  id,
  title,
  purpose,
  status,
  alert,
  defaultOpen = false,
  children,
}: {
  id?: string;
  title: string;
  purpose: string;
  status?: string;
  alert?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="rounded-3xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full flex-col gap-4 p-5 text-left md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-white">{title}</h2>
            {status && <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">{status}</span>}
            {alert && <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-100">{alert}</span>}
          </div>
          <p className="mt-2 text-sm text-gray-400">{purpose}</p>
        </div>
        <ChevronDown className={`text-cyan-200 transition ${open ? "rotate-180" : ""}`} size={20} />
      </button>
      {open && <div className="border-t border-white/10 p-5">{children}</div>}
    </section>
  );
}

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
  const [billingEvents, setBillingEvents] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
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
  const [automationPolicy, setAutomationPolicy] = useState<any>(defaultAutomationPolicy);
  const [selectedCreditPack, setSelectedCreditPack] = useState<string>(CREDIT_PACKS[0] || "");
  const [creditCheckoutModal, setCreditCheckoutModal] = useState(false);
  const [creditReturn, setCreditReturn] = useState<any>(null);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<string>("");
  const [billingSetupModal, setBillingSetupModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceRequestModal, setServiceRequestModal] = useState(false);
  const [serviceNotes, setServiceNotes] = useState("");
  const [serviceTimeline, setServiceTimeline] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [integrationConfig, setIntegrationConfig] = useState({
    resend: "",
    twilioAccountSid: "",
    twilioAuthToken: "",
    ayrshare: "",
    gemini: "",
    openrouter: "",
    openrouter_model: "",
    openai: "",
  });

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
      setBillingEvents(data.billingEvents || []);
      setServiceRequests(data.serviceRequests || []);
      if (staffData?.success) {
        setStaffMembers(staffData.staff || staffData.data || []);
        setStaffPermissions(staffData.permissions || []);
      }
      setSimulationStatus(simulationData?.allowed ? simulationData : null);
      setForm({ ...defaultForm, ...(data.settings || {}) });
      setAutomationPolicy({
        ...defaultAutomationPolicy,
        ...((data.settings?.metadata || {}).automation_policy || {}),
        categories: {
          ...defaultAutomationPolicy.categories,
          ...((data.settings?.metadata || {}).automation_policy?.categories || {}),
        },
      });
      const preferredPlanSlug =
        data.billing?.metadata?.plan_slug ||
        SUBSCRIPTION_PLANS.find((plan) => plan.name === (data.billing?.plan_tier || data.billing?.metadata?.selected_plan))?.slug ||
        "growth-managed";
      setSelectedSubscriptionPlan(preferredPlanSlug);

      const params = new URLSearchParams(window.location.search);
      const checkoutSessionId = params.get("session_id");
      if ((params.get("checkout") === "success" || params.get("subscription") === "success") && checkoutSessionId) {
        const storageKey = `synaptireach_checkout_notice_${checkoutSessionId}`;
        if (!sessionStorage.getItem(storageKey)) {
          const purchase = (data.creditPackPurchases || []).find((item: any) => item.checkout_reference === checkoutSessionId || item.metadata?.stripe_session_id === checkoutSessionId);
          setCreditReturn({
            kind: params.get("subscription") === "success" ? "subscription" : "credit_pack",
            sessionId: checkoutSessionId,
            purchase,
            status: purchase?.status || "pending_webhook",
          });
          sessionStorage.setItem(storageKey, "shown");
        }
      }
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

  function openIntegrationConfig(integration: any) {
    setSelectedIntegration(integration);
    setIntegrationConfig({
      resend: "",
      twilioAccountSid: "",
      twilioAuthToken: "",
      ayrshare: "",
      gemini: "",
      openrouter: "",
      openrouter_model: aiProviders?.openrouter_model || integrations.openrouter?.model || connectionByProvider.openrouter?.metadata?.model || "",
      openai: "",
    });
  }

  async function saveSelectedIntegration() {
    if (!selectedIntegration) return;
    try {
      setSavingSection(`integration_modal_${selectedIntegration.key}`);
      setError("");
      setSuccess("");
      const connections: any[] = [];
      if (selectedIntegration.key === "resend" && integrationConfig.resend) {
        connections.push({ provider: "resend", provider_type: "integration", secret: integrationConfig.resend });
      }
      if (selectedIntegration.key === "twilio") {
        if (integrationConfig.twilioAccountSid) connections.push({ provider: "twilio_account_sid", provider_type: "integration", secret: integrationConfig.twilioAccountSid });
        if (integrationConfig.twilioAuthToken) connections.push({ provider: "twilio_auth_token", provider_type: "integration", secret: integrationConfig.twilioAuthToken });
      }
      if (selectedIntegration.key === "ayrshare" && integrationConfig.ayrshare) {
        connections.push({ provider: "ayrshare", provider_type: "integration", secret: integrationConfig.ayrshare });
      }
      if (selectedIntegration.key === "gemini" && integrationConfig.gemini) {
        connections.push({ provider: "gemini", provider_type: "ai", secret: integrationConfig.gemini });
      }
      if (selectedIntegration.key === "openrouter" && (integrationConfig.openrouter || integrationConfig.openrouter_model)) {
        connections.push({
          provider: "openrouter",
          provider_type: "ai",
          secret: integrationConfig.openrouter || undefined,
          model: integrationConfig.openrouter_model || aiProviders?.openrouter_model || "openrouter/free",
          status: connectionByProvider.openrouter ? "configured" : "missing",
        });
      }
      if (selectedIntegration.key === "openai" && integrationConfig.openai) {
        connections.push({ provider: "openai", provider_type: "ai", secret: integrationConfig.openai });
      }
      if (connections.length === 0) {
        setError("Enter a supported key or model value before saving this integration.");
        return;
      }

      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "provider_connections", connections }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to save integration configuration.");
      setSuccess(`${selectedIntegration.label} configuration saved server-side.`);
      setSelectedIntegration(null);
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save integration configuration.");
    } finally {
      setSavingSection("");
    }
  }

  function updateAutomationCategory(key: string, value: string) {
    setAutomationPolicy((current: any) => ({
      ...current,
      categories: {
        ...(current.categories || {}),
        [key]: value,
      },
    }));
  }

  async function saveAutomationSettings() {
    const metadata = {
      ...(settings?.metadata || {}),
      automation_policy: {
        ...automationPolicy,
        updated_at: new Date().toISOString(),
      },
    };
    return saveSettingsPatch({
      brand_voice: form.brand_voice,
      tone: form.tone,
      cta_style: form.cta_style,
      audience_description: form.audience_description,
      automation_level: automationPolicy.mode === "conservative" ? "review_required" : automationPolicy.mode,
      metadata,
    }, "AI and automation behavior saved.");
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
      const parsed = parseCreditPack(pack);
      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "credit_pack_intent",
          pack,
          price_cents: parsed.amountCents,
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

  async function requestServices() {
    try {
      setSavingSection("services");
      setError("");
      setSuccess("");
      if (selectedServices.length === 0) {
        setError("Select at least one service, bundle, or retainer before requesting a consultation.");
        return;
      }
      const response = await fetch("/api/crm/services/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedServices, message: serviceNotes, requested_timeline: serviceTimeline }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to request service consultation.");
      setSuccess(`${selectedServices.length} consultation item${selectedServices.length === 1 ? "" : "s"} saved. SynaptiReach will review before any purchase or checkout.`);
      setServiceRequestModal(false);
      setSelectedServices([]);
      setServiceNotes("");
      setServiceTimeline("");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to request service consultation.");
    } finally {
      setSavingSection("");
    }
  }

  function toggleService(itemName: string) {
    setSelectedServices((current) =>
      current.includes(itemName) ? current.filter((item) => item !== itemName) : [...current, itemName]
    );
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
  const checkoutPlan = SUBSCRIPTION_PLANS.find((plan) => plan.slug === selectedSubscriptionPlan) || SUBSCRIPTION_PLANS.find((plan) => plan.name === selectedPlanName) || SUBSCRIPTION_PLANS[4] || SUBSCRIPTION_PLANS[0];
  const stripeStatus = integrations.stripe || {};
  const stripeReady = Boolean(stripeStatus.checkoutEnabled || stripeStatus.configured);
  const selectedPackDetails = parseCreditPack(selectedCreditPack);
  const serviceItemsByName = SERVICE_CATALOG.reduce((map: Record<string, any>, item) => {
    map[item.itemName] = item;
    return map;
  }, {});
  const selectedServiceItems = selectedServices.map((name) => serviceItemsByName[name]).filter(Boolean);
  const serviceOneTimeTotal = selectedServiceItems.filter((item) => !item.recurring).reduce((sum, item) => sum + Number(item.priceCents || 0), 0);
  const serviceMonthlyTotal = selectedServiceItems.filter((item) => item.recurring).reduce((sum, item) => sum + Number(item.priceCents || 0), 0);
  const groupedServices = SERVICE_CATALOG.reduce((groups: Record<string, any[]>, item) => {
    const group = serviceGroupLabel(item.category);
    groups[group] = [...(groups[group] || []), item];
    return groups;
  }, {});
  const integrationCards = [
    {
      key: "stripe",
      label: "Stripe / Billing",
      icon: CreditCard,
      status: statusLabel(stripeStatus),
      configured: stripeReady,
      description: "Hosted checkout, subscriptions, credit packs, and billing portal sessions.",
      fields: ["Stripe secret key", "Publishable key", "Webhook secret", "Plan price IDs"],
      managed: "SynaptiReach server-side configuration",
    },
    {
      key: "resend",
      label: "Resend / Email",
      icon: Mail,
      status: statusLabel(integrations.resend || connectionByProvider.resend),
      configured: Boolean(integrations.resend || connectionByProvider.resend),
      description: "Transactional email and review-gated outbound email sending.",
      fields: ["Resend API key", "Sender email/domain"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "twilio",
      label: "Twilio / SMS",
      icon: MessageSquare,
      status: statusLabel(integrations.twilio || connectionByProvider.twilio_auth_token),
      configured: Boolean(integrations.twilio || connectionByProvider.twilio_auth_token),
      description: "Review-gated SMS replies and future managed SMS subaccount support.",
      fields: ["Account SID", "Auth token", "From number"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "ayrshare",
      label: "Ayrshare / Social",
      icon: Share2,
      status: statusLabel(integrations.ayrshare || connectionByProvider.ayrshare),
      configured: Boolean(integrations.ayrshare || connectionByProvider.ayrshare),
      description: "Optional social publishing through platform profiles or customer-provided Ayrshare keys.",
      fields: ["Ayrshare API key", "Profile key"],
      managed: "Platform mode by default; Bring Your Own Key for advanced customers",
    },
    {
      key: "calendar",
      label: "Google Calendar / Calendar Sync",
      icon: CalendarDays,
      status: "Future Ready",
      configured: false,
      description: "Calendar sync remains setup-required/future-ready; internal appointments continue working.",
      fields: ["Google OAuth connection"],
      managed: "Customer connection required",
    },
    {
      key: "gmb",
      label: "Google Business Profile",
      icon: Database,
      status: "Future Ready",
      configured: false,
      description: "Future local presence integration for reviews and profile workflows.",
      fields: ["Google Business Profile connection"],
      managed: "Customer connection required",
    },
    {
      key: "openai",
      label: "OpenAI",
      icon: Sparkles,
      status: statusLabel(integrations.openai),
      configured: Boolean(integrations.openai?.configured || connectionByProvider.openai),
      description: "Optional premium AI provider. Disabled unless explicitly enabled server-side.",
      fields: ["OpenAI key", "AI_ENABLE_OPENAI flag"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "gemini",
      label: "Gemini",
      icon: Sparkles,
      status: statusLabel(integrations.gemini || connectionByProvider.gemini),
      configured: Boolean(integrations.gemini?.configured || connectionByProvider.gemini),
      description: "AI provider for enhanced recommendations when configured.",
      fields: ["Gemini API key"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "openrouter",
      label: "OpenRouter",
      icon: Sparkles,
      status: statusLabel(integrations.openrouter || connectionByProvider.openrouter),
      configured: Boolean(integrations.openrouter?.configured || connectionByProvider.openrouter),
      description: "AI provider fallback with configurable model routing.",
      fields: ["OpenRouter API key", "Model"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "local_connector",
      label: "Local Connector",
      icon: ShieldCheck,
      status: "Future Ready",
      configured: false,
      description: "Future optional desktop connector for local AI tasks. Not required for launch.",
      fields: ["Connector app", "Pairing token", "Local model health"],
      managed: "Customer local setup",
    },
  ];

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

          <OwnerFocusPanel
            items={[
              {
                label: "Business profile",
                value: form.business_name ? "Saved" : "Needed",
                detail: "Business identity and sender defaults make CRM drafts, reminders, and settings easier to trust.",
                href: "/dashboard/settings#profile",
                action: "Review profile",
                tone: form.business_name ? "green" : "yellow",
              },
              {
                label: "Integrations",
                value: `${integrationCards.filter((item) => item.configured).length}/${integrationCards.length}`,
                detail: "Provider cards show configured, setup-required, and future-ready services without exposing keys.",
                href: "/dashboard/settings#providers",
                action: "Open integration status",
                tone: "cyan",
              },
              {
                label: "Billing",
                value: stripeReady ? "Ready" : "Setup required",
                detail: "Billing setup stays Stripe-owned. Settings can resume setup without creating fake paid states.",
                href: "/dashboard/settings#billing",
                action: "Review billing",
                tone: stripeReady ? "green" : "yellow",
              },
            ]}
          />

          <SettingsSection
            title="Setup & Usage Intelligence"
            purpose="Provider readiness, Bring Your Own Key setup, billing usage, and launch-readiness checks without exposing secrets."
            status="Readiness signals"
            defaultOpen={false}
          >
            <MiniBrainInsightPanel
              title="Setup & Usage Intelligence"
              subtitle="Provider readiness, Bring Your Own Key setup, billing usage, and launch-readiness checks without exposing secrets."
              types={["billing_usage_intelligence", "onboarding_setup", "safety_compliance", "simulation"]}
            />
          </SettingsSection>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <SettingsSection
                id="profile"
                title="Business Profile"
                purpose="Workspace identity, sender defaults, contact details, and timezone."
                status={`${form.business_name || "Unnamed business"}${form.industry ? ` · ${form.industry}` : ""}${form.contact_email ? ` · ${form.contact_email}` : ""}`}
                defaultOpen={false}
              >
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
              </SettingsSection>

              <SettingsSection
                title="CRM Automation & AI Behavior"
                purpose="Controls message drafting, task recommendations, workflow actions, appointment suggestions, lead scoring, campaign recommendations, and external-send safety."
                status={automationModeLabels[automationPolicy.mode] || "Assisted"}
                alert={automationPolicy.categories?.email_replies === "auto_safe" || automationPolicy.categories?.sms_replies === "auto_safe" ? "External send opt-in review" : undefined}
              >
                <div className="mb-5 rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.05] p-4 text-sm text-cyan-50/75">
                  External email and SMS remain review-gated unless a workspace explicitly opts in and provider readiness is verified. This page saves policy; send routes still require explicit confirmation.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={form.brand_voice || ""} onChange={(event) => updateField("brand_voice", event.target.value)} placeholder="Brand voice" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input value={form.tone || ""} onChange={(event) => updateField("tone", event.target.value)} placeholder="Default response tone" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input value={form.cta_style || ""} onChange={(event) => updateField("cta_style", event.target.value)} placeholder="Preferred CTA style" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <select value={automationPolicy.mode || "assisted"} onChange={(event) => setAutomationPolicy((current: any) => ({ ...current, mode: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                    <option value="conservative">Conservative - Always ask first</option>
                    <option value="assisted">Assisted - Prepare drafts and recommendations</option>
                    <option value="autonomous_allowed">Autonomous Where Allowed - Internal actions only</option>
                  </select>
                  <select value={automationPolicy.external_communication_safety || "review_required"} onChange={(event) => setAutomationPolicy((current: any) => ({ ...current, external_communication_safety: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                    <option value="review_required">External communication safety: Review Needed First</option>
                    <option value="disabled">External communication safety: Disabled</option>
                    <option value="auto_safe">External communication safety: Auto-send where explicitly allowed</option>
                  </select>
                  <select value={automationPolicy.internal_action_safety || "review_required"} onChange={(event) => setAutomationPolicy((current: any) => ({ ...current, internal_action_safety: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                    <option value="review_required">Internal action safety: Review Needed First</option>
                    <option value="auto_safe">Internal action safety: Auto-Apply Where Safe</option>
                    <option value="disabled">Internal action safety: Disabled</option>
                  </select>
                </div>
                <textarea value={form.audience_description || ""} onChange={(event) => updateField("audience_description", event.target.value)} placeholder="Audience / customer profile" className="mt-4 w-full min-h-[120px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <label key={key} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="mb-2 text-sm font-bold text-white">{label}</div>
                      <select value={automationPolicy.categories?.[key] || "review_required"} onChange={(event) => updateAutomationCategory(key, event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white">
                        <option value="review_required">Review Needed First</option>
                        <option value="auto_safe">Auto-Apply / Auto-Send where safe and allowed</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </label>
                  ))}
                </div>
                <button onClick={saveAutomationSettings} disabled={saving} className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-6 py-4 font-black text-black flex items-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                  Save AI & Automation Settings
                </button>
              </SettingsSection>

              <SettingsSection
                title="Connect Your AI Keys"
                purpose="Save customer-provided AI provider keys server-side. Saved keys are encrypted and shown only as masked labels."
                status="Bring Your Own Key"
              >
                <p className="mb-4 text-sm text-gray-400">
                  SynaptiReach keys are never shown. Your Bring Your Own Key credentials are encrypted server-side and displayed only as configured/missing after save.
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
              </SettingsSection>

              <SettingsSection
                title="Connect Sending Integrations"
                purpose="Save customer-provided email, SMS, and social provider credentials without exposing secrets in the browser."
                status="Review-gated sends"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="password" value={integrationKeys.resend} onChange={(event) => setIntegrationKeys({ ...integrationKeys, resend: event.target.value })} placeholder="Resend API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.twilioAccountSid} onChange={(event) => setIntegrationKeys({ ...integrationKeys, twilioAccountSid: event.target.value })} placeholder="Twilio Account SID" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.twilioAuthToken} onChange={(event) => setIntegrationKeys({ ...integrationKeys, twilioAuthToken: event.target.value })} placeholder="Twilio Auth Token" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.ayrshare} onChange={(event) => setIntegrationKeys({ ...integrationKeys, ayrshare: event.target.value })} placeholder="Ayrshare API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                </div>
                <button onClick={() => saveProviderKeys("integration")} disabled={savingSection === "integration"} className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 disabled:opacity-60">
                  {savingSection === "integration" ? "Saving..." : "Save Integration Keys"}
                </button>
              </SettingsSection>
            </div>

            <SettingsSection
              id="providers"
              title="Integration Status"
              purpose="Customer-facing provider status for billing, email, SMS, social, calendar, Google profile, AI providers, and future local connector."
              status={`${integrationCards.filter((item) => item.configured).length} configured`}
              alert={stripeReady ? undefined : "Billing setup required"}
            >
              <div className="grid gap-3 md:grid-cols-2">
                {integrationCards.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <button
                      key={integration.key}
                      onClick={() => openIntegrationConfig(integration)}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Icon className="text-cyan-300" size={18} />
                          <div>
                            <div className="font-bold text-white">{integration.label}</div>
                            <div className="mt-1 text-xs text-gray-500">{integration.description}</div>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${integration.configured ? "border-cyan-400/20 bg-cyan-500/10 text-cyan-100" : "border-yellow-400/20 bg-yellow-500/10 text-yellow-100"}`}>
                          {integration.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SettingsSection>

            <SettingsSection
              title="AI Providers"
              purpose="Provider readiness and routing metadata. Secrets are never displayed."
              status={aiProviders?.priority?.length ? `${aiProviders.priority.length} in routing order` : "Review"}
            >
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
                        <div className="text-xs text-gray-500 mt-1">Bring Your Own Key saved: {connectionByProvider[key].key_label}</div>
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
            </SettingsSection>

            <div className="xl:col-span-3">
            <SettingsSection
              id="billing"
              title="Trial, Caps & Billing Rules"
              purpose="Current plan, trial, billing status, usage caps, and safe Stripe-hosted setup controls."
              status={billing?.status || "Setup Required"}
              alert={stripeReady ? undefined : "Stripe setup required"}
            >
              <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                14-day free trial. No managed SMS during trial unless the user connects their own Twilio provider. Trial caps are hard caps, no overages. Commit before your trial ends and save up to 30%.
              </div>
              <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  ["Plan", planDisplayName(selectedPlanName)],
                  ["Status", billing?.status || "Setup required"],
                  ["Billing Mode", billingModeLabel(billing?.billing_mode)],
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
                      records: [{ type: label, used, cap, plan: planDisplayName(selectedPlan?.name || selectedPlanName) }],
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
                    <div className="mt-2 text-xl font-black text-white">{planDisplayName(selectedPlan?.name || selectedPlanName)}</div>
                  </div>
                  {selectedPlan && "price" in selectedPlan && <div className="text-xl font-black text-cyan-300">{selectedPlan.price}</div>}
                </div>
                {selectedPlan ? (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 text-sm text-gray-400">
                    <div>AI: <span className="text-white">{selectedPlan.aiActions}</span></div>
                    <div>Email: <span className="text-white">{selectedPlan.emails}</span></div>
                    <div>SMS: <span className="text-white">{selectedPlan.sms}</span></div>
                    <div>Contacts: <span className="text-white">{selectedPlan.contacts}</span></div>
                    <div>AI review checks: <span className="text-white">{selectedPlan.agents}</span></div>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-400">No selected plan record found yet. Complete onboarding or billing setup to store the selected tier.</div>
                )}
              </div>
              {billing?.metadata?.checkout_origin === "onboarding" && ["pending_webhook", "checkout_created"].includes(billing?.status) ? (
                <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-50/85">
                  <div className="font-black">Onboarding submitted for billing review</div>
                  <p className="mt-1">
                    Stripe checkout was submitted from onboarding. Trial activation remains pending until Stripe webhook confirmation updates the billing account.
                  </p>
                  <a href="/onboarding?step=billing" className="mt-3 inline-flex rounded-xl border border-yellow-300/30 px-3 py-2 text-xs font-black text-yellow-50">
                    Continue onboarding
                  </a>
                </div>
              ) : null}
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
                    Bring Your Own Key users pay their own provider usage separately. SynaptiReach Managed plans consume included credits and require credit packs or an upgrade after caps are reached.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.04] p-5">
                <h3 className="text-xl font-black">Complete Billing Setup</h3>
                <p className="mt-2 text-sm text-cyan-50/65">
                  Onboarding is the primary place to choose a plan and add a payment method. Settings lets you resume billing setup, change plan, or manage billing later. After the 14-day trial, your selected plan renews automatically unless canceled before the trial ends. Checkout is hosted by Stripe, and no subscription is marked active until Stripe confirms it.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <button key={plan.slug} type="button" onClick={() => setSelectedSubscriptionPlan(plan.slug)} className={`rounded-2xl border p-4 text-left transition ${selectedSubscriptionPlan === plan.slug ? "border-cyan-300/50 bg-cyan-400/10" : "border-white/10 bg-black/30 hover:border-cyan-400/30"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-black text-white">{planDisplayName(plan.name)}</div>
                          <div className="text-xs text-gray-500">{billingModeLabel(plan.billingMode)}</div>
                        </div>
                        <div className="font-black text-cyan-200">{plan.price}</div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        {plan.overCapBehavior}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Selected plan</div>
                      <div className="mt-1 font-black text-white">{planDisplayName(checkoutPlan?.name || "Select a plan")} · {checkoutPlan ? billingModeLabel(checkoutPlan.billingMode) : "Not selected"}</div>
                    </div>
                    <button
                      onClick={() => setBillingSetupModal(true)}
                      disabled={!checkoutPlan || Boolean(savingSection)}
                      className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60"
                    >
                      {stripeReady ? (billing?.stripe_customer_id ? "Change Plan" : "Complete Billing Setup") : "Record Billing Intent"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="mb-3 text-xl font-black">Credit Packs</h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {CREDIT_PACKS.map((pack) => (
                    <button key={pack} type="button" onClick={() => setSelectedCreditPack(pack)} className={`rounded-2xl border p-4 text-left transition ${selectedCreditPack === pack ? "border-cyan-300/50 bg-cyan-400/10" : "border-white/10 bg-black/30 hover:border-cyan-400/30"}`}>
                      <div className="font-bold text-white">{parseCreditPack(pack).name}</div>
                      <div className="mt-1 text-sm text-gray-400">{parseCreditPack(pack).detail}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Selected credit pack</div>
                      <div className="mt-1 font-black text-white">{selectedPackDetails.name} · {selectedPackDetails.priceLabel}</div>
                      <div className="mt-1 text-xs text-gray-500">{selectedPackDetails.detail}. Stripe securely handles payment details.</div>
                    </div>
                    <button onClick={() => setCreditCheckoutModal(true)} disabled={Boolean(savingSection)} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60">
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
              <BillingPurchaseHistory
                billing={billing}
                creditPackPurchases={creditPackPurchases}
                billingEvents={billingEvents}
                serviceRequests={serviceRequests}
                resendConfigured={Boolean(integrations.resend)}
                setSelectedMetric={setSelectedMetric}
                planDisplayName={planDisplayName}
                billingModeLabel={billingModeLabel}
              />
            </SettingsSection>
            </div>

            <div id="services" className="xl:col-span-3">
            <SettingsSection
              title="Services, Bundles & Retainers"
              purpose="Select one or more implementation services and request a consultation. No payment is triggered from this section."
              status={`${selectedServices.length} selected`}
              defaultOpen={false}
            >
              <p className="mb-5 text-sm text-cyan-50/65">
                Request a 30-minute SynaptiReach consultation before purchasing implementation services. Requests are stored for review and do not trigger payment.
              </p>
              <div className="space-y-5">
                {Object.entries(groupedServices).map(([group, items]) => (
                  <div key={group} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h3 className="mb-3 font-black text-white">{group}</h3>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((item) => (
                        <button key={`${item.serviceType}-${item.itemName}`} type="button" onClick={() => toggleService(item.itemName)} className={`rounded-2xl border p-4 text-left transition ${selectedServices.includes(item.itemName) ? "border-cyan-300/50 bg-cyan-400/10" : item.popular ? "border-cyan-300/25 bg-cyan-400/5 hover:border-cyan-400/40" : "border-white/10 bg-black/30 hover:border-cyan-400/30"}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-black text-white">{item.itemName}</div>
                              <div className="text-xs text-gray-500">{item.recurring ? "Monthly retainer" : "One-time service"}</div>
                            </div>
                            <div className="font-black text-cyan-200">{item.priceLabel}</div>
                          </div>
                          {item.popular && <div className="mt-2 text-xs font-black text-green-200">MOST POPULAR</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Selected estimate</div>
                    <div className="mt-1 font-black text-white">
                      ${(serviceOneTimeTotal / 100).toLocaleString()} one-time · ${(serviceMonthlyTotal / 100).toLocaleString()}/mo recurring
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Consultation required before purchase, checkout, or fulfillment.</div>
                  </div>
                  <button onClick={() => setServiceRequestModal(true)} disabled={selectedServices.length === 0 || Boolean(savingSection)} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60">
                    Request Consultation
                  </button>
                </div>
              </div>
            </SettingsSection>
            </div>

            <div className="xl:col-span-3">
            <SettingsSection
              title="Staff & Permissions"
              purpose="Invite staff, review permissions, and prepare for role-based CRM access."
              status={`${staffMembers.length} staff`}
            >
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
            </SettingsSection>
            </div>
          </section>
          {creditReturn && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                  {creditReturn.kind === "subscription" ? "Subscription checkout received" : "Credit pack purchase received"}
                </div>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {creditReturn.purchase?.pack_type || (creditReturn.kind === "subscription" ? "Billing setup submitted" : "Credit pack checkout submitted")}
                </h3>
                <p className="mt-3 text-sm text-gray-300">
                  {creditReturn.status === "paid"
                    ? "Stripe has confirmed this payment. SynaptiReach will reflect the updated state in billing and usage records."
                    : creditReturn.kind === "subscription"
                      ? "Your Stripe checkout was submitted. SynaptiReach will update subscription state only after Stripe webhook confirmation."
                      : "Your payment was submitted. SynaptiReach will apply credits after Stripe confirms the payment."}
                </p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                  Status: <span className="font-bold text-white">{creditReturn.status === "paid" ? "Confirmed" : "Pending Stripe webhook confirmation"}</span>
                </div>
                <button onClick={() => setCreditReturn(null)} className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black">
                  Got it
                </button>
              </div>
            </div>
          )}

          {creditCheckoutModal && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Secure checkout</div>
                <h3 className="mt-2 text-2xl font-black text-white">{selectedPackDetails.name}</h3>
                <p className="mt-3 text-sm text-gray-300">{selectedPackDetails.detail}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm text-gray-400">Amount</div>
                  <div className="mt-1 text-2xl font-black text-white">{selectedPackDetails.priceLabel}</div>
                  <div className="mt-2 text-xs text-gray-500">Stripe securely handles payment details. Credits are not applied until webhook confirmation.</div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => createCreditPackIntent(selectedCreditPack)} disabled={Boolean(savingSection)} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60">
                    {savingSection === selectedCreditPack ? "Creating..." : "Checkout"}
                  </button>
                  <button onClick={() => setCreditCheckoutModal(false)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {billingSetupModal && checkoutPlan && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Billing setup confirmation</div>
                <h3 className="mt-2 text-2xl font-black text-white">{planDisplayName(checkoutPlan.name)}</h3>
                <p className="mt-3 text-sm text-gray-300">
                  This starts Stripe-hosted setup for a 14-day trial. A card is required before trial activation. After the trial, {planDisplayName(checkoutPlan.name)} renews automatically unless canceled before the trial ends.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm text-gray-400">Billing mode</div>
                    <div className="mt-1 font-black text-white">{billingModeLabel(checkoutPlan.billingMode)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm text-gray-400">Monthly price</div>
                    <div className="mt-1 font-black text-white">{checkoutPlan.price}</div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">Stripe handles payment details securely. SynaptiReach employees never see card numbers. Subscription state changes only after verified Stripe webhook events.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => startSubscriptionCheckout(checkoutPlan.slug)} disabled={Boolean(savingSection)} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60">
                    {savingSection === `subscription_${checkoutPlan.slug}` ? "Creating..." : "Continue to Stripe Checkout"}
                  </button>
                  <button onClick={() => setBillingSetupModal(false)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {serviceRequestModal && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Consultation request</div>
                <h3 className="mt-2 text-2xl font-black text-white">Review selected services</h3>
                <div className="mt-4 max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4">
                  {selectedServiceItems.map((item) => (
                    <div key={item.itemName} className="flex items-center justify-between gap-3 border-b border-white/10 py-2 last:border-b-0">
                      <div>
                        <div className="font-bold text-white">{item.itemName}</div>
                        <div className="text-xs text-gray-500">{serviceGroupLabel(item.category)}</div>
                      </div>
                      <div className="font-bold text-cyan-200">{item.priceLabel}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">One-time estimate: <span className="font-black text-white">${(serviceOneTimeTotal / 100).toLocaleString()}</span></div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">Monthly estimate: <span className="font-black text-white">${(serviceMonthlyTotal / 100).toLocaleString()}/mo</span></div>
                </div>
                <input value={serviceTimeline} onChange={(event) => setServiceTimeline(event.target.value)} placeholder="Requested timeline" className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                <textarea value={serviceNotes} onChange={(event) => setServiceNotes(event.target.value)} placeholder="Notes, goals, or implementation needs" className="mt-3 min-h-[110px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                <p className="mt-3 text-xs text-gray-500">A 30-minute consultation is required before purchase. This does not trigger Stripe checkout or mark anything paid.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={requestServices} disabled={savingSection === "services"} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60">
                    {savingSection === "services" ? "Requesting..." : "Request Consultation"}
                  </button>
                  <button onClick={() => setServiceRequestModal(false)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {selectedIntegration && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Integration configuration</div>
                    <h3 className="mt-2 text-2xl font-black text-white">{selectedIntegration.label}</h3>
                  </div>
                  <button onClick={() => setSelectedIntegration(null)} className="rounded-full border border-white/10 px-3 py-1 text-sm text-white">Close</button>
                </div>
                <p className="mt-3 text-sm text-gray-300">{selectedIntegration.description}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                  Status: <span className="font-bold text-white">{selectedIntegration.status}</span>
                </div>
                {(() => {
                  const keyLabels: Record<string, string[]> = {
                    resend: ["resend"],
                    twilio: ["twilio_account_sid", "twilio_auth_token"],
                    ayrshare: ["ayrshare"],
                    gemini: ["gemini"],
                    openrouter: ["openrouter"],
                    openai: ["openai"],
                  };
                  const labels = (keyLabels[selectedIntegration.key] || [])
                    .map((provider) => connectionByProvider[provider]?.key_label)
                    .filter(Boolean);
                  return labels.length > 0 ? (
                    <div className="mt-3 rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.06] p-4 text-xs text-cyan-100">
                      Saved key label{labels.length === 1 ? "" : "s"}: {labels.join(", ")}
                    </div>
                  ) : null;
                })()}
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-2 text-sm font-bold text-white">Required fields</div>
                    <ul className="space-y-1 text-xs text-gray-400">
                      {selectedIntegration.fields.map((field: string) => <li key={field}>{field}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-2 text-sm font-bold text-white">Management mode</div>
                    <div className="text-xs text-gray-400">{selectedIntegration.managed}</div>
                  </div>
                </div>
                {["resend", "twilio", "ayrshare", "gemini", "openrouter", "openai"].includes(selectedIntegration.key) ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-3 text-sm font-bold text-white">Add or update configuration</div>
                    <div className="grid gap-3">
                      {selectedIntegration.key === "resend" && (
                        <input type="password" value={integrationConfig.resend} onChange={(event) => setIntegrationConfig({ ...integrationConfig, resend: event.target.value })} placeholder="Resend API key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                      )}
                      {selectedIntegration.key === "twilio" && (
                        <>
                          <input type="password" value={integrationConfig.twilioAccountSid} onChange={(event) => setIntegrationConfig({ ...integrationConfig, twilioAccountSid: event.target.value })} placeholder="Twilio Account SID" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                          <input type="password" value={integrationConfig.twilioAuthToken} onChange={(event) => setIntegrationConfig({ ...integrationConfig, twilioAuthToken: event.target.value })} placeholder="Twilio Auth Token" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                        </>
                      )}
                      {selectedIntegration.key === "ayrshare" && (
                        <input type="password" value={integrationConfig.ayrshare} onChange={(event) => setIntegrationConfig({ ...integrationConfig, ayrshare: event.target.value })} placeholder="Ayrshare API key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                      )}
                      {selectedIntegration.key === "gemini" && (
                        <input type="password" value={integrationConfig.gemini} onChange={(event) => setIntegrationConfig({ ...integrationConfig, gemini: event.target.value })} placeholder="Gemini API key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                      )}
                      {selectedIntegration.key === "openrouter" && (
                        <>
                          <input type="password" value={integrationConfig.openrouter} onChange={(event) => setIntegrationConfig({ ...integrationConfig, openrouter: event.target.value })} placeholder="OpenRouter API key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                          <input value={integrationConfig.openrouter_model} onChange={(event) => setIntegrationConfig({ ...integrationConfig, openrouter_model: event.target.value })} placeholder="OpenRouter model" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                        </>
                      )}
                      {selectedIntegration.key === "openai" && (
                        <input type="password" value={integrationConfig.openai} onChange={(event) => setIntegrationConfig({ ...integrationConfig, openai: event.target.value })} placeholder="OpenAI key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                      )}
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button onClick={saveSelectedIntegration} disabled={Boolean(savingSection)} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60 sm:w-auto">
                        {savingSection === `integration_modal_${selectedIntegration.key}` ? "Saving..." : "Save / Update"}
                      </button>
                      <button disabled className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-gray-500 sm:w-auto">
                        Test connection future-ready
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-gray-400">
                    This integration is future/setup required. Configuration and test-connection actions will be enabled when a safe provider route exists.
                  </div>
                )}
                <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-xs text-yellow-100">
                  Secrets remain server-side and encrypted through the existing provider connection save path. Saved secrets are never displayed; only masked key labels are shown.
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
