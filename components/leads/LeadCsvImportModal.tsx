"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";

const sampleCsv = `name,email,phone,company,source,status,tags,notes
Jane Smith,jane@example.com,555-123-4567,Smith Roofing,Website,new,"roofing,hot","Requested pricing"
Marcus Lee,marcus@example.com,555-222-9999,Lee HVAC,Referral,qualified,"hvac,commercial","Needs follow-up"`;

const acceptedColumns = [
  "name",
  "first_name",
  "last_name",
  "full_name",
  "email",
  "phone",
  "company",
  "source",
  "status",
  "tags",
  "notes",
  "address",
  "city",
  "state",
  "zip",
  "website",
  "lead_score",
  "score",
  "last_interaction",
  "created_at",
];

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one lead row.");
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce((row: Record<string, string>, header, index) => {
      row[header] = cells[index] || "";
      return row;
    }, {});
  });
}

function hasIdentifier(row: Record<string, string>) {
  const lookup = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      value,
    ])
  );
  const name =
    lookup.name ||
    lookup.full_name ||
    [lookup.first_name, lookup.last_name].filter(Boolean).join(" ");

  return Boolean(lookup.email || lookup.phone || name.trim());
}

export default function LeadCsvImportModal({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported?: () => void;
}) {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const preview = rows.slice(0, 5);
  const summary = useMemo(() => {
    const valid = rows.filter(hasIdentifier).length;
    return {
      total: rows.length,
      valid,
      skipped: rows.length - valid,
    };
  }, [rows]);

  if (!open) return null;

  async function handleFile(file?: File | null) {
    try {
      setError("");
      setResult(null);

      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("Select a .csv file.");
      }

      const text = await file.text();
      const parsed = parseCsv(text);
      setRows(parsed);
      setFileName(file.name);
    } catch (error) {
      setRows([]);
      setFileName("");
      setError(error instanceof Error ? error.message : "Failed to parse CSV.");
    }
  }

  async function importRows() {
    try {
      setImporting(true);
      setError("");
      setResult(null);

      const response = await fetch("/api/crm/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to import leads.");
      }

      setResult(data);
      window.dispatchEvent(new Event("crm-leads-imported"));
      onImported?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to import leads.");
    } finally {
      setImporting(false);
    }
  }

  function resetAndClose() {
    if (importing) return;
    setRows([]);
    setFileName("");
    setError("");
    setResult(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-[#061018] p-5 text-white shadow-2xl shadow-cyan-500/10 md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              <Upload size={14} />
              Lead CSV Import
            </div>
            <h2 className="text-2xl font-black">Import contacts into the real CRM</h2>
            <p className="mt-1 text-sm text-gray-400">
              Upload a CSV, preview mapped rows, then import valid contacts into Supabase leads.
            </p>
          </div>
          <button onClick={resetAndClose} className="rounded-xl border border-white/10 bg-black/30 p-2 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 size={16} />
              Import complete
            </div>
            <div className="mt-2">
              {result.imported_count} imported, {result.duplicate_count} duplicates skipped, {result.skipped_count} skipped.
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <h3 className="font-black">Suggested format</h3>
            <p className="mt-2 text-sm text-gray-400">
              Columns can be in any order. At minimum, each row needs email, phone, or name.
              Duplicate detection uses email first, then phone. Duplicates are skipped safely.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-gray-300">
              {sampleCsv}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              {acceptedColumns.map((column) => (
                <span key={column} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-300">
                  {column}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/[0.05] p-5">
            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-400/30 bg-black/30 p-6 text-center hover:bg-cyan-500/10">
              <FileText className="mb-3 text-cyan-300" size={32} />
              <span className="font-black">Choose CSV file</span>
              <span className="mt-1 text-sm text-gray-500">{fileName || "Only .csv files are accepted"}</span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </label>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["Rows", summary.total],
                ["Valid", summary.valid],
                ["Skipped", summary.skipped],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                  <div className="text-2xl font-black text-cyan-200">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={importRows}
              disabled={importing || rows.length === 0 || summary.valid === 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importing ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              Import Valid Leads
            </button>
          </div>
        </section>

        {preview.length > 0 && (
          <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-3 font-black">Preview first {preview.length} rows</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-gray-500">
                  <tr>
                    {Object.keys(preview[0]).slice(0, 8).map((header) => (
                      <th key={header} className="border-b border-white/10 p-3">{header}</th>
                    ))}
                    <th className="border-b border-white/10 p-3">Validation</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index} className="border-b border-white/5">
                      {Object.keys(preview[0]).slice(0, 8).map((header) => (
                        <td key={header} className="p-3 text-gray-300">{row[header]}</td>
                      ))}
                      <td className="p-3">
                        {hasIdentifier(row) ? (
                          <span className="text-cyan-200">valid</span>
                        ) : (
                          <span className="text-red-200">missing identifier</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {result?.errors?.length > 0 && (
          <section className="mt-5 rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-5">
            <h3 className="mb-3 font-black text-yellow-100">Skipped row summary</h3>
            <div className="space-y-2 text-sm text-yellow-50">
              {result.errors.slice(0, 8).map((item: any) => (
                <div key={`${item.row}-${item.reason}`}>Row {item.row}: {item.reason}</div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
