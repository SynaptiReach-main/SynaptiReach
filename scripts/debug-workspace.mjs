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

  console.log("");
  console.log("USER ID:");
  console.log(user.id);

  const { data: workspace, error } =
    await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", user.id);

  console.log("");
  console.log("WORKSPACE:");
  console.log(JSON.stringify(workspace, null, 2));

  if (error) {
    console.log("");
    console.log("ERROR:");
    console.log(error);
  }
}

run();
