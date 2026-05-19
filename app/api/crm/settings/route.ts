import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getAIProviderStatus } from "@/lib/ai/providers";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";
import { createCreditPackCheckoutSession, getStripeBillingStatus } from "@/lib/billing/stripe";

const SETTING_FIELDS = [
  "workspace_id",
  "business_name",
  "industry",
  "website",
  "contact_email",
  "phone",
  "default_sender_name",
  "default_sender_email",
  "timezone",
  "brand_voice",
  "tone",
  "cta_style",
  "audience_description",
  "automation_level",
  "metadata",
];

function pickSettings(body: any) {
  return SETTING_FIELDS.reduce((acc: Record<string, any>, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});
}

function encryptSecret(secret: string) {
  const encryptionSource =
    process.env.CRM_SECRET_ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!secret || !encryptionSource) return null;

  const key = crypto.createHash("sha256").update(encryptionSource).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

function keyLabel(secret: string) {
  if (!secret) return null;
  return `•••• ${secret.slice(-4)}`;
}

async function writeAuditLog(supabase: any, input: Record<string, any>) {
  await supabase
    .from("crm_audit_logs")
    .insert({
      workspace_id: input.workspace_id || null,
      company_id: input.company_id || null,
      user_id: input.user_id || null,
      action: input.action,
      resource_type: input.resource_type,
      resource_id: input.resource_id || null,
      details: input.details || {},
    })
    .then(() => undefined)
    .catch(() => undefined);
}

