export {};
"use client";

import useSimulation from "../useSimulation";

export default function DashboardPreview() {
  const { leads, activity } = useSimulation();

  return (
    <div className="p-6 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">

      <h2 className="text-lg mb-4">Live System Activity</h2>

      <div className="grid grid-cols-2 gap-4">

        {/* LEADS */}
        <div>
          <h3 className="text-sm text-gray-400 mb-2">Leads</h3>
          <div className="space-y-2">
            {leads.map((l) => (
              <div key={l.id} className="p-2 bg-white/5 rounded text-xs">
                {l.name} → {l.stage}
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITY */}
        <div>
          <h3 className="text-sm text-gray-400 mb-2">AI Activity</h3>
          <div className="space-y-2">
            {activity.map((a, i) => (
              <div key={i} className="text-xs text-cyan-300">
                {a}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
