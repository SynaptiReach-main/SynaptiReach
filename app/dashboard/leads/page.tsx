"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Search, Plus, Phone, Mail, X, Activity, MessageSquare, GitBranch, CheckSquare, Zap, TrendingUp, Users, Target, Star, ArrowUpRight, Upload, FileText } from "lucide-react";

type Lead = {
  id: string; name: string; email: string; phone: string;
  status: string; score: number; source: string; notes: string;
  created_at: string; imported?: boolean;
};
type Communication = {
  id: string; lead_id: string; channel: string; direction: string; content: string; created_at: string;
};
type Pipeline = {
  id: string; lead_id: string; stage: string; value: number; probability: number; created_at: string;
};
type Task = {
  id: string; workspace_id: string; title: string; status: string; due_date: string; assigned_to: string; created_at: string;
};

const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  new:        { color: "#22d3ee", bg: "rgba(34,211,238,0.12)",  label: "New" },
  contacted:  { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", label: "Contacted" },
  qualified:  { color: "#fb923c", bg: "rgba(251,146,60,0.12)",  label: "Qualified" },
  converted:  { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  label: "Converted" },
  imported:   { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  label: "Imported" },
  lost:       { color: "#f87171", bg: "rgba(248,113,113,0.12)", label: "Lost" },
  "follow up":{ color: "#fbbf24", bg: "rgba(251,191,36,0.12)", label: "Follow Up" },
};

const CHANNEL_META: Record<string, { color: string; icon: string }> = {
  sms:      { color: "#22d3ee", icon: "💬" },
  email:    { color: "#a78bfa", icon: "✉️" },
  call:     { color: "#34d399", icon: "📞" },
  whatsapp: { color: "#4ade80", icon: "📱" },
};

const STAGES = ["new","contacted","qualified","proposal","negotiation","closed won","closed lost"];

function ago(date: string) {
  const d = Date.now() - new Date(date).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/['"]/g, ""));
  return lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/['"]/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ""; });
    return row;
  }).filter(r => r.name || r["full name"] || r.email);
}

function normalizeRow(row: Record<string, string>) {
  return {
    name: row.name || row["full name"] || row["first name"] ? `${row["first name"] || ""} ${row["last name"] || ""}`.trim() : "",
    email: row.email || row["email address"] || "",
    phone: row.phone || row["phone number"] || row.mobile || row.cell || "",
    source: row.source || row["lead source"] || "CSV Import",
  };
}

function ScoreRing({ score }: { score: number }) {
  const r = 16, c = 2 * Math.PI * r;
  const color = score >= 70 ? "#4ade80" : score >= 40 ? "#fb923c" : "#f87171";
  return (
    <svg width="40" height="40" className="shrink-0">
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
      <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={c} strokeDashoffset={c * (1 - (score || 0) / 100)}
        strokeLinecap="round" transform="rotate(-90 20 20)" style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x="20" y="24" textAnchor="middle" fontSize="9" fontWeight="900" fill={color} fontFamily="monospace">{score || 0}</text>
    </svg>
  );
}

function StatusPill({ status }: { status: string }) {
  const m = STATUS_META[status] || { color: "#888", bg: "rgba(136,136,136,0.1)", label: status };
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
      style={{ color: m.color, background: m.bg }}>{m.label}</span>
  );
}

