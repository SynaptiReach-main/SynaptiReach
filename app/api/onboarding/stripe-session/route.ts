import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { retrieveStripeCheckoutSession } from "@/lib/billing/stripe";
import { getOnboardingUser } from "@/lib/onboarding/server";

export async function POST(request: Request) {
  try {
    const user = await getOnboardingUser(request);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const sessionId = String(body.session_id || "");
    const supabase = createSupabaseAdmin();
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (workspaceError) throw workspaceError;
    if (!workspace?.id) return NextResponse.json({ success: false, error: "Save onboarding before checking Stripe status." }, { status: 409 });

    const { data: billing, error: billingError } = await supabase
      .from("crm_billing_accounts")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (billingError) throw billingError;
    if (!billing?.id) return NextResponse.json({ success: false, error: "No onboarding billing record found." }, { status: 404 });

    const expected = billing.metadata?.stripe_session_id || billing.metadata?.checkout_session_id;
    if (!sessionId || (expected && expected !== sessionId)) {
      return NextResponse.json({ success: false, error: "Stripe session does not match this workspace." }, { status: 403 });
    }

    const stripe = await retrieveStripeCheckoutSession(sessionId);
    if (!stripe.success) {
      return NextResponse.json(stripe, { status: stripe.setupRequired ? 503 : 502 });
    }

    const webhookOwnedStatuses = new Set(["trialing", "active", "past_due", "canceled", "unpaid", "checkout_completed"]);
    await supabase
      .from("crm_billing_accounts")
      .update({
        status: webhookOwnedStatuses.has(billing.status) ? billing.status : billing.status || "pending_webhook",
        metadata: {
          ...(billing.metadata || {}),
          stripe_session_check: {
            checked_at: new Date().toISOString(),
            ...stripe.session,
            note: "Manual refresh records Stripe Checkout session status only. Subscription activation still belongs to the Stripe webhook.",
          },
        },
      })
      .eq("id", billing.id);

    return NextResponse.json({ success: true, stripeSession: stripe.session });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
