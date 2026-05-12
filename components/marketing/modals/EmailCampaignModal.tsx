"use client";

import { useState } from "react";

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

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const credits = estimateAICredits(prompt);

  async function generateAI() {

    try {

      setAiLoading(true);

      const response =
        await fetch(
          "/api/marketing/ai/generate",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              prompt,
              system:
                `
You are SynaptiReach's elite email campaign strategist.

Generate:
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
            }),
          }
        );

      const data =
        await response.json();

      if (data?.text) {

        const generated =
          data.text;

        const split =
          generated.split("\n");

        if (split.length > 0) {
          setSubject(split[0]);
        }

        setBody(generated);
      }

    } catch (error) {

      console.error(error);

    } finally {

      setAiLoading(false);

    }

  }

  async function scheduleCampaign() {

    try {

      setLoading(true);

      const scheduledFor =
        sendDate && sendTime
          ? new Date(
              `${sendDate}T${sendTime}`
            ).toISOString()
          : null;

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
              segment,
              subject,
              content: body,
              stagger_size: Number(stagger),
              scheduled_for: scheduledFor,
              status:
                scheduledFor
                  ? "scheduled"
                  : "processing",
            }),
          }
        );

      const campaignData =
        await campaignResponse.json();

      if (!campaignData.success) {

        alert(
          "Failed to create campaign"
        );

        return;
      }

      if (!scheduledFor) {

        const executeResponse =
          await fetch(
            "/api/marketing/email/send",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                campaignId:
                  campaignData.campaign.id,
              }),
            }
          );

        const executeData =
          await executeResponse.json();

        if (!executeData.success) {

          alert(
            "Campaign execution failed"
          );

          return;
        }

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
            type: "email_campaign",
            title:
              subject ||
              "Email Campaign",
            status:
              scheduledFor
                ? "scheduled"
                : "sent",
          }),
        }
      );

      alert(
        scheduledFor
          ? "Campaign scheduled successfully"
          : "Campaign launched successfully"
      );

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        "Campaign failed"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <MarketingModal
      open={open}
      onClose={onClose}
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

              <button className="px-5 py-3 rounded-2xl border border-white/10 bg-black/30 text-white flex items-center gap-2">

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
