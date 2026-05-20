"use client";

import { X } from "lucide-react";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export type SimpleMetricDetail = {
  title: string;
  value?: string | number;
  description?: string;
  records?: any[];
  href?: string;
};

export default function SimpleMetricModal({
  metric,
  onClose,
}: {
  metric: SimpleMetricDetail | null;
  onClose: () => void;
}) {
  if (!metric) return null;

  const records = metric.records || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 shadow-2xl shadow-cyan-500/20">
        <div className="flex items-start justify-between gap-4 border-b border-cyan-400/10 p-5">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Metric Detail</div>
            <h2 className="mt-1 text-2xl font-black">{metric.title}</h2>
            <p className="mt-1 text-sm text-cyan-50/55">
              {metric.description || `${records.length} real record${records.length === 1 ? "" : "s"} behind this metric.`}
            </p>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-white/10 p-2 text-cyan-100 hover:bg-white/5">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[62vh] overflow-y-auto p-5">
          <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Current value</div>
            <div className="mt-2 text-3xl font-black text-white">{metric.value ?? records.length}</div>
          </div>
          {records.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-cyan-50/55">
              No real records currently match this metric.
            </div>
          ) : (
            <div className="space-y-3">
              {records.slice(0, 50).map((record: any, index: number) => (
                <div key={record.id || index} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="font-bold text-white">
                    {record.name || record.title || record.subject || record.email || record.recipient || record.action || record.type || "CRM record"}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {record.status || record.stage || record.channel || record.priority || record.source || "Needs review"}
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {formatDate(record.created_at || record.updated_at || record.due_date || record.starts_at || record.send_date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {metric.href && (
          <div className="border-t border-cyan-400/10 p-5">
            <a href={metric.href} className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black">
              Open related page
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
