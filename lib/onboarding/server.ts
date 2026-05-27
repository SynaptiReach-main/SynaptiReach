import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/crm/supabaseAdmin";
import { getAIProviderStatus } from "@/lib/ai/providers";
import { getStripeBillingStatus } from "@/lib/billing/stripe";
import { DFY_ASSISTANCE_OPTIONS, getPlanPriceId, getSubscriptionPlan } from "@/lib/billing/plans";
import { importLeadRows } from "@/lib/crm/importLeadsCsv";

type SaveInput = {
  payload?: Record<string, any>;
  completedSteps?: string[];
  currentStep?: string;
  skippedSteps?: Record<string, boolean>;
  leadRows?: Record<string, any>[];
  importFileName?: string | null;
  complete?: boolean;
};

const SECRET_FIELDS = new Set([
  "openaiKey",
  "geminiKey",
  "openrouterKey",
  "anthropicKey",
  "resendApiKey",
  "twilioAuthToken",
  "twilioAccountSid",
  "ayrshareApiKey",
  "taxIdLast4",
]);

function isValidHttpUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitize(value: any): any {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (SECRET_FIELDS.has(key)) {
        return [key, item ? "__saved_server_side__" : ""];
      }
      return [key, sanitize(item)];
    })
  );
}

function encryptSecret(secret: string) {
  const source =
    process.env.CRM_SECRET_ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!secret || !source) return null;
  const key = crypto.createHash("sha256").update(source).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

function keyLabel(secret: string) {
  return secret ? `.... ${secret.slice(-4)}` : null;
}

