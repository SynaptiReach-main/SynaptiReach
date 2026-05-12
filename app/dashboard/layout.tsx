"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Megaphone,
  Bot,
  Workflow,
  MessageSquare,
  Settings,
  Zap,
  LogOut,
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
    label: "Workflow",
    href: "/dashboard/workflow",
    icon: Workflow,
  },
  {
    label: "Communications",
    href: "/dashboard/communications",
    icon: MessageSquare,
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
        .select("name, logo_url")
        .eq("owner_id", session.user.id)
        .single();

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
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/10 bg-black/80 backdrop-blur-xl p-6 flex flex-col z-40">

        {/* LOGO + WORDMARK */}
        <div className="flex items-center gap-3 mb-10">

          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">

            {workspace?.logo_url ? (
              <Image
                src={workspace.logo_url}
                alt="Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <Zap
                className="text-cyan-400"
                size={20}
              />
            )}

          </div>

          <div>

            <h1 className="text-lg font-black tracking-wide">
              <span className="text-white">
                {workspace?.name ||
                  "SynaptiReach"}
              </span>
            </h1>

            <p className="text-xs bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent font-semibold">
              AI CRM Workspace
            </p>

          </div>

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

        {/* SIGN OUT */}
        <div className="pt-6">

          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400">

            <button
              onClick={handleSignOut}
              className="w-full rounded-2xl bg-black hover:bg-black/80 transition-all px-4 py-3 flex items-center justify-center gap-2 font-semibold"
            >
              <LogOut size={16} />

              Sign Out
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 ml-72 min-h-screen">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl px-8 py-5 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-black">
              {navItems.find(
                (i) => i.href === pathname
              )?.label || "Dashboard"}
            </h2>

            <p className="text-sm text-gray-500">
              Live AI CRM Workspace
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
              AI Online
            </div>

            <div className="px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-300 text-sm font-semibold">
              Synced
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <div className="p-8">
          {children}
        </div>

      </main>

    </div>
  );
}
