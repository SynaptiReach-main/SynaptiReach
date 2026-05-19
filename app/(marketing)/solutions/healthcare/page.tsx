import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function HealthcareSolutionPage() {
  return (
    <PublicInfoPage
      eyebrow="HEALTHCARE"
      title="Patient-Aware"
      accent="CRM Workflows"
      description="Coordinate inquiry follow-up, appointment reminders, internal tasks, and communication history with careful review gates."
      cards={[
        { title: "Inquiry Tracking", body: "Keep contact source, status, notes, and tasks connected to each lead profile." },
        { title: "Appointment Reminders", body: "Use internal calendar workflows to organize reminders and follow-up recommendations." },
        { title: "Permissioned Access", body: "Prepare staff permissions and audit-friendly workflows for team operations." },
      ]}
    />
  );
}
