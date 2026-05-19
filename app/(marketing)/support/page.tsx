import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function SupportPage() {
  return (
    <PublicInfoPage
      eyebrow="SUPPORT"
      title="Get Help With"
      accent="SynaptiReach"
      description="Use support for trial questions, onboarding, CRM setup, billing, AI providers, integrations, and campaign workflow guidance."
      cards={[
        { title: "FAQs", body: "Get help with trial access, billing status, provider setup, CRM imports, campaign setup, and workspace settings." },
        { title: "Setup Help", body: "Support can help review leads, pipeline stages, tasks, appointments, workflows, staff, and dashboard configuration." },
        { title: "Billing Help", body: "Use support for Stripe Checkout, Billing Portal, sandbox test status, trial countdowns, caps, and credit-pack questions." },
        { title: "Provider Keys Help", body: "Review setup-required states for Gemini, OpenRouter, optional OpenAI, Resend, Twilio, and Ayrshare without exposing secrets." },
        { title: "Stripe Sandbox Note", body: "Stripe test mode should be used until subscription checkout, webhooks, and billing portal flows are verified." },
        { title: "Troubleshooting", body: "Include the page, provider, error message, workspace state, and whether the issue happened during review, checkout, or send confirmation." },
      ]}
      ctaLabel="Contact Support"
      ctaHref="/contact"
      secondaryCtaLabel={null}
    />
  );
}
