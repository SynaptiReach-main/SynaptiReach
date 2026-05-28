# SynaptiReach Onboarding Final Review Code

Generated: 2026-05-28T05:19:42.716Z


---

## app/onboarding/page.tsx

```tsx
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
    serviceMenu: { ...initialData.serviceMenu, ...(payload?.serviceMenu || {}) },
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
              const detail = statusResult.error || "Could not refresh checkout status. You can retry from Billing.";
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
        const detail = stripeResult.error || "Billing status check failed. Retry in a moment.";
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
              <div className="md:col-span-2">
                <Field label="Common questions and objections" optional hint="Questions are what customers ask. Objections are reasons they hesitate. Example: price, timing, trust, warranty, availability.">
                  <textarea className={inputClass()} rows={3} value={[data.businessProfile.commonQuestions, data.businessProfile.commonObjections].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("businessProfile", { commonQuestions: event.target.value })} placeholder="Example questions: How soon can you come out? Do you offer financing? Example objections: too expensive, need to ask spouse, comparing quotes." />
                </Field>
              </div>
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
              <div className="md:col-span-2">
                <Field label="Pricing, booking, quote, and review notes" optional>
                  <textarea className={inputClass()} rows={4} value={[data.businessProfile.pricingNotes, data.businessProfile.bookingProcess, data.businessProfile.quoteProcess, data.businessProfile.reviewProcess].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("businessProfile", { pricingNotes: event.target.value })} placeholder="Pricing rules, booking process, quote process, and when review requests are appropriate." />
                </Field>
              </div>
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
                <p className="mb-3 text-sm text-slate-400">Accepted: PDF, PNG, JPG/JPEG, WEBP. Uploads are stored for pending analysis and review; extraction is not marked successful until available.</p>
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
                        <span className="ml-2 text-cyan-100">{file.analysis_state || "pending_analysis"}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <textarea className={`${inputClass()} mt-3`} rows={2} value={data.serviceMenu.notes} onChange={(event) => updateSection("serviceMenu", { notes: event.target.value })} placeholder="Optional notes for menu review or extraction." />
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
                <Field label="Priority and assignment rules" optional>
                  <textarea className={inputClass()} rows={4} value={[data.crmSetup.priorityRules, data.crmSetup.assignmentRules].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("crmSetup", { priorityRules: event.target.value })} placeholder="How leads should be prioritized, assigned, or escalated." />
                </Field>
                <Field label="Won/lost reasons" optional>
                  <textarea className={inputClass()} rows={4} value={[data.crmSetup.wonReasons, data.crmSetup.lostReasons].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("crmSetup", { wonReasons: event.target.value })} placeholder="Common reasons deals are won or lost." />
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
                  <p className="mt-1">Billing Status: {["trialing", "active", "checkout_completed"].includes(snapshot?.billing?.status) ? "Confirmed" : "Pending"}</p>
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
                <Field label="Common questions and objections" optional>
                  <textarea className={inputClass()} rows={4} value={[data.communications.commonQuestions, data.communications.commonObjections].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("communications", { commonQuestions: event.target.value })} />
                </Field>
                <Field label="Escalation and response rules" optional>
                  <textarea className={inputClass()} rows={4} value={[data.communications.escalationRules, data.communications.responseTimeExpectation, data.communications.doNotContactPreferences, data.communications.disclaimers].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("communications", { escalationRules: event.target.value })} />
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
                <textarea className={inputClass()} rows={3} placeholder="Availability, booking window, reminders, no-show handling, confirmation workflow" value={[data.calendar.availabilityNotes, data.calendar.bookingWindow, data.calendar.reminderPreferences, data.calendar.noShowPreference, data.calendar.confirmationWorkflow].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("calendar", { availabilityNotes: event.target.value })} />
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
                <Field label="Lead magnets and offers" optional>
                  <textarea className={inputClass()} rows={3} value={[data.marketing.leadMagnets, data.marketing.offersPromotions].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("marketing", { leadMagnets: event.target.value })} />
                </Field>
                <Field label="Segments and seasonal campaigns" optional>
                  <textarea className={inputClass()} rows={3} value={[data.marketing.customerSegments, data.marketing.seasonalCampaigns].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("marketing", { customerSegments: event.target.value })} />
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
              <Field label="30/60/90 day success notes and reporting pain points" optional>
                <textarea className={inputClass()} rows={4} value={[data.analytics.success30, data.analytics.success60, data.analytics.success90, data.analytics.painPoints].filter(Boolean).join("\n\n")} onChange={(event) => updateSection("analytics", { success30: event.target.value })} />
              </Field>
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
                  <button key={check.id} type="button" onClick={() => goToReadiness(check)} className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3 text-left transition hover:border-cyan-300/25">
                    <div className="min-w-0">
                      <div className="text-sm font-bold">{check.label}</div>
                      {check.detail ? <div className="text-xs text-slate-400">{check.detail}</div> : null}
                    </div>
                    <StatusPill status={check.status} />
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
              <div className="flex justify-between gap-3"><span>Billing</span><span className="truncate text-white">{snapshot?.billing?.status || "not saved"}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50">
            <div className="mb-2 flex items-center gap-2 font-black">
              <AlertTriangle size={16} />
              Manual setup remains explicit
            </div>
            Stripe confirmation, verified Resend domains, Twilio compliance, Google OAuth, and social connections stay pending until their providers confirm them.
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
```

---

## app/onboarding/status/page.tsx

```tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock3, CreditCard, Loader2, Settings2, ShieldCheck, Workflow } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

function statusClass(status: string) {
  if (status === "complete") return "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
  if (status === "pending") return "border-yellow-300/30 bg-yellow-300/10 text-yellow-100";
  if (status === "skipped") return "border-white/15 bg-white/5 text-slate-300";
  return "border-red-300/25 bg-red-500/10 text-red-100";
}

export default function OnboardingStatusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.replace(`/signin?returnTo=${encodeURIComponent("/onboarding/status")}`);
        return;
      }

      const response = await fetch("/api/onboarding/save", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setError(result.error || "Could not load onboarding status.");
        setLoading(false);
        return;
      }

      if (result.session?.completed) {
        router.replace("/dashboard");
        return;
      }
      const submitted = Boolean(result.session?.metadata?.submitted_for_review);
      if (!submitted) {
        const step = result.session?.metadata?.current_step || result.payload?.__onboardingProgress?.current_step || "welcome";
        router.replace(`/onboarding?step=${encodeURIComponent(step)}`);
        return;
      }
      setState(result);
      setLoading(false);
    }

    load();
  }, [router]);

  const grouped = useMemo(() => {
    const checks = state?.readiness?.checks || [];
    const byId = Object.fromEntries(checks.map((check: any) => [check.id, check]));
    return [
      { title: "Submission", icon: ShieldCheck, checks: ["business_profile", "legal_company", "plan", "trial_acknowledgements"].map((id) => byId[id]).filter(Boolean) },
      { title: "Billing", icon: CreditCard, checks: ["billing", "email_verification"].map((id) => byId[id]).filter(Boolean) },
      { title: "Providers", icon: Settings2, checks: ["ai", "email", "sms", "calendar"].map((id) => byId[id]).filter(Boolean) },
      { title: "CRM Setup", icon: Workflow, checks: ["service_menu", "staff", "lead_setup", "marketing", "workflow_drafts", "automation_safety", "help"].map((id) => byId[id]).filter(Boolean) },
    ];
  }, [state]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-white/[0.04] px-5 py-4">
          <Loader2 className="animate-spin text-cyan-200" size={18} />
          Loading onboarding status
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(74,222,128,0.10),transparent_30%)]" />
      <div className="relative mx-auto max-w-6xl space-y-5">
        <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/80 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-2xl font-black tracking-tight">
                Synapti<span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">Reach</span>
              </div>
              <h1 className="mt-4 text-3xl font-black">Onboarding submitted for review</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
                Your CRM setup has been saved. SynaptiReach will review pending items such as checkout confirmation, providers, legal details, service menu analysis, staff, leads, and workflow drafts before activation.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-center">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/70">Readiness</div>
              <div className="mt-1 text-4xl font-black">{state?.readiness?.score || 0}%</div>
            </div>
          </div>
          {error ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
              <AlertTriangle className="mt-0.5 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["Submitted", "complete"],
              ["Pending review", "pending"],
              [`Missing ${((state?.readiness?.checks || []).filter((check: any) => check.status === "missing").length)}`, "missing"],
              [`Needs edits ${((state?.readiness?.checks || []).filter((check: any) => check.status === "pending").length)}`, "pending"],
              ["Approved after completion", "skipped"],
            ].map(([label, status]) => (
              <span key={label} className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusClass(status)}`}>{label}</span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/onboarding?step=launch" className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-50">
              Edit onboarding
            </Link>
            <button type="button" onClick={signOut} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300">
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {grouped.map((group) => {
            const Icon = group.icon;
            return (
              <section key={group.title} className="rounded-2xl border border-white/10 bg-slate-950/75 p-5">
                <div className="mb-4 flex items-center gap-2 font-black">
                  <Icon className="text-cyan-200" size={18} />
                  {group.title}
                </div>
                <div className="space-y-2">
                  {group.checks.map((check: any) => (
                    <div key={check.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold">{check.label}</div>
                          {check.detail ? <div className="mt-1 text-xs text-slate-400">{check.detail}</div> : null}
                        </div>
                        <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-black uppercase ${statusClass(check.status)}`}>{check.status}</span>
                      </div>
                    </div>
                  ))}
                  {!group.checks.length ? <div className="text-sm text-slate-500">No status items yet.</div> : null}
                </div>
              </section>
            );
          })}
        </div>

        <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50/80">
          <div className="mb-1 flex items-center gap-2 font-black text-yellow-50">
            <Clock3 size={16} />
            Pending activation
          </div>
          Pending checkout can be reviewed, but active trial access still requires confirmation and any required clarification.
        </div>
      </div>
    </main>
  );
}
```

---

## lib/onboarding/server.ts

```ts
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
    const nextMetadata = { ...(existing?.metadata || {}), ...(input.metadata || {}) };
    if (!input.metadata?.current_step && existing?.metadata?.current_step) {
      nextMetadata.current_step = existing.metadata.current_step;
    }
    if (
      existing?.metadata?.submitted_for_review &&
      !input.completed &&
      input.metadata?.submitted_for_review === false
    ) {
      nextMetadata.submitted_for_review = true;
      nextMetadata.submitted_for_review_at = existing.metadata.submitted_for_review_at || new Date().toISOString();
    }
    return {
      workspace_id: input.workspace_id,
      user_id: input.user_id,
      payload: input.payload,
      completed: Boolean(input.completed),
      ...(options.metadata ? { metadata: nextMetadata } : {}),
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
  const analytics = payload.analytics || {};
  const communications = payload.communications || {};
  const calendar = payload.calendar || {};

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
      main_customer_type: profile.mainCustomerType || null,
      service_areas: profile.serviceAreas || null,
      business_hours: profile.businessHours || null,
      products_services: profile.productsServices || null,
      primary_categories: listFromText(profile.primaryCategories),
      top_services_products: listFromText(profile.topServices),
      common_customer_problems: profile.commonProblems || null,
      common_customer_questions: profile.commonQuestions || communications.commonQuestions || null,
      common_customer_objections: profile.commonObjections || communications.commonObjections || null,
      target_customer: profile.targetCustomer || profile.audience || null,
      main_offer: profile.mainOffer || null,
      preferred_cta: profile.preferredCta || null,
      pricing_notes: profile.pricingNotes || null,
      booking_process: profile.bookingProcess || null,
      quote_process: profile.quoteProcess || null,
      review_process: profile.reviewProcess || null,
      emergency_priority_rules: profile.emergencyPriorityRules || null,
      sales_process: crmSetup.salesProcess || profile.salesProcess || null,
      pipeline_stages: listFromText(crmSetup.pipelineStages),
      lead_statuses: listFromText(crmSetup.leadStatuses),
      lead_sources: listFromText(crmSetup.leadSources),
      lead_tags: listFromText(crmSetup.leadTags),
      crm_defaults: {
        typical_deal_value: crmSetup.typicalDealValue || null,
        average_close_time: crmSetup.averageCloseTime || null,
        priority_rules: crmSetup.priorityRules || null,
        assignment_rules: crmSetup.assignmentRules || null,
        owner_assignment_preference: crmSetup.ownerAssignmentPreference || null,
        follow_up_timing: crmSetup.followUpTiming || null,
        stale_lead_threshold: crmSetup.staleLeadThreshold || null,
        stale_deal_threshold: crmSetup.staleDealThreshold || null,
        won_reasons: listFromText(crmSetup.wonReasons),
        lost_reasons: listFromText(crmSetup.lostReasons),
        appointment_types: listFromText(crmSetup.appointmentTypes || calendar.appointmentTypes),
        default_task_types: listFromText(crmSetup.defaultTaskTypes),
        required_lead_fields: listFromText(crmSetup.requiredLeadFields),
        required_deal_fields: listFromText(crmSetup.requiredDealFields),
        required_task_fields: listFromText(crmSetup.requiredTaskFields),
      },
      marketing_setup: {
        goals: marketing.goals || [],
        channels: marketing.channels || [],
        strategy: marketing.strategy || null,
        first_campaign_idea: marketing.firstCampaignIdea || null,
        notification_preferences: marketing.notificationPreferences || [],
        monthly_budget: marketing.monthlyBudget || null,
        lead_magnets: marketing.leadMagnets || null,
        offers_promotions: marketing.offersPromotions || null,
        seasonal_campaigns: marketing.seasonalCampaigns || null,
        customer_segments: marketing.customerSegments || null,
        retargeting_interest: marketing.retargetingInterest || null,
        review_request_timing: marketing.reviewRequestTiming || null,
        approval_workflow: marketing.approvalWorkflow || null,
      },
      analytics_preferences: {
        primary_kpi: analytics.primaryKpi || null,
        monthly_lead_goal: analytics.monthlyLeadGoal || null,
        monthly_revenue_goal: analytics.monthlyRevenueGoal || null,
        appointment_goal: analytics.appointmentGoal || null,
        conversion_goal: analytics.conversionGoal || null,
        average_customer_value: analytics.averageCustomerValue || crmSetup.typicalDealValue || null,
        current_monthly_lead_volume: analytics.currentMonthlyLeadVolume || null,
        current_monthly_appointment_volume: analytics.currentMonthlyAppointmentVolume || null,
        reporting_cadence: analytics.reportingCadence || null,
        success_30: analytics.success30 || null,
        success_60: analytics.success60 || null,
        success_90: analytics.success90 || null,
        pain_points: analytics.painPoints || null,
      },
      communications_setup: {
        email_style: communications.emailStyle || null,
        sms_style: communications.smsStyle || null,
        common_questions: communications.commonQuestions || null,
        common_objections: communications.commonObjections || null,
        follow_up_messages: communications.followUpMessages || null,
        escalation_rules: communications.escalationRules || null,
        response_time_expectation: communications.responseTimeExpectation || null,
        do_not_contact_preferences: communications.doNotContactPreferences || null,
        disclaimers: communications.disclaimers || null,
      },
      calendar_setup: {
        appointment_types: listFromText(calendar.appointmentTypes || crmSetup.appointmentTypes),
        default_duration: calendar.defaultDuration || null,
        booking_window: calendar.bookingWindow || null,
        availability_notes: calendar.availabilityNotes || null,
        reminder_preferences: calendar.reminderPreferences || null,
        reminder_timing: calendar.reminderTiming || null,
        no_show_preference: calendar.noShowPreference || null,
        confirmation_workflow: calendar.confirmationWorkflow || null,
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
        risk_tolerance: ai.riskTolerance || "balanced",
        topics_to_avoid: ai.topicsToAvoid || null,
        draft_mode: ai.draftMode || "draft_messages",
        rule_based_first: ai.useRuleBasedFirst !== false,
        provider_order: "Gemini first, OpenRouter fallback, OpenAI only if enabled.",
      },
      automation_policy: {
        approval_required: automation.requireApproval !== false,
        draft_only_automations: automation.draftOnlyAutomations || null,
        usage_warning_preferences: automation.usageWarningPreferences || null,
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
    emailChoice === "setup_now" ? integrations.emailMode || "byok" : emailChoice === "not_using" ? "skip" : emailChoice === "managed_later" ? "managed" : emailChoice === "byok_later" ? "byok" : emailChoice === "reviewed_later" ? integrations.emailMode || "" : integrations.emailMode;
  const normalizedSmsMode =
    smsChoice === "setup_now" ? integrations.smsMode || "byok" : smsChoice === "not_using" ? "skip" : smsChoice === "managed_later" ? "managed" : smsChoice === "byok_later" ? "byok" : smsChoice === "reviewed_later" ? integrations.smsMode || "" : integrations.smsMode;

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
      label: "Business Profile",
      status: profile.business_name && profile.industry ? "complete" : "missing",
      href: "/dashboard/settings#business",
    },
    {
      id: "legal_company",
      label: "Legal/company information reviewed",
      status: legalProfile.reviewed || payload.businessProfile?.legalReviewed ? "complete" : "pending",
      href: "/dashboard/settings#business",
      detail: legalProfile.review_status || "Confirm the legal/company information provided is accurate to the best of your knowledge.",
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
      label: "Billing Set-Up",
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
          ? "Checkout Submitted. Waiting Confirmation & Review."
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
      current_step: input.currentStep || payload.__onboardingProgress?.current_step || null,
      completed_steps: input.completedSteps || [],
      skipped_steps: input.skippedSteps || {},
      readiness_score: readiness.score,
      submitted_for_review: submittedForReview,
      submitted_for_review_at: submittedForReview ? new Date().toISOString() : null,
      completion_blocked_reason: input.complete && !effectiveComplete ? "Email verification, required workspace fields, provider mode, reviewed Email/SMS setup choices, checkout confirmation, and trial acknowledgements are required before onboarding is complete. Pending checkout can be submitted for review but does not activate trial access." : null,
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
```

---

## app/api/onboarding/stripe-session/route.ts

```ts
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
    const checkoutReturnState = String(body.checkout_return_state || body.checkoutReturnState || "");
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

    const webhookOwnedStatuses = new Set(["trialing", "active", "past_due", "canceled", "unpaid", "checkout_completed"]);
    await supabase
      .from("crm_billing_accounts")
      .update({
        status: webhookOwnedStatuses.has(billing.status) ? billing.status : "pending_webhook",
        metadata: {
          ...(billing.metadata || {}),
          checkout_session_id: sessionId,
          stripe_session_id: sessionId,
          checkout_return_state: checkoutReturnState || billing.metadata?.checkout_return_state || "success",
          checkout_submitted_at: billing.metadata?.checkout_submitted_at || new Date().toISOString(),
          checkout_status_source: "onboarding_stripe_return",
        },
      })
      .eq("id", billing.id);

    const stripe = await retrieveStripeCheckoutSession(sessionId);
    if (!stripe.success) {
      return NextResponse.json(stripe, { status: stripe.setupRequired ? 503 : 502 });
    }

    await supabase
      .from("crm_billing_accounts")
      .update({
        status: webhookOwnedStatuses.has(billing.status) ? billing.status : "pending_webhook",
        metadata: {
          ...(billing.metadata || {}),
          checkout_session_id: sessionId,
          stripe_session_id: sessionId,
          checkout_return_state: checkoutReturnState || billing.metadata?.checkout_return_state || "success",
          checkout_submitted_at: billing.metadata?.checkout_submitted_at || new Date().toISOString(),
          checkout_status_source: "onboarding_stripe_return",
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
```

---

## app/api/onboarding/save/route.ts

```ts
import { NextResponse } from "next/server";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { loadOnboardingState, saveOnboardingState } from "@/lib/onboarding/server";

export async function GET(request: Request) {
  try {
    const result = await loadOnboardingState(request);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: friendly.message,
        missingSchema: friendly.missingSchema,
        setupRequired: friendly.setupRequired,
      },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await saveOnboardingState(request, {
      payload: body.payload || body,
      completedSteps: body.completedSteps || [],
      currentStep: body.currentStep || null,
      skippedSteps: body.skippedSteps || {},
      leadRows: body.leadRows || [],
      importFileName: body.importFileName || null,
      complete: Boolean(body.complete),
    });

    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: friendly.message,
        missingSchema: friendly.missingSchema,
        setupRequired: friendly.setupRequired,
      },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
```

---

## app/api/onboarding/complete/route.ts

```ts
import { NextResponse } from "next/server";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { saveOnboardingState } from "@/lib/onboarding/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await saveOnboardingState(request, {
      payload: body.payload || body,
      completedSteps: body.completedSteps || [],
      currentStep: "activation",
      skippedSteps: body.skippedSteps || {},
      complete: true,
    });

    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: friendly.message,
        missingSchema: friendly.missingSchema,
        setupRequired: friendly.setupRequired,
      },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
```

---

## app/api/onboarding/upload/route.ts

```ts
import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getOnboardingUser } from "@/lib/onboarding/server";

const ACCEPTED_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);
const BUCKET = "onboarding-files";
const BUCKET_SETUP =
  "Create a private Supabase Storage bucket named onboarding-files. Allow PDF, PNG, JPG/JPEG, and WEBP uploads. Keep it private; files are written and read through server-side routes using workspace/user metadata.";

function extensionFor(file: File) {
  const name = file.name || "";
  const ext = name.includes(".") ? name.split(".").pop()?.toLowerCase() : "";
  if (ext && ["pdf", "png", "jpg", "jpeg", "webp"].includes(ext)) return ext;
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  try {
    const user = await getOnboardingUser(request);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Choose a PDF, PNG, JPG, JPEG, or WEBP service/product menu file." }, { status: 400 });
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, error: "Accepted menu upload formats are PDF, PNG, JPG/JPEG, and WEBP." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id,company_id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (workspaceError) throw workspaceError;
    if (!workspace?.id) {
      return NextResponse.json({ success: false, setupRequired: true, error: "Save onboarding once before uploading a service/product menu." }, { status: 409 });
    }

    const ext = extensionFor(file);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
    const path = `${workspace.id}/service-menu/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();
    if (bucketListError) throw bucketListError;
    if (!(buckets || []).some((bucket: any) => bucket.name === BUCKET)) {
      const createBucket = await supabase.storage.createBucket(BUCKET, {
        public: false,
        allowedMimeTypes: Array.from(ACCEPTED_TYPES),
        fileSizeLimit: "25MB",
      });
      if (createBucket.error) {
        return NextResponse.json(
          {
            success: false,
            setupRequired: true,
            error: `${BUCKET_SETUP} Supabase returned: ${createBucket.error.message}`,
          },
          { status: 503 }
        );
      }
    }
    const upload = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });
    if (upload.error) {
      return NextResponse.json(
        {
          success: false,
          setupRequired: true,
          error: `${BUCKET_SETUP} Supabase returned: ${upload.error.message}`,
        },
        { status: 503 }
      );
    }

    const metadata = {
      source: "onboarding_service_menu",
      original_file_name: file.name,
      storage_bucket: BUCKET,
      storage_path: path,
      content_type: file.type,
      size_bytes: file.size,
      analysis_state: "pending_analysis",
      extraction_state: "needs_review",
      ai_extraction_available: false,
      structured_knowledge: [],
      note: "File uploaded for later AI/admin review. No extraction success is inferred.",
    };

    const { data: uploadRow, error: insertError } = await supabase
      .from("crm_service_menu_uploads")
      .insert({
        workspace_id: workspace.id,
        company_id: workspace.company_id || null,
        user_id: user.id,
        file_name: safeName || file.name,
        content_type: file.type,
        size_bytes: file.size,
        storage_bucket: BUCKET,
        storage_path: path,
        analysis_state: "pending_analysis",
        extraction_state: "needs_review",
        metadata,
      })
      .select()
      .single();
    if (insertError) throw insertError;

    try {
      await supabase.from("crm_ai_recommendations").insert({
        workspace_id: workspace.id,
        type: "onboarding_setup",
        title: "Review uploaded service/product menu",
        description: "A service/product menu was uploaded during onboarding. Analyze it into CRM knowledge before using it for CRM intelligence, communications, or campaign drafting.",
        action: "review_service_menu",
        status: "open",
        confidence: 0.9,
        metadata,
      });
    } catch {
      // The upload metadata row is the source of truth; recommendations are best-effort.
    }

    try {
      await supabase.from("crm_tasks").insert({
        workspace_id: workspace.id,
        title: "Review uploaded service/product menu",
        details: "Analyze the onboarding menu upload into CRM knowledge before using it for communications, campaign drafts, workflow reviews, or AI recommendations.",
        status: "open",
        priority: "medium",
        metadata: {
          ...metadata,
          source: "onboarding_service_menu_review_task",
          upload_id: uploadRow.id,
        },
      });
    } catch {
      // Task creation is best-effort; the upload row and recommendation remain available.
    }

    return NextResponse.json({
      success: true,
      file: uploadRow,
      message: "Service/product menu uploaded. Analysis is pending review; no extraction success was inferred.",
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
```

---

## app/dashboard/layout.tsx

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Megaphone,
  Bot,
  Workflow,
  MessageSquare,
  ListTodo,
  CalendarDays,
  BarChart3,
  Settings,
  Zap,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCheck,
  Command,
  Search,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "Start",
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: Users,
    group: "Customers",
  },
  {
    label: "Pipeline",
    href: "/dashboard/pipeline",
    icon: KanbanSquare,
    group: "Customers",
  },
  {
    label: "Marketing",
    href: "/dashboard/marketing",
    icon: Megaphone,
    group: "Growth",
  },
  {
    label: "CRM Intelligence",
    href: "/dashboard/ai_assistant",
    icon: Bot,
    group: "Growth",
  },
  {
    label: "Automations",
    href: "/dashboard/workflow",
    icon: Workflow,
    group: "Growth",
  },
  {
    label: "Communications",
    href: "/dashboard/communications",
    icon: MessageSquare,
    group: "Work",
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: ListTodo,
    group: "Work",
  },
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDays,
    group: "Work",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    group: "Review",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    group: "Review",
  },
];

const navGroups = ["Start", "Customers", "Growth", "Work", "Review"];

type Workspace = {
  name: string;
  logo_url?: string | null;
};

type CRMNotification = {
  id: string;
  title: string;
  message?: string | null;
  type?: string;
  priority?: string;
  status?: string;
  href?: string | null;
  derived?: boolean;
  created_at?: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // using shared supabase client

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);
  const [sidebarOpen, setSidebarOpen] =
    useState(false);
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [commandData, setCommandData] = useState<any>(null);
  const [commandLoading, setCommandLoading] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<any>(null);
  const [onboardingPrompt, setOnboardingPrompt] = useState<any>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("synaptireach-crm-sidebar-expanded");
    if (saved === "true") {
      setSidebarOpen(true);
    }
  }, []);

  function updateSidebar(open: boolean) {
    setSidebarOpen(open);
    window.localStorage.setItem("synaptireach-crm-sidebar-expanded", String(open));
  }

  useEffect(() => {
    async function loadWorkspace() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/signin");
        return;
      }

      const { data } = await supabase
        .from("workspaces")
        .select("name")
        .eq("owner_id", session.user.id)
        .maybeSingle();

      if (data) {
        setWorkspace(data);
      }
    }

    loadWorkspace();
  }, []);

  async function loadNotifications() {
    setNotificationsLoading(true);
    try {
      const response = await fetch("/api/crm/notifications", { cache: "no-store" });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } finally {
      setNotificationsLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [pathname]);

  useEffect(() => {
    async function loadSimulationStatus() {
      try {
        const response = await fetch("/api/test/simulation/status", { cache: "no-store" });
        const data = await response.json();
        setSimulationStatus(data?.allowed ? data : null);
      } catch {
        setSimulationStatus(null);
      }
    }

    loadSimulationStatus();
  }, [pathname]);

  useEffect(() => {
    async function loadOnboardingPrompt() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setOnboardingPrompt(null);
          return;
        }
        const response = await fetch("/api/onboarding/save", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await response.json();
        if (response.ok && data.success && ((data.session && !data.session.completed) || (data.workspace && !data.session))) {
          const currentStep = data.session?.metadata?.current_step || data.payload?.__onboardingProgress?.current_step || "welcome";
          if (data.session?.metadata?.submitted_for_review) {
            router.replace("/onboarding/status");
            return;
          }
          if (data.workspace) {
            router.replace(`/onboarding?step=${encodeURIComponent(currentStep)}`);
            return;
          }
          setOnboardingPrompt({
            score: data.readiness?.score || 0,
            currentStep,
          });
        } else {
          setOnboardingPrompt(null);
        }
      } catch {
        setOnboardingPrompt(null);
      }
    }

    loadOnboardingPrompt();
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === "Escape") setCommandOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function loadCommandData() {
    if (commandData || commandLoading) return;
    setCommandLoading(true);
    try {
      const response = await fetch("/api/crm/dashboard", { cache: "no-store" });
      const data = await response.json();
      if (data.success) setCommandData(data.data);
    } finally {
      setCommandLoading(false);
    }
  }

  useEffect(() => {
    if (commandOpen) loadCommandData();
  }, [commandOpen]);

  async function markNotificationsRead(item?: CRMNotification) {
    setNotifications((current) =>
      current.map((notification) =>
        item?.id
          ? notification.id === item.id
            ? { ...notification, status: "read" }
            : notification
          : { ...notification, status: "read" }
      )
    );

    if (item?.derived) return;

    try {
      await fetch("/api/crm/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item?.id ? { id: item.id } : { mark_all_read: true }),
      });
      await loadNotifications();
    } catch {
      await loadNotifications();
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  const commandQuickActions = [
    { label: "Create Lead", href: "/dashboard/leads", type: "action" },
    { label: "Import Leads CSV", href: "/dashboard/leads", type: "action" },
    { label: "Create Campaign", href: "/dashboard/marketing", type: "action" },
    { label: "Create Workflow", href: "/dashboard/workflow", type: "action" },
    { label: "Open CRM Intelligence", href: "/dashboard/ai_assistant", type: "action" },
    { label: "Add Task", href: "/dashboard/tasks", type: "action" },
    { label: "View Pipeline", href: "/dashboard/pipeline", type: "action" },
  ];
  const commandRecords = [
    ...(commandData?.leads || []).map((item: any) => ({
      label: item.name || item.email || "Lead",
      detail: [item.email, item.status, item.company].filter(Boolean).join(" · "),
      href: "/dashboard/leads",
      type: "lead",
    })),
    ...(commandData?.deals || []).map((item: any) => ({
      label: item.title || item.name || "Deal",
      detail: [item.stage, item.status, item.value ? `$${Number(item.value).toLocaleString()}` : ""].filter(Boolean).join(" · "),
      href: "/dashboard/pipeline",
      type: "deal",
    })),
    ...(commandData?.tasks || []).map((item: any) => ({
      label: item.title || "Task",
      detail: [item.status, item.priority].filter(Boolean).join(" · "),
      href: "/dashboard/tasks",
      type: "task",
    })),
    ...(commandData?.campaigns || []).map((item: any) => ({
      label: item.subject || item.name || `${item.type || "Campaign"} campaign`,
      detail: [item.type, item.status].filter(Boolean).join(" · "),
      href: "/dashboard/marketing",
      type: "campaign",
    })),
    ...(commandData?.communications || []).map((item: any) => ({
      label: item.subject || item.recipient || "Communication",
      detail: [item.channel, item.status].filter(Boolean).join(" · "),
      href: "/dashboard/communications",
      type: "communication",
    })),
  ];
  const commandResults = [...commandQuickActions, ...commandRecords]
    .filter((item) => {
      const q = commandQuery.toLowerCase();
      if (!q) return true;
      return [item.label, (item as any).detail, item.type].filter(Boolean).some((value) => String(value).toLowerCase().includes(q));
    })
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* SIDEBAR */}
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => updateSidebar(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen border-r border-cyan-400/10 bg-black/85 backdrop-blur-2xl flex flex-col z-40 transition-all duration-300 ${
          sidebarOpen
            ? "w-72 translate-x-0 p-5"
            : "w-20 -translate-x-full p-4 lg:translate-x-0"
        }`}
      >

        {/* LOGO + WORDMARK */}
        <div className="flex items-center gap-3 mb-8">

          <div className="w-11 h-11 shrink-0 rounded-2xl overflow-hidden border border-cyan-400/25 bg-cyan-400/10 flex items-center justify-center shadow-lg shadow-cyan-500/10">

            {workspace?.logo_url ? (
              <Image
                src={workspace.logo_url}
                alt="Logo"
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <Zap
                className="text-cyan-400"
                size={20}
              />
            )}

          </div>

          {sidebarOpen && (
          <div className="min-w-0">

            <h1 className="text-lg font-black tracking-wide truncate">
              <span className="text-white">
                {workspace?.name ||
                  "SynaptiReach"}
              </span>
            </h1>

            <p className="text-xs bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent font-semibold">
              AI CRM Workspace
            </p>

          </div>
          )}

          <button
            onClick={() => updateSidebar(!sidebarOpen)}
            className="ml-auto hidden lg:flex w-10 h-10 rounded-2xl border border-white/10 bg-white/[0.04] items-center justify-center text-cyan-200 hover:bg-cyan-500/10"
            aria-label={sidebarOpen ? "Collapse navigation" : "Expand navigation"}
          >
            {sidebarOpen ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
          </button>

        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-4 overflow-y-auto pr-1">

          {navGroups.map((group) => {
            const groupedItems = navItems.filter((item) => item.group === group);
            if (!groupedItems.length) return null;

            return (
              <div key={group} className="space-y-2">
                {sidebarOpen && (
                  <div className="px-4 text-[10px] font-black uppercase tracking-[0.18em] text-gray-600">
                    {group}
                  </div>
                )}
                {groupedItems.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 border ${
                        active
                          ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-200 shadow-lg shadow-cyan-500/10"
                          : "border-transparent text-gray-500 hover:text-white hover:bg-white/5"
                      } ${sidebarOpen ? "justify-start" : "justify-center"}`}
                      title={item.label}
                      onClick={() => window.innerWidth < 1024 && updateSidebar(false)}
                    >
                      <Icon size={18} />

                      {sidebarOpen && (
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                      )}

                    </Link>
                  );
                })}
              </div>
            );
          })}

        </nav>

        {/* SIGN OUT */}
        <div className="pt-6">

          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400">

            <button
              onClick={handleSignOut}
              className="w-full rounded-2xl bg-black hover:bg-black/80 transition-all px-4 py-3 flex items-center justify-center gap-2 font-semibold"
              title="Sign Out"
            >
              <LogOut size={16} />

              {sidebarOpen && "Sign Out"}
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 lg:ml-20 min-h-screen min-w-0">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">

            <button
              onClick={() => updateSidebar(true)}
              className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-cyan-300 hover:bg-cyan-500/10"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">

            <h2 className="text-xl md:text-2xl font-black truncate">
              {navItems.find(
                (i) => i.href === pathname
              )?.label || "Dashboard"}
            </h2>

            <p className="text-sm text-gray-500">
              {simulationStatus ? "Simulated test workspace data" : "Live AI CRM Workspace"}
            </p>

          </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {simulationStatus && (
              <div className="hidden rounded-xl border border-green-400/20 bg-green-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-200 md:block">
                Simulated Test Workspace
              </div>
            )}
            <button
              onClick={() => setCommandOpen(true)}
              className="flex h-11 w-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-gray-400 transition hover:border-cyan-400/20 hover:bg-cyan-500/10 hover:text-cyan-100 md:w-auto md:px-4"
              aria-label="Open command palette"
            >
              <Command size={16} />
              <span className="hidden md:inline">Search or jump</span>
              <span className="hidden rounded-lg border border-white/10 px-2 py-0.5 text-xs text-gray-500 md:inline">Ctrl K</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200 transition hover:bg-cyan-500/15"
                aria-label="Open notifications"
              >
                <Bell size={18} />
                {notifications.filter((item) => item.status !== "read").length > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-gradient-to-r from-cyan-300 to-green-300 px-1.5 py-0.5 text-[10px] font-black text-black">
                    {notifications.filter((item) => item.status !== "read").length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/95 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-cyan-400/10 p-4">
                    <div>
                      <div className="text-sm font-black text-white">Notifications</div>
                      <div className="text-xs text-cyan-50/45">
                        Real CRM activity and reminders
                      </div>
                    </div>
                    <button
                      onClick={() => markNotificationsRead()}
                      className="inline-flex items-center gap-1 rounded-xl border border-cyan-400/20 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-500/10"
                    >
                      <CheckCheck size={14} />
                      Read
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto p-2">
                    {notificationsLoading ? (
                      <div className="p-4 text-sm text-cyan-50/55">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-sm text-cyan-50/55">
                        No notifications yet. New CRM activity, due tasks, appointment reminders, campaigns, and AI recommendations will appear here.
                      </div>
                    ) : (
                      notifications.slice(0, 12).map((item) => (
                        <Link
                          key={item.id}
                          href={item.href || pathname}
                          onClick={() => {
                            setNotificationsOpen(false);
                            markNotificationsRead(item);
                          }}
                          className="block rounded-2xl border border-transparent p-3 transition hover:border-cyan-400/15 hover:bg-cyan-500/10"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-white">{item.title}</div>
                              {item.message && (
                                <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-cyan-50/55">
                                  {item.message}
                                </div>
                              )}
                              {item.created_at && (
                                <div className="mt-2 text-[11px] text-cyan-50/35">
                                  {new Date(item.created_at).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.priority === "high" ? "bg-green-300" : "bg-cyan-300"}`} />
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3">

            <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">
              Review gated
            </div>

            <div className="px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-300 text-sm font-semibold">
              Real records
            </div>

            </div>
          </div>

        </header>

        {/* CONTENT */}
        <div className="p-4 md:p-8">
          {onboardingPrompt && (
            <div className="mb-5 rounded-3xl border border-cyan-400/20 bg-cyan-500/[0.06] p-4 shadow-xl shadow-cyan-500/5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Onboarding in progress</div>
                  <div className="mt-1 text-sm text-gray-300">
                    Workspace setup is {onboardingPrompt.score}% ready. Continue onboarding to finish billing, providers, lead setup, workflows, staff, and launch readiness.
                  </div>
                </div>
                <Link href="/onboarding" className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-3 text-sm font-black text-black">
                  Continue onboarding
                </Link>
              </div>
            </div>
          )}
          {children}
        </div>

      </main>

      {commandOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/95 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <Search className="text-cyan-300" size={18} />
              <input
                autoFocus
                value={commandQuery}
                onChange={(event) => setCommandQuery(event.target.value)}
                placeholder="Search leads, deals, tasks, campaigns, communications..."
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-gray-600"
              />
              <button onClick={() => setCommandOpen(false)} className="rounded-xl border border-white/10 p-2 text-gray-300 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {commandLoading ? (
                <div className="p-4 text-sm text-gray-400">Loading real CRM records...</div>
              ) : commandResults.length === 0 ? (
                <div className="p-4 text-sm text-gray-400">No matching real CRM records or quick actions.</div>
              ) : (
                commandResults.map((item, index) => (
                  <Link
                    key={`${item.type}-${item.label}-${index}`}
                    href={item.href}
                    onClick={() => {
                      setCommandOpen(false);
                      setCommandQuery("");
                    }}
                    className="block rounded-2xl border border-transparent p-3 transition hover:border-cyan-400/20 hover:bg-cyan-500/10"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-white">{item.label}</div>
                        {(item as any).detail && <div className="mt-1 truncate text-xs text-gray-500">{(item as any).detail}</div>}
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-cyan-100">{item.type}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
```

---

## app/dashboard/settings/page.tsx

```tsx
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Database,
  KeyRound,
  Loader2,
  Mail,
  MessageSquare,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  UserPlus,
  XCircle,
  Zap,
} from "lucide-react";
import { COMMITMENT_DISCOUNTS, CREDIT_PACKS, MANAGED_PLANS, SELF_SERVICE_BYOK_PLANS, SUBSCRIPTION_PLANS, TRIAL_PLANS } from "@/lib/billing/plans";
import { SERVICE_CATALOG } from "@/lib/billing/services";
import MiniBrainInsightPanel from "@/components/intelligence/MiniBrainInsightPanel";
import QueryRecordFocus from "@/components/dashboard/QueryRecordFocus";
import SimpleMetricModal, { type SimpleMetricDetail } from "@/components/dashboard/SimpleMetricModal";
import BillingPurchaseHistory from "@/components/settings/BillingPurchaseHistory";
import OwnerFocusPanel from "@/components/dashboard/OwnerFocusPanel";

const defaultForm = {
  business_name: "",
  industry: "",
  website: "",
  contact_email: "",
  phone: "",
  default_sender_name: "",
  default_sender_email: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
  brand_voice: "",
  tone: "professional",
  cta_style: "",
  audience_description: "",
  automation_level: "review_required",
};

const defaultAutomationPolicy = {
  mode: "assisted",
  external_communication_safety: "review_required",
  internal_action_safety: "review_required",
  categories: {
    email_replies: "review_required",
    sms_replies: "review_required",
    internal_tasks: "review_required",
    lead_scoring_updates: "review_required",
    deal_pipeline_updates: "review_required",
    appointment_suggestions: "review_required",
    workflow_recommendations: "review_required",
    campaign_recommendations: "review_required",
    intake_notifications: "review_required",
  },
};

const automationModeLabels: Record<string, string> = {
  conservative: "Conservative",
  assisted: "Assisted",
  autonomous_allowed: "Autonomous Where Allowed",
  review_required: "Conservative",
  recommend_only: "Conservative",
};

const behaviorLabels: Record<string, string> = {
  review_required: "Review Needed First",
  auto_safe: "Auto-Apply Where Safe",
  disabled: "Disabled",
};

const categoryLabels: Record<string, string> = {
  email_replies: "Email replies",
  sms_replies: "SMS replies",
  internal_tasks: "Internal tasks",
  lead_scoring_updates: "Lead scoring updates",
  deal_pipeline_updates: "Deal and pipeline updates",
  appointment_suggestions: "Appointment suggestions",
  workflow_recommendations: "Workflow recommendations",
  campaign_recommendations: "Campaign recommendations",
  intake_notifications: "Contact, waitlist, and service intake notifications",
};

function billingModeLabel(value: string | null | undefined) {
  if (value === "byok") return "Bring Your Own Key";
  if (value === "managed" || value === "synaptireach_managed") return "SynaptiReach Managed";
  return value ? String(value) : "Not selected";
}

function planDisplayName(value: string | null | undefined) {
  return (value || "Not selected").replace(/\bBYOK\b/g, "Bring Your Own Key");
}

function statusLabel(value: any) {
  if (value === true) return "Configured";
  if (value === false || value === null || value === undefined) return "Setup Required";
  if (typeof value === "object") {
    if (value.status === "disabled") return "Disabled";
    if (value.configured || value.enabled || value.checkoutEnabled) return "Configured";
    if (value.status === "missing") return "Setup Required";
  }
  return "Review";
}

function parseCreditPack(pack: string) {
  const amount = pack.match(/\$(\d+)/);
  const name = pack.split(":")[0]?.trim() || pack;
  const detail = pack.split(":").slice(1).join(":").trim() || pack;
  return {
    name,
    detail,
    label: pack,
    amountCents: amount ? Number(amount[1]) * 100 : null,
    priceLabel: amount ? `$${amount[1]}` : "Price pending",
  };
}

function serviceGroupLabel(category: string) {
  if (category.includes("Execution")) return "Marketing Execution";
  if (category.includes("Strategy")) return "Strategy";
  if (category.includes("Advanced")) return "Advanced Marketing";
  if (category.includes("AI Services")) return "AI Services";
  if (category.includes("Branding & SEO")) return "Branding & SEO";
  if (category.includes("Social & GMB")) return "Social & Google Business Profile";
  if (category.includes("Service Bundles")) return "Service Bundles";
  if (category.includes("Retainers")) return "Recurring Retainers";
  return category;
}

function SettingsSection({
  id,
  title,
  purpose,
  status,
  alert,
  defaultOpen = false,
  children,
}: {
  id?: string;
  title: string;
  purpose: string;
  status?: string;
  alert?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="rounded-3xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full flex-col gap-4 p-5 text-left md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-white">{title}</h2>
            {status && <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">{status}</span>}
            {alert && <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-100">{alert}</span>}
          </div>
          <p className="mt-2 text-sm text-gray-400">{purpose}</p>
        </div>
        <ChevronDown className={`text-cyan-200 transition ${open ? "rotate-180" : ""}`} size={20} />
      </button>
      {open && <div className="border-t border-white/10 p-5">{children}</div>}
    </section>
  );
}

const defaultStaffForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  title: "",
  status: "invited",
  permissions: ["dashboard:view", "leads:view", "tasks:view"],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [integrations, setIntegrations] = useState<Record<string, any>>({});
  const [aiProviders, setAiProviders] = useState<any>(null);
  const [providerConnections, setProviderConnections] = useState<any[]>([]);
  const [billing, setBilling] = useState<any>(null);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [creditPackPurchases, setCreditPackPurchases] = useState<any[]>([]);
  const [billingEvents, setBillingEvents] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [staffPermissions, setStaffPermissions] = useState<string[]>([]);
  const [staffForm, setStaffForm] = useState<any>(defaultStaffForm);
  const [providerKeys, setProviderKeys] = useState({ gemini: "", openrouter: "", openai: "", openrouter_model: "" });
  const [integrationKeys, setIntegrationKeys] = useState({ resend: "", twilioAccountSid: "", twilioAuthToken: "", ayrshare: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<SimpleMetricDetail | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<any>(null);
  const [automationPolicy, setAutomationPolicy] = useState<any>(defaultAutomationPolicy);
  const [selectedCreditPack, setSelectedCreditPack] = useState<string>(CREDIT_PACKS[0] || "");
  const [creditCheckoutModal, setCreditCheckoutModal] = useState(false);
  const [creditReturn, setCreditReturn] = useState<any>(null);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<string>("");
  const [billingSetupModal, setBillingSetupModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceRequestModal, setServiceRequestModal] = useState(false);
  const [serviceNotes, setServiceNotes] = useState("");
  const [serviceTimeline, setServiceTimeline] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [integrationConfig, setIntegrationConfig] = useState({
    resend: "",
    twilioAccountSid: "",
    twilioAuthToken: "",
    ayrshare: "",
    gemini: "",
    openrouter: "",
    openrouter_model: "",
    openai: "",
  });

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");
      const [response, staffResponse, simulationResponse] = await Promise.all([
        fetch("/api/crm/settings"),
        fetch("/api/crm/staff"),
        fetch("/api/test/simulation/status"),
      ]);
      const data = await response.json();
      const staffData = await staffResponse.json().catch(() => ({}));
      const simulationData = await simulationResponse.json().catch(() => null);

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to load settings.");
      }

      setSettings(data.settings);
      setIntegrations(data.integrations || {});
      setAiProviders(data.aiProviders || null);
      setProviderConnections(data.providerConnections || []);
      setBilling(data.billing || null);
      setUsage(data.usage || {});
      setCreditPackPurchases(data.creditPackPurchases || []);
      setBillingEvents(data.billingEvents || []);
      setServiceRequests(data.serviceRequests || []);
      if (staffData?.success) {
        setStaffMembers(staffData.staff || staffData.data || []);
        setStaffPermissions(staffData.permissions || []);
      }
      setSimulationStatus(simulationData?.allowed ? simulationData : null);
      setForm({ ...defaultForm, ...(data.settings || {}) });
      setAutomationPolicy({
        ...defaultAutomationPolicy,
        ...((data.settings?.metadata || {}).automation_policy || {}),
        categories: {
          ...defaultAutomationPolicy.categories,
          ...((data.settings?.metadata || {}).automation_policy?.categories || {}),
        },
      });
      const preferredPlanSlug =
        data.billing?.metadata?.plan_slug ||
        SUBSCRIPTION_PLANS.find((plan) => plan.name === (data.billing?.plan_tier || data.billing?.metadata?.selected_plan))?.slug ||
        "growth-managed";
      setSelectedSubscriptionPlan(preferredPlanSlug);

      const params = new URLSearchParams(window.location.search);
      const checkoutSessionId = params.get("session_id");
      if ((params.get("checkout") === "success" || params.get("subscription") === "success") && checkoutSessionId) {
        const storageKey = `synaptireach_checkout_notice_${checkoutSessionId}`;
        if (!sessionStorage.getItem(storageKey)) {
          const purchase = (data.creditPackPurchases || []).find((item: any) => item.checkout_reference === checkoutSessionId || item.metadata?.stripe_session_id === checkoutSessionId);
          setCreditReturn({
            kind: params.get("subscription") === "success" ? "subscription" : "credit_pack",
            sessionId: checkoutSessionId,
            purchase,
            status: purchase?.status || "pending_webhook",
          });
          sessionStorage.setItem(storageKey, "shown");
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function saveSettings() {
    return saveSettingsPatch(form, "Settings saved.");
  }

  async function saveSettingsPatch(values: any, message: string) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: settings?.id, ...values }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to save settings.");
      }

      setSettings(data.settings);
      setSuccess(message);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openIntegrationConfig(integration: any) {
    setSelectedIntegration(integration);
    setIntegrationConfig({
      resend: "",
      twilioAccountSid: "",
      twilioAuthToken: "",
      ayrshare: "",
      gemini: "",
      openrouter: "",
      openrouter_model: aiProviders?.openrouter_model || integrations.openrouter?.model || connectionByProvider.openrouter?.metadata?.model || "",
      openai: "",
    });
  }

  async function saveSelectedIntegration() {
    if (!selectedIntegration) return;
    try {
      setSavingSection(`integration_modal_${selectedIntegration.key}`);
      setError("");
      setSuccess("");
      const connections: any[] = [];
      if (selectedIntegration.key === "resend" && integrationConfig.resend) {
        connections.push({ provider: "resend", provider_type: "integration", secret: integrationConfig.resend });
      }
      if (selectedIntegration.key === "twilio") {
        if (integrationConfig.twilioAccountSid) connections.push({ provider: "twilio_account_sid", provider_type: "integration", secret: integrationConfig.twilioAccountSid });
        if (integrationConfig.twilioAuthToken) connections.push({ provider: "twilio_auth_token", provider_type: "integration", secret: integrationConfig.twilioAuthToken });
      }
      if (selectedIntegration.key === "ayrshare" && integrationConfig.ayrshare) {
        connections.push({ provider: "ayrshare", provider_type: "integration", secret: integrationConfig.ayrshare });
      }
      if (selectedIntegration.key === "gemini" && integrationConfig.gemini) {
        connections.push({ provider: "gemini", provider_type: "ai", secret: integrationConfig.gemini });
      }
      if (selectedIntegration.key === "openrouter" && (integrationConfig.openrouter || integrationConfig.openrouter_model)) {
        connections.push({
          provider: "openrouter",
          provider_type: "ai",
          secret: integrationConfig.openrouter || undefined,
          model: integrationConfig.openrouter_model || aiProviders?.openrouter_model || "openrouter/free",
          status: connectionByProvider.openrouter ? "configured" : "missing",
        });
      }
      if (selectedIntegration.key === "openai" && integrationConfig.openai) {
        connections.push({ provider: "openai", provider_type: "ai", secret: integrationConfig.openai });
      }
      if (connections.length === 0) {
        setError("Enter a supported key or model value before saving this integration.");
        return;
      }

      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "provider_connections", connections }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to save integration configuration.");
      setSuccess(`${selectedIntegration.label} configuration saved server-side.`);
      setSelectedIntegration(null);
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save integration configuration.");
    } finally {
      setSavingSection("");
    }
  }

  function updateAutomationCategory(key: string, value: string) {
    setAutomationPolicy((current: any) => ({
      ...current,
      categories: {
        ...(current.categories || {}),
        [key]: value,
      },
    }));
  }

  async function saveAutomationSettings() {
    const metadata = {
      ...(settings?.metadata || {}),
      automation_policy: {
        ...automationPolicy,
        updated_at: new Date().toISOString(),
      },
    };
    return saveSettingsPatch({
      brand_voice: form.brand_voice,
      tone: form.tone,
      cta_style: form.cta_style,
      audience_description: form.audience_description,
      automation_level: automationPolicy.mode === "conservative" ? "review_required" : automationPolicy.mode,
      metadata,
    }, "AI and automation behavior saved.");
  }

  async function saveProviderKeys(type: "ai" | "integration") {
    try {
      setSavingSection(type);
      setError("");
      setSuccess("");
      const aiConnections = [
        providerKeys.gemini && { provider: "gemini", provider_type: "ai", secret: providerKeys.gemini },
        providerKeys.openrouter && {
          provider: "openrouter",
          provider_type: "ai",
          secret: providerKeys.openrouter,
          model: providerKeys.openrouter_model || aiProviders?.openrouter_model || "openrouter/free",
        },
        providerKeys.openai && { provider: "openai", provider_type: "ai", secret: providerKeys.openai },
      ].filter(Boolean);
      const integrationConnections = [
        integrationKeys.resend && { provider: "resend", provider_type: "integration", secret: integrationKeys.resend },
        integrationKeys.twilioAccountSid && {
          provider: "twilio_account_sid",
          provider_type: "integration",
          secret: integrationKeys.twilioAccountSid,
        },
        integrationKeys.twilioAuthToken && {
          provider: "twilio_auth_token",
          provider_type: "integration",
          secret: integrationKeys.twilioAuthToken,
        },
        integrationKeys.ayrshare && { provider: "ayrshare", provider_type: "integration", secret: integrationKeys.ayrshare },
      ].filter(Boolean);

      const connections = type === "ai" ? aiConnections : integrationConnections;
      if (connections.length === 0) {
        setError("Enter at least one key before saving.");
        return;
      }

      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "provider_connections", connections }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to save keys.");
      setProviderKeys({ gemini: "", openrouter: "", openai: "", openrouter_model: "" });
      setIntegrationKeys({ resend: "", twilioAccountSid: "", twilioAuthToken: "", ayrshare: "" });
      setSuccess(type === "ai" ? "AI provider keys saved server-side." : "Integration keys saved server-side.");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save keys.");
    } finally {
      setSavingSection("");
    }
  }

  async function createCreditPackIntent(pack: string) {
    try {
      setSavingSection(pack);
      setError("");
      setSuccess("");
      const parsed = parseCreditPack(pack);
      const response = await fetch("/api/crm/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "credit_pack_intent",
          pack,
          price_cents: parsed.amountCents,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to create checkout intent.");
      if (data.checkoutUrl) {
        setSuccess("Stripe Checkout session created. Redirecting to Stripe for review and payment.");
        window.location.assign(data.checkoutUrl);
        return;
      }
      setSuccess(data.setupRequired
        ? "Credit pack checkout intent recorded. Add Stripe env vars to enable live checkout."
        : "Credit pack checkout intent recorded for review.");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create checkout intent.");
    } finally {
      setSavingSection("");
    }
  }

  async function openBillingPortal() {
    try {
      setSavingSection("billing_portal");
      setError("");
      setSuccess("");
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Billing Portal is not available yet.");
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      setSuccess("Billing Portal setup is required before payment methods can be managed.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to open Billing Portal.");
    } finally {
      setSavingSection("");
    }
  }

  async function startSubscriptionCheckout(planSlug: string) {
    try {
      setSavingSection(`subscription_${planSlug}`);
      setError("");
      setSuccess("");
      const response = await fetch("/api/billing/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planSlug }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to create subscription checkout.");
      }
      if (data.checkoutUrl) {
        setSuccess("Stripe subscription checkout created. Redirecting to Stripe for trial and payment review.");
        window.location.assign(data.checkoutUrl);
        return;
      }
      setSuccess(data.setupRequired
        ? "Subscription intent recorded. Add Stripe subscription price env vars before live checkout."
        : "Subscription intent recorded for review.");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create subscription checkout.");
    } finally {
      setSavingSection("");
    }
  }

  async function requestServices() {
    try {
      setSavingSection("services");
      setError("");
      setSuccess("");
      if (selectedServices.length === 0) {
        setError("Select at least one service, bundle, or retainer before requesting a consultation.");
        return;
      }
      const response = await fetch("/api/crm/services/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedServices, message: serviceNotes, requested_timeline: serviceTimeline }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to request service consultation.");
      setSuccess(`${selectedServices.length} consultation item${selectedServices.length === 1 ? "" : "s"} saved. SynaptiReach will review before any purchase or checkout.`);
      setServiceRequestModal(false);
      setSelectedServices([]);
      setServiceNotes("");
      setServiceTimeline("");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to request service consultation.");
    } finally {
      setSavingSection("");
    }
  }

  function toggleService(itemName: string) {
    setSelectedServices((current) =>
      current.includes(itemName) ? current.filter((item) => item !== itemName) : [...current, itemName]
    );
  }

  async function runSimulationAction(action: "seed" | "tick" | "reset" | "pause" | "resume") {
    try {
      setSavingSection(`simulation_${action}`);
      setError("");
      setSuccess("");
      const endpoint = action === "resume" ? "pause" : action;
      const response = await fetch(`/api/test/simulation/${endpoint}`, {
        method: action === "seed" || action === "tick" || action === "reset" || action === "pause" || action === "resume" ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "pause" ? { paused: true } : action === "resume" ? { paused: false } : {}),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.reason || data?.error || "Simulation action failed.");
      }
      setSuccess(
        action === "seed"
          ? "Test workspace seeded with simulated CRM data."
          : action === "tick"
            ? `Simulation advanced to day ${data.simulation_day}.`
            : action === "reset"
              ? "Test workspace simulation data reset."
              : action === "pause"
                ? "Test workspace simulation paused."
                : "Test workspace simulation resumed."
      );
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Simulation action failed.");
    } finally {
      setSavingSection("");
    }
  }

  async function saveStaffMember() {
    try {
      setSavingSection("staff");
      setError("");
      setSuccess("");
      if (!staffForm.name && !staffForm.email) {
        setError("Enter a staff name or email before saving.");
        return;
      }
      const response = await fetch("/api/crm/staff", {
        method: staffForm.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffForm),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data?.error || "Failed to save staff member.");
      setStaffForm(defaultStaffForm);
      setSuccess(staffForm.id ? "Staff member updated." : "Staff member invited.");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save staff member.");
    } finally {
      setSavingSection("");
    }
  }

  function editStaff(member: any) {
    setStaffForm({
      id: member.id,
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      title: member.title || "",
      status: member.status || "invited",
      permissions: member.permissions || [],
    });
  }

  function toggleStaffPermission(permission: string) {
    setStaffForm((current: any) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item: string) => item !== permission)
        : [...current.permissions, permission],
    }));
  }

  const connectionByProvider = providerConnections.reduce((map: Record<string, any>, connection) => {
    map[connection.provider] = connection;
    return map;
  }, {});
  const selectedPlanName = billing?.plan_tier || billing?.metadata?.selected_plan || "Growth Trial";
  const selectedPlan = [...TRIAL_PLANS, ...SUBSCRIPTION_PLANS].find((plan) => plan.name === selectedPlanName);
  const checkoutPlan = SUBSCRIPTION_PLANS.find((plan) => plan.slug === selectedSubscriptionPlan) || SUBSCRIPTION_PLANS.find((plan) => plan.name === selectedPlanName) || SUBSCRIPTION_PLANS[4] || SUBSCRIPTION_PLANS[0];
  const stripeStatus = integrations.stripe || {};
  const stripeReady = Boolean(stripeStatus.checkoutEnabled || stripeStatus.configured);
  const selectedPackDetails = parseCreditPack(selectedCreditPack);
  const serviceItemsByName = SERVICE_CATALOG.reduce((map: Record<string, any>, item) => {
    map[item.itemName] = item;
    return map;
  }, {});
  const selectedServiceItems = selectedServices.map((name) => serviceItemsByName[name]).filter(Boolean);
  const serviceOneTimeTotal = selectedServiceItems.filter((item) => !item.recurring).reduce((sum, item) => sum + Number(item.priceCents || 0), 0);
  const serviceMonthlyTotal = selectedServiceItems.filter((item) => item.recurring).reduce((sum, item) => sum + Number(item.priceCents || 0), 0);
  const groupedServices = SERVICE_CATALOG.reduce((groups: Record<string, any[]>, item) => {
    const group = serviceGroupLabel(item.category);
    groups[group] = [...(groups[group] || []), item];
    return groups;
  }, {});
  const integrationCards = [
    {
      key: "stripe",
      label: "Stripe / Billing",
      icon: CreditCard,
      status: statusLabel(stripeStatus),
      configured: stripeReady,
      description: "Hosted checkout, subscriptions, credit packs, and billing portal sessions.",
      fields: ["Stripe secret key", "Publishable key", "Webhook secret", "Plan price IDs"],
      managed: "SynaptiReach server-side configuration",
    },
    {
      key: "resend",
      label: "Resend / Email",
      icon: Mail,
      status: statusLabel(integrations.resend || connectionByProvider.resend),
      configured: Boolean(integrations.resend || connectionByProvider.resend),
      description: "Transactional email and review-gated outbound email sending.",
      fields: ["Resend API key", "Sender email/domain"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "twilio",
      label: "Twilio / SMS",
      icon: MessageSquare,
      status: statusLabel(integrations.twilio || connectionByProvider.twilio_auth_token),
      configured: Boolean(integrations.twilio || connectionByProvider.twilio_auth_token),
      description: "Review-gated SMS replies and future managed SMS subaccount support.",
      fields: ["Account SID", "Auth token", "From number"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "ayrshare",
      label: "Ayrshare / Social",
      icon: Share2,
      status: statusLabel(integrations.ayrshare || connectionByProvider.ayrshare),
      configured: Boolean(integrations.ayrshare || connectionByProvider.ayrshare),
      description: "Optional social publishing through platform profiles or customer-provided Ayrshare keys.",
      fields: ["Ayrshare API key", "Profile key"],
      managed: "Platform mode by default; Bring Your Own Key for advanced customers",
    },
    {
      key: "calendar",
      label: "Google Calendar / Calendar Sync",
      icon: CalendarDays,
      status: "Future Ready",
      configured: false,
      description: "Calendar sync remains setup-required/future-ready; internal appointments continue working.",
      fields: ["Google OAuth connection"],
      managed: "Customer connection required",
    },
    {
      key: "gmb",
      label: "Google Business Profile",
      icon: Database,
      status: "Future Ready",
      configured: false,
      description: "Future local presence integration for reviews and profile workflows.",
      fields: ["Google Business Profile connection"],
      managed: "Customer connection required",
    },
    {
      key: "openai",
      label: "OpenAI",
      icon: Sparkles,
      status: statusLabel(integrations.openai),
      configured: Boolean(integrations.openai?.configured || connectionByProvider.openai),
      description: "Optional premium AI provider. Disabled unless explicitly enabled server-side.",
      fields: ["OpenAI key", "AI_ENABLE_OPENAI flag"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "gemini",
      label: "Gemini",
      icon: Sparkles,
      status: statusLabel(integrations.gemini || connectionByProvider.gemini),
      configured: Boolean(integrations.gemini?.configured || connectionByProvider.gemini),
      description: "AI provider for enhanced recommendations when configured.",
      fields: ["Gemini API key"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "openrouter",
      label: "OpenRouter",
      icon: Sparkles,
      status: statusLabel(integrations.openrouter || connectionByProvider.openrouter),
      configured: Boolean(integrations.openrouter?.configured || connectionByProvider.openrouter),
      description: "AI provider fallback with configurable model routing.",
      fields: ["OpenRouter API key", "Model"],
      managed: "SynaptiReach Managed or Bring Your Own Key",
    },
    {
      key: "local_connector",
      label: "Local Connector",
      icon: ShieldCheck,
      status: "Future Ready",
      configured: false,
      description: "Future optional desktop connector for local AI tasks. Not required for launch.",
      fields: ["Connector app", "Pairing token", "Local model health"],
      managed: "Customer local setup",
    },
  ];

  return (
    <main className="min-h-screen text-white">
      <QueryRecordFocus keys={["settingsId"]} hashIds={["billing", "usage", "providers", "services"]} />
      <SimpleMetricModal metric={selectedMetric} onClose={() => setSelectedMetric(null)} />
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs mb-4">
          <Settings size={14} />
          Workspace Settings
        </div>
        <h1 className="text-5xl font-black mb-4 leading-tight">
          CRM
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            {" "}Settings
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Business profile, AI behavior, and integration status without exposing secrets.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-16"><Loader2 className="animate-spin text-cyan-300" /></div>
      ) : (
        <>
          {error && <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
          {success && <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">{success}</div>}
          {simulationStatus && (
            <div className="mb-5 rounded-3xl border border-green-400/20 bg-green-500/10 p-5 text-sm text-green-100">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-green-200">Simulated Test Workspace</div>
                  <div className="mt-2 text-white">
                    {simulationStatus.seeded
                      ? `Seeded. Day ${simulationStatus.state?.simulation_day || 0}. Last tick ${simulationStatus.state?.last_tick_at ? new Date(simulationStatus.state.last_tick_at).toLocaleString() : "not run yet"}.`
                      : "Configured but not seeded yet."}
                  </div>
                  <div className="mt-1 text-xs text-green-100/70">
                    Version {simulationStatus.simulationVersion}. These controls are hidden from normal workspaces.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["seed", "Seed"],
                    ["tick", "Run Tick"],
                    [simulationStatus.state?.paused ? "resume" : "pause", simulationStatus.state?.paused ? "Resume" : "Pause"],
                    ["reset", "Reset"],
                  ].map(([action, label]) => (
                    <button
                      key={action}
                      onClick={() => runSimulationAction(action as any)}
                      disabled={savingSection === `simulation_${action}`}
                      className="rounded-2xl border border-green-300/20 bg-black/30 px-4 py-3 text-xs font-black text-green-100 disabled:opacity-60"
                    >
                      {savingSection === `simulation_${action}` ? "Working..." : label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <OwnerFocusPanel
            items={[
              {
                label: "Business profile",
                value: form.business_name ? "Saved" : "Needed",
                detail: "Business identity and sender defaults make CRM drafts, reminders, and settings easier to trust.",
                href: "/dashboard/settings#profile",
                action: "Review profile",
                tone: form.business_name ? "green" : "yellow",
              },
              {
                label: "Integrations",
                value: `${integrationCards.filter((item) => item.configured).length}/${integrationCards.length}`,
                detail: "Provider cards show configured, setup-required, and future-ready services without exposing keys.",
                href: "/dashboard/settings#providers",
                action: "Open integration status",
                tone: "cyan",
              },
              {
                label: "Billing",
                value: stripeReady ? "Ready" : "Setup required",
                detail: "Billing setup stays Stripe-owned. Settings can resume setup without creating fake paid states.",
                href: "/dashboard/settings#billing",
                action: "Review billing",
                tone: stripeReady ? "green" : "yellow",
              },
            ]}
          />

          <SettingsSection
            title="Setup & Usage Intelligence"
            purpose="Provider readiness, Bring Your Own Key setup, billing usage, and launch-readiness checks without exposing secrets."
            status="Readiness signals"
            defaultOpen={false}
          >
            <MiniBrainInsightPanel
              title="Setup & Usage Intelligence"
              subtitle="Provider readiness, Bring Your Own Key setup, billing usage, and launch-readiness checks without exposing secrets."
              types={["billing_usage_intelligence", "onboarding_setup", "safety_compliance", "simulation"]}
            />
          </SettingsSection>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <SettingsSection
                id="profile"
                title="Business Profile"
                purpose="Workspace identity, sender defaults, contact details, and timezone."
                status={`${form.business_name || "Unnamed business"}${form.industry ? ` · ${form.industry}` : ""}${form.contact_email ? ` · ${form.contact_email}` : ""}`}
                defaultOpen={false}
              >
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <button onClick={() => saveSettingsPatch({
                    business_name: form.business_name,
                    industry: form.industry,
                    website: form.website,
                    contact_email: form.contact_email,
                    phone: form.phone,
                    default_sender_name: form.default_sender_name,
                    default_sender_email: form.default_sender_email,
                    timezone: form.timezone,
                  }, "Business profile saved.")} disabled={saving} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60">
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["business_name", "Business Name"],
                    ["industry", "Industry"],
                    ["website", "Website"],
                    ["contact_email", "Contact Email"],
                    ["phone", "Phone"],
                    ["timezone", "Timezone"],
                    ["default_sender_name", "Default Sender Name"],
                    ["default_sender_email", "Default Sender Email"],
                  ].map(([key, label]) => (
                    <input
                      key={key}
                      value={(form as any)[key] || ""}
                      onChange={(event) => updateField(key, event.target.value)}
                      placeholder={label}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
                    />
                  ))}
                </div>
              </SettingsSection>

              <SettingsSection
                title="CRM Automation & AI Behavior"
                purpose="Controls message drafting, task recommendations, workflow actions, appointment suggestions, lead scoring, campaign recommendations, and external-send safety."
                status={automationModeLabels[automationPolicy.mode] || "Assisted"}
                alert={automationPolicy.categories?.email_replies === "auto_safe" || automationPolicy.categories?.sms_replies === "auto_safe" ? "External send opt-in review" : undefined}
              >
                <div className="mb-5 rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.05] p-4 text-sm text-cyan-50/75">
                  External email and SMS remain review-gated unless a workspace explicitly opts in and provider readiness is verified. This page saves policy; send routes still require explicit confirmation.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={form.brand_voice || ""} onChange={(event) => updateField("brand_voice", event.target.value)} placeholder="Brand voice" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input value={form.tone || ""} onChange={(event) => updateField("tone", event.target.value)} placeholder="Default response tone" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input value={form.cta_style || ""} onChange={(event) => updateField("cta_style", event.target.value)} placeholder="Preferred CTA style" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <select value={automationPolicy.mode || "assisted"} onChange={(event) => setAutomationPolicy((current: any) => ({ ...current, mode: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                    <option value="conservative">Conservative - Always ask first</option>
                    <option value="assisted">Assisted - Prepare drafts and recommendations</option>
                    <option value="autonomous_allowed">Autonomous Where Allowed - Internal actions only</option>
                  </select>
                  <select value={automationPolicy.external_communication_safety || "review_required"} onChange={(event) => setAutomationPolicy((current: any) => ({ ...current, external_communication_safety: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                    <option value="review_required">External communication safety: Review Needed First</option>
                    <option value="disabled">External communication safety: Disabled</option>
                    <option value="auto_safe">External communication safety: Auto-send where explicitly allowed</option>
                  </select>
                  <select value={automationPolicy.internal_action_safety || "review_required"} onChange={(event) => setAutomationPolicy((current: any) => ({ ...current, internal_action_safety: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
                    <option value="review_required">Internal action safety: Review Needed First</option>
                    <option value="auto_safe">Internal action safety: Auto-Apply Where Safe</option>
                    <option value="disabled">Internal action safety: Disabled</option>
                  </select>
                </div>
                <textarea value={form.audience_description || ""} onChange={(event) => updateField("audience_description", event.target.value)} placeholder="Audience / customer profile" className="mt-4 w-full min-h-[120px] rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <label key={key} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="mb-2 text-sm font-bold text-white">{label}</div>
                      <select value={automationPolicy.categories?.[key] || "review_required"} onChange={(event) => updateAutomationCategory(key, event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white">
                        <option value="review_required">Review Needed First</option>
                        <option value="auto_safe">Auto-Apply / Auto-Send where safe and allowed</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </label>
                  ))}
                </div>
                <button onClick={saveAutomationSettings} disabled={saving} className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-6 py-4 font-black text-black flex items-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                  Save AI & Automation Settings
                </button>
              </SettingsSection>

              <SettingsSection
                title="Connect Your AI Keys"
                purpose="Save customer-provided AI provider keys server-side. Saved keys are encrypted and shown only as masked labels."
                status="Bring Your Own Key"
              >
                <p className="mb-4 text-sm text-gray-400">
                  SynaptiReach keys are never shown. Your Bring Your Own Key credentials are encrypted server-side and displayed only as configured/missing after save.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="password" value={providerKeys.gemini} onChange={(event) => setProviderKeys({ ...providerKeys, gemini: event.target.value })} placeholder="Gemini API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={providerKeys.openrouter} onChange={(event) => setProviderKeys({ ...providerKeys, openrouter: event.target.value })} placeholder="OpenRouter API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input value={providerKeys.openrouter_model} onChange={(event) => setProviderKeys({ ...providerKeys, openrouter_model: event.target.value })} placeholder="OpenRouter model (default openrouter/free)" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={providerKeys.openai} onChange={(event) => setProviderKeys({ ...providerKeys, openai: event.target.value })} placeholder="OpenAI key (optional premium)" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                </div>
                <button onClick={() => saveProviderKeys("ai")} disabled={savingSection === "ai"} className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60">
                  {savingSection === "ai" ? "Saving..." : "Save AI Provider Keys"}
                </button>
              </SettingsSection>

              <SettingsSection
                title="Connect Sending Integrations"
                purpose="Save customer-provided email, SMS, and social provider credentials without exposing secrets in the browser."
                status="Review-gated sends"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="password" value={integrationKeys.resend} onChange={(event) => setIntegrationKeys({ ...integrationKeys, resend: event.target.value })} placeholder="Resend API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.twilioAccountSid} onChange={(event) => setIntegrationKeys({ ...integrationKeys, twilioAccountSid: event.target.value })} placeholder="Twilio Account SID" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.twilioAuthToken} onChange={(event) => setIntegrationKeys({ ...integrationKeys, twilioAuthToken: event.target.value })} placeholder="Twilio Auth Token" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                  <input type="password" value={integrationKeys.ayrshare} onChange={(event) => setIntegrationKeys({ ...integrationKeys, ayrshare: event.target.value })} placeholder="Ayrshare API key" className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                </div>
                <button onClick={() => saveProviderKeys("integration")} disabled={savingSection === "integration"} className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-100 disabled:opacity-60">
                  {savingSection === "integration" ? "Saving..." : "Save Integration Keys"}
                </button>
              </SettingsSection>
            </div>

            <SettingsSection
              id="providers"
              title="Integration Status"
              purpose="Customer-facing provider status for billing, email, SMS, social, calendar, Google profile, AI providers, and future local connector."
              status={`${integrationCards.filter((item) => item.configured).length} configured`}
              alert={stripeReady ? undefined : "Billing setup required"}
            >
              <div className="grid gap-3 md:grid-cols-2">
                {integrationCards.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <button
                      key={integration.key}
                      onClick={() => openIntegrationConfig(integration)}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Icon className="text-cyan-300" size={18} />
                          <div>
                            <div className="font-bold text-white">{integration.label}</div>
                            <div className="mt-1 text-xs text-gray-500">{integration.description}</div>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${integration.configured ? "border-cyan-400/20 bg-cyan-500/10 text-cyan-100" : "border-yellow-400/20 bg-yellow-500/10 text-yellow-100"}`}>
                          {integration.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SettingsSection>

            <SettingsSection
              title="AI Providers"
              purpose="Provider readiness and routing metadata. Secrets are never displayed."
              status={aiProviders?.priority?.length ? `${aiProviders.priority.length} in routing order` : "Review"}
            >
              <div className="space-y-3">
                {[
                  ["Gemini", "gemini"],
                  ["OpenRouter", "openrouter"],
                  ["OpenAI", "openai"],
                ].map(([label, key]) => {
                  const configured = Boolean(aiProviders?.configured?.[key]);
                  const enabled = Boolean(aiProviders?.enabled?.[key]);
                  const openAIDisabled =
                    key === "openai" && aiProviders?.openai_enabled === false;
                  const priority =
                    (aiProviders?.priority || []).indexOf(key) + 1;
                  const statusText = openAIDisabled
                    ? "Disabled"
                    : enabled
                      ? "Configured"
                      : "Missing";
                  const statusClass = openAIDisabled
                    ? "text-gray-400"
                    : enabled
                      ? "text-cyan-300"
                      : "text-red-200";

                  return (
                    <div key={key} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-300">{label}</span>
                        <span className={`flex items-center gap-2 text-sm font-bold ${statusClass}`}>
                          {enabled ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          {statusText}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {priority > 0 ? `Priority ${priority}` : "Not in active priority"}
                      </div>
                      {connectionByProvider[key]?.key_label && (
                        <div className="text-xs text-gray-500 mt-1">Bring Your Own Key saved: {connectionByProvider[key].key_label}</div>
                      )}
                      {key === "openrouter" && (
                        <div className="text-xs text-gray-500 mt-1">
                          Model {aiProviders?.openrouter_model || integrations.openrouter?.model || "openrouter/free"}
                        </div>
                      )}
                      {key === "openai" && openAIDisabled && (
                        <div className="text-xs text-gray-500 mt-1">
                          Enable with AI_ENABLE_OPENAI=true for premium-only usage.
                        </div>
                      )}
                      {configured && !enabled && !openAIDisabled && (
                        <div className="text-xs text-gray-500 mt-1">
                          Key is present but provider is not active.
                        </div>
                      )}
                    </div>
                  );
                })}
                {aiProviders?.warnings?.length > 0 && (
                  <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-xs text-yellow-100">
                    {aiProviders.warnings.map((warning: any) => warning.reason).join(". ")}
                  </div>
                )}
              </div>
            </SettingsSection>

            <div className="xl:col-span-3">
            <SettingsSection
              id="billing"
              title="Trial, Caps & Billing Rules"
              purpose="Current plan, trial, billing status, usage caps, and safe Stripe-hosted setup controls."
              status={billing?.status || "Setup Required"}
              alert={stripeReady ? undefined : "Stripe setup required"}
            >
              <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                14-day free trial. No managed SMS during trial unless the user connects their own Twilio provider. Trial caps are hard caps, no overages. Commit before your trial ends and save up to 30%.
              </div>
              <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  ["Plan", planDisplayName(selectedPlanName)],
                  ["Status", billing?.status || "Setup required"],
                  ["Billing Mode", billingModeLabel(billing?.billing_mode)],
                  ["Trial Ends", billing?.trial_ends_at ? new Date(billing.trial_ends_at).toLocaleString() : "not set"],
                ].map(([label, value]) => (
                  <button
                    key={label}
                    onClick={() => setSelectedMetric({
                      title: String(label),
                      value: String(value),
                      description: `${label} is pulled from the workspace billing account. Subscription and payment state still require Stripe webhook confirmation.`,
                      records: billing ? [billing] : [],
                      href: "/dashboard/settings#billing",
                    })}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">{label}</div>
                    <div className="mt-2 font-black text-white">{value}</div>
                  </button>
                ))}
              </div>
              <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  ["AI", usage.ai || usage.ai_actions || 0, selectedPlan?.aiActions || "select plan"],
                  ["Email", usage.email || usage.emails || 0, selectedPlan?.emails || "select plan"],
                  ["SMS", usage.sms || 0, selectedPlan?.sms || "select plan"],
                  ["Contacts", usage.contacts || 0, selectedPlan?.contacts || "select plan"],
                ].map(([label, used, cap]) => (
                  <button
                    key={label}
                    onClick={() => setSelectedMetric({
                      title: `${label} Usage`,
                      value: `${used} used`,
                      description: `Current usage against the selected plan cap. Managed plans use hard caps and no surprise overages.`,
                      records: [{ type: label, used, cap, plan: planDisplayName(selectedPlan?.name || selectedPlanName) }],
                      href: "/dashboard/settings#usage",
                    })}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="text-sm text-gray-400">{label}</div>
                    <div className="mt-2 text-xl font-black">{used} used</div>
                    <div className="text-xs text-gray-500">out of {cap}</div>
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Selected tier</div>
                    <div className="mt-2 text-xl font-black text-white">{planDisplayName(selectedPlan?.name || selectedPlanName)}</div>
                  </div>
                  {selectedPlan && "price" in selectedPlan && <div className="text-xl font-black text-cyan-300">{selectedPlan.price}</div>}
                </div>
                {selectedPlan ? (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 text-sm text-gray-400">
                    <div>AI: <span className="text-white">{selectedPlan.aiActions}</span></div>
                    <div>Email: <span className="text-white">{selectedPlan.emails}</span></div>
                    <div>SMS: <span className="text-white">{selectedPlan.sms}</span></div>
                    <div>Contacts: <span className="text-white">{selectedPlan.contacts}</span></div>
                    <div>AI review checks: <span className="text-white">{selectedPlan.agents}</span></div>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-400">No selected plan record found yet. Complete onboarding or billing setup to store the selected tier.</div>
                )}
              </div>
              {billing?.metadata?.checkout_origin === "onboarding" && ["pending_webhook", "checkout_created"].includes(billing?.status) ? (
                <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-50/85">
                  <div className="font-black">Onboarding submitted for billing review</div>
                  <p className="mt-1">
                    Stripe checkout was submitted from onboarding. Trial activation remains pending until Stripe webhook confirmation updates the billing account.
                  </p>
                  <a href="/onboarding?step=billing" className="mt-3 inline-flex rounded-xl border border-yellow-300/30 px-3 py-2 text-xs font-black text-yellow-50">
                    Continue onboarding
                  </a>
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {COMMITMENT_DISCOUNTS.map((item) => (
                  <span key={item.duration} className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-300">
                    {item.duration}: {item.discount} off
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <CreditCard className="text-cyan-300" size={18} />
                    <h3 className="font-black">Payment Method</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    {stripeReady
                      ? "Stripe Checkout is configured for credit-pack payment review. Saved payment-method management still requires a dedicated billing portal route."
                      : "Stripe/payment integration is not connected yet. Add Stripe env vars before collecting or updating payment methods."}
                  </p>
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-400">
                    Status: {stripeReady ? `Stripe ${stripeStatus.mode || "configured"}` : "setup required"}
                    {stripeStatus.webhookConfigured ? " · Webhook configured" : " · Webhook missing"}
                  </div>
                  <button
                    onClick={openBillingPortal}
                    disabled={!stripeReady || savingSection === "billing_portal"}
                    className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-gray-500"
                  >
                    {savingSection === "billing_portal"
                      ? "Opening..."
                      : stripeReady
                        ? "Open Billing Portal"
                        : "Connect billing provider required"}
                  </button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <h3 className="font-black">Usage Cost Rules</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Bring Your Own Key users pay their own provider usage separately. SynaptiReach Managed plans consume included credits and require credit packs or an upgrade after caps are reached.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.04] p-5">
                <h3 className="text-xl font-black">Complete Billing Setup</h3>
                <p className="mt-2 text-sm text-cyan-50/65">
                  Onboarding is the primary place to choose a plan and add a payment method. Settings lets you resume billing setup, change plan, or manage billing later. After the 14-day trial, your selected plan renews automatically unless canceled before the trial ends. Checkout is hosted by Stripe, and no subscription is marked active until Stripe confirms it.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <button key={plan.slug} type="button" onClick={() => setSelectedSubscriptionPlan(plan.slug)} className={`rounded-2xl border p-4 text-left transition ${selectedSubscriptionPlan === plan.slug ? "border-cyan-300/50 bg-cyan-400/10" : "border-white/10 bg-black/30 hover:border-cyan-400/30"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-black text-white">{planDisplayName(plan.name)}</div>
                          <div className="text-xs text-gray-500">{billingModeLabel(plan.billingMode)}</div>
                        </div>
                        <div className="font-black text-cyan-200">{plan.price}</div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        {plan.overCapBehavior}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Selected plan</div>
                      <div className="mt-1 font-black text-white">{planDisplayName(checkoutPlan?.name || "Select a plan")} · {checkoutPlan ? billingModeLabel(checkoutPlan.billingMode) : "Not selected"}</div>
                    </div>
                    <button
                      onClick={() => setBillingSetupModal(true)}
                      disabled={!checkoutPlan || Boolean(savingSection)}
                      className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60"
                    >
                      {stripeReady ? (billing?.stripe_customer_id ? "Change Plan" : "Complete Billing Setup") : "Record Billing Intent"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="mb-3 text-xl font-black">Credit Packs</h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {CREDIT_PACKS.map((pack) => (
                    <button key={pack} type="button" onClick={() => setSelectedCreditPack(pack)} className={`rounded-2xl border p-4 text-left transition ${selectedCreditPack === pack ? "border-cyan-300/50 bg-cyan-400/10" : "border-white/10 bg-black/30 hover:border-cyan-400/30"}`}>
                      <div className="font-bold text-white">{parseCreditPack(pack).name}</div>
                      <div className="mt-1 text-sm text-gray-400">{parseCreditPack(pack).detail}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Selected credit pack</div>
                      <div className="mt-1 font-black text-white">{selectedPackDetails.name} · {selectedPackDetails.priceLabel}</div>
                      <div className="mt-1 text-xs text-gray-500">{selectedPackDetails.detail}. Stripe securely handles payment details.</div>
                    </div>
                    <button onClick={() => setCreditCheckoutModal(true)} disabled={Boolean(savingSection)} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60">
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
              <BillingPurchaseHistory
                billing={billing}
                creditPackPurchases={creditPackPurchases}
                billingEvents={billingEvents}
                serviceRequests={serviceRequests}
                resendConfigured={Boolean(integrations.resend)}
                setSelectedMetric={setSelectedMetric}
                planDisplayName={planDisplayName}
                billingModeLabel={billingModeLabel}
              />
            </SettingsSection>
            </div>

            <div id="services" className="xl:col-span-3">
            <SettingsSection
              title="Services, Bundles & Retainers"
              purpose="Select one or more implementation services and request a consultation. No payment is triggered from this section."
              status={`${selectedServices.length} selected`}
              defaultOpen={false}
            >
              <p className="mb-5 text-sm text-cyan-50/65">
                Request a 30-minute SynaptiReach consultation before purchasing implementation services. Requests are stored for review and do not trigger payment.
              </p>
              <div className="space-y-5">
                {Object.entries(groupedServices).map(([group, items]) => (
                  <div key={group} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h3 className="mb-3 font-black text-white">{group}</h3>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((item) => (
                        <button key={`${item.serviceType}-${item.itemName}`} type="button" onClick={() => toggleService(item.itemName)} className={`rounded-2xl border p-4 text-left transition ${selectedServices.includes(item.itemName) ? "border-cyan-300/50 bg-cyan-400/10" : item.popular ? "border-cyan-300/25 bg-cyan-400/5 hover:border-cyan-400/40" : "border-white/10 bg-black/30 hover:border-cyan-400/30"}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-black text-white">{item.itemName}</div>
                              <div className="text-xs text-gray-500">{item.recurring ? "Monthly retainer" : "One-time service"}</div>
                            </div>
                            <div className="font-black text-cyan-200">{item.priceLabel}</div>
                          </div>
                          {item.popular && <div className="mt-2 text-xs font-black text-green-200">MOST POPULAR</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Selected estimate</div>
                    <div className="mt-1 font-black text-white">
                      ${(serviceOneTimeTotal / 100).toLocaleString()} one-time · ${(serviceMonthlyTotal / 100).toLocaleString()}/mo recurring
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Consultation required before purchase, checkout, or fulfillment.</div>
                  </div>
                  <button onClick={() => setServiceRequestModal(true)} disabled={selectedServices.length === 0 || Boolean(savingSection)} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100 disabled:opacity-60">
                    Request Consultation
                  </button>
                </div>
              </div>
            </SettingsSection>
            </div>

            <div className="xl:col-span-3">
            <SettingsSection
              title="Staff & Permissions"
              purpose="Invite staff, review permissions, and prepare for role-based CRM access."
              status={`${staffMembers.length} staff`}
            >
              <p className="mb-5 text-sm text-gray-400">
                Staff records and granted permissions are stored server-side. The UI exposes allowed actions, and API routes can enforce these permissions through the shared workspace access helpers.
              </p>
              <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5">
                  <h3 className="mb-4 font-black">{staffForm.id ? "Edit Staff Member" : "Add Staff Member"}</h3>
                  <div className="grid gap-3">
                    <input value={staffForm.name} onChange={(event) => setStaffForm({ ...staffForm, name: event.target.value })} placeholder="Name" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                    <input value={staffForm.email} onChange={(event) => setStaffForm({ ...staffForm, email: event.target.value })} placeholder="Email" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                    <input value={staffForm.phone} onChange={(event) => setStaffForm({ ...staffForm, phone: event.target.value })} placeholder="Phone" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                    <input value={staffForm.title} onChange={(event) => setStaffForm({ ...staffForm, title: event.target.value })} placeholder="Title" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white" />
                    <select value={staffForm.status} onChange={(event) => setStaffForm({ ...staffForm, status: event.target.value })} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
                      <option value="invited">invited</option>
                      <option value="active">active</option>
                      <option value="paused">paused</option>
                      <option value="archived">archived</option>
                    </select>
                  </div>
                  <div className="mt-4 max-h-52 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-gray-500">Permissions</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {staffPermissions.map((permission) => (
                        <label key={permission} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300">
                          <input
                            type="checkbox"
                            checked={staffForm.permissions.includes(permission)}
                            onChange={() => toggleStaffPermission(permission)}
                          />
                          {permission}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={saveStaffMember} disabled={savingSection === "staff"} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-3 text-sm font-black text-black disabled:opacity-60">
                      {savingSection === "staff" ? "Saving..." : "Save Staff"}
                    </button>
                    {staffForm.id && (
                      <button onClick={() => setStaffForm(defaultStaffForm)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-white">Cancel Edit</button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {staffMembers.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-gray-400">
                      No staff records yet. Add staff when you are ready to delegate CRM access.
                    </div>
                  ) : staffMembers.map((member) => (
                    <div key={member.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-black text-white">{member.name || member.email}</div>
                          <div className="text-sm text-gray-500">{member.title || member.email || "Staff member"}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{member.status}</span>
                          <button onClick={() => editStaff(member)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white">Edit</button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(member.permissions || []).slice(0, 10).map((permission: string) => (
                          <span key={permission} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-300">{permission}</span>
                        ))}
                        {(member.permissions || []).length > 10 && <span className="text-xs text-gray-500">+{member.permissions.length - 10} more</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SettingsSection>
            </div>
          </section>
          {creditReturn && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                  {creditReturn.kind === "subscription" ? "Subscription checkout received" : "Credit pack purchase received"}
                </div>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {creditReturn.purchase?.pack_type || (creditReturn.kind === "subscription" ? "Billing setup submitted" : "Credit pack checkout submitted")}
                </h3>
                <p className="mt-3 text-sm text-gray-300">
                  {creditReturn.status === "paid"
                    ? "Stripe has confirmed this payment. SynaptiReach will reflect the updated state in billing and usage records."
                    : creditReturn.kind === "subscription"
                      ? "Your Stripe checkout was submitted. SynaptiReach will update subscription state only after Stripe webhook confirmation."
                      : "Your payment was submitted. SynaptiReach will apply credits after Stripe confirms the payment."}
                </p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                  Status: <span className="font-bold text-white">{creditReturn.status === "paid" ? "Confirmed" : "Pending Stripe webhook confirmation"}</span>
                </div>
                <button onClick={() => setCreditReturn(null)} className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black">
                  Got it
                </button>
              </div>
            </div>
          )}

          {creditCheckoutModal && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Secure checkout</div>
                <h3 className="mt-2 text-2xl font-black text-white">{selectedPackDetails.name}</h3>
                <p className="mt-3 text-sm text-gray-300">{selectedPackDetails.detail}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm text-gray-400">Amount</div>
                  <div className="mt-1 text-2xl font-black text-white">{selectedPackDetails.priceLabel}</div>
                  <div className="mt-2 text-xs text-gray-500">Stripe securely handles payment details. Credits are not applied until webhook confirmation.</div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => createCreditPackIntent(selectedCreditPack)} disabled={Boolean(savingSection)} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60">
                    {savingSection === selectedCreditPack ? "Creating..." : "Checkout"}
                  </button>
                  <button onClick={() => setCreditCheckoutModal(false)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {billingSetupModal && checkoutPlan && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Billing setup confirmation</div>
                <h3 className="mt-2 text-2xl font-black text-white">{planDisplayName(checkoutPlan.name)}</h3>
                <p className="mt-3 text-sm text-gray-300">
                  This starts Stripe-hosted setup for a 14-day trial. A card is required before trial activation. After the trial, {planDisplayName(checkoutPlan.name)} renews automatically unless canceled before the trial ends.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm text-gray-400">Billing mode</div>
                    <div className="mt-1 font-black text-white">{billingModeLabel(checkoutPlan.billingMode)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm text-gray-400">Monthly price</div>
                    <div className="mt-1 font-black text-white">{checkoutPlan.price}</div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">Stripe handles payment details securely. SynaptiReach employees never see card numbers. Subscription state changes only after verified Stripe webhook events.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => startSubscriptionCheckout(checkoutPlan.slug)} disabled={Boolean(savingSection)} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60">
                    {savingSection === `subscription_${checkoutPlan.slug}` ? "Creating..." : "Continue to Stripe Checkout"}
                  </button>
                  <button onClick={() => setBillingSetupModal(false)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {serviceRequestModal && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Consultation request</div>
                <h3 className="mt-2 text-2xl font-black text-white">Review selected services</h3>
                <div className="mt-4 max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4">
                  {selectedServiceItems.map((item) => (
                    <div key={item.itemName} className="flex items-center justify-between gap-3 border-b border-white/10 py-2 last:border-b-0">
                      <div>
                        <div className="font-bold text-white">{item.itemName}</div>
                        <div className="text-xs text-gray-500">{serviceGroupLabel(item.category)}</div>
                      </div>
                      <div className="font-bold text-cyan-200">{item.priceLabel}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">One-time estimate: <span className="font-black text-white">${(serviceOneTimeTotal / 100).toLocaleString()}</span></div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">Monthly estimate: <span className="font-black text-white">${(serviceMonthlyTotal / 100).toLocaleString()}/mo</span></div>
                </div>
                <input value={serviceTimeline} onChange={(event) => setServiceTimeline(event.target.value)} placeholder="Requested timeline" className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                <textarea value={serviceNotes} onChange={(event) => setServiceNotes(event.target.value)} placeholder="Notes, goals, or implementation needs" className="mt-3 min-h-[110px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white" />
                <p className="mt-3 text-xs text-gray-500">A 30-minute consultation is required before purchase. This does not trigger Stripe checkout or mark anything paid.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={requestServices} disabled={savingSection === "services"} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60">
                    {savingSection === "services" ? "Requesting..." : "Request Consultation"}
                  </button>
                  <button onClick={() => setServiceRequestModal(false)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {selectedIntegration && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 py-6 sm:items-center sm:p-4">
              <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Integration configuration</div>
                    <h3 className="mt-2 text-2xl font-black text-white">{selectedIntegration.label}</h3>
                  </div>
                  <button onClick={() => setSelectedIntegration(null)} className="rounded-full border border-white/10 px-3 py-1 text-sm text-white">Close</button>
                </div>
                <p className="mt-3 text-sm text-gray-300">{selectedIntegration.description}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                  Status: <span className="font-bold text-white">{selectedIntegration.status}</span>
                </div>
                {(() => {
                  const keyLabels: Record<string, string[]> = {
                    resend: ["resend"],
                    twilio: ["twilio_account_sid", "twilio_auth_token"],
                    ayrshare: ["ayrshare"],
                    gemini: ["gemini"],
                    openrouter: ["openrouter"],
                    openai: ["openai"],
                  };
                  const labels = (keyLabels[selectedIntegration.key] || [])
                    .map((provider) => connectionByProvider[provider]?.key_label)
                    .filter(Boolean);
                  return labels.length > 0 ? (
                    <div className="mt-3 rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.06] p-4 text-xs text-cyan-100">
                      Saved key label{labels.length === 1 ? "" : "s"}: {labels.join(", ")}
                    </div>
                  ) : null;
                })()}
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-2 text-sm font-bold text-white">Required fields</div>
                    <ul className="space-y-1 text-xs text-gray-400">
                      {selectedIntegration.fields.map((field: string) => <li key={field}>{field}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-2 text-sm font-bold text-white">Management mode</div>
                    <div className="text-xs text-gray-400">{selectedIntegration.managed}</div>
                  </div>
                </div>
                {["resend", "twilio", "ayrshare", "gemini", "openrouter", "openai"].includes(selectedIntegration.key) ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-3 text-sm font-bold text-white">Add or update configuration</div>
                    <div className="grid gap-3">
                      {selectedIntegration.key === "resend" && (
                        <input type="password" value={integrationConfig.resend} onChange={(event) => setIntegrationConfig({ ...integrationConfig, resend: event.target.value })} placeholder="Resend API key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                      )}
                      {selectedIntegration.key === "twilio" && (
                        <>
                          <input type="password" value={integrationConfig.twilioAccountSid} onChange={(event) => setIntegrationConfig({ ...integrationConfig, twilioAccountSid: event.target.value })} placeholder="Twilio Account SID" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                          <input type="password" value={integrationConfig.twilioAuthToken} onChange={(event) => setIntegrationConfig({ ...integrationConfig, twilioAuthToken: event.target.value })} placeholder="Twilio Auth Token" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                        </>
                      )}
                      {selectedIntegration.key === "ayrshare" && (
                        <input type="password" value={integrationConfig.ayrshare} onChange={(event) => setIntegrationConfig({ ...integrationConfig, ayrshare: event.target.value })} placeholder="Ayrshare API key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                      )}
                      {selectedIntegration.key === "gemini" && (
                        <input type="password" value={integrationConfig.gemini} onChange={(event) => setIntegrationConfig({ ...integrationConfig, gemini: event.target.value })} placeholder="Gemini API key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                      )}
                      {selectedIntegration.key === "openrouter" && (
                        <>
                          <input type="password" value={integrationConfig.openrouter} onChange={(event) => setIntegrationConfig({ ...integrationConfig, openrouter: event.target.value })} placeholder="OpenRouter API key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                          <input value={integrationConfig.openrouter_model} onChange={(event) => setIntegrationConfig({ ...integrationConfig, openrouter_model: event.target.value })} placeholder="OpenRouter model" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                        </>
                      )}
                      {selectedIntegration.key === "openai" && (
                        <input type="password" value={integrationConfig.openai} onChange={(event) => setIntegrationConfig({ ...integrationConfig, openai: event.target.value })} placeholder="OpenAI key" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white" />
                      )}
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button onClick={saveSelectedIntegration} disabled={Boolean(savingSection)} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:opacity-60 sm:w-auto">
                        {savingSection === `integration_modal_${selectedIntegration.key}` ? "Saving..." : "Save / Update"}
                      </button>
                      <button disabled className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-gray-500 sm:w-auto">
                        Test connection future-ready
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-gray-400">
                    This integration is future/setup required. Configuration and test-connection actions will be enabled when a safe provider route exists.
                  </div>
                )}
                <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-xs text-yellow-100">
                  Secrets remain server-side and encrypted through the existing provider connection save path. Saved secrets are never displayed; only masked key labels are shown.
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
```

---

## docs/onboarding.md

```md
# SynaptiReach Onboarding

implements:: [[SynaptiReach Onboarding]]
depends_on:: [[User CRM]]
depends_on:: [[Business Profile]]
depends_on:: [[Billing & Purchase History]]
depends_on:: [[CRM Automation & AI Behavior]]
connects_to:: [[Dashboard Preview]]
documents:: [[SynaptiReach]]

## Current Flow

`/onboarding` is the first-run workspace setup wizard for real User CRM workspaces. It saves and resumes through `/api/onboarding/save`, completes through `/api/onboarding/complete`, and routes activated users to `/dashboard`.

The current wizard collects:

- account owner details
- business profile, legal/company details, industry, service type, main customer type, target customer, main offer, preferred CTA, sales process, and brand voice
- service areas, business hours, primary service/product categories, top services/products, common customer problems, common questions/objections, emergency/priority rules, booking/quote/review notes, legal/company acknowledgement, and optional service/product menu upload
- trial path, post-trial plan, Stripe card acknowledgement, auto-renewal acknowledgement, usage caps, and managed SMS approval intent
- AI processing mode, provider setup, recommendation behavior, risk tolerance, topics to avoid, draft-vs-task preference, communication defaults, and rule-based intelligence preference
- email, SMS, social, and calendar integration setup states
- lead import/manual starter lead intent and CSV mapping notes
- pipeline stages, lead statuses, sources, tags, appointment types, task defaults, assignment guidance, deal value/close-time expectations, stale lead/deal thresholds, follow-up timing, owner assignment preference, and won/lost reasons
- staff invite rows and requested permissions
- marketing goals, channels, campaign notes, budget/offer/segment guidance, retargeting interest, review request timing, analytics preferences, baseline lead/appointment volume, goals, notification preferences, and workflow draft recommendations
- free guidance, guided setup call, and paid DFY assistance preference

The wizard writes to existing structures where possible:

- `workspaces` and `workspace_members` for workspace ownership.
- `onboarding_sessions` for save/resume payload, current step, completed steps, skipped steps, and launch readiness score.
- `crm_settings` for business profile, audience, service profile, sales setup, CRM defaults, analytics preferences, communication defaults, calendar setup, marketing preferences, help preference, brand voice, timezone, and automation safety policy.
- `crm_billing_accounts` for selected plan, trial path, usage caps, managed SMS readiness, and billing intent only. Paid, subscribed, and trialing states still require Stripe Checkout and webhook confirmation.
- `crm_provider_connections` for AI, email, SMS, social, and calendar setup states. Provider secrets are encrypted server-side and not returned to the browser.
- `leads`, `crm_csv_imports`, `marketing_events`, and `crm_ai_recommendations` for real lead CSV/manual starter setup.
- `crm_staff` and `crm_staff_permissions` for pending staff invite rows and requested access. No invite email is sent automatically.
- `crm_workflows` for onboarding-created workflow drafts only. Draft workflows remain review-gated and do not send externally.
- `crm_ai_recommendations` for launch-readiness recommendations generated from missing or pending real setup state.
- `crm_service_menu_uploads` for onboarding service/product menu metadata, private storage path, and pending analysis/review state. Uploads also create a review recommendation and best-effort task; no extraction success is inferred unless a real analyzer is available.

## Status and Routing

`/onboarding/status` is the submitted-review holding page. Submitted-but-not-complete users see grouped state for submission, billing/webhook, providers, legal/company, email/SMS, calendar, menu, staff, leads, workflows, and help. Incomplete users that have not submitted are redirected back to `/onboarding?step=<saved step>`. Completed users are sent to `/dashboard`. The status page now offers Edit onboarding and Sign Out; Sign Out clears the Supabase session and returns to the public homepage.

Dashboard layout checks onboarding state before showing CRM pages. Submitted sessions go to `/onboarding/status`; incomplete unsubmitted sessions resume onboarding from the saved step. Direct `/onboarding` access requires an authenticated Supabase session and redirects unauthenticated users to `/signin?returnTo=...` instead of trying to load indefinitely.

## Service Menu Storage

The onboarding menu upload route uses a private Supabase Storage bucket named `onboarding-files`.

Required setup:

- Bucket name: `onboarding-files`.
- Visibility: private.
- Accepted MIME types: `application/pdf`, `image/png`, `image/jpeg`, `image/webp`.
- Accepted extensions: PDF, PNG, JPG/JPEG, WEBP.
- Suggested file size limit: 25 MB.
- Access pattern: server-side upload/read using the service role; do not expose public URLs.
- Path format: `<workspace_id>/service-menu/<timestamp>-<uuid>.<ext>`.
- Metadata includes workspace id, user id, company id when present, content type, size, bucket, storage path, and pending analysis state.

If the bucket is missing, `/api/onboarding/upload` attempts to create it privately. If creation fails because storage is not provisioned or permissions are unavailable, the route returns setup-required instructions instead of pretending the upload or analysis succeeded.

## Trial Paths

Onboarding supports two 14-day trial paths:

- SynaptiReach-Managed Trial: full software access with hard free caps for managed AI, email, SMS, contacts, workflows, and AI review checks. A Stripe card is required before the trial starts. The selected paid plan controls post-trial renewal only; higher managed tiers do not expand trial exposure. Managed SMS is optional and approval-based, and readiness requires approval for estimated Twilio/carrier registration and messaging costs plus the SynaptiReach $20 setup fee approval.
- BYOK Trial: full software access while the customer connects their own Gemini/OpenAI/OpenRouter, Resend, Twilio, and Ayrshare accounts as needed. The customer pays providers directly. SynaptiReach has no managed AI/email/SMS credit exposure. A Stripe card is still required before the trial starts, and optional self-imposed caps can be saved.

Stripe Checkout remains the only card collection path. Onboarding-originated subscription checkout now returns to `/onboarding?checkout=success&session_id={CHECKOUT_SESSION_ID}&step=billing` or `/onboarding?checkout=cancelled&step=billing`; Settings-originated checkout still returns to Settings. On Stripe return, onboarding confirms auth, records the checkout session id through `/api/onboarding/stripe-session`, updates billing visibility to `pending_webhook` when webhook-owned statuses are not already present, and shows Billing only for the fresh return without permanently overwriting the saved onboarding step. If the Stripe status refresh fails, the Billing step shows a retryable error instead of an infinite loading state. Trial start/end timestamps and active/trialing/subscribed states are left empty until Stripe webhook confirmation supplies them.

## CRM Population Mapping

New or expanded CRM-aware fields are stored in `crm_settings.metadata` and related existing records only:

- Business/workspace: `main_customer_type`, `service_areas`, `business_hours`, `primary_categories`, `top_services_products`, `common_customer_questions`, `common_customer_objections`, `emergency_priority_rules`, booking/quote/review notes, and brand voice.
- Leads/pipeline/tasks: `pipeline_stages`, `lead_statuses`, `lead_sources`, `lead_tags`, `crm_defaults.stale_lead_threshold`, `crm_defaults.stale_deal_threshold`, `crm_defaults.follow_up_timing`, `crm_defaults.owner_assignment_preference`, appointment types, default task types, and won/lost reasons.
- Dashboard/analytics: `analytics_preferences.primary_kpi`, monthly lead/revenue/appointment goals, conversion goal, average customer value, current monthly lead volume, current monthly appointment volume, reporting cadence, 30/60/90-day goals, and pain points.
- Communications and AI: `communications_setup`, `ai_behavior.risk_tolerance`, `ai_behavior.topics_to_avoid`, and `ai_behavior.draft_mode`.
- Calendar/marketing/workflows: calendar appointment/default duration/reminder/no-show preferences, marketing goals/channels/offers/segments/retargeting/review timing, and workflow draft preferences.
- Billing/help/review: trial path, post-trial plan, managed SMS readiness, usage cap preferences, service-menu upload review state, and onboarding help/DFY service request intent.

Required fields remain owner identity, core business profile, legal review acknowledgement, trial path/plan acknowledgements, AI mode, reviewed email/SMS/calendar choices, billing submission, and safety acknowledgement. Optional fields pre-configure the CRM and can be completed later. No optional field creates fake customers, revenue, provider success, paid state, or subscription state.

Current managed trial caps are centralized in `lib/billing/plans.ts`: 300 AI credits, 250 emails, 0 SMS by default, 25 SMS after approval/payment, 250 contacts, 10 active workflows, 25 agent runs, 2 invited staff users, 5 campaign drafts, 1 CSV import, and 10 onboarding files / 25 MB total if file storage is enabled.

The post-trial plan-fit panel explains that trial access can be broader than the selected post-trial tier. Existing CRM data is not deleted automatically; future usage beyond the selected plan cap is restricted until upgrade or eligible capacity is added.

## Launch Readiness

Launch readiness is calculated from saved onboarding and CRM state:

- business type
- business profile completeness
- plan selection
- explicit billing state
- legal/company review acknowledgement
- Supabase auth email verification state
- AI provider setup
- email and SMS integration review
- calendar setup review
- optional service/product menu upload/review
- lead import or starter lead setup
- staff setup or solo selection
- automation safety acknowledgement
- marketing and workflow setup
- help/DFY preference

Statuses may be `complete`, `pending`, `skipped`, or `missing`. Pending and skipped items remain visible and are connected to `/dashboard/settings`, `/dashboard/leads`, and billing/provider setup paths.

The shared dashboard layout shows a continue-onboarding prompt until the saved onboarding session is complete.

Email verification is part of launch readiness and final onboarding completion gating. The current implementation uses Supabase auth email-confirmation state; a dedicated custom verification-code UI/API remains a future hardening item.

## Help and DFY

Onboarding includes a floating help panel and a dedicated help step. Rule-based help is the default. AI help remains optional and provider-dependent. Users can request:

- Guided Setup Call: Free 30 minutes.
- Extended Setup Support: $99/hour.
- Provider Setup Assistance: $149.
- CRM Import + Cleanup: $199.
- Campaign Setup Assistance: $249.
- Workflow Setup Assistance: $249.
- Full Onboarding Setup: $599.
- Premium Launch Setup: $999+.

Guidance is free when the user performs setup with SynaptiReach guidance. If SynaptiReach performs setup for the user, it is paid DFY work and remains consultation/review-gated before checkout or fulfillment.

Onboarding Help/DFY selections create `crm_service_requests` rows with `metadata.source = onboarding_help`. These records store requested service, price label, notes, consultation requirement, and checkout state without creating paid orders.

## Safety Rules

- Onboarding does not mark paid/subscribed states unless Stripe confirms them through existing Checkout/webhook flow.
- Onboarding does not switch Stripe to live mode.
- Onboarding does not auto-charge outside Stripe Checkout.
- Onboarding does not auto-send customer email, SMS, or social messages.
- Normal users do not receive mock CRM records. CSV/manual lead setup only writes user-provided records.
- Service/product menu upload accepts PDF, PNG, JPG/JPEG, and WEBP. Uploads require a Supabase Storage bucket named `onboarding-files`; when stored, extraction remains `pending_analysis` / `needs_review` until AI or admin review actually parses it.

## Schema Compatibility

`supabase/user_crm_full_completion_schema.sql` includes additive repairs for older databases that created `workspace_members` or `onboarding_sessions` before the current onboarding metadata columns existed. The onboarding flow expects:

- `workspace_members.status`
- `workspace_members.metadata`
- `workspace_members.updated_at`
- `onboarding_sessions.payload`
- `onboarding_sessions.completed`
- `onboarding_sessions.metadata`
- `onboarding_sessions.updated_at`

The schema now explicitly repairs `onboarding_sessions.metadata` with:

```sql
ALTER TABLE public.onboarding_sessions ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
```

The schema ends with `notify pgrst, 'reload schema';` so Supabase/PostgREST refreshes column metadata after the migration is applied.

The schema also includes `crm_service_menu_uploads` for onboarding menu files. The table stores only metadata, storage bucket/path, analysis state, extraction state, optional structured knowledge, and review metadata. Files live in Supabase Storage under the `onboarding-files` bucket.

## Stabilization Pass Notes - 2026-05-27

- Subscription checkout accepts `source=onboarding` / `return_to=onboarding` and returns hosted Stripe Checkout to onboarding billing instead of Settings.
- Billing no longer offers "Save and continue later" on the required billing step.
- Plain Save persists progress without marking incomplete required steps complete; Continue validates, saves, then unlocks the next step.
- Future step navigation is locked to the first incomplete required step; readiness jumps cannot bypass locked steps.
- Legal/company review now has an explicit acknowledgement, and Tax ID last 4 is labeled optional.
- Email and SMS require reviewed setup choices instead of full Resend/Twilio connection unless the user chooses setup now.
- Local Connector was removed from AI mode.
- Brand voice has editable starter copy.
- Calendar setup choices are saved and do not block launch unless marked required.
- Staff presets map to real permissions: leads, pipeline, tasks, calendar, communications, marketing, workflow, settings_read, and admin.
- Workflow draft options were expanded and remain draft/review-gated.
- Help/DFY appears earlier after Business.
- Service/product menu uploads save metadata and create a review recommendation without faking extraction success.

## Fix Pass Notes - 2026-05-27

- Onboarding save is tolerant of stale production schema cache: it writes `metadata`/`updated_at` when available and falls back to payload-backed progress if those columns are not yet visible.
- Continue validates required fields, saves server-side, and then advances one step.
- Skip for now is disabled on required steps and records intentional skip state on optional steps.
- Step navigation is locked for future steps; users can return to completed/unlocked steps.
- Readiness items are clickable and navigate to the relevant onboarding step.
- The billing step uses the explicit “Set up payment method with Stripe” action and Stripe-hosted checkout only.
- The completion button is now “Complete Onboarding” and remains blocked until required readiness gates are complete.
- Dashboard onboarding prompts fetch with the active Supabase session token and also prompt when a workspace exists but no completed onboarding session exists.
- Provider test buttons call `POST /api/onboarding/provider-test`, save/read server-side readiness state, and do not send campaigns, email, SMS, or social posts.

## Stabilization and CRM Population Pass - 2026-05-28

- Stripe Checkout returns are processed through `/api/onboarding/stripe-session` instead of a generic onboarding save, so a fresh Billing display does not permanently overwrite the saved step.
- Stripe return status failures now show a retryable Billing error.
- `/onboarding` and `/onboarding/status` redirect unauthenticated users to sign-in with a return URL.
- Submitted users are routed to `/onboarding/status` unless they are editing onboarding from a specific step; completed users are routed to `/dashboard`.
- Subscription checkout now verifies the authenticated user owns the requested workspace before creating checkout state.
- Status page `Finish Later` is now `Sign Out`.
- `Business profile saved` is now `Business Profile`; `Stripe card setup state is explicit` is now `Billing Set-Up`.
- CRM-aware optional fields now populate `crm_settings.metadata` for real workspace defaults and admin/review context. No SQL changes were required.
- `npm.cmd run build` passed and generated 153/153 static pages.
```

---

## exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md

```md
# Final Full CRM Completion Checklist

## Onboarding Stabilization and CRM Population Pass - 2026-05-28

- [x] Preserved existing onboarding flow instead of redesigning it.
- [x] Preserved OwnerFocusPanel, grouped sidebar, Review gated / Real records wording, dashboard routes, Stripe webhook ownership, save/resume architecture, `/onboarding/status`, and `/api/onboarding/stripe-session`.
- [x] Inspected CRM pages and flows: `/dashboard`, `/dashboard/analytics`, `/dashboard/leads`, `/dashboard/pipeline`, `/dashboard/tasks`, `/dashboard/calendar`, `/dashboard/communications`, `/dashboard/marketing`, `/dashboard/workflow`, `/dashboard/ai_assistant`, `/dashboard/settings`, CRM APIs/helpers, analytics/metrics, workflow, notification, staff, billing/usage/caps, and service-menu upload code.
- [x] Fixed Stripe checkout return handling so success return calls `/api/onboarding/stripe-session` and does not save Billing as the permanent onboarding step.
- [x] Added recoverable Stripe status-check error with Retry status check button.
- [x] Added unauthenticated `/onboarding` redirect to `/signin?returnTo=...`.
- [x] Added submitted-user `/onboarding` redirect to `/onboarding/status` unless the user is editing from a specific onboarding step.
- [x] Completed onboarding redirects to `/dashboard`.
- [x] Continue saves the next step; Save and Finish Later preserve the current step.
- [x] Tightened subscription checkout to require an authenticated user and an owned workspace.
- [x] Kept onboarding save/complete/upload/provider-test/stripe-session scoped to the authenticated user's owned workspace/session.
- [x] Changed readiness labels to `Business Profile` and `Billing Set-Up`.
- [x] Changed `/onboarding/status` action from Finish Later to Sign Out and clears the Supabase session before returning home.
- [x] Added helper text/placeholders for CRM-aware terms such as pipeline stages, lead sources, conversion rate, average customer value, brand/AI risk, workflow draft behavior, retargeting, and usage warnings.
- [x] Added onboarding fields that map to `crm_settings.metadata`: main customer type, primary categories, top services/products, common questions/objections, emergency rules, stale thresholds, follow-up timing, owner assignment preference, analytics goals/baselines, AI risk/topics/draft mode, reminder timing, retargeting interest, review request timing, draft-only automations, and usage warning preferences.
- [x] Directly populates real CRM settings/defaults only; no fake CRM records, fake analytics, fake revenue, fake provider success, or fake paid/subscribed/trialing state.
- [x] No SQL/schema changes required; fields are metadata-backed.
- [ ] Manual test: unauthenticated `/onboarding` does not hang.
- [ ] Manual test: unauthorized user cannot access another user's onboarding.
- [ ] Manual test: incomplete user returns to exact saved step.
- [ ] Manual test: submitted/pending user lands on `/onboarding/status`.
- [ ] Manual test: approved/active user lands on `/dashboard`.
- [ ] Manual test: Stripe return does not get stuck on Loading onboarding state.
- [ ] Manual test: Stripe return stores checkout state and shows Billing status.
- [ ] Manual test: status page button says Sign Out.
- [ ] Manual test: CRM-aware onboarding fields save into real CRM settings/defaults.
- [x] `npm.cmd run build` passed and generated 153/153 static pages.

## User CRM Portal Usability Pass - 2026-05-27

- [x] Read `docs/codex/USER_CRM_PORTAL_USABILITY_GOAL.md`.
- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Read `docs/knowledge-map.md`, `docs/architecture.md`, and `docs/decisions.md`.
- [x] Continued from the current working tree without restarting completed work.
- [x] Did not redo onboarding.
- [x] Did not redo billing, webhook, payment history, local AI, CRM Intelligence data flow, simulation bootstrap, public pages, or Settings billing work.
- [x] Audited dashboard pages before editing:
  - `/dashboard`
  - `/dashboard/leads`
  - `/dashboard/pipeline`
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/communications`
  - `/dashboard/marketing`
  - `/dashboard/workflow`
  - `/dashboard/analytics`
  - `/dashboard/ai_assistant`
  - `/dashboard/settings`
- [x] Audited shared dashboard layout/sidebar/header.
- [x] Audited shared Business Intelligence panel and Settings billing history component.
- [x] Added shared owner-focus panel component at `components/dashboard/OwnerFocusPanel.tsx`.
- [x] Added owner-focus summaries to all scoped dashboard pages using existing real page counts/status where available.
- [x] Kept owner-focus panels presentation-only; no database writes or state ownership changes were added.
- [x] Grouped sidebar navigation into Start, Customers, Growth, Work, and Review.
- [x] Preserved existing dashboard routes and hrefs.
- [x] Renamed the sidebar workflow label to `Automations` while preserving `/dashboard/workflow`.
- [x] Replaced static topbar `AI Online` / `Synced` labels with safer non-fake `Review gated` / `Real records` labels.
- [x] Clarified shared intelligence cards with visible `Why it matters` and `Suggested next step` blocks.
- [x] Changed AI Assistant built-in intelligence source label from underscored internal wording to customer-facing text.
- [x] Preserved review-gated email, SMS, social, workflow, and billing safety behavior.
- [x] Did not introduce fake data, fake users, fake billing states, fake analytics, fake prospects, fake service orders, fake revenue, or simulated CRM records for normal users.
- [x] Did not expose secrets, commit `.env.local`, switch Stripe to live mode, auto-send email/SMS/social, or auto-charge outside Stripe Checkout.
- [x] Updated `docs/knowledge-map.md`, `docs/architecture.md`, and `docs/decisions.md`.
- [x] Created/updated Obsidian note `User CRM Portal Usability.md`.
- [x] Checked/updated Obsidian `SynaptiReach MOC.md` with `[[User CRM Portal Usability]]`.
- [x] `npm.cmd run build` passed and generated 150/150 static pages.
- [x] Local production smoke returned HTTP 200 for all scoped dashboard routes.
- [ ] Authenticated desktop browser visual review remains required.
- [ ] Authenticated mobile browser visual review remains required.
- [ ] Manual click-through remains required for owner-focus panel links, grouped sidebar navigation, intelligence modal details, and each page's primary create/review actions.
- [ ] In-app Browser automation was unavailable because tool discovery exposed no Browser tools in this session.

## First-run Onboarding Prompt Pack Pass - 2026-05-27

- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Read `docs/knowledge-map.md`, `docs/architecture.md`, and `docs/decisions.md`.
- [x] Continued from the current working tree without restarting completed User CRM work.
- [x] Searched for onboarding prompt files in `docs/codex`, `docs/onboarding`, `docs/synaptireach-onboarding-prompts`, `exports`, and files with onboarding/prompt/master names.
- [x] Confirmed no dedicated onboarding prompt pack exists in the repo; used onboarding guidance from `docs/codex_synaptireach_prompt_reading_roadmap.md` and `docs/codex_synaptireach_global_goal_runbook.md`.
- [x] Inspected the current onboarding implementation:
  - `app/onboarding`
  - `app/onboarding/select`
  - `app/api/onboarding/*`
  - billing/subscription checkout flow
  - provider connection save path
  - business profile/settings save path
  - CSV import flow
  - staff invite/staff permission flow
  - launch readiness/intelligence setup references
- [x] Replaced placeholder onboarding save/integration/upload behavior with authenticated real-state APIs.
- [x] Added shared onboarding server helper at `lib/onboarding/server.ts`.
- [x] Onboarding save/resume now writes real state through existing structures where possible:
  - `workspaces`
  - `workspace_members`
  - `onboarding_sessions`
  - `crm_settings`
  - `crm_billing_accounts`
  - `crm_provider_connections`
  - `leads`
  - `crm_csv_imports`
  - `crm_staff`
- [x] Added polished multi-step `/onboarding` wizard:
  - welcome/business type
  - business profile
  - plan/trial selection
  - billing setup or continue-later state
  - AI processing mode/provider setup
  - email/SMS/social/calendar integration setup
  - lead CSV import or manual starter lead setup
  - staff setup
  - automation safety preferences
  - launch readiness review and activation
- [x] Onboarding does not mark paid/subscribed states unless Stripe confirms them.
- [x] Billing setup stores plan intent and setup-required/checkout-required state only.
- [x] Stripe Checkout handoff uses existing `/api/billing/subscription/checkout`.
- [x] Provider secrets are encrypted server-side and cleared from client state after save.
- [x] Onboarding makes incomplete, skipped, and pending setup explicit in launch readiness.
- [x] Launch readiness uses saved onboarding state, provider connection rows, billing state, business profile completeness, lead setup/import state, staff setup, and safety preferences.
- [x] CSV import is now workspace-scoped when a workspace is known and records `crm_csv_imports`.
- [x] Upload endpoint no longer returns a mock file URL; it fails setup-required until real storage is connected.
- [x] Added repo documentation in `docs/onboarding.md`.
- [x] Updated `docs/knowledge-map.md`, `docs/architecture.md`, and `docs/decisions.md`.
- [x] First `npm.cmd run build` compiled successfully but timed out during static page generation at 180 seconds.
- [x] Second `npm.cmd run build` passed and generated 150/150 static pages.
- [x] Local smoke returned HTTP 200 for `/onboarding`.
- [x] Local smoke returned HTTP 200 for `/onboarding/select`.
- [x] Unauthenticated `GET /api/onboarding/save` returned HTTP 401.
- [x] `POST /api/onboarding/upload` returned setup-required HTTP 501.
- [ ] Authenticated browser walkthrough remains required.
- [ ] Live Supabase row verification remains required for a real onboarding save.
- [ ] Stripe Checkout redirect from the Billing step remains to be tested with an authenticated session in test mode.
- [ ] Provider key save/readiness needs live verification with test credentials.
- [ ] Real CSV import through onboarding needs live verification with user-owned CSV data.
- [x] Created/updated Obsidian note `SynaptiReach Onboarding.md` in the SynaptiReach project vault.
- [x] Checked/updated `SynaptiReach MOC.md` with `[[SynaptiReach Onboarding]]`.

## First-run Onboarding Final Verification Pass - 2026-05-27

- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `docs/onboarding.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Continued only the onboarding pass from the current working tree.
- [x] Did not start the User CRM portal usability pass.
- [x] Inspected current onboarding changes in:
  - `app/api/onboarding/*`
  - `app/onboarding/*`
  - `app/api/crm/leads/import/route.ts`
  - `lib/crm/importLeadsCsv.ts`
  - `lib/onboarding/server.ts`
  - onboarding-related docs
- [x] Verified onboarding uses real authenticated state and real database writes through existing structures.
- [x] Verified onboarding writes plan/billing intent only and does not create fake paid/subscribed state.
- [x] Verified Stripe Checkout remains the handoff for billing setup.
- [x] Verified provider secrets are sanitized from saved onboarding payloads, encrypted server-side before provider-connection storage, omitted from readiness snapshots, and cleared from client state after save.
- [x] Verified `.env.local` is not tracked.
- [x] Verified CSV import still validates empty imports and the 5,000-row limit.
- [x] Verified CSV duplicate checks are workspace-scoped when a workspace is available and retain prior global behavior when no workspace scope is available.
- [x] Verified existing CRM lead import still calls the shared importer and now passes workspace/company/user context when available.
- [x] Added idempotent schema compatibility repairs for older tables:
  - `workspace_members.status`
  - `workspace_members.metadata`
  - `workspace_members.updated_at`
  - `onboarding_sessions.payload`
  - `onboarding_sessions.completed`
  - `onboarding_sessions.metadata`
  - `onboarding_sessions.updated_at`
  - `workspaces.updated_at`
- [x] Tightened `/api/onboarding/integrations` so unauthenticated shared-save failures return HTTP 401 instead of a 200 wrapper.
- [x] Verified onboarding connects to `/dashboard`, `/dashboard/settings`, and `/dashboard/leads`.
- [x] Updated `docs/onboarding.md`.
- [x] `npm.cmd run build` passed and generated 150/150 static pages.
- [x] Local production smoke returned HTTP 200 for `/onboarding`.
- [x] Local production smoke returned HTTP 200 for `/onboarding/select`.
- [x] Unauthenticated `GET /api/onboarding/save` returned HTTP 401.
- [x] Unauthenticated `POST /api/onboarding/integrations` returned HTTP 401.
- [x] `POST /api/onboarding/upload` returned setup-required HTTP 501.
- [x] Updated Obsidian `SynaptiReach Onboarding.md` with final verification status.
- [ ] Authenticated browser walkthrough remains required.
- [ ] Live Supabase row verification remains required for real onboarding save/resume.
- [ ] Stripe Checkout redirect from onboarding Billing step remains to be tested with an authenticated session in test mode.
- [ ] Provider key save/readiness needs live verification with test credentials.
- [ ] Real CSV import through onboarding needs live verification with user-owned CSV data.
- [ ] Onboarding is not committed/clean yet; do not start the User CRM usability pass until this onboarding work is committed and the worktree is clean.

## Final User CRM Readiness Audit - 2026-05-27

- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Read `docs/knowledge-map.md`, `docs/architecture.md`, and `docs/decisions.md`.
- [x] Continued from the current working tree without restarting completed work.
- [x] Verified `.env.local` is not tracked by git.
- [x] Ran a redacted committed-secret scan.
- [x] Removed a hardcoded Supabase service-role key and demo password from `create-test-user.mjs`; the utility now requires env vars and no longer prints passwords.
- [x] Tightened Settings API Resend readiness so customer receipt email readiness requires both `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
- [x] Verified `npm.cmd run build` passes and generates 150/150 static pages.
- [x] Verified `/dashboard/settings` returns HTTP 200 in local production smoke.
- [x] Verified `/api/crm/settings` returns HTTP 200 and exposes credit-pack purchase, billing-event, and service-request history arrays used by Billing & Purchase History.
- [x] Verified the production webhook route exists in the build at `/api/billing/stripe/webhook`.
- [x] Verified unsigned local `POST /api/billing/stripe/webhook` is rejected with HTTP 400.
- [x] Verified checkout-created credit-pack records are created as pending/checkout states and are only marked `paid` in signed Stripe webhook processing paths.
- [x] Verified Billing & Purchase History copy explains pending webhook confirmation and does not claim credits are applied before webhook confirmation.
- [x] Verified Resend temporary sender/domain limitation is documented in the UI/checklist: `SynaptiReach <onboarding@resend.dev>` is test-only until a real sending domain is verified.
- [x] Preserved no live-mode Stripe changes, no auto-send behavior, and no fake paid/subscribed state.
- [ ] Rotate the Supabase service-role key and demo credentials that were previously present in tracked `create-test-user.mjs`.
- [ ] Run a full production Stripe test-mode checkout and confirm the production webhook updates the record through `https://synapti-reach.vercel.app/api/billing/stripe/webhook`.
- [ ] Purchase and verify a real Resend sending domain before treating customer receipt email delivery as launch-ready.
- [ ] Browser automation was not available in this session because the Browser plugin's required Node REPL control tool was not exposed; local HTTP smoke and source-level checks were used instead.

## Billing History UX Polish - 2026-05-26

- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Kept Billing & Purchase History on `/dashboard/settings`.
- [x] Made Billing & Purchase History internal groups collapsible/expandable:
  - Credit pack purchases
  - Subscription checkout
  - Stripe webhook events
  - Service consultation requests
- [x] Added compact summary tiles for:
  - total records
  - latest purchase/payment status
  - latest webhook status
  - latest receipt email diagnostic status
  - latest service consultation count/status
  - Resend setup state
- [x] Credit pack purchases expand by default when a recent paid or checkout-created purchase exists.
- [x] Other history groups are collapsed by default.
- [x] Added Resend restriction helper: email attempted, but Resend may be limited to verified/test recipients until a sending domain is verified.
- [x] Added production setup helper: receipt emails require `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in production.
- [x] Kept temporary no-domain state clear without requiring `synaptireach.com` or hardcoding `receipts@synaptireach.com`.
- [x] Preserved Stripe webhook/payment fulfillment logic.
- [x] Did not expose secrets, print secret values, commit `.env.local`, or switch Stripe to live mode.
- [x] `npm.cmd run build` passed.
- [x] Production Vercel now has `RESEND_API_KEY` and `RESEND_FROM_EMAIL` configured per the latest user-provided env verification.
- [ ] Resend sending-domain verification remains deferred until a real domain is purchased and verified.
- [x] Billing & Purchase History collapsed/expanded behavior has been browser-verified per the latest user-provided status.

## Credit Pack Confirmation Diagnostics - 2026-05-26

- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Inspected credit-pack Stripe webhook processing.
- [x] Inspected app-level Resend confirmation email helper.
- [x] Confirmed the latest manual local webhook test matched purchase `a6fd17a3-7503-401d-953f-3c4007964dcc` and updated it to `paid` per the user's Supabase check.
- [x] Added safe credit-pack confirmation email diagnostics to purchase metadata:
  - attempted
  - sent
  - failed
  - skipped reason
  - masked recipient used
  - recipient source
  - safe failure reason
  - Resend message id when available
- [x] Added internal billing notifications when confirmation email is skipped or fails.
- [x] Added Stripe billing event diagnostics:
  - event reached app
  - signature verified
  - purchase matched
  - purchase updated
  - confirmation email state
- [x] Added duplicate-event repair behavior so a signed replay of an already-processed paid checkout can attempt a missed confirmation email once when purchase metadata does not already show it was sent.
- [x] Preserved webhook-only paid state. The app still does not mark credit packs paid before verified Stripe webhook confirmation.
- [x] Added Billing & Purchase History to `/dashboard/settings`.
- [x] Billing & Purchase History shows credit-pack purchases, subscription billing state, Stripe webhook events, and service consultation requests.
- [x] Replaced vague credit-pack intent text with useful status/history details.
- [x] Safe Stripe references are shortened; secrets and payment method details are not shown.
- [x] Confirmed the correct production Stripe webhook endpoint is `https://synapti-reach.vercel.app/api/billing/stripe/webhook`.
- [x] Documented that Vercel `STRIPE_WEBHOOK_SECRET` must match the Stripe Dashboard signing secret for the corrected production endpoint.
- [x] `npm.cmd run build` passed after diagnostics/history changes.
- [ ] Re-test signed local Stripe webhook after this patch to verify confirmation email attempted/sent diagnostics.
- [ ] Re-test production webhook after deploy using Stripe test mode against `https://synapti-reach.vercel.app/api/billing/stripe/webhook`.
- [ ] Rotate the previously pasted Resend API key after testing.

## Settings Manual Review Fixes - 2026-05-26

- [x] Read `docs/codex/SYNAPTIREACH_SETTINGS_BILLING_UX_GOAL.md`.
- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Made `Setup & Usage Intelligence` collapsible/expandable.
- [x] Preserved the existing CRM Intelligence panel/content and API behavior.
- [x] Made `Business Profile` collapsible/expandable.
- [x] Added collapsed Business Profile summary from business name, industry, and contact email where available.
- [x] Preserved existing Business Profile save behavior.
- [x] Improved Integration Status modal/drawer so supported integrations can add/update:
  - Resend/email provider key
  - Twilio Account SID
  - Twilio Auth Token
  - Ayrshare key
  - Gemini key
  - OpenRouter key
  - OpenRouter model
  - OpenAI key
- [x] Integration modal uses existing encrypted provider connection save path.
- [x] Existing configured keys are represented only by saved masked key labels.
- [x] Integration modal shows management mode and setup/future-ready status.
- [x] Test Connection is shown as disabled/future-ready because safe provider test endpoints are not available for every provider.
- [x] Added mobile-safe scrolling to Settings modals/drawers.
- [x] `npm.cmd run build` passed and generated 150/150 static pages.
- [x] `.env.local` is not tracked.
- [x] Customer-facing Settings source scan found no `mini-brain`, `mini brain`, `Start Stripe Checkout`, `AI Settings`, Supabase, or Vercel Cron wording.
- [ ] Manual mobile browser review of `/dashboard/settings` remains.
- [ ] Signed Stripe webhook replay still needed for end-to-end app-level credit-pack confirmation email verification.

## Settings Billing UX Manual Review Follow-up - 2026-05-26

- [x] Read `docs/codex/SYNAPTIREACH_SETTINGS_BILLING_UX_GOAL.md`.
- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Continued from current working tree without restarting completed work.
- [x] Confirmed latest committed code is `0daa1412 Improve settings billing UX and consultation flows`.
- [x] No issue-supported code changes were made because the supplied browser review entries still contained placeholders instead of concrete pass/fail notes.
- [x] `npm.cmd run build` passed and generated 150/150 static pages.
- [ ] Concrete manual browser review notes still needed for:
  - Settings accordions/modals
  - Credit pack selection + Checkout button
  - Services multi-select consultation request
  - CRM Automation & AI Behavior save flow
  - Integration config modal/drawer
  - Production smoke after deploy
- [ ] Signed Stripe webhook replay still needed for end-to-end app-level credit-pack confirmation email verification.
- [ ] Resend delivery/provider configuration still needs final confirmation.

## Settings Billing UX Checkpoint 1 - 2026-05-25

- [x] Read `docs/codex/SYNAPTIREACH_SETTINGS_BILLING_UX_GOAL.md` and continued from current working tree.
- [x] Added reusable collapsible Settings sections.
- [x] Kept Setup & Usage Intelligence and Business Profile non-collapsible.
- [x] Added compact collapsible sections for:
  - Trial, Caps & Billing Rules
  - Services, Bundles & Retainers
  - CRM Automation & AI Behavior
  - Integration Status
  - Connect Your AI Keys
  - AI Providers
  - Staff & Permissions
- [x] Reworked customer-facing integration cards and removed Supabase/Vercel Cron from customer-facing status.
- [x] Added selectable credit-pack UX with one Checkout button and confirmation modal.
- [x] Added Stripe return notice for credit pack/subscription returns without claiming webhook confirmation early.
- [x] Added billing setup confirmation modal with 14-day trial disclosure and Stripe security copy.
- [x] Added multi-select service consultation UX.
- [x] Updated service request API to accept `items` / `selected_items` arrays while preserving single-item compatibility.
- [x] Added structured selected-service metadata and totals to service requests.
- [x] Added app-level credit-pack confirmation email attempt from verified Stripe webhook processing.
- [x] Added automation policy UI backed by `crm_settings.metadata.automation_policy`.
- [x] `npm.cmd run build` passed after these changes.
- [ ] Browser click-through and live webhook/provider verification still pending.

## Settings Billing UX Checkpoint 2 - Final Verification - 2026-05-25

- [x] Local `/dashboard/settings` smoke returned HTTP 200.
- [x] Settings page with Stripe return query params loaded without server errors:
  - `?checkout=success&session_id=...`
  - `?subscription=success&session_id=...`
- [x] Unauthorized admin waitlist mutation still fails closed with HTTP 403.
- [x] Multi-service consultation request API returned HTTP 200 with structured selected items and `consultation_requested` status.
- [x] Credit-pack checkout intent API returned HTTP 200 with `checkout_created` and a Stripe Checkout URL present in test mode.
- [x] `.env.local` is not tracked.
- [x] `.next/routes-manifest.json` exists.
- [x] Stale `.next/server/vendor-chunks/@supabase.js` is absent.
- [x] Customer-facing Settings source scan found no:
  - `mini-brain`
  - `mini brain`
  - `Start Stripe`
  - `AI Settings`
  - Supabase customer integration card
  - Vercel Cron customer integration card
- [x] Remaining lowercase billing enum strings in Settings are internal mapping logic only.
- [ ] Manual browser verification remains for accordion/modals, Stripe redirect UX, and exact visual layout.
- [ ] Signed Stripe webhook replay remains required to verify app-level credit-pack confirmation email end-to-end.

## Request 1 - Public Footer/Page Tests

- [x] Home page renders the shared public footer.
- [x] Pricing page renders the shared public footer.
- [x] Services page renders the shared public footer.
- [x] Trial page renders the shared public footer.
- [x] Contact page renders the shared public footer.
- [x] Demo dashboard pages are not given the public footer by this pass.
- [x] Footer CRM link routes to `/demo/dashboard`.
- [x] Footer Pricing link routes to `/pricing`.
- [x] Footer Contact link routes to `/contact`.
- [x] Footer Trial CTA uses `Start 14-Day Trial`.
- [x] Footer links use real routes instead of placeholder anchors.
- [x] Missing footer routes were created under the marketing route group.
- [x] `npm.cmd run build` passes after Request 1.
- [x] Legacy trial wording search passes; only the allowed implementation-support phrase remains on the services page.
- [ ] Browser-check footer links on desktop.
- [ ] Browser-check footer links on mobile.

## Remaining Requests

- [x] Request 2 - Supabase schema verification for every CRM page.
  - [x] Added `supabase/user_crm_full_completion_schema.sql`.
  - [x] Covered workspace/company/user scoping columns.
  - [x] Covered staff/team members, roles, and permissions.
  - [x] Covered notifications.
  - [x] Covered conversation/message chains.
  - [x] Covered audit logs.
  - [x] Covered server-side provider connection references.
  - [x] Covered billing accounts, usage events, credit pack purchases, and CSV import history.
  - [x] Added dashboard/module query indexes.
  - [x] Fixed fresh-database safety in `supabase/user_crm_full_completion_schema.sql` by creating core CRM tables before altering/indexing them.
- [x] Request 3 - User/workspace security and data isolation.
  - [x] Added `lib/auth/getWorkspaceContext.ts` for server-side workspace/user context resolution.
  - [x] Added `lib/security/permissions.ts` with CRM permission constants and checks.
  - [x] Added `lib/security/requireWorkspaceAccess.ts` for strict route guard adoption.
  - [x] Added schema support for workspace/company/user scoping, staff roles, permissions, and audit logs in `supabase/user_crm_full_completion_schema.sql`.
  - [ ] Remaining integration: adopt `requireWorkspaceAccess` in every CRM/marketing route once auth/workspace membership is finalized for production.
- [x] Request 4 - Global CRM notifications.
  - [x] Added `/api/crm/notifications`.
  - [x] Added topbar notifications button to every User CRM page through `app/dashboard/layout.tsx`.
  - [x] Added unread count, dropdown panel, mark-as-read action, and mobile-safe width.
  - [x] Notifications use stored `crm_notifications` plus real-derived reminders from tasks, appointments, AI recommendations, and campaign status.
- [x] Request 5 - Dashboard professional living upgrade.
  - [x] Preserved existing dashboard metrics and sections.
  - [x] Made metric cards clickable.
  - [x] Added metric detail modal with real backing records, empty state, related page action, and copy JSON action.
  - [x] Added professional deal-flow pipeline overview with stage counts, value, stale deal context, and pipeline CTA.
  - [x] Kept CSV import quick action and dashboard refresh behavior.
- [x] Request 6 - Analytics metric detail modals.
  - [x] Made analytics metric cards clickable.
  - [x] Added mobile-safe modal with complete metric overview, real records, context, recommended action, related page CTA, and copy JSON export.
  - [x] Added analytics coverage for leads, conversion, campaign performance, communications, pipeline, workflow health, task health, appointments, AI agent activity, and activity events.
  - [x] Preserved empty/loading/error states and avoided fake analytics.
- [x] Request 7 - Leads profile/details section.
  - [x] Selecting a lead populates the profile/detail panel.
  - [x] Detail panel shows contact info, company/source/status/tags/score, notes, activity timeline, communications, campaign interactions, tasks/follow-ups, linked deals, and AI next-step guidance.
  - [x] Actions include edit lead, update status, add note, create follow-up task, convert to deal, draft review-gated message, archive, and run AI next-step review.
  - [x] Uses existing real CRM APIs and Supabase-backed records.
- [x] Request 8 - Pipeline page graphics.
  - [x] Added professional pipeline-flow visualization using real deal records.
  - [x] Visualizes deals by stage, total stage value, probability-weighted value, stale deals, and win/loss counts.
  - [x] Preserved existing Kanban/stage controls and deal CRUD actions.
  - [x] Added mobile-safe empty state when filters produce no deals.
- [x] Request 9 - Marketing recent and expandable sections.
  - [x] Campaign Library shows recent 5 by default with View All / Show Recent toggle.
  - [x] Expanded Campaign Library supports search, status filter, type filter, date filter, details, edit/cancel where supported, and duplicate.
  - [x] Scheduled Campaigns show recent 5 by default with View All / Show Recent toggle.
  - [x] Expanded scheduled campaigns support search, edit date/time, cancel, duplicate, and details.
  - [x] AI Recommendations accept and deny actions work through `/api/marketing/recommendations`, log activity, refresh data, and hide accepted/dismissed items.
  - [x] Provider/fallback metadata is displayed when returned.
- [x] Request 10 - Workflow Automation page.
  - [x] Run Agent Review calls the real `/api/crm/agents/run` endpoint, shows loading/success/error state, and uses logged agent recommendations.
  - [x] Saved workflows show trigger, condition/action summary, status, last run, success/failure counts, details, activate/pause toggle, and safe manual test logging.
  - [x] Added review-gated workflow templates for lead follow-up, missed follow-up, campaign follow-up, high-intent alerts, appointments, stale deals, re-engagement, reviews, lead scoring, pipeline notifications, trial/cap warnings, and new communication response.
  - [x] Workflow details open in a mobile-safe modal and clearly state that external sends require manual review.
- [x] Request 11 - Communications conversation chains.
  - [x] Added real conversation chains grouped from CRM communication records by lead or recipient.
  - [x] Conversation cards show contact/lead identity, channel, status, latest preview, unread count, timestamp, and message count.
  - [x] Conversation drawer shows full message history with email/SMS/social/internal records where available.
  - [x] Added review-gated email/SMS response drafting with AI provider metadata, Save Draft, and Queue for Review actions.
  - [x] Saved replies write to the real communications API/table and do not send external messages automatically.
- [x] Request 12 - Tasks AI recommendations and assignment.
  - [x] Added AI task recommendation panel from real CRM context: stale leads, overdue tasks, stale deals, upcoming/no-show appointments, campaign interactions, and inbound communications.
  - [x] Recommendation actions include approve, deny, and assign; approved items create real reviewable tasks through `/api/crm/tasks`.
  - [x] Added task assignment fields, assignee display, and assignee filtering with Owner / Me fallback when no staff records exist.
  - [x] Added lightweight staff listing API for task assignment options.
- [x] Request 13 - Calendar appointment workflows and notifications.
  - [x] Added appointment-intent suggestions from real inbound communications with reviewable appointment draft flow.
  - [x] Added internal upcoming appointment reminder creation through `/api/crm/notifications`.
  - [x] Appointment create/update/cancel/no-show/complete actions log notifications and remain internal-only.
  - [x] Expanded notification derivation to include new leads, pipeline changes, lead responses, appointments, overdue tasks, AI recommendations, campaigns, and usage cap warnings.
  - [x] Calendar clearly states external calendar sync is not enabled.
- [x] Request 14 - Settings page overhaul.
  - [x] Business Profile and AI Settings now have dedicated save buttons with loading/success/error states.
  - [x] Added server-side AI provider key connection UI/API for Gemini, OpenRouter, and optional OpenAI; keys are never returned to the browser.
  - [x] Added integration key connection UI/API for Resend, Twilio, and Ayrshare with masked configured status.
  - [x] Added selected trial/plan status, actual usage/cap display, commitment discount messaging, BYOK cost language, and credit pack checkout-intent flow.
  - [x] Added payment method setup-required state instead of fake payment success.
- [x] Request 15 - Staff/team management.
  - [x] Added staff management API with create/update/list support and server-side permission records.
  - [x] Added settings-page staff section for adding/editing staff, status, contact info, titles, and granular CRM permissions.
  - [x] Staff changes write audit-log records when the schema is available.
  - [x] Task assignment can use staff records, with Owner / Me fallback when no staff exists.
  - [x] Shared permission constants/helpers remain available for route-by-route enforcement.
- [x] Request 16 - Additional CRM upgrades.
  - [x] Added global Ctrl+K command palette in the real CRM layout.
  - [x] Command palette searches real dashboard context across leads, deals, tasks, campaigns, and communications.
  - [x] Added quick actions for create lead, import CSV, create campaign, create workflow, ask AI, add task, and view pipeline.
  - [x] Preserved notification topbar, collapsed sidebar behavior, and real-data-only CRM records.
- [x] Request 17 - Page-by-page verification.
  - [x] Verified `npm.cmd run build` passes after Requests 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, and 16.
  - [x] Verified dashboard layout still has collapsed-by-default sidebar, notifications, and real-data command palette.
  - [x] Verified analytics metric cards open detail modals with real backing records.
  - [x] Verified leads detail panel actions are wired to existing real CRM APIs.
  - [x] Verified pipeline graphic preserves Kanban/deal controls.
  - [x] Verified marketing recent/expanded campaign sections preserve scheduling, edit/cancel, duplicate, and AI recommendations.
  - [x] Verified workflow run/review/test actions are review-gated and log internal runs only.
  - [x] Verified communications conversation replies save records without external sending.
  - [x] Verified tasks recommendations approve into real tasks and support staff/owner assignment.
  - [x] Verified calendar appointment suggestions/reminders create internal notifications only.
  - [x] Verified settings saves profile, AI settings, provider keys, integrations, credit-pack intents, and staff records without returning secrets.
  - [x] Ran trial-language search; remaining legacy wording is limited to allowed implementation-support copy, with non-trial date filters also present.

## Request 18 - Documentation/checklists

- [x] Public footer/page tests documented above.
- [x] CRM schema tests documented above.
- [x] User data isolation architecture documented above.
- [x] Dashboard metric modal tests documented above.
- [x] Analytics metric modal tests documented above.
- [x] Leads detail panel tests documented above.
- [x] Pipeline graphic tests documented above.
- [x] Marketing expand/filter tests documented above.
- [x] Workflow automation tests documented above.
- [x] Communications conversation tests documented above.
- [x] Task AI recommendation tests documented above.
- [x] Calendar appointment/notification tests documented above.
- [x] Settings save/API key/billing tests documented above.
- [x] Staff permissions tests documented above.
- [ ] Mobile browser tests: `/dashboard`, `/dashboard/analytics`, `/dashboard/leads`, `/dashboard/pipeline`, `/dashboard/tasks`, `/dashboard/calendar`, `/dashboard/marketing`, `/dashboard/communications`, `/dashboard/workflow`, `/dashboard/ai_assistant`, `/dashboard/settings`.
- [ ] Desktop browser tests: same CRM pages plus `/demo`, `/demo/dashboard`, `/demo/leads`, `/demo/marketing`, `/demo/ai_assistant`, `/demo/workflow`, `/demo/communications`, `/demo/settings`.
- [ ] API smoke tests against local dev server and real Supabase credentials.
- [x] Supabase migration instruction: run `supabase/user_crm_full_completion_schema.sql` in Supabase SQL Editor. It is now safe on a fresh database because it creates core tables before altering/indexing.
- [x] Required Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY` recommended, `OPENROUTER_API_KEY` optional fallback, `OPENROUTER_MODEL=openrouter/free`, `AI_ENABLE_OPENAI=false` by default, `OPENAI_API_KEY` optional premium, `CRM_SECRET_ENCRYPTION_KEY` recommended for BYOK secret encryption, plus `RESEND_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `AYRSHARE_API_KEY`, `CRON_SECRET` where used.
- [x] Remaining limitations documented: strict `requireWorkspaceAccess` adoption is still pending route-by-route once final auth/workspace membership is finalized; Stripe/payment collection is setup-required; external calendar sync is not enabled; external sends remain review-gated.

## Final Stabilization Continuation Pass

- [x] Verified `supabase/user_crm_full_completion_schema.sql` can be used as the SQL Editor bootstrap/full-completion schema.
- [x] Verified every `CREATE INDEX ... ON public.*` target has a matching `CREATE TABLE IF NOT EXISTS public.*` in the same SQL file.
- [x] Verified the SQL file contains no `DROP TABLE`, `TRUNCATE TABLE`, or `DELETE FROM` data-reset statements.
- [x] Updated missing-schema runtime errors to explicitly tell the user to run `supabase/user_crm_full_completion_schema.sql` in the Supabase SQL Editor.
- [x] Added optional workspace scoping to shared CRM context loading for dashboard, AI assistant, recommendations, and agent routes.
- [x] Added safe workspace-aware scoping to core CRM routes where compatible with the current local auth model: leads, deals, tasks, appointments, communications, workflows, workflow test runs, staff, settings, notifications, marketing campaigns, marketing activity, and marketing recommendations.
- [x] Preserved local development behavior: routes still work without a final authenticated workspace session, but scope by `workspace_id`/workspace context when provided or available.
- [x] Provider/BYOK connection lookup now scopes by workspace when available so one workspace cannot overwrite another workspace's provider connection.
- [x] Confirmed missing schema remains a clean `success: false` response with `missingSchema: true` where Supabase reports missing tables/columns.
- [x] Confirmed review-gated sends, external calendar limitation, Stripe setup-required state, Gemini/OpenRouter fallback, and OpenAI-disabled-by-default behavior were preserved.
- [x] Final build verification passed with `npm.cmd run build`.
- [x] Final trial-language search passed. Remaining matches are the allowed marketing date filter and the Full Business System implementation-support service item.

## Payment/Billing Stabilization Pass

- [x] Installed Stripe docs skills requested by the user: `stripe-best-practices`, `stripe-projects`, and `upgrade-stripe`.
- [x] Added Stripe env placeholders to `.env.example`: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- [x] Added server-side Stripe Checkout helper for one-time credit-pack purchases; no Stripe secret is exposed to client code.
- [x] Credit pack buttons now create a real Stripe Checkout Session when `STRIPE_SECRET_KEY` is configured, otherwise they preserve the setup-required/reviewable checkout-intent fallback.
- [x] Credit-pack attempts continue to be stored in `crm_credit_pack_purchases` with status and Stripe session metadata when available.
- [x] Added `/api/stripe/webhook` with Stripe signature verification. It marks matching credit-pack checkout records as `paid` only after `checkout.session.completed`, or `expired` after `checkout.session.expired`.
- [x] Added canonical snapshot webhook endpoint `/api/billing/stripe/webhook`; `/api/stripe/webhook` remains a compatibility shim.
- [x] Added `crm_billing_events` to the full Supabase schema with a unique Stripe event id index for idempotent webhook processing.
- [x] Stripe webhook now logs selected snapshot events, ignores unsupported events safely with HTTP 200, and only marks purchases paid after verified webhook confirmation.
- [x] Credit-pack checkout now creates the Supabase purchase before redirecting to Stripe and passes `purchase_id`, `workspace_id`, `company_id`, `user_id`, `pack_type`, and `quantity` in Stripe metadata.
- [x] Settings page shows Stripe configured/missing state, test/live mode, and webhook configured/missing state without exposing keys.
- [x] Added Billing Portal endpoint `/api/billing/portal`; Settings can open it when Stripe is configured, otherwise it remains setup-required.
- [x] Provider/BYOK keys and integration keys remain encrypted server-side and masked after save.
- [x] Provider key updates and credit-pack checkout attempts write audit-log records when the full schema has been applied.
- [x] Stripe implementation follows hosted Checkout Sessions and omits `payment_method_types` so dynamic payment methods can be managed from Stripe Dashboard.
- [x] Stripe webhook fulfillment remains server-side only and stores Stripe session/payment metadata without exposing keys.
- [x] Stripe Sandbox/Test mode deployment reminder: configure a Snapshot payload webhook for `/api/billing/stripe/webhook` only. Do not mix thin-payload webhook secrets with snapshot webhook secrets.
- [x] Selected Stripe snapshot events: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`, `payment_intent.requires_action`, `customer.created`, `customer.updated`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.trial_will_end`, `invoice.paid`, `invoice.payment_succeeded`, `invoice.payment_failed`, `invoice.payment_action_required`, `invoice.upcoming`, `charge.refunded`, `charge.dispute.created`.
- [x] Vercel deployment reminder: add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`, then redeploy. The production webhook URL should be `https://synapti-reach.vercel.app/api/billing/stripe/webhook` for the current production alias, and the stored `STRIPE_WEBHOOK_SECRET` must match that exact Stripe Dashboard endpoint.
- [x] Security reminder: never commit `.env.local`, rotate any leaked Stripe secret key, keep Sandbox/Test mode until checkout and webhook tests pass, and run `supabase/user_crm_full_completion_schema.sql` before billing tests.

### Stripe Local Test Flow

```powershell
# In one terminal
stripe listen --forward-to localhost:3000/api/billing/stripe/webhook

# Put the displayed whsec_... value in STRIPE_WEBHOOK_SECRET, then restart npm.cmd run dev.
# In the browser, go to /dashboard/settings and start a credit-pack checkout.
# Use Stripe test card 4242 4242 4242 4242 with any future expiry and any CVC.

# After returning from Stripe, verify records:
$base = "http://localhost:3000"
Invoke-RestMethod "$base/api/crm/settings"

# Confirm in Supabase:
# - crm_credit_pack_purchases has status checkout_created before webhook, then paid after checkout.session.completed.
# - crm_billing_events contains the Stripe event id.
# - Replaying the same event is idempotent because stripe_event_id is unique.
```

### API Smoke Tests To Run Locally

```powershell
$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/crm/dashboard"
Invoke-RestMethod "$base/api/crm/notifications"
Invoke-RestMethod "$base/api/crm/staff"
Invoke-RestMethod "$base/api/crm/tasks"
Invoke-RestMethod "$base/api/crm/appointments"
Invoke-RestMethod "$base/api/crm/communications"
Invoke-RestMethod "$base/api/crm/workflows"

Invoke-RestMethod -Method Post "$base/api/crm/agents/run" `
  -ContentType "application/json" `
  -Body '{"agent":"workflow"}'

Invoke-RestMethod -Method Post "$base/api/crm/workflows/run" `
  -ContentType "application/json" `
  -Body '{"workflow_id":"REPLACE_WITH_WORKFLOW_ID"}'
```

### Browser Pages To Test

- `/`
- `/pricing`
- `/services`
- `/trial`
- `/contact`
- `/about`
- `/ai-agents`
- `/automation`
- `/solutions/agencies`
- `/privacy`
- `/support`
- `/dashboard`
- `/dashboard/analytics`
- `/dashboard/leads`
- `/dashboard/pipeline`
- `/dashboard/tasks`
- `/dashboard/calendar`
- `/dashboard/marketing`
- `/dashboard/communications`
- `/dashboard/workflow`
- `/dashboard/ai_assistant`
- `/dashboard/settings`
- `/demo`
- `/demo/dashboard`

## Reusable Final Upgrade Pass - 2026-05-19

- [x] Started pass from clean git state at `81f9a692 Finalize CRM portal Stripe billing and production readiness`.
- [x] Verified clean rebuild flow for local smoke tests: stop local server, delete `.next`, run `npm.cmd run build`, then restart `npm.cmd run start -- -p 3000`.
- [x] Confirmed `npm.cmd run build` passes after a clean `.next` rebuild.
- [x] Confirmed the earlier `/_not-found` page-data build issue is not present; build output includes `○ /_not-found`.
- [x] Confirmed `.next/routes-manifest.json` is regenerated after clean build.
- [x] Confirmed the stale missing `.next/server/vendor-chunks/@supabase.js` path does not reappear as a generated file in the current Next build; local production route and API probes no longer fail from that stale path after a clean rebuild.
- [x] Local production smoke test returned 200 for the required public, demo, and dashboard route list after warm-up. Cold-start requests on this Windows local environment can take several seconds; repeat probes returned 200.
- [x] Production smoke test against `https://synapti-reach.vercel.app` returned 200 for the full required route list.
- [x] Optimized demo navigation behavior: removed the unnecessary `/demo` “Overview” tab and changed the demo tab bar from sticky to normal page flow so it does not block mobile scrolling.
- [x] Verified `/ai-agents`, `/demo`, and `/demo/settings` return 200 locally and in production.
- [x] Verified core CRM API routes return clean 200 responses locally: `/api/crm/dashboard`, `/api/crm/notifications`, `/api/crm/staff`, `/api/crm/tasks`, `/api/crm/appointments`, `/api/crm/communications`, `/api/crm/workflows`, `/api/marketing/recommendations`, and `/api/marketing/campaigns`.
- [x] Added missing additive Supabase schema support for marketing tables used by API/lib code: `marketing_ai_recommendations`, `marketing_campaign_steps`, `marketing_campaign_logs`, `marketing_automation_queue`, `marketing_retry_queue`, `marketing_suppression_list`, `marketing_audit_logs`, and `marketing_media`.
- [x] Added missing additive Supabase schema support for launch-readiness service and waitlist features: `crm_service_catalog`, `crm_service_requests`, `crm_service_orders`, and `waitlist_signups`.
- [x] Added required additive marketing columns used by existing routes: `marketing_campaigns.body`, `platforms`, `scheduled_for`, `stagger_size`, `ai_recommendations`, plus `marketing_events.event_type` and `title`.
- [x] Corrected legacy campaign execution lookup from nonexistent `crm_leads` to canonical `leads`, scoped by campaign workspace when available.
- [x] Confirmed this pass introduced no `DROP TABLE`, `TRUNCATE TABLE`, or `DELETE FROM` statements to `supabase/user_crm_full_completion_schema.sql`.
- [x] Build verification after this pass: `npm.cmd run build` passed.
- [ ] Still pending for later passes: full implementation of Stripe subscription trial checkout/autorenewal UX, CRM services request UI, working public contact form notification flow, waitlist widget/admin management, expanded industry pages, expanded informational pages, CRM metric modal expansion, AI Command Center, workflow signal expansion, mini-brain modules, and review-gated Resend/Twilio replies.

## Dedicated Test Workspace Simulation Foundation - 2026-05-19

- [x] Added additive schema support for isolated test simulation state: `crm_test_simulation_state`, `crm_test_simulation_events`, `crm_test_simulation_snapshots`, and `crm_test_simulation_settings`.
- [x] Added additive compatibility schema support for `workspace_members` and `onboarding_sessions`, matching the legacy Supabase workspace model.
- [x] Added additive workspace flags: `is_test_workspace`, `simulation_enabled`, and `simulation_profile`.
- [x] Added server-only simulation library at `lib/simulation/testWorkspaceSeed.ts`.
- [x] Confirmed active CRM auth architecture: public signup/signin and `/dashboard` use Supabase Auth, workspace ownership uses `workspaces.owner_id`, and NextAuth exists only as a separate/static legacy route.
- [x] Added protected bootstrap API: `POST /api/test/simulation/bootstrap`.
- [x] Added protected simulation APIs: `GET /api/test/simulation/status`, `POST /api/test/simulation/seed`, `POST /api/test/simulation/tick`, `POST /api/test/simulation/reset`, and `POST /api/test/simulation/pause`.
- [x] Bootstrap target email is `donovan.mike966@gmail.com`.
- [x] Bootstrap can create/find the Supabase Auth user server-side with the service-role key, then create/find the test workspace, `workspace_members`, `onboarding_sessions`, baseline `crm_settings`, and simulation state.
- [x] Bootstrap is idempotent and returns the exact `CRM_TEST_WORKSPACE_IDS` value to place in `.env.local`.
- [x] Simulation controls require either an authenticated workspace/account listed in `CRM_TEST_WORKSPACE_IDS` / `CRM_TEST_ACCOUNT_EMAILS` or `CRM_TEST_SIMULATION_SEED_SECRET`; normal public requests receive setup-required or forbidden responses.
- [x] Seed now refuses to run until the workspace has already been explicitly marked as test/simulation by bootstrap.
- [x] Seed data is deterministic and uses stable IDs so re-running seed upserts instead of duplicating indefinitely.
- [x] Every seeded CRM row includes `metadata.is_test_data=true`, `simulation_source="synaptireach_test_workspace"`, `simulation_version`, and `generated_at`.
- [x] Seed foundation covers workspace profile, settings, staff, leads, deals, tasks, appointments, campaigns, campaign events/interactions, conversations/messages, workflows/runs, AI recommendations, marketing recommendations, agent runs, notifications, billing usage, credit/billing state, provider setup states, service requests, contact submissions, waitlist signups, and audit logs.
- [x] Simulation tick advances a deterministic subset of lead/deal/task/campaign state and creates test-only notifications/recommendations/events.
- [x] Reset is implemented only through the protected simulation API and deletes records scoped to the configured test workspace ID; do not run it against any real workspace ID.
- [x] Dashboard shell shows a “Simulated Test Workspace” badge only when the server validates the current workspace as simulation-enabled.
- [x] Settings shows test-only seed/tick/pause/reset controls only for validated test simulation workspaces.
- [x] Local protected-route smoke test passed: `/api/test/simulation/status`, `/api/test/simulation/bootstrap`, and `/api/test/simulation/seed` fail closed with HTTP 403 when called without a valid authenticated test workspace or bootstrap/seed secret.
- [x] Build verification after simulation foundation: `npm.cmd run build` passed.
- [x] Local page smoke after this pass: `/ai-agents`, `/demo`, and `/demo/settings` returned 200 from `npm.cmd run start -- -p 3000` after build warm-up and redirects.
- [x] Clean build artifact check after this pass: `.next/routes-manifest.json` exists and stale `.next/server/vendor-chunks/@supabase.js` is not generated.
- [ ] To enable a real test workspace, set `CRM_ENABLE_TEST_SIMULATION=true`, `CRM_TEST_ACCOUNT_EMAILS=donovan.mike966@gmail.com`, optionally `CRM_TEST_BOOTSTRAP_SECRET=<secret>`, optionally `CRM_TEST_SIMULATION_SEED_SECRET=<secret>`, and run `supabase/user_crm_full_completion_schema.sql` before bootstrap/seed.
- [x] Bootstrap refuses to run if `CRM_TEST_ACCOUNT_EMAILS` is missing, and only allows the requested email when it is explicitly listed there.
- [x] Bootstrap can optionally set or update a local test password through a protected request body field (`test_password`); it returns only `password_set=true/false` and never returns the password.
- [ ] Test workspace seed/tick was not executed against production Supabase in this pass because no explicit test workspace ID was provided in the prompt.
- [ ] Remaining Task 3 work for a later pass: run bootstrap/seed against the configured Supabase project, sign in as the test user, verify every CRM page is populated with simulated data, add snapshot/restore if needed, and tune tick behavior after observing real dashboard data.

### Test Workspace Simulation Commands

```powershell
$base = "http://localhost:3000"

# Required local env before bootstrap:
# CRM_ENABLE_TEST_SIMULATION=true
# CRM_TEST_ACCOUNT_EMAILS=donovan.mike966@gmail.com
# CRM_TEST_BOOTSTRAP_SECRET=<local-dev-secret>
# CRM_TEST_SIMULATION_SEED_SECRET=<local-dev-secret-or-another-secret>

# Bootstrap. This creates/finds the Supabase Auth test user and workspace.
Invoke-RestMethod -Method Post "$base/api/test/simulation/bootstrap" `
  -ContentType "application/json" `
  -Body '{"email":"donovan.mike966@gmail.com","bootstrap_secret":"YOUR_BOOTSTRAP_SECRET"}'

# Optional local/dev bootstrap with a known test password for browser sign-in.
# The password is accepted only by the protected bootstrap route and is never returned.
Invoke-RestMethod -Method Post "$base/api/test/simulation/bootstrap" `
  -ContentType "application/json" `
  -Body '{"email":"donovan.mike966@gmail.com","bootstrap_secret":"YOUR_BOOTSTRAP_SECRET","test_password":"LOCAL_ONLY_TEST_PASSWORD"}'

# Put the returned value into .env.local:
# CRM_TEST_WORKSPACE_IDS=<returned workspace_id>

# Status. Should return setup-required until env vars are configured.
Invoke-RestMethod "$base/api/test/simulation/status"

# Seed with an authenticated configured test workspace, or with the seed secret.
Invoke-RestMethod -Method Post "$base/api/test/simulation/seed" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET"}'

# Advance deterministic simulation activity.
Invoke-RestMethod -Method Post "$base/api/test/simulation/tick" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET"}'

# Pause/resume.
Invoke-RestMethod -Method Post "$base/api/test/simulation/pause" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET","paused":true}'

Invoke-RestMethod -Method Post "$base/api/test/simulation/pause" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET","paused":false}'

# Protected reset. This deletes only records scoped to the configured test workspace.
Invoke-RestMethod -Method Post "$base/api/test/simulation/reset" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET"}'
```

To disable simulation in production, set `CRM_ENABLE_TEST_SIMULATION=false`, remove `CRM_TEST_BOOTSTRAP_SECRET`, remove `CRM_TEST_SIMULATION_SEED_SECRET`, and remove or empty `CRM_TEST_WORKSPACE_IDS`. Normal users do not receive seed data because all simulation APIs require explicit test env configuration and a workspace marked `is_test_workspace=true`.

## Local-First AI Provider Layer Correction - 2026-05-19

- [x] Preserved the local-first AI provider layer added in the previous pass.
- [x] Corrected Ollama development configuration for Next.js by preferring server-side env vars: `AI_DEFAULT_PROVIDER`, `AI_ENABLE_LOCAL`, `AI_ENABLE_OLLAMA_DEV`, `OLLAMA_BASE_URL`, and `OLLAMA_MODEL`.
- [x] Kept existing `VITE_*` local AI env vars as backward-compatible aliases.
- [x] Confirmed `ollama-dev` routing remains development-only and local-allowed-task-only.
- [x] Added future-ready `customer-local` provider interface with disabled-by-default workspace config fields for status, endpoint URL, model, and workspace ID.
- [x] Added `POST /api/ai/customer-local/test` as the future test connection action.
- [x] Updated `aiClient.runTask` routing order documentation: deterministic mini-brain, Ollama dev, customer-local, SynaptiReach backend/cloud, safe mock fallback.
- [x] Added Supabase env guards for `/api/cron/marketing/retries` and `getRetryCampaigns()` so missing Supabase env returns setup-required at runtime instead of crashing page-data collection at build import time.
- [x] Build verification for this correction pass: `npm.cmd run build` passed with local `.env.local` missing Supabase credentials.

## Expanded Deterministic Mini-Brain Intelligence - 2026-05-19

- [x] Added normalized deterministic intelligence types and result shape under `lib/intelligence/types.ts`.
- [x] Added the core deterministic mini-brain orchestrator at `lib/intelligence/miniBrain.ts`.
- [x] Added zero-cost intelligence modules for lead scoring, deal scoring, pipeline, campaigns, communications, tasks, appointments, workflow signals, billing usage, onboarding/setup, business health, safety checks, recommendations, executive summaries, forecasting, anomaly detection, next-best action, CRM hygiene, staff extension points, intent detection, and simulation signal metadata.
- [x] Mini-brain outputs are structured, explainable, review-gated, and tagged with `source="mini_brain"`.
- [x] Existing CRM deterministic agent now uses the mini-brain output first while preserving legacy summary/detail arrays used by current dashboard pages.
- [x] AI router deterministic provider can now return precomputed mini-brain text or run a supplied mini-brain context before trying Ollama/customer-local/backend providers.
- [x] AI Assistant page now surfaces when mini-brain deterministic insights are available and maps new action types to the correct CRM pages.
- [x] Mini-brain does not perform irreversible external sends, payment changes, or destructive data actions.
- [x] Build verification after mini-brain expansion: `npm.cmd run build` passed.
- [ ] Live test workspace bootstrap/seed/tick/browser verification still requires configured local secrets/env and a real run against Supabase.

## V8 Mini-Brain Integration Upgrade - 2026-05-19

- [x] Preserved the corrected local-first AI architecture and did not redo the provider layer from scratch.
- [x] Verified `npm.cmd run build` passes after this V8 integration pass.
- [x] Confirmed `.next/routes-manifest.json` exists after build and the stale `.next/server/vendor-chunks/@supabase.js` file is not generated.
- [x] Added a mini-brain rule registry at `lib/intelligence/ruleRegistry.ts` so deterministic CRM rules run in a stable, extensible order.
- [x] Added reusable mini-brain support modules: scoring config, confidence helpers, explanation helpers, action/page mapping, CRM context builder, and optional persistence helper.
- [x] Added deeper deterministic lead intelligence covering hot unconverted leads, stale leads, missing contact details, duplicate lead groups, suggested channels, confidence, and review-gated next actions.
- [x] Added simulation-aware mini-brain output that only appears when the workspace context is explicitly marked as a test workspace.
- [x] Updated the mini-brain orchestrator to use registered rules, deduplicate insights, and include rule IDs in `data_used`.
- [x] Added `GET /api/intelligence/summary` for transient built-in intelligence summaries.
- [x] Added `POST /api/intelligence/run` for transient runs plus optional, explicit persistence into existing `marketing_ai_recommendations`.
- [x] Kept persistence opt-in only; mini-brain does not auto-create durable recommendations unless the API caller sends `persist=true`.
- [x] Updated AI provider metadata to support `providerUsed="mini_brain"` while preserving `mock` for safe dev/demo fallback.
- [x] Dashboard now shows a compact Built-in Intelligence / Mini-Brain executive signal panel with priority, confidence, reasoning, and review-gated links.
- [x] AI Assistant now shows detailed mini-brain insight cards with source, confidence, reasoning, recommended action, and review-gated routing.
- [x] Local shell did not contain `CRM_ENABLE_TEST_SIMULATION`, `CRM_TEST_ACCOUNT_EMAILS`, or `CRM_TEST_WORKSPACE_IDS`, so live bootstrap/seed/tick/browser verification was not run in this pass.
- [ ] Remaining Task 20 work: deeper per-page metric modal integration, approve/deny feedback loops, richer persistence idempotency, notification/task/workflow draft conversion actions, and tuning against the live simulated test workspace.

### V8 Mini-Brain API Smoke Tests

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

# Requires Supabase env for real CRM data. If missing, returns setup-required.
Invoke-RestMethod "$base/api/intelligence/summary"

# Transient deterministic run.
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'

# Optional review-queue persistence into marketing_ai_recommendations.
# Keep this off unless you intentionally want durable pending recommendations.
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":true,"limit":5}'
```

## V9 CRM-Wide Mini-Brain Integration Upgrade - 2026-05-19

- [x] Preserved the local-first AI architecture: deterministic mini-brain first, Ollama dev-only, customer-local future/setup-required, backend/cloud fallback, safe mock fallback.
- [x] Verified `npm.cmd run build` passes after the V9 page integration pass.
- [x] Confirmed `.next/routes-manifest.json` exists after build.
- [x] Confirmed stale `.next/server/vendor-chunks/@supabase.js` is not generated after build.
- [x] Added reusable CRM-wide built-in intelligence UI at `components/intelligence/MiniBrainInsightPanel.tsx`.
- [x] Integrated compact Mini-Brain / Built-in Intelligence panels into:
  - `/dashboard/analytics`
  - `/dashboard/leads`
  - `/dashboard/pipeline`
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/marketing`
  - `/dashboard/communications`
  - `/dashboard/workflow`
  - `/dashboard/settings`
- [x] Preserved existing Dashboard and AI Assistant mini-brain integrations from the previous pass.
- [x] Expanded `lib/crm/data.ts` context loading to include notifications, staff, billing account state, and usage events where Supabase tables are available.
- [x] Expanded `MiniBrainContext` to carry staff, billing, and usage inputs safely.
- [x] Added rule metadata to the mini-brain registry: stable rule IDs, categories, severity, required inputs, action types, destination pages, and enabled-by-default state.
- [x] Mini-brain insights now carry review metadata such as `rule_id`, `rule_category`, `destinationPage`, and `review_required`.
- [x] Deepened staff/team intelligence with unassigned-work and overdue-workload signals.
- [x] Deepened billing/usage intelligence with usage-event totals, cap-risk warnings, and usage-without-billing setup warnings.
- [x] Page integrations fetch transient summaries only and do not persist duplicate recommendations on page load.
- [x] Mini-brain UI labels deterministic output as Built-in Intelligence / Mini-Brain and does not imply an external paid AI call was used.
- [x] Mini-brain remains review-gated and never auto-sends external messages, auto-posts social content, or changes billing/payment state.
- [x] No Supabase schema changes were required in this pass.
- [ ] Live test workspace bootstrap/seed/tick/browser verification still requires configured local Supabase and `CRM_TEST_*` env secrets.
- [ ] Remaining Task 20 work: per-record metric modal insight wiring, approve/deny/dismiss feedback loops across every page, richer durable idempotency keys, task/workflow/message draft conversion actions, and tuning against the live seeded test workspace.

### V9 Mini-Brain Page Smoke Targets

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/intelligence/summary"
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'

# Browser-check these pages for compact Built-in Intelligence panels:
# /dashboard
# /dashboard/analytics
# /dashboard/leads
# /dashboard/pipeline
# /dashboard/tasks
# /dashboard/calendar
# /dashboard/marketing
# /dashboard/communications
# /dashboard/workflow
# /dashboard/ai_assistant
# /dashboard/settings
```

## V9 Mini-Brain Review-Gated Actions Upgrade - 2026-05-19

- [x] Added `POST /api/intelligence/actions` for safe Mini-Brain approve/deny/dismiss behavior.
- [x] Approve actions are mapped only to internal review-gated outcomes:
  - `crm_tasks` task drafts for task, assignment, and appointment-prep actions.
  - `crm_messages` draft messages for message suggestions.
  - `crm_workflows` draft workflows for workflow suggestions.
  - `crm_notifications` review notifications for risk/setup/billing/campaign review actions.
- [x] Dismiss/deny decisions are recorded in `crm_audit_logs` without creating external actions.
- [x] Approved Mini-Brain actions also write an audit log entry with source, insight ID, action type, confidence, and created record metadata.
- [x] Updated `MiniBrainInsightPanel` with compact approve/dismiss buttons, inline loading states, and success/error states.
- [x] Updated Mini-Brain persistence to check deterministic `metadata.idempotency_key` before inserting `marketing_ai_recommendations`, reducing duplicate persisted recommendations.
- [x] Confirmed page integrations remain transient on load; durable writes happen only from explicit user action or explicit `persist=true`.
- [x] Confirmed no external email, SMS, social post, payment, subscription, or destructive operation is performed by Mini-Brain actions.
- [x] Verified `npm.cmd run build` passes after the action upgrade.
- [x] Confirmed `.next/routes-manifest.json` exists after build and `.next/server/vendor-chunks/@supabase.js` is not generated.
- [x] No Supabase schema changes were required in this pass; existing tables were used.
- [ ] Live approve/dismiss API testing still requires configured Supabase env and an authenticated or explicitly scoped workspace context.

### V9 Review-Gated Action Smoke Test

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

# Transient run, no persistence.
$result = Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'

# Approve the first Mini-Brain insight into an internal review-gated draft.
$insight = $result.result.insights[0]
Invoke-RestMethod -Method Post "$base/api/intelligence/actions" `
  -ContentType "application/json" `
  -Body (@{ decision = "approve"; insight = $insight } | ConvertTo-Json -Depth 12)

# Dismiss an insight without creating an external action.
Invoke-RestMethod -Method Post "$base/api/intelligence/actions" `
  -ContentType "application/json" `
  -Body (@{ decision = "dismiss"; insight = $insight } | ConvertTo-Json -Depth 12)
```

## V9 Mini-Brain Scorecards and Insight Details Upgrade - 2026-05-19

- [x] Verified `npm.cmd run build` passes after the scorecard/detail-modal upgrade.
- [x] Confirmed `.next/routes-manifest.json` exists after build and `.next/server/vendor-chunks/@supabase.js` is not generated.
- [x] Confirmed no `DROP TABLE`, `TRUNCATE TABLE`, or destructive `DELETE FROM` statements were added to `supabase/user_crm_full_completion_schema.sql`.
- [x] Added `MiniBrainScore` to `lib/intelligence/types.ts` and exposed scorecards on the `MiniBrainResult`.
- [x] Added `lib/intelligence/scorecards.ts` for deterministic CRM scorecards:
  - Business health
  - Pipeline focus
  - Marketing efficiency
  - Setup readiness
  - CRM hygiene
- [x] Updated `lib/intelligence/miniBrain.ts` so every run returns structured scorecards alongside insights, recommendations, actions, confidence, and data-used metadata.
- [x] Expanded `lib/crm/data.ts` context loading to include `crm_provider_connections` and provider readiness metrics for setup/safety intelligence.
- [x] Updated `components/intelligence/MiniBrainInsightPanel.tsx` so every integrated CRM page shows compact deterministic scorecards.
- [x] Added a shared Mini-Brain details modal with full reasoning, confidence, priority, source, related records, and review-gated next-step copy.
- [x] Details modal confirms Mini-Brain actions create only internal drafts/review records and do not send email/SMS/social posts or perform billing actions.
- [x] Page loads still use transient `/api/intelligence/summary`; no durable recommendation persistence happens unless an explicit action or `persist=true` request is made.
- [ ] Live scorecard/insight behavior still needs browser verification against the seeded test workspace after `CRM_TEST_*` env secrets are configured.

### V9 Scorecard Smoke Targets

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

$summary = Invoke-RestMethod "$base/api/intelligence/summary"
$summary.result.scores

# Browser-check scorecards and the "Why this matters" modal on:
# /dashboard/analytics
# /dashboard/leads
# /dashboard/pipeline
# /dashboard/tasks
# /dashboard/calendar
# /dashboard/marketing
# /dashboard/communications
# /dashboard/workflow
# /dashboard/settings
```

## V9 Mini-Brain Helper Result Types Upgrade - 2026-05-19

- [x] Added shared Mini-Brain helper result contracts to `lib/intelligence/types.ts`.
- [x] Added `MiniBrainActionCard` for ranked review-gated actions with urgency, impact, effort, confidence, reason, destination, and related record metadata.
- [x] Added `MiniBrainTemplateDraft` for deterministic rule-based email/SMS draft templates with tone, personalization fields, and `reviewRequired=true`.
- [x] Added helper result types for:
  - `LeadIntelligenceCard`
  - `DealHealthCard`
  - `CampaignHealthCard`
  - `ConversationSummary`
  - `WorkflowSignalCard`
  - `TaskPriorityCard`
  - `AppointmentPrepCard`
  - `BillingUsageForecast`
  - `SetupReadinessScore`
  - `StaffWorkloadSummary`
  - `BusinessHealthSummary`
  - `SafetyCheckResult`
- [x] Added optional `helperResults` to `MiniBrainResult` so future page modals, record detail panels, and workflow signals can consume stable typed structures without changing the current insight API shape.
- [x] Helper result contracts preserve review-gated semantics and do not allow automatic email, SMS, social, billing, payment, auth, or destructive actions.
- [x] Verified `npm.cmd run build` passes after the helper type expansion.
- [ ] Remaining helper-result work: populate these contracts from each domain module and wire them into per-record modals after live seeded-workspace tuning.

## Task 20 Goal Run - HelperResults Population and Empty-Context Verification - 2026-05-19

- [x] Read `docs/codex/CODEX_TASK_LEDGER.md` and `docs/codex/TASK20_MINIBRAIN_GOAL.md` before implementation.
- [x] `docs/codex/SYNAPTIREACH_MASTER_V9.md` was requested by the goal but is not present in `docs/codex`; continued from the available repo docs, checklist, and current working tree.
- [x] Updated `docs/codex/CODEX_TASK_LEDGER.md` after each checkpoint.
- [x] Added `lib/intelligence/helperResults.ts` to populate Mini-Brain helperResults from real normalized CRM context.
- [x] `runMiniBrain()` now returns populated helperResults for:
  - lead scorecards
  - deal health cards
  - campaign health cards
  - conversation summaries
  - workflow signals
  - task priority cards
  - appointment prep cards
  - billing/usage forecasts
  - setup readiness
  - staff workload summaries
  - business health summaries
  - safety check results
  - ranked review-gated actions
  - rule-based draft templates
- [x] Updated `components/intelligence/MiniBrainInsightPanel.tsx` to render page-relevant domain helper cards from helperResults, using the existing page `types` filters.
- [x] Helper cards open in the shared "Why this matters" modal with deterministic reasoning, confidence, priority, source, related records, and review-gated next step.
- [x] Updated `buildMiniBrainContext()` to return a successful empty real-data context with setup/schema warnings when Supabase setup is unavailable, so Mini-Brain can still run without external AI providers or live database access.
- [x] Verified `npm.cmd run build` passes after helperResults population and empty-context fallback.
- [x] Local production API smoke test passed:
  - `GET /api/intelligence/summary` returned 200.
  - `POST /api/intelligence/run` with `{"persist":false}` returned 200.
- [x] Empty/setup-warning context no longer crashes Mini-Brain APIs.
- [x] Page loads still use transient summaries and do not persist durable recommendations repeatedly.
- [x] No external email, SMS, social post, charge, subscription update, payment status update, or destructive data action is performed by Mini-Brain.
- [x] Confirmed no destructive `DROP TABLE`, `TRUNCATE TABLE`, or destructive `DELETE FROM` was added to `supabase/user_crm_full_completion_schema.sql`.
- [x] Build artifact check: `.next/routes-manifest.json` exists. `.next/server/vendor-chunks/@supabase.js` is currently generated and present, so the prior missing-file ENOENT condition is not reproduced.
- [ ] Remaining Task 20 work: richer per-record metric modal wiring, live seeded test-workspace tuning, and authenticated approve/dismiss/action DB-write verification.

### Task 20 Goal Verification Commands

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/intelligence/summary"
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'
```

## Task 20 Continuation - CRM-Wide Panel Completion - 2026-05-19

- [x] Read `docs/codex/SYNAPTIREACH_MASTER_V9.md` and `docs/codex/CODEX_TASK_LEDGER.md` before continuing.
- [x] Continued Task 20 only and preserved completed mini-brain/local-AI work.
- [x] Updated `docs/codex/CODEX_TASK_LEDGER.md` after each checkpoint.
- [x] Added the shared `MiniBrainInsightPanel` to `/dashboard`, giving the main dashboard the same helperResults scorecards, helper cards, modal, and review-gated action flow used by the other CRM pages.
- [x] Added the shared `MiniBrainInsightPanel` to `/dashboard/ai_assistant`, so the AI Command Center also consumes helperResults and deterministic scorecards before external AI.
- [x] Existing shared panel coverage remains in:
  - `/dashboard/analytics`
  - `/dashboard/leads`
  - `/dashboard/pipeline`
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/marketing`
  - `/dashboard/communications`
  - `/dashboard/workflow`
  - `/dashboard/settings`
- [x] Updated the Mini-Brain detail modal with related-record open links and inline action feedback for approve/dismiss decisions.
- [x] All shared panel page loads still call transient `/api/intelligence/summary`; no durable recommendations are persisted on page load.
- [x] Safe actions remain review-gated and internal only: task drafts, workflow drafts, message drafts, notifications/review records, related-page links, approve/dismiss.
- [x] Confirmed no auto-send email/SMS/social behavior, no auto-charge behavior, and no secret exposure was added.
- [x] Verified `npm.cmd run build` passes after this continuation.
- [x] Local production API smoke test passed:
  - `GET /api/intelligence/summary` returned 200.
  - `POST /api/intelligence/run` with `{"persist":false}` returned 200.
- [x] Confirmed no destructive `DROP TABLE`, `TRUNCATE TABLE`, or destructive `DELETE FROM` was added to `supabase/user_crm_full_completion_schema.sql`.
- [x] Build artifact check: `.next/routes-manifest.json` exists. `.next/server/vendor-chunks/@supabase.js` is generated and present, so the prior missing vendor-chunk ENOENT condition is not reproduced.
- [ ] Task 20 remains partial, not fully complete, until live seeded-workspace tuning and authenticated approve/dismiss/action DB-write verification are completed.

### Task 20 Continuation Test Commands

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/intelligence/summary"
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'
```

## Task 3 / Task 2A - Test Workspace Live Verification Pass - 2026-05-19

- [x] Read `docs/codex/SYNAPTIREACH_MASTER_V9.md` and `docs/codex/CODEX_TASK_LEDGER.md` before continuing.
- [x] Continued Task 3 / Task 2A only; no billing, services, waitlist, public page, or Task 20 implementation work was performed.
- [x] Updated `docs/codex/CODEX_TASK_LEDGER.md` at each checkpoint.
- [x] Inspected all protected simulation routes:
  - `POST /api/test/simulation/bootstrap`
  - `GET /api/test/simulation/status`
  - `POST /api/test/simulation/seed`
  - `POST /api/test/simulation/tick`
  - `POST /api/test/simulation/pause`
  - `POST /api/test/simulation/reset`
- [x] Inspected `lib/simulation/testWorkspaceSeed.ts` and confirmed the seed foundation covers:
  - 84 leads
  - 32 deals
  - 64 tasks
  - 26 appointments
  - 22 campaigns plus campaign events/interactions
  - communications, CRM conversations, and CRM messages
  - workflows and workflow runs
  - CRM and marketing AI recommendations plus agent runs
  - notifications
  - billing account and usage events
  - service requests
  - waitlist and contact submissions
  - provider setup-required rows
  - staff roles and staff permissions
- [x] Confirmed seed IDs are deterministic and rows are upserted by stable IDs, so repeated seed calls are designed to be idempotent instead of endlessly duplicating records.
- [x] Confirmed seeded rows use `metadata: testMeta(...)` where supported, including:
  - `is_test_data: true`
  - `simulation_source: "synaptireach_test_workspace"`
  - `simulation_version`
  - `generated_at`
- [x] Confirmed bootstrap creates or finds the Supabase Auth user for `donovan.mike966@gmail.com`, creates/fixes the workspace, links `workspace_members`, writes onboarding/settings records, marks the workspace as test/simulation, and returns `workspace_id`, `company_id`, and `user_id`.
- [x] Confirmed dashboard/settings simulation UI is only shown when `/api/test/simulation/status` returns `allowed`.
- [x] Hardened simulation controls so status, seed, tick, pause, and reset now all verify `workspaces.is_test_workspace=true` before reading or mutating simulation state.
- [x] Confirmed `npm.cmd run build` passes after the simulation guard hardening.
- [x] Build artifact check: `.next/routes-manifest.json` exists after the final build.
- [ ] Live bootstrap was not executed because this shell and `.env.local` do not currently expose the required local env vars.
- [ ] Live status/seed/tick/pause/reset API verification remains blocked until local `CRM_TEST_*` and Supabase service credentials are configured.
- [ ] Seeded record counts, metadata, normal-user isolation, and browser page population still need live Supabase verification after bootstrap.
- [ ] Local HTTP fail-closed probes were attempted, but the local Next server exited during route probing in this shell; do not treat route probes as passed until rerun after env/server setup.

### Required Local Env For Live Test Workspace Verification

Set these in `.env.local` before rerunning the live bootstrap flow:

```powershell
Add-Content .env.local "CRM_ENABLE_TEST_SIMULATION=true"
Add-Content .env.local "CRM_TEST_ACCOUNT_EMAILS=donovan.mike966@gmail.com"
Add-Content .env.local "CRM_TEST_BOOTSTRAP_SECRET=replace-with-local-dev-secret"
Add-Content .env.local "CRM_TEST_SIMULATION_SEED_SECRET=replace-with-local-dev-secret"
Add-Content .env.local "NEXT_PUBLIC_SUPABASE_URL=replace-with-project-url"
Add-Content .env.local "SUPABASE_SERVICE_ROLE_KEY=replace-with-service-role-key"
```

After bootstrap returns a workspace ID, add:

```powershell
Add-Content .env.local "CRM_TEST_WORKSPACE_IDS=returned-workspace-id"
```

### Live Bootstrap / Seed / Tick Commands

```powershell
npm.cmd run build
npm.cmd run start -- -H 127.0.0.1 -p 3000

$base = "http://127.0.0.1:3000"

$bootstrap = Invoke-RestMethod -Method Post "$base/api/test/simulation/bootstrap" `
  -ContentType "application/json" `
  -Body '{"email":"donovan.mike966@gmail.com","bootstrap_secret":"YOUR_BOOTSTRAP_SECRET","test_password":"LOCAL_ONLY_TEST_PASSWORD"}'

$bootstrap.workspace_id
$bootstrap.company_id
$bootstrap.user_id

# Add CRM_TEST_WORKSPACE_IDS=$($bootstrap.workspace_id) to .env.local, restart the server, then run:

Invoke-RestMethod "$base/api/test/simulation/status?workspace_id=$($bootstrap.workspace_id)&secret=YOUR_SEED_SECRET"

Invoke-RestMethod -Method Post "$base/api/test/simulation/seed" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET" } | ConvertTo-Json)

Invoke-RestMethod -Method Post "$base/api/test/simulation/tick" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET" } | ConvertTo-Json)

Invoke-RestMethod -Method Post "$base/api/test/simulation/pause" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET"; paused = $true } | ConvertTo-Json)

Invoke-RestMethod -Method Post "$base/api/test/simulation/pause" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET"; paused = $false } | ConvertTo-Json)

# Reset is destructive only inside the marked test workspace.
Invoke-RestMethod -Method Post "$base/api/test/simulation/reset" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET" } | ConvertTo-Json)
```

### Browser Pages To Verify After Live Seed

- `/signin`
- `/dashboard`
- `/dashboard/analytics`
- `/dashboard/leads`
- `/dashboard/pipeline`
- `/dashboard/tasks`
- `/dashboard/calendar`
- `/dashboard/marketing`
- `/dashboard/communications`
- `/dashboard/workflow`
- `/dashboard/ai_assistant`
- `/dashboard/settings`

Verify that the test user sees normal CRM pages populated with seeded simulated data, while normal users do not see simulation controls, the simulated workspace badge, or test records.

## Task 3 / Task 2A - Live Verification and Polish Completion - 2026-05-19

- [x] Task 3 / Task 2A continued only; billing/services/waitlist/public pages were not changed.
- [x] Live bootstrap succeeded for the dedicated test account:
  - Email: `donovan.mike966@gmail.com`
  - Workspace ID: `cc2d162a-33e9-4d0b-8a8f-b9d35f68d4a8`
  - Company ID: `c833d54d-20f9-4760-bf3c-d72619e7ada9`
  - User ID: `26525fd4-c5ad-4139-bb23-c607c6b73645`
- [x] Live seed succeeded and returned rich simulated counts across leads, deals, tasks, appointments, marketing, communications, conversations, workflows, recommendations, notifications, billing, services, waitlist, contacts, providers, staff, and audit logs.
- [x] Live tick succeeded twice and advanced the simulation to day 3.
- [x] CRM API smoke checks returned seeded data during live verification.
- [x] Browser login now works after adding `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Confirmed browser auth code requires `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
  - `lib/supabase/client.ts`
  - `lib/supabase/server.ts`
- [x] Manual browser verification confirmed the test user loads normal CRM pages, not fake separate pages:
  - `/dashboard`
  - `/dashboard/analytics`
  - `/dashboard/leads`
  - `/dashboard/pipeline`
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/marketing`
  - `/dashboard/communications`
  - `/dashboard/workflow`
  - `/dashboard/ai_assistant`
  - `/dashboard/settings`
- [x] Normal-user simulation isolation is enforced by code:
  - Simulation controls call `/api/test/simulation/status`.
  - Dashboard/settings simulation UI only appears when status returns `allowed`.
  - Simulation routes require configured test env/secret or allowed test account context.
  - Status, seed, tick, pause, and reset all verify `workspaces.is_test_workspace=true` before proceeding.
  - Seeded records are scoped by the configured test workspace ID and use normal CRM pages/data APIs.
- [x] Added schema repair for the live seed issue:
  - `public.marketing_campaigns.metadata jsonb not null default '{}'::jsonb` is now in the create-table definition.
  - `alter table if exists public.marketing_campaigns add column if not exists metadata jsonb not null default '{}'::jsonb;` is now included for existing databases.
- [x] Seeded test rows use deterministic IDs/upserts and `metadata: testMeta(...)` where supported, including test/simulation metadata.
- [x] Removed active customer-facing `mini-brain` wording from CRM UI/API messages and replaced it with polished intelligence language:
  - Built-in Intelligence
  - Business Intelligence
  - Smart Signals
  - Review-gated intelligence action
- [x] Internal code identifiers such as `MiniBrainInsight` and `miniBrain.ts` remain unchanged to avoid breakage; they are not customer-facing labels.
- [x] Added `components/dashboard/QueryRecordFocus.tsx` to support safe query/hash focus patterns from intelligence and recommendation links.
- [x] Added related-record routing/focus patterns:
  - `/dashboard/leads?leadId=...`
  - `/dashboard/pipeline?dealId=...`
  - `/dashboard/tasks?taskId=...`
  - `/dashboard/calendar?appointmentId=...`
  - `/dashboard/marketing?campaignId=...`
  - `/dashboard/communications?conversationId=...`
  - `/dashboard/workflow?workflowId=...`
  - `/dashboard/settings#billing`
  - `/dashboard/settings#providers`
- [x] Updated intelligence card routing so related records prefer exact item links where possible.
- [x] Page loads still use transient intelligence summaries and do not persist duplicate durable recommendations.
- [x] Review-gated intelligence actions remain internal only; no email, SMS, social post, Stripe charge, payment status update, or destructive action is triggered.
- [x] Verified `npm.cmd run build` passes after Task 3 polish.
- [x] Build artifact checks:
  - `.next/routes-manifest.json` exists.
  - `.next/BUILD_ID` exists.
- [x] Static customer-facing phrase check: active `app`, `components`, and `lib` UI/API strings no longer contain `mini-brain` / `mini brain`; remaining matches are internal code identifiers only.
- [ ] Local `next start` HTTP probes exited immediately after reporting "Ready" in this shell, so this pass did not add fresh local HTTP API probe results. Use the already successful live API/browser verification above and rerun route probes in a clean local shell if needed.

### Task 3 Final Verification Commands

```powershell
npm.cmd run build

# Start in a clean shell if local route probes are needed:
npm.cmd run start -- -H 127.0.0.1 -p 3000

$base = "http://127.0.0.1:3000"
$workspace = "cc2d162a-33e9-4d0b-8a8f-b9d35f68d4a8"

Invoke-RestMethod "$base/api/test/simulation/status?workspace_id=$workspace&secret=YOUR_SEED_SECRET"

Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'
```

### Task 3 Status

Task 3 / Task 2A is marked complete for launch-readiness tracking. The dedicated simulated workspace exists, has rich seeded data, advances with ticks, uses normal CRM pages, and is protected by test-workspace guards. Continue to use this workspace for Task 20 tuning and later CRM/browser smoke tests.

## Tasks 5-12 Implementation Checkpoint - 2026-05-19

- [x] Continued from the current working tree and limited this pass to Tasks 5-12.
- [x] `npm.cmd run build` passes after Tasks 5-12 changes.
- [x] Added richer central plan metadata in `lib/billing/plans.ts`:
  - BYOK and SynaptiReach-managed tiers.
  - Monthly prices.
  - Stripe price env var names.
  - AI/email/SMS/contact/agent/workflow caps.
  - Hard-cap behavior.
  - Credit-pack eligibility.
  - BYOK provider-cost responsibility.
- [x] Added subscription Checkout intent route:
  - `POST /api/billing/subscription/checkout`
  - Uses Stripe Checkout `mode=subscription`.
  - Uses a 14-day trial.
  - Does not hardcode `payment_method_types`.
  - Does not mark subscriptions active without webhook confirmation.
  - Returns setup-required when Stripe price env vars or Supabase env are missing.
- [x] Updated Stripe webhook handling to store subscription checkout metadata and subscription lifecycle references where Stripe confirms events.
- [x] Added dashboard settings subscription plan selection and required disclosure:
  - “After the 14-day trial, your selected plan renews automatically unless canceled before the trial ends.”
- [x] Added `lib/billing/services.ts` service catalog for services, bundles, and retainers.
- [x] Added dashboard service consultation request flow:
  - `POST /api/crm/services/request`
  - Stores `crm_service_requests`.
  - Creates notifications/audit logs where Supabase is configured.
  - Does not trigger payment or fake paid orders.
- [x] Updated public `/services`:
  - Buttons now say `Contact SynaptiReach`.
  - Buttons route to `/contact?service=...`.
  - Consultation language explains the required 30-minute video consultation.
  - Pricing and Full Business System 30-day implementation support are preserved.
- [x] Rebuilt `/contact` as a working form:
  - Posts to `POST /api/contact`.
  - Saves `contact_submissions` when Supabase is configured.
  - Sends SynaptiReach notification email via Resend when configured.
  - Includes honeypot spam field.
  - Supports service, support, waitlist, trial, partner, and general inquiries.
- [x] Added admin contact view:
  - `/admin/dashboard/contact-submissions`
- [x] Added public waitlist widget:
  - Visible on public marketing pages.
  - Hidden from demo, dashboard, and admin paths.
  - Collects launch cohort fields.
  - Saves to `waitlist_signups` when Supabase is configured.
  - Deduplicates by email.
  - Assigns first-5 founding cohort eligibility.
  - Sends internal Resend email when configured.
- [x] Added admin waitlist view:
  - `/admin/dashboard/waitlist`
- [x] Added dynamic industry pages:
  - `/solutions/[industry]`
  - Required industries are covered, including real estate, med spa, dental, home services, contractors, ecommerce, consultants, coaches, gyms/fitness, restaurants/local businesses, automotive, insurance, financial services, education/training, nonprofit, and other industry.
- [x] Updated compact footer Solutions list to include all industries plus “Don’t See Your Industry?”.
- [x] Expanded public info pages:
  - `/about`
  - `/blog`
  - `/careers`
  - `/privacy`
  - `/terms`
  - `/security`
  - `/support`
  - `/analytics`
  - `/ai-agents`
- [x] Button cleanup:
  - `/support` uses only `Contact Support`.
  - `/privacy` uses only `Contact SynaptiReach`.
  - `/careers` uses only `Contact Us`.
- [x] Hardened Supabase build/runtime helpers:
  - `lib/supabase/client.ts` validates public Supabase URL before browser client construction.
  - `lib/crm/supabaseAdmin.ts` validates Supabase URL before service-role client construction and returns setup-required instead of crashing.

### Tasks 5-12 Smoke Tests

```powershell
npm.cmd run build

$job = Start-Job -ScriptBlock { Set-Location 'C:\Users\nikna\SynaptiReach'; npm.cmd run start -- -p 3008 }
Start-Sleep -Seconds 8
$routes = @(
  '/pricing','/trial','/services','/contact','/about','/blog','/careers',
  '/privacy','/terms','/security','/support','/analytics','/ai-agents',
  '/solutions/real-estate','/solutions/med-spa','/solutions/other-industry',
  '/admin/dashboard/contact-submissions','/admin/dashboard/waitlist'
)
$routes | ForEach-Object {
  Invoke-WebRequest -Uri "http://localhost:3008$_" -MaximumRedirection 5 -TimeoutSec 20 -UseBasicParsing
}
Stop-Job -Job $job
Remove-Job -Job $job
```

Observed result: all listed pages returned 200.

### Tasks 5-12 API Smoke Results

With the current local env, valid payload API probes returned clean setup-required responses because Supabase env is unavailable/invalid:

- `POST /api/contact` -> 503 setup-required.
- `POST /api/waitlist` -> 503 setup-required.
- `POST /api/billing/subscription/checkout` -> 503 setup-required.
- `POST /api/crm/services/request` -> 503 setup-required.

This is a safe failure mode. With valid env, rerun live-write tests:

```powershell
$base = "http://localhost:3000"

Invoke-RestMethod -Method Post "$base/api/contact" `
  -ContentType "application/json" `
  -Body '{"name":"Smoke Test","email":"smoke@example.com","message":"Contact smoke test","source":"local_smoke"}'

Invoke-RestMethod -Method Post "$base/api/waitlist" `
  -ContentType "application/json" `
  -Body '{"full_name":"Smoke Test","work_email":"waitlist-smoke@example.com","consent_to_contact":true,"source":"local_smoke"}'

Invoke-RestMethod -Method Post "$base/api/billing/subscription/checkout" `
  -ContentType "application/json" `
  -Body '{"plan":"growth-managed"}'

Invoke-RestMethod -Method Post "$base/api/crm/services/request" `
  -ContentType "application/json" `
  -Body '{"itemName":"Growth Engine"}'
```

Required live env for full verification:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Stripe subscription price env vars:
  - `STRIPE_PRICE_BASIC_BYOK`
  - `STRIPE_PRICE_GROWTH_BYOK`
  - `STRIPE_PRICE_PREMIUM_BYOK`
  - `STRIPE_PRICE_BASIC_MANAGED`
  - `STRIPE_PRICE_GROWTH_MANAGED`
  - `STRIPE_PRICE_PREMIUM_MANAGED`

### Tasks 5-12 Status

- Task 5: Partial. Subscription Checkout intent exists and build passes; live Stripe price/session/webhook/trial lifecycle verification remains.
- Task 6: Partial. Tiers/caps are centrally modeled and visible in settings; full cap enforcement tests remain.
- Task 7: Partial. Dashboard service request UI/API exists; live Supabase write verification remains.
- Task 8: Complete for current scope.
- Task 9: Partial. Contact form/API/admin exists; live Supabase insert and Resend delivery verification remain.
- Task 10: Partial. Waitlist widget/API/admin exists; live Supabase insert, Resend notification, and invite/admin action flows remain.
- Task 11: Complete for current scope.
- Task 12: Partial. Public pages are expanded and button cleanup is applied; final mobile/desktop visual polish remains.

## Launch Readiness Goal Checkpoint 1 - 2026-05-19

- [x] Started the full remaining launch-readiness goal from the current working tree.
- [x] Read the required files before implementation:
  - `docs/codex/SYNAPTIREACH_MASTER_V9.md`
  - `docs/codex/CODEX_TASK_LEDGER.md`
  - `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`
  - `package.json`
  - `.env.example`
- [x] Confirmed the initial working tree was clean for this goal.
- [x] Confirmed latest local commit at goal start:
  - `d74d852d Add SynaptiReach user staff portal prompt pack`
- [x] Preserved current Task 3 status:
  - Complete.
  - Test workspace `cc2d162a-33e9-4d0b-8a8f-b9d35f68d4a8` remains the only allowed simulated CRM workspace.
- [x] Preserved current Business Intelligence / CRM Intelligence foundation.
- [x] Confirmed Tasks 5-12 are the first active verification/hardening phase.
- [ ] Continue Tasks 5-12 static/live verification and hardening.

Security note: the Resend API key was previously pasted into chat during setup. Do not expose it in logs or source. Rotate the Resend API key after testing is complete.

## Launch Readiness Goal Checkpoint 2 - Tasks 5-12 Hardening - 2026-05-19

- [x] Added fail-closed admin record viewing:
  - `/admin/dashboard/contact-submissions`
  - `/admin/dashboard/waitlist`
  - These pages no longer read Supabase records unless `CRM_ADMIN_READ_ENABLED=true`.
- [x] Added secret-protected waitlist admin update route:
  - `PATCH /api/admin/waitlist`
  - Requires `CRM_ADMIN_ACTION_SECRET`.
  - Supports lifecycle statuses:
    - `new`
    - `reviewed`
    - `invited`
    - `onboarded`
    - `declined`
- [x] Updated waitlist insert behavior:
  - Default status is now `new`.
  - API accepts aliases for `team_size`, `needs`, `interested_tier`, and `byok_managed_interest`.
- [x] Updated Supabase schema idempotently:
  - `waitlist_signups.status` create-table default is `new`.
  - Existing table default is repaired with `alter table if exists public.waitlist_signups alter column status set default 'new';`.
- [x] Hardened subscription checkout setup-required behavior:
  - Missing Stripe price env vars return a clear 503 setup-required response before attempting checkout.
  - No subscription is marked active without Stripe webhook confirmation.
- [x] Updated `.env.example` with missing launch-readiness env vars:
  - Stripe subscription price vars.
  - Test simulation vars.
  - Admin read/action gate vars.
  - Resend sender/contact vars.
- [x] Build verification for this checkpoint:
  - `npm.cmd run build` passed.
- [x] Focused local production probes:
  - Admin-gated/public pages returned 200.
  - Unauthorized admin waitlist PATCH returned 403.
  - Empty contact/waitlist payloads returned validation errors.
- [x] Hardened Stripe provider network failure handling:
  - Stripe helper now returns a clear provider/network error instead of bubbling raw `fetch failed`.
- [ ] Live Supabase/Stripe/Resend verification.

## Launch Readiness Goal Checkpoint 3 - Tasks 13-19 CRM Polish - 2026-05-19

- [x] Task 13 dashboard compaction:
  - Grouped dashboard metrics into compact tabs with a View all metrics mode.
  - Preserved all dashboard metrics and their real-data detail modal behavior.
  - Collapsed secondary quick actions into a More actions menu while keeping every action available.
- [x] Task 14 partial metric popup expansion:
  - Added clickable pipeline metric modals for Pipeline Value, Weighted Value, Open Deals, Won Deals, Lost Deals, and Stale Deals.
  - Modals use real deal records and link back to exact deal IDs through `/dashboard/pipeline?dealId=...`.
  - Broader page-native metric popup coverage is still pending for several CRM pages.
- [x] Task 15 pipeline help:
  - Added Create Deal guidance explaining what a deal is, lead linkage, value, probability, stages, close dates, and forecasting impact.
- [x] Task 16 AI Command Center:
  - Added provider/action readiness cards for CRM Intelligence, SynaptiReach Managed, BYOK, and future Local Connector modes.
  - Preserved review-gated actions and did not expose provider keys.
- [x] Task 17 workflow templates/signals:
  - Added review-gated templates for clicked-not-converted follow-up, abandoned setup reminder, failed payment follow-up, usage cap alert, staff reassignment, proposal follow-up, and service request intake.
  - Expanded Live Workflow Signals into clickable detail popups with real records, explanations, recommended actions, and empty states.
- [x] Task 18 marketing recommendations polish:
  - Campaign Activity now shows recent 5 by default with View all and search.
  - CRM Intelligence Recommendations now show recent 5 by default with View all and search.
  - Existing approve/deny behavior remains review-gated.
- [x] Task 19 current status:
  - Tasks page already supports AI/CRM Intelligence task recommendations with approve, deny, assign, and staff selection.
- [x] Customer-facing wording:
  - Removed a visible `mini_brain` source label from AI Assistant insight cards.
- [x] Build verification for this checkpoint:
  - First `npm.cmd run build` attempt compiled successfully but timed out at 120 seconds while collecting page data.
  - Second `npm.cmd run build` completed successfully.
- [ ] Browser interaction verification for the new modals, signal popups, grouped metrics, and expanded marketing lists.

## Launch Readiness Goal Checkpoint 4 - Tasks 21-22 Final Launch Items - 2026-05-19

- [x] Task 21 review-gated communications sending:
  - Added `POST /api/crm/communications/send`.
  - Requires `confirm=true` and an existing workspace-scoped communication record.
  - Sends only email or SMS.
  - Uses Resend server-side for email when `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are configured.
  - Uses Twilio server-side for SMS when `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` are configured.
  - Returns setup-required errors if providers are missing.
  - Updates the communication as `sent` or `failed` and stores provider metadata without exposing secrets.
  - Creates a workspace notification for sent/failed outcomes.
  - Added a Confirm Send action on outbound draft/scheduled/failed email/SMS cards in `/dashboard/communications`.
  - No background auto-send loop was added.
- [x] Task 22 notification mark-read:
  - Topbar notification clicks now optimistically mark that individual notification as read before navigation.
  - Mark all read updates the unread count immediately.
  - API mark-all now requires a workspace context or explicit workspace ID and no longer updates all unread notifications globally when context is missing.
- [x] `.env.example` now includes `TWILIO_FROM_NUMBER`.
- [ ] Live Resend/Twilio success-path verification.
- [ ] Workspace-level BYOK provider credential storage remains future/provider setup work.
- [x] Build verification for this checkpoint:
  - `npm.cmd run build` completed successfully and generated 150 app routes, including `/api/crm/communications/send`.

## Launch Readiness Goal Checkpoint 5 - Task 14 Metric Popup Breadth - 2026-05-19

- [x] Added shared real-data metric modal component:
  - `components/dashboard/SimpleMetricModal.tsx`
- [x] Added clickable metric popup coverage to:
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/communications`
  - `/dashboard/marketing`
- [x] These are now in addition to existing/new metric modal coverage on:
  - `/dashboard`
  - `/dashboard/pipeline`
- [x] Popups include current value, real related records, empty states, and related-page links.
- [ ] Analytics, AI Assistant, and Settings still need deeper page-native metric modal treatment beyond existing panels/CRM Intelligence cards.
- [ ] Browser interaction verification remains.
- [x] Build verification for this checkpoint:
  - `npm.cmd run build` completed successfully after shared metric modal wiring.

## Launch Readiness Goal Checkpoint 6 - Final Checks For This Pass - 2026-05-19

- [x] Final build for this pass:
  - `npm.cmd run build` passed.
  - Build generated 150 app routes.
- [x] Local production page smoke for changed CRM pages:
  - `/dashboard` -> 200
  - `/dashboard/tasks` -> 200
  - `/dashboard/calendar` -> 200
  - `/dashboard/communications` -> 200
  - `/dashboard/marketing` -> 200
  - `/dashboard/pipeline` -> 200
  - `/dashboard/workflow` -> 200
  - `/dashboard/ai_assistant` -> 200
- [x] Fail-closed API probes:
  - `POST /api/crm/communications/send` with `{}` -> 400, expected because `communication_id` is required.
  - `PATCH /api/admin/waitlist` without admin secret -> 403, expected.
- [x] Safety checks:
  - `.env.local` is not tracked by git.
  - Active `app`, `components`, and `lib` source has no customer-facing `mini-brain` / `mini brain` phrase matches.
  - Secret source grep found only server-side env references, not committed secret values.
  - No live Stripe mode switch was made.
  - No external email/SMS/social send was triggered.
  - No fake paid/subscribed state was created.
- [x] Task status summary for this pass:
  - Complete in this pass/current scope: Tasks 13, 15, 16, 17, 18, 19, 22.
  - Still partial: Tasks 5, 6, 7, 9, 10, 12, 14, 20, 21, 23, 24.
  - Preserved complete: Task 3 test workspace and Task 8/11 public services/industry coverage.
- [ ] Manual/live verification still required:
  - Stripe test checkout/session/webhook/trial lifecycle and Billing Portal.
  - Supabase live writes for contact, waitlist, service requests, notification persistence, and communications send logs.
  - Resend notification delivery and email send success path.
  - Twilio SMS send success path.
  - Admin role/auth model hardening beyond fail-closed env gates.
  - Browser/mobile interaction pass for dashboard metric tabs, shared metric modals, workflow signal popups, marketing view-all/search, notification count decrement, and communications Confirm Send confirmation.
  - Production deployment and production route/API smoke for this new pass.

Reminder: the Resend API key was previously pasted into chat during setup. Rotate it after testing.

## Launch Verification Checkpoint 1 - 2026-05-20

- [x] Continued from the current working tree without restarting completed work.
- [x] Read required docs:
  - `docs/codex/SYNAPTIREACH_MASTER_V9.md`
  - `docs/codex/CODEX_TASK_LEDGER.md`
- [x] Confirmed current working tree was clean at start of this pass.
- [x] Confirmed latest local commit:
  - `3453000e Harden launch readiness CRM billing contact waitlist and communications`
- [x] Confirmed this shell does not expose required Supabase/Stripe/Resend/Twilio/admin/test env vars directly. Next runtime probes may still load `.env.local`, but no secret values were printed.
- [x] Preserved completed Task 3 simulation/test workspace and CRM Intelligence work.

## Launch Verification Checkpoint 2 - Task 14 Completion - 2026-05-20

- [x] Verified `/dashboard/analytics` already has native analytics metric detail modals.
- [x] Added native/shared metric modal coverage to `/dashboard/ai_assistant`:
  - provider/action readiness cards
  - agent summary metric cards
  - related records and related-page links where available
- [x] Added native/shared metric modal coverage to `/dashboard/settings`:
  - integration status cards
  - billing status cards
  - usage/cap cards
- [x] Task 14 is now code-complete for the requested page coverage, pending browser interaction verification.
- [x] Build verification for this checkpoint: `npm.cmd run build` passed on 2026-05-20 after a longer trace-collection timeout; Next.js generated 150/150 static pages.

## Launch Verification Checkpoint 3 - Stripe Subscription Checkout - 2026-05-20

- [x] Verified the six subscription plan definitions and caps in `lib/billing/plans.ts`:
  - Basic BYOK, Growth BYOK, Premium BYOK
  - Basic Managed, Growth Managed, Premium Managed
- [x] Verified `POST /api/billing/subscription/checkout` uses Stripe Checkout subscription mode with a 14-day trial.
- [x] Verified checkout creates billing records in `checkout_required` / `checkout_created` states only and does not mark subscriptions active without webhook confirmation.
- [x] Verified Stripe webhook processing stores event IDs in `crm_billing_events` and treats duplicate event inserts as successful duplicate replays.
- [x] Hardened checkout billing-account lookup so scoped requests do not select an arbitrary existing billing account.
- [x] Live test-mode probes against all six configured Stripe price IDs returned HTTP 200 with `success: true`, `stripeConfigured: true`, and `setupRequired: false`.
- [ ] Full signed webhook lifecycle replay remains a manual Stripe CLI/dashboard test.

## Launch Verification Checkpoint 4 - Live Writes and Safety Routes - 2026-05-20

- [x] Live `/api/contact` probe inserted a `contact_submissions` row and returned HTTP 200.
- [x] Live `/api/waitlist` probe inserted a `waitlist_signups` row with status `new` and returned HTTP 200.
- [x] Live `/api/crm/services/request` probe inserted a `crm_service_requests` row with consultation/review-gated status and returned HTTP 200.
- [x] Verified service requests do not create paid state or bypass consultation.
- [x] Hardened the shared Resend helper so provider/network failures return safe metadata instead of raw runtime failures.
- [x] Added internal SynaptiReach Resend notification support for service requests.
- [x] Verified `/api/crm/communications/send` requires `communication_id` and explicit `confirm=true` before any provider call.
- [x] Verified the admin waitlist mutation path does not expose writes without the proper method/authorization.
- [x] Verified customer-facing `mini-brain` / `mini brain` wording is absent from active app/component/lib source.
- [x] Updated CRM Intelligence `draft_message` action persistence to create canonical `communications` drafts.
- [ ] Resend provider-side delivery still needs review because live contact/waitlist probes returned `emailSent: false` while not setup-missing.
- [ ] Authenticated CRM Intelligence approve/dismiss DB-write verification remains a browser/session test.

## Launch Verification Checkpoint 5 - Final Build and Post-Build Probes - 2026-05-20

- [x] `npm.cmd run build` passed after all launch-hardening changes in this pass.
- [x] `.next/routes-manifest.json` exists after build.
- [x] Stale `.next/server/vendor-chunks/@supabase.js` is not present after build.
- [x] `.env.local` is not tracked by git.
- [x] Local post-build page smoke returned HTTP 200 for:
  - `/dashboard/analytics`
  - `/dashboard/ai_assistant`
  - `/dashboard/settings`
  - `/dashboard/communications`
- [x] `/api/intelligence/summary` returned seeded-workspace insights and helper results.
- [x] `POST /api/intelligence/run` with `{"persist":false}` returned `persisted=0`.
- [x] `POST /api/intelligence/actions` dismiss returned HTTP 200 and recorded a review-gated decision without sending, charging, or posting externally.
- [x] Post-build `/api/crm/services/request` returned HTTP 200 with an inserted request and safe email status fields.
- [x] Unauthorized `PATCH /api/admin/waitlist` returned HTTP 403.
- [x] Secret scan found env-name references and mode-prefix checks only; no tracked secret file was found.
- [ ] Remaining manual checks:
  - signed Stripe webhook replay with Stripe CLI/dashboard
  - Resend sender/domain/recipient delivery review
  - Twilio success-path verification with test credentials
  - authenticated browser review of metric modals and CRM Intelligence approve/dismiss interactions

## SynaptiReach Onboarding Master Prompt Pass - 2026-05-27

- [x] Continued from the current working tree without restarting completed User CRM work.
- [x] Preserved the completed User CRM usability improvements:
  - OwnerFocusPanel usage
  - grouped sidebar navigation
  - `/dashboard/workflow` route preservation
  - `Review gated` / `Real records` topbar wording
  - Business Intelligence wording and recommendation panel clarity
- [x] Expanded `/onboarding` into a real save/resume workspace-generation wizard:
  - owner details
  - business profile
  - legal/company details
  - industry and service type
  - target customer
  - brand voice
  - main offer
  - preferred CTA
  - sales process
  - pipeline stages
  - lead statuses, sources, and tags
  - staff/team setup
  - staff permissions
  - provider setup
  - AI assistant behavior
  - rule-based intelligence preference
  - marketing goals and notification preferences
  - lead import/manual starter setup
  - workflow recommendations and draft creation
  - automation safety preferences
  - billing/trial mode
  - Stripe setup handoff
  - post-trial plan
  - usage caps
  - managed SMS readiness approvals
  - Help/DFY preference
  - launch readiness review
- [x] Added two explicit trial paths:
  - SynaptiReach-Managed Trial with fixed hard caps for AI/email/SMS/contacts/workflows/agents.
  - BYOK Trial with customer-owned provider usage and optional self-imposed caps.
- [x] Removed free-pick trial tier behavior from the public trial page; post-trial plan selection is separate from fixed trial exposure.
- [x] Stripe/card safety:
  - card collection stays Stripe Checkout only
  - checkout creates `checkout_required` / `checkout_created` state only
  - paid/subscribed/trialing state remains webhook-owned
  - trial start/end timestamps are not written before Stripe webhook confirmation
  - no Stripe live-mode switch was made
- [x] Save/resume:
  - partial wizard payload is stored in `onboarding_sessions`
  - current step, completed steps, skipped steps, and readiness score are stored in metadata
  - dashboard layout shows a continue-onboarding prompt until completion
- [x] Signup handoff stores only non-secret onboarding defaults in `localStorage`; the signup password is not persisted there.
- [x] Real database writes use existing structures where possible:
  - `workspaces`
  - `workspace_members`
  - `onboarding_sessions`
  - `crm_settings`
  - `crm_billing_accounts`
  - `crm_provider_connections`
  - `leads`
  - `crm_csv_imports`
  - `crm_staff`
  - `crm_staff_permissions`
  - `crm_workflows`
  - `crm_ai_recommendations`
- [x] Provider/security behavior:
  - provider secrets stay server-side/encrypted
  - OpenAI remains pending unless `AI_ENABLE_OPENAI=true`
  - Gemini first / OpenRouter fallback / OpenAI only-if-enabled guidance is preserved
  - no customer email/SMS/social send is triggered by onboarding
- [x] Help/DFY pricing included:
  - Guided Setup Call: Free 30 minutes
  - Extended Setup Support: $99/hour
  - Provider Setup Assistance: $149
  - CRM Import + Cleanup: $199
  - Campaign Setup Assistance: $249
  - Workflow Setup Assistance: $249
  - Full Onboarding Setup: $599
  - Premium Launch Setup: $999+
- [x] DFY rule documented: guidance is free when the user performs setup with SynaptiReach guidance; SynaptiReach-performed setup is paid DFY work.
- [x] Build verification:
  - `npm.cmd run build` passed.
  - Next generated 150/150 static pages.
- [x] Local production HTTP smoke returned 200 for:
  - `/trial`
  - `/signup?trial=managed`
  - `/signup?trial=byok`
  - `/onboarding`
  - `/dashboard`
  - `/dashboard/settings`
- [ ] Manual/live verification still required:
  - authenticated browser pass through every onboarding step
  - save/resume after leaving onboarding mid-flow
  - Stripe test-mode checkout and signed webhook trial lifecycle
  - provider connection success/failure states with real BYOK keys
  - managed SMS Twilio/carrier fee approval and $20 setup fee workflow
  - CSV import mapping with a real user CSV
  - staff invite/permission review in Settings
  - workflow draft review in Automations
  - launch readiness prompt clearing after required setup completion
  - Help/DFY request follow-up and any paid service checkout path

## SynaptiReach Onboarding Master Prompt V2 Delta - 2026-05-27

- [x] Read the Obsidian prompt pact:
  - `C:\Users\nikna\Documents\Obsidian Vault\SynaptiReach\Codex Prompt Pacts\synaptireach_onboarding_master_prompt_v2_updated_from_current_code.md`
- [x] Updated managed trial caps to the v2 model:
  - 300 AI credits
  - 250 emails
  - 0 SMS by default
  - 25 SMS after approval/payment
  - 250 contacts
  - 10 active workflows
  - 25 agent runs
  - 2 invited staff users
  - 5 campaign drafts
  - 1 CSV import
  - 10 onboarding files / 25 MB noted for storage-enabled paths
- [x] Added post-trial plan-fit guidance:
  - lower post-trial tiers do not delete CRM data
  - future usage beyond selected plan caps is restricted until upgrade or eligible capacity is added
  - selected post-trial plan remains renewal intent, not an expanded trial-cap selector
- [x] Added email-verification readiness:
  - Supabase auth email confirmation is included in launch readiness
  - final onboarding completion is blocked unless email verification, Stripe card setup state, and required trial disclosures are complete
- [x] Added provider test controls in onboarding:
  - Gemini
  - OpenRouter
  - OpenAI
  - Resend
  - Twilio
  - Ayrshare
  - Current behavior saves encrypted setup/readiness state and does not send external campaigns, email, SMS, or social posts.
- [x] Added real Help/DFY persistence:
  - onboarding Help/DFY selections create `crm_service_requests` rows
  - records use `metadata.source = onboarding_help`
  - no paid orders, checkout, fulfillment, or auto-charge state is created
- [x] Updated checkout metadata with post-trial plan-fit language.
- [x] Build verification:
  - `npm.cmd run build` passed.
  - Next generated 150/150 static pages.
- [x] Local production HTTP smoke returned 200 for:
  - `/trial`
  - `/pricing`
  - `/signup?trial=managed`
  - `/signup?trial=byok`
  - `/onboarding`
  - `/dashboard`
  - `/dashboard/settings`
  - `/dashboard/leads`
  - `/dashboard/workflow`
- [ ] Still required from v2 prompt:
  - custom email verification-code send/check API if Supabase auth confirmation is not enough
  - real server-side provider reachability test endpoints
  - managed trial cap hard-stop enforcement across AI/email/SMS/contact/workflow/agent/campaign/import creation paths
  - launch cohort/admin approval gate if active
  - service/product upload handling and storage limits
  - authenticated browser walkthrough for all v2 onboarding scenarios

## SynaptiReach Onboarding Fix Pass - 2026-05-27

- [x] Fixed schema compatibility for production save failures:
  - `onboarding_sessions.metadata` is included in the create-table definition.
  - Safe repair SQL is present: `ALTER TABLE public.onboarding_sessions ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;`
  - `notify pgrst, 'reload schema';` is included to refresh Supabase/PostgREST schema cache after applying SQL.
  - Server save falls back if the deployed schema cache has not exposed `metadata` or `updated_at` yet.
- [x] Fixed save/resume mechanics:
  - every step saves through `/api/onboarding/save`
  - progress is also mirrored into payload-backed `__onboardingProgress` as a compatibility fallback
  - leaving and returning restores current step/progress where saved state exists
  - dashboard prompt fetch now uses the active Supabase bearer token
  - incomplete workspace users are prompted to continue onboarding
- [x] Fixed step navigation:
  - future steps are locked
  - previous completed/unlocked steps remain available
  - locked steps explain why they are locked
  - Continue validates required fields, saves, then advances
  - Skip for now is disabled on required steps and only works on optional steps
- [x] Fixed required/optional UI:
  - required labels show a red asterisk
  - optional labels show `(optional)`
  - validation messages explain missing items in plain language
- [x] Fixed progress/readiness behavior:
  - progress meter reflects saved/completed steps
  - readiness uses backend state after save
  - missing/pending readiness items are clickable and navigate to the relevant onboarding step
  - skipped status is displayed as `intentionally skipped`
- [x] Fixed Stripe setup UI and safety:
  - billing step has “Set up payment method with Stripe”
  - user-facing copy states SynaptiReach employees never see or access card details
  - card collection remains hosted Stripe Checkout only
  - missing Stripe config/price env creates setup-required/missing readiness instead of silent success
  - trial dates/subscription state remain webhook-owned
- [x] Fixed completion behavior:
  - renamed `Activate and Enter CRM` to `Complete Onboarding`
  - completion calls `/api/onboarding/complete`
  - completion is blocked until email verification, required workspace fields, provider mode, Stripe webhook-confirmed billing setup, and trial acknowledgements are complete
  - blocked completion shows remaining readiness items
- [x] Added safe provider test route:
  - `POST /api/onboarding/provider-test`
  - provider checks run server-side
  - no fake provider success
  - no campaign/email/SMS/social send
  - OpenAI remains disabled unless `AI_ENABLE_OPENAI=true`
- [x] CRM generation/state preservation:
  - business profile, sales setup, workflow drafts, staff permissions, marketing setup, Help/DFY requests, and launch readiness continue writing real workspace-scoped state
  - no fake paid/subscribed state
  - no fake provider success
  - no fake Stripe success
- [x] Responsive/layout hardening:
  - added overflow-safe grid tracks, `min-w-0`, wrapping, and safer status pill/button behavior
- [x] Build verification:
  - `npm.cmd run build` passed
  - Next generated 151/151 static pages
- [x] Local smoke verification returned 200 for:
  - `/trial`
  - `/signup?trial=managed`
  - `/signup?trial=byok`
  - `/onboarding`
  - `/dashboard`
  - `/dashboard/settings`
  - `/dashboard/workflow`
- [ ] Manual scenarios still require authenticated production verification:
  - Managed trial full onboarding path reaches Stripe setup
  - BYOK trial full onboarding path reaches Stripe setup
  - Continue advances step-by-step
  - Skip for now works only on optional steps
  - Required fields show red asterisks
  - Optional fields show `(optional)`
  - Save persists data
  - Leaving and returning restores progress
  - Dashboard prompts incomplete users to continue onboarding
  - Readiness/progress meters update correctly
  - Readiness items navigate to relevant onboarding steps
  - Provider test buttons appear and show safe setup/readiness result
  - Complete Onboarding works only when required checklist is complete
  - Mobile and desktop layouts have no card/text overflow

## SynaptiReach Onboarding Stabilization Pass - 2026-05-27

- [x] Stripe subscription checkout supports onboarding origin return URLs:
  - `/onboarding?checkout=success&session_id={CHECKOUT_SESSION_ID}&step=billing`
  - `/onboarding?checkout=cancelled&step=billing`
  - Settings checkout return behavior remains separate.
- [x] Billing step reflects submitted/pending webhook state without marking paid/subscribed/trialing before Stripe webhook confirmation.
- [x] Removed "Save and continue later" from required billing step.
- [x] Save/resume no longer marks incomplete required steps complete.
- [x] Continue validates required fields before unlocking the next step.
- [x] Future step clicking and readiness jumps cannot bypass locked steps.
- [x] Legal/company review has an explicit acknowledgement.
- [x] Tax ID last 4 is labeled optional.
- [x] Email/SMS can be reviewed/acknowledged without requiring Resend/Twilio connection unless setup-now is selected.
- [x] Local Connector removed from onboarding AI mode.
- [x] Brand voice has editable starter/example copy.
- [x] Calendar setup is included and saved.
- [x] Provider test buttons remain server-side readiness checks and do not send customer-facing actions.
- [x] Lead CSV accepted format is documented in the onboarding UI.
- [x] Staff permission presets map to real permissions including `admin`.
- [x] Marketing starter strategy dropdown added.
- [x] Workflow draft options expanded and remain draft/review-gated.
- [x] Help/DFY appears earlier and keeps free guidance vs paid DFY distinction.
- [x] Service/product menu upload route and `crm_service_menu_uploads` schema added with `pending_analysis` / `needs_review`.
- [x] `npm.cmd run build` passed with 151/151 static pages.
- [x] Local production smoke returned 200 for `/trial`, `/signup?trial=managed`, `/signup?trial=byok`, `/onboarding`, `/dashboard`, `/dashboard/settings`, and `/dashboard/workflow`.
- [ ] Apply `crm_service_menu_uploads` SQL and create the `onboarding-files` Supabase Storage bucket in production.
- [ ] Run authenticated managed signup -> onboarding -> billing -> Stripe -> onboarding billing return.
- [ ] Run authenticated BYOK signup -> onboarding -> billing -> Stripe -> onboarding billing return.
- [ ] Verify signed Stripe webhook confirmation changes billing to eligible/completed state.
- [ ] Verify Complete Onboarding / Submit onboarding for review with production auth and webhook state.

## SynaptiReach Onboarding CRM Population Stabilization - 2026-05-28

- [x] Onboarding remains the existing wizard and was not redesigned from scratch.
- [x] Onboarding now captures CRM-population defaults for:
  - service areas, business hours, customer problems, pricing/booking/quote/review notes
  - pipeline stages, statuses, sources, tags, deal value, close-time expectations, assignment/priority rules, appointment types, and task defaults
  - marketing budget, offers, lead magnets, segments, seasonal campaign notes, and approval workflow
  - analytics KPIs/goals/reporting cadence and 30/60/90-day success notes
  - email/SMS style, common questions/objections, escalation rules, and calendar preferences
- [x] CRM-population values persist into `crm_settings.metadata` without creating fake leads, deals, revenue, analytics, service orders, or activity.
- [x] Added `/onboarding/status` for submitted-review state across billing/webhook, providers, legal/company, email/SMS, service menu, staff, leads, workflows, and help.
- [x] Dashboard redirects submitted pending-review users to `/onboarding/status`, incomplete unsubmitted users to saved-step onboarding, and completed users to `/dashboard`.
- [x] Added Finish Later actions next to Save and in footer navigation.
- [x] Added viewport-positioned onboarding toasts and clears stale step messages when navigating.
- [x] Replaced loose legal wording with strict accuracy/clarification acknowledgement.
- [x] Added Email/SMS `Reviewed / handle later` choices that count as reviewed without requiring Resend/Twilio unless setup-now is selected.
- [x] Added safe Stripe Checkout session refresh metadata without replacing webhook ownership.
- [x] Service menu uploads use private `onboarding-files` storage setup, create upload metadata, a review recommendation, and a best-effort review task; no extraction success is faked.
- [x] Customer-facing agent/agents language was replaced with CRM intelligence, AI reviews, and AI review checks while internal routes/tables remain unchanged.
- [ ] Build and local route smoke for this CRM-population pass.
- [ ] Live authenticated Stripe/webhook, provider, storage, and service-menu analysis verification.
```
