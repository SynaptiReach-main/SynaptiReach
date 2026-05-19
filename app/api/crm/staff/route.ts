import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { CRM_PERMISSIONS } from "@/lib/security/permissions";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

function normalizeStaff(body: any) {
  return {
    workspace_id: body.workspace_id || body.workspaceId || null,
    company_id: body.company_id || body.companyId || null,
    user_id: body.user_id || body.userId || null,
    role_id: body.role_id || body.roleId || null,
    name: body.name || null,
    email: body.email || null,
    phone: body.phone || null,
    title: body.title || null,
    status: body.status || "invited",
    metadata: body.metadata || {},
  };
}

async function savePermissions(supabase: any, staffId: string, permissions: string[], workspaceId?: string | null, companyId?: string | null) {
  const validPermissions = permissions.filter((permission) => (CRM_PERMISSIONS as readonly string[]).includes(permission));
  await supabase.from("crm_staff_permissions").update({ granted: false }).eq("staff_id", staffId);
  if (validPermissions.length === 0) return [];

  const { data, error } = await supabase
    .from("crm_staff_permissions")
    .insert(
      validPermissions.map((permission) => ({
        workspace_id: workspaceId || null,
        company_id: companyId || null,
        staff_id: staffId,
        permission,
        granted: true,
      }))
    )
    .select();

  if (error) throw error;
  return data || [];
}

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const { data, error } = await supabase
      .from("crm_staff")
      .select("*")
      .neq("status", "archived")
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const staffIds = (data || []).map((member: any) => member.id);
    const { data: permissionRows } = staffIds.length
      ? await supabase.from("crm_staff_permissions").select("*").in("staff_id", staffIds).eq("granted", true)
      : { data: [] };

    const staff = (data || []).map((member: any) => ({
      ...member,
      permissions: (permissionRows || [])
        .filter((permission: any) => permission.staff_id === member.id)
        .map((permission: any) => permission.permission),
    }));

    return NextResponse.json({ success: true, staff, data: staff, permissions: CRM_PERMISSIONS });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const context = await getWorkspaceContext(req);
    const staff = normalizeStaff(body);
    staff.workspace_id = staff.workspace_id || context.workspaceId || null;
    staff.company_id = staff.company_id || context.companyId || null;

    if (!staff.name && !staff.email) {
      return NextResponse.json({ success: false, error: "Staff name or email is required." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("crm_staff").insert(staff).select().single();
    if (error) throw error;

    const permissions = await savePermissions(supabase, data.id, body.permissions || [], data.workspace_id, data.company_id);

    await supabase.from("crm_audit_logs").insert({
      workspace_id: data.workspace_id || null,
      company_id: data.company_id || null,
      action: "staff_created",
      resource_type: "crm_staff",
      resource_id: data.id,
      details: "Staff member created from settings.",
      metadata: { source: "settings_page" },
    });

    return NextResponse.json({ success: true, staff: { ...data, permissions: permissions.map((item: any) => item.permission) } });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const context = await getWorkspaceContext(req);
    if (!body.id) return NextResponse.json({ success: false, error: "Missing staff id." }, { status: 400 });

    const supabase = createSupabaseAdmin();
    const values = normalizeStaff(body);
    delete (values as any).workspace_id;
    delete (values as any).company_id;

    const { data, error } = await supabase
      .from("crm_staff")
      .update(values)
      .eq("id", body.id)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .select()
      .single();
    if (error) throw error;

    const permissions = Array.isArray(body.permissions)
      ? await savePermissions(supabase, data.id, body.permissions, data.workspace_id, data.company_id)
      : [];

    await supabase.from("crm_audit_logs").insert({
      workspace_id: data.workspace_id || null,
      company_id: data.company_id || null,
      action: "staff_updated",
      resource_type: "crm_staff",
      resource_id: data.id,
      details: "Staff member updated from settings.",
      metadata: { source: "settings_page", permissions_updated: Array.isArray(body.permissions) },
    });

    return NextResponse.json({
      success: true,
      staff: {
        ...data,
        permissions: Array.isArray(body.permissions) ? permissions.map((item: any) => item.permission) : body.permissions,
      },
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
