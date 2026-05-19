import PublicInfoPage from "@/components/sections/PublicInfoPage";

export default function SecurityPage() {
  return (
    <PublicInfoPage
      eyebrow="SECURITY"
      title="Secure CRM"
      accent="Architecture"
      description="SynaptiReach keeps privileged operations behind server-side API routes and avoids exposing internal provider secrets to browsers."
      cards={[
        { title: "Data Isolation", body: "CRM tables include workspace, company, and user fields where supported so server routes can scope data to the active workspace." },
        { title: "Service Role Server-Only", body: "Privileged Supabase operations use server-side API routes. Service-role keys must never be exposed to the browser." },
        { title: "Masked Keys", body: "Provider keys are encrypted server-side and displayed only as masked labels after save." },
        { title: "Review-Gated Sends", body: "Email, SMS, and social workflows stay draft/review/confirm before external delivery." },
        { title: "Audit Logs", body: "Sensitive settings, provider, billing, simulation, and workflow actions can be recorded for traceability." },
        { title: "Stripe Hosted Checkout", body: "Stripe handles payment collection, trials, billing portal, webhook confirmation, and card data handling." },
        { title: "Supabase Security Posture", body: "The current app uses server routes for privileged data access; future hardening should finalize RLS and workspace membership policies." },
        { title: "No Raw Secrets", body: "Secrets should stay in environment variables or encrypted server-side storage, never public JavaScript." },
      ]}
    />
  );
}
