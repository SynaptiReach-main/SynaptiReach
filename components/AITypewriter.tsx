"use client";

import { useSimulationEngine } from "./sections/dashboard-preview/engine/simulation-engine";

export default function AITypewriter() {
  const state = useSimulationEngine();

  const message = `
Leads: ${state.leads}
Deals: ${state.deals}
AI Activity: ${state.aiMessages[state.aiMessages.length - 1] || "Initializing..."}
`;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-black/40 border border-white/10 backdrop-blur px-4 py-2 rounded-xl text-xs text-cyan-300 font-mono whitespace-pre-line">
      {message}
    </div>
  );
}
