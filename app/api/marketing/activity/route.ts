import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const { data, error } = await applyWorkspaceScope(supabase
      .from("marketing_events")
      .select("*"), context)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ success: true, data });
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
    const supabase = createSupabaseAdmin();
    const body = await req.json();
    const context = await getWorkspaceContext(req);
    const { campaign_id, action, details, workspace_id, type, message, metadata } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Missing required field: action" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("marketing_events")
      .insert([
        {
          campaign_id,
          workspace_id: workspace_id || context.workspaceId || null,
          event_type: type || action,
          type: type || action,
          title: details || message || action,
          description: details || message || "",
          message: message || details || "",
          action,
          details: details || "",
          metadata: metadata || {},
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, event: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
