"use client";

import Link from "next/link";
import {
  CREDIT_PACKS,
  DFY_PLANS,
  MANAGED_PLANS,
  SELF_SERVICE_BYOK_PLANS,
} from "@/lib/billing/plans";
import Footer from "@/components/sections/Footer";

const card =
  "rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 backdrop-blur";

function PlanCard({ plan }: { plan: any }) {
  return (
    <div className={`${card} relative ${plan.popular ? "border-cyan-300/50 shadow-2xl shadow-cyan-500/10" : ""}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-1 text-xs font-black text-black">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-2xl font-black">{plan.name}</h3>
      <div className="mt-3 bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-4xl font-black text-transparent">
        {plan.price}
      </div>
      {plan.note && <p className="mt-3 text-sm text-green-200">{plan.note}</p>}
      <dl className="mt-6 space-y-3 text-sm text-cyan-50/80">
        <div className="flex justify-between gap-4"><dt>AI actions</dt><dd className="font-bold text-white">{plan.aiActions}</dd></div>
        <div className="flex justify-between gap-4"><dt>Email sends</dt><dd className="font-bold text-white">{plan.emails}</dd></div>
        <div className="flex justify-between gap-4"><dt>SMS sends</dt><dd className="font-bold text-white">{plan.sms}</dd></div>
        <div className="flex justify-between gap-4"><dt>Contacts</dt><dd className="font-bold text-white">{plan.contacts}</dd></div>
        <div className="flex justify-between gap-4"><dt>AI agents</dt><dd className="font-bold text-white">{plan.agents}</dd></div>
      </dl>
      <Link href="/trial" className="mt-6 block rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-3 text-center font-black text-black">
        Start 14-Day Trial
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen px-5 py-16 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-200">
          TRANSPARENT PRICING - HARD CAPS - NO SURPRISE OVERAGES
        </div>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          Pricing Built for
          <span className="block bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
            Safe AI Growth
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-cyan-50/70">
          Choose BYOK to use your own provider keys, or Managed to use SynaptiReach keys with strict monthly caps.
          Users are charged only after selecting a paid plan and entering payment details through Stripe Checkout.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-6xl">
        <div className="mb-6">
          <h2 className="text-3xl font-black">Self-Service BYOK</h2>
          <p className="mt-2 text-cyan-50/65">
            Bring your own AI, email, and SMS provider keys. SynaptiReach tracks usage, but your provider bills you directly.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {SELF_SERVICE_BYOK_PLANS.map((plan) => <PlanCard key={plan.name} plan={plan} />)}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <div className="mb-6">
          <h2 className="text-3xl font-black">Managed SynaptiReach Keys</h2>
          <p className="mt-2 text-cyan-50/65">
            SynaptiReach manages provider access for you. Every managed plan has hard caps and no surprise overages.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {MANAGED_PLANS.map((plan) => <PlanCard key={plan.name} plan={plan} />)}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="text-3xl font-black">Credit Packs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <div key={pack} className={card}>
              <div className="text-sm font-bold text-cyan-100">{pack}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="text-3xl font-black">Done-For-You Setup</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {DFY_PLANS.map((plan) => (
            <div key={plan.name} className={`${card} relative ${plan.popular ? "border-cyan-300/50" : ""}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-1 text-xs font-black text-black">MOST POPULAR</div>}
              <h3 className="text-2xl font-black">{plan.name}</h3>
              <div className="mt-3 text-2xl font-black text-cyan-200">{plan.price}</div>
              <ul className="mt-5 space-y-2 text-sm text-cyan-50/75">
                {plan.features.map((feature: string) => <li key={feature}>- {feature}</li>)}
              </ul>
              <Link href="/contact" className="mt-6 block rounded-2xl border border-cyan-300/30 px-5 py-3 text-center font-bold text-cyan-100">
                Talk to Sales
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-8">
        <h2 className="text-2xl font-black">Trial and Billing FAQ</h2>
        <div className="mt-5 space-y-4 text-sm text-cyan-50/75">
          <p><strong className="text-white">How long is the free trial?</strong> Every self-service trial lasts 14 days.</p>
          <p><strong className="text-white">Are there overages?</strong> No. Trial and managed plan caps are hard caps.</p>
          <p><strong className="text-white">Can I use SMS during trial?</strong> Managed SMS is not included during the free trial. Connect your own Twilio/BYOK provider for SMS testing.</p>
          <p><strong className="text-white">What happens after limits or trial end?</strong> After the 14-day trial, your selected plan renews automatically unless canceled before the trial ends. Contact and waitlist submissions do not create charges.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
