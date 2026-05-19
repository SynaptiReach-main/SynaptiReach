import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function AutomationPage() {
  return (
    <PublicInfoPage
      eyebrow="AUTOMATION"
      title="Review-Gated"
      accent="Workflows"
      description="Build CRM workflows for lead follow-up, appointment reminders, campaign responses, stale deals, and task routing while keeping external sends under user control."
      cards={[
        { title: "Workflow Templates", body: "Start from practical service-business automations like missed follow-up reminders and appointment confirmation flows." },
        { title: "Agent Reviews", body: "Use AI to recommend workflows from real CRM activity, then approve before taking customer-facing action." },
        { title: "Run History", body: "Track workflow runs, outcomes, and exceptions for better operational visibility." },
      ]}
    />
  );
}
