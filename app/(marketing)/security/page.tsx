import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function SecurityPage() {
  return (
    <PublicInfoPage
      eyebrow="SECURITY"
      title="Secure CRM"
      accent="Architecture"
      description="SynaptiReach keeps privileged operations behind server-side API routes and avoids exposing internal provider secrets to browsers."
      cards={[
        { title: "Server-Side APIs", body: "Privileged Supabase, AI, and integration operations are routed through backend endpoints." },
        { title: "Scoped Records", body: "CRM data is designed to include workspace, company, and user ownership fields for isolation." },
        { title: "Audit-Ready Actions", body: "Sensitive updates can be logged for visibility across settings, imports, integrations, and workflow actions." },
      ]}
    />
  );
}
