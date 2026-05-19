import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function PrivacyPage() {
  return (
    <PublicInfoPage
      eyebrow="PRIVACY"
      title="Privacy and"
      accent="Data Controls"
      description="SynaptiReach is built around server-side data access, workspace scoping, and not exposing provider secrets to the browser."
      cards={[
        { title: "Workspace Data", body: "CRM records are intended to be scoped to the authenticated user, workspace, or company context." },
        { title: "Provider Keys", body: "AI and integration keys are handled server-side and should never be exposed in public client code." },
        { title: "Operational Logs", body: "Sensitive changes can be tracked through audit and activity records where enabled." },
      ]}
      ctaLabel="Ask a Privacy Question"
      ctaHref="/contact"
    />
  );
}
