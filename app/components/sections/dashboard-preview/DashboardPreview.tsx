export {};
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSimulationEngine, dispatch } from "./engine/simulation-engine";
import AITyping from "./ui/AITyping";

export default function DashboardPreview() {
  const state = useSimulationEngine();

  const [aiText, setAiText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "ADD_LEAD" });

      if (Math.random() > 0.5) {
        dispatch({ type: "CLOSE_DEAL" });
      }

      const msg = "AI optimizing revenue pipeline...";
      setAiText(msg);

      dispatch({
        type: "AI_MESSAGE",
        payload: msg,
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/demo">
      <div className="relative group cursor-pointer">

        {/* glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-green-500/10 blur-3xl opacity-40 group-hover:opacity-70 transition" />

        <div className="relative bg-[#0B0F14] border border-white/5 rounded-3xl p-8 overflow-hidden backdrop-blur">

          {/* header */}
          <div className="flex justify-between mb-6 text-xs text-gray-400">
            <div>SynaptiReach System</div>
            <div className="text-green-400">LIVE</div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Stat label="Leads" value={state.leads} />
            <Stat label="Deals" value={state.deals} />
            <Stat label="Revenue" value={`$${state.deals * 2400}`} />
          </div>

          {/* AI typing */}
          <div className="text-cyan-300 text-sm h-6 mb-4">
            <AITyping text={aiText} />
          </div>

          {/* feed */}
          <div className="space-y-2 text-xs h-24 overflow-hidden">
            {state.aiMessages.slice(-4).map((m: string, i: number) => (
              <div key={i} className="bg-black/30 p-2 rounded text-gray-300">
                {m}
              </div>
            ))}
          </div>

          {/* hover */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <div className="text-cyan-300 text-lg">
              Enter Live Dashboard →
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-black/30 p-3 rounded-xl">
      <div className="text-gray-400 text-xs">{label}</div>
      <div className="text-white text-lg">{value}</div>
    </div>
  );
}
