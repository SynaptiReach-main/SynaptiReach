"use client";

import { dispatch, useSimulationEngine } from "../engine/simulation-engine";

export default function PipelineModule() {
  const state = useSimulationEngine();

  return (
    <div className="bg-[#0B0F14] p-4 rounded-2xl border border-white/5">
      <h2 className="text-white text-lg mb-4">Pipeline</h2>

      <div className="text-gray-400 mb-3">
        Deals Closed: <span className="text-white">{state.deals}</span>
      </div>

      <button
        onClick={() => dispatch({ type: "CLOSE_DEAL" })}
        className="px-3 py-2 bg-green-500/20 text-green-300 rounded"
      >
        Close Deal
      </button>
    </div>
  );
}
