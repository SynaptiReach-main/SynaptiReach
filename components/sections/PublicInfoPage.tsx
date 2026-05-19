import Link from "next/link";
import Footer from "./Footer";

type PublicInfoPageProps = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  cards: Array<{
    title: string;
    body: string;
  }>;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function PublicInfoPage({
  eyebrow,
  title,
  accent,
  description,
  cards,
  ctaLabel = "Start 14-Day Trial",
  ctaHref = "/trial",
}: PublicInfoPageProps) {
  return (
    <main className="min-h-screen px-5 py-16 text-white">
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/15 bg-slate-950/55 p-8 text-center shadow-2xl shadow-cyan-500/10 backdrop-blur md:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(0,229,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(0,230,118,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="pointer-events-none absolute left-10 top-10 h-32 w-32 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-4 right-12 h-40 w-40 animate-pulse rounded-full bg-green-400/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            {eyebrow}
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            {title}
            <span className="block bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
              {accent}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-cyan-50/70">{description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-6 py-3 font-black text-black"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-cyan-300/25 bg-cyan-400/5 px-6 py-3 font-bold text-cyan-100"
            >
              Contact SynaptiReach
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 shadow-lg shadow-cyan-500/5 backdrop-blur"
          >
            <div className="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-green-300" />
            <h2 className="text-xl font-black">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-cyan-50/65">{card.body}</p>
          </article>
        ))}
      </section>

      <Footer />
    </main>
  );
}
