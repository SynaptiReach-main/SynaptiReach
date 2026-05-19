export type ServiceCatalogItem = {
  serviceType: "service" | "bundle" | "retainer";
  category: string;
  itemName: string;
  priceCents: number;
  priceLabel: string;
  recurring: boolean;
  consultationRequired: boolean;
  description?: string;
  popular?: boolean;
  includes?: string[];
};

export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  ...[
    ["Marketing Services", "Execution", "Email Campaign", 14900],
    ["Marketing Services", "Execution", "SMS Campaign", 17900],
    ["Marketing Services", "Execution", "Landing Page", 39900],
    ["Marketing Services", "Execution", "Workflow Setup", 24900],
    ["Marketing Services", "Execution", "CRM Setup", 39900],
    ["Marketing Services", "Strategy", "Offer Optimization", 24900],
    ["Marketing Services", "Strategy", "Funnel Copywriting", 39900],
    ["Marketing Services", "Strategy", "Lead Magnet Creation", 29900],
    ["Marketing Services", "Strategy", "A/B Testing", 24900],
    ["Marketing Services", "Strategy", "Conversion Audit", 29900],
    ["Marketing Services", "Advanced", "Customer Journey Mapping", 49900],
    ["Marketing Services", "Advanced", "Segmentation Strategy", 39900],
    ["Marketing Services", "Advanced", "Retargeting Setup", 49900],
    ["AI Services", "AI Execution", "AI Campaign Strategy", 39900],
    ["AI Services", "AI Execution", "AI Persona Modeling", 34900],
    ["AI Services", "AI Execution", "AI Funnel Optimization", 49900],
    ["Branding & SEO", "Brand Growth", "Logo Design", 24900],
    ["Branding & SEO", "Brand Growth", "Branding Kit", 59900],
    ["Branding & SEO", "Brand Growth", "SEO Optimization", 49900],
    ["Branding & SEO", "Brand Growth", "Local SEO", 39900],
    ["Social & GMB", "Local Presence", "Social Media Management", 59900, true],
    ["Social & GMB", "Local Presence", "Content Calendar", 24900],
    ["Social & GMB", "Local Presence", "GMB Optimization", 29900],
    ["Social & GMB", "Local Presence", "GMB Monthly Management", 29900, true],
  ].map(([group, category, itemName, priceCents, recurring]) => ({
    serviceType: "service" as const,
    category: `${group} / ${category}`,
    itemName: String(itemName),
    priceCents: Number(priceCents),
    priceLabel: `$${Number(priceCents) / 100}${recurring ? "/mo" : ""}`,
    recurring: Boolean(recurring),
    consultationRequired: true,
  })),
  {
    serviceType: "bundle",
    category: "Service Bundles",
    itemName: "Launch System",
    priceCents: 59900,
    priceLabel: "$599",
    recurring: false,
    consultationRequired: true,
    description: "Best for launching fast",
    includes: ["Landing Page", "Email Campaign", "Workflow Setup", "Basic CRM Setup", "Best for launching fast"],
  },
  {
    serviceType: "bundle",
    category: "Service Bundles",
    itemName: "Growth Engine",
    priceCents: 99900,
    priceLabel: "$999",
    recurring: false,
    consultationRequired: true,
    popular: true,
    includes: ["Funnel Copywriting", "Email Sequence", "CRM Setup", "Segmentation Strategy", "Lead Magnet"],
  },
  {
    serviceType: "bundle",
    category: "Service Bundles",
    itemName: "Automation System",
    priceCents: 149900,
    priceLabel: "$1,499",
    recurring: false,
    consultationRequired: true,
    includes: ["Lead Nurturing Workflow", "Advanced Automation", "A/B Testing", "Dashboard Setup", "SMS Campaign"],
  },
  {
    serviceType: "bundle",
    category: "Service Bundles",
    itemName: "Authority Builder",
    priceCents: 179900,
    priceLabel: "$1,799",
    recurring: false,
    consultationRequired: true,
    includes: ["Branding Kit", "SEO Optimization", "Local SEO", "GMB Optimization", "Offer Optimization"],
  },
  {
    serviceType: "bundle",
    category: "Service Bundles",
    itemName: "Conversion Engine",
    priceCents: 249900,
    priceLabel: "$2,499",
    recurring: false,
    consultationRequired: true,
    includes: ["Funnel Strategy", "Funnel Copywriting", "Lead Magnet Creation", "AI Campaign Strategy", "Customer Journey Mapping", "Segmentation Strategy"],
  },
  {
    serviceType: "bundle",
    category: "Service Bundles",
    itemName: "Full Business System",
    priceCents: 499900,
    priceLabel: "$4,999",
    recurring: false,
    consultationRequired: true,
    includes: ["Full system setup", "CRM Setup", "Automation System", "Branding Kit", "SEO/GMB", "AI Funnel Optimization", "Campaign Strategy", "30-day implementation support"],
  },
  ...[
    ["Growth Ops", 59900],
    ["Scale Ops", 99900],
    ["Elite Ops", 199900],
  ].map(([itemName, priceCents]) => ({
    serviceType: "retainer" as const,
    category: "Recurring Service Retainers",
    itemName: String(itemName),
    priceCents: Number(priceCents),
    priceLabel: `$${Number(priceCents) / 100}/mo`,
    recurring: true,
    consultationRequired: true,
  })),
];

export function findServiceCatalogItem(itemName: string | null | undefined) {
  if (!itemName) return null;
  return SERVICE_CATALOG.find((item) => item.itemName.toLowerCase() === itemName.toLowerCase()) || null;
}
