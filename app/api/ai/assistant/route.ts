import { NextResponse } from "next/server";
import { generateAIText, providerErrorResponse } from "@/lib/ai/providers";
import { loadCRMContext } from "@/lib/crm/data";
import { runDeterministicAgents } from "@/lib/agents/crmAgents";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || body.prompt;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Missing assistant message." },
        { status: 400 }
      );
    }

    const context = await loadCRMContext();
    const agentSnapshot = runDeterministicAgents(context);

    const profile =
      body.profile ||
      (String(message).toLowerCase().includes("strategy") ||
      String(message).toLowerCase().includes("executive")
        ? "premium"
        : "balanced");

    const answer = await generateAIText([
      {
        role: "system",
        content:
          "You are SynaptiReach's autonomous CRM assistant. Answer using only supplied CRM data. If data is missing, say it is missing. Do not invent metrics. Keep answers concise and action-oriented.",
      },
      {
        role: "user",
        content: JSON.stringify({
          question: message,
          metrics: context.metrics,
          settings: context.settings,
          schemaWarnings: context.schemaWarnings,
          recentLeads: context.leads.slice(0, 25),
          recentCampaigns: context.campaigns.slice(0, 25),
          recentActivity: context.activity.slice(0, 25),
          recentCommunications: context.communications.slice(0, 25),
          deterministicAgents: agentSnapshot,
        }),
      },
    ], { profile });

    return NextResponse.json({
      success: true,
      answer: answer.text,
      actions: agentSnapshot.actions,
      data_used: agentSnapshot.data_used,
      provider: answer.provider,
      model: answer.model,
      fallback_used: answer.fallback_used,
      provider_errors: answer.provider_errors,
      provider_warnings: answer.provider_warnings,
    });
  } catch (error: any) {
    const response = providerErrorResponse(error);
    return NextResponse.json(
      response,
      { status: 500 }
    );
  }
}
