export {};
"use client";

export default function ActivityFeed({ state }: any) {
  return (
    <div className="p-4 border rounded-xl h-48 overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">Live Activity</h2>

      {state.events.slice(-10).map((e: string, i: number) => (
        <div key={i} className="text-sm opacity-80">
          • {e}
        </div>
      ))}
    </div>
  );
}
