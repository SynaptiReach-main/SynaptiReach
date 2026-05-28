"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  FileUp,
  Gauge,
  HeartHandshake,
  HelpCircle,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  Rocket,
  ShieldCheck,
  Upload,
  UserPlus,
  Users,
  Wand2,
  Workflow,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BYOK_TRIAL_NOTES, DFY_ASSISTANCE_OPTIONS, MANAGED_TRIAL_CAPS, SUBSCRIPTION_PLANS } from "@/lib/billing/plans";

type WizardData = {
  businessType: string;
  owner: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  businessProfile: {
    businessName: string;
    legalName: string;
    taxIdLast4: string;
    industry: string;
    serviceType: string;
    mainCustomerType: string;
    primaryCategories: string;
    topServices: string;
    website: string;
    contactEmail: string;
    phone: string;
    address: string;
    timezone: string;
    teamSize: string;
    productsServices: string;
    audience: string;
    targetCustomer: string;
    mainOffer: string;
    preferredCta: string;
    salesProcess: string;
    brandVoice: string;
    legalReviewed: boolean;
    serviceAreas: string;
    businessHours: string;
    commonProblems: string;
    pricingNotes: string;
    bookingProcess: string;
    quoteProcess: string;
    reviewProcess: string;
    commonQuestions: string;
    commonObjections: string;
    emergencyPriorityRules: string;
  };
  plan: {
    planSlug: string;
    trialPath: "managed" | "byok" | "";
    billingIntent: "start_trial" | "checkout_now" | "checkout_started";
    checkoutSessionId: string;
    checkoutReturnState: "success" | "cancelled" | "";
    stripeCardAcknowledged: boolean;
    autoRenewAcknowledged: boolean;
    managedCapsAcknowledged: boolean;
    byokProviderCostAcknowledged: boolean;
    usageCaps: {
      aiActions: string;
      emails: string;
      sms: string;
      contacts: string;
      workflows: string;
      agents: string;
      selfImposedCaps: boolean;
    };
    managedSms: {
      requested: boolean;
      carrierFeeApproval: boolean;
      setupFeeApproval: boolean;
    };
  };
  ai: {
    mode: "managed" | "byok" | "";
    provider: string;
    model: string;
    openaiKey: string;
    geminiKey: string;
    openrouterKey: string;
    anthropicKey: string;
    brandVoice: string;
    tone: string;
    assistantBehavior: string;
    intelligencePreference: "conservative" | "balanced" | "proactive";
    riskTolerance: "strict" | "balanced" | "flexible";
    topicsToAvoid: string;
    draftMode: "draft_messages" | "recommend_tasks_only";
    useRuleBasedFirst: boolean;
  };
  integrations: {
    emailMode: "managed" | "byok" | "skip" | "";
    emailReviewChoice: "setup_now" | "managed_later" | "byok_later" | "reviewed_later" | "not_using" | "";
    emailReviewed: boolean;
    senderEmail: string;
    resendApiKey: string;
    smsMode: "managed" | "byok" | "skip" | "";
    smsReviewChoice: "setup_now" | "managed_later" | "byok_later" | "reviewed_later" | "not_using" | "";
    smsReviewed: boolean;
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioFromNumber: string;
    socialMode: "connect" | "skip" | "";
    socialChannels: string[];
    ayrshareApiKey: string;
    calendarMode: "google_later" | "internal_only" | "help" | "";
    calendarRequiredForLaunch: boolean;
  };
  crmSetup: {
    pipelineStages: string;
    leadStatuses: string;
    leadSources: string;
    leadTags: string;
    salesProcess: string;
    typicalDealValue: string;
    averageCloseTime: string;
    priorityRules: string;
    wonReasons: string;
    lostReasons: string;
    staleLeadThreshold: string;
    staleDealThreshold: string;
    followUpTiming: string;
    ownerAssignmentPreference: string;
    appointmentTypes: string;
    defaultTaskTypes: string;
    assignmentRules: string;
    requiredLeadFields: string;
    requiredDealFields: string;
    requiredTaskFields: string;
  };
  leads: {
    setupMode: "csv" | "manual" | "skip" | "";
    csvMappingNotes: string;
    starterLead: {
      name: string;
      email: string;
      phone: string;
      company: string;
      notes: string;
    };
  };
  staff: {
    setupMode: "invite" | "solo" | "";
    members: Array<{ name: string; email: string; phone: string; title: string; permissions: string[] }>;
  };
  marketing: {
    goals: string[];
    channels: string[];
    strategy: string;
    firstCampaignIdea: string;
    notificationPreferences: string[];
    monthlyBudget: string;
    leadMagnets: string;
    offersPromotions: string;
    seasonalCampaigns: string;
    customerSegments: string;
    retargetingInterest: string;
    reviewRequestTiming: string;
    approvalWorkflow: string;
  };
  analytics: {
    primaryKpi: string;
    monthlyLeadGoal: string;
    monthlyRevenueGoal: string;
    appointmentGoal: string;
    conversionGoal: string;
    averageCustomerValue: string;
    currentMonthlyLeadVolume: string;
    currentMonthlyAppointmentVolume: string;
    reportingCadence: string;
    success30: string;
    success60: string;
    success90: string;
    painPoints: string;
  };
  communications: {
    emailStyle: string;
    smsStyle: string;
    commonQuestions: string;
    commonObjections: string;
    followUpMessages: string;
    escalationRules: string;
    responseTimeExpectation: string;
    doNotContactPreferences: string;
    disclaimers: string;
  };
  calendar: {
    appointmentTypes: string;
    defaultDuration: string;
    bookingWindow: string;
    availabilityNotes: string;
    reminderPreferences: string;
    reminderTiming: string;
    noShowPreference: string;
    confirmationWorkflow: string;
  };
  workflows: {
    recommended: string[];
    createDrafts: boolean;
    notes: string;
  };
  help: {
    mode: "self_guided" | "guided_call" | "dfy_quote";
    requestedServices: string[];
    notes: string;
    guidedCallRequested: boolean;
  };
  automation: {
    requireApproval: boolean;
    draftOnlyAutomations: string;
    usageWarningPreferences: string;
    allowAutoAssign: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    smsComplianceAck: boolean;
    noAutoSendAck: boolean;
  };
  serviceMenu: {
    files: Array<{ id?: string; file_name?: string; storage_path?: string; analysis_state?: string; extraction_state?: string }>;
    manualItems: Array<{ name: string; category: string; priceRange: string; duration: string; description: string; notes: string; enabled: boolean }>;
    notAvailable: boolean;
    notes: string;
  };
};

const brandVoiceStarter =
  "Friendly, professional, and helpful. Keep messages clear, confident, and action-oriented without sounding pushy. Explain next steps simply and focus on helping customers solve their problem quickly.";

const initialData: WizardData = {
  businessType: "",
  owner: {
    name: "",
    email: "",
    phone: "",
    role: "Owner",
  },
  businessProfile: {
    businessName: "",
    legalName: "",
    taxIdLast4: "",
    industry: "",
    serviceType: "",
    mainCustomerType: "",
    primaryCategories: "",
    topServices: "",
    website: "",
    contactEmail: "",
    phone: "",
    address: "",
    timezone: "America/Chicago",
    teamSize: "",
    productsServices: "",
    audience: "",
    targetCustomer: "",
    mainOffer: "",
    preferredCta: "Book a consultation",
    salesProcess: "",
    brandVoice: brandVoiceStarter,
    legalReviewed: false,
    serviceAreas: "",
    businessHours: "",
    commonProblems: "",
    pricingNotes: "",
    bookingProcess: "",
    quoteProcess: "",
    reviewProcess: "",
    commonQuestions: "",
    commonObjections: "",
    emergencyPriorityRules: "",
  },
  plan: {
    planSlug: "growth-managed",
    trialPath: "managed",
    billingIntent: "start_trial",
    checkoutSessionId: "",
    checkoutReturnState: "",
    stripeCardAcknowledged: false,
    autoRenewAcknowledged: false,
    managedCapsAcknowledged: false,
    byokProviderCostAcknowledged: false,
    usageCaps: {
      aiActions: `${MANAGED_TRIAL_CAPS.aiActions}`,
      emails: `${MANAGED_TRIAL_CAPS.emails}`,
      sms: `${MANAGED_TRIAL_CAPS.sms}`,
      contacts: `${MANAGED_TRIAL_CAPS.contacts}`,
      workflows: `${MANAGED_TRIAL_CAPS.activeWorkflows}`,
      agents: `${MANAGED_TRIAL_CAPS.agentRuns}`,
      selfImposedCaps: false,
    },
    managedSms: {
      requested: false,
      carrierFeeApproval: false,
      setupFeeApproval: false,
    },
  },
  ai: {
    mode: "",
    provider: "",
    model: "",
    openaiKey: "",
    geminiKey: "",
    openrouterKey: "",
    anthropicKey: "",
    brandVoice: brandVoiceStarter,
    tone: "professional",
    assistantBehavior: "Draft helpful, concise recommendations and explain why each action matters.",
    intelligencePreference: "balanced",
    riskTolerance: "balanced",
    topicsToAvoid: "",
    draftMode: "draft_messages",
    useRuleBasedFirst: true,
  },
  integrations: {
    emailMode: "",
    emailReviewChoice: "",
    emailReviewed: false,
    senderEmail: "",
    resendApiKey: "",
    smsMode: "",
    smsReviewChoice: "",
    smsReviewed: false,
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioFromNumber: "",
    socialMode: "",
    socialChannels: [],
    ayrshareApiKey: "",
    calendarMode: "",
    calendarRequiredForLaunch: false,
  },
  crmSetup: {
    pipelineStages: "New, Qualified, Proposal, Negotiation, Won, Lost",
    leadStatuses: "new, contacted, qualified, nurture, converted, lost",
    leadSources: "website, referral, Google Business Profile, Facebook, Instagram, LinkedIn, paid ads, CSV import",
    leadTags: "hot, warm, cold, follow-up, VIP",
    salesProcess: "",
    typicalDealValue: "",
    averageCloseTime: "",
    priorityRules: "",
    wonReasons: "",
    lostReasons: "",
    staleLeadThreshold: "7 days",
    staleDealThreshold: "14 days",
    followUpTiming: "Follow up with new leads within 1 business day.",
    ownerAssignmentPreference: "",
    appointmentTypes: "Consultation, estimate, follow-up, service visit",
    defaultTaskTypes: "Call back, send estimate, follow up, schedule appointment, request review",
    assignmentRules: "",
    requiredLeadFields: "name, email or phone, source, status",
    requiredDealFields: "title, stage, value when known, next step",
    requiredTaskFields: "title, due date, owner, priority",
  },
  leads: {
    setupMode: "",
    csvMappingNotes: "",
    starterLead: {
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },
  },
  staff: {
    setupMode: "",
    members: [{ name: "", email: "", phone: "", title: "", permissions: ["leads", "tasks"] }],
  },
  marketing: {
    goals: ["lead_nurture"],
    channels: ["email"],
    strategy: "service_appointment_funnel",
    firstCampaignIdea: "",
    notificationPreferences: ["task_due", "new_lead", "billing_setup"],
    monthlyBudget: "",
    leadMagnets: "",
    offersPromotions: "",
    seasonalCampaigns: "",
    customerSegments: "",
    retargetingInterest: "",
    reviewRequestTiming: "After completed service or confirmed customer success.",
    approvalWorkflow: "Owner reviews campaign drafts before sending.",
  },
  analytics: {
    primaryKpi: "Qualified leads",
    monthlyLeadGoal: "",
    monthlyRevenueGoal: "",
    appointmentGoal: "",
    conversionGoal: "",
    averageCustomerValue: "",
    currentMonthlyLeadVolume: "",
    currentMonthlyAppointmentVolume: "",
    reportingCadence: "Weekly",
    success30: "",
    success60: "",
    success90: "",
    painPoints: "",
  },
  communications: {
    emailStyle: "Clear, helpful, and concise.",
    smsStyle: "Short, permission-aware, and appointment focused.",
    commonQuestions: "",
    commonObjections: "",
    followUpMessages: "",
    escalationRules: "",
    responseTimeExpectation: "",
    doNotContactPreferences: "",
    disclaimers: "",
  },
  calendar: {
    appointmentTypes: "Consultation, estimate, service visit, follow-up",
    defaultDuration: "30 minutes",
    bookingWindow: "",
    availabilityNotes: "",
    reminderPreferences: "Internal reminder first; customer messages require review.",
    reminderTiming: "24 hours before appointment and 2 hours before appointment.",
    noShowPreference: "Create a review-gated reschedule task.",
    confirmationWorkflow: "Confirm appointment details before sending customer-facing messages.",
  },
  workflows: {
    recommended: ["new_lead_followup", "stale_deal_followup", "appointment_reminder"],
    createDrafts: true,
    notes: "",
  },
  help: {
    mode: "self_guided",
    requestedServices: [],
    notes: "",
    guidedCallRequested: false,
  },
  automation: {
    requireApproval: true,
    draftOnlyAutomations: "Customer-facing email, SMS, social posts, billing actions, and review requests stay draft-only until approved.",
    usageWarningPreferences: "Warn me at 80% of managed trial caps.",
    allowAutoAssign: false,
    quietHoursEnabled: true,
    quietHoursStart: "20:00",
    quietHoursEnd: "08:00",
    smsComplianceAck: false,
    noAutoSendAck: false,
  },
  serviceMenu: {
    files: [],
    manualItems: [],
    notAvailable: false,
    notes: "",
  },
};

const steps = [
  { id: "welcome", label: "Welcome", icon: Rocket },
  { id: "owner", label: "Owner", icon: Users },
  { id: "profile", label: "Business", icon: Building2 },
  { id: "help", label: "Help", icon: HeartHandshake },
  { id: "sales", label: "Sales Setup", icon: BriefcaseBusiness },
  { id: "plan", label: "Trial Path", icon: CreditCard },
  { id: "billing", label: "Billing", icon: Lock },
  { id: "ai", label: "AI Mode", icon: Bot },
  { id: "integrations", label: "Integrations", icon: Mail },
  { id: "leads", label: "Leads", icon: Upload },
  { id: "staff", label: "Staff", icon: UserPlus },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "workflows", label: "Workflows", icon: Workflow },
  { id: "safety", label: "Safety", icon: ShieldCheck },
  { id: "launch", label: "Launch", icon: Gauge },
];

