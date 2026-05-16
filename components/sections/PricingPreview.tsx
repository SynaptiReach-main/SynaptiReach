"use client";

const plans = [
  { name: "Basic Managed", price: "$49/mo", lines: ["3,000 AI actions/mo", "1,000 emails/mo", "100 SMS/mo", "500 contacts"] },
  { name: "Growth Managed", price: "$99/mo", popular: true, lines: ["12,000 AI actions/mo", "5,000 emails/mo", "500 SMS/mo", "2,500 contacts"] },
  { name: "Premium Managed", price: "$199/mo", lines: ["40,000 AI actions/mo", "20,000 emails/mo", "1,500 SMS/mo", "10,000 contacts"] },
];

export default function PricingPreview() {
  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Scalable Pricing</h2>
      <p className="text-gray-400 mb-12">Start a 14-day trial. BYOK starts at $29/mo.</p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`p-6 rounded-2xl border ${plan.popular ? "border-cyan-400" : "border-white/10 bg-white/5"} relative`}>
            {plan.popular && <div className="absolute top-0 right-0 text-xs px-2 py-1 bg-cyan-400 text-black rounded-bl-lg">Most Popular</div>}
            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold mb-4">{plan.price}</p>
            <ul className="text-gray-400 text-sm space-y-2 mb-6">
              {plan.lines.map((line) => <li key={line}>{line}</li>)}
              <li>Hard caps. No overages.</li>
            </ul>
            <a href="/trial" className="block py-2 rounded-lg font-semibold text-black" style={{ background: "linear-gradient(to right, #00FFFF, #00E676)" }}>
              Start 14-Day Trial
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <a href="/pricing" className="text-cyan-400 hover:underline">View Full Pricing</a>
      </div>
    </section>
  );
}
