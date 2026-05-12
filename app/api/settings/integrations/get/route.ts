import { NextResponse } from "next/server";

import {
  getWorkspaceIntegrations,
} from "@/lib/integrations/getWorkspaceIntegrations";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const integrations =
      await getWorkspaceIntegrations(
        body.workspace_id
      );

    return NextResponse.json({
      success: true,
      integrations,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}