const stepIndexById = Object.fromEntries(steps.map((item, index) => [item.id, index]));
const optionalStepIds = new Set(["integrations", "leads", "staff", "marketing", "workflows", "help"]);
const readinessStepMap: Record<string, string> = {
  owner: "owner",
  email_verification: "owner",
  business_type: "welcome",
  business_profile: "profile",
  legal_company: "profile",
  sales_setup: "sales",
  crm_setup_summary: "launch",
  plan: "plan",
  billing: "billing",
  trial_acknowledgements: "plan",
  ai: "ai",
  email: "integrations",
  sms: "integrations",
  calendar: "integrations",
  service_menu: "profile",
  lead_setup: "leads",
  staff: "staff",
  marketing: "marketing",
  workflow_drafts: "workflows",
  automation_safety: "safety",
  help: "help",
};

const managedTrialCaps = [
  ["AI actions", `${MANAGED_TRIAL_CAPS.aiActions} included`],
  ["Email", `${MANAGED_TRIAL_CAPS.emails} included`],
  ["SMS", `0 by default; ${MANAGED_TRIAL_CAPS.approvedSms} after approval/payment`],
  ["Contacts", `${MANAGED_TRIAL_CAPS.contacts}`],
  ["Workflows", `${MANAGED_TRIAL_CAPS.activeWorkflows} active workflows`],
  ["AI review checks", `${MANAGED_TRIAL_CAPS.agentRuns}`],
  ["Staff", `${MANAGED_TRIAL_CAPS.staff} invited users`],
  ["Campaign drafts", `${MANAGED_TRIAL_CAPS.campaignDrafts}`],
  ["CSV imports", `${MANAGED_TRIAL_CAPS.csvImports}`],
];

const byokTrialNotes = BYOK_TRIAL_NOTES;

const dfyOptions = DFY_ASSISTANCE_OPTIONS.map((option) => [option.id, option.name, option.price]);

const businessTypes = [
  ["service", "Service business", "Appointments, estimates, follow-up, reviews, and recurring work."],
  ["professional", "Professional services", "Pipeline, consultations, documents, billing checkpoints, and client communication."],
  ["local", "Local business", "Lead capture, reputation, repeat visits, offers, and customer messaging."],
  ["hybrid", "Hybrid operation", "Sales pipeline, projects, customer support, campaigns, and automation."],
];

const postTrialFitChecks = [
  ["Contacts", `${MANAGED_TRIAL_CAPS.contacts} during managed trial`, "New contacts beyond the selected plan cap are blocked after trial until upgrade or eligible capacity is added."],
  ["Active workflows", `${MANAGED_TRIAL_CAPS.activeWorkflows} during managed trial`, "Existing workflow drafts are kept. Future activation/runs are capped by the post-trial plan."],
  ["AI review checks", `${MANAGED_TRIAL_CAPS.agentRuns} during managed trial`, "AI review activity hard-stops at the applicable cap; rule-based recommendations still work."],
  ["Email/SMS", `${MANAGED_TRIAL_CAPS.emails} managed emails and SMS approval required`, "Managed sends stop at trial caps or provider approval boundaries. BYOK sends depend on your provider account."],
];

const staffPermissionPresets: Record<string, string[]> = {
  "Owner/Admin": ["leads", "pipeline", "tasks", "calendar", "communications", "marketing", "workflow", "settings_read", "admin"],
  "Sales Rep": ["leads", "pipeline", "tasks", "calendar", "communications"],
  "Appointment Setter": ["leads", "tasks", "calendar", "communications"],
  "Marketing Manager": ["leads", "communications", "marketing", "workflow"],
  "Support/Communications": ["leads", "tasks", "communications"],
  "Read-only Analyst": ["leads", "pipeline", "tasks", "calendar", "communications", "marketing", "settings_read"],
};

const marketingStrategies = [
  ["service_appointment_funnel", "Service appointment funnel"],
  ["free_estimate_funnel", "Free estimate funnel"],
  ["consultation_funnel", "Consultation funnel"],
  ["lead_magnet_funnel", "Lead magnet funnel"],
  ["review_reputation_campaign", "Review/reputation campaign"],
  ["reengagement_campaign", "Re-engagement campaign"],
  ["new_customer_onboarding", "New customer onboarding campaign"],
];

const workflowOptions = [
  ["new_lead_followup", "New lead follow-up", "Prepares fast first-touch follow-up for new inquiries.", "lead_created", "New lead has not been contacted.", "Review-gated task and draft message."],
  ["stale_deal_followup", "Stale deal follow-up", "Flags opportunities that may need owner attention.", "deal_stage_stale", "Deal has not moved stages in the expected window.", "Internal task to review the deal."],
  ["appointment_reminder", "Appointment reminder", "Prepares reminder tasks around upcoming appointments.", "appointment_upcoming", "Reminder setup is allowed.", "Internal reminder; external sends stay gated."],
  ["opened_not_clicked", "Opened-not-clicked campaign follow-up", "Surfaces warm campaign engagement for follow-up.", "campaign_open_no_click", "Lead opened but did not click.", "Follow-up task or draft message."],
  ["missed_response", "Unread inbound response", "Keeps inbound replies from being missed.", "communication_unread", "Inbound response remains unread.", "High-priority follow-up task."],
  ["review_request", "Post-service review request", "Prepares a review ask after service completion.", "service_completed", "Customer reaches the post-service stage.", "Review request draft."],
  ["missed_call_followup", "Missed call follow-up", "Captures phone leads that did not become conversations.", "missed_call", "Missed call has no follow-up.", "Callback task and draft message."],
  ["quote_sent_followup", "Quote sent follow-up", "Keeps quoted opportunities moving.", "quote_sent", "No response after quote review window.", "Quote follow-up task."],
  ["estimate_reminder", "Estimate reminder", "Prepares internal reminders for estimate-related work.", "estimate_pending", "Estimate is pending near the appointment window.", "Estimate reminder task."],
  ["no_show_recovery", "No-show recovery", "Helps recover missed appointments.", "appointment_no_show", "Appointment is marked no-show.", "Reschedule task or draft."],
  ["completed_appointment_review", "Review request after completed appointment", "Prepares review asks after completed appointments.", "appointment_completed", "Appointment is completed.", "Review request draft."],
  ["referral_request_won", "Referral request after converted/won customer", "Creates a reviewable referral ask after conversion.", "deal_won", "Customer converts and timing is appropriate.", "Referral request task."],
  ["payment_checkpoint_reminder", "Payment/checkpoint reminder", "Flags payment or milestone follow-up.", "payment_checkpoint_due", "Payment or project checkpoint is approaching.", "Billing checkpoint task."],
  ["cold_lead_reactivation", "Cold lead reactivation", "Prepares safe re-engagement for older leads.", "lead_cold", "Cold lead is inactive beyond the selected window.", "Reactivation task or campaign idea."],
  ["high_intent_inquiry_alert", "High-intent website inquiry alert", "Alerts the team to urgent website inquiries.", "website_inquiry_high_intent", "Inquiry includes high-intent signals.", "High-priority owner alert."],
  ["new_lead_owner_assignment", "New lead owner assignment", "Prepares owner assignment suggestions.", "lead_created", "New lead has no owner.", "Owner assignment task."],
  ["trial_usage_cap_warning", "Trial usage/cap warning", "Warns owners before managed trial caps are reached.", "usage_cap_threshold", "Trial usage approaches a cap.", "Billing and usage review task."],
  ["campaign_reply_triage", "Campaign reply triage", "Routes campaign replies for review.", "campaign_reply_received", "Campaign reply arrives.", "Reply triage task."],
  ["upsell_cross_sell_followup", "Upsell/cross-sell follow-up", "Prepares expansion opportunities for existing customers.", "customer_eligible_for_offer", "Customer is eligible for a relevant next service.", "Offer review task."],
  ["dormant_customer_winback", "Dormant customer winback", "Prepares dormant customer reactivation.", "customer_dormant", "Past customer has no recent activity.", "Winback task or campaign idea."],
  ["vip_lead_escalation", "VIP/high-value lead escalation", "Highlights high-value leads for fast owner review.", "lead_value_high", "Lead is VIP or above value threshold.", "Owner escalation task."],
];

const industries = [
  "HVAC",
  "Roofing",
  "Plumbing",
  "Electrical",
  "Healthcare",
  "Dental",
  "Legal",
  "Real Estate",
  "Insurance",
  "Financial Services",
  "Agency",
  "Marketing",
  "Consulting",
  "Ecommerce",
  "Restaurant",
  "Fitness",
  "Automotive",
  "Home Services",
  "Other",
];

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(text: string) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must include a header row and at least one lead row.");
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce((row: Record<string, string>, header, index) => {
      row[header] = cells[index] || "";
      return row;
    }, {});
  });
}

function textValue(value: any) {
  return typeof value === "string" ? value : "";
}

function currentTrialPath(value: any): "managed" | "byok" {
  return value === "byok" ? "byok" : "managed";
}

