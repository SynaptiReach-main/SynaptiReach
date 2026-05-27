import crypto from "crypto";

type CheckoutInput = {
  packName: string;
  amountCents: number | null;
  origin: string;
  purchaseId?: string | null;
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
  quantity?: number | null;
};

type CustomerInput = {
  email?: string | null;
  name?: string | null;
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
};

type PortalInput = {
  customerId: string;
  origin: string;
};

type SubscriptionCheckoutInput = {
  priceId: string;
  planSlug: string;
  planName: string;
  billingMode: string;
  planTier: string;
  origin: string;
  customerId?: string | null;
  billingAccountId?: string | null;
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
  source?: "settings" | "onboarding" | string | null;
};

const STRIPE_API_VERSION = "2026-04-22.dahlia";

export function getStripeBillingStatus() {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  return {
    configured: Boolean(secretKey),
    publishableKeyConfigured: Boolean(publishableKey),
    secretKeyConfigured: Boolean(secretKey),
    webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    mode: secretKey.startsWith("sk_live_") ? "live" : secretKey.startsWith("sk_test_") ? "test" : "not configured",
    checkoutEnabled: Boolean(secretKey),
  };
}

function safeStripeError(status: number, body: any) {
  const code = body?.error?.code || body?.error?.type || "stripe_error";
  const message = body?.error?.message || `Stripe request failed with status ${status}.`;
  return `${code}: ${message}`;
}

