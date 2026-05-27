"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, BriefcaseBusiness, ChevronLeft, ChevronRight, DollarSign, Edit2, Loader2, Plus, Save, Search, X } from "lucide-react";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";
import OwnerFocusPanel from "@/components/dashboard/OwnerFocusPanel";

const stages = ["new", "qualified", "proposal", "negotiation", "won", "lost"];
const emptyDeal = { id: "", lead_id: "", title: "", company: "", value: 0, stage: "new", probability: 0, expected_close_date: "", notes: "" };

function money(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function formatDate(value?: string) {
  if (!value) return "No date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyDeal);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<any | null>(null);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/crm/deals");
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to load pipeline.");
      setDeals(json.deals || json.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load pipeline.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return deals.filter((deal) => {
      const matchesSearch = [deal.title, deal.company, deal.stage].filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
      const matchesStatus = statusFilter === "all" || deal.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [deals, search, statusFilter]);

  const totals = useMemo(() => ({
    value: filtered.reduce((sum, deal) => sum + Number(deal.value || 0), 0),
    weighted: filtered.reduce((sum, deal) => sum + Number(deal.value || 0) * (Number(deal.probability || 0) / 100), 0),
    open: filtered.filter((deal) => deal.status === "open").length,
    won: filtered.filter((deal) => deal.stage === "won" || deal.status === "won").length,
    lost: filtered.filter((deal) => deal.stage === "lost" || deal.status === "lost").length,
    stale: filtered.filter((deal) => isStaleDeal(deal)).length,
  }), [filtered]);
  const stageSummary = useMemo(() => {
    const rows = stages.map((stage) => {
      const stageDeals = filtered.filter((deal) => deal.stage === stage);
      const value = stageDeals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
      const weighted = stageDeals.reduce(
        (sum, deal) => sum + Number(deal.value || 0) * (Number(deal.probability || 0) / 100),
        0
      );
      return {
        stage,
        count: stageDeals.length,
        value,
        weighted,
        stale: stageDeals.filter((deal) => isStaleDeal(deal)).length,
      };
    });
    const maxValue = Math.max(...rows.map((row) => row.value), 1);
    return rows.map((row) => ({ ...row, width: Math.max(6, Math.round((row.value / maxValue) * 100)) }));
  }, [filtered]);
  const pipelineMetricCards = [
    {
      label: "Pipeline Value",
      value: money(totals.value),
      icon: DollarSign,
      records: filtered,
      explanation: "Total estimated revenue from the deals currently matching your filters.",
    },
    {
      label: "Weighted Value",
      value: money(totals.weighted),
      icon: DollarSign,
      records: filtered,
      explanation: "Revenue forecast adjusted by each deal probability.",
    },
    {
      label: "Open Deals",
      value: totals.open,
      icon: BriefcaseBusiness,
      records: filtered.filter((deal) => deal.status === "open"),
      explanation: "Deals still in active sales stages and not won, lost, or archived.",
    },
    {
      label: "Won Deals",
      value: totals.won,
      icon: Save,
      records: filtered.filter((deal) => deal.stage === "won" || deal.status === "won"),
      explanation: "Closed revenue opportunities marked won.",
    },
    {
      label: "Lost Deals",
      value: totals.lost,
      icon: X,
      records: filtered.filter((deal) => deal.stage === "lost" || deal.status === "lost"),
      explanation: "Opportunities that were closed without converting.",
    },
    {
      label: "Stale Deals",
      value: totals.stale,
      icon: Archive,
      records: filtered.filter((deal) => isStaleDeal(deal)),
      explanation: "Open deals with no update for 14 or more days.",
    },
  ];

  function statusForStage(stage: string) {
    if (stage === "won") return "won";
    if (stage === "lost") return "lost";
    return "open";
  }

  function isStaleDeal(deal: any) {
    if (["won", "lost", "archived"].includes(deal.status)) return false;
    const updatedAt = deal.updated_at || deal.created_at;
    if (!updatedAt) return false;
    return (Date.now() - new Date(updatedAt).getTime()) / 86400000 >= 14;
  }

  function startCreate() {
    setForm(emptyDeal);
    setOpen(true);
  }

  function startEdit(deal: any) {
    setForm({ ...emptyDeal, ...deal, expected_close_date: deal.expected_close_date ? deal.expected_close_date.slice(0, 10) : "" });
    setOpen(true);
  }

  async function saveDeal() {
    try {
      setSaving(true);
      setError("");
      const method = form.id ? "PATCH" : "POST";
      const response = await fetch("/api/crm/deals", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to save deal.");
      setOpen(false);
      setForm(emptyDeal);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save deal.");
    } finally {
      setSaving(false);
    }
  }

  async function archiveDeal(id: string) {
    try {
      setActionLoading(`${id}:archive`);
      setError("");
      const response = await fetch(`/api/crm/deals?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to archive deal.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to archive deal.");
    } finally {
      setActionLoading("");
    }
  }

  async function moveDeal(deal: any, direction: -1 | 1) {
    const index = stages.indexOf(deal.stage || "new");
    const nextStage = stages[Math.max(0, Math.min(stages.length - 1, index + direction))];
    if (nextStage === deal.stage) return;

    try {
      setActionLoading(`${deal.id}:move`);
      setError("");
      const response = await fetch("/api/crm/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...deal, stage: nextStage, status: statusForStage(nextStage) }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to move deal.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to move deal.");
    } finally {
      setActionLoading("");
    }
  }

  async function createDealTask(deal: any) {
    try {
      setActionLoading(`${deal.id}:task`);
      setError("");
      const response = await fetch("/api/crm/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: deal.id,
          lead_id: deal.lead_id || null,
          title: `Follow up on ${deal.title}`,
          details: isStaleDeal(deal)
            ? "Deal has not been updated in 14+ days. Review next step."
            : "Pipeline follow-up from deal card.",
          priority: isStaleDeal(deal) ? "high" : "medium",
          status: "open",
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          metadata: { source: "pipeline_page" },
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.error || "Failed to create task.");
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create task.");
    } finally {
      setActionLoading("");
    }
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center text-white"><Loader2 className="animate-spin text-cyan-300" size={34} /></main>;

  return (
    <main className="min-h-screen text-white">
      <QueryRecordFocus keys={["dealId"]} />
      {selectedMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-start justify-between gap-4 border-b border-cyan-400/10 p-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Pipeline Metric</div>
                <h2 className="mt-1 text-2xl font-black">{selectedMetric.label}</h2>
                <p className="mt-1 text-sm text-cyan-50/55">{selectedMetric.explanation}</p>
              </div>
              <button onClick={() => setSelectedMetric(null)} className="rounded-2xl border border-white/10 p-2 text-cyan-100 hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[62vh] overflow-y-auto p-5">
              {selectedMetric.records.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-cyan-50/55">
                  No real deals currently match this metric.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedMetric.records.slice(0, 40).map((deal: any) => (
                    <a key={deal.id} href={`/dashboard/pipeline?dealId=${encodeURIComponent(deal.id)}`} className="block rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-cyan-400/30 hover:bg-cyan-500/10">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-white">{deal.title || "Untitled deal"}</div>
                          <div className="mt-1 text-sm text-gray-500">{deal.company || "No company"} - {deal.stage || "new"}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-cyan-200">{money(Number(deal.value || 0))}</div>
                          <div className="text-xs text-gray-500">{Number(deal.probability || 0)}% probability</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">Expected close: {formatDate(deal.expected_close_date)}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <section className="mb-8 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">Real pipeline</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Pipeline & Deals</h1>
          <p className="mt-2 max-w-3xl text-gray-400">Track real opportunities, value, stages, and stale deal follow-ups.</p>
        </div>
        <button onClick={startCreate} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black flex items-center gap-2"><Plus size={18} /> Create Deal</button>
      </section>

      {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <OwnerFocusPanel
        items={[
          {
            label: "Open value",
            value: money(totals.value),
            detail: "Use this as the owner-level view of active opportunity value before opening individual deals.",
            action: "Review pipeline flow",
            tone: "cyan",
          },
          {
            label: "Stale deals",
            value: totals.stale,
            detail: "Stale deals are opportunities that may need a follow-up task, updated close date, or stage change.",
            action: "Check stale cards",
            tone: totals.stale > 0 ? "yellow" : "green",
          },
          {
            label: "Forecast",
            value: money(totals.weighted),
            detail: "Weighted value uses saved probabilities, so changing a deal updates the forecast without fake revenue.",
            action: "Keep probabilities realistic",
            tone: "neutral",
          },
        ]}
      />

      <MiniBrainInsightPanel
        title="Pipeline Intelligence"
        subtitle="Deal health, stale-stage risk, weighted forecast, and revenue-at-risk signals."
        types={["pipeline_intelligence", "deal_intelligence", "forecast"]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {pipelineMetricCards.map(({ label, value, icon: Icon, records, explanation }: any) => (
          <button key={label} onClick={() => setSelectedMetric({ label, value, records, explanation })} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-cyan-500/10">
            <Icon className="mb-4 text-cyan-300" size={20} />
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </button>
        ))}
      </section>

      <section className="mb-6 overflow-hidden rounded-3xl border border-cyan-400/15 bg-cyan-500/[0.04] p-5 shadow-2xl shadow-cyan-500/5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black">Pipeline Flow</h2>
            <p className="mt-1 text-sm text-gray-500">
              Stage value, probability-weighted value, stale deal pressure, and win/loss movement from real deals.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="font-black text-cyan-200">{money(totals.weighted)}</div>
              <div className="text-gray-500">Weighted</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="font-black text-green-200">{totals.won}</div>
              <div className="text-gray-500">Won</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="font-black text-red-200">{totals.lost}</div>
              <div className="text-gray-500">Lost</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-6">
          {stageSummary.map((stage, index) => (
            <div key={stage.stage} className="relative rounded-3xl border border-white/10 bg-black/35 p-4">
              {index < stageSummary.length - 1 && (
                <div className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 bg-gradient-to-r from-cyan-400 to-green-400 lg:block" />
              )}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-black capitalize text-white">{stage.stage}</div>
                <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100">
                  {stage.count}
                </div>
              </div>
              <div className="text-2xl font-black text-cyan-100">{money(stage.value)}</div>
              <div className="mt-1 text-xs text-gray-500">Weighted {money(stage.weighted)}</div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
                  style={{ width: `${stage.width}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-500">Stale</span>
                <span className={stage.stale ? "font-black text-yellow-200" : "text-gray-500"}>{stage.stale}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5 text-center text-sm text-gray-500">
            No real deals match the current filters, so the pipeline graphic is empty.
          </div>
        )}
      </section>

      <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Search className="text-gray-500" size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search deals..." className="w-full bg-transparent outline-none text-white placeholder:text-gray-600" />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-black/40 p-3 text-white outline-none">
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = filtered.filter((deal) => deal.stage === stage);
          return (
            <div key={stage} className="rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-4 min-h-[220px]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-black capitalize">{stage}</h2>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100">{stageDeals.length}</span>
              </div>
              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <div key={deal.id} data-record-id={deal.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold">{deal.title}</div>
                        <div className="text-sm text-gray-500">{deal.company || "No company"}</div>
                      </div>
                      {isStaleDeal(deal) && (
                        <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-2 py-1 text-[10px] font-bold text-yellow-100">
                          stale
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-black text-cyan-300">{money(Number(deal.value || 0))}</span>
                      <span className="text-gray-500">{formatDate(deal.expected_close_date)}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-green-400" style={{ width: `${Math.max(0, Math.min(100, Number(deal.probability || 0)))}%` }} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button disabled={actionLoading === `${deal.id}:move`} onClick={() => moveDeal(deal, -1)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-cyan-100 disabled:opacity-50"><ChevronLeft size={13} /></button>
                      <button disabled={actionLoading === `${deal.id}:move`} onClick={() => moveDeal(deal, 1)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-cyan-100 disabled:opacity-50"><ChevronRight size={13} /></button>
                      <button onClick={() => createDealTask(deal)} disabled={actionLoading === `${deal.id}:task`} className="rounded-xl border border-cyan-400/20 px-3 py-2 text-xs text-cyan-100 disabled:opacity-50"><Plus size={13} /></button>
                      <button onClick={() => startEdit(deal)} disabled={Boolean(actionLoading)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-cyan-100 disabled:opacity-50"><Edit2 size={13} /></button>
                      <button onClick={() => archiveDeal(deal.id)} disabled={actionLoading === `${deal.id}:archive`} className="rounded-xl border border-red-400/20 px-3 py-2 text-xs text-red-200 disabled:opacity-50"><Archive size={13} /></button>
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-center text-sm text-gray-500">No deals</div>}
              </div>
            </div>
          );
        })}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-[#080808] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">{form.id ? "Edit Deal" : "Create Deal"}</h2>
              <button onClick={() => setOpen(false)} className="rounded-xl border border-white/10 p-2"><X size={18} /></button>
            </div>
            <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-50/85">
              A deal is a revenue opportunity tied to a lead or company. Link the lead when available, set the estimated value, choose the current stage, and use probability to keep the weighted forecast realistic. Expected close dates help SynaptiReach flag stale opportunities and forecast revenue.
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Deal title" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <input value={form.lead_id || ""} onChange={(e) => setForm({ ...form, lead_id: e.target.value })} placeholder="Linked lead ID (optional)" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} placeholder="Value" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none">{stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select>
              <input type="date" value={form.expected_close_date} onChange={(e) => setForm({ ...form, expected_close_date: e.target.value })} className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <input type="number" min="0" max="100" value={form.probability} onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })} placeholder="Probability" className="rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="md:col-span-2 min-h-28 rounded-2xl border border-white/10 bg-black/40 p-3 outline-none" />
            </div>
            <button disabled={saving || !form.title.trim()} onClick={saveDeal} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save Deal"}</button>
          </div>
        </div>
      )}
    </main>
  );
}
