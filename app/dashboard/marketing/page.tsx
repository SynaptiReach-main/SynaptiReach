"use client";

import { useEffect, useState } from "react";

import {
  Megaphone,
  Mail,
  MessageSquare,
  Share2,
  TrendingUp,
  Activity,
  Sparkles,
  CalendarClock,
  BarChart3,
} from "lucide-react";

import EmailCampaignModal from "@/components/marketing/modals/EmailCampaignModal";
import SMSCampaignModal from "@/components/marketing/modals/SMSCampaignModal";
import SocialCampaignModal from "@/components/marketing/modals/SocialCampaignModal";

export default function MarketingPage() {
  const [
    emailOpen,
    setEmailOpen,
  ] = useState(false);

  const [
    smsOpen,
    setSmsOpen,
  ] = useState(false);

  const [
    socialOpen,
    setSocialOpen,
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

  async function loadData() {
    try {
      const [
        campaignsRes,
        activityRes,
        recommendationsRes,
      ] = await Promise.all([
        fetch("/api/marketing/campaigns"),
        fetch("/api/marketing/activity"),
        fetch("/api/marketing/recommendations"),
      ]);

      const campaignsData =
        await campaignsRes.json();

      const activityData =
        await activityRes.json();

      const recommendationsData =
        await recommendationsRes.json();

      setCampaigns(
        campaignsData.data || []
      );

      setActivity(
        activityData.data || []
      );

      setRecommendations(
        recommendationsData.data || []
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="min-h-screen text-white">

      <EmailCampaignModal
        open={emailOpen}
        onClose={() =>
          setEmailOpen(false)
        }
      />

      <SMSCampaignModal
        open={smsOpen}
        onClose={() =>
          setSmsOpen(false)
        }
      />

      <SocialCampaignModal
        open={socialOpen}
        onClose={() =>
          setSocialOpen(false)
        }
      />

      <section className="mb-10">

        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">

              <Megaphone
                className="text-cyan-300"
                size={28}
              />

            </div>

            <div>

              <h1 className="text-4xl font-black">
                Marketing Command Center
              </h1>

              <p className="text-gray-500 mt-1">
                AI-powered multi-channel marketing automation
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() =>
                setEmailOpen(true)
              }
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2"
            >
              <Mail size={18} />
              Email Campaign
            </button>

            <button
              onClick={() =>
                setSmsOpen(true)
              }
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold flex items-center gap-2"
            >
              <MessageSquare size={18} />
              SMS Campaign
            </button>

            <button
              onClick={() =>
                setSocialOpen(true)
              }
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold flex items-center gap-2"
            >
              <Share2 size={18} />
              Social Campaign
            </button>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {[
            {
              label: "Campaigns",
              value:
                campaigns.length,
              icon: Megaphone,
            },
            {
              label: "Active",
              value:
                campaigns.filter(
                  (c) =>
                    c.status ===
                    "active"
                ).length,
              icon: Activity,
            },
            {
              label: "Scheduled",
              value:
                campaigns.filter(
                  (c) =>
                    c.status ===
                    "scheduled"
                ).length,
              icon: CalendarClock,
            },
            {
              label: "AI Insights",
              value:
                recommendations.length,
              icon: Sparkles,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >

                <div className="flex items-center justify-between mb-5">

                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                    <Icon
                      size={20}
                      className="text-cyan-300"
                    />

                  </div>

                  <TrendingUp
                    size={18}
                    className="text-green-400"
                  />

                </div>

                <div className="text-3xl font-black mb-1">
                  {item.value}
                </div>

                <div className="text-sm text-gray-500">
                  {item.label}
                </div>

              </div>
            );
          })}

        </div>

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
                  Live marketing execution activity
                </p>

              </div>

              <Activity
                className="text-cyan-300"
                size={20}
              />

            </div>

            <div className="space-y-4">

              {activity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >

                  <div className="flex items-center justify-between mb-2">

                    <div className="font-bold text-white">
                      {item.title}
                    </div>

                    <div className="text-xs text-gray-500">
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </div>

                  </div>

                  <div className="text-sm text-gray-400">
                    {item.description}
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

        <div className="space-y-6">

          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6">

            <div className="flex items-center gap-3 mb-5">

              <Sparkles
                className="text-cyan-300"
                size={22}
              />

              <div>

                <h2 className="text-xl font-black">
                  AI Recommendations
                </h2>

                <p className="text-sm text-gray-400">
                  Autonomous growth intelligence
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {recommendations.map(
                (item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300"
                  >
                    {item.content}
                  </div>
                )
              )}

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center gap-3 mb-5">

              <BarChart3
                className="text-cyan-300"
                size={20}
              />

              <h2 className="text-xl font-black">
                Scheduled Campaigns
              </h2>

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
                    key={campaign.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >

                    <div className="font-bold text-white">
                      {campaign.name}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {campaign.channel}
                    </div>

                  </div>
                ))}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
