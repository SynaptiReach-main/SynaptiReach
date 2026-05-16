import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.campaign_id && !body.campaignId) {
      return NextResponse.json(
        { success: false, error: "Missing campaign_id." },
        { status: 400 }
      );
    }

    if (!body.email && !body.phone && !body.name) {
      return NextResponse.json(
        { success: false, error: "Provide at least name, email, or phone." },
        { status: 400 }
      );
    }

    const campaignId = body.campaign_id || body.campaignId;
    const supabase = createSupabaseAdmin();

    let lead = null;

    if (body.email) {
      const existing = await supabase
        .from("leads")
        .select("*")
        .eq("email", body.email)
        .maybeSingle();

      lead = existing.data;
    }

    if (lead) {
      const updated = await supabase
        .from("leads")
        .update({
          name: body.name || lead.name,
          phone: body.phone || lead.phone,
          source: body.source || lead.source || "campaign_interest",
          status: lead.status === "converted" ? lead.status : "qualified",
          last_interaction: new Date().toISOString(),
          metadata: {
            ...(lead.metadata || {}),
            interest: body.metadata || {},
            campaign_id: campaignId,
          },
        })
        .eq("id", lead.id)
        .select()
        .single();

      if (updated.error) throw updated.error;
      lead = updated.data;
    } else {
      const created = await supabase
        .from("leads")
        .insert({
          workspace_id: body.workspace_id || body.workspaceId || null,
          name: body.name || null,
          email: body.email || null,
          phone: body.phone || null,
          source: body.source || "campaign_interest",
          status: "qualified",
          score: 70,
          notes: body.message || null,
          last_interaction: new Date().toISOString(),
          metadata: {
            interest: body.metadata || {},
            campaign_id: campaignId,
          },
        })
        .select()
        .single();

      if (created.error) throw created.error;
      lead = created.data;
    }

    const campaign = await supabase
      .from("marketing_campaigns")
      .select("converted_count")
      .eq("id", campaignId)
      .maybeSingle();

    await supabase
      .from("marketing_campaigns")
      .update({
        converted_count: Number(campaign.data?.converted_count || 0) + 1,
      })
      .eq("id", campaignId);

    await supabase.from("marketing_events").insert({
      workspace_id: body.workspace_id || body.workspaceId || null,
      campaign_id: campaignId,
      action: "interest",
      type: "interest",
      event_type: "interest",
      title: "Campaign interest captured",
      message: body.message || body.email || body.name || "Lead showed interest",
      details: body.message || "Lead showed interest",
      metadata: {
        lead_id: lead.id,
        email: body.email,
        phone: body.phone,
        source: body.source,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
