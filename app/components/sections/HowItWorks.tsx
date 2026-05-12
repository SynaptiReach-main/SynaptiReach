export {};
"use client";

export default function HowItWorks() {
  const steps = [
    "Connect your tools",
    "AI captures & nurtures leads",
    "You close more deals"
  ];

  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold mb-10">How It Works</h2>

      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {steps.map((step, i) => (
          <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
            <span className="text-2xl font-bold text-cyan-400">
              {i + 1}
            </span>
            <p className="mt-2 text-gray-300">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
