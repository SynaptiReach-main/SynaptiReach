import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function CareersPage() {
  return (
    <PublicInfoPage
      eyebrow="CAREERS"
      title="Build the"
      accent="Autonomous CRM"
      description="SynaptiReach is focused on practical AI automation for service businesses. Reach out if you want to help build thoughtful CRM systems."
      cards={[
        { title: "Product Engineering", body: "Design real-data workflows, dashboards, and secure server-side AI features." },
        { title: "Growth Operations", body: "Help service businesses turn CRM data into repeatable execution systems." },
        { title: "Customer Success", body: "Support onboarding, workflows, campaign setup, and practical automation outcomes." },
      ]}
      ctaLabel="Contact Us"
      ctaHref="/contact"
    />
  );
}
