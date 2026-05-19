export type MiniBrainInsightType =
  | "lead_intelligence"
  | "deal_intelligence"
  | "pipeline_intelligence"
  | "communication_intelligence"
  | "campaign_intelligence"
  | "workflow_intelligence"
  | "task_intelligence"
  | "appointment_intelligence"
  | "billing_usage_intelligence"
  | "business_health"
  | "onboarding_setup"
  | "staff_team"
  | "safety_compliance"
  | "simulation"
  | "anomaly"
  | "forecast"
  | "next_best_action";

export type MiniBrainInsight = {
  id: string;
  type: MiniBrainInsightType;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  summary: string;
  reasoning: string[];
  recommendedAction: string;
  actionType:
    | "create_task"
    | "draft_message"
    | "create_workflow"
    | "notify_user"
    | "suggest_upgrade"
    | "review_record"
    | "assign_staff"
    | "schedule_appointment"
    | "review_campaign"
    | "review_billing"
    | "fix_setup"
    | "flag_risk"
    | "open_modal"
    | "no_action";
  relatedRecords: Array<{
    type: string;
    id: string;
    label: string;
  }>;
  confidence: number;
  score?: number;
  trend?: "up" | "down" | "flat" | "unknown";
  source: "mini_brain";
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type MiniBrainContext = {
  leads?: any[];
  campaigns?: any[];
  activity?: any[];
  communications?: any[];
  deals?: any[];
  tasks?: any[];
  workflows?: any[];
  workflowRuns?: any[];
  appointments?: any[];
  agentRuns?: any[];
  recommendations?: any[];
  notifications?: any[];
  staff?: any[];
  providerConnections?: any[];
  billing?: any;
  usage?: any[];
  settings?: any;
  metrics?: any;
  schemaWarnings?: string[];
  workspaceWarnings?: string[];
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
  isTestWorkspace?: boolean;
};

export type MiniBrainScore = {
  label: string;
  score: number;
  maxScore: number;
  band: "poor" | "watch" | "fair" | "good" | "excellent";
  reasons: string[];
  nextAction?: string;
  metadata?: Record<string, unknown>;
};

export type MiniBrainActionCard = {
  urgency: "low" | "medium" | "high" | "urgent";
  impact: "low" | "medium" | "high";
  effort: "low" | "medium" | "high";
  confidence: number;
  reason: string;
  actionType: MiniBrainInsight["actionType"];
  reviewRequired: true;
  destinationPage?: string;
  relatedRecord?: MiniBrainInsight["relatedRecords"][number];
};

export type MiniBrainTemplateDraft = {
  templateId: string;
  situation:
    | "website_form_follow_up"
    | "no_response_follow_up"
    | "opened_not_clicked"
    | "clicked_not_converted"
    | "appointment_confirmation"
    | "appointment_reminder"
    | "no_show_recovery"
    | "stale_deal_check_in"
    | "proposal_follow_up"
    | "review_request"
    | "re_engagement"
    | "billing_cap_warning"
    | "provider_setup_reminder"
    | "staff_assignment_note"
    | "waitlist_invitation"
    | "consultation_request_reply"
    | "service_inquiry_reply";
  tone: "professional" | "friendly" | "concise" | "persuasive";
  emailSubject?: string;
  emailBody?: string;
  smsBody?: string;
  personalizationFields: string[];
  reviewRequired: true;
  metadata?: Record<string, unknown>;
};

export type LeadIntelligenceCard = {
  leadId: string;
  fitScore: MiniBrainScore;
  intentScore: MiniBrainScore;
  engagementScore: MiniBrainScore;
  freshnessScore: MiniBrainScore;
  qualityScore: MiniBrainScore;
  temperature: "cold" | "warm" | "hot";
  predictedStage: string;
  recommendedNextStage: string;
  recommendedChannel: "email" | "sms" | "call" | "internal_review";
  recommendedFollowUpAt?: string;
  duplicateRisk: MiniBrainScore;
  conversionReadiness: MiniBrainScore;
  lossRisk: MiniBrainScore;
  whyThisMatters: string[];
  whatChangedSinceLastReview: string[];
  nextBestAction: MiniBrainActionCard;
};

export type DealHealthCard = {
  dealId: string;
  healthScore: MiniBrainScore;
  adjustedCloseProbability: number;
  weightedForecastValue: number;
  velocityScore: MiniBrainScore;
  closeDateRisk: MiniBrainScore;
  revenueAtRisk: number;
  nextBestAction: MiniBrainActionCard;
  stageMovementSummary: string[];
};

export type CampaignHealthCard = {
  campaignId: string;
  healthScore: MiniBrainScore;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  deliveryRisk: MiniBrainScore;
  audienceFatigueRisk: MiniBrainScore;
  bestFollowUpChannel: "email" | "sms" | "social" | "internal_review";
  nextCampaignRecommendation: string;
  abTestIdea: string;
  recentActivitySummary: string[];
};

export type ConversationSummary = {
  conversationId: string;
  leadId?: string | null;
  priorityScore: MiniBrainScore;
  urgency: "low" | "medium" | "high" | "urgent";
  sentiment: "positive" | "neutral" | "concerned" | "negative" | "unknown";
  detectedSignals: Array<
    | "objection"
    | "buying_signal"
    | "appointment_signal"
    | "pricing_concern"
    | "competitor_mention"
    | "cancellation_or_refund_risk"
    | "unanswered"
    | "unread_inbound"
  >;
  summary: string[];
  suggestedResponseType:
    | "follow_up"
    | "answer_question"
    | "book_call"
    | "send_offer"
    | "nurture"
    | "handoff_to_owner"
    | "escalation"
    | "no_response_needed";
  recommendedChannel: "email" | "sms" | "call" | "internal_note";
  draftTemplates: MiniBrainTemplateDraft[];
  reviewRequired: true;
};

export type WorkflowSignalCard = {
  signalId: string;
  signalType:
    | "hot_leads"
    | "stale_deals"
    | "overdue_tasks"
    | "upcoming_appointments"
    | "no_shows"
    | "unread_replies"
    | "failed_campaigns"
    | "trial_or_cap_warning"
    | "workflow_failure"
    | "pending_approval";
  count: number;
  priority: MiniBrainInsight["priority"];
  explanation: string;
  recommendedWorkflowTemplate?: string;
  relatedRecords: MiniBrainInsight["relatedRecords"];
  nextBestAction: MiniBrainActionCard;
};

export type TaskPriorityCard = {
  taskId: string;
  priorityScore: MiniBrainScore;
  revenueImpact: MiniBrainScore;
  leadUrgency: MiniBrainScore;
  suggestedAssignee?: string | null;
  suggestedDueDate?: string;
  suggestedPriority: MiniBrainInsight["priority"];
  dependencyHints: string[];
  nextBestAction: MiniBrainActionCard;
};

export type AppointmentPrepCard = {
  appointmentId: string;
  likelihoodScore: MiniBrainScore;
  noShowRisk: MiniBrainScore;
  priorityScore: MiniBrainScore;
  prepChecklist: string[];
  recommendedConfirmationTemplate?: MiniBrainTemplateDraft;
  followUpTiming: string;
  linkedRecordWarnings: string[];
};

export type BillingUsageForecast = {
  forecastId: string;
  usageType: "ai" | "email" | "sms" | "contacts" | "workflows" | "unknown";
  currentUsage: number;
  cap?: number | null;
  usagePaceScore: MiniBrainScore;
  projectedCapExhaustionDate?: string | null;
  recommendedPlanAction: "none" | "buy_credit_pack" | "upgrade_plan" | "configure_byok" | "review_billing";
  explanation: string[];
  reviewRequired: true;
};

export type SetupReadinessScore = {
  score: MiniBrainScore;
  providerReadiness: MiniBrainScore;
  brandProfileReadiness: MiniBrainScore;
  firstCampaignReadiness: MiniBrainScore;
  firstWorkflowReadiness: MiniBrainScore;
  leadImportReadiness: MiniBrainScore;
  staffReadiness: MiniBrainScore;
  blockedBecause: string[];
  recommendedNextStep: string;
};

export type StaffWorkloadSummary = {
  staffId?: string | null;
  name: string;
  assignedOpenTasks: number;
  overdueTasks: number;
  capacityScore: MiniBrainScore;
  followUpQualityScore: MiniBrainScore;
  bottlenecks: string[];
  reassignmentSuggestion?: string;
};

export type BusinessHealthSummary = {
  dailySummary: string[];
  weeklyTrendSummary: string[];
  revenueForecast?: number;
  pipelineCoverageRatio?: number;
  leadResponseTimeScore: MiniBrainScore;
  salesActivityScore: MiniBrainScore;
  marketingEfficiencyScore: MiniBrainScore;
  crmHygieneScore: MiniBrainScore;
  operationalRiskScore: MiniBrainScore;
  topRisks: MiniBrainInsight[];
  topOpportunities: MiniBrainInsight[];
  recommendedActions: MiniBrainActionCard[];
};

export type SafetyCheckResult = {
  checkId: string;
  category:
    | "external_send_readiness"
    | "missing_opt_in"
    | "provider_setup"
    | "duplicate_data"
    | "spam_or_bad_contact"
    | "compliance"
    | "permission"
    | "sensitive_data"
    | "audit_log";
  passed: boolean;
  severity: MiniBrainInsight["priority"];
  message: string;
  blockingReason?: string;
  recommendedAction: string;
  reviewRequired: true;
  relatedRecords: MiniBrainInsight["relatedRecords"];
};

export type MiniBrainRuleMetadata = {
  id: string;
  category: MiniBrainInsightType;
  severity: "low" | "medium" | "high" | "urgent";
  requiredInputs: Array<keyof MiniBrainContext>;
  actionTypes: MiniBrainInsight["actionType"][];
  destination: string;
  enabledByDefault: boolean;
};

export type MiniBrainResult = {
  success: true;
  generatedAt: string;
  summary: Record<string, unknown>;
  scores: MiniBrainScore[];
  helperResults?: {
    leadScorecards?: LeadIntelligenceCard[];
    dealHealthCards?: DealHealthCard[];
    campaignHealthCards?: CampaignHealthCard[];
    conversationSummaries?: ConversationSummary[];
    workflowSignals?: WorkflowSignalCard[];
    taskPriorityCards?: TaskPriorityCard[];
    appointmentPrepCards?: AppointmentPrepCard[];
    billingUsageForecasts?: BillingUsageForecast[];
    setupReadiness?: SetupReadinessScore;
    staffWorkloadSummaries?: StaffWorkloadSummary[];
    businessHealth?: BusinessHealthSummary;
    safetyChecks?: SafetyCheckResult[];
  };
  insights: MiniBrainInsight[];
  recommendations: Array<Record<string, unknown>>;
  actions: string[];
  confidence: number;
  data_used: Record<string, unknown>;
  provider: "mini_brain";
  model: "deterministic-rules";
  fallback_used: false;
  provider_errors: [];
  provider_warnings: [];
};
