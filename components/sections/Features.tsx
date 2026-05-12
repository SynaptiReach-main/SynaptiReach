"use client";

export default function Features() {
  const features = [
    {
      title: "AI Lead Capture",
      desc: "Automatically collect and qualify leads from multiple channels."
    },
    {
      title: "Smart Follow-Ups",
      desc: "Never miss a lead with automated AI-driven responses."
    },
    {
      title: "Pipeline Management",
      desc: "Track deals from first contact to close."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
