import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const email = "test@synaptireach.com";

async function run() {

  const { data: usersData } =
    await supabase.auth.admin.listUsers();

  const user =
    usersData.users.find(
      (u) => u.email === email
    );

  if (!user) {
    console.log("USER NOT FOUND");
    process.exit(1);
  }

  console.log("USER:");
  console.log(user.id);

  const { data: existing } =
    await supabase
      .from("workspaces")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

  if (existing) {

    console.log("Workspace already exists.");
    process.exit(0);
  }

  const payload = {

    owner_id: user.id,

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
      industry: "Digital Marketing",
      aiPersonality: "Executive",
      services: [
        "CRM Setup",
        "Lead Generation",
        "AI Automations"
      ]
    }

  };

  const { data, error } =
    await supabase
      .from("workspaces")
      .insert(payload)
      .select()
      .single();

  if (error) {
    console.log(error);
    process.exit(1);
  }

  console.log("");
  console.log("==========================");
  console.log("WORKSPACE CREATED");
  console.log("==========================");
  console.log(data);
}

run();
