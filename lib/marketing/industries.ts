export type IndustrySolution = {
  slug: string;
  label: string;
  problem: string;
  useCases: string[];
  workflows: string[];
  metrics: string[];
  trialAppropriate?: boolean;
};

export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  ["agencies", "Agencies", "Client pipelines, campaign approvals, and follow-up accountability often live across too many tools."],
  ["roofing", "Roofing", "Roofing teams lose revenue when storm leads, estimates, and follow-ups are not prioritized quickly."],
  ["hvac", "HVAC", "HVAC demand is seasonal, urgent, and service-heavy, making missed calls and stale estimates costly."],
  ["legal", "Legal", "Firms need controlled intake, consultation follow-up, and review-gated communication without unsafe automation."],
  ["healthcare", "Healthcare", "Healthcare teams need careful intake, appointment intent, and operational follow-up with strict review controls."],
  ["real-estate", "Real Estate", "Agents need fast lead response, nurture, appointment tracking, and pipeline visibility."],
  ["med-spa", "Med Spa", "Med spas need consultation follow-up, promo campaigns, rebooking, and review workflows."],
  ["dental", "Dental", "Dental teams need appointment reminders, treatment follow-up, and lead conversion visibility."],
  ["home-services", "Home Services", "Service businesses need estimate follow-up, urgent lead routing, and technician task visibility."],
  ["contractors", "Contractors", "Contractors need proposal tracking, stale-deal recovery, and project inquiry follow-up."],
  ["ecommerce", "Ecommerce", "Ecommerce operators need campaign tracking, abandoned interest follow-up, and customer segmentation."],
  ["consultants", "Consultants", "Consultants need discovery call tracking, proposal follow-up, and service pipeline management."],
  ["coaches", "Coaches", "Coaches need lead nurture, booking intent, cohort tracking, and offer follow-up."],
  ["gyms-fitness", "Gyms/Fitness", "Fitness businesses need trial follow-up, class/member campaigns, and retention signals."],
  ["restaurants-local-businesses", "Restaurants/Local Businesses", "Local businesses need reputation workflows, promos, booking inquiries, and fast-response campaigns."],
  ["automotive", "Automotive", "Automotive teams need appointment intent, estimate follow-up, and service reminder campaigns."],
  ["insurance", "Insurance", "Insurance teams need quote follow-up, renewal tasks, and pipeline risk visibility."],
  ["financial-services", "Financial Services", "Financial teams need consultation intake, review-gated follow-up, and pipeline forecasting."],
  ["education-training", "Education/Training", "Training teams need cohort inquiries, enrollment follow-up, and nurture campaigns."],
  ["nonprofit", "Nonprofit", "Nonprofits need donor follow-up, event campaigns, and volunteer pipeline organization."],
  ["other-industry", "Don't See Your Industry?", "SynaptiReach can adapt CRM, AI, and marketing workflows to specialized operations."],
].map(([slug, label, problem]) => ({
  slug,
  label,
  problem,
  useCases: ["Lead and intake scoring", "Review-gated email/SMS drafts", "Campaign follow-up recommendations", "Pipeline and task visibility"],
  workflows: ["New lead follow-up", "Missed response reminder", "Appointment or consultation confirmation", "Stale opportunity recovery"],
  metrics: ["New and qualified leads", "Response time", "Pipeline value", "Open tasks", "Campaign opens/clicks", "Appointments"],
  trialAppropriate: slug !== "other-industry",
}));

export function findIndustrySolution(slug: string) {
  return INDUSTRY_SOLUTIONS.find((industry) => industry.slug === slug) || INDUSTRY_SOLUTIONS.find((industry) => industry.slug === "other-industry")!;
}