function listFromText(value?: string) {
  return String(value || "")
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const workflowDraftTemplates: Record<string, { name: string; trigger: string; condition: string; action: string; what: string; why: string }> = {
  new_lead_followup: {
    name: "New lead follow-up draft",
    trigger: "lead_created",
    condition: "A new lead is created and has not been contacted.",
    action: "Create a review-gated follow-up task and draft message.",
    what: "Prepares fast first-touch follow-up for new inquiries.",
    why: "External messages need human review so tone, consent, and offer details are correct.",
  },
  stale_deal_followup: {
    name: "Stale deal follow-up draft",
    trigger: "deal_stage_stale",
    condition: "A deal has not moved stages within the expected sales-process window.",
    action: "Create an internal task to review the deal and update the next step.",
    what: "Flags opportunities that may need owner attention.",
    why: "Pipeline status changes and outreach should be reviewed before action.",
  },
  appointment_reminder: {
    name: "Appointment reminder draft",
    trigger: "appointment_upcoming",
    condition: "An appointment is upcoming and reminder setup is allowed.",
    action: "Create an internal reminder. External SMS/email remains review-gated.",
    what: "Prepares reminder tasks around upcoming appointments.",
    why: "Timing, channel consent, and customer details must be checked first.",
  },
  opened_not_clicked: {
    name: "Opened-not-clicked follow-up draft",
    trigger: "campaign_open_no_click",
    condition: "A lead opened a campaign but did not click.",
    action: "Draft a follow-up task or message for review.",
    what: "Surfaces warm campaign engagement for follow-up.",
    why: "Campaign follow-up remains review-gated to avoid unwanted outreach.",
  },
  missed_response: {
    name: "Unread inbound response draft",
    trigger: "communication_unread",
    condition: "An inbound customer response remains unread.",
    action: "Create a high-priority follow-up task.",
    what: "Keeps inbound replies from being missed.",
    why: "Responses may contain sensitive context and should be reviewed by a person.",
  },
  review_request: {
    name: "Post-service review request draft",
    trigger: "service_completed",
    condition: "A customer reaches the post-service stage.",
    action: "Draft a review request for manual approval.",
    what: "Prepares a review request after service completion.",
    why: "Review asks should be sent only after confirming the job outcome.",
  },
  missed_call_followup: {
    name: "Missed call follow-up draft",
    trigger: "missed_call",
    condition: "A missed call is recorded and no follow-up exists.",
    action: "Create a callback task and draft a follow-up message.",
    what: "Captures phone leads that did not become conversations.",
    why: "Phone context and consent should be checked before messaging.",
  },
  quote_sent_followup: {
    name: "Quote sent follow-up draft",
    trigger: "quote_sent",
    condition: "A quote was sent and no response is recorded after the review window.",
    action: "Create a quote follow-up task.",
    what: "Keeps quoted opportunities moving.",
    why: "Pricing and quote details must be reviewed before outreach.",
  },
  estimate_reminder: {
    name: "Estimate reminder draft",
    trigger: "estimate_pending",
    condition: "An estimate is pending and the appointment window is approaching.",
    action: "Create an estimate reminder task.",
    what: "Prepares internal reminders for estimate-related work.",
    why: "Customer timing and service details should be confirmed first.",
  },
  no_show_recovery: {
    name: "No-show recovery draft",
    trigger: "appointment_no_show",
    condition: "An appointment is marked no-show and recovery is allowed.",
    action: "Draft a reschedule task or message for approval.",
    what: "Helps recover missed appointments.",
    why: "No-show follow-up can be sensitive and must stay human-reviewed.",
  },
  completed_appointment_review: {
    name: "Completed appointment review request draft",
    trigger: "appointment_completed",
    condition: "An appointment is completed and review request policy allows a draft.",
    action: "Create a review request draft.",
    what: "Prepares review asks after completed appointments.",
    why: "Review requests must only follow confirmed completed work.",
  },
  referral_request_won: {
    name: "Won customer referral request draft",
    trigger: "deal_won",
    condition: "A customer converts and referral timing is appropriate.",
    action: "Draft a referral request task.",
    what: "Creates a reviewable referral ask after conversion.",
    why: "Relationship context should be checked before asking for referrals.",
  },
  payment_checkpoint_reminder: {
    name: "Payment checkpoint reminder draft",
    trigger: "payment_checkpoint_due",
    condition: "A payment or project checkpoint is approaching.",
    action: "Create an internal billing checkpoint task.",
    what: "Flags payment or milestone follow-up for review.",
    why: "Billing communication requires extra care and Stripe/webhook state stays authoritative.",
  },
  cold_lead_reactivation: {
    name: "Cold lead reactivation draft",
    trigger: "lead_cold",
    condition: "A cold lead has been inactive beyond the selected window.",
    action: "Draft a reactivation task or campaign idea.",
    what: "Prepares safe re-engagement for older leads.",
    why: "Reactivation requires consent and relevance review.",
  },
  high_intent_inquiry_alert: {
    name: "High-intent website inquiry alert draft",
    trigger: "website_inquiry_high_intent",
    condition: "A website inquiry includes high-intent buying or booking signals.",
    action: "Create a high-priority owner alert.",
    what: "Alerts the team to urgent website inquiries.",
    why: "Scoring should inform action, not auto-send without review.",
  },
  new_lead_owner_assignment: {
    name: "New lead owner assignment draft",
    trigger: "lead_created",
    condition: "A new lead has no owner and assignment rules are available.",
    action: "Suggest an owner assignment task.",
    what: "Prepares owner assignment suggestions.",
    why: "Staff assignment should be reviewed against capacity and permissions.",
  },
  trial_usage_cap_warning: {
    name: "Trial usage cap warning draft",
    trigger: "usage_cap_threshold",
    condition: "Trial usage approaches a configured cap.",
    action: "Create an internal billing and usage review task.",
    what: "Warns owners before managed trial caps are reached.",
    why: "Billing and cap responses should be reviewed before purchase or upgrade action.",
  },
  campaign_reply_triage: {
    name: "Campaign reply triage draft",
    trigger: "campaign_reply_received",
    condition: "A reply arrives from a campaign audience member.",
    action: "Create a reply triage task.",
    what: "Routes campaign replies for review.",
    why: "Replies can include objections, opt-outs, or support needs.",
  },
  upsell_cross_sell_followup: {
    name: "Upsell/cross-sell follow-up draft",
    trigger: "customer_eligible_for_offer",
    condition: "A customer appears eligible for a relevant next service.",
    action: "Draft an internal offer review task.",
    what: "Prepares expansion opportunities for existing customers.",
    why: "Offers must match customer history and avoid pushy outreach.",
  },
  dormant_customer_winback: {
    name: "Dormant customer winback draft",
    trigger: "customer_dormant",
    condition: "A past customer has no recent activity and winback is allowed.",
    action: "Draft a winback task or campaign idea.",
    what: "Prepares dormant customer reactivation.",
    why: "Winback messaging requires consent and relevance review.",
  },
  vip_lead_escalation: {
    name: "VIP/high-value lead escalation draft",
    trigger: "lead_value_high",
    condition: "A lead is tagged VIP or exceeds the configured value threshold.",
    action: "Create an escalation task for the owner.",
    what: "Highlights high-value leads for fast owner review.",
    why: "Escalation affects team priority and should be confirmed.",
  },
};

function priceCentsFromLabel(price: string) {
  if (price.toLowerCase().includes("free")) return 0;
  const match = price.match(/\$([0-9,]+)/);
  return match ? Number(match[1].replace(/,/g, "")) * 100 : 0;
}

export async function getOnboardingUser(request: Request) {
  try {
    const server = await createServerSupabase();
    const {
      data: { user },
    } = await server.auth.getUser();
    if (user) return user;
  } catch {
    // Fall through to bearer-token auth for client-side onboarding saves.
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : "";

  if (
    !token ||
    !isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user || null;
}

async function ensureWorkspace(supabase: any, user: any, payload: Record<string, any>) {
  const profile = payload.businessProfile || {};
  const businessType = payload.businessType || null;
  const selectedPlan = getSubscriptionPlan(payload.plan?.planSlug);
  const workspaceName =
    profile.businessName?.trim() ||
    user.email?.split("@")[0] ||
    "SynaptiReach Workspace";

  const { data: existing, error: existingError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  if (existing?.id) {
    const updateValues: Record<string, any> = {
      name: workspaceName,
      industry: profile.industry || existing.industry || null,
      business_type: businessType || existing.business_type || null,
      plan_tier: selectedPlan?.tier || existing.plan_tier || null,
      billing_mode: selectedPlan?.billingMode || existing.billing_mode || null,
    };
    const { data, error } = await supabase
      .from("workspaces")
      .update(updateValues)
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      owner_id: user.id,
      name: workspaceName,
      industry: profile.industry || null,
      business_type: businessType || null,
      plan_tier: selectedPlan?.tier || null,
      billing_mode: selectedPlan?.billingMode || null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function ensureMembership(supabase: any, workspaceId: string, userId: string) {
  const { data } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  if (data?.id) return;

  await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      role: "owner",
      status: "active",
      metadata: { source: "onboarding" },
    })
    .then(() => undefined)
    .catch(() => undefined);
}

async function upsertSession(supabase: any, input: any) {
  const { data: existing, error: existingError } = await supabase
    .from("onboarding_sessions")
    .select("*")
    .eq("workspace_id", input.workspace_id)
    .eq("user_id", input.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  function valuesFor(options: { metadata: boolean; updatedAt: boolean }) {
    return {
      workspace_id: input.workspace_id,
      user_id: input.user_id,
      payload: input.payload,
      completed: Boolean(input.completed),
      ...(options.metadata ? { metadata: input.metadata } : {}),
      ...(options.updatedAt ? { updated_at: new Date().toISOString() } : {}),
    };
  }

  async function writeSession(values: Record<string, any>) {
    if (existing?.id) {
      return supabase
        .from("onboarding_sessions")
        .update(values)
        .eq("id", existing.id)
        .select("*")
        .single();
    }
    return supabase
      .from("onboarding_sessions")
      .insert(values)
      .select("*")
      .single();
  }

  const attempts = [
    valuesFor({ metadata: true, updatedAt: true }),
    valuesFor({ metadata: false, updatedAt: true }),
    valuesFor({ metadata: false, updatedAt: false }),
  ];

  let lastError = null;
  for (const values of attempts) {
    const result = await writeSession(values);
    if (!result.error) return result.data;
    lastError = result.error;
    const message = `${result.error.message || ""} ${result.error.details || ""}`;
    if (!/metadata|updated_at|schema cache|column/i.test(message)) break;
  }

  if (lastError) throw lastError;
  throw new Error("Onboarding session save failed.");
}

async function upsertSettings(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const owner = payload.owner || {};
  const profile = payload.businessProfile || {};
  const automation = payload.automation || {};
  const ai = payload.ai || {};
  const integrations = payload.integrations || {};
  const crmSetup = payload.crmSetup || {};
  const marketing = payload.marketing || {};
  const workflows = payload.workflows || {};
  const help = payload.help || {};

  const values = {
    workspace_id: workspace.id,
    company_id: workspace.company_id || null,
    user_id: user.id,
    business_name: profile.businessName || workspace.name || null,
    industry: profile.industry || workspace.industry || null,
    website: profile.website || null,
    contact_email: profile.contactEmail || user.email || null,
    phone: profile.phone || null,
    timezone: profile.timezone || "America/Chicago",
    brand_voice: ai.brandVoice || profile.brandVoice || null,
    tone: ai.tone || "professional",
    cta_style: profile.preferredCta || null,
    audience_description: profile.targetCustomer || profile.audience || null,
    automation_level: automation.requireApproval === false ? "assisted" : "review_required",
    metadata: {
      source: "onboarding",
      business_type: payload.businessType || null,
      owner: {
        name: owner.name || null,
        email: owner.email || user.email || null,
        phone: owner.phone || null,
        role: owner.role || "Owner",
      },
      legal_profile: {
        legal_name: profile.legalName || null,
        tax_id_last4_present: Boolean(profile.taxIdLast4),
        reviewed: Boolean(profile.legalReviewed),
        review_status: profile.legalReviewed ? "reviewed" : "pending_review",
      },
      address: profile.address || null,
      team_size: profile.teamSize || null,
      service_type: profile.serviceType || null,
      products_services: profile.productsServices || null,
      target_customer: profile.targetCustomer || profile.audience || null,
      main_offer: profile.mainOffer || null,
      preferred_cta: profile.preferredCta || null,
      sales_process: crmSetup.salesProcess || profile.salesProcess || null,
      pipeline_stages: listFromText(crmSetup.pipelineStages),
      lead_statuses: listFromText(crmSetup.leadStatuses),
      lead_sources: listFromText(crmSetup.leadSources),
      lead_tags: listFromText(crmSetup.leadTags),
      marketing_setup: {
        goals: marketing.goals || [],
        channels: marketing.channels || [],
        strategy: marketing.strategy || null,
        first_campaign_idea: marketing.firstCampaignIdea || null,
        notification_preferences: marketing.notificationPreferences || [],
      },
      workflow_setup: {
        recommended: workflows.recommended || [],
        create_drafts: Boolean(workflows.createDrafts),
        notes: workflows.notes || null,
      },
      help_setup: {
        mode: help.mode || "self_guided",
        requested_services: help.requestedServices || [],
        guided_call_requested: Boolean(help.guidedCallRequested),
        notes: help.notes || null,
        pricing_rule: "Free guidance when the user performs setup; paid DFY when SynaptiReach performs setup.",
      },
      ai_behavior: {
        assistant_behavior: ai.assistantBehavior || null,
        intelligence_preference: ai.intelligencePreference || "balanced",
        rule_based_first: ai.useRuleBasedFirst !== false,
        provider_order: "Gemini first, OpenRouter fallback, OpenAI only if enabled.",
      },
      automation_policy: {
        approval_required: automation.requireApproval !== false,
        allow_auto_assign: Boolean(automation.allowAutoAssign),
        quiet_hours_enabled: Boolean(automation.quietHoursEnabled),
        quiet_hours_start: automation.quietHoursStart || null,
        quiet_hours_end: automation.quietHoursEnd || null,
        sms_compliance_acknowledged: Boolean(automation.smsComplianceAck),
        no_auto_send_acknowledged: Boolean(automation.noAutoSendAck),
      },
      integration_preferences: {
        email: integrations.emailMode || "later",
        email_reviewed: Boolean(integrations.emailReviewed || integrations.emailMode),
        email_review_choice: integrations.emailReviewChoice || integrations.emailMode || "later",
        sms: integrations.smsMode || "later",
        sms_reviewed: Boolean(integrations.smsReviewed || integrations.smsMode),
        sms_review_choice: integrations.smsReviewChoice || integrations.smsMode || "later",
        social: integrations.socialMode || "later",
        calendar: integrations.calendarMode || "later",
        calendar_required_for_launch: Boolean(integrations.calendarRequiredForLaunch),
        calendar_reviewed: Boolean(integrations.calendarMode),
      },
      service_menu: payload.serviceMenu || {},
    },
  };

  const { data: existing, error: existingError } = await supabase
    .from("crm_settings")
    .select("id,metadata")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  values.metadata = { ...(existing?.metadata || {}), ...values.metadata };

  const result = existing?.id
    ? await supabase.from("crm_settings").update(values).eq("id", existing.id).select("*").single()
    : await supabase.from("crm_settings").insert(values).select("*").single();
  if (result.error) throw result.error;
  return result.data;
}

async function upsertBilling(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const plan = getSubscriptionPlan(payload.plan?.planSlug);
  if (!plan) return null;

  const billingIntent = payload.plan?.billingIntent || "start_trial";
  const stripeReady = Boolean(getStripeBillingStatus().configured && getPlanPriceId(plan));

  const { data: existing, error: existingError } = await supabase
    .from("crm_billing_accounts")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  const webhookOwnedStatuses = new Set(["trialing", "active", "past_due", "canceled", "unpaid", "checkout_completed"]);
  const checkoutSessionId = payload.plan?.checkoutSessionId || existing?.metadata?.stripe_session_id || null;
  const status = webhookOwnedStatuses.has(existing?.status)
    ? existing.status
    : checkoutSessionId || billingIntent === "checkout_started"
      ? "pending_webhook"
      : billingIntent === "checkout_now" || billingIntent === "start_trial"
        ? stripeReady ? "checkout_required" : "setup_required"
        : "setup_required";

  const values = {
    workspace_id: workspace.id,
    company_id: workspace.company_id || null,
    user_id: user.id,
    plan_tier: plan.name,
    billing_mode: plan.billingMode,
    status,
    trial_started_at: existing?.trial_started_at || null,
    trial_ends_at: existing?.trial_ends_at || null,
    metadata: {
      ...(existing?.metadata || {}),
      selected_plan: plan.name,
      plan_slug: plan.slug,
      trial_path: payload.plan?.trialPath || plan.billingMode,
      trial_card_required: true,
      stripe_card_acknowledged: Boolean(payload.plan?.stripeCardAcknowledged),
      auto_renew_acknowledged: Boolean(payload.plan?.autoRenewAcknowledged),
      managed_caps_acknowledged: Boolean(payload.plan?.managedCapsAcknowledged),
      byok_provider_cost_acknowledged: Boolean(payload.plan?.byokProviderCostAcknowledged),
      usage_caps: payload.plan?.usageCaps || {},
      managed_sms_readiness: {
        requested: Boolean(payload.plan?.managedSms?.requested),
        carrier_fee_approval: Boolean(payload.plan?.managedSms?.carrierFeeApproval),
        setup_fee_approval: Boolean(payload.plan?.managedSms?.setupFeeApproval),
        synaptireach_setup_fee_cents: 2000,
        status:
          payload.plan?.managedSms?.requested && payload.plan?.managedSms?.carrierFeeApproval && payload.plan?.managedSms?.setupFeeApproval
            ? "approval_ready"
            : payload.plan?.managedSms?.requested
              ? "approval_required"
              : "not_requested",
      },
      post_trial_plan_fit: {
        selected_plan: plan.name,
        selected_tier: plan.tier,
        downgrade_note:
          "Trial feature access can be broader than the selected post-trial tier. Existing data is not deleted; future usage beyond the selected plan cap is restricted until upgrade or eligible capacity is added.",
      },
      billing_intent: billingIntent,
      checkout_session_id: checkoutSessionId,
      stripe_session_id: checkoutSessionId,
      checkout_submitted_at: checkoutSessionId ? existing?.metadata?.checkout_submitted_at || new Date().toISOString() : existing?.metadata?.checkout_submitted_at || null,
      checkout_return_state: payload.plan?.checkoutReturnState || existing?.metadata?.checkout_return_state || null,
      source: "onboarding",
      stripe_configured: getStripeBillingStatus().configured,
      stripe_price_configured: Boolean(getPlanPriceId(plan)),
      payment_state_note:
        "Onboarding records plan intent only. Paid or active subscription state must come from Stripe Checkout/webhook confirmation.",
    },
  };

  const result = existing?.id
    ? await supabase.from("crm_billing_accounts").update(values).eq("id", existing.id).select("*").single()
    : await supabase.from("crm_billing_accounts").insert(values).select("*").single();
  if (result.error) throw result.error;
  return result.data;
}

async function upsertConnection(supabase: any, workspace: any, user: any, input: any) {
  if (!input.provider) return null;
  const secret = input.secret || "";
  const encrypted = secret ? encryptSecret(secret) : null;
  if (secret && !encrypted) throw new Error("Server-side secret encryption is not configured.");

  const providerType = input.provider_type || "integration";
  const status = input.status || (secret ? "configured" : "pending");
  const values = {
    workspace_id: workspace.id,
    company_id: workspace.company_id || null,
    user_id: user.id,
    provider: input.provider,
    provider_type: providerType,
    status,
    key_label: secret ? keyLabel(secret) : input.key_label || null,
    encrypted_secret: encrypted || undefined,
    last_verified_at: secret ? new Date().toISOString() : null,
    metadata: {
      ...(input.metadata || {}),
      source: "onboarding",
      encrypted_at_rest: Boolean(encrypted),
      setup_state: status,
    },
  };

  const { data: existing, error: existingError } = await supabase
    .from("crm_provider_connections")
    .select("id")
    .eq("workspace_id", workspace.id)
    .eq("provider", input.provider)
    .eq("provider_type", providerType)
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  const result = existing?.id
    ? await supabase.from("crm_provider_connections").update(values).eq("id", existing.id).select("*").single()
    : await supabase.from("crm_provider_connections").insert(values).select("*").single();
  if (result.error) throw result.error;
  return result.data;
}

async function saveProviderSetup(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const ai = payload.ai || {};
  const integrations = payload.integrations || {};
  const saves = [];
  const emailChoice = integrations.emailReviewChoice || integrations.emailMode;
  const smsChoice = integrations.smsReviewChoice || integrations.smsMode;
  const normalizedEmailMode =
    emailChoice === "setup_now" ? integrations.emailMode || "byok" : emailChoice === "not_using" ? "skip" : emailChoice === "managed_later" ? "managed" : emailChoice === "byok_later" ? "byok" : integrations.emailMode;
  const normalizedSmsMode =
    smsChoice === "setup_now" ? integrations.smsMode || "byok" : smsChoice === "not_using" ? "skip" : smsChoice === "managed_later" ? "managed" : smsChoice === "byok_later" ? "byok" : integrations.smsMode;

  if (ai.mode) {
    const aiSecret = ai.openaiKey || ai.geminiKey || ai.openrouterKey || ai.anthropicKey || "";
    const openAiAllowed = process.env.AI_ENABLE_OPENAI === "true";
    const provider = ai.mode === "managed" ? "synaptireach_managed_ai" : ai.provider || ai.mode;
    saves.push(upsertConnection(supabase, workspace, user, {
      provider,
      provider_type: "ai",
      status: provider === "openai" && !openAiAllowed ? "pending" : ai.mode === "managed" ? "configured" : aiSecret ? "configured" : "pending",
      secret: aiSecret,
      metadata: {
        mode: ai.mode,
        provider: ai.provider || null,
        model: ai.model || null,
        assistant_behavior: ai.assistantBehavior || null,
        intelligence_preference: ai.intelligencePreference || "balanced",
        rule_based_first: ai.useRuleBasedFirst !== false,
        provider_order: "gemini_first_openrouter_fallback_openai_enabled_only",
        openai_enabled: openAiAllowed,
      },
    }));
  }

  if (normalizedEmailMode) {
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: normalizedEmailMode === "byok" ? "resend" : "managed_email",
      provider_type: "email",
      status: normalizedEmailMode === "skip" ? "skipped" : integrations.resendApiKey ? "configured" : "pending",
      secret: integrations.resendApiKey || "",
      metadata: {
        reviewed: Boolean(integrations.emailReviewed || emailChoice),
        review_choice: emailChoice || null,
        sender_email: integrations.senderEmail || null,
        domain_status: normalizedEmailMode === "managed" ? "domain_verification_required" : null,
      },
    }));
  }

  if (normalizedSmsMode) {
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: normalizedSmsMode === "byok" ? "twilio" : "managed_sms",
      provider_type: "sms",
      status:
        normalizedSmsMode === "skip"
          ? "skipped"
          : integrations.twilioAccountSid && integrations.twilioAuthToken
            ? "configured"
            : "pending",
      secret: integrations.twilioAuthToken || "",
      metadata: {
        reviewed: Boolean(integrations.smsReviewed || smsChoice),
        review_choice: smsChoice || null,
        from_number_present: Boolean(integrations.twilioFromNumber),
        a2p_acknowledged: Boolean(payload.automation?.smsComplianceAck),
        managed_sms_requested: Boolean(payload.plan?.managedSms?.requested),
        carrier_fee_approval: Boolean(payload.plan?.managedSms?.carrierFeeApproval),
        synaptireach_setup_fee_approval: Boolean(payload.plan?.managedSms?.setupFeeApproval),
        synaptireach_setup_fee_cents: 2000,
      },
    }));
  }

  if (integrations.socialMode) {
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: "ayrshare",
      provider_type: "social",
      status: integrations.socialMode === "skip" ? "skipped" : integrations.ayrshareApiKey ? "configured" : "pending",
      secret: integrations.ayrshareApiKey || "",
      metadata: { requested_channels: integrations.socialChannels || [] },
    }));
  }

  if (integrations.calendarMode) {
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: "google_calendar",
      provider_type: "calendar",
      status: integrations.calendarMode === "internal_only" ? "skipped" : "pending",
      metadata: {
        setup_note: "OAuth connection must be completed from provider settings.",
        calendar_mode: integrations.calendarMode,
        required_for_launch: Boolean(integrations.calendarRequiredForLaunch),
      },
    }));
  }

  return Promise.all(saves);
}

