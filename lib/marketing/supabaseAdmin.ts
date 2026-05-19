import { createClient } from "@supabase/supabase-js";

export function createMarketingSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    const error = new Error(
      "Supabase setup required. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    ) as Error & { setupRequired?: boolean };
    error.setupRequired = true;
    throw error;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isSupabaseSetupError(error: unknown) {
  return Boolean(
    (error as any)?.setupRequired ||
      String((error as any)?.message || "").includes("Supabase setup required")
  );
}

export function supabaseSetupRequiredResponse() {
  return {
    success: false,
    setup_required: true,
    error:
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  };
}
