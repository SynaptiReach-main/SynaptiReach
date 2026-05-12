"use client";

const queue = [
  {
    task: "Lead qualification workflow",
    status: "Running",
  },
  {
    task: "Email follow-up sequence",
    status: "Queued",
  },
  {
    task: "CRM synchronization",
    status: "Completed",
  },
  {
    task: "Campaign optimization",
    status: "Running",
  },
];

export default function AutomationQueue() {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-white font-bold text-lg">
          Automation Queue
        </h3>

        <p className="text-gray-500 text-sm">
          Active autonomous workflows
        </p>
      </div>

      <div className="space-y-3">
        {queue.map((item) => (
          <div
            key={item.task}
            className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20"
          >
            <span className="text-gray-300 text-sm">
              {item.task}
            </span>

            <span
              className={`text-xs px-3 py-1 rounded-full border ${
                item.status === "Running"
                  ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                  : item.status === "Completed"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
