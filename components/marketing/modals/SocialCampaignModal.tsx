"use client";

import { useState } from "react";

import {
  Share2,
  Calendar,
  Clock,
  Image,
  Send,
} from "lucide-react";

import MarketingModal from "../shared/MarketingModal";
import AIAssistantPanel from "../ai/AIAssistantPanel";

import { estimateAICredits } from "@/lib/marketing/utils/credits";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SocialCampaignModal({
  open,
  onClose,
}: Props) {
  const [prompt, setPrompt] =
    useState("");

  const [content, setContent] =
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
              "You are an elite social media strategist.",
          }),
        }
      );

    const data =
      await response.json();

    setContent(data.text || "");
  }

  return (
    <MarketingModal
      open={open}
      onClose={onClose}
      title="Social Campaign Builder"
    >

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-5">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <select className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                <option>Facebook</option>
                <option>Instagram</option>
                <option>Facebook + Instagram</option>
              </select>

              <select className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                <option>Organic Post</option>
                <option>Advertisement</option>
              </select>

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
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
              placeholder="Write social campaign..."
            />

            <div className="flex flex-wrap items-center gap-3 mt-5">

              <button className="px-5 py-3 rounded-2xl border border-white/10 bg-black/30 text-white flex items-center gap-2">
                <Image size={18} />
                Upload Creative
              </button>

              <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black flex items-center gap-2">
                <Send size={18} />
                Schedule Social Campaign
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
          />

        </div>

      </div>

    </MarketingModal>
  );
}
