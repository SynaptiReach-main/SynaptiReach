"use client";

import { dispatch } from "../engine/simulation-engine";

export default function CampaignModule() {
  return (
    <div className="bg-[#0B0F14] p-4 rounded-2xl border border-white/5">
      <h2 className="text-white text-lg mb-4">Campaigns</h2>

      <button
        onClick={() =>
          dispatch({
            type: "AI_MESSAGE",
            payload: "Campaign optimized using AI",
          })
        }
        className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded"
      >
        Optimize Campaign
      </button>
    </div>
  );
}
