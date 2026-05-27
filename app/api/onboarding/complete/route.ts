import { NextResponse } from "next/server";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { saveOnboardingState } from "@/lib/onboarding/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await saveOnboardingState(request, {
      payload: body.payload || body,
      completedSteps: body.completedSteps || [],
      currentStep: "activation",
      skippedSteps: body.skippedSteps || {},
      complete: true,
    });

    return NextResponse.json(result, { status: result.status || 200 });
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
