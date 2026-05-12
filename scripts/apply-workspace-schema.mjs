import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

async function run() {

  const sql =
    fs.readFileSync(
      "./supabase_workspace_fields.sql",
      "utf8"
    );

  const statements =
    sql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

  for (const statement of statements) {

    console.log("");
    console.log("RUNNING:");
    console.log(statement);

    const { error } =
      await supabase.rpc(
        "exec_sql",
        {
          sql_query: statement
        }
      );

    if (error) {
      console.log("");
      console.log("FAILED:");
      console.log(error);
    } else {
      console.log("SUCCESS");
    }
  }

  console.log("");
  console.log("SCHEMA PATCH COMPLETE");
}

run();
