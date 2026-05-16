import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase client using service role key for writes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("marketing_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaign_id, action, details, workspace_id, type, message, metadata } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Missing required field: action" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("marketing_events")
      .insert([
        {
          campaign_id,
          workspace_id: workspace_id || null,
          event_type: type || action,
          type: type || action,
          title: details || message || action,
          description: details || message || "",
          message: message || details || "",
          action,
          details: details || "",
          metadata: metadata || {},
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, event: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
