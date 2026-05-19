import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

const VALID_STATUSES = new Set(["draft", "active", "paused", "completed", "archived"]);

function normalizeWorkflow(body: any) {
  return {
    workspace_id: body.workspace_id || body.workspaceId || null,
    name: body.name || null,
    status: body.status || "draft",
    trigger_type: body.trigger_type || body.triggerType || null,
    condition: body.condition || null,
    action: body.action || null,
    actions: Array.isArray(body.actions) ? body.actions : [],
    metadata: body.metadata || {},
  };
}

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = applyWorkspaceScope(supabase
      .from("crm_workflows")
      .select("*")
      .neq("status", "archived"), context)
      .order("created_at", { ascending: false })
      .limit(200);

    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, workflows: data || [], data: data || [] });
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
    const context = await getWorkspaceContext(req);
    const workflow = normalizeWorkflow(body);
    workflow.workspace_id = workflow.workspace_id || context.workspaceId || null;
    if (!workflow.name) return NextResponse.json({ success: false, error: "Workflow name is required." }, { status: 400 });
    if (!VALID_STATUSES.has(workflow.status)) return NextResponse.json({ success: false, error: "Invalid workflow status." }, { status: 400 });

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("crm_workflows").insert(workflow).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, workflow: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const context = await getWorkspaceContext(req);
    if (!body.id) return NextResponse.json({ success: false, error: "Missing workflow id." }, { status: 400 });

    const updates = normalizeWorkflow(body);
    delete (updates as any).workspace_id;
    if (!VALID_STATUSES.has(updates.status)) return NextResponse.json({ success: false, error: "Invalid workflow status." }, { status: 400 });

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("crm_workflows")
      .update(updates)
      .eq("id", body.id)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, workflow: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    const context = await getWorkspaceContext(request);
    if (!id) return NextResponse.json({ success: false, error: "Missing workflow id." }, { status: 400 });

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("crm_workflows")
      .update({ status: "archived" })
      .eq("id", id)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, workflow: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
