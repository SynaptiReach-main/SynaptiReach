import { createSupabaseAdmin } from "@/lib/crm/supabaseAdmin";

const VALID_STATUSES = new Set([
  "new",
  "contacted",
  "qualified",
  "nurture",
  "converted",
  "lost",
]);

const FIELD_ALIASES: Record<string, string> = {
  name: "name",
  full_name: "name",
  fullname: "name",
  first_name: "first_name",
  firstname: "first_name",
  last_name: "last_name",
  lastname: "last_name",
  email: "email",
  email_address: "email",
  phone: "phone",
  phone_number: "phone",
  mobile: "phone",
  company: "company",
  organization: "company",
  source: "source",
  status: "status",
  tags: "tags",
  notes: "notes",
  note: "notes",
  address: "address",
  city: "city",
  state: "state",
  zip: "zip",
  zipcode: "zip",
  postal_code: "zip",
  website: "website",
  url: "website",
  lead_score: "score",
  score: "score",
  last_interaction: "last_interaction",
  created_at: "created_at",
};

type ImportRow = Record<string, any>;

function normalizeHeader(header: string) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clean(value: any) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function normalizeStatus(value: any) {
  const status = String(value || "new").trim().toLowerCase().replace(/\s+/g, "_");
  return VALID_STATUSES.has(status) ? status : "new";
}

function normalizeDate(value: any) {
  const text = clean(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function splitTags(value: any) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function mapRow(raw: ImportRow) {
  const mapped: Record<string, any> = {};
  const extra: Record<string, any> = {};

  Object.entries(raw || {}).forEach(([key, value]) => {
    const normalized = normalizeHeader(key);
    const target = FIELD_ALIASES[normalized];

    if (target) {
      mapped[target] = value;
    } else if (clean(value)) {
      extra[key] = value;
    }
  });

  const firstName = clean(mapped.first_name);
  const lastName = clean(mapped.last_name);
  const name =
    clean(mapped.name) ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    null;

  const tags = splitTags(mapped.tags);
  const metadata = {
    tags,
    address: clean(mapped.address),
    city: clean(mapped.city),
    state: clean(mapped.state),
    zip: clean(mapped.zip),
    website: clean(mapped.website),
    extra_fields: extra,
    import_source: "csv",
  };

  return {
    name,
    email: clean(mapped.email)?.toLowerCase() || null,
    phone: clean(mapped.phone),
    company: clean(mapped.company),
    source: clean(mapped.source) || "CSV Import",
    status: normalizeStatus(mapped.status),
    score: Number(mapped.score || 0) || 0,
    notes: clean(mapped.notes),
    last_interaction: normalizeDate(mapped.last_interaction),
    created_at: normalizeDate(mapped.created_at),
    metadata,
  };
}

export async function importLeadRows(rows: ImportRow[], workspaceId?: string | null) {
  const supabase = createSupabaseAdmin();
  const errors: Array<{ row: number; reason: string }> = [];
  const imported: any[] = [];
  let duplicateCount = 0;
  let validCount = 0;

  const { data: existingRows, error: existingError } = await supabase
    .from("leads")
    .select("id,email,phone")
    .eq("archived", false);

  if (existingError) throw existingError;

  const existingEmails = new Set(
    (existingRows || [])
      .map((lead: any) => String(lead.email || "").toLowerCase())
      .filter(Boolean)
  );
  const existingPhones = new Set(
    (existingRows || [])
      .map((lead: any) => String(lead.phone || "").replace(/\D/g, ""))
      .filter(Boolean)
  );
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();

  for (const [index, raw] of rows.entries()) {
    const rowNumber = index + 2;
    const lead = mapRow(raw);
    const phoneKey = String(lead.phone || "").replace(/\D/g, "");

    if (!lead.email && !lead.phone && !lead.name) {
      errors.push({ row: rowNumber, reason: "Missing email, phone, or name." });
      continue;
    }

    validCount += 1;

    const duplicate =
      (lead.email && (existingEmails.has(lead.email) || seenEmails.has(lead.email))) ||
      (phoneKey && (existingPhones.has(phoneKey) || seenPhones.has(phoneKey)));

    if (duplicate) {
      duplicateCount += 1;
      errors.push({ row: rowNumber, reason: "Duplicate email or phone skipped." });
      continue;
    }

    const insertPayload: Record<string, any> = {
      workspace_id: workspaceId || null,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
      score: lead.score,
      notes: lead.notes,
      last_interaction: lead.last_interaction,
      imported: true,
      metadata: lead.metadata,
    };

    if (lead.created_at) {
      insertPayload.created_at = lead.created_at;
    }

    const { data, error } = await supabase
      .from("leads")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      errors.push({ row: rowNumber, reason: error.message || "Insert failed." });
      continue;
    }

    imported.push(data);
    if (lead.email) seenEmails.add(lead.email);
    if (phoneKey) seenPhones.add(phoneKey);

    if (lead.notes) {
      await supabase.from("lead_activities").insert({
        workspace_id: workspaceId || null,
        lead_id: data.id,
        type: "note",
        title: "Imported CSV note",
        details: lead.notes,
        metadata: { source: "csv_import" },
      });
    }
  }

  if (imported.length > 0) {
    await supabase.from("marketing_events").insert({
      workspace_id: workspaceId || null,
      type: "crm_import",
      event_type: "crm_import",
      action: "lead_csv_imported",
      title: "Lead CSV import completed",
      message: `${imported.length} leads imported from CSV.`,
      details: `${imported.length} imported, ${duplicateCount} duplicates skipped, ${errors.length} rows skipped or flagged.`,
      metadata: {
        imported_count: imported.length,
        duplicate_count: duplicateCount,
        skipped_count: errors.length,
      },
    });

    await supabase.from("crm_ai_recommendations").insert({
      workspace_id: workspaceId || null,
      type: "lead_import_review",
      title: "Review newly imported leads",
      description:
        "New CSV contacts were imported. Run lead scoring and create follow-up tasks for high-fit contacts.",
      action: "review_lead",
      status: "open",
      confidence: 0.78,
      metadata: {
        source: "csv_import",
        imported_count: imported.length,
      },
    });
  }

  return {
    total_rows: rows.length,
    valid_rows: validCount,
    skipped_count: errors.length,
    duplicate_count: duplicateCount,
    imported_count: imported.length,
    errors: errors.slice(0, 50),
    imported,
  };
}
