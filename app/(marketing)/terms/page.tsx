import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function TermsPage() {
  return (
    <PublicInfoPage
      eyebrow="TERMS"
      title="Usage and"
      accent="Service Terms"
      description="SynaptiReach plans use clear caps, review-gated external sends, and provider-key boundaries so teams understand what the platform does."
      cards={[
        { title: "Hard Caps", body: "Managed plans and trials use caps to prevent surprise overages." },
        { title: "BYOK Usage", body: "Bring-your-own-key customers pay provider usage directly to their connected providers." },
        { title: "Review-Gated Sends", body: "External email, SMS, and social sends should remain user-approved unless explicitly configured otherwise." },
      ]}
      ctaLabel="View Pricing"
      ctaHref="/pricing"
    />
  );
}
