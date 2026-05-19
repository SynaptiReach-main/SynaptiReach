import { NextResponse } from "next/server";
import { buildMiniBrainContext } from "@/lib/intelligence/contextBuilder";
import { runMiniBrain } from "@/lib/intelligence/miniBrain";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const context = await buildMiniBrainContext(request);
    const result = runMiniBrain(context);

    return NextResponse.json({
      success: true,
      source: "mini_brain",
      local: false,
      fallbackUsed: false,
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
