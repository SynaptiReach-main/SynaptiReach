import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const sqlPath = path.join(process.cwd(), "supabase", "user_crm_complete_schema.sql");
const connectionString =
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  console.error(
    "Missing database connection string. Set SUPABASE_DB_URL, DATABASE_URL, or POSTGRES_URL."
  );
  process.exit(1);
}

const sqlText = fs.readFileSync(sqlPath, "utf8");
const db = postgres(connectionString, {
  max: 1,
  ssl: "require",
});

try {
  await db.unsafe(sqlText);
  console.log("SynaptiReach User CRM schema applied successfully.");
} finally {
  await db.end();
}