function LeadDrawer({ lead, comms, pipeline, tasks, onClose, onStatusChange }: {
  lead: Lead; comms: Communication[]; pipeline: Pipeline[]; tasks: Task[];
  onClose: () => void; onStatusChange: (id: string, status: string) => void;
}) {
  const [tab, setTab] = useState<"overview"|"messages"|"pipeline"|"tasks">("overview");
  const leadComms = comms.filter(c => c.lead_id === lead.id);
  const leadPipes = pipeline.filter(p => p.lead_id === lead.id);
  const totalValue = leadPipes.reduce((s, p) => s + (p.value || 0), 0);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = drawerRef.current;
    if (el) { el.style.transform = "translateX(100%)"; requestAnimationFrame(() => { el.style.transform = "translateX(0)"; }); }
  }, []);

  const TABS = [
    { id: "overview", icon: <Activity size={13} />, label: "Overview" },
    { id: "messages", icon: <MessageSquare size={13} />, label: "Messages", count: leadComms.length },
    { id: "pipeline", icon: <GitBranch size={13} />, label: "Pipeline", count: leadPipes.length },
    { id: "tasks",    icon: <CheckSquare size={13} />, label: "Tasks" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ fontFamily: "'Syne', sans-serif" }}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} style={{ backdropFilter: "blur(4px)" }} />
      <div ref={drawerRef} className="relative w-full max-w-lg bg-[#080b14] border-l h-full overflow-hidden flex flex-col"
        style={{ borderColor: "rgba(255,255,255,0.07)", transition: "transform 0.35s cubic-bezier(0.32,0,0.15,1)" }}>

        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${STATUS_META[lead.status]?.color || "#22d3ee"}, transparent)` }} />

        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <ScoreRing score={lead.score} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white leading-tight">{lead.name || "Unknown"}</h2>
                  {lead.imported && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1"
                      style={{ color: "#fbbf24", background: "rgba(251,191,36,0.12)" }}>
                      <FileText size={9} /> CSV
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <StatusPill status={lead.status} />
                  {lead.source && <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">{lead.source}</span>}
                  <span className="text-[10px] text-gray-700 font-mono">{ago(lead.created_at)}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors bg-white/4 px-3 py-1.5 rounded-lg">
                <Mail size={11} />{lead.email}
              </a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-emerald-400 transition-colors bg-white/4 px-3 py-1.5 rounded-lg">
                <Phone size={11} />{lead.phone}
              </a>
            )}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(STATUS_META).filter(([s]) => !["follow up","imported"].includes(s)).map(([s, m]) => (
              <button key={s} onClick={() => onStatusChange(lead.id, s)}
                className="text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider transition-all"
                style={{
                  color: lead.status === s ? "#000" : m.color,
                  background: lead.status === s ? m.color : m.bg,
                  border: `1px solid ${m.color}30`,
                }}>{m.label}</button>
            ))}
          </div>

          <div className="flex gap-0 mt-5 border-b -mb-6 pb-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px"
                style={{ borderColor: tab === t.id ? "#22d3ee" : "transparent", color: tab === t.id ? "#22d3ee" : "#4b5563" }}>
                {t.icon}{t.label}
                {"count" in t && (t.count as number) > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400 font-black">{t.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">

          {tab === "overview" && (
            <>
              {lead.imported && (
                <div className="rounded-xl p-3 flex items-center gap-3"
                  style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <FileText size={14} className="text-yellow-400 shrink-0" />
                  <p className="text-xs text-yellow-300">This lead was imported via CSV. Track engagement to move them through the pipeline.</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Score", val: lead.score || 0, color: lead.score >= 70 ? "#4ade80" : lead.score >= 40 ? "#fb923c" : "#f87171" },
                  { label: "Messages", val: leadComms.length, color: "#a78bfa" },
                  { label: "Value", val: `$${totalValue.toLocaleString()}`, color: "#22d3ee" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">{s.label}</p>
                    <p className="text-xl font-black mt-1" style={{ color: s.color }}>{s.val}</p>
                  </div>
                ))}
              </div>

              {lead.notes && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest mb-2">Notes</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{lead.notes}</p>
                </div>
              )}

              {leadComms.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest mb-3">Recent Activity</p>
                  <div className="space-y-2.5">
                    {leadComms.slice(0, 4).map(c => (
                      <div key={c.id} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CHANNEL_META[c.channel]?.color || "#555" }} />
                        <span className="text-xs text-gray-400 flex-1 truncate">
                          {CHANNEL_META[c.channel]?.icon} {c.channel} {c.direction}
                          {c.content && <span className="text-gray-600"> · {c.content.slice(0, 40)}</span>}
                        </span>
                        <span className="text-[10px] text-gray-700 font-mono shrink-0">{ago(c.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "messages" && (
            <div className="space-y-2">
              {leadComms.length > 0 ? leadComms.map(c => (
                <div key={c.id} className={`rounded-xl p-4 ${c.direction === "inbound" ? "ml-4" : "mr-4"}`}
                  style={{ background: c.direction === "inbound" ? "rgba(74,222,128,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${c.direction === "inbound" ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)"}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{CHANNEL_META[c.channel]?.icon || "•"}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: CHANNEL_META[c.channel]?.color || "#888" }}>{c.channel}</span>
                      <span className={`text-[10px] font-mono ${c.direction === "inbound" ? "text-emerald-400" : "text-cyan-400"}`}>{c.direction}</span>
                    </div>
                    <span className="text-[10px] text-gray-700 font-mono">{ago(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-300">{c.content || "—"}</p>
                </div>
              )) : (
                <div className="text-center py-12"><MessageSquare size={32} className="mx-auto text-gray-800 mb-3" /><p className="text-gray-600 text-sm">No messages yet</p></div>
              )}
            </div>
          )}

          {tab === "pipeline" && (
            <div className="space-y-3">
              {leadPipes.length > 0 ? leadPipes.map(p => {
                const stageIdx = STAGES.indexOf(p.stage?.toLowerCase());
                return (
                  <div key={p.id} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-black text-white capitalize">{p.stage}</span>
                      <span className="text-[10px] text-gray-600 font-mono">{ago(p.created_at)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div><p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">Value</p><p className="text-2xl font-black text-white mt-0.5">${(p.value || 0).toLocaleString()}</p></div>
                      <div><p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">Probability</p><p className="text-2xl font-black text-emerald-400 mt-0.5">{p.probability || 0}%</p></div>
                    </div>
                    <div className="flex items-center gap-1">
                      {STAGES.slice(0, 6).map((s, i) => (
                        <div key={s} className="flex items-center gap-1 flex-1">
                          <div className="w-2 h-2 rounded-full transition-all" style={{ background: i <= stageIdx ? "#22d3ee" : "rgba(255,255,255,0.1)", boxShadow: i === stageIdx ? "0 0 8px #22d3ee" : "none" }} />
                          {i < 5 && <div className="flex-1 h-px" style={{ background: i < stageIdx ? "#22d3ee50" : "rgba(255,255,255,0.06)" }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-12"><GitBranch size={32} className="mx-auto text-gray-800 mb-3" /><p className="text-gray-600 text-sm">No pipeline deals</p></div>
              )}
            </div>
          )}

          {tab === "tasks" && (
            <div className="space-y-2">
              {tasks.length > 0 ? tasks.map(t => (
                <div key={t.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center ${t.status === "done" ? "bg-emerald-400 border-emerald-400" : "border-white/20"}`}>
                    {t.status === "done" && <span className="text-black text-[8px] font-black">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${t.status === "done" ? "line-through text-gray-600" : "text-white"}`}>{t.title}</p>
                    <div className="flex gap-3 mt-1">
                      {t.due_date && <p className="text-[10px] text-gray-600 font-mono">{new Date(t.due_date).toLocaleDateString()}</p>}
                      {t.assigned_to && <p className="text-[10px] text-gray-600">{t.assigned_to}</p>}
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase ${t.status === "done" ? "text-emerald-400 bg-emerald-400/10" : "text-orange-400 bg-orange-400/10"}`}>{t.status}</span>
                </div>
              )) : (
                <div className="text-center py-12"><CheckSquare size={32} className="mx-auto text-gray-800 mb-3" /><p className="text-gray-600 text-sm">No tasks</p></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CSVImportModal({ onClose, onImport }: { onClose: () => void; onImport: (rows: ReturnType<typeof parseCSV>) => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ReturnType<typeof parseCSV>>([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFile(f);
    const text = await f.text();
    const rows = parseCSV(text);
    setPreview(rows.slice(0, 5));
  }

  async function doImport() {
    if (!file) return;
    setImporting(true);
    const text = await file.text();
    const rows = parseCSV(text);
    await onImport(rows);
    setImporting(false);
    setDone(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Syne', sans-serif" }}>
      <div className="absolute inset-0 bg-black/80" onClick={onClose} style={{ backdropFilter: "blur(4px)" }} />
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "#080b14", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #fbbf24, transparent)" }} />

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-white">Import CSV</h2>
              <p className="text-gray-600 text-xs font-mono mt-1">Contacts will be marked as imported and tracked separately</p>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors"><X size={18} /></button>
          </div>

          {/* Format hint */}
          <div className="rounded-xl p-3 mb-5" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
            <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-1">Expected columns</p>
            <p className="text-xs text-gray-400 font-mono">name, email, phone, source <span className="text-gray-600">(or: first name, last name, email address, mobile)</span></p>
          </div>

          {/* Drop zone */}
          <div
            className="rounded-xl p-8 text-center cursor-pointer transition-all mb-4"
            style={{ border: `2px dashed ${file ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)"}`, background: file ? "rgba(251,191,36,0.04)" : "rgba(255,255,255,0.02)" }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {file ? (
              <>
                <FileText size={28} className="mx-auto mb-2 text-yellow-400" />
                <p className="text-white font-bold text-sm">{file.name}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">{preview.length}+ rows detected</p>
              </>
            ) : (
              <>
                <Upload size={28} className="mx-auto mb-2 text-gray-600" />
                <p className="text-gray-400 text-sm font-semibold">Drop CSV here or click to browse</p>
                <p className="text-gray-600 text-xs font-mono mt-1">.csv files only</p>
              </>
            )}
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="rounded-xl overflow-hidden mb-5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-4 py-2 grid grid-cols-3 gap-3 text-[9px] font-mono text-gray-600 uppercase tracking-widest" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span>Name</span><span>Email</span><span>Phone</span>
              </div>
              {preview.map((r, i) => {
                const n = normalizeRow(r);
                return (
                  <div key={i} className="px-4 py-2.5 grid grid-cols-3 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-xs text-white truncate">{n.name || "—"}</span>
                    <span className="text-xs text-gray-400 truncate font-mono">{n.email || "—"}</span>
                    <span className="text-xs text-gray-400 truncate font-mono">{n.phone || "—"}</span>
                  </div>
                );
              })}
              <div className="px-4 py-2 text-[10px] text-gray-600 font-mono" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                Showing 5 of {preview.length}+ rows
              </div>
            </div>
          )}

          {done ? (
            <div className="text-center py-3">
              <p className="text-emerald-400 font-bold">✓ Import complete!</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-500 transition-all hover:text-white"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                Cancel
              </button>
              <button onClick={doImport} disabled={!file || importing}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-black disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
                {importing ? "Importing..." : `Import ${file ? "Contacts" : ""}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [comms, setComms] = useState<Communication[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"recent"|"score"|"name">("recent");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", source: "" });
  const [adding, setAdding] = useState(false);
  const [wsId, setWsId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: "success"|"info" } | null>(null);

  function notify(msg: string, type: "success"|"info" = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = "/signin"; return; }
      const { data: ws } = await supabase.from("workspaces").select("id").eq("owner_id", session.user.id).maybeSingle();
      if (!ws) { setLoading(false); return; }
      setWsId(ws.id);
      const [l, c, p, t] = await Promise.all([
        supabase.from("leads").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
        supabase.from("communications").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
        supabase.from("pipelines").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
        supabase.from("tasks").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false }),
      ]);
      if (l.data) setLeads(l.data);
      if (c.data) setComms(c.data);
      if (p.data) setPipeline(p.data);
      if (t.data) setTasks(t.data);
      setLoading(false);
    }
    load();

    const ch = supabase.channel("leads-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, payload => {
        if (payload.eventType === "INSERT") { setLeads(p => [payload.new as Lead, ...p]); notify(`New lead: ${(payload.new as Lead).name}`, "info"); }
        if (payload.eventType === "UPDATE") setLeads(p => p.map(l => l.id === payload.new.id ? payload.new as Lead : l));
        if (payload.eventType === "DELETE") setLeads(p => p.filter(l => l.id !== (payload.old as Lead).id));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "communications" }, payload => {
        setComms(p => [payload.new as Communication, ...p]);
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  async function addLead() {
    if (!wsId || !newLead.name.trim()) return;
    setAdding(true);
    const { data, error } = await supabase.from("leads").insert({
      workspace_id: wsId, name: newLead.name, email: newLead.email,
      phone: newLead.phone, source: newLead.source, status: "new", score: 0,
    }).select().single();
    if (!error && data) {
      setLeads(p => [data, ...p]);
      setNewLead({ name: "", email: "", phone: "", source: "" });
      setShowAdd(false);
      notify("Lead added");
    }
    setAdding(false);
  }

  async function importCSV(rows: ReturnType<typeof parseCSV>) {
    if (!wsId) return;
    const batch = rows.map(r => {
      const n = normalizeRow(r);
      return { workspace_id: wsId, name: n.name, email: n.email, phone: n.phone, source: n.source || "CSV Import", status: "imported", score: 0, imported: true, notes: "Imported from CSV" };
    }).filter(r => r.name || r.email);

    if (batch.length === 0) return;

    // Insert in chunks of 100
    const chunks = [];
    for (let i = 0; i < batch.length; i += 100) chunks.push(batch.slice(i, i + 100));
    const results: Lead[] = [];
    for (const chunk of chunks) {
      const { data } = await supabase.from("leads").insert(chunk).select();
      if (data) results.push(...data);
    }
    setLeads(p => [...results, ...p]);
    notify(`${results.length} contacts imported successfully`);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads(p => p.map(l => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected(p => p ? { ...p, status } : p);
    notify(`Status → ${status}`);
  }

  const filtered = leads
    .filter(l => {
      const q = search.toLowerCase();
      return (!search || l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q))
        && (filterStatus === "all" || l.status === filterStatus);
    })
    .sort((a, b) => {
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const total = leads.length;
  const imported = leads.filter(l => l.imported || l.status === "imported").length;
  const organic = total - imported;
  const hot = leads.filter(l => l.score >= 70).length;
  const converted = leads.filter(l => l.status === "converted").length;
  const convRate = organic > 0 ? Math.round((converted / organic) * 100) : 0;
  const avgScore = total > 0 ? Math.round(leads.reduce((s, l) => s + (l.score || 0), 0) / total) : 0;
  const pipelineTotal = pipeline.reduce((s, p) => s + (p.value || 0), 0);

  const stageCounts = STAGES.map(s => ({ stage: s, count: leads.filter(l => l.status === s).length }));
  const maxStage = Math.max(...stageCounts.map(s => s.count), 1);

  const filterOptions = [
    { key: "all", label: "All", count: total },
    { key: "new", label: "New", count: leads.filter(l => l.status === "new").length },
    { key: "contacted", label: "Contacted", count: leads.filter(l => l.status === "contacted").length },
    { key: "qualified", label: "Qualified", count: leads.filter(l => l.status === "qualified").length },
    { key: "converted", label: "Converted", count: converted },
    { key: "imported", label: "Imported", count: imported },
    { key: "lost", label: "Lost", count: leads.filter(l => l.status === "lost").length },
  ];

  if (loading) return (
    <main className="min-h-screen bg-[#060810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        <p className="text-gray-600 text-xs font-mono tracking-widest uppercase">Loading leads...</p>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-[#060810] text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .lead-row { transition: background 0.15s, transform 0.15s; cursor: pointer; }
        .lead-row:hover { background: rgba(255,255,255,0.025); }
        .lead-row:active { transform: scale(0.998); }
        .fade-in { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
        .toast { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from{opacity:0;transform:translateY(-12px);} to{opacity:1;transform:translateY(0);} }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px;}
      `}</style>

      {/* TOAST */}
      {notification && (
        <div className="toast fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
          style={{ background: notification.type === "success" ? "rgba(74,222,128,0.15)" : "rgba(34,211,238,0.15)", border: `1px solid ${notification.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(34,211,238,0.3)"}`, backdropFilter: "blur(12px)" }}>
          <Zap size={13} style={{ color: notification.type === "success" ? "#4ade80" : "#22d3ee" }} />
          {notification.msg}
        </div>
      )}

      <div className="p-4 md:p-6 space-y-5 max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="fade-in relative overflow-hidden rounded-2xl p-6 md:p-8"
          style={{ background: "linear-gradient(135deg,#0a0e1a,#0d1220)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.08),transparent 70%)" }} />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                <span className="text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase">Lead Intelligence · Live</span>
              </div>
              <h1 className="text-5xl font-black leading-none tracking-tight">
                Sales<br />
                <span style={{ background: "linear-gradient(135deg,#22d3ee,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pipeline</span>
              </h1>
              <p className="text-gray-600 mt-3 text-xs" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                {organic} organic · {imported} imported · {converted} converted · ${pipelineTotal.toLocaleString()} pipeline
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowCSV(true); setShowAdd(false); }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}>
                <Upload size={15} /> Import CSV
              </button>
              <button onClick={() => { setShowAdd(v => !v); setShowCSV(false); }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg,#22d3ee,#34d399)" }}>
                <Plus size={15} /> Add Lead
              </button>
            </div>
          </div>
        </div>

        {/* ADD FORM */}
        {showAdd && (
          <div className="fade-in rounded-2xl p-5" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">New Lead</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-600 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {[["name","Name *"],["email","Email"],["phone","Phone"],["source","Source"]].map(([k, ph]) => (
                <input key={k} placeholder={ph} value={(newLead as any)[k]}
                  onChange={e => setNewLead(p => ({ ...p, [k]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && addLead()}
                  className="px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono',monospace" }} />
              ))}
            </div>
            <button onClick={addLead} disabled={adding || !newLead.name.trim()}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-black disabled:opacity-40 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#22d3ee,#34d399)" }}>
              {adding ? "Adding..." : "Add Lead"}
            </button>
          </div>
        )}

        {/* KPI STRIP */}
        <div className="fade-in grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { label: "Total Leads", val: total, icon: <Users size={14} />, color: "#22d3ee" },
            { label: "Organic", val: organic, icon: <Activity size={14} />, color: "#34d399" },
            { label: "Imported", val: imported, icon: <FileText size={14} />, color: "#fbbf24" },
            { label: "Hot (≥70)", val: hot, icon: <Star size={14} />, color: "#fb923c" },
            { label: "Conv. Rate", val: `${convRate}%`, icon: <TrendingUp size={14} />, color: "#4ade80" },
            { label: "Pipeline $", val: `$${(pipelineTotal/1000).toFixed(0)}k`, icon: <ArrowUpRight size={14} />, color: "#a78bfa" },
          ].map(k => (
            <div key={k.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{k.label}</span>
                <span style={{ color: k.color }}>{k.icon}</span>
              </div>
              <p className="text-2xl font-black" style={{ color: !k.val || k.val === "0" || k.val === "$0k" || k.val === "0%" ? "#374151" : "white" }}>{k.val || "—"}</p>
            </div>
          ))}
        </div>

        {/* IMPORTED BANNER */}
        {imported > 0 && (
          <div className="fade-in rounded-xl p-4 flex items-center justify-between"
            style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-yellow-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">{imported} imported contacts</p>
                <p className="text-xs text-gray-500 font-mono">Tracked separately · Not counted in organic conversion rate</p>
              </div>
            </div>
            <button onClick={() => setFilterStatus("imported")}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
              style={{ color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
              View All
            </button>
          </div>
        )}

        {/* FUNNEL */}
        <div className="fade-in rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Pipeline Funnel</h2>
            <span className="text-[10px] font-mono text-gray-600">{organic} organic leads</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {stageCounts.slice(0, 7).map(s => (
              <div key={s.stage} className="text-center">
                <div className="h-16 flex items-end justify-center mb-2">
                  <div className="w-full rounded-t-lg" style={{ height: `${Math.max((s.count / maxStage) * 100, 6)}%`, background: "linear-gradient(180deg,rgba(34,211,238,0.4),rgba(34,211,238,0.08))", minHeight: "6px", transition: "height 1s ease" }} />
                </div>
                <p className="text-lg font-black text-white">{s.count}</p>
                <p className="text-[9px] text-gray-600 font-mono capitalize leading-tight mt-0.5">{s.stage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FILTERS */}
        <div className="fade-in flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-3 flex-1 rounded-xl px-4 py-2.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Search size={14} className="text-gray-600 shrink-0" />
            <input placeholder="Search by name, email, phone..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-white placeholder-gray-600 w-full"
              style={{ fontFamily: "'JetBrains Mono',monospace" }} />
            {search && <button onClick={() => setSearch("")} className="text-gray-600 hover:text-white"><X size={13} /></button>}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {filterOptions.map(f => {
              const meta = STATUS_META[f.key] || { color: "#888", bg: "rgba(136,136,136,0.1)" };
              const active = filterStatus === f.key;
              return (
                <button key={f.key} onClick={() => setFilterStatus(f.key)}
                  className="px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
                  style={{
                    color: active ? (f.key === "all" ? "#fff" : meta.color) : "#4b5563",
                    background: active ? (f.key === "all" ? "rgba(255,255,255,0.1)" : meta.bg) : "transparent",
                    border: `1px solid ${active ? (f.key === "all" ? "rgba(255,255,255,0.15)" : meta.color + "40") : "transparent"}`,
                  }}>
                  {f.label} <span className="opacity-50 font-mono">({f.count})</span>
                </button>
              );
            })}
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-[11px] font-bold text-gray-500 outline-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono',monospace" }}>
              <option value="recent">Recent</option>
              <option value="score">Score ↓</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="fade-in rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="grid px-5 py-3 text-[9px] font-mono text-gray-600 uppercase tracking-[0.15em]"
            style={{ gridTemplateColumns: "2fr 2fr 1.2fr 1fr 80px 60px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span>Lead</span><span>Contact</span><span>Source</span><span>Status</span><span className="text-center">Score</span><span className="text-right">Added</span>
          </div>

          {filtered.length > 0 ? filtered.map((lead, i) => {
            const leadPipeValue = pipeline.filter(p => p.lead_id === lead.id).reduce((s, p) => s + (p.value || 0), 0);
            const leadMsgCount = comms.filter(c => c.lead_id === lead.id).length;
            const isImported = lead.imported || lead.status === "imported";
            return (
              <div key={lead.id} className="lead-row grid px-5 py-4" onClick={() => setSelected(lead)}
                style={{ gridTemplateColumns: "2fr 2fr 1.2fr 1fr 80px 60px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: isImported ? "rgba(251,191,36,0.02)" : "transparent" }}>
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_META[lead.status]?.color || "#555", boxShadow: `0 0 6px ${STATUS_META[lead.status]?.color || "#555"}60` }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-white truncate">{lead.name || "—"}</p>
                      {isImported && <FileText size={10} className="text-yellow-400 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {leadPipeValue > 0 && <span className="text-[10px] text-emerald-400 font-mono">${leadPipeValue.toLocaleString()}</span>}
                      {leadMsgCount > 0 && <span className="text-[10px] text-purple-400 font-mono">{leadMsgCount} msg</span>}
                    </div>
                  </div>
                </div>
                <div className="min-w-0 pr-4 flex flex-col justify-center">
                  <p className="text-xs text-gray-400 truncate" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{lead.email || "—"}</p>
                  <p className="text-[10px] text-gray-600 truncate" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{lead.phone || "—"}</p>
                </div>
                <div className="flex items-center pr-4">
                  <span className="text-xs text-gray-500 capitalize truncate">{lead.source || "—"}</span>
                </div>
                <div className="flex items-center">
                  <StatusPill status={lead.status} />
                </div>
                <div className="flex items-center justify-center">
                  <ScoreRing score={lead.score} />
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-[10px] text-gray-700 font-mono">{ago(lead.created_at)}</span>
                </div>
              </div>
            );
          }) : (
            <div className="py-16 text-center">
              <Users size={40} className="mx-auto mb-4" style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-gray-600 text-sm">
                {search || filterStatus !== "all" ? "No leads match your filters." : "No leads yet — add one or import a CSV."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DRAWER */}
      {selected && (
        <LeadDrawer lead={selected} comms={comms} pipeline={pipeline} tasks={tasks}
          onClose={() => setSelected(null)} onStatusChange={updateStatus} />
      )}

      {/* CSV MODAL */}
      {showCSV && (
        <CSVImportModal onClose={() => setShowCSV(false)} onImport={importCSV} />
      )}
    </div>
  );
}
