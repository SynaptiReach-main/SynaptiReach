"use client";

import { useState } from "react";
import Link from "next/link";
import { COMMITMENT_DISCOUNTS, TRIAL_PLANS } from "@/lib/billing/plans";

export default function TrialPage() {
  const [mode, setMode] = useState<"managed" | "byok">("managed");

  return (
    <main className="min-h-screen px-5 py-16 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-200">
          14-DAY FREE TRIAL
        </div>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          Start SynaptiReach With
          <span className="block bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
            Hard-Capped Trial Access
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-cyan-50/70">
          Start a 14-day free trial with safe usage caps. No overages. Upgrade is required to continue after limits or after 14 days.
        </p>
      </section>

      <section className="mx-auto mt-10 flex max-w-6xl justify-center gap-3">
        <button onClick={() => setMode("managed")} className={`rounded-2xl px-5 py-3 font-bold ${mode === "managed" ? "bg-gradient-to-r from-cyan-300 to-green-300 text-black" : "border border-cyan-400/15 bg-cyan-400/5 text-cyan-100"}`}>
          SynaptiReach Managed Trial
        </button>
        <button onClick={() => setMode("byok")} className={`rounded-2xl px-5 py-3 font-bold ${mode === "byok" ? "bg-gradient-to-r from-cyan-300 to-green-300 text-black" : "border border-cyan-400/15 bg-cyan-400/5 text-cyan-100"}`}>
          BYOK Trial
        </button>
      </section>

      {mode === "managed" ? (
        <section className="mx-auto mt-12 max-w-6xl">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black">Managed Trial Caps</h2>
            <p className="mt-2 text-cyan-50/65">
              No managed SMS during free trial unless you connect your own Twilio/BYOK provider. Trial caps are hard caps.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TRIAL_PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 backdrop-blur ${plan.popular ? "border-cyan-300/50" : ""}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-1 text-xs font-black text-black">POPULAR PREVIEW</div>}
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <dl className="mt-5 space-y-3 text-sm text-cyan-50/75">
                  <div className="flex justify-between gap-4"><dt>AI actions</dt><dd className="font-bold text-white">{plan.aiActions}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Emails</dt><dd className="font-bold text-white">{plan.emails}</dd></div>
                  <div className="flex justify-between gap-4"><dt>SMS</dt><dd className="font-bold text-white">{plan.sms}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Contacts</dt><dd className="font-bold text-white">{plan.contacts}</dd></div>
                  <div className="flex justify-between gap-4"><dt>AI agents</dt><dd className="font-bold text-white">{plan.agents}</dd></div>
                </dl>
                <Link href={plan.available ? "/signup" : "/contact"} className="mt-6 block rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-3 text-center font-black text-black">
                  {plan.available ? "Start 14-Day Trial" : "Contact Sales Approval"}
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto mt-12 max-w-4xl rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-8 text-center backdrop-blur">
          <h2 className="text-3xl font-black">BYOK 14-Day Trial</h2>
          <p className="mt-4 text-cyan-50/70">
            Use SynaptiReach for 14 days while connecting your own AI, email, and SMS provider keys. You pay your own provider/API usage.
            SynaptiReach does not expose managed SMS, AI, or email cost during BYOK trial.
          </p>
          <p className="mt-4 text-sm font-bold text-green-200">No overages. Hard caps. Upgrade required after limits or after 14 days.</p>
          <Link href="/signup" className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-7 py-3 font-black text-black">
            Start 14-Day Trial
          </Link>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-5xl rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-8">
        <h2 className="text-2xl font-black">Commit before your trial ends and save up to 30%.</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          {COMMITMENT_DISCOUNTS.map((item) => (
            <div key={item.duration} className="rounded-2xl border border-cyan-400/15 bg-black/25 p-4 text-center">
              <div className="text-sm text-cyan-50/65">{item.duration}</div>
              <div className="mt-2 text-3xl font-black text-cyan-200">{item.discount}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl space-y-4 rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-8 text-sm text-cyan-50/75">
        <h2 className="text-2xl font-black text-white">Trial FAQ</h2>
        <p><strong className="text-white">How long is the free trial?</strong> The free trial lasts 14 days.</p>
        <p><strong className="text-white">Can I use managed SMS?</strong> No managed SMS is included during free trial unless you connect your own Twilio/BYOK provider.</p>
        <p><strong className="text-white">Are overages allowed?</strong> No. Trial caps are hard caps.</p>
        <p><strong className="text-white">What happens at the end?</strong> Upgrade is required to continue after limits or after 14 days.</p>
      </section>
    </main>
  );
}
