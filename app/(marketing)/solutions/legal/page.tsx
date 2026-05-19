import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function LegalSolutionPage() {
  return (
    <PublicInfoPage
      eyebrow="LEGAL"
      title="Lead Intake"
      accent="Command Center"
      description="Organize consultations, campaign interest, follow-up tasks, and pipeline movement for service-focused legal teams."
      cards={[
        { title: "Consultation Pipeline", body: "Track new inquiries from first contact through qualified opportunity and close." },
        { title: "Follow-Up Discipline", body: "Surface overdue tasks, unanswered communications, and stale deals before they become lost opportunities." },
        { title: "Reviewable AI", body: "Draft outreach and summarize activity while keeping outbound communication under human approval." },
      ]}
    />
  );
}