async function stripePost(path: string, params: URLSearchParams) {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  if (!secretKey) {
    return {
      ok: false,
      setupRequired: true,
      status: 0,
      body: null,
      error: "Stripe is not configured.",
    };
  }

  let response: Response;
  try {
    response = await fetch(`https://api.stripe.com/v1/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": STRIPE_API_VERSION,
      },
      body: params,
    });
  } catch {
    return {
      ok: false,
      setupRequired: false,
      status: 0,
      body: null,
      error: "Stripe request failed. Verify network access and Stripe test-mode configuration.",
    };
  }

  const body = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    setupRequired: false,
    status: response.status,
    body,
    error: response.ok ? null : safeStripeError(response.status, body),
  };
}

export async function createCreditPackCheckoutSession(input: CheckoutInput) {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  if (!secretKey) {
    return {
      success: false,
      setupRequired: true,
      error: "Stripe checkout is not configured.",
    };
  }

  if (!input.amountCents || input.amountCents < 50) {
    return {
      success: false,
      setupRequired: false,
      error: "A valid credit pack price is required before starting checkout.",
    };
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  const purchaseParam = input.purchaseId ? `&purchase_id=${encodeURIComponent(input.purchaseId)}` : "";
  params.set("success_url", `${input.origin}/dashboard/settings?checkout=success&session_id={CHECKOUT_SESSION_ID}${purchaseParam}`);
  params.set("cancel_url", `${input.origin}/dashboard/settings?checkout=cancelled`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(input.amountCents));
  params.set("line_items[0][price_data][product_data][name]", input.packName);
  params.set("metadata[source]", "synaptireach_settings_credit_pack");
  params.set("metadata[pack_type]", input.packName);
  params.set("metadata[quantity]", String(input.quantity || 1));
  if (input.purchaseId) params.set("metadata[purchase_id]", input.purchaseId);
  if (input.workspaceId) params.set("metadata[workspace_id]", input.workspaceId);
  if (input.companyId) params.set("metadata[company_id]", input.companyId);
  if (input.userId) params.set("metadata[user_id]", input.userId);
  params.set("payment_intent_data[metadata][source]", "synaptireach_settings_credit_pack");
  params.set("payment_intent_data[metadata][pack_type]", input.packName);
  params.set("payment_intent_data[metadata][quantity]", String(input.quantity || 1));
  if (input.purchaseId) params.set("payment_intent_data[metadata][purchase_id]", input.purchaseId);
  if (input.workspaceId) params.set("payment_intent_data[metadata][workspace_id]", input.workspaceId);
  if (input.companyId) params.set("payment_intent_data[metadata][company_id]", input.companyId);
  if (input.userId) params.set("payment_intent_data[metadata][user_id]", input.userId);

  const result = await stripePost("checkout/sessions", params);
  if (!result.ok) {
    return {
      success: false,
      setupRequired: Boolean(result.setupRequired),
      error: result.error,
    };
  }

  return {
    success: true,
    setupRequired: false,
    sessionId: result.body.id as string,
    checkoutUrl: result.body.url as string,
  };
}

export async function createStripeCustomer(input: CustomerInput) {
  const params = new URLSearchParams();
  if (input.email) params.set("email", input.email);
  if (input.name) params.set("name", input.name);
  params.set("metadata[source]", "synaptireach_settings_billing_portal");
  if (input.workspaceId) params.set("metadata[workspace_id]", input.workspaceId);
  if (input.companyId) params.set("metadata[company_id]", input.companyId);
  if (input.userId) params.set("metadata[user_id]", input.userId);

  const result = await stripePost("customers", params);
  return result.ok
    ? { success: true, customerId: result.body.id as string, setupRequired: false, error: null }
    : { success: false, customerId: null, setupRequired: Boolean(result.setupRequired), error: result.error };
}

export async function createBillingPortalSession(input: PortalInput) {
  const params = new URLSearchParams();
  params.set("customer", input.customerId);
  params.set("return_url", `${input.origin}/dashboard/settings?billing_portal=returned`);

  const result = await stripePost("billing_portal/sessions", params);
  return result.ok
    ? { success: true, url: result.body.url as string, setupRequired: false, error: null }
    : { success: false, url: null, setupRequired: Boolean(result.setupRequired), error: result.error };
}

export async function createSubscriptionCheckoutSession(input: SubscriptionCheckoutInput) {
  if (!input.priceId) {
    return {
      success: false,
      setupRequired: true,
      error: "Stripe subscription price is not configured for this plan.",
    };
  }

  const params = new URLSearchParams();
  const source = input.source === "onboarding" ? "onboarding" : "settings";
  const successPath =
    source === "onboarding"
      ? "/onboarding?checkout=success&session_id={CHECKOUT_SESSION_ID}&step=billing"
      : "/dashboard/settings?subscription=success&session_id={CHECKOUT_SESSION_ID}";
  const cancelPath =
    source === "onboarding"
      ? "/onboarding?checkout=cancelled&step=billing"
      : "/dashboard/settings?subscription=cancelled";
  params.set("mode", "subscription");
  params.set("success_url", `${input.origin}${successPath}`);
  params.set("cancel_url", `${input.origin}${cancelPath}`);
  params.set("line_items[0][price]", input.priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("subscription_data[trial_period_days]", "14");
  params.set("subscription_data[metadata][source]", "synaptireach_subscription_checkout");
  params.set("subscription_data[metadata][checkout_origin]", source);
  params.set("subscription_data[metadata][plan_slug]", input.planSlug);
  params.set("subscription_data[metadata][plan_name]", input.planName);
  params.set("subscription_data[metadata][billing_mode]", input.billingMode);
  params.set("subscription_data[metadata][plan_tier]", input.planTier);
  if (input.billingAccountId) params.set("subscription_data[metadata][billing_account_id]", input.billingAccountId);
  if (input.workspaceId) params.set("subscription_data[metadata][workspace_id]", input.workspaceId);
  if (input.companyId) params.set("subscription_data[metadata][company_id]", input.companyId);
  if (input.userId) params.set("subscription_data[metadata][user_id]", input.userId);
  if (input.customerId) params.set("customer", input.customerId);
  params.set("metadata[source]", "synaptireach_subscription_checkout");
  params.set("metadata[checkout_origin]", source);
  params.set("metadata[plan_slug]", input.planSlug);
  params.set("metadata[plan_name]", input.planName);
  params.set("metadata[billing_mode]", input.billingMode);
  params.set("metadata[plan_tier]", input.planTier);
  if (input.billingAccountId) params.set("metadata[billing_account_id]", input.billingAccountId);
  if (input.workspaceId) params.set("metadata[workspace_id]", input.workspaceId);
  if (input.companyId) params.set("metadata[company_id]", input.companyId);
  if (input.userId) params.set("metadata[user_id]", input.userId);

  const result = await stripePost("checkout/sessions", params);
  if (!result.ok) {
    return {
      success: false,
      setupRequired: Boolean(result.setupRequired),
      error: result.error,
    };
  }

  return {
    success: true,
    setupRequired: false,
    sessionId: result.body.id as string,
    checkoutUrl: result.body.url as string,
    customerId: typeof result.body.customer === "string" ? result.body.customer : null,
  };
}

export function verifyStripeWebhookSignature(payload: string, signatureHeader: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!webhookSecret) {
    return {
      verified: false,
      error: "Stripe webhook secret is not configured.",
    };
  }

  if (!signatureHeader) {
    return {
      verified: false,
      error: "Missing Stripe signature header.",
    };
  }

  const parts = signatureHeader.split(",").reduce((acc: Record<string, string[]>, part) => {
    const [key, value] = part.split("=");
    if (!key || !value) return acc;
    acc[key] = [...(acc[key] || []), value];
    return acc;
  }, {});

  const timestamp = parts.t?.[0];
  const signatures = parts.v1 || [];
  if (!timestamp || signatures.length === 0) {
    return {
      verified: false,
      error: "Invalid Stripe signature header.",
    };
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) {
    return {
      verified: false,
      error: "Stripe webhook timestamp is outside the allowed tolerance.",
    };
  }

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const matches = signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature, "hex");
    return signatureBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  });

  return matches
    ? { verified: true, error: null }
    : { verified: false, error: "Stripe webhook signature verification failed." };
}
