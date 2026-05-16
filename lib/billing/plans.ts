export const SELF_SERVICE_BYOK_PLANS = [
  {
    name: "Basic BYOK",
    price: "$29/mo",
    aiActions: "2,500/mo",
    emails: "1,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "500",
    agents: "0",
  },
  {
    name: "Growth BYOK",
    price: "$59/mo",
    aiActions: "10,000/mo",
    emails: "5,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "2,500",
    agents: "2",
  },
  {
    name: "Premium BYOK",
    price: "$119/mo",
    aiActions: "30,000/mo",
    emails: "15,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "10,000",
    agents: "5",
  },
];

export const MANAGED_PLANS = [
  {
    name: "Basic Managed",
    price: "$49/mo",
    aiActions: "3,000/mo",
    emails: "1,000/mo",
    sms: "100/mo",
    contacts: "500",
    agents: "1 lightweight agent",
    note: "Hard caps. No surprise overages.",
  },
  {
    name: "Growth Managed",
    price: "$99/mo",
    aiActions: "12,000/mo",
    emails: "5,000/mo",
    sms: "500/mo",
    contacts: "2,500",
    agents: "3",
    popular: true,
    note: "Hard caps. No surprise overages.",
  },
  {
    name: "Premium Managed",
    price: "$199/mo",
    aiActions: "40,000/mo",
    emails: "20,000/mo",
    sms: "1,500/mo",
    contacts: "10,000",
    agents: "8",
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
