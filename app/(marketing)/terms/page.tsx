import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function TermsPage() {
  return (
    <PublicInfoPage
      eyebrow="TERMS"
      title="Usage and"
      accent="Service Terms"
      description="SynaptiReach plans use clear caps, review-gated external sends, and provider-key boundaries so teams understand what the platform does."
      cards={[
        { title: "SaaS Access", body: "Access depends on account status, workspace setup, plan selection, provider readiness, and applicable usage caps." },
        { title: "Review-Gated Automation", body: "The system may draft, recommend, queue, or prepare actions, but external sends and irreversible actions require user confirmation." },
        { title: "BYOK Responsibility", body: "Bring-your-own-key customers are responsible for provider accounts, usage costs, sender reputation, deliverability, and provider terms." },
        { title: "Managed Credits & Caps", body: "SynaptiReach-managed plans use included credits and hard caps. Credit packs or upgrades may be required after caps are reached." },
        { title: "Payment & Trial Terms", body: "A paid subscription starts only after Stripe Checkout. After the 14-day trial, the selected plan renews automatically unless canceled before trial end." },
        { title: "External Provider Limits", body: "Stripe, Supabase, Resend, Twilio, Ayrshare, AI providers, and other services may have independent outages, limits, pricing, or compliance requirements." },
      ]}
      ctaLabel="View Pricing"
      ctaHref="/pricing"
    />
  );
}
