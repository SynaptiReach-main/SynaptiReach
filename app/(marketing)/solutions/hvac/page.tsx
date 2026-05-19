import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function HvacSolutionPage() {
  return (
    <PublicInfoPage
      eyebrow="HVAC"
      title="HVAC Lead"
      accent="Follow-Up"
      description="Capture service inquiries, prioritize hot leads, manage appointments, and keep follow-ups from slipping through the cracks."
      cards={[
        { title: "Seasonal Campaigns", body: "Schedule maintenance, tune-up, and replacement campaigns across email, SMS, and social channels." },
        { title: "Appointment Visibility", body: "Track upcoming appointments, no-shows, and follow-up tasks from the CRM calendar." },
        { title: "High-Intent Alerts", body: "Flag contacts who request pricing, respond to campaigns, or show conversion intent." },
      ]}
    />
  );
}
