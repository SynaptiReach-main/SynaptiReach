import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function AnalyticsPage() {
  return (
    <PublicInfoPage
      eyebrow="ANALYTICS"
      title="CRM Metrics"
      accent="That Explain Action"
      description="SynaptiReach analytics are designed to explain what is happening across CRM, campaigns, communications, pipeline, tasks, appointments, workflows, intelligence, and billing usage without inventing unsupported claims."
      cards={[
        { title: "Lead Metrics", body: "Track total leads, new leads, qualified leads, converted leads, source mix, status distribution, lead scores, and response timing." },
        { title: "Campaign Metrics", body: "Track scheduled, active, canceled, delivered, opened, clicked, converted, failed, and underperforming campaign activity." },
        { title: "Communications", body: "Review inbound/outbound email, SMS, notes, unread replies, failed messages, conversation status, and response urgency." },
        { title: "Pipeline", body: "Monitor pipeline value, weighted value, open deals, won/lost deals, stale deals, close dates, and deal health." },
        { title: "Tasks & Appointments", body: "Measure open, overdue, high-priority, completed, upcoming, no-show, canceled, and appointment-intent signals." },
        { title: "Workflows", body: "Track active workflows, paused workflows, workflow runs, failures, live signals, and approval queues." },
        { title: "Intelligence", body: "Surface built-in recommendations, AI review checks, pending actions, confidence, related records, and review-gated next steps." },
        { title: "Billing & Usage", body: "Show trial status, usage used versus caps, provider readiness, credit-pack history, and billing events where configured." },
        { title: "Dashboards & Detail Modals", body: "Dashboard cards and modal details use real records when available and should show clean loading, empty, and error states." },
      ]}
      ctaLabel="View Demo Analytics"
      ctaHref="/demo/dashboard"
      secondaryCtaLabel="Contact SynaptiReach"
    />
  );
}
