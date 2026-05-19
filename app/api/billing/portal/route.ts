import { NextResponse } from "next/server";
import { createBillingPortalSession, createStripeCustomer, getStripeBillingStatus } from "@/lib/billing/stripe";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const stripe = getStripeBillingStatus();
    if (!stripe.configured) {
      return NextResponse.json({
        success: false,
        setupRequired: true,
        error: "Stripe is not configured. Add STRIPE_SECRET_KEY and redeploy before opening the Billing Portal.",
      });
    }

    const context = await getWorkspaceContext(request);
    const supabase = createSupabaseAdmin();

    const { data: billing, error: billingError } = await applyWorkspaceScope(
      supabase.from("crm_billing_accounts").select("*"),
      context
    )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (billingError) throw billingError;

    const { data: settings, error: settingsError } = await applyWorkspaceScope(
      supabase.from("crm_settings").select("business_name,contact_email"),
      context
    )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (settingsError) throw settingsError;

    let customerId = billing?.stripe_customer_id || billing?.metadata?.stripe_customer_id || null;
    if (!customerId) {
      const customer = await createStripeCustomer({
        email: settings?.contact_email || null,
        name: settings?.business_name || null,
        workspaceId: context.workspaceId,
        companyId: context.companyId,
        userId: context.userId,
      });

      if (!customer.success || !customer.customerId) {
        return NextResponse.json({
          success: false,
          setupRequired: Boolean(customer.setupRequired),
          error: customer.error || "Could not create a Stripe customer for this workspace.",
        });
      }

      customerId = customer.customerId;
      if (billing?.id) {
        await supabase
          .from("crm_billing_accounts")
          .update({
            stripe_customer_id: customerId,
            metadata: {
              ...(billing.metadata || {}),
              stripe_customer_created_from: "billing_portal_route",
            },
          })
          .eq("id", billing.id);
      } else {
        await supabase.from("crm_billing_accounts").insert({
          workspace_id: context.workspaceId || null,
          company_id: context.companyId || null,
          user_id: context.userId || null,
          status: "setup_required",
          stripe_customer_id: customerId,
          metadata: {
            stripe_customer_created_from: "billing_portal_route",
          },
        });
      }
    }

    const portal = await createBillingPortalSession({
      customerId,
      origin: new URL(request.url).origin,
    });

    if (!portal.success || !portal.url) {
      return NextResponse.json({
        success: false,
        setupRequired: Boolean(portal.setupRequired),
        error: portal.error || "Could not create a Stripe Billing Portal session.",
      });
    }

    return NextResponse.json({
      success: true,
      url: portal.url,
      stripeMode: stripe.mode,
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
