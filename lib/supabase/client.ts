import { createBrowserClient } from "@supabase/ssr";

function validSupabaseUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const configuredUrl = validSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  ? process.env.NEXT_PUBLIC_SUPABASE_URL!
  : "https://placeholder.supabase.co";
const configuredAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseClientConfigured = Boolean(
  validSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createBrowserClient(
  configuredUrl,
  configuredAnonKey
);
