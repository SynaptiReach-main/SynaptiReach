export {};
"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";

type Workspace = {
  id: string;
  name: string;
  industry: string;

  monthly_revenue: number;
  yearly_revenue: number;

  lead_count: number;
  open_tasks: number;
  response_rate: number;

  ai_personality: string;
  response_time: string;

  integrations: string[];

  services: string[];

  peak_months: string[];
  slow_months: string[];

  products: string[];
  promoted_products: string[];

  pipeline_state: any;
  automation_state: any;
  ai_ceo_state: any;
};

export default function DashboardPage() {

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadWorkspace() {

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/signin";
        return;
      }

      const { data, error } =
        await supabase
          .from("workspaces")
          .select("*")
          .eq("owner_id", session.user.id)
          .maybeSingle();

      if (error) {
        console.error(error);
      } else {
        setWorkspace(data);
      }

      setLoading(false);
    }

    loadWorkspace();

  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl font-bold">
          Loading Workspace...
        </div>
      </main>
    );
  }

  if (!workspace) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl font-bold">
          No workspace found.
        </div>
      </main>
    );
  }

  const stats = [
    {
      label: "Monthly Revenue",
      value: `$${workspace.monthly_revenue || 0}`,
      change: "live",
    },
    {
      label: "Lead Count",
      value: workspace.lead_count || 0,
      change: "dynamic",
    },
    {
      label: "Open Tasks",
      value: workspace.open_tasks || 0,
      change: "tracked",
    },
    {
      label: "Response Rate",
      value: workspace.response_rate
        ? `${workspace.response_rate}%`
        : "N/A",
      change: "computed",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8">

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl p-8">

        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 left-0 w-72 h-72 bg-cyan-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 text-xs tracking-widest uppercase mb-5">
              {workspace.industry}
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
              {workspace.name}

              <span className="block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                AI Workspace
              </span>
            </h1>

            <p className="text-gray-400 mt-5 max-w-2xl leading-relaxed">
              AI personality:
              {" "}
              <span className="text-cyan-300">
                {workspace.ai_personality}
              </span>

              <br />

              Response speed:
              {" "}
              <span className="text-emerald-300">
                {workspace.response_time}
              </span>
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[320px]">

            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-5">

              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Integrations
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {workspace.integrations?.length || 0}
              </h2>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-5">

              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Services
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {0 || 0}
              </h2>

            </div>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((s) => (

          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl p-6"
          >

            <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
              {s.label}
            </p>

            <div className="flex items-end justify-between mt-4">

              <h2 className="text-4xl font-black text-white">
                {s.value}
              </h2>

              <span className="text-emerald-400 text-sm font-medium">
                {s.change}
              </span>

            </div>

          </div>

        ))}

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-6">

          <h3 className="text-xl font-bold mb-5">
            Products
          </h3>

          <div className="space-y-3">

            {workspace.products?.map((product) => (

              <div
                key={product}
                className="rounded-2xl border border-white/5 bg-black/20 p-4"
              >
                {product}
              </div>

            ))}

          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-6">

          <h3 className="text-xl font-bold mb-5">
            AI CEO Priorities
          </h3>

          <div className="space-y-3">

            {workspace.ai_ceo_state?.priorities?.map(
              (priority: string) => (

                <div
                  key={priority}
                  className="rounded-2xl border border-white/5 bg-black/20 p-4"
                >
                  {priority}
                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
