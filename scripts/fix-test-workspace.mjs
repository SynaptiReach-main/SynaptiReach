import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const email = "test@synaptireach.com";

async function run() {

  const { data: users } =
    await supabase.auth.admin.listUsers();

  const user =
    users.users.find(
      (u) => u.email === email
    );

  if (!user) {
    console.log("USER NOT FOUND");
    return;
  }

  console.log("Creating workspace for:");
  console.log(user.id);

  await supabase
    .from("workspaces")
    .delete()
    .eq("owner_id", user.id);

  const payload = {

    owner_id: user.id,

    name: "Nova Growth Systems",

    industry: "Digital Marketing",

    monthly_revenue: 42000,

    yearly_revenue: 504000,

    customer_ltv: 3200,

    roi_target: "300%",

    lead_count: 184,

    open_tasks: 17,

    response_rate: 93,

    ai_personality: "executive",

    response_time: "Quick (1–5 min)",

    integrations: [
      "twilio",
      "stripe",
      "slack"
    ],

    services: [
      "CRM Setup",
      "AI Automations",
      "Lead Generation"
    ],

    peak_months: [
      "March",
      "April",
      "September"
    ],

    slow_months: [
      "January",
      "July"
    ],

    products: [
      "Growth Accelerator",
      "Executive CRM Suite"
    ],

    promoted_products: [
      "Executive CRM Suite"
    ],

    onboarding_data: {
      businessName: "Nova Growth Systems",
      industry: "Digital Marketing",
      aiPersonality: "executive",
    },

    intelligence: {
      generated: true,
      ai_ready: true,
      crm_ready: true,
    },

    pipeline_state: {
      stages: [
        "Lead Captured",
        "Qualified",
        "Proposal Sent",
        "Negotiation",
        "Closed Won"
      ]
    },

    automation_state: {
      automations: [
        {
          name: "Lead Followup",
          status: "active"
        }
      ]
    },

    ai_ceo_state: {
      priorities: [
        "Revenue Growth",
        "Lead Conversion",
        "Pipeline Expansion"
      ]
    },

    gemini_analysis:
      "AI-generated operational workspace initialized successfully."
  };

  const { data, error } =
    await supabase
      .from("workspaces")
      .insert(payload)
      .select()
      .single();

  if (error) {
    console.log(error);
    return;
  }

  console.log("");
  console.log("================================");
  console.log("WORKSPACE CREATED");
  console.log("================================");
  console.log(data.name);
  console.log("================================");
}

run();
