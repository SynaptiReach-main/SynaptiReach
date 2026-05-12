export {};
import { supabase } from "@/lib/supabase/client";

export async function requireSession() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}
