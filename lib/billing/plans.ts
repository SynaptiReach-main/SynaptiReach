export type BillingMode = "byok" | "managed";

export type SynaptiReachPlan = {
  slug: string;
  name: string;
  tier: "basic" | "growth" | "premium";
  billingMode: BillingMode;
  price: string;
  monthlyPriceCents: number;
  stripePriceEnv: string;
  aiActions: string;
  emails: string;
  sms: string;
  contacts: string;
  agents: string;
  workflowRuns: string;
  overCapBehavior: string;
  creditPacksAllowed: boolean;
  managedKeysIncluded: boolean;
  byokProviderCostsCustomerResponsibility: boolean;
  note?: string;
  popular?: boolean;
};

export const SELF_SERVICE_BYOK_PLANS: SynaptiReachPlan[] = [
  {
    slug: "basic-byok",
    name: "Basic BYOK",
    tier: "basic",
    billingMode: "byok",
    price: "$29/mo",
    monthlyPriceCents: 2900,
    stripePriceEnv: "STRIPE_PRICE_BASIC_BYOK",
    aiActions: "2,500/mo",
    emails: "1,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "500",
    agents: "0",
    workflowRuns: "250/mo",
    overCapBehavior: "Hard cap until upgrade or eligible credit pack.",
    creditPacksAllowed: true,
    managedKeysIncluded: false,
    byokProviderCostsCustomerResponsibility: true,
  },
  {
    slug: "growth-byok",
    name: "Growth BYOK",
    tier: "growth",
    billingMode: "byok",
    price: "$59/mo",
    monthlyPriceCents: 5900,
    stripePriceEnv: "STRIPE_PRICE_GROWTH_BYOK",
    aiActions: "10,000/mo",
    emails: "5,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "2,500",
    agents: "2",
    workflowRuns: "1,500/mo",
    overCapBehavior: "Hard cap until upgrade or eligible credit pack.",
    creditPacksAllowed: true,
    managedKeysIncluded: false,
    byokProviderCostsCustomerResponsibility: true,
  },
  {
    slug: "premium-byok",
    name: "Premium BYOK",
    tier: "premium",
    billingMode: "byok",
    price: "$119/mo",
    monthlyPriceCents: 11900,
    stripePriceEnv: "STRIPE_PRICE_PREMIUM_BYOK",
    aiActions: "30,000/mo",
    emails: "15,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "10,000",
    agents: "5",
    workflowRuns: "5,000/mo",
    overCapBehavior: "Hard cap until upgrade or eligible credit pack.",
    creditPacksAllowed: true,
    managedKeysIncluded: false,
    byokProviderCostsCustomerResponsibility: true,
  },
];

export const MANAGED_PLANS: SynaptiReachPlan[] = [
  {
    slug: "basic-managed",
    name: "Basic Managed",
    tier: "basic",
    billingMode: "managed",
    price: "$49/mo",
    monthlyPriceCents: 4900,
    stripePriceEnv: "STRIPE_PRICE_BASIC_MANAGED",
    aiActions: "3,000/mo",
    emails: "1,000/mo",
    sms: "100/mo",
    contacts: "500",
    agents: "1 lightweight agent",
    workflowRuns: "500/mo",
    overCapBehavior: "Hard cap until credit pack or upgrade.",
    creditPacksAllowed: true,
    managedKeysIncluded: true,
    byokProviderCostsCustomerResponsibility: false,
    note: "Hard caps. No surprise overages.",
  },
  {
    slug: "growth-managed",
    name: "Growth Managed",
    tier: "growth",
    billingMode: "managed",
    price: "$99/mo",
    monthlyPriceCents: 9900,
    stripePriceEnv: "STRIPE_PRICE_GROWTH_MANAGED",
    aiActions: "12,000/mo",
    emails: "5,000/mo",
    sms: "500/mo",
    contacts: "2,500",
    agents: "3",
    workflowRuns: "2,500/mo",
    overCapBehavior: "Hard cap until credit pack or upgrade.",
    creditPacksAllowed: true,
    managedKeysIncluded: true,
    byokProviderCostsCustomerResponsibility: false,
    popular: true,
    note: "Hard caps. No surprise overages.",
  },
  {
    slug: "premium-managed",
    name: "Premium Managed",
    tier: "premium",
    billingMode: "managed",
    price: "$199/mo",
    monthlyPriceCents: 19900,
    stripePriceEnv: "STRIPE_PRICE_PREMIUM_MANAGED",
    aiActions: "40,000/mo",
    emails: "20,000/mo",
    sms: "1,500/mo",
    contacts: "10,000",
    agents: "8",
    workflowRuns: "10,000/mo",
    overCapBehavior: "Hard cap until credit pack or upgrade.",
    creditPacksAllowed: true,
    managedKeysIncluded: true,
    byokProviderCostsCustomerResponsibility: false,
    note: "Hard caps. No surprise overages.",
  },
];

export const CREDIT_PACKS = [
  "AI Pack Small: 5,000 AI actions for $19",
  "AI Pack Growth: 20,000 AI actions for $59",
  "Email Pack: 5,000 emails for $25",
  "SMS Pack Small: 250 SMS for $19",
  "SMS Pack Growth: 1,000 SMS for $69",
  "Contact Pack: +5,000 contacts for $29/mo",
];

