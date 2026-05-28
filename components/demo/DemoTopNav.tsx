"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Home,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

const demoTabs = [
  { label: "Dashboard", href: "/demo/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/demo/leads", icon: Users },
  { label: "Marketing", href: "/demo/marketing", icon: Megaphone },
  { label: "CRM Intelligence", href: "/demo/ai_assistant", icon: Bot },
  { label: "Workflow", href: "/demo/workflow", icon: Workflow },
  { label: "Communications", href: "/demo/communications", icon: MessageSquare },
  { label: "Settings", href: "/demo/settings", icon: Settings },
];

const actionLinks = [
  { label: "Back to Main Site", href: "/", icon: Home },
  { label: "Start 14-Day Trial", href: "/trial", icon: Sparkles, cta: true },
];

export default function DemoTopNav() {
  const pathname = usePathname();

  return (
    <div className="relative z-10 mb-6 rounded-3xl border border-cyan-400/15 bg-black/70 p-3 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
      <div className="mb-3 flex flex-col gap-2 px-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            Public Demo
          </div>
          <p className="text-xs text-gray-500">
            Simulation data only. Use the tabs to explore the demo workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actionLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-10 items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition ${
                  item.cta
                    ? "border-cyan-300/30 bg-gradient-to-r from-cyan-300/15 to-green-300/15 text-cyan-100 hover:border-cyan-300/50"
                    : "border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <nav className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-2">
          {demoTabs.map((tab) => {
            const Icon = tab.icon;
            const active = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-500/10"
                    : "border-transparent text-gray-500 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
