import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function SupportPage() {
  return (
    <PublicInfoPage
      eyebrow="SUPPORT"
      title="Get Help With"
      accent="SynaptiReach"
      description="Use support for trial questions, onboarding, CRM setup, billing, AI providers, integrations, and campaign workflow guidance."
      cards={[
        { title: "Trial Help", body: "Understand 14-day trial caps, BYOK setup, managed plans, and upgrade options." },
        { title: "CRM Setup", body: "Get guidance on leads, pipeline, tasks, appointments, campaigns, workflows, and settings." },
        { title: "Integrations", body: "Review Supabase, Gemini, OpenRouter, Resend, Twilio, Ayrshare, and billing setup requirements." },
      ]}
      ctaLabel="Contact Support"
      ctaHref="/contact"
    />
  );
}
