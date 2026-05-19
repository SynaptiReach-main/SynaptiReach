import { insight, recordRef } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function appointmentInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const appointments = context.appointments || [];
  const upcoming = appointments.filter((item) => item.status === "scheduled" && item.starts_at && new Date(item.starts_at).getTime() >= Date.now());
  const noShows = appointments.filter((item) => ["no_show", "no-show"].includes(item.status));

  const insights: MiniBrainInsight[] = [];
  if (upcoming.length) {
    insights.push(insight({
      key: "upcoming-appointments",
      type: "appointment_intelligence",
      priority: "low",
      title: "Upcoming appointments are ready for confirmation",
      summary: `${upcoming.length} appointment${upcoming.length === 1 ? "" : "s"} are scheduled.`,
      reasoning: ["Confirmation reminders reduce no-shows and missed opportunities."],
      recommendedAction: "Review upcoming appointments and draft confirmation reminders where appropriate.",
      actionType: "schedule_appointment",
      relatedRecords: upcoming.slice(0, 5).map((item) => recordRef("appointment", item, "Upcoming appointment")),
      confidence: 0.7,
      trend: "unknown",
      metadata: { count: upcoming.length },
    }));
  }

  if (noShows.length) {
    insights.push(insight({
      key: "no-show-follow-up",
      type: "appointment_intelligence",
      priority: "medium",
      title: "No-show follow-up opportunity",
      summary: `${noShows.length} appointment${noShows.length === 1 ? "" : "s"} are marked no-show.`,
      reasoning: ["No-show recovery works best with quick, review-gated outreach."],
      recommendedAction: "Draft a polite reschedule follow-up for no-show contacts.",
      actionType: "draft_message",
      relatedRecords: noShows.slice(0, 5).map((item) => recordRef("appointment", item, "No-show appointment")),
      confidence: 0.77,
      trend: "down",
      metadata: { count: noShows.length },
    }));
  }

  return insights;
}
