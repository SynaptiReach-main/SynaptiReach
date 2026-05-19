import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

const VALID_STAGES = new Set(["new", "qualified", "proposal", "negotiation", "won", "lost"]);
const VALID_STATUSES = new Set(["open", "won", "lost", "archived"]);

function normalizeDeal(body: any) {
  const stage = body.stage || "new";
  return {
    workspace_id: body.workspace_id || body.workspaceId || null,
    lead_id: body.lead_id || body.leadId || null,
    title: body.title || body.name || null,
    company: body.company || null,
    value: Number(body.value || 0),
    stage,
    status: body.status || (stage === "won" ? "won" : stage === "lost" ? "lost" : "open"),
    probability: Number(body.probability || 0),
    expected_close_date: body.expected_close_date || body.expectedCloseDate || null,
    notes: body.notes || null,
    metadata: body.metadata || {},
  };
}

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    const status = searchParams.get("status");

    let query = applyWorkspaceScope(supabase
      .from("crm_deals")
      .select("*")
      .eq("archived", false), context)
      .order("created_at", { ascending: false })
      .limit(250);

    if (stage && stage !== "all") query = query.eq("stage", stage);
    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, deals: data || [], data: data || [] });
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
    const deal = normalizeDeal(body);

    if (!deal.title) {
      return NextResponse.json({ success: false, error: "Deal title is required." }, { status: 400 });
    }
    if (!VALID_STAGES.has(deal.stage) || !VALID_STATUSES.has(deal.status)) {
      return NextResponse.json({ success: false, error: "Invalid deal stage or status." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    deal.workspace_id = deal.workspace_id || context.workspaceId || null;
    const { data, error } = await supabase.from("crm_deals").insert(deal).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, deal: data });
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
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Missing deal id." }, { status: 400 });
    }

    const updates = normalizeDeal(body);
    delete (updates as any).workspace_id;

    if (!VALID_STAGES.has(updates.stage) || !VALID_STATUSES.has(updates.status)) {
      return NextResponse.json({ success: false, error: "Invalid deal stage or status." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("crm_deals")
      .update(updates)
      .eq("id", body.id)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json({ success: true, deal: data });
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
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing deal id." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("crm_deals")
      .update({ archived: true, status: "archived" })
      .eq("id", id)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json({ success: true, deal: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
