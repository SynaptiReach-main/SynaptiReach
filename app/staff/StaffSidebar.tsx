export {};
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ListTodo, Users, CalendarDays, MessageSquare } from "lucide-react"

const LINKS = [
  { label: "My Tasks",  href: "/staff/dashboard", icon: LayoutDashboard },
  { label: "Leads",     href: "/staff/leads",     icon: Users           },
  { label: "Campaigns", href: "/staff/campaigns", icon: ListTodo        },
  { label: "Schedule",  href: "/staff/schedule",  icon: CalendarDays    },
  { label: "Messages",  href: "/staff/messages",  icon: MessageSquare   },
]

export default function StaffSidebar() {
  const pathname = usePathname()
  return (
    <div className="hidden md:flex w-60 flex-col shrink-0 h-[calc(100vh-52px)] sticky top-[52px]"
      style={{ background: "rgba(10,15,31,0.97)", borderRight: "1px solid rgba(0,100,255,0.15)" }}>
      <div className="px-5 py-4 border-b border-[rgba(0,100,255,0.12)]">
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md"
          style={{ background: "rgba(0,100,255,0.12)", color: "#4FC3F7" }}>
          Staff Portal
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {LINKS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "rgba(0,100,255,0.12)" : "transparent",
                color: active ? "#4FC3F7" : "rgba(178,235,242,0.65)",
                borderLeft: active ? "2px solid #4FC3F7" : "2px solid transparent",
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-[rgba(0,100,255,0.1)]">
        <p className="text-xs text-white/30">Staff Member</p>
      </div>
    </div>
  )
}
