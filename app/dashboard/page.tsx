"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Mail,
  Megaphone,
  MessageSquare,
  Plus,
  Share2,
  Target,
  Users,
  XCircle,
} from "lucide-react";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/crm/dashboard");
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json?.error || "Failed to load CRM dashboard.");
      }

      setData(json.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load CRM dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    window.addEventListener("marketing-data-refresh", loadDashboard);
    return () => window.removeEventListener("marketing-data-refresh", loadDashboard);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-300" size={34} />
      </main>
    );
  }

  const metrics = data?.metrics || {
    leads: {},
    campaigns: {},
    communications: {},
  };
  const recentLeads = data?.leads?.slice(0, 6) || [];
  const recentActivity = data?.activity?.slice(0, 6) || [];
  const recentCommunications = data?.communications?.slice(0, 5) || [];
  const recommendations = data?.agents?.recommendations || [];
  const topCampaigns = data?.campaigns?.slice(0, 4) || [];

  return (
    <main className="min-h-screen text-white">
      <section className="mb-8">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs mb-4">
              <Activity size={14} />
              Autonomous CRM Dashboard
            </div>
            <h1 className="text-5xl font-black leading-tight">
              SynaptiReach
              <span className="block bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                CRM Command Center
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mt-3">
              Real leads, campaigns, communications, activity, and AI next actions from Supabase.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/dashboard/leads" className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2">
              <Plus size={18} /> Create Lead
            </a>
            <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <Mail size={18} /> Email Campaign
            </a>
            <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <MessageSquare size={18} /> SMS Campaign
            </a>
            <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white flex items-center gap-2">
              <Share2 size={18} /> Social Campaign
            </a>
            <a href="/dashboard/ai_assistant" className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 flex items-center gap-2">
              <Bot size={18} /> Ask AI
            </a>
          </div>
        </div>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {(data?.schemaWarnings || []).length > 0 && (
        <div className="mb-6 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          {data.schemaWarnings[0]}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Leads", value: metrics.leads.total || 0, icon: Users },
          { label: "New Leads", value: metrics.leads.new || 0, icon: Plus },
          { label: "Qualified", value: metrics.leads.qualified || 0, icon: Target },
          { label: "Converted Leads", value: metrics.leads.converted || 0, icon: CheckCircle2 },
          { label: "Scheduled Campaigns", value: metrics.campaigns.scheduled || 0, icon: CalendarClock },
          { label: "Active Campaigns", value: metrics.campaigns.active || 0, icon: Megaphone },
          { label: "Cancelled Campaigns", value: metrics.campaigns.cancelled || 0, icon: XCircle },
          { label: "Campaign Opens", value: metrics.campaigns.opened || 0, icon: Mail },
          { label: "Campaign Clicks", value: metrics.campaigns.clicked || 0, icon: Activity },
          { label: "Communications", value: metrics.communications.total || 0, icon: MessageSquare },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="w-11 h-11 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center mb-4">
                <Icon className="text-cyan-300" size={20} />
              </div>
              <div className="text-3xl font-black">{item.value}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-black mb-5">Recent Leads</h2>
            {recentLeads.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                No leads yet. Create or import your first lead to start the CRM pipeline.
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white">{lead.name || lead.email || lead.phone || "Unnamed lead"}</div>
                      <div className="text-sm text-gray-500">{lead.email || lead.phone || "No contact"} - {lead.source || "unknown source"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{lead.status || "new"}</span>
                      <span className="text-sm font-black text-cyan-300">{lead.score || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-black mb-5">Pipeline Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {["new", "contacted", "qualified", "nurture", "converted", "lost"].map((status) => (
                <div key={status} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">{status}</div>
                  <div className="mt-2 text-2xl font-black text-cyan-300">
                    {data?.leads?.filter((lead: any) => lead.status === status).length || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-black mb-5">Campaign Performance</h2>
            {topCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                No campaigns yet. Schedule an email, SMS, or social campaign to populate performance.
              </div>
            ) : (
              <div className="space-y-3">
                {topCampaigns.map((campaign: any) => (
                  <div key={campaign.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="font-bold text-white">{campaign.subject || campaign.name || `${campaign.type || "Marketing"} Campaign`}</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                      <span className="text-gray-400">Delivered: <b className="text-white">{campaign.delivered_count || 0}</b></span>
                      <span className="text-gray-400">Opened: <b className="text-white">{campaign.opened_count || 0}</b></span>
                      <span className="text-gray-400">Clicked: <b className="text-white">{campaign.clicked_count || 0}</b></span>
                      <span className="text-gray-400">Converted: <b className="text-white">{campaign.converted_count || 0}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">
            <div className="flex items-center gap-3 mb-5">
              <Bot className="text-cyan-300" size={22} />
              <h2 className="text-xl font-black">AI Next Actions</h2>
            </div>
            <div className="space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-sm text-gray-400">No recommendations yet. Add leads or campaigns to generate CRM guidance.</div>
              ) : recommendations.map((item: any, index: number) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="font-bold text-white">{item.title}</div>
                  <div className="text-sm text-gray-400 mt-1">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-black mb-5">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.length === 0 && recentCommunications.length === 0 ? (
                <div className="text-sm text-gray-400">No activity yet.</div>
              ) : (
                <>
                  {recentActivity.map((item: any) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">{item.action || item.type || item.title || "Activity"}</div>
                      <div className="text-sm text-gray-500">{item.details || item.message || item.description || ""}</div>
                      <div className="text-xs text-gray-600 mt-2">{formatDate(item.created_at)}</div>
                    </div>
                  ))}
                  {recentCommunications.map((item: any) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="font-bold text-white">{item.subject || `${item.channel} communication`}</div>
                      <div className="text-sm text-gray-500">{item.content || ""}</div>
                      <div className="text-xs text-gray-600 mt-2">{formatDate(item.created_at)}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-black mb-5">Quick Campaigns</h2>
            <div className="grid grid-cols-1 gap-3">
              <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center gap-3 text-white"><Mail className="text-cyan-300" size={18} /> Email Campaign</a>
              <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center gap-3 text-white"><MessageSquare className="text-cyan-300" size={18} /> SMS Campaign</a>
              <a href="/dashboard/marketing" className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center gap-3 text-white"><Share2 className="text-cyan-300" size={18} /> Social Campaign</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
