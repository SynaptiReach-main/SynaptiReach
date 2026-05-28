export {};
"use client";

import { useSimulationEngine } from "../sections/dashboard-preview/engine/simulation-engine";

export default function AIWidget() {
  const state = useSimulationEngine();

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-[#0B0F14] border border-white/10 rounded-2xl shadow-xl p-4">
      <div className="text-sm text-cyan-300 mb-2">CRM Intelligence</div>

      <div className="space-y-2 max-h-40 overflow-auto text-xs">
        {state.aiMessages.map((msg: string, i: number) => (
          <div key={i} className="bg-black/30 p-2 rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
