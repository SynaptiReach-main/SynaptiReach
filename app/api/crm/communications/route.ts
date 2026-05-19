import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel");
    const status = searchParams.get("status");

    let query = applyWorkspaceScope(supabase
      .from("communications")
      .select("*")
      , context)
      .order("created_at", { ascending: false })
      .limit(200);

    if (channel && channel !== "all") query = query.eq("channel", channel);
    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, communications: data || [], data: data || [] });
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

    if (!body.channel || !body.content) {
      return NextResponse.json(
        { success: false, error: "Missing channel or message content." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("communications")
      .insert({
        workspace_id: body.workspace_id || body.workspaceId || context.workspaceId || null,
        lead_id: body.lead_id || body.leadId || null,
        campaign_id: body.campaign_id || body.campaignId || null,
        channel: body.channel,
        direction: body.direction || "outbound",
        recipient: body.recipient || null,
        subject: body.subject || null,
        content: body.content,
        status: body.status || "draft",
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, communication: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
