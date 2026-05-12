import { NextResponse } from "next/server";
import { getWorkspaceIntegrations } from "@/lib/integrations/getWorkspaceIntegrations";

export async function POST(request: Request) {
  try {
    let body: any = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const workspace_id = body?.workspace_id;

    if (!workspace_id) {
      return NextResponse.json(
        {
          success: false,
          error: "workspace_id is required",
        },
        { status: 400 }
      );
    }

    const integrations = await getWorkspaceIntegrations(workspace_id);

    return NextResponse.json({
      success: true,
      integrations: integrations ?? [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