async function saveConnection(supabase: any, input: any) {
  if (!input?.provider) return null;
  const secret = input.secret || input.apiKey || input.value || "";
  const encrypted = secret ? encryptSecret(secret) : null;
  const providerType = input.provider_type || input.providerType || "integration";

  if (secret && !encrypted) {
    throw new Error("Server-side secret encryption is not configured.");
  }

  const values = {
    workspace_id: input.workspace_id || input.workspaceId || null,
    company_id: input.company_id || input.companyId || null,
    user_id: input.user_id || input.userId || null,
    provider: input.provider,
    provider_type: providerType,
    status: secret || input.status === "configured" ? "configured" : input.status || "missing",
    key_label: secret ? keyLabel(secret) : input.key_label || input.keyLabel || null,
    encrypted_secret: encrypted || undefined,
    last_verified_at: secret ? new Date().toISOString() : null,
    metadata: {
      ...(input.metadata || {}),
      model: input.model || undefined,
      source: "settings_page",
      encrypted_at_rest: Boolean(encrypted),
    },
  };

  let existingQuery = supabase
    .from("crm_provider_connections")
    .select("id")
    .eq("provider", input.provider)
    .eq("provider_type", providerType)
    .limit(1);
  if (values.workspace_id) existingQuery = existingQuery.eq("workspace_id", values.workspace_id);

  const { data: existing, error: existingError } = await existingQuery.maybeSingle();

  if (existingError) throw existingError;

  if (existing?.id) {
    const { data, error } = await supabase
      .from("crm_provider_connections")
      .update(values)
      .eq("id", existing.id)
      .select("id,provider,provider_type,status,key_label,last_verified_at,metadata")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("crm_provider_connections")
    .insert(values)
    .select("id,provider,provider_type,status,key_label,last_verified_at,metadata")
    .single();
  if (error) throw error;
  return data;
}

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const aiProviders = getAIProviderStatus();
    const stripe = getStripeBillingStatus();
    const { data, error } = await applyWorkspaceScope(supabase
      .from("crm_settings")
      .select("*")
      , context)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    const [connections, billing, usage, creditPacks] = await Promise.all([
      applyWorkspaceScope(supabase
        .from("crm_provider_connections")
        .select("id,provider,provider_type,status,key_label,last_verified_at,metadata,created_at,updated_at")
        , context)
        .order("updated_at", { ascending: false })
        .limit(100),
      applyWorkspaceScope(supabase
        .from("crm_billing_accounts")
        .select("*")
        , context)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      applyWorkspaceScope(supabase
        .from("crm_usage_events")
        .select("usage_type,quantity,metadata,created_at")
        , context)
        .limit(500),
      applyWorkspaceScope(supabase
        .from("crm_credit_pack_purchases")
        .select("*")
        , context)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    const usageTotals = (usage.data || []).reduce((totals: Record<string, number>, event: any) => {
      const key = event.usage_type || "unknown";
      totals[key] = (totals[key] || 0) + Number(event.quantity || 0);
      return totals;
    }, {});

    return NextResponse.json({
      success: true,
      settings: data || null,
      aiProviders,
      providerConnections: connections.data || [],
      billing: billing.data || null,
      usage: usageTotals,
      creditPackPurchases: creditPacks.data || [],
      integrations: {
        supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        openai: {
          configured: Boolean(process.env.OPENAI_API_KEY),
          enabled: process.env.AI_ENABLE_OPENAI === "true",
          status:
            process.env.AI_ENABLE_OPENAI === "true"
              ? process.env.OPENAI_API_KEY
                ? "configured"
                : "missing"
              : "disabled",
        },
        gemini: {
          configured: Boolean(process.env.GEMINI_API_KEY),
          status: process.env.GEMINI_API_KEY ? "configured" : "missing",
        },
        openrouter: {
          configured: Boolean(process.env.OPENROUTER_API_KEY),
          status: process.env.OPENROUTER_API_KEY ? "configured" : "missing",
          model: aiProviders.openrouter_model,
        },
        resend: Boolean(process.env.RESEND_API_KEY),
        twilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
        ayrshare: Boolean(process.env.AYRSHARE_API_KEY),
        vercelCron: Boolean(process.env.CRON_SECRET || process.env.VERCEL),
        stripe,
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(req);

    if (body.section === "provider_connections") {
      const saved = [];
      for (const connection of body.connections || []) {
        if (connection.secret || connection.apiKey || connection.value) {
          saved.push(await saveConnection(supabase, {
            ...connection,
            workspace_id: connection.workspace_id || connection.workspaceId || context.workspaceId || null,
            company_id: connection.company_id || connection.companyId || context.companyId || null,
            user_id: connection.user_id || connection.userId || context.userId || null,
          }));
          await writeAuditLog(supabase, {
            workspace_id: connection.workspace_id || connection.workspaceId || context.workspaceId || null,
            company_id: connection.company_id || connection.companyId || context.companyId || null,
            user_id: context.userId || null,
            action: "provider_connection_updated",
            resource_type: "crm_provider_connections",
            details: {
              provider: connection.provider,
              provider_type: connection.provider_type || connection.providerType || "integration",
              secret_saved: true,
            },
          });
        }
      }
      return NextResponse.json({ success: true, connections: saved });
    }

    if (body.section === "credit_pack_intent") {
      if (!body.pack) {
        return NextResponse.json({ success: false, error: "Credit pack is required." }, { status: 400 });
      }
      const amountCents = body.price_cents || body.priceCents || null;
      const quantity = body.quantity || 1;
      const workspaceId = body.workspace_id || body.workspaceId || context.workspaceId || null;
      const companyId = body.company_id || body.companyId || context.companyId || null;
      const { data: purchase, error } = await supabase
        .from("crm_credit_pack_purchases")
        .insert({
          workspace_id: workspaceId,
          company_id: companyId,
          user_id: context.userId || null,
          pack_type: body.pack,
          quantity,
          status: "checkout_required",
          price_cents: amountCents,
          metadata: {
            source: "settings_page",
            note: "Credit-pack purchase record created. Payment is pending Stripe Checkout.",
            currency: "usd",
            stripe_configured: getStripeBillingStatus().configured,
          },
        })
        .select()
        .single();
      if (error) throw error;

      const stripeSession = await createCreditPackCheckoutSession({
        packName: body.pack,
        amountCents,
        origin: new URL(req.url).origin,
        purchaseId: purchase.id,
        workspaceId,
        companyId,
        userId: context.userId || null,
        quantity,
      });

      const metadata = {
        ...(purchase.metadata || {}),
        note: stripeSession.success
          ? "Stripe Checkout session created. Purchase is not complete until Stripe confirms payment."
          : stripeSession.error || "Payment provider checkout is not connected yet.",
        stripe_configured: getStripeBillingStatus().configured,
        stripe_session_id: stripeSession.success ? stripeSession.sessionId : undefined,
        purchase_id: purchase.id,
      };

      const { data, error: updateError } = await supabase
        .from("crm_credit_pack_purchases")
        .update({
          status: stripeSession.success ? "checkout_created" : "checkout_required",
          checkout_reference: stripeSession.success ? stripeSession.sessionId : null,
          metadata,
        })
        .eq("id", purchase.id)
        .select()
        .single();
      if (updateError) throw updateError;

      await writeAuditLog(supabase, {
        workspace_id: workspaceId,
        company_id: companyId,
        user_id: context.userId || null,
        action: stripeSession.success ? "stripe_checkout_created" : "credit_pack_checkout_intent_created",
        resource_type: "crm_credit_pack_purchases",
        resource_id: data?.id,
        details: {
          pack: body.pack,
          amount_cents: amountCents,
          stripe_session_created: Boolean(stripeSession.success),
        },
      });
      return NextResponse.json({
        success: true,
        purchase: data,
        setupRequired: Boolean(stripeSession.setupRequired),
        checkoutUrl: stripeSession.success ? stripeSession.checkoutUrl : null,
        stripeConfigured: getStripeBillingStatus().configured,
        error: stripeSession.success ? null : stripeSession.error,
      });
    }

    const values = pickSettings(body);
    values.workspace_id = values.workspace_id || context.workspaceId || null;

    if (body.id) {
      const { data, error } = await supabase
        .from("crm_settings")
        .update(values)
        .eq("id", body.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, settings: data });
    }

    const { data, error } = await supabase
      .from("crm_settings")
      .insert(values)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, settings: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
