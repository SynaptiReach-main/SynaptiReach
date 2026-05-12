export {};
import PortalSidebar from "./PortalSidebar"
export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-[52px]">
      <PortalSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
