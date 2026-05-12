export {};
"use client";

import { useEffect, useState } from "react";

type Event = {
  event: string;
  data: Record<string, any>;
  timestamp: number;
};

export default function AnalyticsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sr_events") || "[]");
    setEvents(stored.reverse());
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="space-y-3">
        {events.length === 0 && (
          <div className="text-white/50">No events yet</div>
        )}

        {events.map((e, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/10 bg-white/5"
          >
            <div className="text-sm font-semibold">
              {e.event}
            </div>

            <div className="text-xs text-white/50 mb-2">
              {new Date(e.timestamp).toLocaleString()}
            </div>

            <pre className="text-xs bg-black/40 p-2 rounded overflow-x-auto">
{JSON.stringify(e.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
