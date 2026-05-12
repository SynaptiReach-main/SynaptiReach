export {};
const tasks = [
  { text: "Follow up with Johnson & Co",    due: "Today",    status: "urgent" },
  { text: "Send campaign report to client", due: "Tomorrow", status: "pending" },
  { text: "Update CRM — 12 new contacts",   due: "Today",    status: "urgent" },
  { text: "Review AI response drafts",      due: "Fri",      status: "pending" },
]
export default function StaffDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Dashboard</h1>
        <p className="text-sm text-[#B2EBF2]/60 mt-1">Your tasks and activity for today.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Open Tasks",    value: "4"   },
          { label: "Leads Assigned",value: "23"  },
          { label: "Msgs Pending",  value: "7"   },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,100,255,0.13)" }}>
            <span className="text-xs text-[#B2EBF2]/60 uppercase tracking-wider">{s.label}</span>
            <span className="text-2xl font-extrabold text-white">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,100,255,0.13)" }}>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">My Tasks</h2>
        <div className="flex flex-col gap-3">
          {tasks.map((t, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
              <span className="text-sm text-[#B2EBF2]/80">{t.text}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-white/40">{t.due}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: t.status === "urgent" ? "rgba(255,82,82,0.15)" : "rgba(0,229,255,0.1)",
                    color: t.status === "urgent" ? "#FF5252" : "#00FFFF"
                  }}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
