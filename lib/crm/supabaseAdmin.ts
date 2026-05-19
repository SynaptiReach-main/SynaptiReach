import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error(
      "Supabase setup required. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    ) as Error & { setupRequired?: boolean };
    error.setupRequired = true;
    throw error;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
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

  if (error?.setupRequired || message.includes("Supabase setup required")) {
    return {
      missingSchema: false,
      setupRequired: true,
      message:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  if (
    message.includes("does not exist") ||
    message.includes("Could not find the table") ||
    error?.code === "42P01" ||
    error?.code === "42703"
  ) {
    return {
      missingSchema: true,
      setupRequired: false,
      message:
        "Required CRM schema is missing. Run supabase/user_crm_full_completion_schema.sql in the Supabase SQL Editor, then retry.",
    };
  }

  return {
    missingSchema: false,
    setupRequired: false,
    message,
  };
}
