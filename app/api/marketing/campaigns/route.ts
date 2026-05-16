import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

function normalizeScheduledAt(
  sendDate?: string,
  sendTime?: string,
  scheduledAt?: string
) {
  const value = scheduledAt || sendDate;

  if (value && value.includes("T")) {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return { error: "Invalid send date or time." };
    }

    return { scheduledAt: parsed.toISOString() };
  }

  if ((sendDate && !sendTime) || (!sendDate && sendTime)) {
    return {
      error: "Select both a send date and send time, or leave both blank.",
    };
  }

  if (!sendDate && !sendTime) {
    return { scheduledAt: null };
  }

  const parsed = new Date(`${sendDate}T${sendTime}:00`);

  if (Number.isNaN(parsed.getTime())) {
    return { error: "Invalid send date or time." };
  }

  return { scheduledAt: parsed.toISOString() };
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaigns: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      type,
      audience,
      stagger,
      sendDate,
      sendTime,
      scheduledAt,
      subject,
      content,
      attachments,
      status,
    } = body;

    if (!type || !audience || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required campaign fields.",
        },
        { status: 400 }
      );
    }

    const schedule = normalizeScheduledAt(sendDate, sendTime, scheduledAt);

    if (schedule.error) {
      return NextResponse.json(
        {
          success: false,
          error: schedule.error,
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("marketing_campaigns")
      .insert({
        type,
        audience,
        stagger: Number(stagger || 50),
        send_date: schedule.scheduledAt,
        send_time: schedule.scheduledAt,
        subject: subject || null,
        content,
        attachments: attachments || [],
        status: status || "scheduled",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      subject,
      content,
      audience,
      stagger,
      sendDate,
      sendTime,
      scheduledAt,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing campaign id." },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};

    if (subject !== undefined) updates.subject = subject || null;
    if (content !== undefined) updates.content = content;
    if (audience !== undefined) updates.audience = audience;
    if (stagger !== undefined) updates.stagger = Number(stagger || 50);
    if (status !== undefined) updates.status = status;

    if (
      sendDate !== undefined ||
      sendTime !== undefined ||
      scheduledAt !== undefined
    ) {
      const schedule = normalizeScheduledAt(sendDate, sendTime, scheduledAt);

      if (schedule.error) {
        return NextResponse.json(
          {
            success: false,
            error: schedule.error,
          },
          { status: 400 }
        );
      }

      updates.send_date = schedule.scheduledAt;
      updates.send_time = schedule.scheduledAt;
    }

    const { data, error } = await supabase
      .from("marketing_campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing campaign id." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("marketing_campaigns")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

