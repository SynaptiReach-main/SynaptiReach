import { NextResponse } from "next/server";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";
import { findServiceCatalogItem } from "@/lib/billing/services";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { sendSynaptiReachEmail } from "@/lib/notifications/resend";

async function safeInsert(supabase: any, table: string, values: Record<string, any>) {
  await supabase.from(table).insert(values).then(() => undefined).catch(() => undefined);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const item = findServiceCatalogItem(body.item_name || body.itemName || body.service);
    if (!item) {
      return NextResponse.json({ success: false, error: "Select a valid SynaptiReach service." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const workspaceId = body.workspace_id || body.workspaceId || context.workspaceId || null;
    const companyId = body.company_id || body.companyId || context.companyId || null;
    const userId = context.userId || body.user_id || body.userId || null;

    const { data, error } = await supabase
      .from("crm_service_requests")
      .insert({
        workspace_id: workspaceId,
        company_id: companyId,
        user_id: userId,
        service_type: item.serviceType,
        item_name: item.itemName,
        price_cents: item.priceCents,
        recurring: item.recurring,
        status: "consultation_requested",
        consultation_required: true,
        metadata: {
          source: "dashboard_settings_services",
          category: item.category,
          price_label: item.priceLabel,
          note: "A 30-minute consultation is required before purchase or checkout.",
          message: body.message || null,
        },
      })
      .select()
      .single();
    if (error) throw error;

    const internalEmail = await sendSynaptiReachEmail({
      subject: `New SynaptiReach service request: ${item.itemName}`,
      text: [
        `Service: ${item.itemName}`,
        `Category: ${item.category}`,
        `Price: ${item.priceLabel}`,
        `Recurring: ${item.recurring ? "yes" : "no"}`,
        `Workspace ID: ${workspaceId || "Not provided"}`,
        `Company ID: ${companyId || "Not provided"}`,
        `User ID: ${userId || "Not provided"}`,
        `Submitted: ${new Date().toISOString()}`,
        "",
        String(body.message || ""),
      ].join("\n"),
    });

    await safeInsert(supabase, "crm_notifications", {
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      title: "Service consultation requested",
      message: `${item.itemName} request created. SynaptiReach should review and schedule a consultation.`,
      type: "service",
      priority: "normal",
      status: "unread",
      record_type: "crm_service_requests",
      record_id: data.id,
      href: "/dashboard/settings#services",
      metadata: {
        source: "service_request",
        email_sent: internalEmail.success,
        email_setup_required: internalEmail.setupRequired,
        email_error: internalEmail.error || null,
      },
    });

    await safeInsert(supabase, "crm_audit_logs", {
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      action: "service_consultation_requested",
      resource_type: "crm_service_requests",
      resource_id: data.id,
      details: { item_name: item.itemName, service_type: item.serviceType },
    });

    return NextResponse.json({
      success: true,
      request: data,
      emailSent: internalEmail.success,
      emailSetupRequired: internalEmail.setupRequired,
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
