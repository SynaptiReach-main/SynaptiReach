"use client";

import { useEffect, useMemo, useState } from "react";
import { Brain, CheckCircle2, Loader2, XCircle } from "lucide-react";

type MiniBrainInsightPanelProps = {
  title?: string;
  subtitle?: string;
  types?: string[];
  limit?: number;
};

function hrefForInsight(item: any) {
  const base =
    item.metadata?.destinationPage ||
    (item.type === "lead_intelligence"
      ? "/dashboard/leads"
      : ["deal_intelligence", "pipeline_intelligence", "forecast"].includes(item.type)
        ? "/dashboard/pipeline"
        : item.type === "communication_intelligence"
          ? "/dashboard/communications"
          : item.type === "campaign_intelligence"
            ? "/dashboard/marketing"
            : item.type === "workflow_intelligence"
              ? "/dashboard/workflow"
              : item.type === "task_intelligence"
                ? "/dashboard/tasks"
                : item.type === "appointment_intelligence"
                  ? "/dashboard/calendar"
                  : ["billing_usage_intelligence", "onboarding_setup"].includes(item.type)
                    ? "/dashboard/settings"
                    : "/dashboard/ai_assistant");
  const first = Array.isArray(item.relatedRecords) ? item.relatedRecords[0] : null;
  return hrefForRelatedRecord(first, base);
}

function hrefForRelatedRecord(record: any, fallback: string) {
  if (!record?.id) {
    return fallback === "/dashboard/settings" ? "/dashboard/settings#billing" : fallback;
  }

  const type = String(record.type || "").toLowerCase();
  const id = encodeURIComponent(String(record.id));
  if (type.includes("lead")) return `/dashboard/leads?leadId=${id}`;
  if (type.includes("deal") || type.includes("pipeline")) return `/dashboard/pipeline?dealId=${id}`;
  if (type.includes("task")) return `/dashboard/tasks?taskId=${id}`;
  if (type.includes("appointment") || type.includes("calendar")) return `/dashboard/calendar?appointmentId=${id}`;
  if (type.includes("campaign") || type.includes("marketing")) return `/dashboard/marketing?campaignId=${id}`;
  if (type.includes("conversation") || type.includes("communication") || type.includes("message")) return `/dashboard/communications?conversationId=${id}`;
  if (type.includes("workflow")) return `/dashboard/workflow?workflowId=${id}`;
  if (type.includes("billing") || type.includes("usage") || type.includes("setup")) return "/dashboard/settings#billing";
  return fallback;
}

function actionLabel(actionType: string) {
  const labels: Record<string, string> = {
    create_task: "Create task draft",
    draft_message: "Draft message",
    create_workflow: "Create workflow draft",
    notify_user: "Create notification",
    suggest_upgrade: "Review plan",
    review_record: "Review record",
    assign_staff: "Suggest assignment",
    schedule_appointment: "Create prep task",
    review_campaign: "Review campaign",
    review_billing: "Review billing",
    fix_setup: "Fix setup",
    flag_risk: "Flag risk",
    open_modal: "Open details",
    no_action: "No action needed",
  };

  return labels[actionType] || "Approve draft";
}

