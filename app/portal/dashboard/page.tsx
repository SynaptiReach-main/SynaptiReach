export {};
export default function ClientDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Overview</h1>
        <p className="text-sm text-[#B2EBF2]/60 mt-1">Your SynaptiReach account at a glance.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Leads This Month", value: "84"     },
          { label: "Active Campaigns", value: "3"      },
          { label: "Next Invoice",     value: "$299"   },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,230,118,0.13)" }}>
            <span className="text-xs text-[#B2EBF2]/60 uppercase tracking-wider">{s.label}</span>
            <span className="text-2xl font-extrabold text-white">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,230,118,0.13)" }}>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Campaign Status</h2>
        {[
          { name: "Summer Email Blast",  status: "Live",     color: "#00E676" },
          { name: "Facebook Retarget",   status: "Paused",   color: "#FFD740" },
          { name: "Google Ads Q3",       status: "Scheduled",color: "#00FFFF" },
        ].map((c, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-sm text-[#B2EBF2]/80">{c.name}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${c.color}18`, color: c.color }}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
