"use client";

const industries = [
  "HVAC",
  "Roofing",
  "Plumbing",
  "Electrical",
  "Healthcare",
  "Dental",
  "Legal",
  "Insurance",
  "Real Estate",
  "Construction",
  "Agency",
  "Marketing",
  "Ecommerce",
  "Retail",
  "Restaurant",
  "Automotive",
  "Fitness",
  "Coaching",
  "Consulting",
  "Beauty",
  "Salon",
  "Med Spa",
  "Chiropractic",
  "Accounting",
  "Finance",
  "Landscaping",
  "Cleaning",
  "Security",
  "Education",
];

export default function IndustrySearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your industry..."
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
      />

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {industries
          .filter((i) =>
            i.toLowerCase().includes(value.toLowerCase())
          )
          .map((industry) => (
            <button
              key={industry}
              onClick={() => onChange(industry)}
              className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10"
            >
              {industry}
            </button>
          ))}
      </div>
    </div>
  );
}
