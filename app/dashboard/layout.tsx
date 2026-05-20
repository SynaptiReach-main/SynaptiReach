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
  Bell,
  CheckCheck,
  Command,
  Search,
  X,
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

type CRMNotification = {
  id: string;
  title: string;
  message?: string | null;
  type?: string;
  priority?: string;
  status?: string;
  href?: string | null;
  derived?: boolean;
  created_at?: string;
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
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [commandData, setCommandData] = useState<any>(null);
  const [commandLoading, setCommandLoading] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<any>(null);

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

  async function loadNotifications() {
    setNotificationsLoading(true);
    try {
      const response = await fetch("/api/crm/notifications", { cache: "no-store" });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } finally {
      setNotificationsLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [pathname]);

  useEffect(() => {
    async function loadSimulationStatus() {
      try {
        const response = await fetch("/api/test/simulation/status", { cache: "no-store" });
        const data = await response.json();
        setSimulationStatus(data?.allowed ? data : null);
      } catch {
        setSimulationStatus(null);
      }
    }

    loadSimulationStatus();
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === "Escape") setCommandOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function loadCommandData() {
    if (commandData || commandLoading) return;
    setCommandLoading(true);
    try {
      const response = await fetch("/api/crm/dashboard", { cache: "no-store" });
      const data = await response.json();
      if (data.success) setCommandData(data.data);
    } finally {
      setCommandLoading(false);
    }
  }

  useEffect(() => {
    if (commandOpen) loadCommandData();
  }, [commandOpen]);

  async function markNotificationsRead(item?: CRMNotification) {
    setNotifications((current) =>
      current.map((notification) =>
        item?.id
          ? notification.id === item.id
            ? { ...notification, status: "read" }
            : notification
          : { ...notification, status: "read" }
      )
    );

    if (item?.derived) return;

    try {
      await fetch("/api/crm/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item?.id ? { id: item.id } : { mark_all_read: true }),
      });
      await loadNotifications();
    } catch {
      await loadNotifications();
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  const commandQuickActions = [
    { label: "Create Lead", href: "/dashboard/leads", type: "action" },
    { label: "Import Leads CSV", href: "/dashboard/leads", type: "action" },
    { label: "Create Campaign", href: "/dashboard/marketing", type: "action" },
    { label: "Create Workflow", href: "/dashboard/workflow", type: "action" },
    { label: "Ask AI Assistant", href: "/dashboard/ai_assistant", type: "action" },
    { label: "Add Task", href: "/dashboard/tasks", type: "action" },
    { label: "View Pipeline", href: "/dashboard/pipeline", type: "action" },
  ];
  const commandRecords = [
    ...(commandData?.leads || []).map((item: any) => ({
      label: item.name || item.email || "Lead",
      detail: [item.email, item.status, item.company].filter(Boolean).join(" · "),
      href: "/dashboard/leads",
      type: "lead",
    })),
    ...(commandData?.deals || []).map((item: any) => ({
      label: item.title || item.name || "Deal",
      detail: [item.stage, item.status, item.value ? `$${Number(item.value).toLocaleString()}` : ""].filter(Boolean).join(" · "),
      href: "/dashboard/pipeline",
      type: "deal",
    })),
    ...(commandData?.tasks || []).map((item: any) => ({
      label: item.title || "Task",
      detail: [item.status, item.priority].filter(Boolean).join(" · "),
      href: "/dashboard/tasks",
      type: "task",
    })),
    ...(commandData?.campaigns || []).map((item: any) => ({
      label: item.subject || item.name || `${item.type || "Campaign"} campaign`,
      detail: [item.type, item.status].filter(Boolean).join(" · "),
      href: "/dashboard/marketing",
      type: "campaign",
    })),
    ...(commandData?.communications || []).map((item: any) => ({
      label: item.subject || item.recipient || "Communication",
      detail: [item.channel, item.status].filter(Boolean).join(" · "),
      href: "/dashboard/communications",
      type: "communication",
    })),
  ];
  const commandResults = [...commandQuickActions, ...commandRecords]
    .filter((item) => {
      const q = commandQuery.toLowerCase();
      if (!q) return true;
      return [item.label, (item as any).detail, item.type].filter(Boolean).some((value) => String(value).toLowerCase().includes(q));
    })
    .slice(0, 12);

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
              {simulationStatus ? "Simulated test workspace data" : "Live AI CRM Workspace"}
            </p>

          </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {simulationStatus && (
              <div className="hidden rounded-xl border border-green-400/20 bg-green-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-200 md:block">
                Simulated Test Workspace
              </div>
            )}
            <button
              onClick={() => setCommandOpen(true)}
              className="flex h-11 w-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-gray-400 transition hover:border-cyan-400/20 hover:bg-cyan-500/10 hover:text-cyan-100 md:w-auto md:px-4"
              aria-label="Open command palette"
            >
              <Command size={16} />
              <span className="hidden md:inline">Search or jump</span>
              <span className="hidden rounded-lg border border-white/10 px-2 py-0.5 text-xs text-gray-500 md:inline">Ctrl K</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200 transition hover:bg-cyan-500/15"
                aria-label="Open notifications"
              >
                <Bell size={18} />
                {notifications.filter((item) => item.status !== "read").length > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-gradient-to-r from-cyan-300 to-green-300 px-1.5 py-0.5 text-[10px] font-black text-black">
                    {notifications.filter((item) => item.status !== "read").length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/95 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-cyan-400/10 p-4">
                    <div>
                      <div className="text-sm font-black text-white">Notifications</div>
                      <div className="text-xs text-cyan-50/45">
                        Real CRM activity and reminders
                      </div>
                    </div>
                    <button
                      onClick={() => markNotificationsRead()}
                      className="inline-flex items-center gap-1 rounded-xl border border-cyan-400/20 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-500/10"
                    >
                      <CheckCheck size={14} />
                      Read
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto p-2">
                    {notificationsLoading ? (
                      <div className="p-4 text-sm text-cyan-50/55">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-sm text-cyan-50/55">
                        No notifications yet. New CRM activity, due tasks, appointment reminders, campaigns, and AI recommendations will appear here.
                      </div>
                    ) : (
                      notifications.slice(0, 12).map((item) => (
                        <Link
                          key={item.id}
                          href={item.href || pathname}
                          onClick={() => {
                            setNotificationsOpen(false);
                            markNotificationsRead(item);
                          }}
                          className="block rounded-2xl border border-transparent p-3 transition hover:border-cyan-400/15 hover:bg-cyan-500/10"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-white">{item.title}</div>
                              {item.message && (
                                <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-cyan-50/55">
                                  {item.message}
                                </div>
                              )}
                              {item.created_at && (
                                <div className="mt-2 text-[11px] text-cyan-50/35">
                                  {new Date(item.created_at).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.priority === "high" ? "bg-green-300" : "bg-cyan-300"}`} />
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3">

            <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
              AI Online
            </div>

            <div className="px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-300 text-sm font-semibold">
              Synced
            </div>

            </div>
          </div>

        </header>

        {/* CONTENT */}
        <div className="p-4 md:p-8">
          {children}
        </div>

      </main>

      {commandOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/95 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <Search className="text-cyan-300" size={18} />
              <input
                autoFocus
                value={commandQuery}
                onChange={(event) => setCommandQuery(event.target.value)}
                placeholder="Search leads, deals, tasks, campaigns, communications..."
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-gray-600"
              />
              <button onClick={() => setCommandOpen(false)} className="rounded-xl border border-white/10 p-2 text-gray-300 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {commandLoading ? (
                <div className="p-4 text-sm text-gray-400">Loading real CRM records...</div>
              ) : commandResults.length === 0 ? (
                <div className="p-4 text-sm text-gray-400">No matching real CRM records or quick actions.</div>
              ) : (
                commandResults.map((item, index) => (
                  <Link
                    key={`${item.type}-${item.label}-${index}`}
                    href={item.href}
                    onClick={() => {
                      setCommandOpen(false);
                      setCommandQuery("");
                    }}
                    className="block rounded-2xl border border-transparent p-3 transition hover:border-cyan-400/20 hover:bg-cyan-500/10"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-white">{item.label}</div>
                        {(item as any).detail && <div className="mt-1 truncate text-xs text-gray-500">{(item as any).detail}</div>}
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-cyan-100">{item.type}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
