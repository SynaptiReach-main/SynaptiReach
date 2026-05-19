import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

function toNotification(record: any) {
  return {
    id: record.id,
    title: record.title,
    message: record.message,
    type: record.type || "info",
    priority: record.priority || "normal",
    status: record.status || "unread",
    record_type: record.record_type || null,
    record_id: record.record_id || null,
    href: record.href || null,
    derived: false,
    created_at: record.created_at,
  };
}

function derivedNotification(input: {
  id: string;
  title: string;
  message: string;
  type: string;
  priority?: string;
  href?: string;
  created_at?: string | null;
}) {
  return {
    ...input,
    status: "unread",
    record_type: input.type,
    record_id: null,
    derived: true,
    priority: input.priority || "normal",
    created_at: input.created_at || new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspace_id") || searchParams.get("workspaceId");
    const now = new Date();
    const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    let notificationsQuery = supabase
      .from("crm_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (workspaceId) notificationsQuery = notificationsQuery.eq("workspace_id", workspaceId);

    const { data: stored, error } = await notificationsQuery;
    if (error) throw error;

    const [tasks, appointments, recommendations, campaigns, leads, deals, communications, usage] = await Promise.all([
      supabase
        .from("crm_tasks")
        .select("id,title,due_date,status,priority,workspace_id,created_at")
        .neq("status", "completed")
        .neq("status", "archived")
        .limit(50),
      supabase
        .from("crm_appointments")
        .select("id,title,starts_at,status,workspace_id,created_at")
        .eq("status", "scheduled")
        .limit(50),
      supabase
        .from("crm_ai_recommendations")
        .select("id,title,description,status,workspace_id,created_at")
        .eq("status", "open")
        .limit(25),
      supabase
        .from("marketing_campaigns")
        .select("id,subject,name,status,send_date,workspace_id,created_at")
        .in("status", ["scheduled", "sent", "cancelled"])
        .limit(25),
      supabase
        .from("leads")
        .select("id,name,email,status,workspace_id,created_at")
        .order("created_at", { ascending: false })
        .limit(25),
      supabase
        .from("crm_deals")
        .select("id,title,name,stage,status,value,workspace_id,updated_at,created_at")
        .order("updated_at", { ascending: false })
        .limit(25),
      supabase
        .from("communications")
        .select("id,channel,direction,recipient,subject,content,status,lead_id,workspace_id,created_at")
        .order("created_at", { ascending: false })
        .limit(25),
      supabase
        .from("crm_usage_events")
        .select("id,usage_type,quantity,metadata,workspace_id,created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    const derived = [
      ...((tasks.data || [])
        .filter((task: any) => {
          if (workspaceId && task.workspace_id !== workspaceId) return false;
          if (!task.due_date) return false;
          return new Date(task.due_date).getTime() <= soon.getTime();
        })
        .map((task: any) =>
          derivedNotification({
            id: `task-${task.id}`,
            title:
              new Date(task.due_date).getTime() < now.getTime()
                ? "Overdue task"
                : "Task due soon",
            message: task.title || "A task needs attention.",
            type: "task",
            priority: task.priority || "high",
            href: "/dashboard/tasks",
            created_at: task.due_date,
          })
        )),
      ...((appointments.data || [])
        .filter((appointment: any) => {
          if (workspaceId && appointment.workspace_id !== workspaceId) return false;
          if (!appointment.starts_at) return false;
          const starts = new Date(appointment.starts_at).getTime();
          return starts >= now.getTime() && starts <= soon.getTime();
        })
        .map((appointment: any) =>
          derivedNotification({
            id: `appointment-${appointment.id}`,
            title: "Upcoming appointment",
            message: appointment.title || "An appointment is coming up.",
            type: "appointment",
            priority: "high",
            href: "/dashboard/calendar",
            created_at: appointment.starts_at,
          })
        )),
      ...((recommendations.data || [])
        .filter((item: any) => !workspaceId || item.workspace_id === workspaceId)
        .map((item: any) =>
          derivedNotification({
            id: `recommendation-${item.id}`,
            title: "AI recommendation created",
            message: item.title || item.description || "Review a new AI recommendation.",
            type: "ai_recommendation",
            priority: "normal",
            href: "/dashboard/ai_assistant",
            created_at: item.created_at,
          })
        )),
      ...((campaigns.data || [])
        .filter((campaign: any) => !workspaceId || campaign.workspace_id === workspaceId)
        .map((campaign: any) =>
          derivedNotification({
            id: `campaign-${campaign.id}`,
            title: `Campaign ${campaign.status}`,
            message: campaign.subject || campaign.name || "Campaign activity updated.",
            type: "campaign",
            priority: campaign.status === "cancelled" ? "high" : "normal",
            href: "/dashboard/marketing",
            created_at: campaign.send_date || campaign.created_at,
          })
        )),
      ...((leads.data || [])
        .filter((lead: any) => !workspaceId || lead.workspace_id === workspaceId)
        .filter((lead: any) => lead.created_at && new Date(lead.created_at).getTime() >= now.getTime() - 24 * 60 * 60 * 1000)
        .map((lead: any) =>
          derivedNotification({
            id: `lead-${lead.id}`,
            title: "New lead created",
            message: lead.name || lead.email || "A new lead was added.",
            type: "lead",
            priority: lead.status === "qualified" ? "high" : "normal",
            href: "/dashboard/leads",
            created_at: lead.created_at,
          })
        )),
      ...((deals.data || [])
        .filter((deal: any) => !workspaceId || deal.workspace_id === workspaceId)
        .filter((deal: any) => {
          const updated = deal.updated_at || deal.created_at;
          return updated && new Date(updated).getTime() >= now.getTime() - 24 * 60 * 60 * 1000;
        })
        .map((deal: any) =>
          derivedNotification({
            id: `deal-${deal.id}`,
            title: "Pipeline change",
            message: `${deal.title || deal.name || "Deal"} is ${deal.stage || deal.status || "updated"}.`,
            type: "deal",
            priority: Number(deal.value || 0) > 5000 ? "high" : "normal",
            href: "/dashboard/pipeline",
            created_at: deal.updated_at || deal.created_at,
          })
        )),
      ...((communications.data || [])
        .filter((item: any) => !workspaceId || item.workspace_id === workspaceId)
        .filter((item: any) => item.direction === "inbound" || item.status === "received")
        .map((item: any) =>
          derivedNotification({
            id: `communication-${item.id}`,
            title: "Lead response received",
            message: item.subject || item.content || item.recipient || "A lead sent a communication.",
            type: "communication",
            priority: "high",
            href: "/dashboard/communications",
            created_at: item.created_at,
          })
        )),
      ...((usage.data || [])
        .filter((event: any) => !workspaceId || event.workspace_id === workspaceId)
        .filter((event: any) => event.metadata?.warning || event.metadata?.cap_warning || Number(event.metadata?.percent_used || 0) >= 80)
        .map((event: any) =>
          derivedNotification({
            id: `usage-${event.id}`,
            title: "Usage cap warning",
            message: `${event.usage_type || "Usage"} is approaching a hard cap.`,
            type: "usage",
            priority: "high",
            href: "/dashboard/settings",
            created_at: event.created_at,
          })
        )),
    ];

    const notifications = [...(stored || []).map(toNotification), ...derived]
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      )
      .slice(0, 75);

    return NextResponse.json({
      success: true,
      notifications,
      unread_count: notifications.filter((item) => item.status !== "read").length,
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: friendly.message,
        missingSchema: friendly.missingSchema,
      },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const context = await getWorkspaceContext(req);
    if (!body.title) {
      return NextResponse.json({ success: false, error: "Notification title is required." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("crm_notifications")
      .insert({
        workspace_id: body.workspace_id || body.workspaceId || context.workspaceId || null,
        company_id: body.company_id || body.companyId || context.companyId || null,
        user_id: body.user_id || body.userId || context.userId || null,
        title: body.title,
        message: body.message || null,
        type: body.type || "info",
        priority: body.priority || "normal",
        record_type: body.record_type || body.recordType || null,
        record_id: body.record_id || body.recordId || null,
        href: body.href || null,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, notification: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const context = await getWorkspaceContext(req);
    const supabase = createSupabaseAdmin();

    let query = supabase
      .from("crm_notifications")
      .update({ status: "read", read_at: new Date().toISOString() });

    if (body.id) {
      query = query.eq("id", body.id);
      if (context.workspaceId) query = query.eq("workspace_id", context.workspaceId);
    } else if (body.mark_all_read) {
      if (body.workspace_id || body.workspaceId) {
        query = query.eq("workspace_id", body.workspace_id || body.workspaceId);
      }
      query = query.eq("status", "unread");
    } else {
      return NextResponse.json(
        { success: false, error: "Provide notification id or mark_all_read." },
        { status: 400 }
      );
    }

    const { data, error } = await query.select();
    if (error) throw error;

    return NextResponse.json({ success: true, notifications: data || [] });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
