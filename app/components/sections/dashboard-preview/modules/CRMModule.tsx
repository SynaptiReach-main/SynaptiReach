export {};
"use client";

import { dispatch, useSimulationEngine } from "../engine/simulation-engine";

export default function CRMModule() {
  const state = useSimulationEngine();

  return (
    <div className="bg-[#0B0F14] p-4 rounded-2xl border border-white/5">
      <h2 className="text-white text-lg mb-4">CRM</h2>

      <div className="text-gray-400 mb-3">
        Leads: <span className="text-white">{state.leads}</span>
      </div>

      <button
        onClick={() => dispatch({ type: "ADD_LEAD" })}
        className="px-3 py-2 bg-cyan-500/20 text-cyan-300 rounded"
      >
        Add Lead
      </button>
    </div>
  );
}
