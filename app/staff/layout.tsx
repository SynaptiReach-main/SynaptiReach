export {};
import StaffSidebar from "./StaffSidebar"
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-[52px]">
      <StaffSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
