import { NextResponse } from "next/server";
import { loadCRMContext } from "@/lib/crm/data";
import { runDeterministicAgents, runExecutiveAgent } from "@/lib/agents/crmAgents";
import { createSupabaseAdmin } from "@/lib/crm/supabaseAdmin";
import { providerErrorResponse } from "@/lib/ai/providers";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const context = await loadCRMContext();
    const result =
      body.agent === "executive" || body.useOpenAI
        ? await runExecutiveAgent(context)
        : runDeterministicAgents(context);

    const supabase = createSupabaseAdmin();

    await supabase
      .from("crm_agent_runs")
      .insert({
        workspace_id: body.workspace_id || body.workspaceId || null,
        agent: body.agent || "all",
        status: "completed",
        summary: result.summary || {},
        recommendations: result.recommendations || [],
        actions: result.actions || [],
        confidence: result.confidence || null,
        data_used: result.data_used || {},
        provider: result.provider || null,
        model: result.model || null,
        fallback_used: result.fallback_used || false,
        provider_errors: result.provider_errors || [],
      });

    return NextResponse.json({
      success: true,
      agent: body.agent || "all",
      ...result,
    });
  } catch (error: any) {
    const response = providerErrorResponse(error);
    return NextResponse.json(
      response,
      { status: 500 }
    );
  }
}
