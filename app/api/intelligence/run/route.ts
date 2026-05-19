import { NextResponse } from "next/server";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { buildMiniBrainContext } from "@/lib/intelligence/contextBuilder";
import { persistMiniBrainInsights } from "@/lib/intelligence/persistence";
import { runMiniBrain } from "@/lib/intelligence/miniBrain";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const context = await buildMiniBrainContext(request);
    const result = runMiniBrain(context);
    const persistence =
      body.persist === true
        ? await persistMiniBrainInsights(result.insights, {
            workspaceId: context.workspaceId,
            companyId: context.companyId,
            userId: context.userId,
            limit: Number(body.limit || 10),
          })
        : { persisted: 0, skipped: result.insights.length, errors: [] as string[] };

    return NextResponse.json({
      success: true,
      source: "mini_brain",
      local: false,
      fallbackUsed: false,
      persisted: persistence.persisted,
      persistence_errors: persistence.errors,
      result,
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: friendly.message || "Failed to run built-in intelligence.",
        setup_required: friendly.setupRequired || false,
      },
      { status: friendly.setupRequired ? 503 : 500 }
    );
  }
}
