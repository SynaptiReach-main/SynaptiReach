import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function BlogPage() {
  return (
    <PublicInfoPage
      eyebrow="BLOG"
      title="Growth Systems"
      accent="Insights"
      description="A static educational index for CRM, AI automation, lead generation, marketing, and operations. Publication dates will be added only when articles are actually published."
      cards={[
        { title: "CRM", body: "Pipeline hygiene, task discipline, duplicate review, appointment follow-up, and how to keep real records actionable." },
        { title: "AI Automation", body: "How to use built-in intelligence and external AI providers for scoring, summaries, drafts, and recommendations without unsafe auto-send behavior." },
        { title: "Lead Generation", body: "Website, referral, paid, social, waitlist, event, and cold outreach lead sources and how to evaluate quality." },
        { title: "Marketing", body: "Email, SMS, social, landing page, segmentation, open/click interpretation, and campaign follow-up concepts." },
        { title: "Operations", body: "Staff workload, service requests, provider setup, billing caps, and workflow review processes." },
        { title: "Coming Soon", body: "Long-form guides will appear here once static articles are ready. No fake publication dates are shown." },
      ]}
      ctaLabel="Explore the Demo"
      ctaHref="/demo/dashboard"
    />
  );
}