async function saveStarterLead(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const leads = payload.leads || {};
  const starter = leads.starterLead || {};
  if (leads.setupMode !== "manual") return null;
  if (!starter.name && !starter.email && !starter.phone) return null;

  let query = supabase.from("leads").select("id").eq("workspace_id", workspace.id).limit(1);
  if (starter.email) query = query.eq("email", String(starter.email).toLowerCase());
  else if (starter.phone) query = query.eq("phone", starter.phone);
  else query = query.eq("name", starter.name);
  const { data: existing, error: existingError } = await query.maybeSingle();
  if (existingError) throw existingError;
  if (existing?.id) return existing;

  const { data, error } = await supabase
    .from("leads")
    .insert({
      workspace_id: workspace.id,
      company_id: workspace.company_id || null,
      user_id: user.id,
      name: starter.name || null,
      email: starter.email ? String(starter.email).toLowerCase() : null,
      phone: starter.phone || null,
      company: starter.company || null,
      source: "Onboarding",
      status: "new",
      notes: starter.notes || null,
      metadata: { source: "onboarding_manual_starter" },
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function saveStaff(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const members = Array.isArray(payload.staff?.members) ? payload.staff.members : [];
  const saved = [];
  const allowedPermissions = new Set(["leads", "pipeline", "tasks", "calendar", "communications", "marketing", "workflow", "settings_read", "admin"]);

  for (const member of members) {
    if (!member?.name && !member?.email) continue;
    let query = supabase.from("crm_staff").select("id").eq("workspace_id", workspace.id).limit(1);
    if (member.email) query = query.eq("email", String(member.email).toLowerCase());
    else query = query.eq("name", member.name);
    const { data: existing, error: existingError } = await query.maybeSingle();
    if (existingError) throw existingError;

    const staffValues = {
        workspace_id: workspace.id,
        company_id: workspace.company_id || null,
        user_id: user.id,
        name: member.name || null,
        email: member.email ? String(member.email).toLowerCase() : null,
        phone: member.phone || null,
        title: member.title || null,
        status: "invited",
        metadata: { source: "onboarding", invite_pending: true, email_sent: false, requested_permissions: member.permissions || [] },
      };
    const { data, error } = existing?.id
      ? await supabase.from("crm_staff").update(staffValues).eq("id", existing.id).select("*").single()
      : await supabase.from("crm_staff").insert(staffValues).select("*").single();
    if (error) throw error;
    await supabase.from("crm_staff_permissions").delete().eq("workspace_id", workspace.id).eq("staff_id", data.id).then(() => undefined).catch(() => undefined);
    for (const permission of member.permissions || []) {
      if (!allowedPermissions.has(permission)) continue;
      await supabase
        .from("crm_staff_permissions")
        .insert({
          workspace_id: workspace.id,
          company_id: workspace.company_id || null,
          staff_id: data.id,
          permission,
          granted: true,
        })
        .then(() => undefined)
        .catch(() => undefined);
    }
    saved.push(data);
  }

  return saved;
}

async function saveWorkflowDrafts(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const workflowSetup = payload.workflows || {};
  if (!workflowSetup.createDrafts) return [];
  const recommended = Array.isArray(workflowSetup.recommended) ? workflowSetup.recommended : [];
  const saved = [];

  for (const id of recommended) {
    const template = workflowDraftTemplates[id];
    if (!template) continue;
    const { data: existing, error: existingError } = await supabase
      .from("crm_workflows")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("name", template.name)
      .limit(1)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing?.id) continue;

    const { data, error } = await supabase
      .from("crm_workflows")
      .insert({
        workspace_id: workspace.id,
        company_id: workspace.company_id || null,
        user_id: user.id,
        name: template.name,
        status: "draft",
        trigger_type: template.trigger,
        condition: template.condition,
        action: template.action,
        actions: [template.action],
        metadata: {
          source: "onboarding",
          template_id: id,
          what_it_does: template.what,
          trigger: template.trigger,
          condition: template.condition,
          draft_action_created: template.action,
          review_gate_reason: template.why,
          review_required: true,
          external_actions_send_nothing_until_confirmed: true,
          onboarding_notes: workflowSetup.notes || null,
        },
      })
      .select("*")
      .single();
    if (error) throw error;
    saved.push(data);
  }

  return saved;
}

async function saveAssistanceRequests(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const help = payload.help || {};
  const requested = Array.isArray(help.requestedServices) ? help.requestedServices : [];
  if (!requested.length && help.mode !== "guided_call" && help.mode !== "dfy_quote") return [];

  const selected = DFY_ASSISTANCE_OPTIONS.filter((item) =>
    requested.includes(item.id) || (help.mode === "guided_call" && item.id === "guided_call")
  );
  const saved = [];

  for (const option of selected) {
    const { data: existing } = await supabase
      .from("crm_service_requests")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("item_name", option.name)
      .contains("metadata", { source: "onboarding_help" })
      .limit(1)
      .maybeSingle();
    if (existing?.id) continue;

    const { data, error } = await supabase
      .from("crm_service_requests")
      .insert({
        workspace_id: workspace.id,
        company_id: workspace.company_id || null,
        user_id: user.id,
        service_type: option.paid ? "service" : "guidance",
        item_name: option.name,
        price_cents: priceCentsFromLabel(option.price),
        recurring: option.price.includes("/hour"),
        status: option.paid ? "consultation_requested" : "guidance_requested",
        consultation_required: true,
        metadata: {
          source: "onboarding_help",
          option_id: option.id,
          price_label: option.price,
          paid: option.paid,
          guided_call_requested: Boolean(help.guidedCallRequested || option.id === "guided_call"),
          notes: help.notes || null,
          free_vs_paid_rule: "Guidance is free when the user performs setup with SynaptiReach guidance; SynaptiReach-performed setup is paid DFY work.",
          checkout_state: "not_started",
        },
      })
      .select("*")
      .single();
    if (error) throw error;
    saved.push(data);
  }

  return saved;
}

async function saveLaunchRecommendations(supabase: any, workspace: any, payload: Record<string, any>, readiness: any) {
  const missing = (readiness.checks || []).filter((check: any) => ["missing", "pending"].includes(check.status)).slice(0, 5);
  for (const check of missing) {
    const title = `Finish setup: ${check.label}`;
    const { data: existing } = await supabase
      .from("crm_ai_recommendations")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("title", title)
      .limit(1)
      .maybeSingle();
    if (existing?.id) continue;
    await supabase
      .from("crm_ai_recommendations")
      .insert({
        workspace_id: workspace.id,
        type: "onboarding_setup",
        title,
        description: check.detail || "Complete this setup item to improve launch readiness.",
        action: "fix_setup",
        status: "open",
        confidence: 0.9,
        metadata: {
          source: "onboarding",
          rule_id: `onboarding_${check.id}`,
          review_required: true,
          href: check.href,
          readiness_score: readiness.score,
          trial_path: payload.plan?.trialPath || null,
        },
      })
      .then(() => undefined)
      .catch(() => undefined);
  }
}

async function loadWorkspaceSnapshot(supabase: any, workspaceId: string) {
  const [settings, billing, connections, csvImports, menuUploads, staff, leads, workflows, recommendations, serviceRequests] = await Promise.all([
    supabase.from("crm_settings").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("crm_billing_accounts").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("crm_provider_connections").select("id,provider,provider_type,status,key_label,last_verified_at,metadata").eq("workspace_id", workspaceId).limit(100),
    supabase.from("crm_csv_imports").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(10),
    supabase.from("crm_service_menu_uploads").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(25),
    supabase.from("crm_staff").select("id,name,email,title,status,metadata").eq("workspace_id", workspaceId).neq("status", "archived").limit(50),
    supabase.from("leads").select("id,source,imported,metadata").eq("workspace_id", workspaceId).eq("archived", false).limit(500),
    supabase.from("crm_workflows").select("id,name,status,metadata").eq("workspace_id", workspaceId).limit(100),
    supabase.from("crm_ai_recommendations").select("id,type,title,status,metadata").eq("workspace_id", workspaceId).limit(100),
    supabase.from("crm_service_requests").select("id,item_name,status,metadata").eq("workspace_id", workspaceId).limit(100),
  ]);

  return {
    settings: settings.data || null,
    billing: billing.data || null,
    providerConnections: connections.data || [],
    csvImports: csvImports.data || [],
    menuUploads: menuUploads.data || [],
    staff: staff.data || [],
    leads: leads.data || [],
    workflows: workflows.data || [],
    recommendations: recommendations.data || [],
    serviceRequests: serviceRequests.data || [],
  };
}

function connectionReady(connections: any[], type: string) {
  const relevant = connections.filter((item) => item.provider_type === type);
  if (relevant.some((item) => item.status === "configured")) return "complete";
  if (relevant.some((item) => item.status === "skipped")) return "skipped";
  if (relevant.length > 0) return "pending";
  return "missing";
}

function reviewedConnectionReady(connections: any[], type: string, reviewed?: boolean) {
  if (reviewed) return "complete";
  return connectionReady(connections, type);
}

export function calculateOnboardingReadiness(payload: Record<string, any>, snapshot: any) {
  const profile = snapshot.settings || {};
  const billing = snapshot.billing || {};
  const connections = snapshot.providerConnections || [];
  const leadCount = snapshot.leads?.length || 0;
  const menuUploadCount = snapshot.menuUploads?.length || 0;
  const importedCount = (snapshot.csvImports || []).reduce((sum: number, item: any) => sum + Number(item.imported_rows || 0), 0);
  const staffCount = snapshot.staff?.length || 0;
  const workflowDraftCount = (snapshot.workflows || []).filter((item: any) => item.metadata?.source === "onboarding").length;
  const assistanceRequestCount = (snapshot.serviceRequests || []).filter((item: any) => item.metadata?.source === "onboarding_help").length;
  const automation = profile.metadata?.automation_policy || payload.automation || {};
  const settingsMeta = profile.metadata || {};
  const integrationPrefs = settingsMeta.integration_preferences || {};
  const legalProfile = settingsMeta.legal_profile || {};
  const help = payload.help || {};
  const emailVerified = Boolean(snapshot.user?.emailConfirmed);

  const checks = [
    {
      id: "owner",
      label: "Account owner details saved",
      status: payload.owner?.email || settingsMeta.owner?.email ? "complete" : "missing",
      href: "/onboarding",
    },
    {
      id: "email_verification",
      label: "Business email verified",
      status: emailVerified ? "complete" : "pending",
      href: "/signup",
      detail: emailVerified ? "Supabase auth email is confirmed." : "Verify the account email before trial activation.",
    },
    {
      id: "business_type",
      label: "Business type selected",
      status: payload.businessType ? "complete" : "missing",
      href: "/onboarding",
    },
    {
      id: "business_profile",
      label: "Business profile saved",
      status: profile.business_name && profile.industry ? "complete" : "missing",
      href: "/dashboard/settings#business",
    },
    {
      id: "legal_company",
      label: "Legal/company information reviewed",
      status: legalProfile.reviewed || payload.businessProfile?.legalReviewed ? "complete" : "pending",
      href: "/dashboard/settings#business",
      detail: legalProfile.review_status || "Review the legal/company information or intentionally mark it for later review.",
    },
    {
      id: "sales_setup",
      label: "Sales process and pipeline configured",
      status: settingsMeta.pipeline_stages?.length || payload.crmSetup?.pipelineStages ? "complete" : "missing",
      href: "/dashboard/pipeline",
    },
    {
      id: "plan",
      label: "Trial path and post-trial plan saved",
      status: billing.plan_tier && billing.metadata?.trial_path ? "complete" : "missing",
      href: "/dashboard/settings#billing",
    },
    {
      id: "billing",
      label: "Stripe card setup state is explicit",
      status:
        ["trialing", "active", "checkout_completed"].includes(billing.status)
          ? "complete"
          : ["setup_required", "checkout_required"].includes(billing.status)
            ? "missing"
            : billing.status
            ? "pending"
            : "missing",
      href: "/dashboard/settings#billing",
      detail:
        billing.status === "pending_webhook" || billing.status === "checkout_created"
          ? "Stripe checkout submitted. Waiting for webhook confirmation."
          : ["trialing", "active", "checkout_completed"].includes(billing.status)
            ? "Payment method on file."
            : billing.status || "No billing setup state saved yet.",
    },
    {
      id: "trial_acknowledgements",
      label: "Trial renewal and cap rules acknowledged",
      status:
        billing.metadata?.stripe_card_acknowledged && billing.metadata?.auto_renew_acknowledged
          ? "complete"
          : "pending",
      href: "/onboarding",
      detail: "Card collection and auto-renewal disclosure must be accepted before trial start.",
    },
    {
      id: "ai",
      label: "AI processing mode selected",
      status: connectionReady(connections, "ai"),
      href: "/dashboard/settings#providers",
    },
    {
      id: "email",
      label: "Email integration reviewed",
      status: reviewedConnectionReady(connections, "email", integrationPrefs.email_reviewed || payload.integrations?.emailReviewed || payload.integrations?.emailReviewChoice),
      href: "/dashboard/settings#integrations",
    },
    {
      id: "sms",
      label: "SMS integration reviewed",
      status: reviewedConnectionReady(connections, "sms", integrationPrefs.sms_reviewed || payload.integrations?.smsReviewed || payload.integrations?.smsReviewChoice),
      href: "/dashboard/settings#integrations",
    },
    {
      id: "calendar",
      label: "Calendar setup reviewed",
      status: integrationPrefs.calendar_reviewed || payload.integrations?.calendarMode ? "complete" : "pending",
      href: "/dashboard/settings#integrations",
      detail: "Google Calendar OAuth is completed later from provider settings, or the internal CRM calendar can be used.",
    },
    {
      id: "service_menu",
      label: "Service/product menu reviewed",
      status: payload.serviceMenu?.files?.length || menuUploadCount > 0 ? "pending" : payload.serviceMenu?.notAvailable ? "skipped" : "pending",
      href: "/onboarding",
      detail: payload.serviceMenu?.files?.length || menuUploadCount > 0 ? "Menu upload saved for analysis/review." : "Upload is optional and can be reviewed later.",
    },
    {
      id: "lead_setup",
      label: "Lead import or starter contact prepared",
      status: leadCount > 0 || importedCount > 0 || payload.leads?.setupMode === "skip" ? (payload.leads?.setupMode === "skip" ? "skipped" : "complete") : "missing",
      href: "/dashboard/leads",
      detail: leadCount > 0 ? `${leadCount} lead record(s)` : "No lead records saved yet.",
    },
    {
      id: "staff",
      label: "Staff setup reviewed",
      status: staffCount > 0 || payload.staff?.setupMode === "solo" ? (staffCount > 0 ? "complete" : "skipped") : "missing",
      href: "/dashboard/settings#staff",
    },
    {
      id: "marketing",
      label: "Marketing setup reviewed",
      status: (settingsMeta.marketing_setup?.goals || payload.marketing?.goals || []).length > 0 ? "complete" : "missing",
      href: "/dashboard/marketing",
    },
    {
      id: "workflow_drafts",
      label: "Workflow recommendations prepared",
      status: workflowDraftCount > 0 ? "complete" : payload.workflows?.createDrafts === false ? "skipped" : "pending",
      href: "/dashboard/workflow",
      detail: workflowDraftCount > 0 ? `${workflowDraftCount} onboarding draft workflow(s)` : "No onboarding workflow drafts saved yet.",
    },
    {
      id: "automation_safety",
      label: "Automation safety preferences saved",
      status: automation.no_auto_send_acknowledged || automation.noAutoSendAck ? "complete" : "missing",
      href: "/dashboard/settings#automation",
    },
    {
      id: "help",
      label: "Help/DFY preference saved",
      status: help.mode ? "complete" : "missing",
      href: "/onboarding",
      detail:
        assistanceRequestCount > 0
          ? `${assistanceRequestCount} onboarding help request(s) recorded.`
          : help.mode === "guided_call" ? "Free 30-minute setup call requested." : help.mode === "dfy_quote" ? "Paid DFY quote requested." : "Self-guided setup selected.",
    },
  ];

  const completeWeight = checks.reduce((sum, check) => {
    if (check.status === "complete") return sum + 1;
    if (check.status === "skipped" || check.status === "pending") return sum + 0.5;
    return sum;
  }, 0);

  return {
    score: Math.round((completeWeight / checks.length) * 100),
    checks,
    providerRuntime: {
      aiProviders: getAIProviderStatus(),
      stripe: getStripeBillingStatus(),
      resendReady: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
      twilioReady: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      ayrshareReady: Boolean(process.env.AYRSHARE_API_KEY),
    },
  };
}

export async function loadOnboardingState(request: Request) {
  const user = await getOnboardingUser(request);
  if (!user) {
    return { success: false, status: 401, error: "Unauthorized" };
  }

  const supabase = createSupabaseAdmin();
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (workspaceError) throw workspaceError;

  if (!workspace?.id) {
    return {
      success: true,
      user: { id: user.id, email: user.email },
      workspace: null,
      session: null,
      payload: null,
      readiness: calculateOnboardingReadiness({}, { user: { email: user.email, emailConfirmed: Boolean(user.email_confirmed_at) } }),
      snapshot: { user: { email: user.email, emailConfirmed: Boolean(user.email_confirmed_at) } },
    };
  }

  const { data: session, error: sessionError } = await supabase
    .from("onboarding_sessions")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (sessionError) throw sessionError;

  const snapshot: any = await loadWorkspaceSnapshot(supabase, workspace.id);
  snapshot.user = { email: user.email, emailConfirmed: Boolean(user.email_confirmed_at) };
  const payload = {
    ...(session?.payload || {}),
    serviceMenu: {
      ...((session?.payload || {}).serviceMenu || {}),
      files: ((session?.payload || {}).serviceMenu?.files?.length ? (session?.payload || {}).serviceMenu.files : snapshot.menuUploads || []),
    },
  };

  return {
    success: true,
    user: { id: user.id, email: user.email },
    workspace,
    session,
    payload,
    readiness: calculateOnboardingReadiness(payload, snapshot),
    snapshot,
  };
}

export async function saveOnboardingState(request: Request, input: SaveInput) {
  const user = await getOnboardingUser(request);
  if (!user) {
    return { success: false, status: 401, error: "Unauthorized" };
  }

  const rawPayload = input.payload || {};
  const payload = sanitize(rawPayload);
  const supabase = createSupabaseAdmin();
  const workspace = await ensureWorkspace(supabase, user, payload);
  await ensureMembership(supabase, workspace.id, user.id);
  const settings = await upsertSettings(supabase, workspace, user, payload);
  const billing = await upsertBilling(supabase, workspace, user, payload);
  await saveProviderSetup(supabase, workspace, user, rawPayload);
  const starterLead = await saveStarterLead(supabase, workspace, user, payload);
  const savedStaff = await saveStaff(supabase, workspace, user, payload);
  const workflowDrafts = await saveWorkflowDrafts(supabase, workspace, user, payload);
  const assistanceRequests = await saveAssistanceRequests(supabase, workspace, user, payload);

  let importResult = null;
  if (Array.isArray(input.leadRows) && input.leadRows.length > 0) {
    importResult = await importLeadRows(input.leadRows, workspace.id, {
      companyId: workspace.company_id || null,
      userId: user.id,
      fileName: input.importFileName || null,
      source: "onboarding_csv",
    });
  }

  const snapshot: any = await loadWorkspaceSnapshot(supabase, workspace.id);
  snapshot.user = { email: user.email, emailConfirmed: Boolean(user.email_confirmed_at) };
  const readiness = calculateOnboardingReadiness(payload, snapshot);
  await saveLaunchRecommendations(supabase, workspace, payload, readiness);
  const billingCheck = readiness.checks.find((check: any) => check.id === "billing");
  const billingReady = billingCheck?.status === "complete";
  const billingSubmitted = billingReady || billingCheck?.status === "pending";
  const trialAcknowledged = readiness.checks.find((check: any) => check.id === "trial_acknowledgements")?.status === "complete";
  const emailVerified = readiness.checks.find((check: any) => check.id === "email_verification")?.status === "complete";
  const requiredReady = ["business_profile", "legal_company", "plan", "ai", "email", "sms", "automation_safety"].every((id) => {
    const status = readiness.checks.find((check: any) => check.id === id)?.status;
    return status === "complete";
  });
  const effectiveComplete = Boolean(input.complete && billingReady && trialAcknowledged && emailVerified && requiredReady);
  const submittedForReview = Boolean(input.complete && !effectiveComplete && billingSubmitted && trialAcknowledged && requiredReady);
  const session = await upsertSession(supabase, {
    workspace_id: workspace.id,
    user_id: user.id,
    payload,
    completed: effectiveComplete,
    metadata: {
      source: "onboarding_wizard",
      current_step: input.currentStep || null,
      completed_steps: input.completedSteps || [],
      skipped_steps: input.skippedSteps || {},
      readiness_score: readiness.score,
      submitted_for_review: submittedForReview,
      submitted_for_review_at: submittedForReview ? new Date().toISOString() : null,
      completion_blocked_reason: input.complete && !effectiveComplete ? "Email verification, required workspace fields, provider mode, reviewed Email/SMS setup choices, Stripe webhook confirmation, and trial acknowledgements are required before onboarding is complete. Pending Stripe checkout can be submitted for review but does not activate trial access." : null,
      completed_at: effectiveComplete ? new Date().toISOString() : null,
    },
  });

  return {
    success: true,
    user: { id: user.id, email: user.email },
    workspace,
    session,
    settings,
    billing,
    readiness,
    snapshot,
    starterLead,
    savedStaff,
    workflowDrafts,
    assistanceRequests,
    importResult,
    redirect: "/dashboard",
  };
}
