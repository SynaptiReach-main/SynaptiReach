import type { MiniBrainInsight, MiniBrainInsightType } from "./types";

export function recordRef(type: string, record: any, fallbackLabel: string) {
  return {
    type,
    id: String(record?.id || record?.lead_id || record?.campaign_id || fallbackLabel),
    label: String(record?.name || record?.title || record?.subject || record?.email || fallbackLabel),
  };
}

export function insight(
  input: Omit<MiniBrainInsight, "id" | "source" | "createdAt"> & {
    key: string;
    createdAt?: string;
  }
): MiniBrainInsight {
  const createdAt = input.createdAt || new Date().toISOString();
  const stable = `${input.type}:${input.key}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  const { key: _key, ...rest } = input;

  return {
    ...rest,
    id: stable,
    source: "mini_brain",
    createdAt,
  };
}

export function typeAction(type: MiniBrainInsightType) {
  if (type === "campaign_intelligence") return "review_campaign" as const;
  if (type === "task_intelligence") return "create_task" as const;
  if (type === "communication_intelligence") return "draft_message" as const;
  if (type === "workflow_intelligence") return "create_workflow" as const;
  if (type === "appointment_intelligence") return "schedule_appointment" as const;
  if (type === "billing_usage_intelligence") return "review_billing" as const;
  if (type === "onboarding_setup") return "fix_setup" as const;
  if (type === "staff_team") return "assign_staff" as const;
  return "review_record" as const;
}
