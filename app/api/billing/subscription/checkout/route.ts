import { NextResponse } from "next/server";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getPlanPriceId, getSubscriptionPlan } from "@/lib/billing/plans";
import { createStripeCustomer, createSubscriptionCheckoutSession, getStripeBillingStatus } from "@/lib/billing/stripe";

async function safeNotify(supabase: any, values: Record<string, any>) {
  await supabase.from("crm_notifications").insert(values).then(() => undefined).catch(() => undefined);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const plan = getSubscriptionPlan(body.plan || body.plan_slug || body.planSlug);
    if (!plan) {
      return NextResponse.json({ success: false, error: "Select a valid SynaptiReach subscription plan." }, { status: 400 });
    }
    const priceId = getPlanPriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        {
          success: false,
          setupRequired: true,
          error: `Stripe price is not configured for ${plan.name}. Set ${plan.stripePriceEnv}.`,
          stripePriceEnv: plan.stripePriceEnv,
        },
        { status: 503 }
      );
    }

    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const workspaceId = body.workspace_id || body.workspaceId || context.workspaceId || null;
    const companyId = body.company_id || body.companyId || context.companyId || null;
    const userId = context.userId || body.user_id || body.userId || null;
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

    let existing = null;
    if (workspaceId || companyId || userId) {
      const billingScope = {
        ...context,
        workspaceId,
        companyId,
        userId,
        isScoped: Boolean(workspaceId || companyId || userId),
      };
      const existingQuery = applyWorkspaceScope(supabase.from("crm_billing_accounts").select("*"), billingScope).limit(1);
      const { data } = await existingQuery.maybeSingle();
      existing = data;
    }

    let customerId = existing?.stripe_customer_id || null;
    if (!customerId && getStripeBillingStatus().configured) {
      const customer = await createStripeCustomer({
        email: body.email || null,
        name: body.name || null,
        workspaceId,
        companyId,
        userId,
      });
      if (customer.success) customerId = customer.customerId;
    }

    const accountValues = {
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      plan_tier: plan.name,
      billing_mode: plan.billingMode,
      status: "checkout_required",
      stripe_customer_id: customerId,
      trial_started_at: existing?.trial_started_at || now.toISOString(),
      trial_ends_at: existing?.trial_ends_at || trialEndsAt,
      metadata: {
        ...(existing?.metadata || {}),
        selected_plan: plan.name,
        plan_slug: plan.slug,
        monthly_price_cents: plan.monthlyPriceCents,
        checkout_disclosure: "After the 14-day trial, the selected plan renews automatically unless canceled before the trial ends.",
        stripe_price_env: plan.stripePriceEnv,
        stripe_configured: getStripeBillingStatus().configured,
        source: "subscription_checkout_request",
      },
    };

    const { data: billingAccount, error: billingError } = existing?.id
      ? await supabase.from("crm_billing_accounts").update(accountValues).eq("id", existing.id).select().single()
      : await supabase.from("crm_billing_accounts").insert(accountValues).select().single();
    if (billingError) throw billingError;

    const stripeSession = await createSubscriptionCheckoutSession({
      priceId,
      planSlug: plan.slug,
      planName: plan.name,
      billingMode: plan.billingMode,
      planTier: plan.tier,
      origin: new URL(request.url).origin,
      customerId,
      billingAccountId: billingAccount.id,
      workspaceId,
      companyId,
      userId,
    });

    const { data: updated, error: updateError } = await supabase
      .from("crm_billing_accounts")
      .update({
        status: stripeSession.success ? "checkout_created" : "checkout_required",
        stripe_customer_id: stripeSession.customerId || customerId,
        metadata: {
          ...(billingAccount.metadata || {}),
          stripe_session_id: stripeSession.success ? stripeSession.sessionId : null,
          setup_required: Boolean(stripeSession.setupRequired),
          setup_error: stripeSession.success ? null : stripeSession.error,
          updated_at: new Date().toISOString(),
        },
      })
      .eq("id", billingAccount.id)
      .select()
      .single();
    if (updateError) throw updateError;

    await safeNotify(supabase, {
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      title: stripeSession.success ? "Subscription checkout created" : "Subscription checkout setup required",
      message: stripeSession.success
        ? `${plan.name} checkout is ready for review in Stripe.`
        : stripeSession.error || "Add Stripe price env vars before subscription checkout can run.",
      type: "billing",
      priority: stripeSession.success ? "normal" : "high",
      status: "unread",
      href: "/dashboard/settings#billing",
      metadata: { source: "subscription_checkout", plan_slug: plan.slug },
    });

    return NextResponse.json({
      success: true,
      billing: updated,
      setupRequired: Boolean(stripeSession.setupRequired),
      checkoutUrl: stripeSession.success ? stripeSession.checkoutUrl : null,
      stripeConfigured: getStripeBillingStatus().configured,
      error: stripeSession.success ? null : stripeSession.error,
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
