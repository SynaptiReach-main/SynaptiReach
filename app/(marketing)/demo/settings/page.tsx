export {};
"use client";

import {
  Settings,
  ShieldCheck,
  Bell,
  User,
  KeyRound,
  Globe,
  Cpu,
  CheckCircle2,
  Sparkles,
  Mail,
  Bot,
  Save,
  Server,
  Database,
  Workflow,
  Palette,
  Smartphone,
  Lock,
  Cloud,
  Monitor,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
            <Settings className="text-cyan-400" size={32} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white">
              Platform Settings
            </h1>

            <p className="text-gray-400 mt-2 max-w-3xl">
              Configure AI infrastructure, automation systems,
              CRM behavior, communication integrations, branding,
              security policies, analytics, and platform preferences.
            </p>
          </div>
        </div>

        <button className="px-6 py-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center gap-2">
          <Save size={18} />
          Save All Changes
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="2xl:col-span-2 space-y-8">

          {/* ACCOUNT */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-8">
              <User className="text-cyan-400" size={22} />
              <h2 className="text-2xl font-bold text-white">
                Account Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Business Name
                </label>

                <input
                  defaultValue="SynaptiReach"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Admin Email
                </label>

                <input
                  defaultValue="admin@synaptireach.ai"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Timezone
                </label>

                <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none">
                  <option>Central Time (US)</option>
                  <option>Eastern Time (US)</option>
                  <option>Pacific Time (US)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Language
                </label>

                <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none">
                  <option>English</option>
                  <option>Spanish</option>
                </select>
              </div>

            </div>
          </div>

          {/* AI */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">

            <div className="flex items-center gap-3 mb-8">
              <Bot className="text-emerald-400" size={22} />
              <h2 className="text-2xl font-bold text-white">
                AI Integrations
              </h2>
            </div>

            <div className="space-y-6">

              {[
                ["OpenAI API Key", "sk-..."],
                ["Gemini API Key", "AIza..."],
                ["Claude API Key", "claude-api-key"],
              ].map(([title, placeholder]) => (
                <div
                  key={title}
                  className="bg-black/30 border border-white/5 rounded-3xl p-6"
                >
                  <label className="block text-sm text-gray-400 mb-3">
                    {title}
                  </label>

                  <input
                    placeholder={placeholder}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                  />
                </div>
              ))}

            </div>
          </div>

          {/* AI BEHAVIOR */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">

            <div className="flex items-center gap-3 mb-8">
              <Cpu className="text-purple-400" size={22} />

              <h2 className="text-2xl font-bold text-white">
                AI Behavior Controls
              </h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {[
                "Enable Autonomous Suggestions",
                "Auto Lead Scoring",
                "Enable AI Conversations",
                "Enable AI Email Writing",
                "Smart Workflow Automation",
                "Predictive Analytics",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-5 rounded-2xl bg-black/30 border border-white/5"
                >
                  <span className="text-gray-300 text-sm">
                    {item}
                  </span>

                  <div className="w-11 h-6 rounded-full bg-cyan-500/20 relative">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-cyan-400" />
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* TWILIO */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">

            <div className="flex items-center gap-3 mb-8">
              <Smartphone className="text-green-400" size={22} />

              <h2 className="text-2xl font-bold text-white">
                Twilio SMS / Calling
              </h2>
            </div>

            <div className="space-y-5">

              <input
                placeholder="Twilio Account SID"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
              />

              <input
                placeholder="Twilio Auth Token"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
              />

              <input
                placeholder="Twilio Phone Number"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
              />

            </div>
          </div>

          {/* SOCIAL */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">

            <div className="flex items-center gap-3 mb-8">
              <Globe className="text-pink-400" size={22} />

              <h2 className="text-2xl font-bold text-white">
                Social Integrations
              </h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              <div className="bg-black/30 border border-white/5 rounded-3xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Facebook
                </h3>

                <input
                  placeholder="Facebook App ID"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                />

                <input
                  placeholder="Facebook Access Token"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                />
              </div>

              <div className="bg-black/30 border border-white/5 rounded-3xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Instagram
                </h3>

                <input
                  placeholder="Instagram Business ID"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                />

                <input
                  placeholder="Instagram Access Token"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                />
              </div>

            </div>
          </div>

          {/* EMAIL */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">

            <div className="flex items-center gap-3 mb-8">
              <Mail className="text-cyan-400" size={22} />

              <h2 className="text-2xl font-bold text-white">
                Email / Resend
              </h2>
            </div>

            <div className="space-y-5">

              <input
                placeholder="Resend API Key"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
              />

              <input
                placeholder="Sender Domain"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
              />

              <input
                placeholder="Sender Email"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
              />

            </div>
          </div>

          {/* CRM */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-8">

            <div className="flex items-center gap-3 mb-8">
              <Database className="text-orange-400" size={22} />

              <h2 className="text-2xl font-bold text-white">
                CRM & Pipeline Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {[
                "Auto Assign Leads",
                "Enable Opportunity Tracking",
                "Duplicate Lead Detection",
                "Pipeline Stage Automation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-5 rounded-2xl bg-black/30 border border-white/5"
                >
                  <span className="text-sm text-gray-300">
                    {item}
                  </span>

                  <div className="w-11 h-6 rounded-full bg-cyan-500/20 relative">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-cyan-400" />
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-8">

          {/* SECURITY */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-emerald-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                Security
              </h3>
            </div>

            <div className="space-y-4">

              {[
                "2FA Authentication",
                "Encrypted Sessions",
                "Protected API Access",
                "Firewall Enabled",
                "Threat Monitoring",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5"
                >
                  <span className="text-gray-300 text-sm">
                    {item}
                  </span>

                  <CheckCircle2
                    className="text-emerald-400"
                    size={18}
                  />
                </div>
              ))}

            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-orange-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                Notifications
              </h3>
            </div>

            <div className="space-y-4">

              {[
                "Lead Alerts",
                "AI Activity Reports",
                "Campaign Updates",
                "Workflow Errors",
                "Security Notifications",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5"
                >
                  <span className="text-sm text-gray-300">
                    {item}
                  </span>

                  <div className="w-10 h-5 rounded-full bg-cyan-500/20 relative">
                    <div className="absolute right-1 top-0.5 w-4 h-4 rounded-full bg-cyan-400" />
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* SYSTEM */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <Server className="text-purple-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                System Status
              </h3>
            </div>

            <div className="space-y-5">

              {[
                ["AI Core", "Operational"],
                ["CRM Database", "Healthy"],
                ["Automation Engine", "Online"],
                ["Email Infrastructure", "Connected"],
                ["Cloud Sync", "Active"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/5 pb-4"
                >
                  <span className="text-gray-400 text-sm">
                    {label}
                  </span>

                  <span className="text-emerald-300 text-sm">
                    {value}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* APPEARANCE */}
          <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-[32px] p-6">

            <div className="flex items-center gap-3 mb-6">
              <Palette className="text-pink-400" size={20} />

              <h3 className="text-2xl font-bold text-white">
                Appearance
              </h3>
            </div>

            <div className="space-y-4">

              <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none">
                <option>Dark Mode</option>
                <option>System Theme</option>
              </select>

              <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none">
                <option>Cyan Theme</option>
                <option>Purple Theme</option>
              </select>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
