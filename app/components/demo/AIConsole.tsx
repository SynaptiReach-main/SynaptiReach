export {};
"use client";

import { useEffect, useState } from "react";
import { dispatch } from "../sections/dashboard-preview/engine/simulation-engine";

export default function AIConsole() {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = [
        "CEO AI: Reduce ad spend 12%",
        "CEO AI: Increase retargeting",
        "CEO AI: Focus high LTV leads",
      ][Math.floor(Math.random() * 3)];

      setLog((l) => [msg, ...l.slice(0, 5)]);

      dispatch({ type: "AI_MESSAGE", payload: msg });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/30 p-4 rounded-xl">
      <div className="text-xs text-gray-400 mb-2">AI CEO Decisions</div>
      <div className="space-y-2 text-sm">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
