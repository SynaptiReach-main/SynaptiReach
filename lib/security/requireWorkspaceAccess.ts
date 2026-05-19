import { NextResponse } from "next/server";
import {
  getWorkspaceContext,
  type WorkspaceContext,
} from "@/lib/auth/getWorkspaceContext";
import {
  hasPermission,
  missingPermissionMessage,
  type CRMPermission,
} from "@/lib/security/permissions";

export async function requireWorkspaceAccess(
  request: Request,
  permission?: CRMPermission
): Promise<
  | { ok: true; context: WorkspaceContext }
  | { ok: false; response: NextResponse }
> {
  const context = await getWorkspaceContext(request);

  if (!context.isAuthenticated) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error:
            "Authentication is required for this CRM action. Sign in and retry.",
          workspace_warnings: context.warnings,
        },
        { status: 401 }
      ),
    };
  }

  if (!context.isScoped) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: "No workspace context was available for this CRM request.",
          workspace_warnings: context.warnings,
        },
        { status: 403 }
      ),
    };
  }

  if (permission && !hasPermission(context, permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: missingPermissionMessage(permission),
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, context };
}
