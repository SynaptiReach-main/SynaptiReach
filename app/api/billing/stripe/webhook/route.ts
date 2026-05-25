import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { verifyStripeWebhookSignature } from "@/lib/billing/stripe";
import { sendSynaptiReachEmail } from "@/lib/notifications/resend";

const SELECTED_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.expired",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
  "payment_intent.requires_action",
  "customer.created",
  "customer.updated",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "charge.refunded",
  "charge.dispute.created",
]);

function duplicateEvent(error: any) {
  return error?.code === "23505" || /duplicate key/i.test(error?.message || "");
}

function objectMetadata(object: any) {
  return object?.metadata || object?.subscription_details?.metadata || {};
}

async function safeInsert(supabase: any, table: string, values: Record<string, any>) {
  await supabase.from(table).insert(values).then(() => undefined).catch(() => undefined);
}

async function findPurchase(supabase: any, object: any) {
  const metadata = objectMetadata(object);
  const purchaseId = metadata.purchase_id || object?.metadata?.purchase_id;
  const sessionId = object?.id;
  const paymentIntent = typeof object?.payment_intent === "string" ? object.payment_intent : object?.payment_intent?.id;

  if (purchaseId) {
    const { data } = await supabase
      .from("crm_credit_pack_purchases")
      .select("*")
      .eq("id", purchaseId)
      .maybeSingle();
    if (data) return data;
  }

  if (sessionId) {
    const { data } = await supabase
      .from("crm_credit_pack_purchases")
      .select("*")
      .eq("checkout_reference", sessionId)
      .maybeSingle();
    if (data) return data;
  }

  const { data: recent } = await supabase
    .from("crm_credit_pack_purchases")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(250);

  return (recent || []).find((item: any) => {
    const itemMetadata = item.metadata || {};
    return (
      itemMetadata.purchase_id === purchaseId ||
      itemMetadata.stripe_session_id === sessionId ||
      itemMetadata.stripe_payment_intent === paymentIntent
    );
  }) || null;
}

