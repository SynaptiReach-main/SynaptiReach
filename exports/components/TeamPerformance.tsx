"use client";

const reps = [
  {
    name: "Sarah Chen",
    deals: 14,
    closeRate: "32%",
  },
  {
    name: "Marcus Reed",
    deals: 11,
    closeRate: "28%",
  },
  {
    name: "Emily Carter",
    deals: 9,
    closeRate: "24%",
  },
];

export default function TeamPerformance() {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-white font-bold text-lg">
          Team Performance
        </h3>

        <p className="text-gray-500 text-sm">
          Sales representative productivity
        </p>
      </div>

      <div className="space-y-4">
        {reps.map((rep) => (
          <div
            key={rep.name}
            className="p-4 rounded-xl border border-white/5 bg-black/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-medium">
                  {rep.name}
                </p>

                <p className="text-xs text-gray-500">
                  Account Executive
                </p>
              </div>

              <span className="text-emerald-400 text-sm">
                {rep.closeRate}
              </span>
            </div>

            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{
                  width: rep.closeRate,
                }}
              />
            </div>

            <div className="flex justify-between mt-3 text-xs">
              <span className="text-gray-500">
                Deals Closed
              </span>

              <span className="text-white">
                {rep.deals}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
