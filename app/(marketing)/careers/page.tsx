import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function CareersPage() {
  return (
    <PublicInfoPage
      eyebrow="CAREERS"
      title="Build the"
      accent="Autonomous CRM"
      description="SynaptiReach is focused on practical AI automation for service businesses. Reach out if you want to help build thoughtful CRM systems."
      cards={[
        { title: "Mission", body: "Build a safer autonomous CRM where operators can trust recommendations, review actions, and improve follow-up without losing control." },
        { title: "Roles of Interest", body: "Product engineering, growth operations, customer success, implementation support, marketing systems, and secure AI workflow design." },
        { title: "Contractors & Partners", body: "SynaptiReach may work with specialists in CRM setup, landing pages, funnel copy, local SEO, GMB, campaigns, and automation implementation." },
      ]}
      ctaLabel="Contact Us"
      ctaHref="/contact"
      secondaryCtaLabel={null}
    />
  );
}
