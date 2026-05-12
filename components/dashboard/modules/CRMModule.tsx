"use client";

export default function CRMModule({ state, dispatch }: any) {
  return (
    <div className="p-4 border rounded-xl">
      <h2 className="text-lg font-bold mb-2">CRM</h2>

      <button
        onClick={() =>
          dispatch({ type: "GENERATE_LEADS", payload: { count: 5 } })
        }
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Add Leads from Import
      </button>

      <div className="mt-3">
        Leads: {state.leads.length}
      </div>
    </div>
  );
}
