import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function AIAgentsPage() {
  return (
    <PublicInfoPage
      eyebrow="CRM INTELLIGENCE"
      title="AI Automation"
      accent="Reviews"
      description="Review-ready CRM intelligence scores, summarizes, drafts, optimizes, and recommends next actions while keeping external sends and payments under explicit human confirmation."
      cards={[
        { title: "Lead Scoring Review", body: "Scores lead fit, intent, engagement, freshness, source quality, and conversion readiness." },
        { title: "Follow-Up Review", body: "Finds stale leads, unread replies, overdue tasks, and missed follow-up windows." },
        { title: "Executive Summary", body: "Summarizes business health, risks, opportunities, pipeline movement, and daily focus areas." },
        { title: "Campaign Optimization", body: "Interprets opens, clicks, conversions, audience fatigue, and underperforming campaigns." },
        { title: "Workflow Review", body: "Suggests review-gated workflow templates, flags failures, and prioritizes approval queues." },
        { title: "Task Recommendations", body: "Ranks today's work, suggests due dates and owners, and can convert approved recommendations into task drafts." },
        { title: "Appointment Intent", body: "Detects booking signals, no-show risk, reminder needs, and pre-call prep items." },
        { title: "Conversation Drafting", body: "Creates safe email/SMS draft options for follow-up, objections, booking, offers, and nurture." },
        { title: "Pipeline Risk Review", body: "Flags stale high-value deals, close-date risk, bottlenecks, revenue at risk, and next best deal actions." },
        { title: "Billing/Usage Watcher", body: "Reviews trial countdowns, caps, usage pace, credit-pack needs, BYOK readiness, and upgrade recommendations." },
        { title: "Provider Fallback", body: "Built-in intelligence runs first. Gemini, OpenRouter, and optional OpenAI can enhance outputs only when configured and allowed." },
        { title: "Review-Gated Examples", body: "Examples include create task draft, draft message, create workflow draft, review campaign, flag risk, or open related record." },
      ]}
      secondaryCtaLabel="Contact SynaptiReach"
    />
  );
}
