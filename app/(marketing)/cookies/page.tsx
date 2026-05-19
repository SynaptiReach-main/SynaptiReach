import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function CookiesPage() {
  return (
    <PublicInfoPage
      eyebrow="COOKIES"
      title="Cookie and"
      accent="Session Notice"
      description="SynaptiReach may use essential cookies and session storage to support authentication, navigation, preferences, and secure CRM access."
      cards={[
        { title: "Essential Sessions", body: "Authentication and workspace access depend on secure session handling." },
        { title: "Preference Storage", body: "UI preferences such as sidebar state can be stored locally for a better product experience." },
        { title: "No Secret Exposure", body: "Provider API keys and internal credentials should never be stored in browser-visible public variables." },
      ]}
      ctaLabel="Contact Us"
      ctaHref="/contact"
    />
  );
}
