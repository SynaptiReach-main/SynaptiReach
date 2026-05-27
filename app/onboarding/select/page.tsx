"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Building2 } from "lucide-react";

const choices = [
  ["service", "Service business", "Appointments, estimates, and recurring customer follow-up."],
  ["professional", "Professional services", "Consultations, pipeline, client work, and documents."],
  ["local", "Local business", "Reputation, offers, lead capture, and repeat visits."],
  ["hybrid", "Hybrid operation", "Sales, projects, campaigns, support, and automation."],
];

export default function SelectIndustry() {
  const router = useRouter();

  function choose(type: string) {
    localStorage.setItem("synaptireach_business_type", type);
    router.push("/onboarding");
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
            <Building2 size={14} />
            Workspace setup
          </div>
          <h1 className="text-4xl font-black md:text-5xl">
            Choose your first CRM setup path
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            This routes you into onboarding with clean setup state. No sample CRM records are created.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {choices.map(([id, label, description]) => (
            <button
              key={id}
              type="button"
              onClick={() => choose(id)}
              className="group rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-5 text-left backdrop-blur transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-black">{label}</div>
                  <p className="mt-2 text-sm text-slate-400">{description}</p>
                </div>
                <ArrowRight className="text-cyan-100 transition group-hover:translate-x-1" size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
