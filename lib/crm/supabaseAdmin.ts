import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export function friendlySupabaseError(error: any) {
  const message = error?.message || "Database request failed.";

  if (
    message.includes("does not exist") ||
    message.includes("Could not find the table") ||
    error?.code === "42P01" ||
    error?.code === "42703"
  ) {
    return {
      missingSchema: true,
      message:
        "Required CRM schema is missing. Run supabase/user_crm_full_completion_schema.sql in the Supabase SQL Editor, then retry.",
    };
  }

  return {
    missingSchema: false,
    message,
  };
}
