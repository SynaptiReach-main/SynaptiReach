import { NextResponse } from "next/server";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { saveOnboardingState } from "@/lib/onboarding/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await saveOnboardingState(request, {
      payload: body.payload || { integrations: body.integrations || body },
      completedSteps: body.completedSteps || [],
      currentStep: "integrations",
      skippedSteps: body.skippedSteps || {},
    });

    return NextResponse.json(
      {
        success: result.success,
        error: result.error,
        workspace: result.workspace,
        readiness: result.readiness,
        providerConnections: result.snapshot?.providerConnections || [],
      },
      { status: result.status || 200 }
    );
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: friendly.message,
        missingSchema: friendly.missingSchema,
        setupRequired: friendly.setupRequired,
      },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
