export {};
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <aside style={{
        width: "250px",
        background: "#111",
        color: "#fff",
        padding: "20px"
      }}>
        <h2>SynaptiReach Admin</h2>

        <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/admin/dashboard">Overview</Link>
          <Link href="/admin/dashboard/clients">Clients</Link>
          <Link href="/admin/dashboard/campaigns">Campaigns</Link>
          <Link href="/admin/dashboard/analytics">Analytics</Link>
          <Link href="/admin/dashboard/contact-submissions">Contact Submissions</Link>
          <Link href="/admin/dashboard/waitlist">Waitlist</Link>
          <Link href="/admin/dashboard/settings">Settings</Link>
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "20px" }}>
        <div style={{
          marginBottom: "20px",
          paddingBottom: "10px",
          borderBottom: "1px solid #ccc"
        }}>
          <h1>Admin Dashboard</h1>
        </div>

        {children}
      </main>
    </div>
  );
}
