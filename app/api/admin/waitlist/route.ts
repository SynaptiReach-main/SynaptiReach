import { NextResponse } from "next/server";
import { verifyAdminActionSecret } from "@/lib/admin/access";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

const ALLOWED_STATUSES = new Set(["new", "reviewed", "invited", "onboarded", "declined"]);

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = request.headers.get("x-admin-action-secret") || body.admin_secret || null;
    if (!verifyAdminActionSecret(secret)) {
      return NextResponse.json({ success: false, error: "Admin action access is not configured or authorized." }, { status: 403 });
    }
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Waitlist signup id is required." }, { status: 400 });
    }
    if (body.status && !ALLOWED_STATUSES.has(body.status)) {
      return NextResponse.json({ success: false, error: "Unsupported waitlist status." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (body.status) updates.status = body.status;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.metadata && typeof body.metadata === "object") updates.metadata = body.metadata;

    const { data, error } = await supabase
      .from("waitlist_signups")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json({ success: true, signup: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
