import Link from "next/link";

const services = [
  { title: "Marketing Services", sections: [
    { name: "Execution", items: [["Email Campaign", "$149"], ["SMS Campaign", "$179"], ["Landing Page", "$399"], ["Workflow Setup", "$249"], ["CRM Setup", "$399"]] },
    { name: "Strategy", items: [["Offer Optimization", "$249"], ["Funnel Copywriting", "$399"], ["Lead Magnet Creation", "$299"], ["A/B Testing", "$249"], ["Conversion Audit", "$299"]] },
    { name: "Advanced", items: [["Customer Journey Mapping", "$499"], ["Segmentation Strategy", "$399"], ["Retargeting Setup", "$499"]] },
  ]},
  { title: "AI Services", sections: [
    { name: "AI Execution", items: [["AI Campaign Strategy", "$399"], ["AI Persona Modeling", "$349"], ["AI Funnel Optimization", "$499"]] },
  ]},
  { title: "Branding & SEO", sections: [
    { name: "Brand Growth", items: [["Logo Design", "$249"], ["Branding Kit", "$599"], ["SEO Optimization", "$499"], ["Local SEO", "$399"]] },
  ]},
  { title: "Social & GMB", sections: [
    { name: "Local Presence", items: [["Social Media Management", "$599/mo"], ["Content Calendar", "$249"], ["GMB Optimization", "$299"], ["GMB Monthly Management", "$299/mo"]] },
  ]},
];

const bundles = [
  { name: "Launch System", price: "$599", items: ["Landing Page", "Email Campaign", "Workflow Setup", "Basic CRM Setup", "Best for launching fast"] },
  { name: "Growth Engine", price: "$999", popular: true, items: ["Funnel Copywriting", "Email Sequence", "CRM Setup", "Segmentation Strategy", "Lead Magnet"] },
  { name: "Automation System", price: "$1,499", items: ["Lead Nurturing Workflow", "Advanced Automation", "A/B Testing", "Dashboard Setup", "SMS Campaign"] },
  { name: "Authority Builder", price: "$1,799", items: ["Branding Kit", "SEO Optimization", "Local SEO", "GMB Optimization", "Offer Optimization"] },
  { name: "Conversion Engine", price: "$2,499", items: ["Funnel Strategy", "Funnel Copywriting", "Lead Magnet Creation", "AI Campaign Strategy", "Customer Journey Mapping", "Segmentation Strategy"] },
  { name: "Full Business System", price: "$4,999", items: ["Full system setup", "CRM Setup", "Automation System", "Branding Kit", "SEO/GMB", "AI Funnel Optimization", "Campaign Strategy", "30-day implementation support"] },
];

const retainers = [
  ["Growth Ops", "$599/mo"],
  ["Scale Ops", "$999/mo"],
  ["Elite Ops", "$1,999/mo"],
];

const card = "rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 backdrop-blur";

export default function ServicesPage() {
  return (
    <main className="min-h-screen px-5 py-16 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-200">
          SERVICES & EXECUTION
        </div>
        <h1 className="text-4xl font-black md:text-6xl">
          Marketing & AI <span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">Services</span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-cyan-50/70">
          Exact prices for campaigns, CRM setup, automations, branding, SEO, GMB, and AI strategy.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-6xl space-y-8">
        {services.map((group) => (
          <div key={group.title} className={card}>
            <h2 className="text-3xl font-black">{group.title}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {group.sections.map((section) => (
                <div key={section.name} className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
                  <h3 className="font-bold text-cyan-200">{section.name}</h3>
                  <div className="mt-4 space-y-3">
                    {section.items.map(([name, price]) => (
                      <div key={name} className="flex justify-between gap-4 text-sm">
                        <span className="text-cyan-50/75">{name}</span>
                        <span className="font-black text-white">{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="text-3xl font-black">Service Bundles</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {bundles.map((bundle) => (
            <div key={bundle.name} className={`${card} relative ${bundle.popular ? "border-cyan-300/50 shadow-2xl shadow-cyan-500/10" : ""}`}>
              {bundle.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-1 text-xs font-black text-black">MOST POPULAR</div>}
              <h3 className="text-2xl font-black">{bundle.name}</h3>
              <div className="mt-3 bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-4xl font-black text-transparent">{bundle.price}</div>
              <ul className="mt-5 space-y-2 text-sm text-cyan-50/75">
                {bundle.items.map((item) => <li key={item}>- {item}</li>)}
              </ul>
              <Link href="/contact" className="mt-6 block rounded-2xl border border-cyan-300/30 px-5 py-3 text-center font-bold text-cyan-100">Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="text-3xl font-black">Recurring Service Retainers</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {retainers.map(([name, price]) => (
            <div key={name} className={card}>
              <h3 className="text-2xl font-black">{name}</h3>
              <div className="mt-3 text-3xl font-black text-cyan-200">{price}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
