export {};
"use client";

import { useSimulationEngine } from "../engine/simulation-engine";

export default function AIChatModule() {
  const state = useSimulationEngine();

  return (
    <div className="bg-[#0B0F14] p-4 rounded-2xl border border-white/5">
      <h2 className="text-white text-lg mb-4">CRM Intelligence</h2>

      <div className="space-y-2 text-sm">
        {state.aiMessages.map((msg: string, i: number) => (
          <div key={i} className="bg-black/30 p-2 rounded text-gray-300">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
