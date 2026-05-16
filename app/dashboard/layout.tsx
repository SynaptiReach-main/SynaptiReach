"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Megaphone,
  Bot,
  Workflow,
  MessageSquare,
  ListTodo,
  CalendarDays,
  BarChart3,
  Settings,
  Zap,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    label: "Pipeline",
    href: "/dashboard/pipeline",
    icon: KanbanSquare,
  },
  {
    label: "Marketing",
    href: "/dashboard/marketing",
    icon: Megaphone,
  },
  {
    label: "AI Assistant",
    href: "/dashboard/ai_assistant",
    icon: Bot,
  },
  {
    label: "Workflow/Automation",
    href: "/dashboard/workflow",
    icon: Workflow,
  },
  {
    label: "Communications",
    href: "/dashboard/communications",
    icon: MessageSquare,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: ListTodo,
  },
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDays,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

type Workspace = {
  name: string;
  logo_url?: string | null;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // using shared supabase client

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("synaptireach-crm-sidebar-expanded");
    if (saved === "true") {
      setSidebarOpen(true);
    }
  }, []);

  function updateSidebar(open: boolean) {
    setSidebarOpen(open);
    window.localStorage.setItem("synaptireach-crm-sidebar-expanded", String(open));
  }

  useEffect(() => {
    async function loadWorkspace() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/signin");
        return;
      }

      const { data } = await supabase
        .from("workspaces")
        .select("name")
        .eq("owner_id", session.user.id)
        .maybeSingle();

      if (data) {
        setWorkspace(data);
      }
    }

    loadWorkspace();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* SIDEBAR */}
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => updateSidebar(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen border-r border-cyan-400/10 bg-black/85 backdrop-blur-2xl flex flex-col z-40 transition-all duration-300 ${
          sidebarOpen
            ? "w-72 translate-x-0 p-5"
            : "w-20 -translate-x-full p-4 lg:translate-x-0"
        }`}
      >

        {/* LOGO + WORDMARK */}
        <div className="flex items-center gap-3 mb-8">

          <div className="w-11 h-11 shrink-0 rounded-2xl overflow-hidden border border-cyan-400/25 bg-cyan-400/10 flex items-center justify-center shadow-lg shadow-cyan-500/10">

            {workspace?.logo_url ? (
              <Image
                src={workspace.logo_url}
                alt="Logo"
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <Zap
                className="text-cyan-400"
                size={20}
              />
            )}

          </div>

          {sidebarOpen && (
          <div className="min-w-0">

            <h1 className="text-lg font-black tracking-wide truncate">
              <span className="text-white">
                {workspace?.name ||
                  "SynaptiReach"}
              </span>
            </h1>

            <p className="text-xs bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent font-semibold">
              AI CRM Workspace
            </p>

          </div>
          )}

          <button
            onClick={() => updateSidebar(!sidebarOpen)}
            className="ml-auto hidden lg:flex w-10 h-10 rounded-2xl border border-white/10 bg-white/[0.04] items-center justify-center text-cyan-200 hover:bg-cyan-500/10"
            aria-label={sidebarOpen ? "Collapse navigation" : "Expand navigation"}
          >
            {sidebarOpen ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
          </button>

        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2 flex-1">

          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 border ${
                  active
                    ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-200 shadow-lg shadow-cyan-500/10"
                    : "border-transparent text-gray-500 hover:text-white hover:bg-white/5"
                } ${sidebarOpen ? "justify-start" : "justify-center"}`}
                title={item.label}
                onClick={() => window.innerWidth < 1024 && updateSidebar(false)}
              >
                <Icon size={18} />

                {sidebarOpen && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
                )}

              </Link>
            );
          })}

        </nav>

        {/* SIGN OUT */}
        <div className="pt-6">

          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400">

            <button
              onClick={handleSignOut}
              className="w-full rounded-2xl bg-black hover:bg-black/80 transition-all px-4 py-3 flex items-center justify-center gap-2 font-semibold"
              title="Sign Out"
            >
              <LogOut size={16} />

              {sidebarOpen && "Sign Out"}
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 lg:ml-20 min-h-screen min-w-0">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">

            <button
              onClick={() => updateSidebar(true)}
              className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-cyan-300 hover:bg-cyan-500/10"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">

            <h2 className="text-xl md:text-2xl font-black truncate">
              {navItems.find(
                (i) => i.href === pathname
              )?.label || "Dashboard"}
            </h2>

            <p className="text-sm text-gray-500">
              Live AI CRM Workspace
            </p>

          </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">

            <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
              AI Online
            </div>

            <div className="px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-300 text-sm font-semibold">
              Synced
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <div className="p-4 md:p-8">
          {children}
        </div>

      </main>

    </div>
  );
}
