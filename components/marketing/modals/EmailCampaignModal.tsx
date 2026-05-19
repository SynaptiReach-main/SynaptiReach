"use client";

import { useEffect, useRef, useState } from "react";

import {
  Mail,
  Calendar,
  Clock,
  Upload,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";

import MarketingModal from "../shared/MarketingModal";
import AIAssistantPanel from "../ai/AIAssistantPanel";

import { estimateAICredits } from "@/lib/marketing/utils/credits";
import { aiClient } from "@/src/ai/aiClient";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EmailCampaignModal({
  open,
  onClose,
}: Props) {

  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [segment, setSegment] = useState("all");
  const [stagger, setStagger] = useState("50");
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
    setSubject("");
    setBody("");
    setSegment("all");
    setStagger("50");
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

  function applyGeneratedEmail(text: string) {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const subjectLine = lines.find((line) =>
      /^subject\s*:/i.test(line)
    );

    const nextSubject = subjectLine
      ? subjectLine.replace(/^subject\s*:\s*/i, "").trim()
      : lines[0] || "";

    const nextBody = lines
      .filter((line) => line !== subjectLine && line !== nextSubject)
      .join("\n\n") || text;

    setSubject(nextSubject);
    setBody(nextBody);
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

      const data =
        await aiClient.runTask("campaign_ideas", {
          messages: [
            {
              role: "system",
              content:
                `
You are SynaptiReach's elite email campaign strategist.

Generate:
- one concise subject line prefixed with "Subject:"
- high converting emails
- optimized CTA
- conversion focused structure
- personalization
- follow-up logic
- urgency optimization
- audience targeting
- emotional triggers
- best practices
- modern SaaS formatting
                `,
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

      applyGeneratedEmail(data.text);

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

      if (!body.trim()) {
        setError("Enter email body content before scheduling.");
        return;
      }

      const scheduledAt = getScheduledAt();


      const campaignResponse =
        await fetch(
          "/api/marketing/campaigns",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              type: "email",
              audience: segment,
              subject,
              content: body,
              stagger: Number(stagger),
              sendDate,
              sendTime,
              scheduledAt,
              attachments,
              status: "scheduled",
            }),
          }
        );

      const campaignData =
        await campaignResponse.json();

      if (!campaignData.success) {
        throw new Error(campaignData.error || "Failed to create campaign.");
      }

      await fetch(
        "/api/marketing/activity",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            campaign_id: campaignData.campaign.id,
            action: scheduledAt ? "scheduled" : "created",
            details: `${subject || "Email Campaign"} for ${segment}`,
          }),
        }
      );

      setSuccess("Campaign scheduled successfully.");

      window.dispatchEvent(
        new Event("marketing-data-refresh")
      );

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
      title="Email Campaign Builder"
    >

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-5">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <div className="flex items-center gap-3 mb-5">

              <Mail
                className="text-cyan-300"
                size={20}
              />

              <h3 className="text-xl font-black text-white">
                Campaign Setup
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <label className="text-sm text-gray-400 block mb-2">
                  Audience Segment
                </label>

                <select
                  value={segment}
                  onChange={(e) =>
                    setSegment(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
                >
                  <option value="all">
                    All Leads
                  </option>

                  <option value="new">
                    New
                  </option>

                  <option value="cold">
                    Cold
                  </option>

                  <option value="qualified">
                    Qualified
                  </option>

                  <option value="converted">
                    Converted
                  </option>

                </select>

              </div>

              <div>

                <label className="text-sm text-gray-400 block mb-2">
                  Stagger Size
                </label>

                <select
                  value={stagger}
                  onChange={(e) =>
                    setStagger(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
                >

                  <option>
                    50
                  </option>

                  <option>
                    100
                  </option>

                  <option>
                    150
                  </option>

                  <option>
                    200
                  </option>

                </select>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

              <div>

                <label className="text-sm text-gray-400 block mb-2">
                  Send Date
                </label>

                <div className="relative">

                  <Calendar
                    className="absolute left-4 top-4 text-gray-500"
                    size={18}
                  />

                  <input
                    type="date"
                    value={sendDate}
                    onChange={(e) =>
                      setSendDate(
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/30 pl-12 p-4 text-white"
                  />

                </div>

              </div>

              <div>

                <label className="text-sm text-gray-400 block mb-2">
                  Send Time
                </label>

                <div className="relative">

                  <Clock
                    className="absolute left-4 top-4 text-gray-500"
                    size={18}
                  />

                  <input
                    type="time"
                    value={sendTime}
                    onChange={(e) =>
                      setSendTime(
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/30 pl-12 p-4 text-white"
                  />

                </div>

              </div>

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <label className="text-sm text-gray-400 block mb-2">
              Subject Line
            </label>

            <input
              value={subject}
              onChange={(e) =>
                setSubject(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white mb-5"
              placeholder="Enter subject..."
            />

            <label className="text-sm text-gray-400 block mb-2">
              Email Body
            </label>

            <textarea
              value={body}
              onChange={(e) =>
                setBody(
                  e.target.value
                )
              }
              className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              placeholder="Write campaign..."
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

                <Upload size={18} />

                Upload Media

              </button>

              <button
                onClick={scheduleCampaign}
                disabled={loading}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2"
              >

                {
                  loading
                    ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    )
                    : (
                      <Send size={18} />
                    )
                }

                {
                  loading
                    ? "Launching..."
                    : "Schedule Campaign"
                }

              </button>

            </div>

          </div>

        </div>

        <div>

          <AIAssistantPanel
            type="email"
            prompt={prompt}
            setPrompt={setPrompt}
            credits={credits}
            onGenerate={generateAI}
            loading={aiLoading}
            error={aiError}
          />

          <div className="mt-5 rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5">

            <div className="flex items-center gap-2 mb-3">

              <Sparkles
                size={18}
                className="text-cyan-300"
              />

              <div className="font-black text-white">
                AI Optimization
              </div>

            </div>

            <div className="space-y-2 text-sm text-gray-400">

              <div>
                • Send-time intelligence
              </div>

              <div>
                • Audience targeting analysis
              </div>

              <div>
                • Spam score reduction
              </div>

              <div>
                • Conversion optimization
              </div>

              <div>
                • CTA enhancement
              </div>

            </div>

          </div>

        </div>

      </div>

    </MarketingModal>

  );

}


