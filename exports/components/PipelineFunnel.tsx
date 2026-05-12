"use client";

export default function PipelineFunnel() {
  const stages = [
    {
      name: "New Leads",
      count: 248,
      width: "100%",
      color: "from-cyan-500/40 to-cyan-500/10",
    },
    {
      name: "Contacted",
      count: 186,
      width: "82%",
      color: "from-sky-500/40 to-sky-500/10",
    },
    {
      name: "Qualified",
      count: 121,
      width: "64%",
      color: "from-blue-500/40 to-blue-500/10",
    },
    {
      name: "Proposal Sent",
      count: 74,
      width: "48%",
      color: "from-indigo-500/40 to-indigo-500/10",
    },
    {
      name: "Negotiation",
      count: 38,
      width: "34%",
      color: "from-violet-500/40 to-violet-500/10",
    },
    {
      name: "Closed Won",
      count: 19,
      width: "22%",
      color: "from-emerald-500/40 to-emerald-500/10",
    },
  ];

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#0b0b0b]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-semibold">
            Pipeline Funnel
          </h2>
          <p className="text-sm text-gray-500">
            Live sales pipeline conversion overview
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Conversion Rate
          </p>
          <p className="text-emerald-400 text-2xl font-bold">
            7.6%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.name}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-300">
                {stage.name}
              </span>

              <span className="text-sm text-cyan-400 font-medium">
                {stage.count} Leads
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-xl h-12 overflow-hidden">
              <div
                className={`h-full rounded-xl bg-gradient-to-r ${stage.color} border border-white/10 flex items-center px-4`}
                style={{
                  width: stage.width,
                  transition: "width 0.6s ease",
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-white/90">
                    Active Prospects
                  </span>

                  <span className="text-xs text-white/70">
                    {stage.width}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
