import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function RoofingSolutionPage() {
  return (
    <PublicInfoPage
      eyebrow="ROOFING"
      title="Roofing Pipeline"
      accent="Automation"
      description="Manage inspection requests, storm follow-ups, estimate pipelines, and campaign responses from one AI-assisted CRM."
      cards={[
        { title: "Estimate Pipeline", body: "Move opportunities through qualified, proposal, negotiation, won, and lost stages." },
        { title: "Storm Follow-Up", body: "Create review-gated campaigns and reminders for urgent local demand." },
        { title: "Lead Import", body: "Import contact lists and keep scoring, notes, tasks, and campaign interactions organized." },
      ]}
    />
  );
}
