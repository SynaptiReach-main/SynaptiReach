import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("lead_id") || searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: "Missing lead_id." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, activities: data || [] });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.lead_id && !body.leadId) {
      return NextResponse.json(
        { success: false, error: "Missing lead_id." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("lead_activities")
      .insert({
        workspace_id: body.workspace_id || body.workspaceId || null,
        lead_id: body.lead_id || body.leadId,
        type: body.type || "note",
        title: body.title || "Lead note",
        details: body.details || body.note || "",
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from("leads")
      .update({ last_interaction: new Date().toISOString() })
      .eq("id", body.lead_id || body.leadId);

    return NextResponse.json({ success: true, activity: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
