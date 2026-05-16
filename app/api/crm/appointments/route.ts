import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

const VALID_STATUSES = new Set(["scheduled", "completed", "cancelled", "no_show"]);

function normalizeAppointment(body: any) {
  return {
    workspace_id: body.workspace_id || body.workspaceId || null,
    lead_id: body.lead_id || body.leadId || null,
    deal_id: body.deal_id || body.dealId || null,
    title: body.title || null,
    starts_at: body.starts_at || body.startsAt || null,
    ends_at: body.ends_at || body.endsAt || null,
    status: body.status || "scheduled",
    location: body.location || null,
    notes: body.notes || null,
    metadata: body.metadata || {},
  };
}

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("crm_appointments")
      .select("*")
      .order("starts_at", { ascending: true })
      .limit(200);

    if (error) throw error;
    return NextResponse.json({ success: true, appointments: data || [], data: data || [] });
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
    const appointment = normalizeAppointment(body);
    if (!appointment.title || !appointment.starts_at) {
      return NextResponse.json({ success: false, error: "Appointment title and start time are required." }, { status: 400 });
    }
    if (!VALID_STATUSES.has(appointment.status)) {
      return NextResponse.json({ success: false, error: "Invalid appointment status." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("crm_appointments").insert(appointment).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, appointment: data });
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
    if (!body.id) return NextResponse.json({ success: false, error: "Missing appointment id." }, { status: 400 });

    const updates = normalizeAppointment(body);
    delete (updates as any).workspace_id;
    if (!VALID_STATUSES.has(updates.status)) {
      return NextResponse.json({ success: false, error: "Invalid appointment status." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("crm_appointments").update(updates).eq("id", body.id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, appointment: data });
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
    if (!id) return NextResponse.json({ success: false, error: "Missing appointment id." }, { status: 400 });

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("crm_appointments").update({ status: "cancelled" }).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, appointment: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
