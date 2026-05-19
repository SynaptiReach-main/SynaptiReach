import Link from "next/link";
import Footer from "@/components/sections/Footer";
import { SERVICE_CATALOG } from "@/lib/billing/services";

const card = "rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 backdrop-blur";

const groups = SERVICE_CATALOG.reduce((map: Record<string, typeof SERVICE_CATALOG>, item) => {
  map[item.category] = [...(map[item.category] || []), item];
  return map;
}, {});

export default function ServicesPage() {
  return (
    <main className="min-h-screen px-5 py-16 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
          SERVICES & EXECUTION
        </div>
        <h1 className="text-4xl font-black md:text-6xl">
          Marketing & AI <span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">Services</span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-cyan-50/70">
          Fixed-price campaign, CRM, automation, branding, SEO, GMB, and AI strategy services. A 30-minute video consultation is required before purchasing services or bundles so SynaptiReach can review your company needs, goals, systems, audience, budget, and implementation requirements.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-5xl rounded-3xl border border-green-400/20 bg-green-500/10 p-6 text-sm text-green-50">
        Submit the contact form and mention the service or bundle you are interested in. SynaptiReach will confirm fit, scope, timeline, and whether checkout or a custom quote is appropriate.
      </section>

      <section className="mx-auto mt-14 max-w-6xl space-y-8">
        {Object.entries(groups).map(([category, items]) => (
          <div key={category} className={card}>
            <h2 className="text-2xl font-black">{category}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {items.map((item) => (
                <div key={item.itemName} className={`relative rounded-2xl border p-5 ${item.popular ? "border-cyan-300/50 bg-cyan-400/10 shadow-2xl shadow-cyan-500/10" : "border-cyan-400/10 bg-cyan-400/5"}`}>
                  {item.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-1 text-xs font-black text-black">MOST POPULAR</div>}
                  <h3 className="font-black text-white">{item.itemName}</h3>
                  <div className="mt-3 bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-3xl font-black text-transparent">{item.priceLabel}</div>
                  {item.includes && (
                    <ul className="mt-4 space-y-2 text-sm text-cyan-50/70">
                      {item.includes.map((included) => <li key={included}>- {included}</li>)}
                    </ul>
                  )}
                  <Link
                    href={`/contact?service=${encodeURIComponent(item.itemName)}`}
                    className="mt-6 block rounded-2xl border border-cyan-300/30 px-5 py-3 text-center font-bold text-cyan-100"
                  >
                    Contact SynaptiReach
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
