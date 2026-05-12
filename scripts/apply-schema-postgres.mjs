import pg from "pg";
import fs from "fs";

const sql = fs.readFileSync(
  "./supabase_workspace_fields.sql",
  "utf8"
);

const client = new pg.Client({
  host: "db.qjqyxdayqzismlaxofes.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {

  console.log("CONNECTING...");

  await client.connect();

  console.log("RUNNING SCHEMA...");

  await client.query(sql);

  console.log("SUCCESS");

  await client.end();
}

run().catch((err) => {
  console.error("");
  console.error("FAILED:");
  console.error(err);
});
