export {};
import PortalStaffSidebar from "./PortalStaffSidebar"
export default function ClientStaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-[52px]">
      <PortalStaffSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
