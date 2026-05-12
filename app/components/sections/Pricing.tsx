export {};
"use client";

export default function Pricing() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-white mb-10">
        Simple, Scalable Pricing
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { name: "Starter", price: "$29/mo" },
          { name: "Growth", price: "$79/mo" },
          { name: "Pro", price: "$149/mo" },
        ].map((plan, i) => (
          <div
            key={plan.name}
            className="p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur"
          >
            <div className="text-xl font-semibold text-white">
              {plan.name}
            </div>
            <div className="text-3xl font-bold text-cyan-400 mt-4">
              {plan.price}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
