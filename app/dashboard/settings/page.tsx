"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Database, Loader2, Settings, Sparkles, XCircle, Zap } from "lucide-react";

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

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [integrations, setIntegrations] = useState<Record<string, any>>({});
  const [aiProviders, setAiProviders] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/crm/settings");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to load settings.");
      }

      setSettings(data.settings);
      setIntegrations(data.integrations || {});
      setAiProviders(data.aiProviders || null);
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
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: settings?.id, ...form }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to save settings.");
      }

      setSettings(data.settings);
      setSuccess("Settings saved.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen text-white">
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

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-2xl font-black mb-5">Business Profile</h2>
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
                <div className="flex items-center gap-3 mb-5">
                  <Sparkles className="text-cyan-300" size={22} />
                  <h2 className="text-2xl font-black">AI Settings</h2>
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
                  "Vercel Cron": integrations.vercelCron,
                }).map(([label, configured]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center justify-between">
                    <span className="text-sm text-gray-300">{label}</span>
                    <span className={`flex items-center gap-2 text-sm font-bold ${configured ? "text-cyan-300" : "text-red-200"}`}>
                      {configured ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {configured ? "Configured" : "Missing"}
                    </span>
                  </div>
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
          </section>
        </>
      )}
    </main>
  );
}
