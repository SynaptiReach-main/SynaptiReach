import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const USER_ID = "d2893f8a-e6db-48ef-b303-35429d1e2d6b";

async function run() {

  const { data, error } = await supabase
    .from("workspaces")
    .update({
      ai_personality: "Executive Strategic Operator",

      response_time: "1-5 Minutes",

      integrations: [
        "Stripe",
        "Twilio",
        "Slack",
        "Google Workspace",
        "HubSpot"
      ],

      services: [
        "CRM Setup",
        "AI Automations",
        "Lead Generation",
        "Conversion Optimization",
        "Email Marketing"
      ],

      products: [
        "Executive CRM Suite",
        "Growth Accelerator",
        "AI Revenue Engine"
      ],

      promoted_products: [
        "AI Revenue Engine"
      ],

      ai_ceo_state: {
        priorities: [
          "Increase Monthly Recurring Revenue",
          "Improve Lead Conversion",
          "Expand Enterprise Accounts",
          "Automate Client Onboarding"
        ]
      }
    })
    .eq("owner_id", USER_ID)
    .select();

  if (error) {
    console.log(error);
    return;
  }

  console.log("");
  console.log("WORKSPACE UPDATED:");
  console.log(JSON.stringify(data, null, 2));
}

run();
