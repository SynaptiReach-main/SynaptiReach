"use client";

export default function AIChatModule({ dispatch }: any) {
  return (
    <div className="p-4 border rounded-xl">
      <h2 className="text-lg font-bold mb-2">AI CEO</h2>

      <button
        onClick={() =>
          dispatch({ type: "MARKETING_BLAST" })
        }
        className="px-3 py-1 bg-purple-500 text-white rounded"
      >
        Ask AI Assistant
      </button>
    </div>
  );
}
