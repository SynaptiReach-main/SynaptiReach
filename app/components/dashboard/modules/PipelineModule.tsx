export {};
"use client";

export default function PipelineModule({ state }: any) {
  return (
    <div className="p-4 border rounded-xl">
      <h2 className="text-lg font-bold mb-2">Pipeline</h2>

      <div>MRR: ${state.company.mrr}</div>

      <div className="mt-2">
        Won Deals: {state.leads.filter(l => l.stage === "won").length}
      </div>
    </div>
  );
}
