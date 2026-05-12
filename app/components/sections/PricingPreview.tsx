export {};
"use client";

export default function PricingPreview() {
  return (
    <section className="py-24 px-6 text-center">

      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Simple, Scalable Pricing
      </h2>

      <p className="text-gray-400 mb-12">
        Start free. Upgrade as you grow.
      </p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">

        {/* STARTER */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold mb-2">Starter</h3>
          <p className="text-3xl font-bold mb-4">$0</p>
          <ul className="text-gray-400 text-sm space-y-2 mb-6">
            <li>✔ Basic lead capture</li>
            <li>✔ Limited automation</li>
            <li>✔ Email support</li>
          </ul>
          <a
            href="/trial"
            className="block py-2 rounded-lg border border-white/20"
          >
            Start Free
          </a>
        </div>

        {/* PRO (highlighted) */}
        <div className="p-6 rounded-2xl border border-cyan-400 relative">
          <div className="absolute top-0 right-0 text-xs px-2 py-1 bg-cyan-400 text-black rounded-bl-lg">
            Most Popular
          </div>

          <h3 className="text-lg font-semibold mb-2">Pro</h3>
          <p className="text-3xl font-bold mb-4">$29/mo</p>

          <ul className="text-gray-400 text-sm space-y-2 mb-6">
            <li>✔ AI lead capture</li>
            <li>✔ Smart follow-ups</li>
            <li>✔ CRM pipeline</li>
            <li>✔ Priority support</li>
          </ul>

          <a
            href="/trial"
            className="block py-2 rounded-lg font-semibold text-black"
            style={{
              background: "linear-gradient(to right, #00FFFF, #00E676)"
            }}
          >
            Start Free Trial
          </a>
        </div>

        {/* SCALE */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold mb-2">Scale</h3>
          <p className="text-3xl font-bold mb-4">$79/mo</p>
          <ul className="text-gray-400 text-sm space-y-2 mb-6">
            <li>✔ Everything in Pro</li>
            <li>✔ Advanced automation</li>
            <li>✔ Multi-channel outreach</li>
            <li>✔ Analytics dashboard</li>
          </ul>
          <a
            href="/trial"
            className="block py-2 rounded-lg border border-white/20"
          >
            Get Started
          </a>
        </div>

      </div>

      {/* CTA */}
      <div className="mt-12">
        <a
          href="/pricing"
          className="text-cyan-400 hover:underline"
        >
          View Full Pricing →
        </a>
      </div>

    </section>
  );
}
