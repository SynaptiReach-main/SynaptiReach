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
  integrations: string[];
  onboarding_data: any;
  intelligence: any;
  ai_ceo_state: any;
};

export default function DashboardPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspace() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/signin";
        return;
      }

      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("owner_id", session.user.id)
        .maybeSingle();

      if (error) console.error(error);
      else setWorkspace(data);
      setLoading(false);
    }
    loadWorkspace();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
      </main>
    );
  }

  if (!workspace) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">No workspace found.</p>
          <a href="/onboarding" className="text-cyan-400 underline">Complete onboarding</a>
        </div>
      </main>
    );
  }

  const od = workspace.onboarding_data || {};
  const aiPersonality = od.aiPersonality || "—";
  const responseTime = od.responseTime || "—";
  const services = od.services || [];
  const integrations = workspace.integrations || od.integrations || [];
  const products = od.products || "";
  const promotedProducts = od.promotedProducts || "";
  const peakMonths = od.peakMonths || [];
  const slowMonths = od.slowMonths || [];
  const priorities = workspace.ai_ceo_state?.priorities || [];

  const stats = [
    { label: "Monthly Revenue", value: `$${(workspace.monthly_revenue || od.monthlyRevenue || 0).toLocaleString()}` },
    { label: "Yearly Revenue", value: `$${(workspace.yearly_revenue || od.yearlyRevenue || 0).toLocaleString()}` },
    { label: "Integrations", value: integrations.length },
    { label: "Services Active", value: services.length },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8">

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl p-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 left-0 w-72 h-72 bg-cyan-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[120px]" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 text-xs tracking-widest uppercase mb-5">
            {workspace.industry}
          </div>
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
            {workspace.name}
            <span className="block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              AI Workspace
            </span>
          </h1>
          <p className="text-gray-400 mt-4">
            AI Personality: <span className="text-cyan-300 capitalize">{aiPersonality}</span>
            {" · "}
            Response Speed: <span className="text-emerald-300">{responseTime}</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl p-6">
            <p className="text-gray-500 text-xs uppercase tracking-widest">{s.label}</p>
            <h2 className="text-3xl font-black text-white mt-3">{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Products */}
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-6">
          <h3 className="text-xl font-bold mb-4">Products & Services</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{products || "—"}</p>
          {promotedProducts && (
            <>
              <h4 className="text-sm font-bold text-cyan-400 mt-4 mb-2">Top Promoted</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{promotedProducts}</p>
            </>
          )}
        </div>

        {/* Services */}
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-6">
          <h3 className="text-xl font-bold mb-4">Active Services</h3>
          {services.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {services.map((s: string) => (
                <div key={s} className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-3 py-2 text-sm text-cyan-300">
                  ✓ {s}
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No services configured.</p>}
        </div>

        {/* Integrations */}
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-6">
          <h3 className="text-xl font-bold mb-4">Integrations</h3>
          {integrations.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {integrations.map((i: string) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
                  {i}
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No integrations configured.</p>}
        </div>

        {/* Peak / Slow Months */}
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-6">
          <h3 className="text-xl font-bold mb-4">Seasonal Intelligence</h3>
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Peak Months</p>
            <div className="flex flex-wrap gap-2">
              {peakMonths.length > 0 ? peakMonths.map((m: string) => (
                <span key={m} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold">{m}</span>
              )) : <span className="text-gray-500 text-sm">—</span>}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Slow Months</p>
            <div className="flex flex-wrap gap-2">
              {slowMonths.length > 0 ? slowMonths.map((m: string) => (
                <span key={m} className="px-3 py-1 rounded-full bg-red-500/10 border border-red-400/20 text-red-300 text-xs font-bold">{m}</span>
              )) : <span className="text-gray-500 text-sm">—</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
