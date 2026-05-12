"use client";

export default function Hero() {
  return (
    <section className="py-24 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Turn Conversations Into Customers — Automatically
      </h1>

      <p className="text-white/60 max-w-2xl mx-auto mb-8">
        SynaptiReach captures, qualifies, and books leads using AI —
        so you never miss another opportunity.
      </p>

      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-green-400 text-black font-semibold">
          See It In Action
        </button>

        <button className="px-6 py-3 rounded-lg border border-white/20 text-white">
          Learn More
        </button>
      </div>
    </section>
  );
}
