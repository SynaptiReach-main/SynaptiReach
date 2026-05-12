export {};
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Users, Megaphone,
  BarChart2, UserCog, Building2, Settings
} from "lucide-react"

const LINKS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "CRM",       href: "/admin/crm",       icon: Users           },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone       },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2       },
  { label: "Staff",     href: "/admin/staff",     icon: UserCog         },
  { label: "Clients",   href: "/admin/clients",   icon: Building2       },
  { label: "Settings",  href: "/admin/settings",  icon: Settings        },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <div
      className="hidden md:flex w-60 flex-col shrink-0 h-[calc(100vh-52px)] sticky top-[52px]"
      style={{
        background: "rgba(10,15,31,0.97)",
        borderRight: "1px solid rgba(0,229,255,0.13)",
      }}
    >
      <div className="px-5 py-4 border-b border-[rgba(0,229,255,0.1)]">
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md"
          style={{ background: "rgba(0,229,255,0.1)", color: "#00FFFF" }}>
          Admin Portal
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {LINKS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "rgba(0,229,255,0.12)" : "transparent",
                color: active ? "#00FFFF" : "rgba(178,235,242,0.65)",
                borderLeft: active ? "2px solid #00FFFF" : "2px solid transparent",
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-[rgba(0,229,255,0.1)]">
        <p className="text-xs text-white/30">Logged in as Admin</p>
      </div>
    </div>
  )
}
