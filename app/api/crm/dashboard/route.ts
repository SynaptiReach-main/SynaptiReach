import { NextResponse } from "next/server";
import { loadCRMContext } from "@/lib/crm/data";
import { runDeterministicAgents } from "@/lib/agents/crmAgents";

export async function GET(request: Request) {
  try {
    const context = await loadCRMContext(request);
    const agents = runDeterministicAgents(context);

    return NextResponse.json({
      success: true,
      data: {
        ...context,
        agents,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load CRM dashboard.",
      },
      { status: 500 }
    );
  }
}