function splitSetupText(value: string) {
  return String(value || "")
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function shortList(items: string[], fallback = "Not provided yet") {
  const clean = items.filter(Boolean);
  if (!clean.length) return fallback;
  if (clean.length <= 4) return clean.join(", ");
  return `${clean.slice(0, 4).join(", ")} +${clean.length - 4} more`;
}

function readableToken(value: string) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function serviceMenuStateLabel(serviceMenu: WizardData["serviceMenu"]) {
  const hasFiles = serviceMenu.files.length > 0;
  const manualCount = serviceMenu.manualItems.filter((item) => item.name.trim()).length;
  if (hasFiles && manualCount > 0) return `Menu uploaded. Analysis pending. ${manualCount} manual service/product entr${manualCount === 1 ? "y" : "ies"} saved.`;
  if (hasFiles) return "Menu uploaded. Analysis pending.";
  if (manualCount > 0) return `Manual services/products saved (${manualCount}).`;
  if (serviceMenu.notAvailable) return "Service/product menu marked as not available yet.";
  return "Service/product menu missing. You can upload a file or add services manually.";
}

function defaultPlanForTrialPath(value: "managed" | "byok") {
  return value === "byok" ? "growth-byok" : "growth-managed";
}

function mergePayload(payload: any): WizardData {
  return {
    ...initialData,
    ...(payload || {}),
    owner: { ...initialData.owner, ...(payload?.owner || {}) },
    businessProfile: { ...initialData.businessProfile, ...(payload?.businessProfile || {}), taxIdLast4: payload?.businessProfile?.taxIdLast4 === "__saved_server_side__" ? "" : payload?.businessProfile?.taxIdLast4 || "" },
    plan: {
      ...initialData.plan,
      ...(payload?.plan || {}),
      usageCaps: { ...initialData.plan.usageCaps, ...(payload?.plan?.usageCaps || {}) },
      managedSms: { ...initialData.plan.managedSms, ...(payload?.plan?.managedSms || {}) },
    },
    ai: { ...initialData.ai, ...(payload?.ai || {}), mode: payload?.ai?.mode === "local" ? "" : payload?.ai?.mode || initialData.ai.mode, openaiKey: "", geminiKey: "", openrouterKey: "", anthropicKey: "" },
    integrations: {
      ...initialData.integrations,
      ...(payload?.integrations || {}),
      calendarMode: payload?.integrations?.calendarMode === "connect" ? "google_later" : payload?.integrations?.calendarMode === "skip" ? "internal_only" : payload?.integrations?.calendarMode || "",
      resendApiKey: "",
      twilioAuthToken: "",
      twilioAccountSid: "",
      ayrshareApiKey: "",
    },
    crmSetup: { ...initialData.crmSetup, ...(payload?.crmSetup || {}) },
    leads: {
      ...initialData.leads,
      ...(payload?.leads || {}),
      starterLead: { ...initialData.leads.starterLead, ...(payload?.leads?.starterLead || {}) },
    },
    staff: {
      ...initialData.staff,
      ...(payload?.staff || {}),
      members: Array.isArray(payload?.staff?.members) && payload.staff.members.length > 0 ? payload.staff.members : initialData.staff.members,
    },
    marketing: { ...initialData.marketing, ...(payload?.marketing || {}) },
    analytics: { ...initialData.analytics, ...(payload?.analytics || {}) },
    communications: { ...initialData.communications, ...(payload?.communications || {}) },
    calendar: { ...initialData.calendar, ...(payload?.calendar || {}) },
    workflows: { ...initialData.workflows, ...(payload?.workflows || {}) },
    help: { ...initialData.help, ...(payload?.help || {}) },
    automation: { ...initialData.automation, ...(payload?.automation || {}) },
    serviceMenu: {
      ...initialData.serviceMenu,
      ...(payload?.serviceMenu || {}),
      files: Array.isArray(payload?.serviceMenu?.files) ? payload.serviceMenu.files : [],
      manualItems: Array.isArray(payload?.serviceMenu?.manualItems) ? payload.serviceMenu.manualItems : [],
    },
  };
}

function inputClass() {
  return "w-full min-w-0 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/70";
}

function Field({ label, children, hint, required, optional }: { label: string; children: ReactNode; hint?: string; required?: boolean; optional?: boolean }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-cyan-100/60">
        {label}
        {required ? <span className="ml-1 text-red-300">*</span> : null}
        {optional ? <span className="ml-1 normal-case tracking-normal text-slate-500">(optional)</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "complete"
      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
      : status === "pending"
        ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-100"
        : status === "skipped"
          ? "border-white/15 bg-white/5 text-slate-300"
          : "border-red-300/25 bg-red-500/10 text-red-100";

  return <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-bold uppercase ${styles}`}>{status === "skipped" ? "intentionally skipped" : status}</span>;
}

function maxUnlockedFor(completed: string[]) {
  const completedSet = new Set(completed);
  const firstIncomplete = steps.findIndex((item) => !completedSet.has(item.id));
  return firstIncomplete === -1 ? steps.length - 1 : firstIncomplete;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);
  const [sessionToken, setSessionToken] = useState("");
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [onboardingSession, setOnboardingSession] = useState<any>(null);
  const [readiness, setReadiness] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<any>({});
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutStatusError, setCheckoutStatusError] = useState("");
  const [menuUploading, setMenuUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; title: string; detail?: string } | null>(null);

  const step = steps[activeStep];
  const selectedPlan = useMemo(
    () => SUBSCRIPTION_PLANS.find((plan) => plan.slug === data.plan.planSlug),
    [data.plan.planSlug]
  );
  const crmSetupSummary = useMemo(() => {
    const staffRoles = data.staff.members
      .map((member) => member.title || member.name)
      .filter(Boolean);
    const workflowLabels = data.workflows.recommended
      .map((id) => workflowOptions.find((option) => option[0] === id)?.[1] || readableToken(id))
      .filter(Boolean);
    const menuState = serviceMenuStateLabel(data.serviceMenu);

    return [
      {
        label: "Business profile",
        value: [data.businessProfile.businessName, data.businessProfile.industry, data.businessProfile.serviceType]
          .filter(Boolean)
          .join(" / ") || "Business details not provided yet",
      },
      { label: "Pipeline stages", value: shortList(splitSetupText(data.crmSetup.pipelineStages)) },
      { label: "Lead sources", value: shortList(splitSetupText(data.crmSetup.leadSources)) },
      { label: "Staff roles", value: data.staff.setupMode === "solo" ? "Owner-only workspace" : shortList(staffRoles, "No staff roles added yet") },
      { label: "Workflow drafts", value: data.workflows.createDrafts ? shortList(workflowLabels, "Drafts enabled; choose workflows to prepare") : "Workflow drafts skipped for now" },
      { label: "Marketing goals", value: shortList(data.marketing.goals.map(readableToken), "No marketing goals selected yet") },
      { label: "Calendar preference", value: data.integrations.calendarMode ? readableToken(data.integrations.calendarMode) : "Not selected yet" },
      { label: "Billing/trial path", value: `${readableToken(data.plan.trialPath || "not selected")} / ${selectedPlan?.name || "No post-trial plan selected"}` },
      { label: "Service/product menu", value: `${menuState} You can also enter or edit services manually later.` },
    ];
  }, [data, selectedPlan]);
  const completedSet = useMemo(() => new Set(completedSteps), [completedSteps]);
  const firstIncompleteIndex = steps.findIndex((item) => !completedSet.has(item.id));
  const maxUnlockedStep = firstIncompleteIndex === -1 ? steps.length - 1 : firstIncompleteIndex;
  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);
  const submittedForReview = Boolean(onboardingSession?.metadata?.submitted_for_review && !onboardingSession?.completed);
  const finalButtonLabel = submittedForReview
    ? "Update Onboarding"
    : ["pending_webhook", "checkout_created"].includes(snapshot?.billing?.status)
      ? "Submit Onboarding for Review"
      : "Complete Onboarding";

  function showToast(type: "success" | "error" | "info", title: string, detail?: string) {
    setToast({ type, title, detail });
  }

  useEffect(() => {
    setMessage("");
    setValidationErrors([]);
  }, [activeStep]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        setCheckoutStatusError("");
        const params = new URLSearchParams(window.location.search);
        const checkoutReturn = params.get("checkout");
        const checkoutSessionId = params.get("session_id") || "";
        const requestedStep = params.get("step");
        const editingSubmitted = Boolean(requestedStep);
        const returnTo = `${window.location.pathname}${window.location.search}`;
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token || !session.user) {
          router.replace(`/signin?returnTo=${encodeURIComponent(returnTo)}`);
          setError("Sign in to continue onboarding.");
          setLoading(false);
          return;
        }

        setSessionToken(session.access_token);

        const response = await fetch("/api/onboarding/save", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        let result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          setError(result.error || "Could not load onboarding state.");
          setLoading(false);
          return;
        }

        if (result.session?.completed) {
          router.replace("/dashboard");
          return;
        }

        if (result.session?.metadata?.submitted_for_review && !editingSubmitted && checkoutReturn !== "success") {
          router.replace("/onboarding/status");
          return;
        }

        if (result.payload) {
          const merged = mergePayload(result.payload);
          if (checkoutReturn === "success" && checkoutSessionId) {
            merged.plan = {
              ...merged.plan,
              billingIntent: "checkout_started",
              checkoutSessionId,
              checkoutReturnState: "success",
            };
            const statusResponse = await fetch("/api/onboarding/stripe-session", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
              body: JSON.stringify({ session_id: checkoutSessionId, checkout_return_state: "success" }),
            });
            const statusResult = await statusResponse.json().catch(() => ({}));
            if (!statusResponse.ok || !statusResult.success) {
              const detail = "Could not refresh checkout status. You can retry from Billing.";
              setCheckoutStatusError(detail);
              showToast("error", "Billing status check failed", detail);
            } else {
              showToast("info", "Checkout Submitted", "Waiting Confirmation & Review.");
              const refreshed = await fetch("/api/onboarding/save", {
                cache: "no-store",
                headers: { Authorization: `Bearer ${session.access_token}` },
              });
              const refreshedResult = await refreshed.json().catch(() => ({}));
              if (refreshed.ok && refreshedResult.success) result = refreshedResult;
            }
          } else if (checkoutReturn === "cancelled") {
            merged.plan = { ...merged.plan, checkoutReturnState: "cancelled" };
            showToast("info", "Stripe checkout cancelled", "Set up payment method with Stripe to continue onboarding.");
          }
          setData(merged);
        } else {
          const storedType = localStorage.getItem("synaptireach_business_type");
          let signup: any = {};
          try {
            signup = JSON.parse(localStorage.getItem("synaptireach_signup") || "{}");
          } catch {
            signup = {};
          }
          const storedTrialPath = signup.trialPath === "byok" ? "byok" : signup.trialPath === "managed" ? "managed" : null;
          setData((current) => {
            const signupTrialPath = storedTrialPath || currentTrialPath(current.plan.trialPath);
            const signupPlanSlug = defaultPlanForTrialPath(signupTrialPath);
            return {
              ...current,
              businessType: storedType || current.businessType,
              owner: {
                ...current.owner,
                email: signup.email || session.user.email || current.owner.email,
              },
              plan: {
                ...current.plan,
                trialPath: signupTrialPath,
                planSlug: current.plan.planSlug?.endsWith(`-${signupTrialPath}`) ? current.plan.planSlug : signupPlanSlug,
              },
              ai: {
                ...current.ai,
                mode: current.ai.mode || signupTrialPath,
              },
              integrations: {
                ...current.integrations,
                emailMode: current.integrations.emailMode || signupTrialPath,
                smsMode: current.integrations.smsMode || (signupTrialPath === "byok" ? "byok" : "skip"),
              },
              businessProfile: {
                ...current.businessProfile,
                businessName: signup.businessName || current.businessProfile.businessName,
                industry: signup.industry || current.businessProfile.industry,
                contactEmail: signup.email || session.user.email || current.businessProfile.contactEmail,
              },
            };
          });
        }
        setWorkspaceId(result.workspace?.id || null);
        setOnboardingSession(result.session || null);
        setReadiness(result.readiness || null);
        setSnapshot(result.snapshot || {});
        const savedProgress = result.session?.metadata || result.payload?.__onboardingProgress || {};
        const savedCompleted = savedProgress.completed_steps || [];
        setCompletedSteps(savedCompleted);
        setSkippedSteps(savedProgress.skipped_steps || {});
        const savedStep = savedProgress.current_step;
        const targetStep = checkoutReturn === "success" && requestedStep === "billing" ? "billing" : requestedStep || savedStep || "welcome";
        if (targetStep && stepIndexById[targetStep] !== undefined) {
          const savedIndex = stepIndexById[targetStep];
          setActiveStep(checkoutReturn === "success" ? savedIndex : Math.min(savedIndex, maxUnlockedFor(savedCompleted)));
        }
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || "Could not load onboarding state.");
        setLoading(false);
      }
    }

    load();
  }, [router]);

  function updateSection<K extends keyof WizardData>(section: K, patch: Partial<WizardData[K]>) {
    setData((current) => ({
      ...current,
      [section]: {
        ...(current[section] as any),
        ...patch,
      },
    }));
  }

  function updateNested<K extends keyof WizardData, T extends keyof WizardData[K]>(section: K, key: T, value: WizardData[K][T]) {
    setData((current) => ({
      ...current,
      [section]: {
        ...(current[section] as any),
        [key]: value,
      },
    }));
  }

  function toggleList(section: "marketing" | "workflows" | "help", key: string, value: string) {
    setData((current) => {
      const list = Array.isArray((current as any)[section]?.[key]) ? (current as any)[section][key] : [];
      const next = list.includes(value) ? list.filter((item: string) => item !== value) : [...list, value];
      return {
        ...current,
        [section]: {
          ...(current as any)[section],
          [key]: next,
        },
      };
    });
  }

  function validateStep(stepId = step.id) {
    const errors: string[] = [];
    if (stepId === "welcome" && !data.businessType) errors.push("Choose the business type that best matches your workspace.");
    if (stepId === "owner") {
      if (!data.owner.email && !data.businessProfile.contactEmail) errors.push("Enter the account owner email.");
      if (!data.owner.name) errors.push("Enter the account owner name.");
    }
    if (stepId === "profile") {
      if (!data.businessProfile.businessName) errors.push("Enter your business name.");
      if (!data.businessProfile.industry) errors.push("Select your industry.");
      if (!data.businessProfile.contactEmail && !data.owner.email) errors.push("Enter a business contact email.");
      if (!data.businessProfile.legalReviewed) errors.push("Confirm the legal/company information provided is accurate to the best of your knowledge.");
    }
    if (stepId === "sales" && !data.crmSetup.pipelineStages.trim()) errors.push("Add at least one pipeline stage.");
    if (stepId === "plan") {
      if (!data.plan.trialPath) errors.push("Choose Managed Trial or BYOK Trial.");
      if (!data.plan.planSlug) errors.push("Select the post-trial plan.");
      if (!data.plan.stripeCardAcknowledged) errors.push("Acknowledge that Stripe card setup is required before trial start.");
      if (!data.plan.autoRenewAcknowledged) errors.push("Acknowledge that the selected plan renews after 14 days unless canceled.");
      if (data.plan.trialPath === "managed" && !data.plan.managedCapsAcknowledged) errors.push("Acknowledge managed trial hard caps.");
      if (data.plan.trialPath === "byok" && !data.plan.byokProviderCostAcknowledged) errors.push("Acknowledge that BYOK provider costs are paid directly to providers.");
    }
    if (stepId === "billing") {
      const billingStatus = snapshot?.billing?.status;
      const submitted = data.plan.billingIntent === "checkout_started" || data.plan.checkoutSessionId || ["pending_webhook", "checkout_created", "checkout_completed", "trialing", "active"].includes(billingStatus);
      if (!submitted) errors.push("Set up payment method with Stripe before continuing.");
    }
    if (stepId === "ai") {
      if (!data.ai.mode) errors.push("Choose an AI processing mode.");
      if (data.ai.mode === "byok" && !data.ai.provider) errors.push("Choose the BYOK AI provider you plan to use.");
    }
    if (stepId === "integrations") {
      if (!data.integrations.emailReviewChoice) errors.push("Choose how email integration should be handled.");
      if (!data.integrations.smsReviewChoice) errors.push("Choose how SMS integration should be handled.");
      if (!data.integrations.calendarMode) errors.push("Choose how calendar setup should be handled.");
    }
    if (stepId === "safety") {
      if (!data.automation.noAutoSendAck) errors.push("Acknowledge that onboarding will not auto-send customer messages or auto-charge outside Stripe Checkout.");
      if (data.integrations.smsMode !== "skip" && !data.automation.smsComplianceAck) errors.push("Acknowledge SMS consent and compliance requirements.");
    }
    return errors;
  }

  function goToStep(stepId: string) {
    const index = stepIndexById[stepId];
    if (index === undefined) return;
    if (index > maxUnlockedStep) {
      setError("Future steps unlock after you complete the current required step with Continue.");
      showToast("error", "Step locked", "Future steps unlock after you complete the current required step.");
      return;
    }
    setActiveStep(index);
  }

  function goToReadiness(check: any) {
    const targetStep = readinessStepMap[check.id] || "launch";
    goToStep(targetStep);
  }

  async function save(options: { silent?: boolean; complete?: boolean; includeCsv?: boolean; markStepComplete?: boolean; skippedOverride?: Record<string, boolean>; currentStepOverride?: string } = {}) {
    if (!sessionToken) return null;
    setSaving(true);
    setError("");
    setValidationErrors([]);
    if (!options.silent) setMessage("");

    const effectiveSkipped = options.skippedOverride || skippedSteps;
    const canMarkStepComplete = Boolean(options.markStepComplete || options.complete || effectiveSkipped[step.id]);
    const nextCompleted = canMarkStepComplete ? Array.from(new Set([...completedSteps, step.id])) : completedSteps;
    const currentStepForSave = options.currentStepOverride || step.id;
    const payloadWithProgress = {
      ...data,
      __onboardingProgress: {
        current_step: currentStepForSave,
        completed_steps: nextCompleted,
        skipped_steps: effectiveSkipped,
      },
    };

    const response = await fetch(options.complete ? "/api/onboarding/complete" : "/api/onboarding/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        payload: payloadWithProgress,
        completedSteps: nextCompleted,
        skippedSteps: effectiveSkipped,
        currentStep: currentStepForSave,
        complete: Boolean(options.complete),
        leadRows: options.includeCsv ? csvRows : [],
        importFileName: options.includeCsv ? csvFileName : null,
      }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok || !result.success) {
      setError(result.error || "Onboarding save failed.");
      showToast("error", "Save failed", result.error || "Onboarding save failed.");
      return null;
    }

    setWorkspaceId(result.workspace?.id || workspaceId);
    setOnboardingSession(result.session || onboardingSession);
    setReadiness(result.readiness || readiness);
    setSnapshot(result.snapshot || snapshot);
    setCompletedSteps(nextCompleted);
    setSkippedSteps(effectiveSkipped);
    setData((current) => ({
      ...current,
      ai: { ...current.ai, openaiKey: "", geminiKey: "", openrouterKey: "", anthropicKey: "" },
      integrations: { ...current.integrations, resendApiKey: "", twilioAuthToken: "", twilioAccountSid: "", ayrshareApiKey: "" },
    }));
    if (!options.silent) {
      setMessage(options.includeCsv && result.importResult ? `Saved. Imported ${result.importResult.imported_count} lead record(s).` : "Onboarding progress saved.");
      showToast("success", "Onboarding saved", options.includeCsv && result.importResult ? `Imported ${result.importResult.imported_count} lead record(s).` : undefined);
    }
    return result;
  }

  async function next() {
    const errors = validateStep();
    if (errors.length) {
      setValidationErrors(errors);
      setError("Please finish the required items before continuing.");
      showToast("error", "Required items missing", "Review the checklist before continuing.");
      return;
    }
    const nextStepId = steps[Math.min(activeStep + 1, steps.length - 1)]?.id || step.id;
    const result = await save({ silent: true, markStepComplete: true, currentStepOverride: nextStepId });
    if (result) setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function skipCurrent() {
    if (!optionalStepIds.has(step.id)) {
      setValidationErrors([`${step.label} is required before you can continue.`]);
      setError("This step is required and cannot be skipped.");
      showToast("error", "Required step", "This step is required before you can continue.");
      return;
    }
    setSkippedSteps((current) => ({ ...current, [step.id]: true }));
    const nextSkipped = { ...skippedSteps, [step.id]: true };
    const nextStepId = steps[Math.min(activeStep + 1, steps.length - 1)]?.id || step.id;
    save({ silent: true, markStepComplete: true, skippedOverride: nextSkipped, currentStepOverride: nextStepId }).then((result) => {
      if (result) setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    });
  }

  async function handleCsv(file?: File | null) {
    try {
      if (!file) return;
      const rows = parseCsv(await file.text());
      setCsvRows(rows);
      setCsvFileName(file.name);
      updateNested("leads", "setupMode", "csv");
      showToast("info", "CSV parsed", `${rows.length} row(s) ready to import. Use Import CSV to write them to the CRM.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse CSV.");
      showToast("error", "CSV parse failed", err instanceof Error ? err.message : "Could not parse CSV.");
    }
  }

  async function finishLater() {
    const result = await save({ silent: true });
    if (!result) return;
    showToast("success", "Progress saved", "Returning to the SynaptiReach site.");
    router.push("/");
  }

  function addManualServiceItem() {
    updateSection("serviceMenu", {
      manualItems: [
        ...data.serviceMenu.manualItems,
        { name: "", category: "", priceRange: "", duration: "", description: "", notes: "", enabled: true },
      ],
      notAvailable: false,
    });
  }

  function updateManualServiceItem(index: number, patch: Partial<WizardData["serviceMenu"]["manualItems"][number]>) {
    const manualItems = data.serviceMenu.manualItems.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item
    );
    updateSection("serviceMenu", { manualItems, notAvailable: manualItems.some((item) => item.name.trim()) ? false : data.serviceMenu.notAvailable });
  }

  function removeManualServiceItem(index: number) {
    updateSection("serviceMenu", {
      manualItems: data.serviceMenu.manualItems.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  async function handleMenuUpload(file?: File | null) {
    if (!file) return;
    setMenuUploading(true);
    setError("");
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/onboarding/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${sessionToken}` },
      body: form,
    });
    const result = await response.json().catch(() => ({}));
    setMenuUploading(false);
    if (!response.ok || !result.success) {
      setError(result.error || "Service/product menu upload failed.");
      showToast("error", "Menu upload failed", result.error || "Service/product menu upload failed.");
      return;
    }
    const fileRecord = result.file || {};
    updateSection("serviceMenu", {
      files: [...data.serviceMenu.files, fileRecord],
      notAvailable: false,
    });
    showToast("success", "Menu uploaded", result.message || "Service/product menu uploaded for pending analysis.");
  }

  async function startCheckout() {
    const saved = await save({ silent: true });
    if (!saved) return;
    setCheckoutBusy(true);
    setError("");
    const response = await fetch("/api/billing/subscription/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        plan: data.plan.planSlug,
        workspace_id: saved.workspace?.id || workspaceId,
        email: snapshot?.settings?.contact_email || data.businessProfile.contactEmail,
        name: data.businessProfile.businessName,
        trialPath: data.plan.trialPath,
        source: "onboarding",
        return_to: "onboarding",
        acknowledgements: {
          stripeCardAcknowledged: data.plan.stripeCardAcknowledged,
          autoRenewAcknowledged: data.plan.autoRenewAcknowledged,
          managedCapsAcknowledged: data.plan.managedCapsAcknowledged,
          byokProviderCostAcknowledged: data.plan.byokProviderCostAcknowledged,
        },
        usageCaps: data.plan.usageCaps,
        managedSms: data.plan.managedSms,
      }),
    });
    const result = await response.json();
    setCheckoutBusy(false);

    if (result.checkoutUrl) {
      updateSection("plan", { billingIntent: "checkout_started" });
      window.location.href = result.checkoutUrl;
      return;
    }

    setReadiness(result.readiness || readiness);
    setError(result.error || "Checkout is not ready yet. Billing can be completed later from Settings.");
    showToast("error", "Checkout unavailable", result.error || "Billing can be completed later from Settings.");
  }

  async function saveProviderTest(provider: string) {
    const result = await save({ silent: true });
    if (!result) return;
    const response = await fetch("/api/onboarding/provider-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ provider }),
    });
    const testResult = await response.json().catch(() => ({}));
    if (!response.ok || !testResult.success) {
      setError(testResult.error || `${provider} readiness check failed.`);
      showToast("error", `${provider} check failed`, testResult.error || "Readiness check failed.");
      return;
    }
    showToast("success", `${provider} setup saved`, testResult.message || "No customer-facing action was sent.");
  }

  async function refreshOnboardingState() {
    if (!sessionToken) return;
    const stripeSessionId = data.plan.checkoutSessionId || snapshot?.billing?.metadata?.stripe_session_id || snapshot?.billing?.metadata?.checkout_session_id;
    if (stripeSessionId) {
      const stripeResponse = await fetch("/api/onboarding/stripe-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ session_id: stripeSessionId }),
      }).catch(() => null);
      if (!stripeResponse) {
        setCheckoutStatusError("Could not reach the billing status check route. Retry in a moment.");
        showToast("error", "Billing status check failed", "Could not reach the status check route.");
        return;
      }
      const stripeResult = await stripeResponse.json().catch(() => ({}));
      if (!stripeResponse.ok || !stripeResult.success) {
        const detail = "Billing status check failed. Retry in a moment.";
        setCheckoutStatusError(detail);
        showToast("error", "Billing status check failed", detail);
        return;
      }
      setCheckoutStatusError("");
    }
    const response = await fetch("/api/onboarding/save", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      setError(result.error || "Could not refresh onboarding status.");
      showToast("error", "Refresh failed", result.error || "Could not refresh onboarding status.");
      return;
    }
    setOnboardingSession(result.session || onboardingSession);
    setReadiness(result.readiness || readiness);
    setSnapshot(result.snapshot || snapshot);
    if (result.payload) setData(mergePayload(result.payload));
    showToast("success", "Onboarding status refreshed");
  }

  async function activate() {
    const result = await save({ complete: true });
    if (result?.session?.completed) {
      router.push("/dashboard");
      return;
    }
    if (result) {
      const remaining = (result.readiness?.checks || []).filter((check: any) => check.status !== "complete" && check.status !== "skipped");
      setValidationErrors(remaining.map((check: any) => check.label));
      if (result.session?.metadata?.submitted_for_review) {
        router.push("/onboarding/status");
        return;
      }
      showToast("info", "Onboarding saved", "Select a missing readiness item to jump to the relevant step.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-white/[0.04] px-5 py-4">
          <Loader2 className="animate-spin text-cyan-200" size={18} />
          Loading onboarding state
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(74,222,128,0.10),transparent_30%)]" />
      {toast ? (
        <div className="fixed right-4 top-4 z-[80] w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-cyan-300/20 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl">
          <div className={`text-sm font-black ${toast.type === "error" ? "text-red-100" : toast.type === "success" ? "text-cyan-100" : "text-yellow-100"}`}>{toast.title}</div>
          {toast.detail ? <div className="mt-1 text-xs leading-relaxed text-slate-300">{toast.detail}</div> : null}
        </div>
      ) : null}

      <div className="relative mx-auto grid max-w-7xl min-w-0 gap-5 break-words lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="min-w-0 rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-4 backdrop-blur-xl">
          <div className="mb-5">
            <div className="text-2xl font-black tracking-tight">
              Synapti<span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">Reach</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">First-run CRM workspace setup</p>
          </div>

          <div className="mb-5 rounded-xl border border-white/10 bg-black/30 p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-green-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-slate-500">{completedSteps.length} of {steps.length} steps saved. Current step: {step.label}.</div>
          </div>

          <div className="space-y-1">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeStep;
              const done = completedSteps.includes(item.id);
              const locked = index > maxUnlockedStep;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (locked) {
                      setError("Future steps unlock after you complete the current required step.");
                      showToast("error", "Step locked", "Complete the current required step before jumping ahead.");
                      return;
                    }
                    setActiveStep(index);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                    active ? "border border-cyan-300/30 bg-cyan-300/10 text-cyan-50" : locked ? "cursor-not-allowed text-slate-600" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                  title={locked ? "Locked until previous required steps are complete." : item.label}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${done ? "bg-cyan-300/15 text-cyan-100" : "bg-white/[0.04]"}`}>
                    {done ? <Check size={16} /> : locked ? <Lock size={16} /> : <Icon size={16} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-400">
            Save/resume is backed by the real workspace onboarding session. Secrets are stored server-side only when submitted.
          </div>
        </aside>

        <section className="min-w-0 rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-5 backdrop-blur-xl md:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/70">Step {activeStep + 1} of {steps.length}</div>
              <h1 className="mt-2 text-2xl font-black md:text-3xl">{step.label}</h1>
              <p className="mt-1 text-sm text-slate-400">
                Prepare the CRM with real workspace state. Anything skipped remains visible as pending setup.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => save()}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-50 disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                Save
              </button>
              <button
                type="button"
                onClick={finishLater}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 disabled:opacity-60"
              >
                Finish Later
              </button>
            </div>
          </div>

          {error ? (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
              <AlertTriangle className="mt-0.5 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          ) : null}
          {message ? (
            <div className="mb-5 rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-50">{message}</div>
          ) : null}
          {validationErrors.length ? (
            <div className="mb-5 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
              <div className="mb-2 font-black">Required before continuing</div>
              <ul className="list-disc space-y-1 pl-5">
                {validationErrors.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}

          {step.id === "welcome" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h2 className="text-xl font-black">Choose the operating model</h2>
                <p className="mt-2 text-sm text-slate-400">
                  This only tunes setup defaults and readiness guidance. It does not create simulated CRM records.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {businessTypes.map(([id, label, description]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setData((current) => ({ ...current, businessType: id }))}
                    className={`rounded-2xl border p-4 text-left transition ${
                      data.businessType === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25"
                    }`}
                  >
                    <div className="font-black">{label}</div>
                    <p className="mt-2 text-sm text-slate-400">{description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step.id === "owner" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Owner name" required>
                <input className={inputClass()} value={data.owner.name} onChange={(event) => updateSection("owner", { name: event.target.value })} />
              </Field>
              <Field label="Owner role" optional>
                <input className={inputClass()} value={data.owner.role} onChange={(event) => updateSection("owner", { role: event.target.value })} />
              </Field>
              <Field label="Owner email" required>
                <input className={inputClass()} type="email" value={data.owner.email} onChange={(event) => updateSection("owner", { email: event.target.value })} />
              </Field>
              <Field label="Owner phone" optional>
                <input className={inputClass()} value={data.owner.phone} onChange={(event) => updateSection("owner", { phone: event.target.value })} />
              </Field>
              <div className="md:col-span-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50/80">
                Owner details are stored as onboarding metadata and used to prepare workspace ownership, notifications, and setup follow-up. They do not create fake staff records.
              </div>
            </div>
          ) : null}

          {step.id === "profile" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Business name" required>
                <input className={inputClass()} value={data.businessProfile.businessName} onChange={(event) => updateSection("businessProfile", { businessName: event.target.value })} />
              </Field>
              <Field label="Legal company name" optional>
                <input className={inputClass()} value={data.businessProfile.legalName} onChange={(event) => updateSection("businessProfile", { legalName: event.target.value })} />
              </Field>
              <Field label="Tax ID last 4 (optional)">
                <input className={inputClass()} value={data.businessProfile.taxIdLast4} maxLength={4} onChange={(event) => updateSection("businessProfile", { taxIdLast4: event.target.value.replace(/\D/g, "").slice(0, 4) })} />
              </Field>
              <Field label="Industry" required>
                <select className={inputClass()} value={data.businessProfile.industry} onChange={(event) => updateSection("businessProfile", { industry: event.target.value })}>
                  <option value="">Select industry</option>
                  {industries.map((industry) => <option key={industry}>{industry}</option>)}
                </select>
              </Field>
              <Field label="Service type" optional hint="What kind of work this CRM should expect. Example: emergency repair, appointment-based service, consultations, online orders.">
                <input className={inputClass()} placeholder="Emergency service, appointment-based, consultative, ecommerce..." value={data.businessProfile.serviceType} onChange={(event) => updateSection("businessProfile", { serviceType: event.target.value })} />
              </Field>
              <Field label="Main customer type" optional hint="Who usually buys from you. Example: homeowners, property managers, patients, small business owners, brides, contractors.">
                <input className={inputClass()} value={data.businessProfile.mainCustomerType} onChange={(event) => updateSection("businessProfile", { mainCustomerType: event.target.value })} placeholder="Example: homeowners and property managers" />
              </Field>
              <Field label="Contact email" required>
                <input className={inputClass()} value={data.businessProfile.contactEmail} onChange={(event) => updateSection("businessProfile", { contactEmail: event.target.value })} type="email" />
              </Field>
              <Field label="Phone" optional>
                <input className={inputClass()} value={data.businessProfile.phone} onChange={(event) => updateSection("businessProfile", { phone: event.target.value })} />
              </Field>
              <Field label="Website" optional>
                <input className={inputClass()} value={data.businessProfile.website} onChange={(event) => updateSection("businessProfile", { website: event.target.value })} />
              </Field>
              <Field label="Team size" optional>
                <input className={inputClass()} value={data.businessProfile.teamSize} onChange={(event) => updateSection("businessProfile", { teamSize: event.target.value })} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Address" optional>
                  <input className={inputClass()} value={data.businessProfile.address} onChange={(event) => updateSection("businessProfile", { address: event.target.value })} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Products and services" optional hint="Primary service/product categories and top services. This helps pre-configure CRM knowledge, workflows, and campaign ideas.">
                  <textarea className={inputClass()} rows={3} value={data.businessProfile.productsServices} onChange={(event) => updateSection("businessProfile", { productsServices: event.target.value })} placeholder="Example: haircuts, beard trims, color services, wedding styling, product sales." />
                </Field>
              </div>
              <Field label="Primary service/product categories" optional hint="Broad groups you sell. Example: repairs, installs, maintenance, consultations, retail products.">
                <input className={inputClass()} value={data.businessProfile.primaryCategories} onChange={(event) => updateSection("businessProfile", { primaryCategories: event.target.value })} placeholder="Example: repairs, maintenance, emergency calls" />
              </Field>
              <Field label="Top services/products" optional hint="The specific services customers ask for most often. These can become CRM tags, recommendations, and service/menu review context.">
                <input className={inputClass()} value={data.businessProfile.topServices} onChange={(event) => updateSection("businessProfile", { topServices: event.target.value })} placeholder="Example: drain cleaning, water heater install, annual maintenance" />
              </Field>
              <Field label="Service areas" optional>
                <input className={inputClass()} value={data.businessProfile.serviceAreas} onChange={(event) => updateSection("businessProfile", { serviceAreas: event.target.value })} placeholder="Cities, counties, regions, or online service area." />
              </Field>
              <Field label="Business hours" optional>
                <input className={inputClass()} value={data.businessProfile.businessHours} onChange={(event) => updateSection("businessProfile", { businessHours: event.target.value })} placeholder="Example: Mon-Fri 8am-5pm, emergency calls after hours." />
              </Field>
              <div className="md:col-span-2">
                <Field label="Target customer" optional>
                  <textarea className={inputClass()} rows={3} value={data.businessProfile.audience} onChange={(event) => updateSection("businessProfile", { audience: event.target.value })} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Common customer problems" optional hint="Problems people mention before they become leads. Example: broken AC, missed appointment, confusing pricing, urgent quote.">
                  <textarea className={inputClass()} rows={3} value={data.businessProfile.commonProblems} onChange={(event) => updateSection("businessProfile", { commonProblems: event.target.value })} placeholder="Issues customers mention before they become leads." />
                </Field>
              </div>
              <Field label="Common questions" optional hint="Questions are what customers ask before booking or buying.">
                <textarea className={inputClass()} rows={3} value={data.businessProfile.commonQuestions} onChange={(event) => updateSection("businessProfile", { commonQuestions: event.target.value })} placeholder="Example: How soon can you come out? Do you offer financing?" />
              </Field>
              <Field label="Common objections" optional hint="Objections are reasons customers hesitate.">
                <textarea className={inputClass()} rows={3} value={data.businessProfile.commonObjections} onChange={(event) => updateSection("businessProfile", { commonObjections: event.target.value })} placeholder="Example: too expensive, need to ask spouse, comparing quotes." />
              </Field>
              <Field label="Main offer" optional>
                <input className={inputClass()} value={data.businessProfile.mainOffer} onChange={(event) => updateSection("businessProfile", { mainOffer: event.target.value })} />
              </Field>
              <Field label="Preferred call to action" optional>
                <input className={inputClass()} value={data.businessProfile.preferredCta} onChange={(event) => updateSection("businessProfile", { preferredCta: event.target.value })} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Emergency or priority service rules" optional hint="When a lead should be treated as urgent. Example: same-day requests, safety issues, high-value jobs, existing customers.">
                  <textarea className={inputClass()} rows={3} value={data.businessProfile.emergencyPriorityRules} onChange={(event) => updateSection("businessProfile", { emergencyPriorityRules: event.target.value })} placeholder="Example: Emergency calls after hours should create an urgent owner task. VIP customers and active leaks get priority." />
                </Field>
              </div>
              <Field label="Pricing notes" optional>
                <textarea className={inputClass()} rows={3} value={data.businessProfile.pricingNotes} onChange={(event) => updateSection("businessProfile", { pricingNotes: event.target.value })} placeholder="Example: quote required, diagnostic fee applies, discounts need owner approval." />
              </Field>
              <Field label="Booking process" optional>
                <textarea className={inputClass()} rows={3} value={data.businessProfile.bookingProcess} onChange={(event) => updateSection("businessProfile", { bookingProcess: event.target.value })} placeholder="Example: collect address, preferred time, service type, and urgency before booking." />
              </Field>
              <Field label="Quote process" optional>
                <textarea className={inputClass()} rows={3} value={data.businessProfile.quoteProcess} onChange={(event) => updateSection("businessProfile", { quoteProcess: event.target.value })} placeholder="Example: estimates require photos or inspection; owner reviews final quote." />
              </Field>
              <Field label="Review request rules" optional>
                <textarea className={inputClass()} rows={3} value={data.businessProfile.reviewProcess} onChange={(event) => updateSection("businessProfile", { reviewProcess: event.target.value })} placeholder="Example: ask for reviews after completed service and confirmed satisfaction." />
              </Field>
              <div className="md:col-span-2">
                <Field label="Brand voice" optional>
                  <textarea className={inputClass()} rows={3} value={data.businessProfile.brandVoice} onChange={(event) => {
                    updateSection("businessProfile", { brandVoice: event.target.value });
                    updateSection("ai", { brandVoice: event.target.value });
                  }} />
                </Field>
              </div>
              <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
                <input type="checkbox" className="mt-1" checked={data.businessProfile.legalReviewed} onChange={(event) => updateSection("businessProfile", { legalReviewed: event.target.checked })} />
                <span>I confirm the legal/company information provided is accurate to the best of my knowledge. If something is missing, I understand SynaptiReach may request clarification before activation.</span>
              </label>
              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-2 font-black">Service/product menu upload</div>
                <p className="mb-3 text-sm text-slate-400">
                  Accepted: PDF, PNG, JPG/JPEG, WEBP. Uploads are stored for pending analysis and review; extraction is not marked successful until available.
                  SynaptiReach will look for service/product names, categories, price ranges, descriptions, durations, and notes.
                </p>
                <label className="flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-4 text-sm">
                  {menuUploading ? <Loader2 className="animate-spin text-cyan-200" size={18} /> : <FileUp className="text-cyan-200" size={18} />}
                  <span>{menuUploading ? "Uploading menu..." : "Upload service/product menu"}</span>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleMenuUpload(event.target.files?.[0])} />
                </label>
                <label className="mt-3 flex items-start gap-3 text-sm text-slate-300">
                  <input type="checkbox" className="mt-1" checked={data.serviceMenu.notAvailable} onChange={(event) => updateSection("serviceMenu", { notAvailable: event.target.checked })} />
                  <span>I do not have a service/product menu ready yet.</span>
                </label>
                {data.serviceMenu.files.length ? (
                  <div className="mt-3 space-y-2 text-xs text-slate-300">
                    {data.serviceMenu.files.map((file, index) => (
                      <div key={file.id || file.storage_path || index} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <span className="break-all font-bold text-white">{file.file_name || file.storage_path || "Uploaded menu"}</span>
                        <span className="ml-2 text-cyan-100">Analysis pending</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-black text-white">Manual services/products</div>
                      <p className="mt-1 text-xs text-slate-400">
                        Add the services or products customers can buy or book. These are saved as setup data for CRM recommendations; they are not fake customers, revenue, or completed jobs.
                      </p>
                    </div>
                    <button type="button" onClick={addManualServiceItem} className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-50">
                      Add service/product
                    </button>
                  </div>
                  <div className="mt-3 space-y-3">
                    {data.serviceMenu.manualItems.map((item, index) => (
                      <div key={index} className="grid gap-3 rounded-xl border border-white/10 bg-black/30 p-3 md:grid-cols-2">
                        <Field label="Service/product name" hint="The thing customers can buy or book. Example: Haircut, Roof Inspection, HVAC Tune-Up.">
                          <input className={inputClass()} value={item.name} onChange={(event) => updateManualServiceItem(index, { name: event.target.value })} placeholder="Example: HVAC Tune-Up" />
                        </Field>
                        <Field label="Category" optional hint="A group this belongs to. Example: Grooming, Repairs, Maintenance, Consulting.">
                          <input className={inputClass()} value={item.category} onChange={(event) => updateManualServiceItem(index, { category: event.target.value })} placeholder="Example: Maintenance" />
                        </Field>
                        <Field label="Price/range" optional hint="Use a normal price or estimate. Example: $45, $99-$149, quote required.">
                          <input className={inputClass()} value={item.priceRange} onChange={(event) => updateManualServiceItem(index, { priceRange: event.target.value })} placeholder="Example: $99-$149" />
                        </Field>
                        <Field label="Duration" optional hint="How long this usually takes. Example: 30 minutes, 2 hours, varies.">
                          <input className={inputClass()} value={item.duration} onChange={(event) => updateManualServiceItem(index, { duration: event.target.value })} placeholder="Example: 1 hour" />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="Description" optional hint="A short explanation customers or staff would understand.">
                            <textarea className={inputClass()} rows={2} value={item.description} onChange={(event) => updateManualServiceItem(index, { description: event.target.value })} placeholder="Example: Seasonal inspection and basic maintenance checklist." />
                          </Field>
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Notes" optional hint="Internal details SynaptiReach should know when helping build workflows, campaigns, or CRM recommendations.">
                            <textarea className={inputClass()} rows={2} value={item.notes} onChange={(event) => updateManualServiceItem(index, { notes: event.target.value })} placeholder="Example: Mention maintenance plan after this service; owner approves discounts." />
                          </Field>
                        </div>
                        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input type="checkbox" checked={item.enabled !== false} onChange={(event) => updateManualServiceItem(index, { enabled: event.target.checked })} />
                            <span>Active for setup</span>
                          </label>
                          <button type="button" onClick={() => removeManualServiceItem(index)} className="rounded-lg border border-red-300/20 px-3 py-2 text-xs font-bold text-red-100">
                            Remove row
                          </button>
                        </div>
                      </div>
                    ))}
                    {!data.serviceMenu.manualItems.length ? <div className="text-xs text-slate-500">No manual services/products added yet.</div> : null}
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">{serviceMenuStateLabel(data.serviceMenu)} You can also enter or edit services manually later.</p>
                <textarea className={`${inputClass()} mt-3`} rows={2} value={data.serviceMenu.notes} onChange={(event) => updateSection("serviceMenu", { notes: event.target.value })} placeholder="Optional notes for menu review or extraction, such as pricing rules or service names to double-check." />
              </div>
            </div>
          ) : null}

          {step.id === "sales" ? (
            <div className="space-y-4">
              <Field label="Sales process" optional>
                <textarea className={inputClass()} rows={4} value={data.crmSetup.salesProcess || data.businessProfile.salesProcess} onChange={(event) => {
                  updateSection("crmSetup", { salesProcess: event.target.value });
                  updateSection("businessProfile", { salesProcess: event.target.value });
                }} placeholder="Example: new inquiry, call, estimate, proposal, follow-up, won/lost." />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Pipeline stages" required hint="Pipeline stage means the steps a lead or deal moves through before becoming a customer. Example: New Lead > Contacted > Estimate Sent > Won.">
                  <textarea className={inputClass()} rows={4} value={data.crmSetup.pipelineStages} onChange={(event) => updateSection("crmSetup", { pipelineStages: event.target.value })} />
                </Field>
                <Field label="Lead statuses" optional hint="Status describes where a lead stands right now. Example: new, contacted, qualified, nurture, converted, lost.">
                  <textarea className={inputClass()} rows={4} value={data.crmSetup.leadStatuses} onChange={(event) => updateSection("crmSetup", { leadStatuses: event.target.value })} />
                </Field>
                <Field label="Lead sources" optional hint="Lead source means where new leads usually come from. Example: Google, Facebook, referrals, website, cold outreach, trade shows.">
                  <textarea className={inputClass()} rows={4} value={data.crmSetup.leadSources} onChange={(event) => updateSection("crmSetup", { leadSources: event.target.value })} />
                </Field>
                <Field label="Useful lead tags" optional>
                  <textarea className={inputClass()} rows={4} value={data.crmSetup.leadTags} onChange={(event) => updateSection("crmSetup", { leadTags: event.target.value })} />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Typical deal value" optional hint="About how much a normal customer/job is worth. Example: if most jobs are around $750, enter 750.">
                  <input className={inputClass()} value={data.crmSetup.typicalDealValue} onChange={(event) => updateSection("crmSetup", { typicalDealValue: event.target.value })} placeholder="Example: 750" />
                </Field>
                <Field label="Average close time" optional>
                  <input className={inputClass()} value={data.crmSetup.averageCloseTime} onChange={(event) => updateSection("crmSetup", { averageCloseTime: event.target.value })} placeholder="Example: 3 days, 2 weeks, same day" />
                </Field>
                <Field label="Stale lead threshold" optional hint="When the CRM should flag a lead as going cold because nobody followed up.">
                  <input className={inputClass()} value={data.crmSetup.staleLeadThreshold} onChange={(event) => updateSection("crmSetup", { staleLeadThreshold: event.target.value })} placeholder="Example: 7 days" />
                </Field>
                <Field label="Stale deal threshold" optional hint="When an open deal should be flagged because it has not moved forward.">
                  <input className={inputClass()} value={data.crmSetup.staleDealThreshold} onChange={(event) => updateSection("crmSetup", { staleDealThreshold: event.target.value })} placeholder="Example: 14 days" />
                </Field>
                <Field label="Follow-up timing" optional hint="How soon the team should follow up after a new lead, quote, appointment, or missed response.">
                  <textarea className={inputClass()} rows={3} value={data.crmSetup.followUpTiming} onChange={(event) => updateSection("crmSetup", { followUpTiming: event.target.value })} placeholder="Example: call new leads within 5 minutes during business hours; follow up on estimates after 2 days." />
                </Field>
                <Field label="Owner assignment preference" optional hint="How leads or tasks should be assigned. Example: round-robin, by service area, owner handles VIP leads.">
                  <textarea className={inputClass()} rows={3} value={data.crmSetup.ownerAssignmentPreference} onChange={(event) => updateSection("crmSetup", { ownerAssignmentPreference: event.target.value })} placeholder="Example: assign emergency requests to the owner; route maintenance leads to the service coordinator." />
                </Field>
                <Field label="Appointment types" optional>
                  <textarea className={inputClass()} rows={3} value={data.crmSetup.appointmentTypes} onChange={(event) => updateSection("crmSetup", { appointmentTypes: event.target.value })} />
                </Field>
                <Field label="Default task types" optional>
                  <textarea className={inputClass()} rows={3} value={data.crmSetup.defaultTaskTypes} onChange={(event) => updateSection("crmSetup", { defaultTaskTypes: event.target.value })} />
                </Field>
                <Field label="Priority rules" optional>
                  <textarea className={inputClass()} rows={4} value={data.crmSetup.priorityRules} onChange={(event) => updateSection("crmSetup", { priorityRules: event.target.value })} placeholder="How leads should be prioritized or escalated." />
                </Field>
                <Field label="Assignment rules" optional>
                  <textarea className={inputClass()} rows={4} value={data.crmSetup.assignmentRules} onChange={(event) => updateSection("crmSetup", { assignmentRules: event.target.value })} placeholder="How leads or tasks should be assigned to owners or staff." />
                </Field>
                <Field label="Won reasons" optional>
                  <textarea className={inputClass()} rows={4} value={data.crmSetup.wonReasons} onChange={(event) => updateSection("crmSetup", { wonReasons: event.target.value })} placeholder="Common reasons deals are won." />
                </Field>
                <Field label="Lost reasons" optional>
                  <textarea className={inputClass()} rows={4} value={data.crmSetup.lostReasons} onChange={(event) => updateSection("crmSetup", { lostReasons: event.target.value })} placeholder="Common reasons deals are lost." />
                </Field>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50/80">
                These defaults configure CRM settings, workflow drafts, analytics preferences, and required-field guidance. They do not create fake deals or activity.
              </div>
            </div>
          ) : null}

          {step.id === "plan" ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    updateSection("plan", {
                      trialPath: "managed",
                      planSlug: data.plan.planSlug.endsWith("-byok") ? "growth-managed" : data.plan.planSlug,
                      usageCaps: { ...initialData.plan.usageCaps },
                    });
                    updateSection("ai", { mode: "managed" });
                  }}
                  className={`rounded-2xl border p-5 text-left ${data.plan.trialPath === "managed" ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"}`}
                >
                  <div className="text-xl font-black">SynaptiReach-Managed Trial</div>
                  <p className="mt-2 text-sm text-slate-400">Full software access with hard free caps for managed AI, email, contacts, workflows, and AI review checks. Card required before trial starts.</p>
                  <div className="mt-4 grid gap-2 text-xs text-slate-300">
                    {managedTrialCaps.map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2"><span>{label}</span><span className="font-bold text-white">{value}</span></div>
                    ))}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateSection("plan", {
                      trialPath: "byok",
                      planSlug: data.plan.planSlug.endsWith("-managed") ? "growth-byok" : data.plan.planSlug,
                      usageCaps: { ...data.plan.usageCaps, selfImposedCaps: true },
                    });
                    updateSection("ai", { mode: "byok" });
                  }}
                  className={`rounded-2xl border p-5 text-left ${data.plan.trialPath === "byok" ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"}`}
                >
                  <div className="text-xl font-black">BYOK Trial</div>
                  <div className="mt-3 space-y-2 text-sm text-slate-400">
                    {byokTrialNotes.map((note) => <p key={note}>{note}</p>)}
                  </div>
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {SUBSCRIPTION_PLANS.filter((plan) => data.plan.trialPath ? plan.billingMode === data.plan.trialPath : true).map((plan) => (
                  <button
                    key={plan.slug}
                    type="button"
                    onClick={() => updateSection("plan", { planSlug: plan.slug })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      data.plan.planSlug === plan.slug ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black">{plan.name}</div>
                        <div className="mt-1 text-sm font-bold text-cyan-100">{plan.price}</div>
                      </div>
                      {plan.popular ? <span className="rounded-full border border-cyan-300/30 px-2 py-1 text-[10px] font-black text-cyan-100">POPULAR</span> : null}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{plan.contacts} contacts, {plan.aiActions} AI actions, {plan.workflowRuns} workflows.</p>
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-black">Selected: {selectedPlan?.name || "None"}</div>
                <p className="mt-1 text-sm text-slate-400">
                  This is the paid plan that starts after the 14-day trial unless canceled before trial end. Onboarding stores plan intent only; Stripe Checkout/webhook owns paid or subscribed state.
                </p>
              </div>
              <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
                <div className="font-black text-yellow-50">Post-trial plan fit</div>
                <p className="mt-1 text-sm text-yellow-50/75">
                  Trial access is broad, but the selected post-trial plan controls limits after the 14-day trial. SynaptiReach does not delete existing CRM data when a lower tier applies; it restricts future usage beyond the cap and shows upgrade or credit-pack paths where eligible.
                </p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {postTrialFitChecks.map(([label, trialValue, detail]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-yellow-50/80">
                      <div className="font-black text-white">{label}</div>
                      <div className="mt-1">{trialValue}</div>
                      <div className="mt-1 text-yellow-50/60">{detail}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["stripeCardAcknowledged", "I understand a card is required in Stripe before the trial starts."],
                  ["autoRenewAcknowledged", "I understand the selected plan renews automatically after 14 days unless canceled before trial end."],
                  ["managedCapsAcknowledged", "For managed trials, AI/email/SMS/contact/workflow/review-check caps hard-stop those features until a credit pack or paid capacity is available."],
                  ["byokProviderCostAcknowledged", "For BYOK trials, I pay provider usage directly and may set optional self-imposed caps."],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                    <input type="checkbox" className="mt-1" checked={Boolean((data.plan as any)[key])} onChange={(event) => updateSection("plan", { [key]: event.target.checked } as any)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {step.id === "billing" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50/80">
                A Stripe payment method is required before trial activation because the trial auto-renews to the selected plan after 14 days unless canceled. Usage caps and credit packs apply. Payment is processed securely by Stripe, and SynaptiReach employees never see, receive, or have access to your card number, CVC, or card details.
              </div>
              {snapshot?.billing?.status || data.plan.checkoutSessionId ? (
                <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50/85">
                  <div className="font-black">
                    {["trialing", "active", "checkout_completed"].includes(snapshot?.billing?.status) ? "Payment method on file." : "Checkout Submitted. Waiting Confirmation & Review."}
                  </div>
                  <p className="mt-1">Billing Status: {["trialing", "active", "checkout_completed"].includes(snapshot?.billing?.status) ? "Confirmed" : "Pending"}.</p>
                  <button type="button" onClick={refreshOnboardingState} className="mt-3 rounded-xl border border-yellow-200/30 px-3 py-2 text-xs font-black text-yellow-50">
                    Refresh billing status
                  </button>
                </div>
              ) : null}
              {checkoutStatusError ? (
                <div className="rounded-2xl border border-red-300/25 bg-red-500/10 p-4 text-sm text-red-100">
                  <div className="font-black">Billing status check needs a retry</div>
                  <p className="mt-1">{checkoutStatusError}</p>
                  <button type="button" onClick={refreshOnboardingState} className="mt-3 rounded-xl border border-red-200/30 px-3 py-2 text-xs font-black text-red-50">
                    Retry status check
                  </button>
                </div>
              ) : null}
              {[
                ["start_trial", "Start 14-day trial through Stripe", "Creates a Stripe Checkout session with a 14-day trial for the selected post-trial plan."],
                ["checkout_now", "Set up billing now", "Use Stripe Checkout for secure payment setup. No card data touches SynaptiReach."],
              ].map(([id, label, description]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => updateSection("plan", { billingIntent: id as any })}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    data.plan.billingIntent === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25"
                  }`}
                >
                  <div className="font-black">{label}</div>
                  <p className="mt-1 text-sm text-slate-400">{description}</p>
                </button>
              ))}
              <button
                type="button"
                onClick={startCheckout}
                disabled={checkoutBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-3 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutBusy ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                Set up payment method with Stripe
              </button>
              {data.plan.trialPath === "managed" ? (
                <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
                  <div className="font-black text-yellow-50">Managed SMS readiness</div>
                  <p className="mt-1 text-sm text-yellow-50/75">Managed SMS is optional and approval-based. It requires approval for estimated Twilio/carrier registration and messaging costs, plus a SynaptiReach $20 setup fee, before readiness is marked complete.</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    {[
                      ["requested", "Request managed SMS review"],
                      ["carrierFeeApproval", "Approve estimated Twilio/carrier fees"],
                      ["setupFeeApproval", "Approve SynaptiReach $20 setup fee"],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-yellow-50/80">
                        <input type="checkbox" className="mt-0.5" checked={Boolean((data.plan.managedSms as any)[key])} onChange={(event) => updateSection("plan", { managedSms: { ...data.plan.managedSms, [key]: event.target.checked } })} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
              {data.plan.trialPath === "byok" ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-3 font-black">Optional self-imposed BYOK safety caps</div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {(["aiActions", "emails", "sms", "contacts", "workflows", "agents"] as const).map((key) => (
                      <Field key={key} label={key === "agents" ? "AI review checks" : key}>
                        <input className={inputClass()} value={data.plan.usageCaps[key]} onChange={(event) => updateSection("plan", { usageCaps: { ...data.plan.usageCaps, selfImposedCaps: true, [key]: event.target.value } })} />
                      </Field>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step.id === "ai" ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["managed", "SynaptiReach Managed", "Use platform-managed AI capacity when available."],
                  ["byok", "Bring Your Own Keys", "Store provider keys encrypted server-side."],
                ].map(([id, label, description]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateSection("ai", { mode: id as any })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      data.ai.mode === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25"
                    }`}
                  >
                    <div className="font-black">{label}</div>
                    <p className="mt-1 text-sm text-slate-400">{description}</p>
                  </button>
                ))}
              </div>
              {data.ai.mode === "byok" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Provider">
                    <select className={inputClass()} value={data.ai.provider} onChange={(event) => updateSection("ai", { provider: event.target.value })}>
                      <option value="">Select provider</option>
                      <option value="gemini">Gemini</option>
                      <option value="openrouter">OpenRouter</option>
                      <option value="openai">OpenAI, only if enabled by SynaptiReach</option>
                    </select>
                  </Field>
                  <Field label="Model">
                    <input className={inputClass()} value={data.ai.model} onChange={(event) => updateSection("ai", { model: event.target.value })} />
                  </Field>
                  <Field label="OpenAI key">
                    <input className={inputClass()} type="password" value={data.ai.openaiKey} onChange={(event) => updateSection("ai", { openaiKey: event.target.value })} />
                  </Field>
                  <Field label="Gemini key">
                    <input className={inputClass()} type="password" value={data.ai.geminiKey} onChange={(event) => updateSection("ai", { geminiKey: event.target.value })} />
                  </Field>
                  <Field label="OpenRouter key">
                    <input className={inputClass()} type="password" value={data.ai.openrouterKey} onChange={(event) => updateSection("ai", { openrouterKey: event.target.value })} />
                  </Field>
                  <Field label="Anthropic key">
                    <input className={inputClass()} type="password" value={data.ai.anthropicKey} onChange={(event) => updateSection("ai", { anthropicKey: event.target.value })} />
                  </Field>
                  <div className="md:col-span-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50/80">
                    <div className="font-black text-white">Provider test safety</div>
                    <p className="mt-1">
                      Test connection saves the encrypted provider setup state and checks onboarding readiness. It does not send a real campaign, email, SMS, or social post.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Gemini", "OpenRouter", "OpenAI"].map((provider) => (
                        <button key={provider} type="button" onClick={() => saveProviderTest(provider)} className="rounded-xl border border-cyan-300/25 px-3 py-2 text-xs font-black text-cyan-50">
                          Test {provider}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="grid gap-3 md:grid-cols-3">
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                  <input type="checkbox" className="mt-1" checked={data.ai.useRuleBasedFirst} onChange={(event) => updateSection("ai", { useRuleBasedFirst: event.target.checked })} />
                  <span>Use built-in rule-based intelligence before external AI.</span>
                </label>
                <Field label="Intelligence style" hint="How assertive CRM Intelligence should be when recommending next steps. Conservative means fewer, safer suggestions.">
                  <select className={inputClass()} value={data.ai.intelligencePreference} onChange={(event) => updateSection("ai", { intelligencePreference: event.target.value as any })}>
                    <option value="conservative">Conservative</option>
                    <option value="balanced">Balanced</option>
                    <option value="proactive">Proactive</option>
                  </select>
                </Field>
                <Field label="AI review risk tolerance" hint="How cautious AI reviews should be before a message or recommendation is considered ready for human approval.">
                  <select className={inputClass()} value={data.ai.riskTolerance} onChange={(event) => updateSection("ai", { riskTolerance: event.target.value as any })}>
                    <option value="strict">Strict</option>
                    <option value="balanced">Balanced</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </Field>
                <Field label="Assistant tone">
                  <select className={inputClass()} value={data.ai.tone} onChange={(event) => updateSection("ai", { tone: event.target.value })}>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="direct">Direct</option>
                    <option value="consultative">Consultative</option>
                  </select>
                </Field>
              </div>
              <Field label="Brand voice">
                <textarea className={inputClass()} rows={3} value={data.ai.brandVoice} onChange={(event) => updateSection("ai", { brandVoice: event.target.value })} />
              </Field>
              <Field label="AI recommendation behavior">
                <textarea className={inputClass()} rows={3} value={data.ai.assistantBehavior} onChange={(event) => updateSection("ai", { assistantBehavior: event.target.value })} />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Topics AI should avoid" optional hint="Subjects the CRM should not draft or recommend without extra review. Example: legal claims, medical advice, discounts, guarantees.">
                  <textarea className={inputClass()} rows={3} value={data.ai.topicsToAvoid} onChange={(event) => updateSection("ai", { topicsToAvoid: event.target.value })} placeholder="Example: do not promise guaranteed results, quote final prices, or discuss refunds without owner review." />
                </Field>
                <Field label="AI action preference" hint="Choose whether AI should prepare draft messages or only recommend internal tasks. External sends remain review-gated either way.">
                  <select className={inputClass()} value={data.ai.draftMode} onChange={(event) => updateSection("ai", { draftMode: event.target.value as any })}>
                    <option value="draft_messages">Draft messages for review</option>
                    <option value="recommend_tasks_only">Recommend tasks only</option>
                  </select>
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email style" optional>
                  <textarea className={inputClass()} rows={3} value={data.communications.emailStyle} onChange={(event) => updateSection("communications", { emailStyle: event.target.value })} />
                </Field>
                <Field label="SMS style" optional>
                  <textarea className={inputClass()} rows={3} value={data.communications.smsStyle} onChange={(event) => updateSection("communications", { smsStyle: event.target.value })} />
                </Field>
                <Field label="Common questions" optional>
                  <textarea className={inputClass()} rows={4} value={data.communications.commonQuestions} onChange={(event) => updateSection("communications", { commonQuestions: event.target.value })} />
                </Field>
                <Field label="Common objections" optional>
                  <textarea className={inputClass()} rows={4} value={data.communications.commonObjections} onChange={(event) => updateSection("communications", { commonObjections: event.target.value })} />
                </Field>
                <Field label="Escalation rules" optional>
                  <textarea className={inputClass()} rows={4} value={data.communications.escalationRules} onChange={(event) => updateSection("communications", { escalationRules: event.target.value })} placeholder="Example: send refund requests or legal concerns to the owner." />
                </Field>
                <Field label="Response time expectations" optional>
                  <textarea className={inputClass()} rows={4} value={data.communications.responseTimeExpectation} onChange={(event) => updateSection("communications", { responseTimeExpectation: event.target.value })} placeholder="Example: respond to new leads within one business day." />
                </Field>
                <Field label="Do-not-contact preferences" optional>
                  <textarea className={inputClass()} rows={4} value={data.communications.doNotContactPreferences} onChange={(event) => updateSection("communications", { doNotContactPreferences: event.target.value })} placeholder="Example: no SMS without explicit consent; avoid Sundays." />
                </Field>
                <Field label="Disclaimers or restricted claims" optional>
                  <textarea className={inputClass()} rows={4} value={data.communications.disclaimers} onChange={(event) => updateSection("communications", { disclaimers: event.target.value })} placeholder="Example: do not promise guaranteed results or final prices." />
                </Field>
              </div>
            </div>
          ) : null}

          {step.id === "integrations" ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="font-black">Email</h2>
                <select className={inputClass()} value={data.integrations.emailReviewChoice} onChange={(event) => {
                  const choice = event.target.value as any;
                  updateSection("integrations", {
                    emailReviewChoice: choice,
                    emailReviewed: Boolean(choice),
                    emailMode: choice === "managed_later" ? "managed" : choice === "byok_later" || choice === "setup_now" ? "byok" : choice === "not_using" ? "skip" : choice === "reviewed_later" ? data.integrations.emailMode : data.integrations.emailMode,
                  });
                }}>
                  <option value="">Email integration reviewed</option>
                  <option value="setup_now">Set up now</option>
                  <option value="managed_later">Use SynaptiReach-managed setup later</option>
                  <option value="byok_later">BYOK setup later</option>
                  <option value="reviewed_later">Reviewed / handle later</option>
                  <option value="not_using">Not using this yet</option>
                </select>
                <select className={inputClass()} value={data.integrations.emailMode} onChange={(event) => updateSection("integrations", { emailMode: event.target.value as any })}>
                  <option value="">Choose email setup</option>
                  <option value="managed">Managed email, verify domain later</option>
                  <option value="byok">Use my Resend key</option>
                  <option value="skip">Skip for now</option>
                </select>
                <input className={inputClass()} placeholder="Sender email" value={data.integrations.senderEmail} onChange={(event) => updateSection("integrations", { senderEmail: event.target.value })} />
                {data.integrations.emailMode === "byok" ? <input className={inputClass()} type="password" placeholder="Resend API key" value={data.integrations.resendApiKey} onChange={(event) => updateSection("integrations", { resendApiKey: event.target.value })} /> : null}
                <button type="button" onClick={() => saveProviderTest("Resend")} className="rounded-xl border border-cyan-300/20 px-3 py-2 text-xs font-black text-cyan-50">
                  Test Resend
                </button>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="font-black">SMS</h2>
                <select className={inputClass()} value={data.integrations.smsReviewChoice} onChange={(event) => {
                  const choice = event.target.value as any;
                  updateSection("integrations", {
                    smsReviewChoice: choice,
                    smsReviewed: Boolean(choice),
                    smsMode: choice === "managed_later" ? "managed" : choice === "byok_later" || choice === "setup_now" ? "byok" : choice === "not_using" ? "skip" : choice === "reviewed_later" ? data.integrations.smsMode : data.integrations.smsMode,
                  });
                }}>
                  <option value="">SMS integration reviewed</option>
                  <option value="setup_now">Set up now</option>
                  <option value="managed_later">Use SynaptiReach-managed setup later</option>
                  <option value="byok_later">BYOK setup later</option>
                  <option value="reviewed_later">Reviewed / handle later</option>
                  <option value="not_using">Not using this yet</option>
                </select>
                <select className={inputClass()} value={data.integrations.smsMode} onChange={(event) => updateSection("integrations", { smsMode: event.target.value as any })}>
                  <option value="">Choose SMS setup</option>
                  <option value="managed">Managed SMS, compliance review required</option>
                  <option value="byok">Use my Twilio account</option>
                  <option value="skip">Skip for now</option>
                </select>
                {data.integrations.smsMode === "byok" ? (
                  <>
                    <input className={inputClass()} placeholder="Twilio Account SID" value={data.integrations.twilioAccountSid} onChange={(event) => updateSection("integrations", { twilioAccountSid: event.target.value })} />
                    <input className={inputClass()} type="password" placeholder="Twilio Auth Token" value={data.integrations.twilioAuthToken} onChange={(event) => updateSection("integrations", { twilioAuthToken: event.target.value })} />
                    <input className={inputClass()} placeholder="Twilio From Number" value={data.integrations.twilioFromNumber} onChange={(event) => updateSection("integrations", { twilioFromNumber: event.target.value })} />
                    <button type="button" onClick={() => saveProviderTest("Twilio")} className="rounded-xl border border-cyan-300/20 px-3 py-2 text-xs font-black text-cyan-50">
                      Test Twilio
                    </button>
                  </>
                ) : null}
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="font-black">Social</h2>
                <select className={inputClass()} value={data.integrations.socialMode} onChange={(event) => updateSection("integrations", { socialMode: event.target.value as any })}>
                  <option value="">Choose social setup</option>
                  <option value="connect">Prepare social connection</option>
                  <option value="skip">Skip for now</option>
                </select>
                <input className={inputClass()} type="password" placeholder="Ayrshare key, optional" value={data.integrations.ayrshareApiKey} onChange={(event) => updateSection("integrations", { ayrshareApiKey: event.target.value })} />
                <button type="button" onClick={() => saveProviderTest("Ayrshare")} className="rounded-xl border border-cyan-300/20 px-3 py-2 text-xs font-black text-cyan-50">
                  Test Ayrshare
                </button>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <h2 className="font-black">Calendar</h2>
                <select className={inputClass()} value={data.integrations.calendarMode} onChange={(event) => updateSection("integrations", { calendarMode: event.target.value as any })}>
                  <option value="">Choose calendar setup</option>
                  <option value="google_later">Prepare Google Calendar connection</option>
                  <option value="internal_only">Use internal CRM calendar only</option>
                  <option value="help">Needs SynaptiReach help setting this up</option>
                </select>
                <p className="text-sm text-slate-400">OAuth connection is completed later from provider settings.</p>
                <input className={inputClass()} placeholder="Appointment types" value={data.calendar.appointmentTypes} onChange={(event) => updateSection("calendar", { appointmentTypes: event.target.value })} />
                <input className={inputClass()} placeholder="Default duration" value={data.calendar.defaultDuration} onChange={(event) => updateSection("calendar", { defaultDuration: event.target.value })} />
                <input className={inputClass()} placeholder="Reminder timing, example: 24 hours and 2 hours before" value={data.calendar.reminderTiming} onChange={(event) => updateSection("calendar", { reminderTiming: event.target.value })} />
                <textarea className={inputClass()} rows={3} placeholder="Availability notes, example: weekdays only, emergency slots, service areas by day" value={data.calendar.availabilityNotes} onChange={(event) => updateSection("calendar", { availabilityNotes: event.target.value })} />
                <input className={inputClass()} placeholder="Booking window, example: next 14 days, weekdays only" value={data.calendar.bookingWindow} onChange={(event) => updateSection("calendar", { bookingWindow: event.target.value })} />
                <textarea className={inputClass()} rows={3} placeholder="Reminder preferences, example: internal reminder first; customer messages require approval" value={data.calendar.reminderPreferences} onChange={(event) => updateSection("calendar", { reminderPreferences: event.target.value })} />
                <textarea className={inputClass()} rows={3} placeholder="No-show preference, example: create reschedule task for owner review" value={data.calendar.noShowPreference} onChange={(event) => updateSection("calendar", { noShowPreference: event.target.value })} />
                <textarea className={inputClass()} rows={3} placeholder="Confirmation workflow, example: confirm details before sending customer-facing messages" value={data.calendar.confirmationWorkflow} onChange={(event) => updateSection("calendar", { confirmationWorkflow: event.target.value })} />
                <label className="flex items-start gap-2 text-sm text-slate-300">
                  <input type="checkbox" className="mt-1" checked={data.integrations.calendarRequiredForLaunch} onChange={(event) => updateSection("integrations", { calendarRequiredForLaunch: event.target.checked })} />
                  <span>Calendar connection is required before my launch.</span>
                </label>
              </div>
            </div>
          ) : null}

          {step.id === "leads" ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["csv", "Import CSV"],
                  ["manual", "Create starter lead"],
                  ["skip", "Start empty"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateNested("leads", "setupMode", id as any)}
                    className={`rounded-2xl border p-4 text-left font-black ${
                      data.leads.setupMode === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {data.leads.setupMode === "csv" ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-4">
                    <FileUp className="text-cyan-200" />
                    <span className="text-sm">{csvFileName || "Choose CSV file"}</span>
                    <input type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => handleCsv(event.target.files?.[0])} />
                  </label>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-400">
                    <span>{csvRows.length} row(s) parsed</span>
                    <button type="button" onClick={() => save({ includeCsv: true })} disabled={csvRows.length === 0 || saving} className="rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-2 font-black text-black disabled:opacity-50">
                      Import CSV
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    Accepted CSV headers include name, email, phone, company, source, status, notes, tags, owner, value, and next_step. A starter lead can satisfy launch readiness without requiring CSV import.
                  </p>
                  <Field label="CSV mapping notes">
                    <textarea className={`${inputClass()} mt-3`} rows={3} value={data.leads.csvMappingNotes} onChange={(event) => updateSection("leads", { csvMappingNotes: event.target.value })} placeholder="Example: map Customer Name to name, Job Type to tags, Lead Source to source." />
                  </Field>
                </div>
              ) : null}
              {data.leads.setupMode === "manual" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {(["name", "email", "phone", "company"] as const).map((key) => (
                    <Field key={key} label={`Starter lead ${key}`}>
                      <input className={inputClass()} value={textValue(data.leads.starterLead[key])} onChange={(event) => updateSection("leads", { starterLead: { ...data.leads.starterLead, [key]: event.target.value } })} />
                    </Field>
                  ))}
                  <div className="md:col-span-2">
                    <Field label="Notes">
                      <textarea className={inputClass()} rows={3} value={data.leads.starterLead.notes} onChange={(event) => updateSection("leads", { starterLead: { ...data.leads.starterLead, notes: event.target.value } })} />
                    </Field>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step.id === "staff" ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["invite", "Invite staff later"],
                  ["solo", "Solo workspace for now"],
                ].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => updateNested("staff", "setupMode", id as any)} className={`rounded-2xl border p-4 text-left font-black ${data.staff.setupMode === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"}`}>{label}</button>
                ))}
              </div>
              <div className="space-y-3">
                  {data.staff.members.map((member, index) => (
                    <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-4">
                      {(["name", "email", "phone", "title"] as const).map((key) => (
                        <input
                          key={key}
                          className={inputClass()}
                          placeholder={key}
                          value={member[key]}
                          onChange={(event) => {
                            const members = [...data.staff.members];
                            members[index] = { ...members[index], [key]: event.target.value };
                            updateSection("staff", { members });
                          }}
                        />
                      ))}
                      <select
                        className={`${inputClass()} md:col-span-4`}
                        defaultValue=""
                        onChange={(event) => {
                          const permissions = staffPermissionPresets[event.target.value] || [];
                          const members = [...data.staff.members];
                          members[index] = { ...members[index], permissions };
                          updateSection("staff", { members });
                          event.currentTarget.value = "";
                        }}
                      >
                        <option value="">Apply permission preset</option>
                        {Object.keys(staffPermissionPresets).map((preset) => <option key={preset} value={preset}>{preset}</option>)}
                      </select>
                      <div className="md:col-span-4 flex flex-wrap gap-2">
                        {["leads", "pipeline", "tasks", "calendar", "communications", "marketing", "workflow", "settings_read", "admin"].map((permission) => (
                          <label key={permission} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={(member.permissions || []).includes(permission)}
                              onChange={() => {
                                const members = [...data.staff.members];
                                const permissions = member.permissions || [];
                                members[index] = {
                                  ...members[index],
                                  permissions: permissions.includes(permission) ? permissions.filter((item) => item !== permission) : [...permissions, permission],
                                };
                                updateSection("staff", { members });
                              }}
                            />
                            {permission.replace(/_/g, " ")}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => updateSection("staff", { members: [...data.staff.members, { name: "", email: "", phone: "", title: "", permissions: ["leads", "tasks"] }] })} className="rounded-xl border border-cyan-300/20 px-4 py-2 text-sm font-bold text-cyan-50">
                    Add another
                  </button>
              </div>
            </div>
          ) : null}

          {step.id === "marketing" ? (
            <div className="space-y-5">
              <Field label="Starter campaign strategy">
                <select className={inputClass()} value={data.marketing.strategy} onChange={(event) => updateSection("marketing", { strategy: event.target.value })}>
                  {marketingStrategies.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-3 font-black">Marketing goals</div>
                  {["lead_nurture", "reactivation", "reviews", "promotions", "appointment_booking", "referrals"].map((goal) => (
                    <label key={goal} className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                      <input type="checkbox" checked={data.marketing.goals.includes(goal)} onChange={() => toggleList("marketing", "goals", goal)} />
                      {goal.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-3 font-black">Channels to prepare</div>
                  {["email", "sms", "social", "calls", "internal_notes"].map((channel) => (
                    <label key={channel} className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                      <input type="checkbox" checked={data.marketing.channels.includes(channel)} onChange={() => toggleList("marketing", "channels", channel)} />
                      {channel.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
              <Field label="First campaign idea">
                <textarea className={inputClass()} rows={3} value={data.marketing.firstCampaignIdea} onChange={(event) => updateSection("marketing", { firstCampaignIdea: event.target.value })} placeholder="Example: follow up with qualified leads who requested estimates last month." />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Monthly budget" optional>
                  <input className={inputClass()} value={data.marketing.monthlyBudget} onChange={(event) => updateSection("marketing", { monthlyBudget: event.target.value })} />
                </Field>
                <Field label="Approval workflow" optional>
                  <input className={inputClass()} value={data.marketing.approvalWorkflow} onChange={(event) => updateSection("marketing", { approvalWorkflow: event.target.value })} />
                </Field>
                <Field label="Lead magnets" optional>
                  <textarea className={inputClass()} rows={3} value={data.marketing.leadMagnets} onChange={(event) => updateSection("marketing", { leadMagnets: event.target.value })} placeholder="Example: checklist, guide, free estimate request, consultation offer." />
                </Field>
                <Field label="Offers/promotions" optional>
                  <textarea className={inputClass()} rows={3} value={data.marketing.offersPromotions} onChange={(event) => updateSection("marketing", { offersPromotions: event.target.value })} placeholder="Example: seasonal tune-up, first visit discount, free consultation." />
                </Field>
                <Field label="Customer segments" optional>
                  <textarea className={inputClass()} rows={3} value={data.marketing.customerSegments} onChange={(event) => updateSection("marketing", { customerSegments: event.target.value })} placeholder="Example: new leads, past customers, VIP accounts, maintenance customers." />
                </Field>
                <Field label="Seasonal campaigns" optional>
                  <textarea className={inputClass()} rows={3} value={data.marketing.seasonalCampaigns} onChange={(event) => updateSection("marketing", { seasonalCampaigns: event.target.value })} placeholder="Example: spring maintenance, holiday promo, back-to-school checkup." />
                </Field>
                <Field label="Retargeting interest" optional hint="Retargeting means following up with people who interacted with your business but did not book or buy yet.">
                  <input className={inputClass()} value={data.marketing.retargetingInterest} onChange={(event) => updateSection("marketing", { retargetingInterest: event.target.value })} placeholder="Example: interested later, only after ads are connected, not now" />
                </Field>
                <Field label="Review request timing" optional hint="When it is appropriate to ask for a review. Example: after completed service, after invoice paid, after appointment marked complete.">
                  <input className={inputClass()} value={data.marketing.reviewRequestTiming} onChange={(event) => updateSection("marketing", { reviewRequestTiming: event.target.value })} />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Primary KPI" optional>
                  <input className={inputClass()} value={data.analytics.primaryKpi} onChange={(event) => updateSection("analytics", { primaryKpi: event.target.value })} />
                </Field>
                <Field label="Monthly lead goal" optional>
                  <input className={inputClass()} value={data.analytics.monthlyLeadGoal} onChange={(event) => updateSection("analytics", { monthlyLeadGoal: event.target.value })} />
                </Field>
                <Field label="Monthly revenue goal" optional>
                  <input className={inputClass()} value={data.analytics.monthlyRevenueGoal} onChange={(event) => updateSection("analytics", { monthlyRevenueGoal: event.target.value })} />
                </Field>
                <Field label="Monthly appointment goal" optional>
                  <input className={inputClass()} value={data.analytics.appointmentGoal} onChange={(event) => updateSection("analytics", { appointmentGoal: event.target.value })} placeholder="Example: 40 booked appointments" />
                </Field>
                <Field label="Target conversion rate" optional hint="Conversion rate means the percentage of leads who become paying customers. If you are not sure, leave this blank or use an estimate.">
                  <input className={inputClass()} value={data.analytics.conversionGoal} onChange={(event) => updateSection("analytics", { conversionGoal: event.target.value })} placeholder="Example: 25%" />
                </Field>
                <Field label="Average customer value" optional hint="About how much a typical customer is worth over time. Use an estimate if you know it.">
                  <input className={inputClass()} value={data.analytics.averageCustomerValue} onChange={(event) => updateSection("analytics", { averageCustomerValue: event.target.value })} placeholder="Example: 1200" />
                </Field>
                <Field label="Current monthly lead volume" optional hint="How many leads you usually get in a month today. This creates baseline analytics preferences, not fake lead records.">
                  <input className={inputClass()} value={data.analytics.currentMonthlyLeadVolume} onChange={(event) => updateSection("analytics", { currentMonthlyLeadVolume: event.target.value })} placeholder="Example: 35" />
                </Field>
                <Field label="Current monthly appointment volume" optional hint="How many appointments you usually book in a month today.">
                  <input className={inputClass()} value={data.analytics.currentMonthlyAppointmentVolume} onChange={(event) => updateSection("analytics", { currentMonthlyAppointmentVolume: event.target.value })} placeholder="Example: 20" />
                </Field>
                <Field label="Reporting cadence" optional>
                  <input className={inputClass()} value={data.analytics.reportingCadence} onChange={(event) => updateSection("analytics", { reportingCadence: event.target.value })} />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="30-day success goal" optional>
                  <textarea className={inputClass()} rows={3} value={data.analytics.success30} onChange={(event) => updateSection("analytics", { success30: event.target.value })} />
                </Field>
                <Field label="60-day success goal" optional>
                  <textarea className={inputClass()} rows={3} value={data.analytics.success60} onChange={(event) => updateSection("analytics", { success60: event.target.value })} />
                </Field>
                <Field label="90-day success goal" optional>
                  <textarea className={inputClass()} rows={3} value={data.analytics.success90} onChange={(event) => updateSection("analytics", { success90: event.target.value })} />
                </Field>
                <Field label="Reporting pain points" optional>
                  <textarea className={inputClass()} rows={3} value={data.analytics.painPoints} onChange={(event) => updateSection("analytics", { painPoints: event.target.value })} />
                </Field>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50/80">
                Marketing setup prepares drafts and recommendations only. It does not auto-send email, SMS, or social posts.
              </div>
            </div>
          ) : null}

          {step.id === "workflows" ? (
            <div className="space-y-5">
              <label className="flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
                <input type="checkbox" className="mt-1" checked={data.workflows.createDrafts} onChange={(event) => updateSection("workflows", { createDrafts: event.target.checked })} />
                <span>Create recommended workflows as drafts during save. Draft workflows still require review before activation.</span>
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                {workflowOptions.map(([id, label, what, trigger, condition, action]) => (
                  <label key={id} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                    <input type="checkbox" className="mr-2" checked={data.workflows.recommended.includes(id)} onChange={() => toggleList("workflows", "recommended", id)} />
                    <span className="font-black text-white">{label}</span>
                    <span className="mt-2 block text-xs text-slate-400">What it does: {what}</span>
                    <span className="mt-1 block text-xs text-slate-400">Trigger: {trigger}</span>
                    <span className="mt-1 block text-xs text-slate-400">Condition: {condition}</span>
                    <span className="mt-1 block text-xs text-slate-400">Draft action created: {action}</span>
                    <span className="mt-1 block text-xs text-cyan-100/80">Why review-gated: External sends, assignments, billing actions, and customer-facing drafts require human approval before anything runs.</span>
                  </label>
                ))}
              </div>
              <Field label="Workflow notes">
                <textarea className={inputClass()} rows={3} value={data.workflows.notes} onChange={(event) => updateSection("workflows", { notes: event.target.value })} placeholder="Example: Follow up with new leads within 5 minutes during business hours. Send appointment reminders 24 hours before a scheduled visit. Create review request tasks only after a job is marked complete." />
              </Field>
            </div>
          ) : null}

          {step.id === "help" ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["self_guided", "Self-guided", "Use built-in help and finish setup yourself."],
                  ["guided_call", "Free guided setup call", "Schedule a free 30-minute screen-share setup call."],
                  ["dfy_quote", "Paid done-for-you help", "Ask SynaptiReach to perform setup work for you."],
                ].map(([id, label, description]) => (
                  <button key={id} type="button" onClick={() => updateSection("help", { mode: id as any, guidedCallRequested: id === "guided_call" })} className={`rounded-2xl border p-4 text-left ${data.help.mode === id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"}`}>
                    <div className="font-black">{label}</div>
                    <p className="mt-2 text-sm text-slate-400">{description}</p>
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-3 font-black">DFY assistance menu</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {dfyOptions.map(([id, label, price]) => (
                    <label key={id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
                      <input type="checkbox" className="mr-2" checked={data.help.requestedServices.includes(id)} onChange={() => toggleList("help", "requestedServices", id)} />
                      <span className="font-bold text-white">{label}</span>
                      <span className="ml-2 text-cyan-100">{price}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50/85">
                Guidance is free when you perform the work with SynaptiReach guidance. If SynaptiReach performs setup for you, it becomes a paid DFY service.
              </div>
              <Field label="Help notes">
                <textarea className={inputClass()} rows={3} value={data.help.notes} onChange={(event) => updateSection("help", { notes: event.target.value })} placeholder="Example: I want help importing contacts, setting up Twilio, and building my first workflow. I prefer a 30-minute screen-share walkthrough before launch." />
              </Field>
            </div>
          ) : null}

          {step.id === "safety" ? (
            <div className="space-y-4">
              {[
                ["requireApproval", "Require manual approval before AI sends email, SMS, or social posts."],
                ["allowAutoAssign", "Allow internal task assignment suggestions and low-risk routing."],
                ["quietHoursEnabled", "Respect quiet hours for reminders and outreach queues."],
                ["smsComplianceAck", "I understand SMS requires consent, opt-out handling, and provider compliance review."],
                ["noAutoSendAck", "I understand onboarding will not auto-send customer messages or auto-charge outside Stripe Checkout."],
              ].map(([key, label]) => (
                <label key={key} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean((data.automation as any)[key])}
                    onChange={(event) => updateSection("automation", { [key]: event.target.checked } as any)}
                    className="mt-1"
                  />
                  <span>{label}</span>
                </label>
              ))}
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Quiet hours start">
                  <input className={inputClass()} type="time" value={data.automation.quietHoursStart} onChange={(event) => updateSection("automation", { quietHoursStart: event.target.value })} />
                </Field>
                <Field label="Quiet hours end">
                  <input className={inputClass()} type="time" value={data.automation.quietHoursEnd} onChange={(event) => updateSection("automation", { quietHoursEnd: event.target.value })} />
                </Field>
                <Field label="Draft-only automations" optional hint="Workflow means a repeatable process the CRM can prepare for review, such as creating a follow-up task after a new lead is added. List anything that should never run automatically.">
                  <textarea className={inputClass()} rows={3} value={data.automation.draftOnlyAutomations} onChange={(event) => updateSection("automation", { draftOnlyAutomations: event.target.value })} />
                </Field>
                <Field label="Usage warning preferences" optional hint="When you want alerts before managed trial caps are reached. Example: warn at 80% of AI review checks or emails.">
                  <textarea className={inputClass()} rows={3} value={data.automation.usageWarningPreferences} onChange={(event) => updateSection("automation", { usageWarningPreferences: event.target.value })} />
                </Field>
              </div>
            </div>
          ) : null}

          {step.id === "launch" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="mb-1 text-lg font-black text-white">Your CRM will be configured with...</div>
                <p className="mb-4 text-sm text-slate-400">
                  This summarizes saved onboarding setup and safe defaults only. It does not create fake leads, customers, revenue, provider success, or subscription status.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {crmSetupSummary.map((item) => (
                    <div key={item.label} className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-100/60">{item.label}</div>
                      <div className="mt-1 break-words text-sm text-slate-200">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-cyan-100/70">Launch readiness</div>
                    <div className="mt-1 text-5xl font-black">{readiness?.score ?? 0}%</div>
                  </div>
                  <Wand2 className="text-cyan-100" size={42} />
                </div>
                <p className="mt-3 text-sm text-cyan-50/75">
                  Pending or skipped items remain available from Settings and CRM setup pages.
                </p>
              </div>
              <div className="space-y-2">
                {(readiness?.checks || []).map((check: any) => (
                  <button key={check.id} type="button" onClick={() => goToReadiness(check)} className="w-full min-w-0 rounded-xl border border-white/10 bg-black/30 p-3 text-left transition hover:border-cyan-300/25">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-bold">{check.label}</div>
                        {check.detail ? <div className="mt-1 break-words text-xs text-slate-400">{check.detail}</div> : null}
                      </div>
                      <StatusPill status={check.status} />
                    </div>
                    {["missing", "pending"].includes(check.status) ? (
                      <div className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-2">
                        <div><span className="font-bold text-slate-200">Why it matters:</span> {check.why}</div>
                        <div><span className="font-bold text-slate-200">What to do next:</span> {check.next}</div>
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={activate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-2 font-black text-black">
                  <Rocket size={16} />
                  {finalButtonLabel}
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={back} disabled={activeStep === 0} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-40">
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex flex-wrap gap-3">
              {step.id !== "launch" ? (
                <button type="button" onClick={finishLater} disabled={saving} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 disabled:opacity-40">
                  Finish Later
                </button>
              ) : null}
              {step.id !== "launch" ? (
                <button type="button" onClick={skipCurrent} disabled={!optionalStepIds.has(step.id)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40" title={optionalStepIds.has(step.id) ? "Save this step as intentionally skipped." : "This step is required before continuing."}>
                  Skip for now
                </button>
              ) : null}
              {step.id !== "launch" ? (
                <button type="button" onClick={next} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-2 font-black text-black disabled:opacity-60">
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                  Continue
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 font-black">
              <Gauge size={18} className="text-cyan-200" />
              Readiness
            </div>
            <div className="text-4xl font-black">{readiness?.score ?? 0}%</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-green-300" style={{ width: `${readiness?.score ?? 0}%` }} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 font-black">
              <Users size={18} className="text-cyan-200" />
              Saved State
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between gap-3"><span>Workspace</span><span className="truncate text-white">{workspaceId ? "Created" : "Pending"}</span></div>
              <div className="flex justify-between gap-3"><span>Leads</span><span className="text-white">{snapshot?.leads?.length || 0}</span></div>
              <div className="flex justify-between gap-3"><span>Staff</span><span className="text-white">{snapshot?.staff?.length || 0}</span></div>
              <div className="flex justify-between gap-3"><span>Providers</span><span className="text-white">{snapshot?.providerConnections?.length || 0}</span></div>
              <div className="flex justify-between gap-3"><span>Billing</span><span className="truncate text-white">{["trialing", "active", "checkout_completed"].includes(snapshot?.billing?.status) ? "Confirmed" : snapshot?.billing?.status ? "Pending" : "Not saved"}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50">
            <div className="mb-2 flex items-center gap-2 font-black">
              <AlertTriangle size={16} />
              Manual setup remains explicit
            </div>
            Checkout confirmation, verified email domains, SMS compliance, Google Calendar, and social connections stay pending until the required providers confirm them.
          </div>

          <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 font-black">
              <HelpCircle size={18} className="text-cyan-200" />
              Onboarding Help
            </div>
            <div className="space-y-3 text-sm text-slate-400">
              <p>Built-in help comes first. AI help is used only when it adds value and provider setup allows it.</p>
              <p>Guidance is free when you do the setup with SynaptiReach guidance. Done-for-you setup is paid.</p>
              <button type="button" onClick={() => goToStep("help")} className="w-full rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 font-bold text-cyan-50">
                View help options
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
