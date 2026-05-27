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
    const requestedTrialPath = body.trialPath || body.trial_path || null;
    const checkoutOrigin = body.source === "onboarding" || body.return_to === "onboarding" || body.returnTo === "onboarding" ? "onboarding" : "settings";
    if (requestedTrialPath && requestedTrialPath !== plan.billingMode) {
      return NextResponse.json(
        { success: false, error: "Selected post-trial plan must match the chosen trial path." },
        { status: 400 }
      );
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
    const acknowledgements = body.acknowledgements || {};

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
      trial_started_at: existing?.trial_started_at || null,
      trial_ends_at: existing?.trial_ends_at || null,
      metadata: {
        ...(existing?.metadata || {}),
        selected_plan: plan.name,
        plan_slug: plan.slug,
        trial_path: plan.billingMode,
        monthly_price_cents: plan.monthlyPriceCents,
        checkout_disclosure: "After the 14-day trial, the selected plan renews automatically unless canceled before the trial ends.",
        trial_card_required: true,
        stripe_card_acknowledged: Boolean(acknowledgements.stripeCardAcknowledged),
        auto_renew_acknowledged: Boolean(acknowledgements.autoRenewAcknowledged),
        managed_caps_acknowledged: Boolean(acknowledgements.managedCapsAcknowledged),
        byok_provider_cost_acknowledged: Boolean(acknowledgements.byokProviderCostAcknowledged),
        usage_caps: body.usageCaps || existing?.metadata?.usage_caps || {},
        managed_sms_readiness: {
          requested: Boolean(body.managedSms?.requested || existing?.metadata?.managed_sms_readiness?.requested),
          carrier_fee_approval: Boolean(body.managedSms?.carrierFeeApproval || existing?.metadata?.managed_sms_readiness?.carrier_fee_approval),
          setup_fee_approval: Boolean(body.managedSms?.setupFeeApproval || existing?.metadata?.managed_sms_readiness?.setup_fee_approval),
          synaptireach_setup_fee_cents: 2000,
          status:
            (body.managedSms?.requested || existing?.metadata?.managed_sms_readiness?.requested) &&
            (body.managedSms?.carrierFeeApproval || existing?.metadata?.managed_sms_readiness?.carrier_fee_approval) &&
            (body.managedSms?.setupFeeApproval || existing?.metadata?.managed_sms_readiness?.setup_fee_approval)
              ? "approval_ready"
              : (body.managedSms?.requested || existing?.metadata?.managed_sms_readiness?.requested)
                ? "approval_required"
                : "not_requested",
        },
        post_trial_plan_fit: {
          selected_plan: plan.name,
          selected_tier: plan.tier,
          downgrade_note:
            "Trial feature access can be broader than the selected post-trial tier. Existing data is not deleted; future usage beyond the selected plan cap is restricted until upgrade or eligible capacity is added.",
        },
        stripe_price_env: plan.stripePriceEnv,
        stripe_configured: getStripeBillingStatus().configured,
        source: "subscription_checkout_request",
        checkout_origin: checkoutOrigin,
        payment_state_note:
          "Checkout creation does not mark a paid, subscribed, or trialing state. Stripe webhook confirmation owns trial and subscription state.",
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
      source: checkoutOrigin,
    });

    const { data: updated, error: updateError } = await supabase
      .from("crm_billing_accounts")
      .update({
        status: stripeSession.success ? "checkout_created" : "checkout_required",
        stripe_customer_id: stripeSession.customerId || customerId,
        metadata: {
          ...(billingAccount.metadata || {}),
          stripe_session_id: stripeSession.success ? stripeSession.sessionId : null,
          checkout_origin: checkoutOrigin,
          checkout_submitted_at: stripeSession.success ? new Date().toISOString() : billingAccount.metadata?.checkout_submitted_at || null,
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
      href: checkoutOrigin === "onboarding" ? "/onboarding?step=billing" : "/dashboard/settings#billing",
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
