"use client";

export default function CampaignModule({ dispatch }: any) {
  return (
    <div className="p-4 border rounded-xl">
      <h2 className="text-lg font-bold mb-2">Marketing</h2>

      <button
        onClick={() => dispatch({ type: "MARKETING_BLAST" })}
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Launch Email Campaign
      </button>
    </div>
  );
}
