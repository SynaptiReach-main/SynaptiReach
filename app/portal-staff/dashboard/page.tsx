export {};
export default function ClientStaffDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Team Dashboard</h1>
        <p className="text-sm text-[#B2EBF2]/60 mt-1">Your assigned work for today.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Tasks Assigned", value: "6"  },
          { label: "Leads to Action",value: "11" },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,188,212,0.13)" }}>
            <span className="text-xs text-[#B2EBF2]/60 uppercase tracking-wider">{s.label}</span>
            <span className="text-2xl font-extrabold text-white">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,188,212,0.13)" }}>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Today&apos;s Tasks</h2>
        <p className="text-sm text-[#B2EBF2]/50">No tasks assigned yet.</p>
      </div>
    </div>
  )
}
