export {};
"use client";

const rows = new Array(7).fill(0);
const cols = new Array(14).fill(0);

export default function SalesHeatmap() {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-white font-bold text-lg">
          Sales Activity Heatmap
        </h3>

        <p className="text-gray-500 text-sm">
          Lead engagement intensity
        </p>
      </div>

      <div className="space-y-2">
        {rows.map((_, r) => (
          <div
            key={r}
            className="flex gap-2"
          >
            {cols.map((_, c) => {
              const level = ((r * c) + c + r) % 4;

              const bg =
                level === 0
                  ? "bg-white/5"
                  : level === 1
                  ? "bg-cyan-500/20"
                  : level === 2
                  ? "bg-cyan-400/40"
                  : "bg-cyan-300/70";

              return (
                <div
                  key={c}
                  className={`w-5 h-5 rounded-md ${bg}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
