"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock3, CreditCard, Loader2, Settings2, ShieldCheck, Workflow } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

function statusClass(status: string) {
  if (status === "complete") return "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
  if (status === "pending") return "border-yellow-300/30 bg-yellow-300/10 text-yellow-100";
  if (status === "skipped") return "border-white/15 bg-white/5 text-slate-300";
  return "border-red-300/25 bg-red-500/10 text-red-100";
}

export default function OnboardingStatusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.replace(`/signin?returnTo=${encodeURIComponent("/onboarding/status")}`);
        return;
      }

      const response = await fetch("/api/onboarding/save", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setError(result.error || "Could not load onboarding status.");
        setLoading(false);
        return;
      }

      if (result.session?.completed) {
        router.replace("/dashboard");
        return;
      }
      const submitted = Boolean(result.session?.metadata?.submitted_for_review);
      if (!submitted) {
        const step = result.session?.metadata?.current_step || result.payload?.__onboardingProgress?.current_step || "welcome";
        router.replace(`/onboarding?step=${encodeURIComponent(step)}`);
        return;
      }
      setState(result);
      setLoading(false);
    }

    load();
  }, [router]);

  const grouped = useMemo(() => {
    const checks = state?.readiness?.checks || [];
    const byId = Object.fromEntries(checks.map((check: any) => [check.id, check]));
    return [
      { title: "Submission", icon: ShieldCheck, checks: ["business_profile", "legal_company", "plan", "trial_acknowledgements"].map((id) => byId[id]).filter(Boolean) },
      { title: "Billing", icon: CreditCard, checks: ["billing", "email_verification"].map((id) => byId[id]).filter(Boolean) },
      { title: "Providers", icon: Settings2, checks: ["ai", "email", "sms", "calendar"].map((id) => byId[id]).filter(Boolean) },
      { title: "CRM Setup", icon: Workflow, checks: ["service_menu", "staff", "lead_setup", "marketing", "workflow_drafts", "automation_safety", "help"].map((id) => byId[id]).filter(Boolean) },
    ];
  }, [state]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-white/[0.04] px-5 py-4">
          <Loader2 className="animate-spin text-cyan-200" size={18} />
          Loading onboarding status
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(74,222,128,0.10),transparent_30%)]" />
      <div className="relative mx-auto max-w-6xl space-y-5">
        <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/80 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-2xl font-black tracking-tight">
                Synapti<span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">Reach</span>
              </div>
              <h1 className="mt-4 text-3xl font-black">Onboarding submitted for review</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
                Your CRM setup has been saved. SynaptiReach will review pending items such as Stripe webhook confirmation, providers, legal details, service menu analysis, staff, leads, and workflow drafts before activation.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-center">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/70">Readiness</div>
              <div className="mt-1 text-4xl font-black">{state?.readiness?.score || 0}%</div>
            </div>
          </div>
          {error ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
              <AlertTriangle className="mt-0.5 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["Submitted", "complete"],
              ["Pending review", "pending"],
              [`Missing ${((state?.readiness?.checks || []).filter((check: any) => check.status === "missing").length)}`, "missing"],
              [`Needs edits ${((state?.readiness?.checks || []).filter((check: any) => check.status === "pending").length)}`, "pending"],
              ["Approved after completion", "skipped"],
            ].map(([label, status]) => (
              <span key={label} className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusClass(status)}`}>{label}</span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/onboarding?step=launch" className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-50">
              Edit onboarding
            </Link>
            <button type="button" onClick={signOut} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300">
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {grouped.map((group) => {
            const Icon = group.icon;
            return (
              <section key={group.title} className="rounded-2xl border border-white/10 bg-slate-950/75 p-5">
                <div className="mb-4 flex items-center gap-2 font-black">
                  <Icon className="text-cyan-200" size={18} />
                  {group.title}
                </div>
                <div className="space-y-2">
                  {group.checks.map((check: any) => (
                    <div key={check.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold">{check.label}</div>
                          {check.detail ? <div className="mt-1 text-xs text-slate-400">{check.detail}</div> : null}
                        </div>
                        <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-black uppercase ${statusClass(check.status)}`}>{check.status}</span>
                      </div>
                    </div>
                  ))}
                  {!group.checks.length ? <div className="text-sm text-slate-500">No status items yet.</div> : null}
                </div>
              </section>
            );
          })}
        </div>

        <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50/80">
          <div className="mb-1 flex items-center gap-2 font-black text-yellow-50">
            <Clock3 size={16} />
            Pending activation
          </div>
          Pending Stripe checkout can be reviewed, but active trial access still requires Stripe webhook confirmation and any required clarification.
        </div>
      </div>
    </main>
  );
}
