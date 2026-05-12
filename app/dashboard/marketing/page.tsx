"use client";

import { useEffect, useState } from "react";

import {
  Megaphone,
  Mail,
  MessageSquare,
  Share2,
  Sparkles,
  TrendingUp,
  Activity,
  CalendarClock,
  Target,
  Users,
  Zap,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

import EmailCampaignModal from "@/components/marketing/modals/EmailCampaignModal";
import SMSCampaignModal from "@/components/marketing/modals/SMSCampaignModal";
import SocialCampaignModal from "@/components/marketing/modals/SocialCampaignModal";
import AnalyticsCharts from "@/components/marketing/analytics/AnalyticsCharts";
import WorkflowBuilder from "@/components/marketing/workflows/WorkflowBuilder";

export default function MarketingPage() {
  const [
    emailModalOpen,
    setEmailModalOpen,
  ] = useState(false);

  const [
    smsModalOpen,
    setSMSModalOpen,
  ] = useState(false);

  const [
    socialModalOpen,
    setSocialModalOpen,
  ] = useState(false);

  const [
    campaigns,
    setCampaigns,
  ] = useState<any[]>([]);

  const [
    activity,
    setActivity,
  ] = useState<any[]>([]);

  const [
    recommendations,
    setRecommendations,
  ] = useState<any[]>([]);

  const [
    analytics,
    setAnalytics,
  ] = useState<any>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  async function loadDashboard() {
    try {
      const [
        campaignsRes,
        activityRes,
        recommendationsRes,
        analyticsRes,
      ] = await Promise.all([
        fetch("/api/marketing/campaigns"),
        fetch("/api/marketing/activity"),
        fetch("/api/marketing/recommendations"),
        fetch("/api/marketing/analytics"),
      ]);

      const campaignsData =
        await campaignsRes.json();

      const activityData =
        await activityRes.json();

      const analyticsData =
        await analyticsRes.json();

      const recommendationsData =
        await recommendationsRes.json();

      setCampaigns(
        campaignsData.data || []
      );

      setActivity(
        activityData.data || []
      );

      setAnalytics(
        analyticsData.data
      );

      setRecommendations(
        recommendationsData.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalCampaigns =
    campaigns.length;

  const activeCampaigns =
    campaigns.filter(
      (c) =>
        c.status === "active"
    ).length;

  const delivered =
    campaigns.reduce(
      (acc, c) =>
        acc +
        (
          c.delivered_count || 0
        ),
      0
    );

  const opened =
    campaigns.reduce(
      (acc, c) =>
        acc +
        (
          c.opened_count || 0
        ),
      0
    );

  const openRate =
    delivered > 0
      ? (
          opened /
          delivered
        ) * 100
      : 0;

  return (
    <main className="min-h-screen text-white pb-20">

      <EmailCampaignModal
        open={emailModalOpen}
        onClose={() =>
          setEmailModalOpen(false)
        }
      />

      <SMSCampaignModal
        open={smsModalOpen}
        onClose={() =>
          setSMSModalOpen(false)
        }
      />

      <SocialCampaignModal
        open={socialModalOpen}
        onClose={() =>
          setSocialModalOpen(false)
        }
      />

      <section className="mb-10">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">

              <Megaphone
                className="text-cyan-300"
                size={30}
              />

            </div>

            <div>

              <h1 className="text-4xl md:text-5xl font-black">
                Marketing Command Center
              </h1>

              <p className="text-gray-400 mt-2">
                Autonomous multi-channel campaign intelligence
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() =>
                setEmailModalOpen(true)
              }
              className="px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2"
            >
              <Mail size={18} />
              Email Campaign
            </button>

            <button
              onClick={() =>
                setSMSModalOpen(true)
              }
              className="px-5 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold flex items-center gap-2"
            >
              <MessageSquare size={18} />
              SMS Campaign
            </button>

            <button
              onClick={() =>
                setSocialModalOpen(true)
              }
              className="px-5 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold flex items-center gap-2"
            >
              <Share2 size={18} />
              Social Campaign
            </button>

          </div>

        </div>

      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

        {[
          {
            label:
              "Total Campaigns",
            value:
              totalCampaigns,
            icon: Target,
          },
          {
            label:
              "Active Campaigns",
            value:
              activeCampaigns,
            icon: Zap,
          },
          {
            label:
              "Messages Delivered",
            value:
              delivered,
            icon: Activity,
          },
          {
            label:
              "Open Rate",
            value:
              `${openRate.toFixed(1)}%`,
            icon: TrendingUp,
          },
        ].map((item) => {
          const Icon =
            item.icon;

          return (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >

              <div className="flex items-center justify-between mb-5">

                <div className="w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">

                  <Icon
                    className="text-cyan-300"
                    size={20}
                  />

                </div>

                <ArrowUpRight
                  className="text-green-400"
                  size={18}
                />

              </div>

              <div className="text-4xl font-black">
                {item.value}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                {item.label}
              </div>

            </div>
          );
        })}

      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-6">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-black">
                  Campaign Activity
                </h2>

                <p className="text-sm text-gray-500">
                  Live campaign tracking and execution
                </p>

              </div>

              <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
                Live
              </div>

            </div>

            <div className="space-y-4">

              {loading ? (
                <div className="text-gray-500">
                  Loading...
                </div>
              ) : campaigns.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

                  <div className="text-lg font-bold text-white mb-2">
                    No Campaigns Yet
                  </div>

                  <div className="text-sm text-gray-500">
                    Launch your first AI-powered campaign.
                  </div>

                </div>
              ) : (
                campaigns.map(
                  (campaign) => (
                    <div
                      key={
                        campaign.id
                      }
                      className="rounded-2xl border border-white/10 bg-black/30 p-5"
                    >

                      <div className="flex items-start justify-between mb-4">

                        <div>

                          <div className="font-bold text-lg">
                            {
                              campaign.name
                            }
                          </div>

                          <div className="text-sm text-gray-500 mt-1">
                            {
                              campaign.type
                            }
                          </div>

                        </div>

                        <div className="px-3 py-1 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase">
                          {
                            campaign.status
                          }
                        </div>

                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Delivered
                          </div>

                          <div className="font-black text-xl">
                            {
                              campaign.delivered_count || 0
                            }
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Opened
                          </div>

                          <div className="font-black text-xl">
                            {
                              campaign.opened_count || 0
                            }
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Clicked
                          </div>

                          <div className="font-black text-xl">
                            {
                              campaign.clicked_count || 0
                            }
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Converted
                          </div>

                          <div className="font-black text-xl">
                            {
                              campaign.converted_count || 0
                            }
                          </div>
                        </div>

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center gap-3 mb-6">

              <BarChart3
                className="text-cyan-300"
                size={20}
              />

              <div>

                <h2 className="text-2xl font-black">
                  Scheduled Campaigns
                </h2>

                <p className="text-sm text-gray-500">
                  Upcoming automated campaign execution
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {campaigns
                .filter(
                  (c) =>
                    c.status ===
                    "scheduled"
                )
                .map((campaign) => (
                  <div
                    key={
                      campaign.id
                    }
                    className="rounded-2xl border border-white/10 bg-black/30 p-5 flex items-center justify-between"
                  >

                    <div>

                      <div className="font-bold">
                        {
                          campaign.name
                        }
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        {
                          campaign.scheduled_for
                        }
                      </div>

                    </div>

                    <CalendarClock
                      className="text-cyan-300"
                      size={20}
                    />

                  </div>
                ))}

            </div>

          </div>

        </div>

        <div className="space-y-6">

          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">

                <Sparkles
                  className="text-cyan-300"
                  size={20}
                />

              </div>

              <div>

                <h2 className="font-black text-xl">
                  AI Recommendations
                </h2>

                <p className="text-sm text-gray-400">
                  Autonomous optimization intelligence
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {recommendations
                .length === 0 ? (
                <div className="text-sm text-gray-500">
                  No AI recommendations available.
                </div>
              ) : (
                recommendations.map(
                  (
                    recommendation
                  ) => (
                    <div
                      key={
                        recommendation.id
                      }
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >

                      <div className="flex items-start gap-3">

                        <Sparkles
                          className="text-green-400 mt-1"
                          size={16}
                        />

                        <div>

                          <div className="font-semibold text-sm">
                            {
                              recommendation.title
                            }
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {
                              recommendation.description
                            }
                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center gap-3 mb-5">

              <Users
                className="text-cyan-300"
                size={20}
              />

              <h2 className="text-xl font-black">
                Live Activity Feed
              </h2>

            </div>

            <div className="space-y-4">

              {activity.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No activity available.
                </div>
              ) : (
                activity.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >

                      <div className="flex items-start gap-3">

                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />

                        <div>

                          <div className="text-sm font-semibold">
                            {
                              item.title
                            }
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {
                              item.description
                            }
                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </div>

        </div>

      </section>

      {analytics && (
        <section className="mt-10">

          <AnalyticsCharts
            analytics={analytics}
          />

        </section>
      )}

      <section className="mt-10">

        <WorkflowBuilder />

      </section>

    </main>
  );
}
