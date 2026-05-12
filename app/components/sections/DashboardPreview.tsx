export {};
"use client";
import useSimulation from "../simulation/useSimulation";
import FakeCursor from "../FakeCursor";

export default function DashboardPreview() {
  const { leads, activity, mounted } = useSimulation();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-gray-500">
        Loading AI simulation...
      </div>
    );
  }

  return (
    <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 overflow-hidden">
      
      <FakeCursor />

      <div className="grid grid-cols-2 gap-4 text-sm">
        
        <div>
          <h3 className="text-white mb-2">Pipeline</h3>
          {leads.slice(-5).map((lead, idx) => (
            <div key={lead.id + idx} className="bg-white/5 p-2 rounded mb-2">
              <div>{lead.name}</div>
              <div className="text-xs text-cyan-400">{lead.stage}</div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-white mb-2">Activity</h3>
          {activity.map((log, i) => (
            <div key={i} className="text-gray-400 text-xs mb-1">
              {log}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