export default function MiniBrainInsightPanel({
  title = "Built-in Intelligence",
  subtitle = "Deterministic CRM insights generated without an external AI call.",
  types,
  limit = 4,
}: MiniBrainInsightPanelProps) {
  const [insights, setInsights] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [helperResults, setHelperResults] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionState, setActionState] = useState<Record<string, { loading?: boolean; message?: string; error?: string }>>({});
  const [selectedInsight, setSelectedInsight] = useState<any | null>(null);

  useEffect(() => {
    let active = true;

    async function loadInsights() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/intelligence/summary", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data?.error || "Built-in intelligence is not available.");
        }
        if (active) {
          setInsights(data.result?.insights || []);
          setScores(data.result?.scores || data.result?.summary?.scorecards || []);
          setHelperResults(data.result?.helperResults || {});
        }
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : "Built-in intelligence is not available.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInsights();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const allowed = types?.length ? new Set(types) : null;
    return insights
      .filter((item) => !allowed || allowed.has(item.type))
      .slice(0, limit);
  }, [insights, limit, types]);

  const helperCards = useMemo(() => {
    const allowed = new Set(types || []);
    const cards: any[] = [];
    const includeAll = !types?.length;
    const add = (card: any) => cards.push(card);

    if (includeAll || allowed.has("lead_intelligence")) {
      (helperResults.leadScorecards || []).slice(0, 3).forEach((item: any) =>
        add({
          id: `lead-helper-${item.leadId}`,
          title: `Lead ${item.temperature || "review"} scorecard`,
          summary: `Fit ${item.fitScore?.score ?? "-"}, intent ${item.intentScore?.score ?? "-"}, freshness ${item.freshnessScore?.score ?? "-"}.`,
          reasoning: [...(item.whyThisMatters || []), ...(item.whatChangedSinceLastReview || [])],
          recommendedAction: item.nextBestAction?.reason || "Review this lead and confirm next action.",
          priority: item.lossRisk?.score >= 70 ? "high" : "medium",
          confidence: item.nextBestAction?.confidence || 0.76,
          source: "mini_brain",
          actionType: item.nextBestAction?.actionType || "review_record",
          relatedRecords: item.leadId ? [{ type: "lead", id: item.leadId, label: "Lead" }] : [],
          metadata: { destinationPage: "/dashboard/leads", helper_result: "LeadIntelligenceCard" },
        })
      );
    }

    if (includeAll || allowed.has("pipeline_intelligence") || allowed.has("deal_intelligence") || allowed.has("forecast")) {
      (helperResults.dealHealthCards || []).slice(0, 3).forEach((item: any) =>
        add({
          id: `deal-helper-${item.dealId}`,
          title: "Deal health helper",
          summary: `Health ${item.healthScore?.score ?? "-"}, adjusted close probability ${item.adjustedCloseProbability ?? "-"}%, weighted forecast ${item.weightedForecastValue ?? 0}.`,
          reasoning: [...(item.healthScore?.reasons || []), ...(item.stageMovementSummary || [])],
          recommendedAction: item.nextBestAction?.reason || "Review deal health and next step.",
          priority: item.closeDateRisk?.score >= 70 ? "high" : "medium",
          confidence: item.nextBestAction?.confidence || 0.74,
          source: "mini_brain",
          actionType: item.nextBestAction?.actionType || "create_task",
          relatedRecords: item.dealId ? [{ type: "deal", id: item.dealId, label: "Deal" }] : [],
          metadata: { destinationPage: "/dashboard/pipeline", helper_result: "DealHealthCard" },
        })
      );
    }

    if (includeAll || allowed.has("campaign_intelligence")) {
      (helperResults.campaignHealthCards || []).slice(0, 3).forEach((item: any) =>
        add({
          id: `campaign-helper-${item.campaignId}`,
          title: "Campaign health helper",
          summary: `Health ${item.healthScore?.score ?? "-"} with ${Math.round((item.openRate || 0) * 100)}% opens and ${Math.round((item.clickRate || 0) * 100)}% clicks.`,
          reasoning: [...(item.healthScore?.reasons || []), ...(item.recentActivitySummary || []), `A/B idea: ${item.abTestIdea}`],
          recommendedAction: item.nextCampaignRecommendation || "Review campaign performance and next test.",
          priority: item.deliveryRisk?.score >= 60 ? "high" : "medium",
          confidence: 0.76,
          source: "mini_brain",
          actionType: "review_campaign",
          relatedRecords: item.campaignId ? [{ type: "campaign", id: item.campaignId, label: "Campaign" }] : [],
          metadata: { destinationPage: "/dashboard/marketing", helper_result: "CampaignHealthCard" },
        })
      );
    }

    if (includeAll || allowed.has("communication_intelligence")) {
      (helperResults.conversationSummaries || []).slice(0, 3).forEach((item: any) =>
        add({
          id: `conversation-helper-${item.conversationId}`,
          title: "Conversation summary",
          summary: `${item.suggestedResponseType || "review"} via ${item.recommendedChannel || "email"} with ${item.urgency || "medium"} urgency.`,
          reasoning: [...(item.summary || []), `Detected: ${(item.detectedSignals || []).join(", ") || "no special signal"}.`],
          recommendedAction: "Review the suggested response type and create a draft only if appropriate.",
          priority: item.urgency || "medium",
          confidence: item.priorityScore?.score ? Math.min(0.94, item.priorityScore.score / 100) : 0.72,
          source: "mini_brain",
          actionType: "draft_message",
          relatedRecords: item.conversationId ? [{ type: "conversation", id: item.conversationId, label: "Conversation" }] : [],
          metadata: { destinationPage: "/dashboard/communications", helper_result: "ConversationSummary" },
        })
      );
    }

    if (includeAll || allowed.has("workflow_intelligence")) {
      (helperResults.workflowSignals || []).slice(0, 3).forEach((item: any) =>
        add({
          id: `workflow-signal-${item.signalId}`,
          title: `Workflow signal: ${String(item.signalType || "review").replace(/_/g, " ")}`,
          summary: `${item.count || 0} related record${item.count === 1 ? "" : "s"} detected.`,
          reasoning: [item.explanation, item.recommendedWorkflowTemplate ? `Suggested template: ${item.recommendedWorkflowTemplate}` : "Review before creating automation."].filter(Boolean),
          recommendedAction: item.nextBestAction?.reason || "Review workflow signal.",
          priority: item.priority || "medium",
          confidence: item.nextBestAction?.confidence || 0.74,
          source: "mini_brain",
          actionType: item.nextBestAction?.actionType || "create_workflow",
          relatedRecords: item.relatedRecords || [],
          metadata: { destinationPage: "/dashboard/workflow", helper_result: "WorkflowSignalCard" },
        })
      );
    }

    if (includeAll || allowed.has("task_intelligence") || allowed.has("staff_team")) {
      (helperResults.taskPriorityCards || []).slice(0, 3).forEach((item: any) =>
        add({
          id: `task-helper-${item.taskId}`,
          title: "Task priority helper",
          summary: `Priority ${item.priorityScore?.score ?? "-"}, revenue impact ${item.revenueImpact?.score ?? "-"}, suggested priority ${item.suggestedPriority || "medium"}.`,
          reasoning: [...(item.priorityScore?.reasons || []), ...(item.dependencyHints || [])],
          recommendedAction: item.nextBestAction?.reason || "Review task owner, due date, and priority.",
          priority: item.suggestedPriority || "medium",
          confidence: item.nextBestAction?.confidence || 0.74,
          source: "mini_brain",
          actionType: item.nextBestAction?.actionType || "assign_staff",
          relatedRecords: item.taskId ? [{ type: "task", id: item.taskId, label: "Task" }] : [],
          metadata: { destinationPage: "/dashboard/tasks", helper_result: "TaskPriorityCard" },
        })
      );
    }

    if (includeAll || allowed.has("appointment_intelligence")) {
      (helperResults.appointmentPrepCards || []).slice(0, 3).forEach((item: any) =>
        add({
          id: `appointment-helper-${item.appointmentId}`,
          title: "Appointment prep helper",
          summary: `Priority ${item.priorityScore?.score ?? "-"}, no-show risk ${item.noShowRisk?.score ?? "-"}.`,
          reasoning: [...(item.prepChecklist || []), ...(item.linkedRecordWarnings || [])],
          recommendedAction: `Recommended follow-up timing: ${item.followUpTiming || "review before meeting"}.`,
          priority: item.noShowRisk?.score >= 70 ? "high" : "medium",
          confidence: 0.74,
          source: "mini_brain",
          actionType: "schedule_appointment",
          relatedRecords: item.appointmentId ? [{ type: "appointment", id: item.appointmentId, label: "Appointment" }] : [],
          metadata: { destinationPage: "/dashboard/calendar", helper_result: "AppointmentPrepCard" },
        })
      );
    }

    if (includeAll || allowed.has("billing_usage_intelligence") || allowed.has("onboarding_setup") || allowed.has("safety_compliance")) {
      (helperResults.billingUsageForecasts || []).slice(0, 3).forEach((item: any) =>
        add({
          id: `billing-helper-${item.forecastId}`,
          title: `${item.usageType || "Usage"} forecast`,
          summary: `${item.currentUsage || 0}${item.cap ? ` of ${item.cap}` : ""} used. Recommended action: ${item.recommendedPlanAction || "none"}.`,
          reasoning: item.explanation || [],
          recommendedAction: "Review usage forecast before changing billing or caps.",
          priority: item.usagePaceScore?.score >= 85 ? "high" : "medium",
          confidence: 0.72,
          source: "mini_brain",
          actionType: "review_billing",
          relatedRecords: [],
          metadata: { destinationPage: "/dashboard/settings", helper_result: "BillingUsageForecast" },
        })
      );
      if (helperResults.setupReadiness) {
        const item = helperResults.setupReadiness;
        add({
          id: "setup-readiness-helper",
          title: "Setup readiness helper",
          summary: `Setup score ${item.score?.score ?? "-"} with ${item.blockedBecause?.length || 0} blocker${item.blockedBecause?.length === 1 ? "" : "s"}.`,
          reasoning: item.blockedBecause?.length ? item.blockedBecause : item.score?.reasons || [],
          recommendedAction: item.recommendedNextStep || "Review setup readiness.",
          priority: item.blockedBecause?.length ? "high" : "medium",
          confidence: 0.78,
          source: "mini_brain",
          actionType: "fix_setup",
          relatedRecords: [],
          metadata: { destinationPage: "/dashboard/settings", helper_result: "SetupReadinessScore" },
        });
      }
    }

    return cards.slice(0, 6);
  }, [helperResults, types]);

  async function applyDecision(item: any, decision: "approve" | "dismiss") {
    const key = item.id || item.title;
    setActionState((state) => ({
      ...state,
      [key]: { loading: true },
    }));

    try {
      const response = await fetch("/api/intelligence/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, insight: item }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Intelligence action could not be recorded.");
      }
      setActionState((state) => ({
        ...state,
        [key]: {
          message:
            decision === "approve"
              ? data.message || "Review-gated draft was created."
              : "Insight was dismissed without external action.",
        },
      }));
    } catch (error) {
      setActionState((state) => ({
        ...state,
        [key]: {
          error: error instanceof Error ? error.message : "Intelligence action could not be recorded.",
        },
      }));
    }
  }

  return (
    <section className="mb-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5 shadow-2xl shadow-cyan-500/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
            <Brain size={16} />
            Business Intelligence
          </div>
          <h2 className="mt-1 text-xl font-black text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <a href="/dashboard/ai_assistant" className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100">
          Command Center
        </a>
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-cyan-100">
          <Loader2 className="animate-spin" size={16} />
          Loading built-in intelligence...
        </div>
      ) : error ? (
        <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
          No urgent deterministic insight is needed for this area right now.
        </div>
      ) : (
        <>
          {scores.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              {scores.slice(0, 5).map((score) => (
                <button
                  key={score.label}
                  type="button"
                  onClick={() =>
                    setSelectedInsight({
                      id: `score-${score.label}`,
                      title: score.label,
                      summary: `${score.score}/${score.maxScore} deterministic score (${score.band}).`,
                      reasoning: score.reasons || [],
                      recommendedAction: score.nextAction || "Review related CRM records.",
                      confidence: 0.74,
                      priority: score.band === "poor" || score.band === "watch" ? "high" : "medium",
                      source: "mini_brain",
                      actionType: "review_record",
                      relatedRecords: [],
                      metadata: score.metadata || {},
                    })
                  }
                  className="rounded-2xl border border-white/10 bg-black/30 p-3 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                >
                  <div className="text-xs text-gray-500">{score.label}</div>
                  <div className="mt-1 text-lg font-black text-white">{score.score}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">{score.band}</div>
                </button>
              ))}
            </div>
          )}
          {helperCards.length > 0 && (
            <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.04] p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                    Domain helpers
                  </div>
                  <div className="mt-1 text-sm text-gray-400">
                    Structured scorecards and summaries generated from deterministic CRM intelligence.
                  </div>
                </div>
                <div className="text-xs text-emerald-100/70">No external AI call</div>
              </div>
              <div className="mt-3 grid gap-2 lg:grid-cols-3">
                {helperCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedInsight(card)}
                    className="rounded-2xl border border-white/10 bg-black/30 p-3 text-left transition hover:border-emerald-400/30 hover:bg-emerald-500/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white">{card.title}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-gray-400">
                        {card.priority || "medium"}
                      </span>
                    </div>
                    <div className="mt-2 line-clamp-2 text-xs text-gray-400">{card.summary}</div>
                    <div className="mt-3 text-xs font-bold text-emerald-100">Why this matters</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {filtered.map((item) => (
              <div key={item.id || item.title} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              {(() => {
                const key = item.id || item.title;
                const state = actionState[key] || {};
                const canApprove = item.actionType && item.actionType !== "no_action";

                return (
                  <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-xs font-bold text-cyan-100">
                  {item.priority || "medium"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-gray-400">
                  {Math.round(Number(item.confidence || 0) * 100)}% confidence
                </span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-100">
                  review gated
                </span>
              </div>
              <div className="mt-3 font-bold text-white">{item.title}</div>
              <div className="mt-1 text-sm text-gray-400">{item.summary}</div>
              {(item.reasoning || []).length > 0 && (
                <div className="mt-3 border-t border-white/10 pt-3 text-xs text-gray-500">
                  {(item.reasoning || []).slice(0, 2).join(" ")}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={hrefForInsight(item)} className="inline-flex rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100">
                  Review safely
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedInsight(item)}
                  className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-gray-200"
                >
                  Why this matters
                </button>
                {canApprove && (
                  <button
                    type="button"
                    onClick={() => applyDecision(item, "approve")}
                    disabled={state.loading}
                    className="inline-flex items-center gap-1 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state.loading ? <Loader2 className="animate-spin" size={13} /> : <CheckCircle2 size={13} />}
                    {actionLabel(item.actionType)}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => applyDecision(item, "dismiss")}
                  disabled={state.loading}
                  className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircle size={13} />
                  Dismiss
                </button>
              </div>
              {state.message && (
                <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                  {state.message}
                </div>
              )}
              {state.error && (
                <div className="mt-3 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-100">
                  {state.error}
                </div>
              )}
                  </>
                );
              })()}
              </div>
            ))}
          </div>
        </>
      )}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Built-in Intelligence</div>
                <h3 className="mt-2 text-2xl font-black text-white">{selectedInsight.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{selectedInsight.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-gray-300"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <div className="text-xs text-gray-500">Priority</div>
                <div className="mt-1 font-bold text-white">{selectedInsight.priority || "medium"}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <div className="text-xs text-gray-500">Confidence</div>
                <div className="mt-1 font-bold text-white">{Math.round(Number(selectedInsight.confidence || 0) * 100)}%</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <div className="text-xs text-gray-500">Source</div>
                <div className="mt-1 font-bold text-white">Built-in Intelligence</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm font-bold text-white">Why this matters</div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {(selectedInsight.reasoning || ["This deterministic rule found a CRM condition worth human review."]).map((reason: string, index: number) => (
                  <li key={`${selectedInsight.id}-reason-${index}`} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="text-sm font-bold text-emerald-100">Review-gated next step</div>
              <p className="mt-2 text-sm text-emerald-50/80">{selectedInsight.recommendedAction}</p>
              <p className="mt-2 text-xs text-emerald-100/70">
                This can create a draft or internal record only. It does not send an email, SMS, social post, or payment action.
              </p>
            </div>

            {(selectedInsight.relatedRecords || []).length > 0 && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-bold text-white">Related records</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(selectedInsight.relatedRecords || []).slice(0, 8).map((record: any) => (
                    <div key={`${record.type}-${record.id}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-gray-300">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-white">{record.label || record.id}</div>
                          <div className="mt-1 text-gray-500">{record.type}</div>
                        </div>
                        <a href={hrefForRelatedRecord(record, hrefForInsight(selectedInsight))} className="shrink-0 rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 font-bold text-cyan-100">
                          Open
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <a href={hrefForInsight(selectedInsight)} className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100">
                Open destination
              </a>
              {selectedInsight.actionType !== "no_action" && (
                <button
                  type="button"
                  onClick={() => applyDecision(selectedInsight, "approve")}
                  className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-100"
                >
                  {actionLabel(selectedInsight.actionType)}
                </button>
              )}
              <button
                type="button"
                onClick={() => applyDecision(selectedInsight, "dismiss")}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-gray-300"
              >
                Dismiss
              </button>
            </div>
            {actionState[selectedInsight.id || selectedInsight.title]?.message && (
              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                {actionState[selectedInsight.id || selectedInsight.title]?.message}
              </div>
            )}
            {actionState[selectedInsight.id || selectedInsight.title]?.error && (
              <div className="mt-4 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-100">
                {actionState[selectedInsight.id || selectedInsight.title]?.error}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
