"use client";

const activities = [
  "New enterprise lead assigned to Sarah",
  "AI responded to inbound inquiry",
  "Healthcare campaign launched",
  "Pipeline status updated for Apex Logistics",
  "Client onboarding completed",
  "Proposal sent to enterprise lead",
];

export default function LiveActivityStream() {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-white font-bold text-lg">
          Live Activity
        </h3>

        <p className="text-gray-500 text-sm">
          Real-time operational updates
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="flex items-start gap-3"
          >
            <div className="w-2 h-2 mt-2 rounded-full bg-cyan-400 animate-pulse" />

            <div>
              <p className="text-sm text-gray-300">
                {activity}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {i + 1}m ago
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
