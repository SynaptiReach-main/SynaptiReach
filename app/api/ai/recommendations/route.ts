import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { loadCRMContext } from "@/lib/crm/data";
import { runExecutiveAgent } from "@/lib/agents/crmAgents";
import { providerErrorResponse } from "@/lib/ai/providers";

export async function GET() {
  try {
    const context = await loadCRMContext();
    const agentResult = await runExecutiveAgent(context);

    return NextResponse.json({
      success: true,
      recommendations: agentResult.recommendations || [],
      summary: agentResult.summary,
      data_used: agentResult.data_used,
      provider: agentResult.provider,
      model: agentResult.model,
      fallback_used: agentResult.fallback_used,
      provider_errors: agentResult.provider_errors,
      provider_warnings: agentResult.provider_warnings,
    });
  } catch (error: any) {
    const response = providerErrorResponse(error);
    return NextResponse.json(
      response,
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (!body.id && !body.title) {
      return NextResponse.json(
        { success: false, error: "Missing recommendation id or title." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    if (body.id) {
      const { data, error } = await supabase
        .from("marketing_ai_recommendations")
        .update({ accepted: true, dismissed: false })
        .eq("id", body.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, recommendation: data });
    }

    const { data, error } = await supabase
      .from("marketing_events")
      .insert({
        workspace_id: body.workspace_id || body.workspaceId || null,
        type: "ai_recommendation",
        event_type: "ai_recommendation",
        title: "AI recommendation accepted",
        message: body.title,
        action: "accepted",
        details: body.description || body.title,
        metadata: body,
      })
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
