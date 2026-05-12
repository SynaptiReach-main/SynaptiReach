export {};
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Bot,
  Workflow,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/demo/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Leads",
    href: "/demo/leads",
    icon: Users,
  },
  {
    label: "Marketing",
    href: "/demo/marketing",
    icon: Megaphone,
  },
  {
    label: "AI Assistant",
    href: "/demo/ai_assistant",
    icon: Bot,
  },
  {
    label: "Workflow",
    href: "/demo/workflow",
    icon: Workflow,
  },
  {
    label: "Communications",
    href: "/demo/communications",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/demo/settings",
    icon: Settings,
  },
];

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/10 bg-black/80 backdrop-blur-xl p-6 flex flex-col z-40">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Zap className="text-cyan-400" size={18} />
          </div>

          <div>
            <h1 className="text-white font-semibold tracking-wide">
              SynaptiReach
            </h1>
            <p className="text-xs text-gray-500">
              Enterprise AI Platform
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${
                  active
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                    : "border-transparent text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
