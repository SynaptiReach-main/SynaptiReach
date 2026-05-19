import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/crm/supabaseAdmin";

export type WorkspaceContext = {
  userId: string | null;
  workspaceId: string | null;
  companyId: string | null;
  role: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isScoped: boolean;
  warnings: string[];
};

function valueFromRequest(request: Request | NextRequest, name: string) {
  const url = new URL(request.url);
  return (
    request.headers.get(name) ||
    request.headers.get(`x-${name}`) ||
    url.searchParams.get(name) ||
    url.searchParams.get(name.replace(/_/g, ""))
  );
}

export async function getWorkspaceContext(
  request: Request | NextRequest
): Promise<WorkspaceContext> {
  const requestedWorkspaceId =
    valueFromRequest(request, "workspace_id") ||
    valueFromRequest(request, "workspace-id");
  const requestedCompanyId =
    valueFromRequest(request, "company_id") ||
    valueFromRequest(request, "company-id");
  const warnings: string[] = [];

  let userId: string | null = null;

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch {
    warnings.push("No Supabase server session was available for this request.");
  }

  if (!userId) {
    return {
      userId: null,
      workspaceId: requestedWorkspaceId || null,
      companyId: requestedCompanyId || null,
      role: null,
      permissions: [],
      isAuthenticated: false,
      isScoped: Boolean(requestedWorkspaceId || requestedCompanyId),
      warnings: [
        ...warnings,
        "Auth is not fully enforced for this route yet; server-side workspace scoping falls back to explicit workspace/company identifiers when provided.",
      ],
    };
  }

  const admin = createSupabaseAdmin();
  const workspaceQuery = requestedWorkspaceId
    ? admin
        .from("workspaces")
        .select("id, company_id, owner_id")
        .eq("id", requestedWorkspaceId)
        .or(`owner_id.eq.${userId}`)
        .maybeSingle()
    : admin
        .from("workspaces")
        .select("id, company_id, owner_id")
        .eq("owner_id", userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

  const { data: workspace } = await workspaceQuery;

  if (!workspace) {
    warnings.push("No matching workspace was found for the authenticated user.");
  }

  return {
    userId,
    workspaceId: workspace?.id || requestedWorkspaceId || null,
    companyId: workspace?.company_id || requestedCompanyId || null,
    role: workspace?.owner_id === userId ? "owner" : null,
    permissions: workspace?.owner_id === userId ? ["*"] : [],
    isAuthenticated: true,
    isScoped: Boolean(workspace?.id || requestedWorkspaceId || requestedCompanyId),
    warnings,
  };
}

export function scopedInsert<T extends Record<string, any>>(
  record: T,
  context: WorkspaceContext
) {
  return {
    ...record,
    workspace_id: record.workspace_id || context.workspaceId || null,
    company_id: record.company_id || context.companyId || null,
    user_id: record.user_id || context.userId || null,
  };
}

export function applyWorkspaceScope<TQuery extends { eq: (column: string, value: string) => TQuery }>(
  query: TQuery,
  context: WorkspaceContext
) {
  if (context.workspaceId) return query.eq("workspace_id", context.workspaceId);
  if (context.companyId) return query.eq("company_id", context.companyId);
  if (context.userId) return query.eq("user_id", context.userId);
  return query;
}
