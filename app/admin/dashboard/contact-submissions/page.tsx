import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { adminReadAccess } from "@/lib/admin/access";

export const dynamic = "force-dynamic";

async function loadSubmissions() {
  const access = adminReadAccess();
  if (!access.enabled) {
    return { rows: [], error: "", blocked: access.message };
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return { rows: data || [], error: "", blocked: "" };
  } catch (error: any) {
    return { rows: [], error: friendlySupabaseError(error).message, blocked: "" };
  }
}

export default async function ContactSubmissionsPage() {
  const { rows, error, blocked } = await loadSubmissions();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Contact Submissions</h1>
        <p className="mt-1 text-sm text-cyan-50/60">Recent public contact, service, support, and consultation inquiries.</p>
      </div>
      {blocked && <div className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">{blocked}</div>}
      {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
      <div className="grid gap-4">
        {rows.length === 0 && !error && !blocked && <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-cyan-50/60">No contact submissions yet.</div>}
        {rows.map((row: any) => (
          <article key={row.id} className="rounded-2xl border border-cyan-400/15 bg-slate-950/60 p-5 text-sm text-cyan-50/70">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">{row.name || "Unknown contact"}</h2>
                <p>{row.company || "No company"} · {row.email || "No email"}</p>
              </div>
              <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs text-cyan-100">{row.status || "new"}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap">{row.message}</p>
            <div className="mt-3 text-xs text-cyan-50/45">{new Date(row.created_at).toLocaleString()} · {row.source || "contact"}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
