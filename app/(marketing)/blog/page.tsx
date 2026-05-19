import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function BlogPage() {
  return (
    <PublicInfoPage
      eyebrow="BLOG"
      title="Growth Systems"
      accent="Insights"
      description="Guides and operating notes for CRM automation, lead follow-up, campaign strategy, and AI-assisted service business growth."
      cards={[
        { title: "CRM Operations", body: "Frameworks for pipeline hygiene, task discipline, and follow-up systems." },
        { title: "Campaign Strategy", body: "Ideas for email, SMS, social, and landing page campaigns that remain measurable." },
        { title: "AI Workflows", body: "Ways to use AI safely for recommendations, summaries, drafts, and operational reviews." },
      ]}
      ctaLabel="Explore the Demo"
      ctaHref="/demo/dashboard"
    />
  );
}
