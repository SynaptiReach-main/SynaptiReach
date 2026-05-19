import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function AIAgentsPage() {
  return (
    <PublicInfoPage
      eyebrow="AI AGENTS"
      title="Autonomous CRM"
      accent="Agents"
      description="Review-ready AI agents help score leads, identify follow-ups, optimize campaigns, and summarize business activity without auto-sending external messages."
      cards={[
        { title: "Lead Scoring", body: "Prioritize real contacts using engagement, recency, pipeline status, and campaign interaction data." },
        { title: "Follow-Up Review", body: "Surface stale leads, overdue tasks, and missed conversations so the team knows what to do next." },
        { title: "Executive Summary", body: "Generate a daily CRM snapshot with top risks, opportunities, and recommended actions." },
      ]}
    />
  );
}