async function updatePurchaseFromStripe(supabase: any, purchase: any, status: string, object: any, event: any) {
  const metadata = {
    ...(purchase.metadata || {}),
    stripe_event_id: event.id,
    stripe_event_type: event.type,
    stripe_session_id: object?.object === "checkout.session" ? object.id : purchase.metadata?.stripe_session_id,
    stripe_payment_intent:
      typeof object?.payment_intent === "string" ? object.payment_intent : object?.payment_intent?.id || purchase.metadata?.stripe_payment_intent,
    stripe_payment_status: object?.payment_status || object?.status || null,
    stripe_customer: typeof object?.customer === "string" ? object.customer : object?.customer?.id || null,
    stripe_amount_total: object?.amount_total || object?.amount || null,
    stripe_currency: object?.currency || "usd",
    webhook_processed_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("crm_credit_pack_purchases")
    .update({
      status,
      checkout_reference: metadata.stripe_session_id || purchase.checkout_reference || null,
      metadata,
    })
    .eq("id", purchase.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function notifyBillingEvent(supabase: any, purchase: any, title: string, message: string, priority = "normal") {
  await safeInsert(supabase, "crm_notifications", {
    workspace_id: purchase?.workspace_id || null,
    company_id: purchase?.company_id || null,
    user_id: purchase?.user_id || null,
    title,
    message,
    type: "billing",
    priority,
    status: "unread",
    record_type: "crm_credit_pack_purchases",
    record_id: purchase?.id || null,
    href: "/dashboard/settings",
    metadata: {
      source: "stripe_webhook",
    },
  });
}

async function sendCreditPackConfirmationEmail(supabase: any, purchase: any) {
  const metadata = purchase?.metadata || {};
  if (metadata.credit_pack_confirmation_email_sent) return { skipped: true, reason: "already_sent" };

  const { data: settings } = purchase?.workspace_id
    ? await supabase
        .from("crm_settings")
        .select("business_name, contact_email")
        .eq("workspace_id", purchase.workspace_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };
  const recipient = settings?.contact_email || metadata.customer_email || null;
  if (!recipient) return { skipped: true, reason: "missing_recipient" };

  const email = await sendSynaptiReachEmail({
    to: recipient,
    subject: `SynaptiReach credit pack confirmed: ${purchase.pack_type}`,
    text: [
      `Credit pack: ${purchase.pack_type}`,
      `Amount: ${purchase.price_cents ? `$${(Number(purchase.price_cents) / 100).toLocaleString()}` : "Not recorded"}`,
      `Quantity: ${purchase.quantity || 1}`,
      `Status: ${purchase.status}`,
      `Business: ${settings?.business_name || "Not provided"}`,
      `Confirmed: ${new Date().toISOString()}`,
      "",
      "Stripe confirmed this payment. SynaptiReach will reflect credits through your billing and usage records. This email does not include card or payment method details.",
    ].join("\n"),
  });

  await supabase
    .from("crm_credit_pack_purchases")
    .update({
      metadata: {
        ...metadata,
        credit_pack_confirmation_email_sent: email.success,
        credit_pack_confirmation_email_attempted_at: new Date().toISOString(),
        credit_pack_confirmation_email_setup_required: email.setupRequired,
        credit_pack_confirmation_email_error: email.error || null,
      },
    })
    .eq("id", purchase.id);

  return email;
}

async function updateBillingAccountFromCustomerObject(supabase: any, object: any, event: any) {
  const metadata = objectMetadata(object);
  const customerId =
    typeof object?.customer === "string" ? object.customer : object?.customer?.id || (object?.object === "customer" ? object.id : null);
  if (!customerId) return null;

  const updates: Record<string, any> = {
    metadata: {
      stripe_last_event_id: event.id,
      stripe_last_event_type: event.type,
      stripe_last_event_at: new Date().toISOString(),
    },
  };

  if (object?.object === "subscription") {
    updates.stripe_subscription_id = object.id;
    updates.status = object.status || "subscription_event";
    updates.trial_ends_at = object.trial_end ? new Date(object.trial_end * 1000).toISOString() : undefined;
    if (object.trial_start) updates.trial_started_at = new Date(object.trial_start * 1000).toISOString();
    if (metadata.plan_name) updates.plan_tier = metadata.plan_name;
    if (metadata.billing_mode) updates.billing_mode = metadata.billing_mode;
  }

  const { data } = await supabase
    .from("crm_billing_accounts")
    .update(updates)
    .eq("stripe_customer_id", customerId)
    .select()
    .limit(1);

  return data?.[0] || null;
}

async function updateSubscriptionCheckout(supabase: any, object: any, event: any) {
  const metadata = objectMetadata(object);
  if (metadata.source !== "synaptireach_subscription_checkout") return null;
  const billingAccountId = metadata.billing_account_id;
  const subscriptionId = typeof object?.subscription === "string" ? object.subscription : object?.subscription?.id || null;
  const customerId = typeof object?.customer === "string" ? object.customer : object?.customer?.id || null;
  const updates = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    plan_tier: metadata.plan_name || null,
    billing_mode: metadata.billing_mode || null,
    status: object?.payment_status === "paid" || subscriptionId ? "trialing" : "checkout_completed",
    metadata: {
      source: "stripe_subscription_checkout_webhook",
      stripe_event_id: event.id,
      stripe_session_id: object.id,
      plan_slug: metadata.plan_slug || null,
      plan_name: metadata.plan_name || null,
      billing_mode: metadata.billing_mode || null,
      checkout_completed_at: new Date().toISOString(),
      review_required: false,
    },
  };

  const query = billingAccountId
    ? supabase.from("crm_billing_accounts").update(updates).eq("id", billingAccountId)
    : supabase.from("crm_billing_accounts").update(updates).eq("stripe_customer_id", customerId);
  const { data } = await query.select().limit(1);
  return data?.[0] || null;
}

export async function POST(request: Request) {
  const payload = await request.text();
  const verification = verifyStripeWebhookSignature(payload, request.headers.get("stripe-signature"));

  if (!verification.verified) {
    return NextResponse.json({ success: false, error: verification.error }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid Stripe webhook payload." }, { status: 400 });
  }

  const object = event.data?.object || {};
  const metadata = objectMetadata(object);
  const supabase = createSupabaseAdmin();

  try {
    const { data: eventRow, error: eventError } = await supabase
      .from("crm_billing_events")
      .insert({
        workspace_id: metadata.workspace_id || null,
        company_id: metadata.company_id || null,
        user_id: metadata.user_id || null,
        stripe_event_id: event.id,
        event_type: event.type,
        status: SELECTED_EVENTS.has(event.type) ? "received" : "ignored",
        resource_type: object.object || null,
        resource_id: object.id || null,
        metadata: {
          source: "stripe_snapshot_webhook",
          livemode: Boolean(event.livemode),
          selected_event: SELECTED_EVENTS.has(event.type),
          stripe_object_status: object.status || object.payment_status || null,
        },
      })
      .select()
      .single();

    if (eventError) {
      if (duplicateEvent(eventError)) return NextResponse.json({ success: true, duplicate: true });
      throw eventError;
    }

    if (!SELECTED_EVENTS.has(event.type)) {
      return NextResponse.json({ success: true, ignored: true, event: eventRow });
    }

    let purchase: any = null;
    let processedStatus = "processed";

    if (event.type === "checkout.session.completed") {
      const subscriptionAccount = await updateSubscriptionCheckout(supabase, object, event);
      purchase = subscriptionAccount ? null : await findPurchase(supabase, object);
      if (purchase) {
        const updated = await updatePurchaseFromStripe(supabase, purchase, "paid", object, event);
        await notifyBillingEvent(supabase, updated, "Credit pack payment completed", `${updated.pack_type} is paid and ready for credit fulfillment.`, "high");
        await sendCreditPackConfirmationEmail(supabase, updated);
        purchase = updated;
      } else if (subscriptionAccount) {
        await safeInsert(supabase, "crm_notifications", {
          workspace_id: subscriptionAccount.workspace_id || metadata.workspace_id || null,
          company_id: subscriptionAccount.company_id || metadata.company_id || null,
          user_id: subscriptionAccount.user_id || metadata.user_id || null,
          title: "Subscription trial started",
          message: `${subscriptionAccount.plan_tier || "Selected plan"} is waiting on Stripe subscription lifecycle confirmation.`,
          type: "billing",
          priority: "normal",
          status: "unread",
          href: "/dashboard/settings#billing",
          metadata: { source: "stripe_webhook", stripe_event_id: event.id },
        });
      }
    } else if (event.type === "checkout.session.expired") {
      purchase = await findPurchase(supabase, object);
      if (purchase) {
        const updated = await updatePurchaseFromStripe(supabase, purchase, "expired", object, event);
        await notifyBillingEvent(supabase, updated, "Credit pack checkout expired", `${updated.pack_type} checkout expired before payment.`, "normal");
        purchase = updated;
      }
    } else if (event.type.startsWith("payment_intent.")) {
      purchase = await findPurchase(supabase, object);
      if (purchase) {
        const statusByType: Record<string, string> = {
          "payment_intent.succeeded": "paid",
          "payment_intent.payment_failed": "payment_failed",
          "payment_intent.canceled": "cancelled",
          "payment_intent.requires_action": "requires_action",
        };
        const updated = await updatePurchaseFromStripe(supabase, purchase, statusByType[event.type] || "payment_review", object, event);
        await notifyBillingEvent(
          supabase,
          updated,
          event.type === "payment_intent.succeeded" ? "Payment succeeded" : "Payment needs review",
          `${updated.pack_type} payment status: ${statusByType[event.type] || "payment_review"}.`,
          event.type === "payment_intent.succeeded" ? "high" : "normal"
        );
        purchase = updated;
      }
    } else if (event.type.startsWith("customer.") || event.type.startsWith("customer.subscription.") || event.type.startsWith("invoice.")) {
      await updateBillingAccountFromCustomerObject(supabase, object, event);
    } else if (event.type === "charge.refunded" || event.type === "charge.dispute.created") {
      await safeInsert(supabase, "crm_notifications", {
        workspace_id: metadata.workspace_id || null,
        company_id: metadata.company_id || null,
        user_id: metadata.user_id || null,
        title: event.type === "charge.refunded" ? "Stripe charge refunded" : "Stripe dispute created",
        message: "Review this Stripe billing event in the Stripe Dashboard.",
        type: "billing",
        priority: event.type === "charge.dispute.created" ? "high" : "normal",
        status: "unread",
        href: "/dashboard/settings",
        metadata: {
          source: "stripe_webhook",
          stripe_event_id: event.id,
          stripe_object_id: object.id || null,
        },
      });
    }

    if (!purchase && ["checkout.session.completed", "checkout.session.expired"].includes(event.type)) {
      processedStatus = "processed_no_matching_purchase";
    }

    await supabase
      .from("crm_billing_events")
      .update({
        status: processedStatus,
        workspace_id: purchase?.workspace_id || metadata.workspace_id || null,
        company_id: purchase?.company_id || metadata.company_id || null,
        user_id: purchase?.user_id || metadata.user_id || null,
        metadata: {
          ...(eventRow.metadata || {}),
          processed_at: new Date().toISOString(),
          purchase_id: purchase?.id || metadata.purchase_id || null,
        },
      })
      .eq("id", eventRow.id);

    await safeInsert(supabase, "crm_audit_logs", {
      workspace_id: purchase?.workspace_id || metadata.workspace_id || null,
      company_id: purchase?.company_id || metadata.company_id || null,
      user_id: purchase?.user_id || metadata.user_id || null,
      action: "stripe_webhook_processed",
      resource_type: "crm_billing_events",
      resource_id: eventRow.id,
      details: {
        stripe_event_id: event.id,
        event_type: event.type,
        purchase_id: purchase?.id || null,
      },
    });

    return NextResponse.json({ success: true, event_id: event.id, status: processedStatus });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
