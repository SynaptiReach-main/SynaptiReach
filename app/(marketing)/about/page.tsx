import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function AboutPage() {
  return (
    <PublicInfoPage
      eyebrow="ABOUT"
      title="Built for"
      accent="Service Businesses"
      description="SynaptiReach brings CRM, marketing automation, communications, analytics, and AI agents into one operating system for growth teams."
      cards={[
        { title: "Practical Automation", body: "Automation should reduce missed follow-ups and busywork without taking unsafe action on its own." },
        { title: "Real Data First", body: "The CRM is designed around real leads, campaigns, conversations, tasks, deals, and appointments." },
        { title: "User Control", body: "AI recommendations are reviewable, provider keys stay server-side, and external sends remain gated." },
      ]}
    />
  );
}
