export {};
const stats = [
  { label: "Total Leads",      value: "1,284",  change: "+12%",  up: true },
  { label: "Active Campaigns", value: "8",      change: "+2",    up: true },
  { label: "Revenue (MTD)",    value: "$9,420", change: "+18%",  up: true },
  { label: "Avg Response Time",value: "4.2m",   change: "-0.8m", up: true },
]
const activity = [
  { text: "New lead captured from Facebook Ad",   time: "2m ago",  dot: "#00FFFF" },
  { text: "Campaign 'Summer Promo' went live",     time: "14m ago", dot: "#00E676" },
  { text: "AI follow-up sent to 34 contacts",      time: "1h ago",  dot: "#00FFFF" },
  { text: "New client signup: james@example.com",  time: "2h ago",  dot: "#00E676" },
  { text: "CRM import completed — 120 records",    time: "3h ago",  dot: "#00FFFF" },
]
const actions = [
  { label: "Add Lead",      href: "/admin/crm"       },
  { label: "New Campaign",  href: "/admin/campaigns" },
  { label: "View Clients",  href: "/admin/clients"   },
  { label: "Settings",      href: "/admin/settings"  },
]
export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Admin Dashboard</h1>
        <p className="text-sm text-[#B2EBF2]/60 mt-1">Full platform overview — all accounts.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,229,255,0.13)" }}>
            <span className="text-xs text-[#B2EBF2]/60 font-medium uppercase tracking-wider">{s.label}</span>
            <span className="text-2xl font-extrabold text-white">{s.value}</span>
            <span className="text-xs font-semibold" style={{ color: s.up ? "#00E676" : "#FF5252" }}>
              {s.change} this month
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,229,255,0.13)" }}>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                  style={{ background: a.dot, boxShadow: `0 0 6px ${a.dot}` }} />
                <div className="flex-1 flex justify-between gap-2">
                  <span className="text-sm text-[#B2EBF2]/80">{a.text}</span>
                  <span className="text-xs text-white/30 whitespace-nowrap">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,229,255,0.13)" }}>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {actions.map((a, i) => (
              <a key={a.label} href={a.href}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-[#0A0F1F] text-center transition-all hover:opacity-90"
                style={{ background: "linear-gradient(to right, #00FFFF, #00E676)" }}>
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
