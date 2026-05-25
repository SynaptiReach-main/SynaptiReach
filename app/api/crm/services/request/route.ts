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
    const requestedItems = Array.isArray(body.items)
      ? body.items
      : Array.isArray(body.selected_items)
        ? body.selected_items
        : [body.item_name || body.itemName || body.service].filter(Boolean);
    const items = requestedItems
      .map((entry: any) => findServiceCatalogItem(typeof entry === "string" ? entry : entry?.item_name || entry?.itemName || entry?.name))
      .filter(Boolean);
    if (items.length === 0) {
      return NextResponse.json({ success: false, error: "Select a valid SynaptiReach service." }, { status: 400 });
    }
    const item = items[0] as NonNullable<ReturnType<typeof findServiceCatalogItem>>;
    const multi = items.length > 1;
    const oneTimeTotal = items.filter((entry: any) => !entry.recurring).reduce((sum: number, entry: any) => sum + Number(entry.priceCents || 0), 0);
    const monthlyTotal = items.filter((entry: any) => entry.recurring).reduce((sum: number, entry: any) => sum + Number(entry.priceCents || 0), 0);

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
        service_type: multi ? "bundle" : item.serviceType,
        item_name: multi ? "Multiple services selected" : item.itemName,
        price_cents: oneTimeTotal + monthlyTotal,
        recurring: items.some((entry: any) => entry.recurring),
        status: "consultation_requested",
        consultation_required: true,
        metadata: {
          source: "dashboard_settings_services",
          category: multi ? "Multiple categories" : item.category,
          price_label: multi ? "Mixed pricing" : item.priceLabel,
          selected_items: items.map((entry: any) => ({
            service_type: entry.serviceType,
            category: entry.category,
            item_name: entry.itemName,
            price_cents: entry.priceCents,
            price_label: entry.priceLabel,
            recurring: entry.recurring,
          })),
          one_time_total_cents: oneTimeTotal,
          monthly_total_cents: monthlyTotal,
          note: "A 30-minute consultation is required before purchase or checkout.",
          message: body.message || null,
          requested_timeline: body.requested_timeline || body.requestedTimeline || null,
        },
      })
      .select()
      .single();
    if (error) throw error;

    const internalEmail = await sendSynaptiReachEmail({
      subject: `New SynaptiReach service request: ${multi ? "Multiple services selected" : item.itemName}`,
      text: [
        "Selected services:",
        ...items.map((entry: any) => `- ${entry.itemName} | ${entry.category} | ${entry.priceLabel} | ${entry.recurring ? "monthly" : "one-time"}`),
        `One-time total: $${(oneTimeTotal / 100).toLocaleString()}`,
        `Monthly total: $${(monthlyTotal / 100).toLocaleString()}/mo`,
        `Workspace ID: ${workspaceId || "Not provided"}`,
        `Company ID: ${companyId || "Not provided"}`,
        `User ID: ${userId || "Not provided"}`,
        `Requested timeline: ${body.requested_timeline || body.requestedTimeline || "Not provided"}`,
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
      message: `${multi ? `${items.length} selected services` : item.itemName} request created. SynaptiReach should review and schedule a consultation.`,
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
      details: { item_name: multi ? "Multiple services selected" : item.itemName, service_type: multi ? "multiple" : item.serviceType, selected_count: items.length },
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
