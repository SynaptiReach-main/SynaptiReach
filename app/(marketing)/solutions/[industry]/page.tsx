import Link from "next/link";
import Footer from "@/components/sections/Footer";
import { findIndustrySolution, INDUSTRY_SOLUTIONS } from "@/lib/marketing/industries";

export function generateStaticParams() {
  return INDUSTRY_SOLUTIONS.map((industry) => ({ industry: industry.slug }));
}

export default function IndustrySolutionPage({ params }: { params: { industry: string } }) {
  const industry = findIndustrySolution(params.industry);
  return (
    <main className="min-h-screen px-5 py-16 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
          SOLUTIONS / {industry.label}
        </div>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          SynaptiReach for
          <span className="block bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
            {industry.label}
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-cyan-50/70">{industry.problem}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {industry.trialAppropriate && (
            <Link href="/trial" className="rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-6 py-3 font-black text-black">
              Start 14-Day Trial
            </Link>
          )}
          <Link href={`/contact?industry=${encodeURIComponent(industry.label)}`} className="rounded-2xl border border-cyan-300/25 bg-cyan-400/5 px-6 py-3 font-bold text-cyan-100">
            Contact SynaptiReach
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {[
          ["Problem SynaptiReach Solves", [industry.problem]],
          ["CRM, AI & Marketing Use Cases", industry.useCases],
          ["Relevant Workflows", industry.workflows],
          ["Example Metrics Tracked", industry.metrics],
          ["Review-Gated Autonomy", ["Drafts, recommendations, and workflow actions stay reviewable before external sends or irreversible actions."]],
          ["Need a Different Workflow?", ["Don't see your exact workflow? Contact us and describe the operation you want SynaptiReach to support."]],
        ].map(([title, items]) => (
          <article key={String(title)} className="rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 shadow-lg shadow-cyan-500/5 backdrop-blur">
            <div className="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-green-300" />
            <h2 className="text-xl font-black">{title}</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-cyan-50/65">
              {(items as string[]).map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
