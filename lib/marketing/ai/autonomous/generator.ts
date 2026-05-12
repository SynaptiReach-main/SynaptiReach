import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function determineAudience(
  leads: any[]
) {
  const qualified =
    leads.filter(
      (lead) =>
        lead.status ===
        "qualified"
    );

  const cold =
    leads.filter(
      (lead) =>
        lead.status ===
        "cold"
    );

  const converted =
    leads.filter(
      (lead) =>
        lead.status ===
        "converted"
    );

  if (
    qualified.length >
    cold.length
  ) {
    return "qualified";
  }

  if (
    cold.length >
    converted.length
  ) {
    return "cold";
  }

  return "converted";
}

function generateSubject(
  audience: string
) {
  if (
    audience ===
    "qualified"
  ) {
    return "Ready to scale faster?";
  }

  if (
    audience === "cold"
  ) {
    return "Still exploring solutions?";
  }

  return "Exclusive upgrade opportunity";
}

function generateBody(
  audience: string
) {
  if (
    audience ===
    "qualified"
  ) {
    return `
Your business is showing strong growth potential.

Our AI systems identified opportunities to increase conversion rates, automate workflows, and improve revenue efficiency.

Book your strategy session today.
`;
  }

  if (
    audience === "cold"
  ) {
    return `
We noticed you showed interest earlier.

Here’s how companies are using SynaptiReach AI systems to automate outreach and increase customer engagement.
`;
  }

  return `
Thank you for being a customer.

We generated personalized growth recommendations specifically for your business profile.
`;
}

export async function generateAutonomousCampaign() {
  const {
    data: leads,
  } = await supabase
    .from("leads")
    .select("*");

  const audience =
    determineAudience(
      leads || []
    );

  const subject =
    generateSubject(
      audience
    );

  const body =
    generateBody(
      audience
    );

  const {
    data: campaign,
  } = await supabase
    .from(
      "marketing_campaigns"
    )
    .insert({
      name:
        `AI Campaign - ${new Date().toLocaleDateString()}`,
      type: "email",
      audience,
      subject,
      body,
      status: "draft",
      ai_generated: true,
    })
    .select()
    .single();

  await supabase
    .from(
      "marketing_activity"
    )
    .insert({
      title:
        "AI Campaign Generated",
      description:
        `AI generated campaign targeting ${audience} leads.`,
    });

  return campaign;
}
