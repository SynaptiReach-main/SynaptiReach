import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function AboutPage() {
  return (
    <PublicInfoPage
      eyebrow="ABOUT"
      title="Built for"
      accent="Service Businesses"
      description="SynaptiReach brings CRM, marketing automation, communications, analytics, and review-gated autonomy into one operating system for service teams preparing for launch and growth."
      cards={[
        { title: "Mission", body: "Help small teams turn scattered leads, campaigns, conversations, tasks, appointments, and revenue signals into a controlled growth system." },
        { title: "Who It Serves", body: "Agencies, home services, healthcare-adjacent teams, local businesses, consultants, coaches, and operators that need follow-up discipline without enterprise complexity." },
        { title: "Review-Gated Autonomy", body: "SynaptiReach can draft, recommend, score, summarize, and queue work while keeping external sends and irreversible actions under human confirmation." },
        { title: "Launch Cohort", body: "The first launch cohort is intentionally limited so setup, provider readiness, and CRM workflows can be tested with real business needs." },
        { title: "Trust Principles", body: "Provider keys stay server-side, Stripe handles checkout, audit logs record sensitive changes, and workspace data is designed for isolation." },
        { title: "Practical Automation", body: "Automation should reduce missed follow-ups and busywork without taking unsafe action on its own." },
      ]}
      secondaryCtaLabel="Contact SynaptiReach"
    />
  );
}
