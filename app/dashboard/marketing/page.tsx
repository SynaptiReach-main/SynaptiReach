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
  Search,
  Copy,
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
    loading,
    setLoading,
  ] = useState(true);

  const [
    recommendationLoading,
    setRecommendationLoading,
  ] = useState("");

  const [
    campaignFilter,
    setCampaignFilter,
  ] = useState("all");

  const [
    campaignSearch,
    setCampaignSearch,
  ] = useState("");
  const [campaignTypeFilter, setCampaignTypeFilter] = useState("all");
  const [campaignDateFilter, setCampaignDateFilter] = useState("all");
  const [scheduledSearch, setScheduledSearch] = useState("");
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const [showAllScheduled, setShowAllScheduled] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  const scheduledCampaigns =
    campaigns.filter(
      (campaign) =>
        campaign.status === "scheduled"
    );

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesStatus =
      campaignFilter === "all" ||
      campaign.status === campaignFilter;
    const matchesType =
      campaignTypeFilter === "all" ||
      campaign.type === campaignTypeFilter ||
      campaign.channel === campaignTypeFilter;
    const matchesDate =
      campaignDateFilter === "all" ||
      (campaignDateFilter === "scheduled" && Boolean(campaign.send_date || campaign.send_time)) ||
      (campaignDateFilter === "last30" &&
        campaign.created_at &&
        Date.now() - new Date(campaign.created_at).getTime() <= 30 * 86400000);
    const search = campaignSearch.toLowerCase();
    const matchesSearch =
      !search ||
      [
        campaign.subject,
        campaign.name,
        campaign.type,
        campaign.audience,
        campaign.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(search)
        );

    return matchesStatus && matchesType && matchesDate && matchesSearch;
  });
  const visibleCampaigns = showAllCampaigns ? filteredCampaigns : filteredCampaigns.slice(0, 5);
  const filteredScheduledCampaigns = scheduledCampaigns.filter((campaign) => {
    const search = scheduledSearch.toLowerCase();
    return (
      !search ||
      [campaign.subject, campaign.name, campaign.type, campaign.audience]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    );
  });
  const visibleScheduledCampaigns = showAllScheduled
    ? filteredScheduledCampaigns
    : filteredScheduledCampaigns.slice(0, 5);

  const campaignTotals = {
    delivered: campaigns.reduce((sum, campaign) => sum + Number(campaign.delivered_count || 0), 0),
    opened: campaigns.reduce((sum, campaign) => sum + Number(campaign.opened_count || 0), 0),
    clicked: campaigns.reduce((sum, campaign) => sum + Number(campaign.clicked_count || 0), 0),
    converted: campaigns.reduce((sum, campaign) => sum + Number(campaign.converted_count || 0), 0),
    sent: campaigns.filter((campaign) => campaign.status === "sent").length,
    cancelled: campaigns.filter((campaign) => campaign.status === "cancelled").length,
  };

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

  async function cloneCampaign(campaign: any) {
    try {
      setActionLoading(`clone-${campaign.id}`);
      setActionError("");

      const response = await fetch("/api/marketing/campaigns/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId: campaign.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to duplicate campaign.");
      }

      window.dispatchEvent(new Event("marketing-data-refresh"));
      await loadData();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to duplicate campaign."
      );
    } finally {
      setActionLoading("");
    }
  }

  async function acceptRecommendation(item: any, action: "accept" | "deny" = "accept") {
    try {
      const key = item.id || item.title || item.content;
      setRecommendationLoading(`${action}-${key}`);
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
            action: action === "deny" ? "deny" : "accept",
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
      setLoading(true);
      setActionError("");
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
        (recommendationsData.data || []).filter(
          (item: any) => !item.dismissed && !item.accepted
        )
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to load marketing data."
      );
    } finally {
      setLoading(false);
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
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-start justify-between gap-4 border-b border-cyan-400/10 p-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Campaign Detail</div>
                <h2 className="mt-1 text-2xl font-black">
                  {selectedCampaign.subject || selectedCampaign.name || `${selectedCampaign.type || "Marketing"} Campaign`}
                </h2>
                <p className="mt-1 text-sm text-cyan-50/55">
                  {[selectedCampaign.type, selectedCampaign.audience, selectedCampaign.status].filter(Boolean).join(" - ")}
                </p>
              </div>
              <button onClick={() => setSelectedCampaign(null)} className="rounded-2xl border border-white/10 px-3 py-2 text-sm font-bold text-cyan-100">
                Close
              </button>
            </div>
            <div className="max-h-[62vh] overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ["Delivered", selectedCampaign.delivered_count || 0],
                  ["Opened", selectedCampaign.opened_count || 0],
                  ["Clicked", selectedCampaign.clicked_count || 0],
                  ["Converted", selectedCampaign.converted_count || 0],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-2xl font-black">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-2 text-sm font-bold text-white">Content</div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-400">
                  {selectedCampaign.content || "No campaign content saved."}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                Scheduled: {formatDateTime(selectedCampaign.send_date || selectedCampaign.send_time)}
              </div>
            </div>
          </div>
        </div>
      )}

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
            {
              label: "Opened",
              value: campaignTotals.opened,
              icon: Mail,
            },
            {
              label: "Clicked",
              value: campaignTotals.clicked,
              icon: Activity,
            },
            {
              label: "Converted",
              value: campaignTotals.converted,
              icon: TrendingUp,
            },
            {
              label: "Cancelled",
              value: campaignTotals.cancelled,
              icon: XCircle,
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

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  Campaign Library
                </h2>
                <p className="text-sm text-gray-500">
                  Real campaigns with status, audience, schedule, and engagement metrics
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {showAllCampaigns && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                  <Search className="text-gray-500" size={16} />
                  <input
                    value={campaignSearch}
                    onChange={(event) => setCampaignSearch(event.target.value)}
                    placeholder="Search campaigns..."
                    className="bg-transparent outline-none text-sm text-white placeholder:text-gray-600"
                  />
                </div>
                )}
                {showAllCampaigns && (
                <select
                  value={campaignFilter}
                  onChange={(event) => setCampaignFilter(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                >
                  <option value="all">All statuses</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="processing">Processing</option>
                  <option value="sent">Sent</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="failed">Failed</option>
                </select>
                )}
                {showAllCampaigns && (
                <select
                  value={campaignTypeFilter}
                  onChange={(event) => setCampaignTypeFilter(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                >
                  <option value="all">All types</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="social">Social</option>
                </select>
                )}
                {showAllCampaigns && (
                <select
                  value={campaignDateFilter}
                  onChange={(event) => setCampaignDateFilter(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                >
                  <option value="all">All dates</option>
                  <option value="scheduled">Has schedule</option>
                  <option value="last30">Created last 30 days</option>
                </select>
                )}
                <button
                  onClick={() => setShowAllCampaigns((value) => !value)}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100"
                >
                  {showAllCampaigns ? "Show Recent 5" : "View All"}
                </button>
              </div>
            </div>

            {filteredCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                {loading ? "Loading campaigns..." : "No campaigns match the current filters."}
              </div>
            ) : (
              <div className="space-y-3">
                {visibleCampaigns.map((campaign) => (
                  <div key={campaign.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <div className="font-bold text-white">
                          {campaign.subject || campaign.name || `${campaign.type || "Marketing"} Campaign`}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {[campaign.type, campaign.audience, campaign.status].filter(Boolean).join(" - ")}
                        </div>
                      </div>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">
                        {campaign.status || "draft"}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <span className="text-gray-400">Delivered: <b className="text-white">{campaign.delivered_count || 0}</b></span>
                      <span className="text-gray-400">Opened: <b className="text-white">{campaign.opened_count || 0}</b></span>
                      <span className="text-gray-400">Clicked: <b className="text-white">{campaign.clicked_count || 0}</b></span>
                      <span className="text-gray-400">Converted: <b className="text-white">{campaign.converted_count || 0}</b></span>
                    </div>
                    {campaign.send_date && (
                      <div className="mt-3 text-xs text-gray-500">
                        Scheduled: {formatDateTime(campaign.send_date)}
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => cloneCampaign(campaign)}
                        disabled={actionLoading === `clone-${campaign.id}`}
                        className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
                      >
                        {actionLoading === `clone-${campaign.id}` ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                        Duplicate
                      </button>
                      {campaign.status === "scheduled" && (
                        <>
                          <button
                            onClick={() => startEditingCampaign(campaign)}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => cancelCampaign(campaign)}
                            disabled={actionLoading === `cancel-${campaign.id}`}
                            className="rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-100 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {!showAllCampaigns && filteredCampaigns.length > 5 && (
                  <button
                    onClick={() => setShowAllCampaigns(true)}
                    className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm font-bold text-cyan-100"
                  >
                    View {filteredCampaigns.length - 5} older campaigns
                  </button>
                )}
              </div>
            )}

          </div>

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
                      onClick={() => acceptRecommendation(item, "accept")}
                      disabled={recommendationLoading === `accept-${item.id || item.title || item.content}`}
                      className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-100"
                    >
                      {recommendationLoading === `accept-${item.id || item.title || item.content}`
                        ? "Accepting..."
                        : "Accept"}
                    </button>
                    <button
                      onClick={() => acceptRecommendation(item, "deny")}
                      disabled={recommendationLoading === `deny-${item.id || item.title || item.content}`}
                      className="ml-2 mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-gray-300"
                    >
                      {recommendationLoading === `deny-${item.id || item.title || item.content}`
                        ? "Dismissing..."
                        : "Deny"}
                    </button>
                    {(item.ai_provider || item.provider || item.model || item.fallback_used) && (
                      <div className="mt-3 text-xs text-gray-500">
                        {[item.ai_provider || item.provider, item.model, item.fallback_used ? "fallback used" : ""].filter(Boolean).join(" - ")}
                      </div>
                    )}
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

            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              {showAllScheduled && (
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                  <Search className="text-gray-500" size={16} />
                  <input
                    value={scheduledSearch}
                    onChange={(event) => setScheduledSearch(event.target.value)}
                    placeholder="Search scheduled..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              )}
              <button
                onClick={() => setShowAllScheduled((value) => !value)}
                className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100"
              >
                {showAllScheduled ? "Show Recent 5" : "View All"}
              </button>
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

              {visibleScheduledCampaigns
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
                            onClick={() => setSelectedCampaign(campaign)}
                            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold flex items-center gap-2"
                          >
                            View
                          </button>

                          <button
                            onClick={() => cloneCampaign(campaign)}
                            disabled={actionLoading === `clone-${campaign.id}`}
                            className="px-4 py-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-100 font-bold flex items-center gap-2"
                          >
                            <Copy size={15} />
                            Duplicate
                          </button>

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
                {!showAllScheduled && filteredScheduledCampaigns.length > 5 && (
                  <button
                    onClick={() => setShowAllScheduled(true)}
                    className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm font-bold text-cyan-100"
                  >
                    View {filteredScheduledCampaigns.length - 5} older scheduled campaigns
                  </button>
                )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

