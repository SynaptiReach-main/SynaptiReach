import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { adminReadAccess } from "@/lib/admin/access";

export const dynamic = "force-dynamic";

async function loadWaitlist() {
  const access = adminReadAccess();
  if (!access.enabled) {
    return { rows: [], error: "", blocked: access.message };
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("waitlist_signups")
      .select("*")
      .order("waitlist_position", { ascending: true })
      .limit(200);
    if (error) throw error;
    return { rows: data || [], error: "", blocked: "" };
  } catch (error: any) {
    return { rows: [], error: friendlySupabaseError(error).message, blocked: "" };
  }
}

export default async function WaitlistAdminPage() {
  const { rows, error, blocked } = await loadWaitlist();
  const founding = rows.filter((row: any) => row.founding_cohort_eligible).length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Launch Waitlist</h1>
        <p className="mt-1 text-sm text-cyan-50/60">Founding cohort slots: {founding}/5. Filter and invite flows can be layered on top of these stored records.</p>
      </div>
      {blocked && <div className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">{blocked}</div>}
      {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
      <div className="grid gap-4">
        {rows.length === 0 && !error && !blocked && <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-cyan-50/60">No waitlist signups yet.</div>}
        {rows.map((row: any) => (
          <article key={row.id} className="rounded-2xl border border-cyan-400/15 bg-slate-950/60 p-5 text-sm text-cyan-50/70">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">#{row.waitlist_position || "-"} {row.business_name || row.full_name}</h2>
                <p>{row.full_name} · {row.work_email} · {row.industry || "Industry not set"}</p>
              </div>
              <div className="flex gap-2">
                {row.founding_cohort_eligible && <span className="rounded-full border border-green-300/30 bg-green-400/10 px-3 py-1 text-xs text-green-100">First 5 cohort</span>}
                <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs text-cyan-100">{row.status || "pending"}</span>
              </div>
            </div>
            <p className="mt-3">{row.main_goal || "No goal provided."}</p>
            <div className="mt-3 grid gap-2 text-xs text-cyan-50/45 sm:grid-cols-3">
              <span>Plan: {row.desired_plan || "not set"}</span>
              <span>Mode: {row.billing_preference || "not set"}</span>
              <span>Urgency: {row.urgency || "not set"}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
