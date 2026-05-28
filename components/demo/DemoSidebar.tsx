"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  PlayCircle,
  Settings,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Demo Home", href: "/demo", icon: PlayCircle },
  { label: "Dashboard", href: "/demo/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/demo/leads", icon: Users },
  { label: "Marketing", href: "/demo/marketing", icon: Megaphone },
  { label: "Communications", href: "/demo/communications", icon: MessageSquare },
  { label: "CRM Intelligence", href: "/demo/ai_assistant", icon: Bot },
  { label: "Workflow", href: "/demo/workflow", icon: Workflow },
  { label: "Settings", href: "/demo/settings", icon: Settings },
];

const secondaryItems = [
  { label: "Back to Main Site", href: "/", icon: Home },
  { label: "Start 14-Day Trial", href: "/trial", icon: Sparkles, cta: true },
];

type DemoSidebarProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

export default function DemoSidebar({
  expanded,
  onExpandedChange,
}: DemoSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(true);

  function isActive(href: string) {
    return href === "/demo" ? pathname === href : pathname === href;
  }

  const sidebar = (mobile = false) => (
    <aside
      className={`h-full border-r border-cyan-400/10 bg-black/85 backdrop-blur-2xl flex flex-col transition-all duration-300 ${
        mobile || expanded ? "w-72 p-5" : "w-20 p-4"
      }`}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="h-11 w-11 shrink-0 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <Zap className="text-cyan-300" size={19} />
        </div>
        {(mobile || expanded) && (
          <div className="min-w-0">
            <h1 className="truncate text-sm font-black text-white">SynaptiReach</h1>
            <p className="text-xs text-cyan-200/60">Public demo simulation</p>
          </div>
        )}
        {mobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-300"
            aria-label="Close demo navigation"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => onExpandedChange(!expanded)}
            className="ml-auto hidden h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04] lg:flex items-center justify-center text-cyan-200 hover:bg-cyan-500/10"
            aria-label={expanded ? "Collapse demo navigation" : "Expand demo navigation"}
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto pr-1">
        {(mobile || expanded) && (
          <button
            onClick={() => setDemoOpen((current) => !current)}
            className="mb-2 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-black text-cyan-100"
            aria-expanded={demoOpen}
          >
            <span>Demo Pages</span>
            <ChevronDown size={17} className={`transition-transform ${demoOpen ? "rotate-180" : ""}`} />
          </button>
        )}

        {(!mobile && !expanded ? navItems : demoOpen ? navItems : []).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={() => mobile && setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                  active
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-lg shadow-cyan-500/10"
                    : "border-transparent text-gray-500 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                } ${mobile || expanded ? "justify-start" : "justify-center"}`}
              >
                <Icon size={18} className="shrink-0" />
                {(mobile || expanded) && <span className="text-sm font-semibold">{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      <div className="space-y-2 border-t border-white/10 pt-4">
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                item.cta
                  ? "border-cyan-300/30 bg-gradient-to-r from-cyan-300/15 to-green-300/15 text-cyan-100"
                  : "border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
              } ${mobile || expanded ? "justify-start" : "justify-center"}`}
            >
              <Icon size={18} className="shrink-0" />
              {(mobile || expanded) && <span className="text-sm font-bold">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 h-12 w-12 rounded-2xl border border-cyan-400/20 bg-black/80 backdrop-blur-xl flex items-center justify-center text-cyan-200 shadow-xl shadow-cyan-500/10 lg:hidden"
        aria-label="Open demo navigation"
      >
        <Menu size={21} />
      </button>

      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        {sidebar(false)}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            aria-label="Close demo navigation overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full max-w-[18rem]">{sidebar(true)}</div>
        </div>
      )}
    </>
  );
}