export const MANAGED_TRIAL_CAPS = {
  aiActions: 300,
  emails: 250,
  sms: 0,
  approvedSms: 25,
  contacts: 250,
  activeWorkflows: 10,
  agentRuns: 25,
  staff: 2,
  campaignDrafts: 5,
  csvImports: 1,
  onboardingFiles: 10,
  onboardingFileStorageMb: 25,
};

export const TRIAL_PATHS = [
  {
    id: "managed",
    name: "SynaptiReach-Managed Trial",
    description: "Full software access for 14 days with hard free caps for SynaptiReach-managed AI, email, SMS, contacts, workflows, and agents.",
    cardRequired: true,
    managedCreditExposure: true,
    providerCostResponsibility: "SynaptiReach-managed usage stays inside hard trial caps. Credit packs or paid capacity are required after a cap is reached.",
  },
  {
    id: "byok",
    name: "BYOK Trial",
    description: "Full software access for 14 days while the customer connects their own AI, email, SMS, and social providers where needed.",
    cardRequired: true,
    managedCreditExposure: false,
    providerCostResponsibility: "Customer pays Gemini/OpenAI/OpenRouter, Resend, Twilio, Ayrshare, or other provider usage directly.",
  },
];

export const BYOK_TRIAL_NOTES = [
  "Connect your own Gemini, OpenAI, OpenRouter, Resend, Twilio, and Ayrshare accounts as needed.",
  "You pay provider usage directly to those providers.",
  "SynaptiReach does not expose managed AI, email, or SMS credit during BYOK trial.",
];

export const DFY_ASSISTANCE_OPTIONS = [
  { id: "guided_call", name: "Guided Setup Call", price: "Free 30 minutes", paid: false },
  { id: "extended_support", name: "Extended Setup Support", price: "$99/hour", paid: true },
  { id: "provider_setup", name: "Provider Setup Assistance", price: "$149", paid: true },
  { id: "crm_import_cleanup", name: "CRM Import + Cleanup", price: "$199", paid: true },
  { id: "campaign_setup", name: "Campaign Setup Assistance", price: "$249", paid: true },
  { id: "workflow_setup", name: "Workflow Setup Assistance", price: "$249", paid: true },
  { id: "full_onboarding", name: "Full Onboarding Setup", price: "$599", paid: true },
  { id: "premium_launch", name: "Premium Launch Setup", price: "$999+", paid: true },
];

export const DFY_PLANS = [
  {
    name: "Guided Setup Call",
    price: "Free 30 minutes",
    features: ["You perform the setup with SynaptiReach guidance", "Screen-share walkthrough", "Trial path and provider setup questions", "No payment or checkout created"],
  },
  {
    name: "Launch Setup Help",
    price: "$99-$249",
    popular: true,
    features: ["Extended Setup Support: $99/hour", "Provider Setup Assistance: $149", "CRM Import + Cleanup: $199", "Campaign or Workflow Setup: $249"],
  },
  {
    name: "Full Onboarding Setup",
    price: "$599-$999+",
    features: ["Full Onboarding Setup: $599", "Premium Launch Setup: $999+", "Paid only when SynaptiReach performs setup for you", "Consultation required before fulfillment or checkout"],
  },
];

export const TRIAL_PLANS = [
  {
    name: "SynaptiReach-Managed Trial",
    aiActions: `${MANAGED_TRIAL_CAPS.aiActions}`,
    emails: `${MANAGED_TRIAL_CAPS.emails}`,
    sms: "0 managed SMS until Twilio/carrier approval",
    contacts: `${MANAGED_TRIAL_CAPS.contacts}`,
    agents: `${MANAGED_TRIAL_CAPS.agentRuns} agent runs`,
    workflowRuns: `${MANAGED_TRIAL_CAPS.activeWorkflows} active workflows`,
    available: true,
    popular: true,
  },
  {
    name: "BYOK Trial",
    aiActions: "Customer provider account",
    emails: "Customer provider account",
    sms: "Customer Twilio account",
    contacts: "250 during trial",
    agents: "1 lightweight preview agent",
    workflowRuns: "Selected plan limit",
    available: true,
  },
];

export const COMMITMENT_DISCOUNTS = [
  { duration: "3 months", discount: "10%" },
  { duration: "6 months", discount: "20%" },
  { duration: "9 months", discount: "25%" },
  { duration: "12 months", discount: "30%" },
];

export const SUBSCRIPTION_PLANS = [...SELF_SERVICE_BYOK_PLANS, ...MANAGED_PLANS];

export function getSubscriptionPlan(slugOrName: string | null | undefined) {
  if (!slugOrName) return null;
  const normalized = slugOrName.toLowerCase();
  return SUBSCRIPTION_PLANS.find((plan) => plan.slug === normalized || plan.name.toLowerCase() === normalized) || null;
}

export function getPlanPriceId(plan: SynaptiReachPlan) {
  return process.env[plan.stripePriceEnv] || "";
}
