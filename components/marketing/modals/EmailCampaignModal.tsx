"use client";

import { useState } from "react";

import {
  Mail,
  Calendar,
  Clock,
  Upload,
  Users,
  Send,
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
  const [prompt, setPrompt] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [body, setBody] =
    useState("");

  const credits =
    estimateAICredits(prompt);

  async function generateAI() {
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
              "You are an elite email marketing strategist.",
          }),
        }
      );

    const data =
      await response.json();

    setBody(data.text || "");
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

                <select className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                  <option>All Leads</option>
                  <option>New</option>
                  <option>Cold</option>
                  <option>Qualified</option>
                  <option>Converted</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Stagger Size
                </label>

                <select className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                  <option>50</option>
                  <option>100</option>
                  <option>150</option>
                  <option>200</option>
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
                setSubject(e.target.value)
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
                setBody(e.target.value)
              }
              className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              placeholder="Write campaign..."
            />

            <div className="flex flex-wrap items-center gap-3 mt-5">

              <button className="px-5 py-3 rounded-2xl border border-white/10 bg-black/30 text-white flex items-center gap-2">
                <Upload size={18} />
                Upload Media
              </button>

              <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2">
                <Send size={18} />
                Schedule Campaign
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

        </div>

      </div>

    </MarketingModal>
  );
}
