import { NextResponse } from "next/server";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { loadOnboardingState, saveOnboardingState } from "@/lib/onboarding/server";

export async function GET(request: Request) {
  try {
    const result = await loadOnboardingState(request);
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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await saveOnboardingState(request, {
      payload: body.payload || body,
      completedSteps: body.completedSteps || [],
      currentStep: body.currentStep || null,
      skippedSteps: body.skippedSteps || {},
      leadRows: body.leadRows || [],
      importFileName: body.importFileName || null,
      complete: Boolean(body.complete),
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
