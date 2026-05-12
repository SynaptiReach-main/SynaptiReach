"use server";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return { error: NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )};
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )};
  }

  return { user };
}
