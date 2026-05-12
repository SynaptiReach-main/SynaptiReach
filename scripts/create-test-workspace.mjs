import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const email = "test@synaptireach.com";
const password = "Test123456!";

async function run() {

  console.log("Creating auth user...");

  const { data: existingUsers } =
    await supabase.auth.admin.listUsers();

  let existing =
    existingUsers?.users?.find(
      (u) => u.email === email
    );

  let userId;

  if (existing) {

    console.log("User already exists.");

    userId = existing.id;

  } else {

    const { data, error } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (error) {
      console.error(error);
      process.exit(1);
    }

    userId = data.user.id;

    console.log("User created.");
  }

  console.log("Creating workspace...");

  const workspacePayload = {
    owner_id: userId,

    name: "Nova Growth Systems",

    industry: "Digital Marketing",

    monthly_revenue: 42000,

    yearly_revenue: 504000,

    customer_ltv: 3200,

    roi_target: "300%",

    lead_count: 184,

    open_tasks: 17,

    response_rate: 93,

    uploaded_knowledge_count: 4,

    csv_imported: true,

    ai_personality: "executive",

    response_time: "Quick (1–5 min)",

    integrations: [
      "twilio",
      "stripe",
      "google-calendar",
      "slack"
    ],

    services: [
      "CRM Setup",
      "AI Automations",
      "Lead Generation",
      "Pipeline Optimization"
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
      responseTime: "Quick (1–5 min)",
      services: [
        "CRM Setup",
        "AI Automations",
        "Lead Generation"
      ],
      peakMonths: [
        "March",
        "April"
      ],
      slowMonths: [
        "January"
      ],
      products: [
        "Growth Accelerator"
      ],
      promotedProducts: [
        "Growth Accelerator"
      ],
    },

    intelligence: {
      generated: true,
      system_status: "active",
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
        },
        {
          name: "Appointment Reminder",
          status: "active"
        }
      ]
    },

    ai_ceo_state: {
      mode: "executive",
      priorities: [
        "Revenue Growth",
        "Lead Conversion",
        "Pipeline Expansion"
      ]
    },

    gemini_analysis:
      "AI-generated operational workspace initialized successfully."
  };

  const { data: existingWorkspace } =
    await supabase
      .from("workspaces")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

  if (existingWorkspace) {

    console.log("Workspace already exists.");

    process.exit(0);
  }

  const { data, error } =
    await supabase
      .from("workspaces")
      .insert(workspacePayload)
      .select()
      .single();

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log("");
  console.log("====================================");
  console.log("TEST ACCOUNT READY");
  console.log("====================================");
  console.log("EMAIL:", email);
  console.log("PASSWORD:", password);
  console.log("WORKSPACE:", data.name);
  console.log("====================================");
}

run();
