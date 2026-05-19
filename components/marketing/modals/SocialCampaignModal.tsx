"use client";

import { useEffect, useRef, useState } from "react";

import {
  Share2,
  Calendar,
  Clock,
  Image,
  Send,
  Loader2,
} from "lucide-react";

import MarketingModal from "../shared/MarketingModal";
import AIAssistantPanel from "../ai/AIAssistantPanel";

import { estimateAICredits } from "@/lib/marketing/utils/credits";
import { aiClient } from "@/src/ai/aiClient";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SocialCampaignModal({
  open,
  onClose,
}: Props) {
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Facebook");
  const [postType, setPostType] = useState("Organic Post");
  const [audience, setAudience] = useState("all");
  const [sendDate, setSendDate] = useState("");
  const [sendTime, setSendTime] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");
  const [success, setSuccess] = useState("");

  const credits = estimateAICredits(prompt);

  function resetForm() {
    setPrompt("");
    setContent("");
    setPlatform("Facebook");
    setPostType("Organic Post");
    setAudience("all");
    setSendDate("");
    setSendTime("");
    setAttachments([]);
    setLoading(false);
    setAiLoading(false);
    setError("");
    setAiError("");
    setSuccess("");
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/marketing/media/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data?.error ||
          "Media upload failed. Confirm the Supabase marketing-media bucket exists."
      );
    }

    setAttachments((current) => [...current, data.media]);
  }

  function closeModal() {
    resetForm();
    onClose();
  }

  function getScheduledAt() {
    if ((sendDate && !sendTime) || (!sendDate && sendTime)) {
      throw new Error("Select both a send date and send time, or leave both blank.");
    }

    if (!sendDate && !sendTime) {
      return null;
    }

    const scheduledDate = new Date(`${sendDate}T${sendTime}`);

    if (Number.isNaN(scheduledDate.getTime())) {
      throw new Error("Enter a valid send date and time.");
    }

    return scheduledDate.toISOString();
  }

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  async function generateAI() {
    try {
      setAiLoading(true);
      setAiError("");

      const data = await aiClient.runTask("campaign_ideas", {
        messages: [
          {
            role: "system",
            content:
              `You are SynaptiReach's social media strategist. Generate platform-ready ${platform} ${postType} copy with a strong hook, concise body, and CTA. Return only the post content.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      if (!data.text) {
        throw new Error(data?.error || "AI generation failed.");
      }

      setContent(data.text || "");
    } catch (error) {
      console.error(error);
      setAiError(
        error instanceof Error
          ? error.message
          : "AI generation failed."
      );
    } finally {
      setAiLoading(false);
    }
  }

  async function scheduleCampaign() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!content.trim()) {
        setError("Enter social post content before scheduling.");
        return;
      }

      const scheduledAt = getScheduledAt();
      const contentWithPlatform = `[${platform} - ${postType}]\n${content}`;

      const campaignResponse = await fetch(
        "/api/marketing/campaigns",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "social",
            audience,
            subject: `${platform} ${postType}`,
            content: contentWithPlatform,
            stagger: 50,
            attachments,
            sendDate,
            sendTime,
            scheduledAt,
            status: "scheduled",
          }),
        }
      );

      const campaignData = await campaignResponse.json();

      if (!campaignResponse.ok || !campaignData.success) {
        throw new Error(campaignData?.error || "Failed to create campaign.");
      }

      await fetch(
        "/api/marketing/activity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: campaignData.campaign.id,
            action: scheduledAt ? "scheduled" : "created",
            details: `Social campaign for ${platform} (${postType})`,
          }),
        }
      );

      setSuccess("Social campaign scheduled successfully.");
      window.dispatchEvent(new Event("marketing-data-refresh"));
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Campaign failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <MarketingModal
      open={open}
      onClose={closeModal}
      title="Social Campaign Builder"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 mb-5">
              <Share2
                className="text-cyan-300"
                size={20}
              />

              <h3 className="text-xl font-black text-white">
                Social Campaign Setup
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              >
                <option>Facebook</option>
                <option>Instagram</option>
                <option>Facebook + Instagram</option>
              </select>

              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              >
                <option>Organic Post</option>
                <option>Advertisement</option>
              </select>

              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              >
                <option value="all">All Leads</option>
                <option value="new">New</option>
                <option value="cold">Cold</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-4 text-gray-500"
                  size={18}
                />

                <input
                  type="date"
                  value={sendDate}
                  onChange={(e) => setSendDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 pl-12 p-4 text-white"
                />
              </div>

              <div className="relative">
                <Clock
                  className="absolute left-4 top-4 text-gray-500"
                  size={18}
                />

                <input
                  type="time"
                  value={sendTime}
                  onChange={(e) => setSendTime(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 pl-12 p-4 text-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <label className="text-sm text-gray-400 block mb-2">
              Social Post Content
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              placeholder="Write social campaign..."
            />

            <div className="flex flex-wrap items-center gap-3 mt-5">
              {error && (
                <div className="w-full rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                  {success}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];

                  if (!file) return;

                  try {
                    setError("");
                    await uploadFile(file);
                  } catch (error) {
                    setError(
                      error instanceof Error
                        ? error.message
                        : "Media upload failed."
                    );
                  } finally {
                    event.target.value = "";
                  }
                }}
              />

              {attachments.length > 0 && (
                <div className="w-full flex flex-wrap gap-2">
                  {attachments.map((item) => (
                    <button
                      key={item.url}
                      onClick={() =>
                        setAttachments((current) =>
                          current.filter((attachment) => attachment.url !== item.url)
                        )
                      }
                      className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100"
                    >
                      {item.name || item.url} x
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-3 rounded-2xl border border-white/10 bg-black/30 text-white flex items-center gap-2"
              >
                <Image size={18} />
                Upload Creative
              </button>

              <button
                onClick={scheduleCampaign}
                disabled={loading}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Send size={18} />
                )}
                {loading ? "Scheduling..." : "Schedule Social Campaign"}
              </button>
            </div>
          </div>
        </div>

        <div>
          <AIAssistantPanel
            type="social"
            prompt={prompt}
            setPrompt={setPrompt}
            credits={credits}
            onGenerate={generateAI}
            loading={aiLoading}
            error={aiError}
          />
        </div>
      </div>
    </MarketingModal>
  );
}
