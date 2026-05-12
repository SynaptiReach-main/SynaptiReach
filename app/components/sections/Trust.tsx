export {};
"use client";

export default function Trust() {
  const stats = [
    {
      value: "24/7",
      label: "AI Lead Response"
    },
    {
      value: "< 5 min",
      label: "Average Reply Time"
    },
    {
      value: "All-in-One",
      label: "CRM + Marketing"
    }
  ];

  return (
    <section className="py-16 px-6 text-center">
      <p className="text-gray-400 mb-10">
        Built for modern service businesses that want to grow faster with less manual work
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-8">
        {stats.map((s, i) => (
          <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div
              className="text-2xl font-bold"
              style={{
                background: "linear-gradient(to right, #00FFFF, #00E676)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {s.value}
            </div>
            <p className="text-gray-400 mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
