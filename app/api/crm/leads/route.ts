import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

const VALID_STATUSES = new Set([
  "new",
  "contacted",
  "qualified",
  "nurture",
  "converted",
  "lost",
  "imported",
]);

function normalizeLead(body: any) {
  return {
    workspace_id: body.workspace_id || body.workspaceId || null,
    name: body.name || null,
    email: body.email || null,
    phone: body.phone || null,
    company: body.company || null,
    source: body.source || null,
    status: body.status || "new",
    score: Number(body.score || 0),
    notes: body.notes || null,
    last_interaction: body.last_interaction || body.lastInteraction || null,
    metadata: body.metadata || {},
  };
}

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    let query = supabase
      .from("leads")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    const leads = (data || []).filter((lead) => {
      if (!search) return true;

      return [lead.name, lead.email, lead.phone, lead.company, lead.source]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    });

    return NextResponse.json({ success: true, leads, data: leads });
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

    if (!body.name && !body.email && !body.phone) {
      return NextResponse.json(
        { success: false, error: "Provide at least a name, email, or phone." },
        { status: 400 }
      );
    }

    if (body.status && !VALID_STATUSES.has(body.status)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead status." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("leads")
      .insert(normalizeLead(body))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data });
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

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing lead id." },
        { status: 400 }
      );
    }

    if (body.status && !VALID_STATUSES.has(body.status)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead status." },
        { status: 400 }
      );
    }

    const updates = normalizeLead(body);
    delete (updates as any).workspace_id;

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing lead id." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("leads")
      .update({ archived: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
