export {};
"use client";

import { useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState("crm");

  return (
    <div className="flex h-screen bg-[#070B10] text-white">
      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/5 p-4 space-y-4">
        <div className="text-xl font-bold mb-6">
          SynaptiReach
        </div>

        {[
          { id: "crm", label: "CRM" },
          { id: "pipeline", label: "Pipeline" },
          { id: "campaigns", label: "Marketing" },
          { id: "ai", label: "AI Assistant" },
        ].map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`block w-full text-left px-3 py-2 rounded ${
              active === item.id
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 p-6 overflow-auto">
        {typeof children === "function"
          ? (children as any)(active)
          : children}
      </div>
    </div>
  );
}
