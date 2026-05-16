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
  Edit2,
  XCircle,
  Save,
  Loader2,
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

  const [
    editingCampaign,
    setEditingCampaign,
  ] = useState<any | null>(null);

  const [
    editForm,
    setEditForm,
  ] = useState({
    subject: "",
    content: "",
    audience: "",
    stagger: "50",
    sendDate: "",
    sendTime: "",
  });

  const [
    actionLoading,
    setActionLoading,
  ] = useState("");

  const [
    actionError,
    setActionError,
  ] = useState("");

  const [
    recommendationLoading,
    setRecommendationLoading,
  ] = useState("");

  const scheduledCampaigns =
    campaigns.filter(
      (campaign) =>
        campaign.status === "scheduled"
    );

  function closeEmailModal() {
    setEmailOpen(false);
    loadData();
  }

  function closeSmsModal() {
    setSmsOpen(false);
    loadData();
  }

  function closeSocialModal() {
    setSocialOpen(false);
    loadData();
  }

  function formatDateTime(value?: string) {
    if (!value) {
      return "No date selected";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Invalid scheduled time";
    }

    return date.toLocaleString();
  }

  function toDateInputValue(value?: string) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function toTimeInputValue(value?: string) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function getScheduledAt(dateValue: string, timeValue: string) {
    if ((dateValue && !timeValue) || (!dateValue && timeValue)) {
      throw new Error("Select both a send date and send time, or leave both blank.");
    }

    if (!dateValue && !timeValue) {
      return null;
    }

    const date = new Date(`${dateValue}T${timeValue}`);

    if (Number.isNaN(date.getTime())) {
      throw new Error("Enter a valid send date and time.");
    }

    return date.toISOString();
  }

  function startEditingCampaign(campaign: any) {
    const scheduledValue =
      campaign.send_date ||
      campaign.send_time;

    setActionError("");
    setEditingCampaign(campaign);
    setEditForm({
      subject: campaign.subject || campaign.name || "",
      content: campaign.content || "",
      audience: campaign.audience || "all",
      stagger: String(campaign.stagger || 50),
      sendDate: toDateInputValue(scheduledValue),
      sendTime: toTimeInputValue(scheduledValue),
    });
  }

  async function logActivity(
    campaignId: string,
    action: string,
    details: string
  ) {
    await fetch(
      "/api/marketing/activity",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          action,
          details,
        }),
      }
    );
  }

  async function saveEditedCampaign() {
    if (!editingCampaign) {
      return;
    }

    try {
      setActionLoading(`edit-${editingCampaign.id}`);
      setActionError("");

      const scheduledAt = getScheduledAt(
        editForm.sendDate,
        editForm.sendTime
      );

      const response = await fetch(
        "/api/marketing/campaigns",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingCampaign.id,
            subject: editForm.subject,
            content: editForm.content,
            audience: editForm.audience,
            stagger: Number(editForm.stagger),
            sendDate: editForm.sendDate,
            sendTime: editForm.sendTime,
            scheduledAt,
            status: "scheduled",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to update campaign.");
      }

      await logActivity(
        editingCampaign.id,
        "updated",
        `${editForm.subject || editingCampaign.type || "Campaign"} schedule updated`
      );

      setEditingCampaign(null);
      window.dispatchEvent(new Event("marketing-data-refresh"));
      await loadData();
    } catch (error) {
      console.error(error);
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to update campaign."
      );
    } finally {
      setActionLoading("");
    }
  }

  async function cancelCampaign(campaign: any) {
    try {
      setActionLoading(`cancel-${campaign.id}`);
      setActionError("");

      const response = await fetch(
        `/api/marketing/campaigns?id=${encodeURIComponent(campaign.id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to cancel campaign.");
      }

      await logActivity(
        campaign.id,
        "cancelled",
        `${campaign.subject || campaign.name || campaign.type || "Campaign"} cancelled`
      );

      if (editingCampaign?.id === campaign.id) {
        setEditingCampaign(null);
      }

      window.dispatchEvent(new Event("marketing-data-refresh"));
      await loadData();
    } catch (error) {
      console.error(error);
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to cancel campaign."
      );
    } finally {
      setActionLoading("");
    }
  }

  async function acceptRecommendation(item: any) {
    try {
      const key = item.id || item.title || item.content;
      setRecommendationLoading(key);
      setActionError("");

      const response = await fetch(
        "/api/marketing/recommendations",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            title: item.title || item.content,
            description: item.description || item.details || item.content,
            type: item.recommendation_type || item.type,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to accept recommendation.");
      }

      window.dispatchEvent(new Event("marketing-data-refresh"));
      await loadData();
    } catch (error) {
      console.error(error);
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to accept recommendation."
      );
    } finally {
      setRecommendationLoading("");
    }
  }

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
        campaignsData.campaigns ||
        campaignsData.data ||
        []
      );

      setActivity(
        activityData.data ||
        activityData.events ||
        []
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

    const refreshMarketingData = () => {
      loadData();
    };

    window.addEventListener(
      "marketing-data-refresh",
      refreshMarketingData
    );

    return () => {
      window.removeEventListener(
        "marketing-data-refresh",
        refreshMarketingData
      );
    };
  }, []);

  return (
    <main className="min-h-screen text-white">

      <EmailCampaignModal
        open={emailOpen}
        onClose={closeEmailModal}
      />

      <SMSCampaignModal
        open={smsOpen}
        onClose={closeSmsModal}
      />

      <SocialCampaignModal
        open={socialOpen}
        onClose={closeSocialModal}
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
                    "active" ||
                    c.status ===
                    "processing"
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

              {activity.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-gray-400">
                  No marketing activity yet.
                </div>
              )}

              {activity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >

                  <div className="flex items-center justify-between mb-2">

                    <div className="font-bold text-white">
                      {item.title || item.action || item.type || "Marketing Activity"}
                    </div>

                    <div className="text-xs text-gray-500">
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </div>

                  </div>

                  <div className="text-sm text-gray-400">
                    {item.description || item.details || item.message || ""}
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

              {recommendations.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                  No AI recommendations yet.
                </div>
              )}

              {recommendations.map(
                (item) => (
                  <div
                    key={item.id || item.title || item.content}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300"
                  >
                    <div className="font-bold text-white">
                      {item.title || item.content || "AI Recommendation"}
                    </div>

                    <div className="text-gray-400 mt-2">
                      {item.description || item.details || item.estimated_impact || ""}
                    </div>

                    <button
                      onClick={() => acceptRecommendation(item)}
                      disabled={recommendationLoading === (item.id || item.title || item.content)}
                      className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-100"
                    >
                      {recommendationLoading === (item.id || item.title || item.content)
                        ? "Accepting..."
                        : "Accept"}
                    </button>
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

              {actionError && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
                  {actionError}
                </div>
              )}

              {scheduledCampaigns.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                  No scheduled campaigns yet.
                </div>
              )}

              {scheduledCampaigns
                .map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >

                    {editingCampaign?.id === campaign.id ? (
                      <div className="space-y-3">

                        <input
                          value={editForm.subject}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              subject: event.target.value,
                            })
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white"
                          placeholder="Campaign subject"
                        />

                        <textarea
                          value={editForm.content}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              content: event.target.value,
                            })
                          }
                          className="w-full min-h-[120px] rounded-2xl border border-white/10 bg-black/30 p-3 text-white"
                          placeholder="Campaign content"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <select
                            value={editForm.audience}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                audience: event.target.value,
                              })
                            }
                            className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white"
                          >
                            <option value="all">All Leads</option>
                            <option value="new">New</option>
                            <option value="cold">Cold</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                          </select>

                          <select
                            value={editForm.stagger}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                stagger: event.target.value,
                              })
                            }
                            className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white"
                          >
                            <option>50</option>
                            <option>100</option>
                            <option>150</option>
                            <option>200</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="date"
                            value={editForm.sendDate}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                sendDate: event.target.value,
                              })
                            }
                            className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white"
                          />

                          <input
                            type="time"
                            value={editForm.sendTime}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                sendTime: event.target.value,
                              })
                            }
                            className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={saveEditedCampaign}
                            disabled={actionLoading === `edit-${campaign.id}`}
                            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2"
                          >
                            {actionLoading === `edit-${campaign.id}` ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Save size={16} />
                            )}
                            Save
                          </button>

                          <button
                            onClick={() => setEditingCampaign(null)}
                            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold"
                          >
                            Close
                          </button>
                        </div>

                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-bold text-white">
                              {campaign.name || campaign.subject || `${campaign.type || "Marketing"} Campaign`}
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                              {[
                                campaign.channel || campaign.type,
                                campaign.audience,
                              ]
                                .filter(Boolean)
                                .join(" - ") || "email"}
                            </div>
                          </div>

                          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-200">
                            {campaign.status}
                          </span>
                        </div>

                        <div className="text-sm text-gray-400 mt-3">
                          {formatDateTime(campaign.send_date || campaign.send_time)}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            onClick={() => startEditingCampaign(campaign)}
                            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold flex items-center gap-2"
                          >
                            <Edit2 size={15} />
                            Edit
                          </button>

                          <button
                            onClick={() => cancelCampaign(campaign)}
                            disabled={actionLoading === `cancel-${campaign.id}`}
                            className="px-4 py-2 rounded-2xl border border-red-400/20 bg-red-500/10 text-red-100 font-bold flex items-center gap-2"
                          >
                            {actionLoading === `cancel-${campaign.id}` ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <XCircle size={15} />
                            )}
                            Cancel
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                ))}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

