import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { loadCRMContext } from "@/lib/crm/data";
import { runExecutiveAgent } from "@/lib/agents/crmAgents";
import { providerErrorResponse } from "@/lib/ai/providers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspace_id") || searchParams.get("workspaceId");
  let query = supabase
    .from("marketing_ai_recommendations")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(20);
  if (workspaceId) query = query.eq("workspace_id", workspaceId);

  const { data, error } = await query;

  if (error) {
    try {
      const context = await loadCRMContext(request);
      const result = await runExecutiveAgent(context);

      return NextResponse.json({
        success: true,
        data: result.recommendations || [],
        generated: true,
        provider: result.provider,
        model: result.model,
        fallback_used: result.fallback_used,
        provider_errors: result.provider_errors,
        provider_warnings: result.provider_warnings,
      });
    } catch (fallbackError: any) {
      const response = providerErrorResponse(fallbackError);
      return NextResponse.json(
        response,
        {
          status: 500,
        }
      );
    }
  }

  return NextResponse.json({
    success: true,
    data,
  });
}

export async function POST(request: Request) {
  try {
    const context = await loadCRMContext(request);
    const result = await runExecutiveAgent(context);

    return NextResponse.json({
      success: true,
      data: result.recommendations || [],
      summary: result.summary,
      data_used: result.data_used,
      provider: result.provider,
      model: result.model,
      fallback_used: result.fallback_used,
      provider_errors: result.provider_errors,
      provider_warnings: result.provider_warnings,
    });
  } catch (error: any) {
    const response = providerErrorResponse(error);
    return NextResponse.json(
      response,
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const accepting = body.action !== "deny" && body.action !== "dismiss";

    if (!body.id && !body.title) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing recommendation id or title.",
        },
        {
          status: 400,
        }
      );
    }

    if (body.id) {
      const { data, error } = await supabase
        .from("marketing_ai_recommendations")
        .update({
          accepted: accepting,
          dismissed: !accepting,
        })
        .eq("id", body.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await supabase
        .from("marketing_events")
        .insert({
          workspace_id: body.workspace_id || body.workspaceId || data?.workspace_id || null,
          type: "ai_recommendation",
          event_type: "ai_recommendation",
          title: accepting ? "AI recommendation accepted" : "AI recommendation dismissed",
          message: data?.title || body.title,
          action: accepting ? "accepted" : "dismissed",
          details:
            body.description ||
            data?.description ||
            "Recommendation action recorded for review.",
          metadata: {
            ...body,
            recommendation_id: body.id,
            review_gated: true,
          },
        });

      return NextResponse.json({
        success: true,
        recommendation: data,
        action: accepting ? "accepted" : "dismissed",
      });
    }

    const { data, error } = await supabase
      .from("marketing_events")
      .insert({
        workspace_id: body.workspace_id || body.workspaceId || null,
        type: "ai_recommendation",
        event_type: "ai_recommendation",
        title: accepting ? "AI recommendation accepted" : "AI recommendation dismissed",
        message: body.title,
        action: accepting ? "accepted" : "dismissed",
        details: body.description || body.title,
        metadata: body,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      event: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
