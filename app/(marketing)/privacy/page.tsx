import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function PrivacyPage() {
  return (
    <PublicInfoPage
      eyebrow="PRIVACY"
      title="Privacy and"
      accent="Data Controls"
      description="SynaptiReach is built around server-side data access, workspace scoping, and not exposing provider secrets to the browser."
      cards={[
        { title: "Data Collected", body: "Contact details, business profile fields, CRM records, service inquiries, waitlist submissions, settings, usage events, and operational metadata may be stored to run the product." },
        { title: "CRM Data", body: "Leads, deals, conversations, tasks, appointments, campaigns, workflows, recommendations, notifications, and staff records are designed around workspace scope." },
        { title: "Provider Keys", body: "BYOK/provider keys are saved server-side, masked in the UI, and should never be exposed in public browser code." },
        { title: "Stripe & Payments", body: "Stripe hosts checkout and billing portal flows. SynaptiReach stores Stripe references and webhook-confirmed billing states, not raw card data." },
        { title: "AI Usage", body: "Built-in intelligence can run without external AI. External AI calls should use configured providers and safe metadata, not raw secrets." },
        { title: "Submissions", body: "Contact and waitlist submissions are stored so SynaptiReach can respond, manage launch cohort interest, and review requested services." },
      ]}
      ctaLabel="Contact SynaptiReach"
      ctaHref="/contact"
      secondaryCtaLabel={null}
    />
  );
}
