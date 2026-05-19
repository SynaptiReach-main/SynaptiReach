import { scoreDeal, weightedDealValue } from "./dealScoring";
import { scoreLead, leadTemperature } from "./leadScoring";
import { clampScore, scoreBand } from "./scoringConfig";
import type {
  AppointmentPrepCard,
  BillingUsageForecast,
  BusinessHealthSummary,
  CampaignHealthCard,
  ConversationSummary,
  DealHealthCard,
  LeadIntelligenceCard,
  MiniBrainActionCard,
  MiniBrainContext,
  MiniBrainInsight,
  MiniBrainResult,
  MiniBrainScore,
  MiniBrainTemplateDraft,
  SafetyCheckResult,
  SetupReadinessScore,
  StaffWorkloadSummary,
  TaskPriorityCard,
  WorkflowSignalCard,
} from "./types";

type HelperResults = NonNullable<MiniBrainResult["helperResults"]>;

function daysSince(value?: string | null) {
  if (!value) return 999;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 999 : Math.max(0, Math.round((Date.now() - time) / 86400000));
}

function futureIso(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function makeScore(label: string, raw: number, reasons: string[], nextAction?: string, metadata?: Record<string, unknown>): MiniBrainScore {
  const score = clampScore(raw);
  return {
    label,
    score,
    maxScore: 100,
    band: scoreBand(score),
    reasons,
    nextAction,
    metadata,
  };
}

function record(type: string, item: any, fallback: string) {
  return {
    type,
    id: String(item?.id || item?.lead_id || item?.deal_id || item?.campaign_id || fallback),
    label: String(item?.name || item?.title || item?.subject || item?.email || fallback),
  };
}

function action(
  reason: string,
  actionType: MiniBrainActionCard["actionType"],
  relatedRecord?: MiniBrainActionCard["relatedRecord"],
  destinationPage?: string,
  urgency: MiniBrainActionCard["urgency"] = "medium",
  impact: MiniBrainActionCard["impact"] = "medium",
  effort: MiniBrainActionCard["effort"] = "low",
  confidence = 0.76
): MiniBrainActionCard {
  return {
    urgency,
    impact,
    effort,
    confidence,
    reason,
    actionType,
    reviewRequired: true,
    destinationPage,
    relatedRecord,
  };
}

function draftTemplate(
  templateId: string,
  situation: MiniBrainTemplateDraft["situation"],
  tone: MiniBrainTemplateDraft["tone"],
  subject: string,
  body: string,
  smsBody: string,
  fields: string[] = ["first_name", "business_name"]
): MiniBrainTemplateDraft {
  return {
    templateId,
    situation,
    tone,
    emailSubject: subject,
    emailBody: body,
    smsBody,
    personalizationFields: fields,
    reviewRequired: true,
  };
}

function usageTotals(context: MiniBrainContext) {
  const eventUsage = (context.usage || []).reduce((totals: Record<string, number>, event) => {
    const key = String(event.usage_type || "unknown");
    totals[key] = (totals[key] || 0) + Number(event.quantity || 0);
    return totals;
  }, {});
  return {
    ...(context.settings?.usage || {}),
    ...(context.settings?.metadata?.usage || {}),
    ...(context.billing?.metadata?.usage || {}),
    ...eventUsage,
  };
}

export function buildMiniBrainHelperResults(
  context: MiniBrainContext,
  insights: MiniBrainInsight[],
  scores: MiniBrainScore[]
): HelperResults {
  const leads = context.leads || [];
  const deals = context.deals || [];
  const campaigns = context.campaigns || [];
  const communications = context.communications || [];
  const workflows = context.workflows || [];
  const workflowRuns = context.workflowRuns || [];
  const tasks = context.tasks || [];
  const appointments = context.appointments || [];
  const staff = context.staff || [];
  const providers = context.providerConnections || [];
  const settings = context.settings || {};
  const metrics = (context.metrics || {}) as any;

  const leadScorecards = leads.slice(0, 12).map((lead): LeadIntelligenceCard => {
    const baseScore = scoreLead(lead, communications, context.activity || []);
    const age = daysSince(lead.last_interaction_at || lead.updated_at || lead.created_at);
    const duplicateCount = leads.filter((item) =>
      item.id !== lead.id &&
      ((lead.email && item.email === lead.email) || (lead.phone && item.phone === lead.phone))
    ).length;
    const hasContact = Boolean(lead.email || lead.phone);
    const related = record("lead", lead, "Lead");

    return {
      leadId: String(lead.id),
      fitScore: makeScore("Fit", baseScore + (lead.company ? 8 : 0), ["Fit uses status, company, contact completeness, and known score fields."]),
      intentScore: makeScore("Intent", baseScore + (lead.status === "qualified" ? 15 : 0), ["Intent increases for qualified, contacted, and high-activity leads."]),
      engagementScore: makeScore("Engagement", Math.min(100, baseScore + communications.filter((item) => item.lead_id === lead.id).length * 8), ["Engagement counts related communications and campaign traces."]),
      freshnessScore: makeScore("Freshness", 100 - Math.min(90, age * 9), [`Last review/activity is ${age >= 999 ? "unknown" : `${age} day(s) old`}.`]),
      qualityScore: makeScore("Quality", baseScore + (hasContact ? 10 : -20) - duplicateCount * 12, ["Quality rewards usable contact data and penalizes duplicate-looking records."]),
      temperature: leadTemperature(baseScore),
      predictedStage: lead.status || "new",
      recommendedNextStage: lead.status === "new" ? "contacted" : lead.status === "contacted" ? "qualified" : lead.status || "review",
      recommendedChannel: lead.phone ? "sms" : lead.email ? "email" : "internal_review",
      recommendedFollowUpAt: futureIso(baseScore >= 70 ? 4 : 24),
      duplicateRisk: makeScore("Duplicate risk", duplicateCount ? 80 : 8, duplicateCount ? ["Matching email or phone found in another lead."] : ["No exact email/phone duplicate found."]),
      conversionReadiness: makeScore("Conversion readiness", baseScore + (lead.status === "qualified" ? 18 : 0), ["Readiness combines score, status, and engagement."]),
      lossRisk: makeScore("Loss risk", Math.min(100, age * 8 + (baseScore < 35 ? 25 : 0)), ["Risk rises when recent activity is stale or score is low."]),
      whyThisMatters: [`${lead.name || lead.email || "This lead"} is classified as ${leadTemperature(baseScore)} by deterministic scoring.`],
      whatChangedSinceLastReview: [`Freshness age: ${age >= 999 ? "unknown" : `${age} day(s)`}.`, `Current status: ${lead.status || "unknown"}.`],
      nextBestAction: action("Create a review-gated follow-up or owner task.", lead.phone || lead.email ? "draft_message" : "review_record", related, "/dashboard/leads", baseScore >= 70 ? "high" : "medium"),
    };
  });

  const dealHealthCards = deals.slice(0, 12).map((deal): DealHealthCard => {
    const health = scoreDeal(deal);
    const age = daysSince(deal.updated_at || deal.created_at);
    const adjusted = clampScore(Number(deal.probability || deal.probability_percent || 0) - (age >= 14 ? 12 : 0) + (Number(deal.value || 0) > 10000 ? 6 : 0));
    const related = record("deal", deal, "Deal");
    return {
      dealId: String(deal.id),
      healthScore: makeScore("Deal health", health, ["Deal health combines probability, value, and stage age."]),
      adjustedCloseProbability: adjusted,
      weightedForecastValue: weightedDealValue({ ...deal, probability: adjusted }),
      velocityScore: makeScore("Deal velocity", 100 - Math.min(90, age * 5), [`Last movement is ${age >= 999 ? "unknown" : `${age} day(s) old`}.`]),
      closeDateRisk: makeScore("Close-date risk", age >= 21 ? 82 : age >= 14 ? 60 : 24, ["Risk rises when open deals age without movement."]),
      revenueAtRisk: age >= 14 ? Number(deal.value || 0) : 0,
      nextBestAction: action("Confirm the next step and owner before close-date risk increases.", "create_task", related, "/dashboard/pipeline", age >= 21 ? "high" : "medium", Number(deal.value || 0) > 10000 ? "high" : "medium"),
      stageMovementSummary: [`Stage: ${deal.stage || deal.status || "unknown"}.`, `Weighted forecast: ${weightedDealValue({ ...deal, probability: adjusted })}.`],
    };
  });

  const campaignHealthCards = campaigns.slice(0, 12).map((campaign): CampaignHealthCard => {
    const delivered = Number(campaign.delivered_count || 0);
    const opened = Number(campaign.opened_count || 0);
    const clicked = Number(campaign.clicked_count || 0);
    const converted = Number(campaign.converted_count || 0);
    const openRate = delivered ? opened / delivered : undefined;
    const clickRate = delivered ? clicked / delivered : undefined;
    const conversionRate = delivered ? converted / delivered : undefined;
    return {
      campaignId: String(campaign.id),
      healthScore: makeScore("Campaign health", 45 + (openRate || 0) * 120 + (clickRate || 0) * 250 + (conversionRate || 0) * 300, ["Health interprets delivery, open, click, and conversion signals."]),
      openRate,
      clickRate,
      conversionRate,
      deliveryRisk: makeScore("Delivery risk", Number(campaign.failed_count || 0) * 12, ["Failed delivery and suppression signals increase delivery risk."]),
      audienceFatigueRisk: makeScore("Audience fatigue", opened > 20 && clicked === 0 ? 74 : 22, ["Repeated opens without clicks suggest CTA or audience fatigue."]),
      bestFollowUpChannel: clicked > 0 ? "email" : "sms",
      nextCampaignRecommendation: clicked > 0 ? "Draft clicked-not-converted follow-up." : "Review CTA clarity and subject pattern before another send.",
      abTestIdea: "Test one clearer outcome-focused CTA against the current variant.",
      recentActivitySummary: [`Delivered ${delivered}, opened ${opened}, clicked ${clicked}, converted ${converted}.`],
    };
  });

  const conversationSummaries = communications.slice(0, 12).map((item): ConversationSummary => {
    const text = `${item.subject || ""} ${item.content || item.body || item.message || ""}`.toLowerCase();
    const signals: ConversationSummary["detectedSignals"] = [];
    if (/price|cost|expensive|budget/.test(text)) signals.push("pricing_concern");
    if (/book|schedule|call|meeting|appointment/.test(text)) signals.push("appointment_signal");
    if (/competitor|another provider|other company/.test(text)) signals.push("competitor_mention");
    if (/cancel|refund|not interested/.test(text)) signals.push("cancellation_or_refund_risk");
    if (item.direction === "inbound" || item.status === "received") signals.push("unread_inbound");
    const urgency = signals.includes("cancellation_or_refund_risk") ? "urgent" : signals.includes("appointment_signal") ? "high" : "medium";
    return {
      conversationId: String(item.conversation_id || item.id),
      leadId: item.lead_id || null,
      priorityScore: makeScore("Conversation priority", 45 + signals.length * 14, [`Detected ${signals.length} deterministic signal(s).`]),
      urgency,
      sentiment: signals.includes("cancellation_or_refund_risk") ? "concerned" : signals.includes("appointment_signal") ? "positive" : "unknown",
      detectedSignals: signals,
      summary: [`${item.channel || "message"} ${item.direction || ""} communication needs ${urgency} review.`],
      suggestedResponseType: signals.includes("appointment_signal") ? "book_call" : signals.includes("pricing_concern") ? "answer_question" : item.direction === "inbound" ? "follow_up" : "no_response_needed",
      recommendedChannel: item.channel === "sms" ? "sms" : "email",
      draftTemplates: [
        draftTemplate(
          `conversation-${item.id || "template"}`,
          signals.includes("appointment_signal") ? "appointment_confirmation" : "no_response_follow_up",
          "professional",
          "Following up on your request",
          "Hi {{first_name}}, thanks for reaching out. I reviewed your note and can help with the next step. Would you like to confirm a time to talk?",
          "Hi {{first_name}}, thanks for reaching out. Want to confirm a quick time to talk?"
        ),
      ],
      reviewRequired: true,
    };
  });

  const workflowSignals = [
    signal("hot-leads", "hot_leads", leadScorecards.filter((lead) => lead.temperature === "hot").length, "Hot leads are ready for fast-response review.", "/dashboard/leads"),
    signal("stale-deals", "stale_deals", dealHealthCards.filter((deal) => deal.closeDateRisk.score >= 60).length, "Stale deals may need a recovery workflow.", "/dashboard/pipeline"),
    signal("overdue-tasks", "overdue_tasks", tasks.filter((task) => task.status === "open" && task.due_date && new Date(task.due_date).getTime() < Date.now()).length, "Overdue tasks can trigger owner reminders.", "/dashboard/tasks"),
    signal("unread-replies", "unread_replies", conversationSummaries.filter((item) => item.detectedSignals.includes("unread_inbound")).length, "Unread replies can trigger response review.", "/dashboard/communications"),
    signal("workflow-failures", "workflow_failure", workflowRuns.filter((run) => run.status === "failed").length, "Failed workflow runs need operational review.", "/dashboard/workflow"),
  ].filter((item) => item.count > 0);

  const taskPriorityCards = tasks.slice(0, 12).map((task): TaskPriorityCard => {
    const overdue = task.status === "open" && task.due_date && new Date(task.due_date).getTime() < Date.now();
    return {
      taskId: String(task.id),
      priorityScore: makeScore("Task priority", overdue ? 88 : task.priority === "high" || task.priority === "urgent" ? 72 : 45, [overdue ? "Task is overdue." : "Priority uses current task priority and due date."]),
      revenueImpact: makeScore("Revenue impact", task.deal_id ? 72 : task.lead_id ? 58 : 35, ["Tasks linked to deals/leads get higher impact."]),
      leadUrgency: makeScore("Lead urgency", task.lead_id ? 62 : 30, ["Lead-linked tasks are treated as follow-up sensitive."]),
      suggestedAssignee: task.assigned_staff_id || task.assigned_to || null,
      suggestedDueDate: overdue ? futureIso(4) : task.due_date || futureIso(24),
      suggestedPriority: overdue ? "urgent" : task.priority || "medium",
      dependencyHints: [task.deal_id ? "Review linked deal before completing." : task.lead_id ? "Review linked lead activity first." : "No linked dependency detected."],
      nextBestAction: action("Approve a due-date or owner review task.", "assign_staff", record("task", task, "Task"), "/dashboard/tasks", overdue ? "urgent" : "medium"),
    };
  });

  const appointmentPrepCards = appointments.slice(0, 12).map((appointment): AppointmentPrepCard => ({
    appointmentId: String(appointment.id),
    likelihoodScore: makeScore("Appointment likelihood", appointment.status === "scheduled" ? 74 : appointment.status === "completed" ? 95 : 35, [`Appointment status is ${appointment.status || "unknown"}.`]),
    noShowRisk: makeScore("No-show risk", appointment.status === "no_show" ? 92 : appointment.confirmed_at ? 12 : 48, ["Risk uses status and confirmation metadata when available."]),
    priorityScore: makeScore("Appointment priority", appointment.deal_id ? 78 : appointment.lead_id ? 62 : 45, ["Linked deal/lead appointments receive higher prep priority."]),
    prepChecklist: ["Review lead/deal context.", "Confirm agenda.", "Prepare follow-up task draft.", "Confirm contact method."],
    recommendedConfirmationTemplate: draftTemplate("appointment-confirmation", "appointment_confirmation", "friendly", "Confirming our appointment", "Hi {{first_name}}, confirming our upcoming appointment. Does this time still work for you?", "Hi {{first_name}}, confirming our appointment. Does this time still work?"),
    followUpTiming: appointment.status === "completed" ? "Within 4 hours after completion" : "24 hours before the appointment",
    linkedRecordWarnings: !appointment.lead_id && !appointment.deal_id ? ["Appointment is not linked to a lead or deal."] : [],
  }));

  const usage = usageTotals(context);
  const billingUsageForecasts = ["ai", "email", "sms", "contacts", "workflows"].map((usageType): BillingUsageForecast => {
    const currentUsage = Number(usage[usageType] || usage[`${usageType}_used`] || 0);
    const cap = Number(usage[`${usageType}_cap`] || context.billing?.metadata?.[`${usageType}_cap`] || 0) || null;
    const ratio = cap ? currentUsage / cap : 0;
    return {
      forecastId: `usage-${usageType}`,
      usageType: usageType as BillingUsageForecast["usageType"],
      currentUsage,
      cap,
      usagePaceScore: makeScore(`${usageType} usage pace`, cap ? ratio * 100 : currentUsage > 0 ? 55 : 20, [cap ? `${currentUsage} of ${cap} used.` : "No cap was loaded for this usage type."]),
      projectedCapExhaustionDate: cap && ratio >= 0.5 ? futureIso(Math.max(24, (1 - ratio) * 240)) : null,
      recommendedPlanAction: cap && ratio >= 0.85 ? "buy_credit_pack" : cap && ratio >= 0.7 ? "review_billing" : "none",
      explanation: ["Forecasts are deterministic estimates and billing remains Stripe/webhook-gated."],
      reviewRequired: true,
    };
  });

  const setupReadiness = buildSetupReadiness(settings, providers, context);
  const staffWorkloadSummaries = buildStaffWorkload(staff, tasks);
  const businessHealth = buildBusinessHealth(scores, insights);
  const safetyChecks = buildSafetyChecks(context, providers);

  return {
    leadScorecards,
    dealHealthCards,
    campaignHealthCards,
    conversationSummaries,
    workflowSignals,
    taskPriorityCards,
    appointmentPrepCards,
    billingUsageForecasts,
    setupReadiness,
    staffWorkloadSummaries,
    businessHealth,
    safetyChecks,
  };

  function signal(signalId: string, signalType: WorkflowSignalCard["signalType"], count: number, explanation: string, destination: string): WorkflowSignalCard {
    return {
      signalId,
      signalType,
      count,
      priority: count >= 10 ? "high" : "medium",
      explanation,
      recommendedWorkflowTemplate: signalType === "hot_leads" ? "Hot lead fast-response workflow" : undefined,
      relatedRecords: [],
      nextBestAction: action(explanation, signalType === "unread_replies" ? "draft_message" : "create_workflow", undefined, destination, count >= 10 ? "high" : "medium"),
    };
  }
}

function buildSetupReadiness(settings: any, providers: any[], context: MiniBrainContext): SetupReadinessScore {
  const providerReady = providers.length > 0 && providers.some((item) => ["active", "connected"].includes(item.status));
  const hasBrand = Boolean(settings.business_name && (settings.brand_voice || settings.tone));
  const hasLeads = Boolean((context.leads || []).length);
  const hasStaff = Boolean((context.staff || []).length);
  const blockedBecause = [
    !providerReady ? "No active provider connection was loaded." : "",
    !hasBrand ? "Brand/profile settings are incomplete." : "",
    !hasLeads ? "No leads are available for first campaign readiness." : "",
  ].filter(Boolean);

  return {
    score: makeScore("Setup completeness", 35 + (providerReady ? 22 : 0) + (hasBrand ? 18 : 0) + (hasLeads ? 15 : 0) + (hasStaff ? 10 : 0), blockedBecause.length ? blockedBecause : ["Core setup signals are present."]),
    providerReadiness: makeScore("Provider readiness", providerReady ? 85 : 25, [providerReady ? "At least one provider is connected." : "Provider setup is required before external sends."]),
    brandProfileReadiness: makeScore("Brand profile", hasBrand ? 82 : 34, [hasBrand ? "Brand voice/profile fields are present." : "Brand voice and business profile need completion."]),
    firstCampaignReadiness: makeScore("First campaign", hasLeads && providerReady ? 78 : 35, ["Requires leads plus provider readiness."]),
    firstWorkflowReadiness: makeScore("First workflow", hasLeads ? 68 : 30, ["Requires lead data and review-gated workflow setup."]),
    leadImportReadiness: makeScore("Lead import", hasLeads ? 86 : 45, [hasLeads ? "Lead data exists." : "Import or create leads before campaign launch."]),
    staffReadiness: makeScore("Staff setup", hasStaff ? 76 : 42, [hasStaff ? "Staff records are present." : "Staff setup can improve assignment intelligence."]),
    blockedBecause,
    recommendedNextStep: blockedBecause[0] || "Review first campaign and first workflow readiness.",
  };
}

function buildStaffWorkload(staff: any[], tasks: any[]): StaffWorkloadSummary[] {
  return staff.slice(0, 12).map((member) => {
    const assigned = tasks.filter((task) => task.assigned_staff_id === member.id || task.assigned_to === member.name || task.assigned_to === member.email);
    const overdue = assigned.filter((task) => task.status === "open" && task.due_date && new Date(task.due_date).getTime() < Date.now());
    return {
      staffId: member.id || null,
      name: member.name || member.email || "Staff member",
      assignedOpenTasks: assigned.filter((task) => task.status === "open").length,
      overdueTasks: overdue.length,
      capacityScore: makeScore("Capacity", 90 - assigned.length * 4 - overdue.length * 8, [`${assigned.length} assigned task(s), ${overdue.length} overdue.`]),
      followUpQualityScore: makeScore("Follow-up quality", 78 - overdue.length * 10, ["Overdue work reduces follow-up quality estimate."]),
      bottlenecks: overdue.length ? ["Overdue assigned work needs review."] : [],
      reassignmentSuggestion: overdue.length >= 3 ? "Consider reassigning oldest overdue work." : undefined,
    };
  });
}

function buildBusinessHealth(scores: MiniBrainScore[], insights: MiniBrainInsight[]): BusinessHealthSummary {
  const topRisks = insights.filter((item) => ["urgent", "high"].includes(item.priority)).slice(0, 5);
  const topOpportunities = insights.filter((item) => !["urgent", "high"].includes(item.priority)).slice(0, 5);
  return {
    dailySummary: [`${insights.length} deterministic insight(s) generated from current CRM context.`],
    weeklyTrendSummary: ["Weekly trend comparison will improve after live seeded workspace tuning."],
    revenueForecast: Number(scores.find((item) => item.label === "Pipeline focus")?.metadata?.open_value || 0),
    pipelineCoverageRatio: undefined,
    leadResponseTimeScore: makeScore("Lead response time", 65, ["Uses inbound replies and stale lead signals when available."]),
    salesActivityScore: scores.find((item) => item.label === "Pipeline focus") || makeScore("Sales activity", 50, ["Pipeline context not available."]),
    marketingEfficiencyScore: scores.find((item) => item.label === "Marketing efficiency") || makeScore("Marketing efficiency", 50, ["Campaign context not available."]),
    crmHygieneScore: scores.find((item) => item.label === "CRM hygiene") || makeScore("CRM hygiene", 50, ["CRM hygiene context not available."]),
    operationalRiskScore: makeScore("Operational risk", 100 - (scores.find((item) => item.label === "Business health")?.score || 50), ["Inverse of business health score."]),
    topRisks,
    topOpportunities,
    recommendedActions: insights.slice(0, 5).map((item) => action(item.recommendedAction, item.actionType, item.relatedRecords[0], item.metadata?.destinationPage as string | undefined, item.priority, "medium")),
  };
}

function buildSafetyChecks(context: MiniBrainContext, providers: any[]): SafetyCheckResult[] {
  const hasEmailProvider = providers.some((item) => item.provider === "resend" && ["active", "connected"].includes(item.status));
  const hasSmsProvider = providers.some((item) => item.provider === "twilio" && ["active", "connected"].includes(item.status));
  const settings = context.settings || {};
  return [
    {
      checkId: "external-send-review-required",
      category: "external_send_readiness",
      passed: true,
      severity: "low",
      message: "Built-in intelligence outputs remain review-gated before external sends.",
      recommendedAction: "Review and confirm every email/SMS/social draft before sending.",
      reviewRequired: true,
      relatedRecords: [],
    },
    {
      checkId: "email-provider-readiness",
      category: "provider_setup",
      passed: hasEmailProvider,
      severity: hasEmailProvider ? "low" : "medium",
      message: hasEmailProvider ? "Email provider appears connected." : "Email provider setup is required before real sends.",
      blockingReason: hasEmailProvider ? undefined : "Missing active Resend/provider connection.",
      recommendedAction: "Configure provider settings before approving email sends.",
      reviewRequired: true,
      relatedRecords: [],
    },
    {
      checkId: "sms-provider-readiness",
      category: "provider_setup",
      passed: hasSmsProvider,
      severity: hasSmsProvider ? "low" : "medium",
      message: hasSmsProvider ? "SMS provider appears connected." : "SMS provider setup is required before real SMS sends.",
      blockingReason: hasSmsProvider ? undefined : "Missing active Twilio/provider connection.",
      recommendedAction: "Configure SMS provider settings and opt-in checks before approving SMS sends.",
      reviewRequired: true,
      relatedRecords: [],
    },
    {
      checkId: "sender-identity",
      category: "compliance",
      passed: Boolean(settings.default_sender_email || settings.contact_email),
      severity: settings.default_sender_email || settings.contact_email ? "low" : "medium",
      message: settings.default_sender_email || settings.contact_email ? "Sender identity is present." : "Sender identity is missing from CRM settings.",
      recommendedAction: "Add sender identity before sending marketing email.",
      reviewRequired: true,
      relatedRecords: [],
    },
  ];
}
