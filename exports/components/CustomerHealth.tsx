"use client";

const clients = [
  {
    name: "Apex Logistics",
    health: "Excellent",
    usage: "92%",
    color: "text-emerald-400",
  },
  {
    name: "Nova Medical",
    health: "Stable",
    usage: "74%",
    color: "text-cyan-300",
  },
  {
    name: "Velocity Retail",
    health: "At Risk",
    usage: "41%",
    color: "text-red-400",
  },
];

export default function CustomerHealth() {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-white font-bold text-lg">
          Customer Health
        </h3>

        <p className="text-gray-500 text-sm">
          Client engagement and retention
        </p>
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.name}
            className="p-4 rounded-xl border border-white/5 bg-black/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {client.name}
                </p>

                <p className={`text-sm ${client.color}`}>
                  {client.health}
                </p>
              </div>

              <div className="text-right">
                <p className="text-white font-bold">
                  {client.usage}
                </p>

                <p className="text-xs text-gray-500">
                  platform usage
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
