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

export const DFY_PLANS = [
  {
    name: "DFY Starter Setup",
    price: "$799 setup + $149/mo managed platform",
    features: ["CRM setup", "Lead pipeline", "Basic email campaign", "Basic automation", "5,000 AI actions/mo", "2 AI agents", "1 setup call"],
  },
  {
    name: "DFY Growth Setup",
    price: "$1,499 setup + $299/mo managed platform",
    popular: true,
    features: ["Full funnel build", "CRM + segmentation", "Email + SMS sequence setup", "Workflow setup", "20,000 AI actions/mo", "5 AI agents", "Monthly strategy call"],
  },
  {
    name: "DFY Premium Setup",
    price: "$2,999 setup + $599/mo managed platform",
    features: ["Full business system", "Branding + strategy", "Advanced AI agents", "Advanced automation", "Campaign tracking", "60,000 AI actions/mo", "10 AI agents", "Priority support/account management"],
  },
];

export const TRIAL_PLANS = [
  {
    name: "Basic Trial",
    aiActions: "100",
    emails: "100",
    sms: "0 managed SMS",
    contacts: "100",
    agents: "0",
    available: true,
  },
  {
    name: "Growth Trial",
    aiActions: "250",
    emails: "250",
    sms: "0 managed SMS",
    contacts: "250",
    agents: "1 lightweight preview agent",
    available: true,
    popular: true,
  },
  {
    name: "Premium Trial",
    aiActions: "Contact approval",
    emails: "Contact approval",
    sms: "0 managed SMS",
    contacts: "Contact approval",
    agents: "Locked",
    available: false,
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
