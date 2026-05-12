"use client";

import { useState } from "react";

import {
  MessageSquare,
  Calendar,
  Clock,
  Upload,
  Send,
} from "lucide-react";

import MarketingModal from "../shared/MarketingModal";
import AIAssistantPanel from "../ai/AIAssistantPanel";

import { estimateAICredits } from "@/lib/marketing/utils/credits";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SMSCampaignModal({
  open,
  onClose,
}: Props) {
  const [prompt, setPrompt] =
    useState("");

  const [message, setMessage] =
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
              "You are an elite SMS marketing strategist.",
          }),
        }
      );

    const data =
      await response.json();

    setMessage(data.text || "");
  }

  return (
    <MarketingModal
      open={open}
      onClose={onClose}
      title="SMS Campaign Builder"
    >

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-5">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <div className="flex items-center gap-3 mb-5">

              <MessageSquare
                className="text-cyan-300"
                size={20}
              />

              <h3 className="text-xl font-black text-white">
                SMS Campaign Setup
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

              <input
                type="date"
                className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              />

              <input
                type="time"
                className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              />

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              placeholder="Write SMS campaign..."
            />

            <div className="flex flex-wrap items-center gap-3 mt-5">

              <button className="px-5 py-3 rounded-2xl border border-white/10 bg-black/30 text-white flex items-center gap-2">
                <Upload size={18} />
                Upload Media
              </button>

              <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2">
                <Send size={18} />
                Schedule SMS Campaign
              </button>

            </div>

          </div>

        </div>

        <div>

          <AIAssistantPanel
            type="sms"
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
