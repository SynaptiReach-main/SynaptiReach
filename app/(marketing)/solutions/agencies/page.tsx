import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function AgenciesSolutionPage() {
  return (
    <PublicInfoPage
      eyebrow="AGENCIES"
      title="Client Growth"
      accent="Operating System"
      description="Coordinate leads, campaigns, follow-ups, tasks, and reporting across client accounts with reviewable AI support."
      cards={[
        { title: "Client Pipelines", body: "Keep lead and deal stages visible so every account has a clear next action." },
        { title: "Campaign Control", body: "Plan email, SMS, and social campaigns with AI generation and scheduling safeguards." },
        { title: "Reporting Rhythm", body: "Bring real CRM activity, campaign outcomes, and workflow status into client conversations." },
      ]}
    />
  );
}
