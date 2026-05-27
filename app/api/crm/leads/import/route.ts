import { NextResponse } from "next/server";
import { importLeadRows } from "@/lib/crm/importLeadsCsv";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No CSV rows provided." },
        { status: 400 }
      );
    }

    if (rows.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Import is limited to 5,000 rows at a time." },
        { status: 400 }
      );
    }

    const context = await getWorkspaceContext(req);
    const result = await importLeadRows(rows, body.workspace_id || body.workspaceId || context.workspaceId || null, {
      companyId: body.company_id || body.companyId || context.companyId || null,
      userId: context.userId || body.user_id || body.userId || null,
      fileName: body.file_name || body.fileName || null,
      source: "crm_leads_import",
    });

    return NextResponse.json({
      success: true,
      imported_count: result.imported_count,
      skipped_count: result.skipped_count,
      duplicate_count: result.duplicate_count,
      total_rows: result.total_rows,
      valid_rows: result.valid_rows,
      errors: result.errors,
      leads: result.imported.slice(0, 100),
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);

    return NextResponse.json(
      {
        success: false,
        error: friendly.message || "Failed to import leads.",
        missingSchema: friendly.missingSchema,
      },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
