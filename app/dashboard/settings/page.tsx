"use client";

import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Globe,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="min-h-screen text-white">

      {/* HEADER */}
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
          Configure workspace preferences, integrations,
          notifications, branding, automation controls,
          and AI CRM system behavior.
        </p>

      </div>

      {/* SETTINGS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {[
          {
            title: "Workspace Profile",
            description:
              "Manage company branding, business identity, and CRM workspace details.",
            icon: User,
          },
          {
            title: "Notifications",
            description:
              "Configure email alerts, AI notifications, and communication preferences.",
            icon: Bell,
          },
          {
            title: "Security",
            description:
              "Manage authentication, account security, permissions, and access control.",
            icon: Shield,
          },
          {
            title: "Appearance",
            description:
              "Customize dashboard visuals, themes, workspace styling, and UI settings.",
            icon: Palette,
          },
          {
            title: "Integrations",
            description:
              "Connect external services, APIs, automation providers, and CRM tools.",
            icon: Globe,
          },
          {
            title: "Data Management",
            description:
              "Manage storage, exports, backups, synchronization, and AI analytics.",
            icon: Database,
          },
        ].map((setting) => {
          const Icon = setting.icon;

          return (
            <div
              key={setting.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6"
            >

              <div className="flex items-start justify-between mb-6">

                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Icon
                    className="text-cyan-300"
                    size={24}
                  />
                </div>

                <div className="px-3 py-1 rounded-xl border border-green-500/20 bg-green-500/10 text-green-300 text-xs font-semibold">
                  Active
                </div>

              </div>

              <h2 className="text-2xl font-black mb-3">
                {setting.title}
              </h2>

              <p className="text-gray-400 leading-relaxed mb-6">
                {setting.description}
              </p>

              <button className="px-5 py-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all text-cyan-300 font-semibold">
                Open Settings
              </button>

            </div>
          );
        })}

      </div>

      {/* AI CONFIGURATION */}
      <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Zap
              className="text-cyan-300"
              size={28}
            />
          </div>

          <div>

            <h2 className="text-3xl font-black">
              AI CRM Configuration
            </h2>

            <p className="text-cyan-200/70 mt-1">
              Live automation and intelligence systems
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {[
            "AI Lead Scoring",
            "Automated Follow-ups",
            "Workflow Automation",
            "Customer Intelligence",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >

              <div className="flex items-center justify-between mb-4">

                <div className="text-sm font-semibold">
                  {item}
                </div>

                <div className="w-3 h-3 rounded-full bg-green-400" />

              </div>

              <div className="text-green-300 text-sm font-medium">
                Enabled
              </div>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}
