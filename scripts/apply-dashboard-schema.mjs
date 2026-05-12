import fs from "fs";
import postgres from "postgres";

const sql = postgres(
  process.env.POSTGRES_URL_NON_POOLING,
  {
    ssl: "require",
  }
);

const schema = fs.readFileSync(
  "./scripts/migrations/dashboard-live-schema.sql",
  "utf8"
);

console.log("APPLYING DASHBOARD LIVE SCHEMA...");

await sql.unsafe(schema);

console.log("SUCCESS");
process.exit(0);
