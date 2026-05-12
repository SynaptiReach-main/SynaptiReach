"use client";

const months = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 51 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 64 },
  { month: "May", value: 72 },
  { month: "Jun", value: 81 },
  { month: "Jul", value: 93 },
  { month: "Aug", value: 108 },
];

export default function RevenueForecast() {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg">
            Revenue Forecast
          </h3>

          <p className="text-gray-500 text-sm">
            Predicted recurring revenue growth
          </p>
        </div>

        <div className="text-right">
          <p className="text-emerald-400 text-xl font-bold">
            +28.4%
          </p>

          <p className="text-gray-500 text-xs">
            projected growth
          </p>
        </div>
      </div>

      <div className="h-64 flex items-end gap-3">
        {months.map((m) => (
          <div
            key={m.month}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div className="relative w-full flex items-end h-full">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500/30 to-cyan-400/70 border border-cyan-400/20"
                style={{
                  height: `${m.value}%`,
                }}
              />

              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-cyan-300">
                ${m.value}k
              </div>
            </div>

            <span className="text-xs text-gray-500">
              {m.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
