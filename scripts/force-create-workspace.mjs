import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const USER_ID = "d2893f8a-e6db-48ef-b303-35429d1e2d6b";

async function run() {

  console.log("Creating workspace for:");
  console.log(USER_ID);

  const payload = {
    owner_id: USER_ID,

    name: "Nova Growth Systems",

    industry: "Digital Marketing",

    monthly_revenue: 42000,

    yearly_revenue: 504000,

    roi_target: "300%",

    lead_count: 184,

    open_tasks: 17,

    response_rate: 93,

    onboarding_data: {
      businessName: "Nova Growth Systems",
      industry: "Digital Marketing"
    }
  };

  const { data, error } =
    await supabase
      .from("workspaces")
      .insert(payload)
      .select();

  if (error) {
    console.log("");
    console.log("INSERT FAILED:");
    console.log(error);
    process.exit(1);
  }

  console.log("");
  console.log("WORKSPACE CREATED:");
  console.log(JSON.stringify(data, null, 2));
}

run();
