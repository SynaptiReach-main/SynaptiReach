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
    return;
  }

  console.log("");
  console.log("USER:");
  console.log(user.id);

  const { data } =
    await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", user.id);

  console.log("");
  console.log("WORKSPACES:");
  console.log(JSON.stringify(data, null, 2));
}

run();
