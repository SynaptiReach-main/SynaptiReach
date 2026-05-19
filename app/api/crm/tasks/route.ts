import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

const VALID_STATUSES = new Set(["open", "completed", "overdue", "archived"]);
const VALID_PRIORITIES = new Set(["low", "medium", "high", "urgent"]);

function normalizeTask(body: any) {
  return {
    workspace_id: body.workspace_id || body.workspaceId || null,
    lead_id: body.lead_id || body.leadId || null,
    deal_id: body.deal_id || body.dealId || null,
    campaign_id: body.campaign_id || body.campaignId || null,
    title: body.title || null,
    details: body.details || body.description || null,
    status: body.status || "open",
    priority: body.priority || "medium",
    assigned_to: body.assigned_to || body.assignedTo || null,
    assigned_staff_id: body.assigned_staff_id || body.assignedStaffId || null,
    due_date: body.due_date || body.dueDate || null,
    completed_at: body.completed_at || body.completedAt || (body.status === "completed" ? new Date().toISOString() : null),
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
      .from("crm_tasks")
      .select("*")
      .neq("status", "archived"), context)
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(250);

    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, tasks: data || [], data: data || [] });
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
    const task = normalizeTask(body);
    task.workspace_id = task.workspace_id || context.workspaceId || null;
    if (!task.title) return NextResponse.json({ success: false, error: "Task title is required." }, { status: 400 });
    if (!VALID_STATUSES.has(task.status) || !VALID_PRIORITIES.has(task.priority)) {
      return NextResponse.json({ success: false, error: "Invalid task status or priority." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("crm_tasks").insert(task).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, task: data });
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
    if (!body.id) return NextResponse.json({ success: false, error: "Missing task id." }, { status: 400 });

    const updates = normalizeTask(body);
    delete (updates as any).workspace_id;
    if (!VALID_STATUSES.has(updates.status) || !VALID_PRIORITIES.has(updates.priority)) {
      return NextResponse.json({ success: false, error: "Invalid task status or priority." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("crm_tasks")
      .update(updates)
      .eq("id", body.id)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, task: data });
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
    if (!id) return NextResponse.json({ success: false, error: "Missing task id." }, { status: 400 });

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("crm_tasks")
      .update({ status: "archived" })
      .eq("id", id)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, task: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
