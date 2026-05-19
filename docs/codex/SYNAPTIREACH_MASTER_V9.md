```
# SynaptiReach Reusable Codex Master Prompt — V9 Updated After Mini-Brain Integration Pass

Use this prompt in Codex. It is intentionally reusable for multiple passes. Codex should inspect what already exists, complete only what remains, and preserve all working functionality. This V9 version preserves the full V8/V7/V6/V5/V4/V3 master scope below and adds the latest mini-brain integration status plus stronger instructions to keep upgrading the mini-brain as much as possible.

## V9 LATEST STATUS OVERRIDE — READ FIRST

This section supersedes older wording below where there is a conflict. Do not remove or ignore the preserved full master prompt after this section.

### Latest Codex mini-brain integration pass status

Codex implemented the V8 mini-brain integration pass and preserved the local-first AI architecture.

Treat the following as current unless a fresh repo inspection proves otherwise:

Local-AI architecture remains preserved:
- No local-AI redo was performed.
- Routing remains: deterministic mini-brain → Ollama dev → customer-local → backend/cloud → safe mock fallback.
- `ollama-dev` remains development-only.
- `customer-local` remains future/setup-required.
- `/api/ai/run` remains in place.
- `/api/ai/customer-local/test` remains in place.
- Do not make production users depend on developer `localhost` or customer-local Ollama for launch.

Mini-brain integration completed in latest pass:
- Added or updated:
  - `lib/intelligence/ruleRegistry.ts`
  - `lib/intelligence/leadIntelligence.ts`
  - `lib/intelligence/scoringConfig.ts`
  - `lib/intelligence/confidence.ts`
  - `lib/intelligence/explanations.ts`
  - `lib/intelligence/actionMapper.ts`
  - `lib/intelligence/contextBuilder.ts`
  - `lib/intelligence/persistence.ts`
  - `app/api/intelligence/summary/route.ts`
  - `app/api/intelligence/run/route.ts`
- Updated:
  - `lib/intelligence/miniBrain.ts`
  - `lib/intelligence/types.ts`
  - `lib/intelligence/simulationSignals.ts`
  - `src/ai/aiTypes.ts`
  - `src/ai/providers/deterministicMiniBrainProvider.ts`
  - `app/dashboard/page.tsx`
  - `app/dashboard/ai_assistant/page.tsx`
  - `lib/crm/supabaseAdmin.ts`
  - `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`
- Dashboard now shows compact Built-in Intelligence signals with reasoning/confidence.
- AI Assistant now shows detailed mini-brain insight cards.
- New intelligence API endpoints support transient mini-brain runs and optional explicit persistence into existing recommendation storage.
- `npm.cmd run build` passed.
- `.next/routes-manifest.json` exists.
- The final Codex output line about stale `.next/server/vendor-chunks/@supabase.js...` was truncated; re-check this in the next pass and confirm whether stale Supabase vendor chunk issues are resolved.

### Important Task 20 status clarification

Task 20 is now significantly implemented, but it is not considered “maximum intelligence complete.” Treat it as:

- Foundation: complete.
- Dashboard + AI Assistant integration: partially complete/initially integrated.
- Full CRM-wide mini-brain integration: still remaining.
- Deep action execution/review queue integration: still remaining.
- Per-page insight panels and metric modal integration: still remaining unless inspection proves otherwise.
- Persistent recommendations, notifications, and workflow signal integration: partially complete and must be verified.
- Test workspace mini-brain/simulation integration: partially complete and must be live-verified.

Codex must keep upgrading the mini-brain as much as possible. Do not mark Task 20 fully done until mini-brain intelligence is visible, useful, explainable, and actionable across the User CRM.

### Immediate V9 priority order

After briefly verifying Task 1 and Task 2 status:

1. Confirm `npm.cmd run build` still passes.
2. Confirm the full Supabase schema remains applied and the schema file stays idempotent/non-destructive.
3. Confirm the local-AI architecture is preserved and no secrets are exposed client-side.
4. Continue live bootstrap/seed/tick verification for Task 3 / Task 2A if local env/secrets are available.
   - If secrets/env are not available inside Codex, do not block all progress forever; document exact commands and continue safe code-level work that does not require live secrets.
5. Continue Task 20 and upgrade the mini-brain as deeply as possible before moving deeply into unrelated tasks.
6. Integrate mini-brain intelligence into every User CRM page where useful:
   - `/dashboard`
   - `/dashboard/analytics`
   - `/dashboard/leads`
   - `/dashboard/pipeline`
   - `/dashboard/tasks`
   - `/dashboard/calendar`
   - `/dashboard/marketing`
   - `/dashboard/communications`
   - `/dashboard/workflow`
   - `/dashboard/ai_assistant`
   - `/dashboard/settings`
7. Keep every mini-brain output zero-cost, deterministic, structured, explainable, confidence-scored, review-gated, and safe.
8. Do not let mini-brain, local AI, or cloud AI perform irreversible external actions without human confirmation.
9. Run `npm.cmd run build`.
10. Update `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
11. Final report must clearly separate:
   - local-AI status,
   - mini-brain Task 20 status,
   - full master Task 1-24 status,
   - completed/skipped/partial/remaining task numbers,
   - files changed,
   - exact test commands,
   - whether another pass is needed.

### Task 20 deep-upgrade requirements for next pass

Codex must inspect the current mini-brain modules and continue upgrading them. Do not duplicate modules already created; improve, connect, and verify them.

Required mini-brain improvements:

1. CRM-wide context builder
- Build a normalized `MiniBrainContext` from real CRM data.
- Include leads, deals, tasks, appointments, communications, campaigns, workflows, recommendations, notifications, usage/billing, staff, provider settings, onboarding/setup state, and workspace metadata where available.
- Must handle empty workspaces safely.
- Must support the simulated test workspace without leaking test data to normal workspaces.

2. Rule registry expansion
- Add stable rule IDs, categories, severity, confidence, required inputs, output action types, and recommended destinations.
- Make rules easy to enable/disable by workspace/settings later.
- Add scoring weights to `scoringConfig.ts` instead of hardcoding magic numbers everywhere.

3. Explainable insight generation
- Every insight should include:
  - title,
  - summary,
  - reasoning bullets,
  - confidence,
  - priority,
  - related records,
  - recommended action,
  - action type,
  - destination page,
  - safe review-gated next step.
- No vague “AI says” wording for deterministic mini-brain outputs.
- Label rule-based suggestions as built-in intelligence where appropriate.

4. Lead intelligence upgrades
- Lead fit score.
- Lead intent score.
- Engagement score.
- Freshness score.
- Duplicate lead detection.
- Lead source quality scoring.
- Lifecycle stage prediction.
- Recommended next stage.
- “Why this lead matters.”
- “What changed since last review.”
- Next-best-action by lead status/source/engagement.
- Add lead page cards/modals/actions that consume these outputs.

5. Pipeline/deal intelligence upgrades
- Deal health score.
- Close probability adjustment.
- Weighted pipeline forecast.
- Deal velocity.
- Stalled-stage detection.
- Close-date risk.
- Lost-deal reason pattern detection.
- Next best action by stage.
- Revenue-at-risk alerts.
- High-value opportunity alerts.
- Add pipeline page cards/modals/actions that consume these outputs.

6. Communication intelligence upgrades
- Response urgency detection.
- Unanswered conversation detection.
- Objection detection.
- Buying-signal detection.
- Appointment-signal detection.
- Sentiment approximation from keywords.
- Conversation summary without LLM.
- Suggested response type: follow-up, answer question, book call, send offer, nurture.
- Safe rule-based SMS/email templates by situation.
- Must integrate with review-gated communications flow; never auto-send.

7. Campaign/marketing intelligence upgrades
- Campaign health score.
- Open/click/convert interpretation.
- Underperforming campaign detection.
- Audience fatigue detection.
- Opened-not-clicked segment.
- Clicked-not-converted segment.
- Best follow-up channel suggestion.
- Campaign timing suggestions.
- Subject-line pattern tracking if data exists.
- “What to try next” rules.
- Add marketing page cards/modals/actions that consume these outputs.

8. Workflow intelligence upgrades
- Workflow opportunity detection.
- Workflow risk detection.
- Approval queue prioritization.
- Automation coverage score.
- Missed automation opportunity detection.
- Workflow conflict detection.
- Workflow stale/failure detection.
- Suggested workflow templates based on CRM data.
- Live workflow signals should consume mini-brain outputs.

9. Task intelligence upgrades
- Task priority scoring.
- Staff workload balancing.
- Overdue impact scoring.
- Suggested assignee.
- Task deduplication.
- “Today’s focus” list.
- Task batching by lead/deal/campaign.
- Aging task escalation.
- Add approve/deny/assign behavior where appropriate and review-gated.

10. Appointment intelligence upgrades
- Appointment likelihood detection.
- No-show risk score.
- Pre-call prep summary.
- Post-call follow-up recommendation.
- Appointment reminder suggestions.
- Appointment-to-deal conversion tracking.
- Add calendar page cards/modals/actions that consume these outputs.

11. Billing/trial/usage intelligence upgrades
- Usage pace prediction.
- Projected cap exhaustion date.
- Trial conversion readiness score.
- Credit-pack recommendation.
- Plan upgrade recommendation.
- BYOK readiness checklist.
- Managed-key risk alerts.
- Keep all billing/payment actions review/checkout gated.

12. Business health intelligence upgrades
- Daily executive summary without LLM.
- Weekly trend summary.
- Revenue forecast.
- Pipeline coverage ratio.
- Lead response time score.
- Sales activity score.
- Marketing efficiency score.
- CRM hygiene score.
- Top 5 risks.
- Top 5 opportunities.
- Add dashboard/analytics/AI assistant surfaces that consume these outputs.

13. Onboarding/setup intelligence upgrades
- Setup completeness score.
- Missing configuration detector.
- Provider readiness checklist.
- CSV import quality score.
- Brand profile completeness.
- Recommended next onboarding step.
- DFY upsell trigger when setup becomes too complex.
- Prepare this for the future onboarding overhaul prompt without forcing a full onboarding rebuild in this pass unless already in scope.

14. Staff/team intelligence upgrades
- Staff performance metrics.
- Assigned workload.
- Overdue tasks by staff.
- Response time by staff.
- Permission-risk warnings.
- Task reassignment suggestions.
- Keep permissions respected.

15. Safety/compliance intelligence upgrades
- External-send readiness checks.
- Missing opt-in warning.
- SMS provider setup warning.
- Suspicious duplicate data warning.
- Possible spam/bad contact detection.
- Review-required enforcement.
- Provider setup-required checks.
- No send/charge/post action should happen without explicit user confirmation and valid provider setup.

16. Persistence and recommendation queue
- `app/api/intelligence/run` should support transient mode and explicit persist/recommendation mode.
- Persisted mini-brain recommendations should map into existing recommendation tables when available.
- Persisted actions must be deduplicated where possible to avoid spamming repeated recommendations.
- Add source metadata:
  - `source: mini_brain`
  - `rule_id`
  - `confidence`
  - `generated_at`
  - `related_records`
  - `review_required: true`
- Do not persist endlessly on every page load.

17. UI integration requirements
- Every page integration must preserve the dark/glass/cyan-green SynaptiReach design.
- Use compact sections so pages do not become cluttered.
- Include loading/error/empty states.
- Include “why this matters” explanations.
- Include action buttons where safe:
  - create task draft,
  - create workflow draft,
  - open related record,
  - draft message,
  - dismiss/deny,
  - approve where review-gated.
- Do not auto-send external messages.
- Do not auto-charge.
- Do not auto-post social content.

18. Test requirements
- Test empty workspace behavior.
- Test seeded simulation workspace behavior if env allows.
- Test no-AI-provider mode.
- Test provider failure fallback to mini-brain.
- Test that page loads do not repeatedly persist duplicates.
- Test that normal users do not see test/simulation-only intelligence controls.
- Run `npm.cmd run build`.

### Remaining master tasks reminder

Do not lose the full launch scope. Tasks 5-19 and 21-24 remain unless inspection proves they are complete. Task 3 live verification remains important. Task 20 should keep improving until fully integrated, but the full master prompt still includes:

- subscription trial checkout/autorenewal,
- tiers/caps/BYOK/managed plans,
- services/bundles/retainers,
- public services/contact/waitlist pages,
- industry pages,
- public informational pages,
- dashboard compaction,
- metric popups across CRM pages,
- AI Command Center,
- workflow templates/signals,
- marketing recommendation polish,
- AI task recommendations,
- review-gated email/SMS replies,
- notification mark-read behavior,
- contact/support/admin notifications,
- final build/tests/docs.

---


# SynaptiReach Reusable Codex Master Prompt — V8 Updated After Expanded Mini-Brain Foundation Pass

Use this prompt in Codex. It is intentionally reusable for multiple passes. Codex should inspect what already exists, complete only what remains, and preserve all working functionality. This V8 version preserves the full V7/V6/V5/V4/V3 master scope below and adds the latest Task 20 mini-brain foundation status plus stronger instructions to keep upgrading the mini-brain as much as possible.

## V8 LATEST STATUS OVERRIDE — READ FIRST

This section supersedes older wording below where there is a conflict. Do not remove or ignore the preserved full master prompt after this section.

### Latest Codex expanded mini-brain foundation pass status

Codex continued from the current working tree and did not redo the local-AI implementation.

Treat the following as current unless a fresh repo inspection proves otherwise:

Local-AI correction architecture is preserved:
- Server-first AI env vars remain preferred.
- `VITE_*` remains alias-only.
- `ollama-dev` remains local development only.
- `customer-local` remains future-ready/setup-required by default.
- `/api/ai/run` remains in place.
- `/api/ai/customer-local/test` remains in place.
- AI routing order remains:
  1. deterministic mini-brain,
  2. local Ollama dev,
  3. customer-local,
  4. backend/cloud,
  5. safe mock fallback.
- `npm.cmd run build` passed.

Task 20 mini-brain foundation was implemented:
- Added `lib/intelligence/types.ts`.
- Added or expanded `miniBrain.ts`.
- Added lead, deal, pipeline, campaign, communication, task, appointment, workflow, billing, onboarding, business-health, and safety intelligence modules.
- Added forecasting, anomaly detection, intent detection, next-best-action, CRM hygiene, staff intelligence, and simulation extension points.
- `runDeterministicAgents()` now uses `runMiniBrain()` first while preserving existing dashboard-compatible outputs.
- AI router deterministic provider can now return precomputed mini-brain text or run a supplied mini-brain context before Ollama/cloud.
- AI Assistant page shows mini-brain insight availability and routes new action types to the right CRM pages.
- `npm.cmd run build` passed.

Files changed in the latest mini-brain pass included at least:
- `lib/agents/crmAgents.ts`
- `src/ai/providers/deterministicMiniBrainProvider.ts`
- `app/dashboard/ai_assistant/page.tsx`
- `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`
- plus new `lib/intelligence/*` files and any related modules discovered during inspection.

Full master task status after the latest pass:
- Completed or verified this pass:
  - Task 1: build health verified with `npm.cmd run build`.
  - Task 2: schema status accepted as applied; build-safe Supabase guards preserved.
  - Task 20: expanded deterministic mini-brain foundation implemented and build-verified.
- Skipped because already completed/preserved:
  - Local-AI correction numbered items 1-13 from the previous local-AI prompt.
  - Task 4 demo/nav timeout fixes from previous pass.
- Partially complete:
  - Task 3 / Task 2A: bootstrap/seed/tick foundation exists, but live Supabase bootstrap/seed/tick/browser verification still needs real configured secrets/env execution.
  - Task 20: core mini-brain engine exists, but deeper per-page modal/action integrations, persistence, feedback loops, tuning, and visible CRM intelligence experiences must continue in later passes.
- Remaining:
  - Tasks 5-19 remain.
  - Tasks 21-24 remain as previously tracked split-out work.
  - Live Task 3 verification remains the next blocker before moving deeply into billing/services/contact/waitlist work.

Important clarification:
- Do not treat Task 20 as truly finished just because the foundation exists.
- From now on, Task 20 should be treated as **partially complete / foundation complete** until Codex has deeply integrated the mini-brain across all relevant pages, action flows, modals, recommendations, workflows, notifications, and the simulated test workspace.
- The next prompt/run should keep upgrading the mini-brain as much as possible while preserving all completed local-AI and CRM work.

### Immediate V8 priority order

Before making changes, briefly inspect and report current status for Tasks 1, 2, 3/2A, 20, and all remaining tasks.

Next pass priority:
1. Verify `npm.cmd run build` still passes.
2. Confirm schema status remains applied and no new Supabase schema changes are needed for the mini-brain; if schema changes are needed, add them idempotently only.
3. If test simulation env vars are available, live-verify Task 3/2A bootstrap/seed/tick/browser flow. If not available, do not block coding forever; document that live verification remains user-side and continue mini-brain enhancement.
4. Upgrade Task 20 as much as possible, not just the foundation.
5. Deeply integrate mini-brain insights into CRM pages, actions, modals, recommendation queues, workflow signals, agent runs, notifications, and the AI Assistant.
6. Keep all mini-brain output zero-cost, deterministic, structured, explainable, review-gated, and safe.
7. Do not let mini-brain perform irreversible external actions by itself.
8. Do not redo local-AI architecture unless inspection shows it is broken.
9. Run `npm.cmd run build` after the mini-brain integration group.
10. Update `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
11. In the final report, clearly separate:
    - local-AI architecture status,
    - mini-brain foundation status,
    - mini-brain integration status,
    - full master Task 1-24 status,
    - completed/skipped/partial/remaining task numbers,
    - exact files changed,
    - exact commands to test,
    - whether another pass is needed.

### V8 Task 20 expansion — make the mini-brain as AI-like as possible without AI API cost

Codex must expand the deterministic mini-brain from a foundation into a practical CRM intelligence system that feels AI-like while remaining rules-based, explainable, deterministic, cheap, safe, and review-gated.

Core principles:
- Mini-brain runs before external AI whenever possible.
- Mini-brain should produce useful output even when Gemini/OpenRouter/OpenAI/Ollama/customer-local are unavailable.
- Mini-brain should never auto-send email/SMS/social posts or make payment/subscription decisions.
- Mini-brain should draft, score, rank, explain, recommend, detect, summarize, group, and route.
- Mini-brain outputs should be structured and machine-actionable, not only text.
- External AI may later enhance the mini-brain output, but external AI should not be required for the core recommendation to exist.
- Every recommendation should include reasoning, confidence, related records, recommended next action, and review-gated action type.
- Use real CRM data only for normal users. Only the explicit test workspace may use simulation data.

Required normalized mini-brain output shape:

```ts
type MiniBrainInsight = {
  id: string;
  type:
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
    | "simulation";
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
    | "flag_risk"
    | "open_modal"
    | "no_action";
  relatedRecords: Array<{ type: string; id: string; label: string }>;
  confidence: number;
  source: "mini_brain";
  createdAt: string;
  metadata?: Record<string, unknown>;
};
```

Also create or use companion score types where useful:

```ts
type MiniBrainScore = {
  label: string;
  score: number;
  maxScore: number;
  band: "poor" | "watch" | "fair" | "good" | "excellent";
  reasons: string[];
  nextAction?: string;
};
```

#### A. Intelligence rule registry and orchestration

Build a central registry/orchestrator so rules are easy to extend and tune:
- `lib/intelligence/miniBrain.ts`
- `lib/intelligence/types.ts`
- `lib/intelligence/ruleRegistry.ts`
- `lib/intelligence/scoringConfig.ts`
- `lib/intelligence/contextBuilder.ts`
- `lib/intelligence/actionMapper.ts`
- `lib/intelligence/explanations.ts`
- `lib/intelligence/confidence.ts`
- `lib/intelligence/persistence.ts` if needed

Capabilities:
- Load normalized CRM context from dashboard/leads/deals/tasks/campaigns/communications/workflows/appointments/settings/usage/staff.
- Run domain modules in a deterministic order.
- Deduplicate overlapping insights.
- Merge similar insights into grouped recommendations.
- Prioritize urgent items.
- Return summary sections for pages and detailed record-level insights for modals.
- Include user/workspace/company IDs where safe.
- Support test workspace simulation context without leaking to normal users.

#### B. Lead Intelligence upgrades

Implement or deepen:
- lead fit score
- lead intent score
- lead engagement score
- lead freshness score
- lead temperature
- duplicate lead detection
- duplicate confidence and merge suggestion
- lead source quality scoring
- source ROI proxy score
- lead lifecycle stage prediction
- recommended next stage
- lost/nurture/converted risk signals
- high-intent signal detection
- lead response speed score
- missing contact info warning
- lead completeness score
- stale lead reason detection
- best next channel suggestion
- “why this lead matters” explanation
- “what changed since last review” summary using timestamps/activity deltas
- next best action based on status/source/temperature/last interaction

#### C. Pipeline / Deal Intelligence upgrades

Implement or deepen:
- deal health score
- close probability adjustment
- weighted pipeline forecast
- pipeline coverage ratio
- deal velocity tracking
- stage aging
- stalled-stage detection
- close-date risk detection
- expected close-date slip warning
- lost-deal reason pattern detection
- high-value opportunity alert
- revenue-at-risk alert
- next best action by deal stage
- deal owner workload/risk
- stage conversion bottleneck detection
- stale high-value deal escalation
- won/lost ratio insight
- forecast by time horizon: 7/14/30/60/90 days if data supports it

#### D. Communication Intelligence upgrades

Implement or deepen:
- response urgency detection
- unanswered conversation detection
- unread inbound reply detection
- objection detection from keywords/phrases
- buying-signal detection
- appointment-signal detection
- cancellation/no-show signal detection
- sentiment approximation from keywords
- conversation summary without LLM
- suggested response type:
  - follow-up
  - answer question
  - book call
  - send offer
  - nurture
  - clarify need
  - handle objection
  - request review
  - no response needed
- safe rule-based SMS/email templates by situation
- recommended follow-up timing
- do-not-send / missing opt-in / suppression warning
- conversation aging and SLA risk
- channel preference inference

#### E. Campaign Intelligence upgrades

Implement or deepen:
- campaign health score
- open/click/convert interpretation
- underperforming campaign detection
- audience fatigue detection
- opened-not-clicked segment detection
- clicked-not-converted segment detection
- best follow-up channel suggestion
- campaign timing recommendations
- subject-line pattern tracking
- failed/send-error pattern detection
- unsubscribe/suppression warning
- best audience segment suggestion
- campaign-to-pipeline influence proxy
- “what to try next” rules
- recommended A/B test suggestions
- re-engagement segment suggestions
- campaign activity anomaly detection

#### F. Workflow Intelligence upgrades

Implement or deepen:
- workflow opportunity detection
- workflow risk detection
- approval queue prioritization
- automation coverage score
- missed automation opportunities
- workflow conflict detection
- workflow stale/failure detection
- workflow run failure grouping
- suggested workflow templates based on CRM data
- recommended workflow toggle state
- workflow explainers for each template
- recommended review-gated workflow action
- live workflow signals with counts and detail modal data
- mapping mini-brain insights to workflow drafts

#### G. Task Intelligence upgrades

Implement or deepen:
- task priority scoring
- staff workload balancing
- overdue impact scoring
- suggested assignee
- task deduplication
- “today’s focus” list
- task batching by lead/deal/campaign
- aging task escalation
- missed follow-up detection
- task-to-revenue influence proxy
- task deadline risk
- suggested due date
- suggested task title/body from record context
- approve/deny/assign behavior for mini-brain task suggestions

#### H. Appointment Intelligence upgrades

Implement or deepen:
- appointment likelihood detection
- no-show risk score
- pre-call prep summary
- post-call follow-up recommendation
- appointment reminder suggestions
- appointment-to-deal conversion tracking
- appointment intent from communications
- appointment confirmation confidence
- reschedule/cancellation detection
- appointment owner readiness
- agenda suggestion without external AI
- “what to review before the call” checklist

#### I. Billing / Trial / Usage Intelligence upgrades

Implement or deepen:
- usage pace prediction
- projected cap exhaustion date
- trial conversion readiness score
- credit-pack recommendation
- plan upgrade recommendation
- BYOK readiness checklist
- managed-key risk alerts
- Stripe setup/payment attention flags
- failed payment risk insight
- credit usage anomaly detection
- trial ending urgency levels
- “what happens next” billing explanation
- usage cost explainers without exposing internal secrets

#### J. Business Health Intelligence upgrades

Implement or deepen:
- daily executive summary without LLM
- weekly trend summary without LLM
- revenue forecast
- pipeline coverage ratio
- lead response time score
- sales activity score
- marketing efficiency score
- CRM hygiene score
- operational health score
- growth momentum score
- conversion readiness score
- top 5 risks
- top 5 opportunities
- what changed today/this week
- “focus now / next / later” prioritization
- board-style executive overview suitable for Dashboard and AI Assistant

#### K. Onboarding / Setup Intelligence upgrades

Implement or deepen:
- setup completeness score
- missing configuration detector
- provider readiness checklist
- CSV import quality score
- brand profile completeness
- recommended next onboarding step
- DFY upsell trigger when setup becomes too complex
- launch readiness score
- workspace data readiness score
- first campaign readiness score
- payment/billing setup readiness
- BYOK readiness
- managed provider readiness
- staff setup readiness

#### L. Staff / Team Intelligence upgrades

Implement or deepen:
- staff performance metrics
- assigned workload
- overdue tasks by staff
- response time by staff
- permission-risk warnings
- task reassignment suggestions
- staff capacity score
- unassigned work detection
- owner bottleneck detection
- role-based recommendation visibility
- staff activity summary
- staff handoff suggestions

#### M. Safety / Compliance Intelligence upgrades

Implement or deepen:
- external-send readiness checks
- missing opt-in warning
- SMS provider setup warning
- email provider setup warning
- suspicious duplicate data warning
- possible spam/bad contact detection
- suppression-list warning
- review-required enforcement
- unsafe auto-send prevention
- missing provider key warning
- BYOK secret visibility warning
- workspace data isolation warning
- admin-only action warning
- audit-log suggestion for sensitive actions

#### N. Simulation-aware intelligence

For the dedicated test workspace only:
- Mini-brain may create or enrich simulation recommendations.
- Mini-brain may support simulation tick outputs.
- Mini-brain may generate deterministic “agent-like” simulated business activity.
- Simulation data must remain marked with metadata:
  - `is_test_data: true`
  - `simulation_source: "synaptireach_test_workspace"`
  - `simulation_version`
- Normal users must never receive simulated data.

#### O. Persistence and review queue

Where schema already supports it, persist mini-brain recommendations to existing tables such as:
- `crm_ai_recommendations`
- `crm_agent_runs`
- `crm_notifications`
- workflow runs / workflow signals tables if present

If schema does not support safe persistence, keep insights transient and clearly document what remains.

Requirements:
- Avoid duplicate recommendations.
- Use deterministic IDs or idempotency keys where practical.
- Allow approve/deny/dismiss where UI already supports it.
- Map approve actions to safe review-gated outcomes:
  - create task draft
  - create workflow draft
  - draft message
  - create notification
  - open detail modal
  - suggest staff assignment
- Never auto-send external messages.

#### P. Page integrations required for mini-brain

Integrate mini-brain insights into:
- `/dashboard`
  - executive summary
  - top risks/opportunities
  - compact intelligence panel
  - metric detail modals
  - pipeline summary
  - autonomous agent status
- `/dashboard/analytics`
  - business health summary
  - metric explanations
  - trend interpretation
- `/dashboard/leads`
  - lead cards/detail panel
  - duplicate review
  - next stage suggestion
  - pipeline graphic explanations
  - metric popups
- `/dashboard/pipeline`
  - deal health
  - forecast/risk insights
  - create deal guidance
  - card popups
- `/dashboard/tasks`
  - AI/mini-brain task recommendations
  - today’s focus
  - assign/approve/deny
- `/dashboard/calendar`
  - appointment intent
  - no-show risk
  - pre-call prep
  - upcoming appointment warnings
- `/dashboard/marketing`
  - campaign performance explanation
  - recommendations approve/deny
  - activity interpretation
- `/dashboard/communications`
  - conversation urgency
  - suggested response type
  - safe templates
  - response readiness checks
- `/dashboard/workflow`
  - live workflow signals
  - template suggestions
  - approval prioritization
- `/dashboard/ai_assistant`
  - AI Command Center should show mini-brain insights
  - recommendations should indicate when source is mini-brain
  - action links should route to correct pages
- `/dashboard/settings`
  - billing/usage warnings
  - provider readiness
  - BYOK/setup readiness
  - Local Connector status remains setup-required/future-ready

#### Q. UI/UX requirements for mini-brain

- Label deterministic output as “Built-in Intelligence” or “Mini-Brain” where useful.
- Do not make it look like an external paid AI call was used if it was not.
- Add provider/source metadata:
  - source: mini_brain
  - local: true/false where relevant
  - providerUsed: deterministic or mini_brain
  - fallbackUsed: false
- Make insight cards compact, premium, and consistent with SynaptiReach dark UI.
- Allow details modal for insight reasoning.
- Add quick actions where safe.
- Add empty states when no insight is needed.
- Add loading/error states where server fetches are involved.

#### R. Testing requirements for mini-brain

Add smoke-test helpers or API tests where practical:
- run mini-brain against empty workspace
- run mini-brain against seeded test workspace
- verify no crashes with missing optional arrays
- verify no external provider call is required
- verify no external send happens
- verify output includes reasoning/confidence/action type
- verify build passes

Update `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md` with:
- files added
- modules added
- mini-brain capabilities
- pages integrated
- commands to test
- remaining limitations

---



# SynaptiReach Reusable Codex Master Prompt — V7 Updated After Local AI Correction Pass + Expanded Mini-Brain

Use this prompt in Codex. It is intentionally reusable for multiple passes. Codex should inspect what already exists, complete only what remains, and preserve all working functionality. This V7 version preserves the full V6/V5/V4/V3 master scope below and adds the latest local-AI correction status from Codex.

## V7 LATEST STATUS OVERRIDE — READ FIRST

This section supersedes older wording below where there is a conflict. Do not remove or ignore the preserved full master prompt after this section.

### Latest Codex local-AI correction pass status

Codex completed a focused correction pass on top of the previously added local-first AI work.

Treat the following as current unless a fresh repo inspection proves otherwise:

Completed in the local-AI correction pass:
- Preferred Next/server environment variables are now:
  - `AI_DEFAULT_PROVIDER`
  - `AI_ENABLE_LOCAL`
  - `AI_ENABLE_OLLAMA_DEV`
  - `OLLAMA_BASE_URL`
  - `OLLAMA_MODEL`
- `VITE_*` variables are preserved only as backward-compatible aliases.
- `ollama-dev` remains development-only and local-task-only.
- A future-ready customer-local provider interface was added.
- `POST /api/ai/customer-local/test` was added.
- AI routing order was updated to:
  1. deterministic mini-brain,
  2. local Ollama dev,
  3. customer-local,
  4. backend/cloud,
  5. safe mock fallback.
- Guarded Supabase client creation was added so builds do not crash when Supabase env is missing.
- `docs/local-ai.md` was updated.
- `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md` was updated around local AI status.
- `npm.cmd run build` passed.

Important clarification:
- Codex’s “Completed: 1, 2, 3, ... 13” in that local-AI correction report refers only to the numbered items in the local-AI correction prompt, not the full master Tasks 1-24 in this reusable master prompt.
- Codex must still continue tracking and reporting the full master Tasks 1-24 by task number.

### Current confirmed Supabase status

- The full `supabase/user_crm_full_completion_schema.sql` has now run successfully in Supabase after the schema-column repair.
- Treat the prior `step_order` and `status` SQL errors as resolved for the user’s current database.
- Still keep the schema file idempotent and safe for future existing databases.
- Continue preserving the V5 schema guidance:
  - do not rely only on `CREATE TABLE IF NOT EXISTS`;
  - any existing-table column used by an index, trigger, API route, insert, update, select, or order-by must have an `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` repair block before use;
  - do not use `DROP`, `TRUNCATE`, or destructive data changes.

### Local AI strategy after correction

Preserve the corrected local AI architecture. Do not redo it from scratch.

Production strategy:
1. Deterministic mini-brain runs first whenever possible to reduce AI costs.
2. Ollama/Gemma remains development-only for now.
3. BYOK cloud providers remain available for advanced users.
4. SynaptiReach-managed cloud AI remains capped by credits/usage.
5. Future customer-local AI connector remains planned after the main launch work is complete.

Do not require customers to run Ollama for launch.

Future AI processing mode language to preserve for later UI:
- SynaptiReach Managed
- Bring Your Own Keys
- Local Connector

Customer-local provider guidance:
- The current `customer-local` interface and `/api/ai/customer-local/test` should remain future-ready and disabled/setup-required by default unless already safely configured.
- Do not make production users depend on the developer laptop’s `localhost`.
- Do not make phone/tablet users depend on local Ollama.
- The future Local Connector should remain an optional enhancement:
  - customer machine runs Ollama at `localhost:11434`;
  - SynaptiReach Local Connector exposes a safe local endpoint such as `localhost:31337`;
  - connector handles CORS, pairing token, model checks, health checks, and task calls;
  - web app detects connector and sends only lightweight tasks;
  - fallback is mini-brain, BYOK cloud, or SynaptiReach-managed cloud.

### Immediate V7 priority order

After briefly verifying Task 1 and Task 2 status:
1. Confirm the full schema remains applied and the app build still passes.
2. Verify the corrected local-AI architecture is still build-safe and does not expose secrets client-side.
3. Continue live bootstrap/seed/tick verification for Task 3 / Task 2A if it has not already been live-verified.
4. Expand and implement Task 20 as the powerful deterministic CRM mini-brain intelligence engine described below.
5. Integrate mini-brain outputs into the CRM pages and AI provider router where appropriate.
6. Keep all mini-brain output zero-cost, deterministic, structured, explainable, review-gated, and safe.
7. Do not let mini-brain or local AI perform irreversible external actions by itself.
8. Run `npm.cmd run build`.
9. Update `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
10. In the final report, clearly separate:
    - local-AI correction status,
    - full master Task 1-24 status,
    - completed/skipped/partial/remaining task numbers,
    - exact files changed,
    - exact commands to test,
    - whether another pass is needed.

### Do not redo unless broken

Do not rebuild these from scratch unless inspection shows they are broken:
- local-first AI provider layer,
- `aiClient.runTask`,
- AI router,
- Ollama dev provider,
- customer-local provider interface,
- `/api/ai/run`,
- `/api/ai/customer-local/test`,
- docs/local-ai.md,
- guarded Supabase env/build logic.

Instead, verify, polish, integrate with mini-brain, and continue the remaining master tasks.

---




# SynaptiReach Reusable Codex Master Prompt — V6 Updated With Expanded Mini-Brain Intelligence + Local Connector Strategy

Use this prompt in Codex. It is intentionally reusable for multiple passes. Codex should inspect what already exists, complete only what remains, and preserve all working functionality.

## V6 LATEST STATUS OVERRIDE — READ FIRST

This section supersedes older wording below where there is a conflict.

### Current confirmed status

- The full `supabase/user_crm_full_completion_schema.sql` has now run successfully in Supabase after the schema-column repair.
- Treat the prior `step_order` and `status` SQL errors as resolved for the user’s current database, but keep the schema file idempotent and safe for future existing databases.
- Continue to preserve the V5 schema guidance: do not rely only on `CREATE TABLE IF NOT EXISTS`; any existing-table column used by an index, trigger, API route, insert, update, select, or order-by must have an `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` repair block before use.
- Continue from the current working tree. Do not restart from scratch.
- Codex must still report exactly which task numbers are completed, skipped, partially complete, and remaining on every pass.

### Local AI strategy update

The user wants to reduce SynaptiReach AI credit costs as much as possible while preserving a good launch experience.

Production strategy:
1. Make the deterministic SynaptiReach mini-brain much smarter and use it first whenever possible.
2. Keep Ollama/Gemma as a development-only provider for now.
3. Keep BYOK cloud providers for advanced users.
4. Keep SynaptiReach-managed cloud AI capped by credits/usage.
5. Plan a future customer-local AI connector after the main launch work is complete.

Do not require customers to run Ollama for launch.

Future AI processing mode language to preserve for later UI:
- SynaptiReach Managed
- Bring Your Own Keys
- Local Connector

Local Connector direction for later:
- Keep SynaptiReach primarily as a web app for broad access across desktop, laptop, tablet, Android, and Apple devices.
- Do not convert the whole product into desktop-only software.
- Later, optionally add a companion SynaptiReach Local Connector for desktop/laptop users who want local AI.
- The web app remains the main product; the Local Connector becomes an optional enhancement.
- The Local Connector should eventually run on the customer machine, talk to Ollama at `localhost:11434`, expose a safe local connector endpoint such as `localhost:31337`, handle CORS, pairing tokens, model checks, and task calls, then let the web app send only lightweight AI tasks to it.
- The connector still requires the customer to install/run Ollama and download the local model such as `gemma3:1b`, unless a future packaged desktop app bundles a model/runtime.
- Phone/tablet users should use mini-brain, BYOK cloud, or SynaptiReach-managed cloud AI. Do not depend on phone/tablet local Ollama.

### Immediate V6 priority

After briefly verifying Task 1 / Task 2 status:
1. Confirm the full schema is now considered successfully applied.
2. Continue live bootstrap/seed/tick verification for Task 3 / Task 2A if not already live-verified.
3. Expand Task 20 into a much more powerful deterministic CRM intelligence engine.
4. Keep the mini-brain zero-cost, deterministic, structured, explainable, review-gated, and safe.
5. Integrate mini-brain outputs into the CRM pages and AI provider router where appropriate.
6. Do not let mini-brain make irreversible external actions by itself.
7. Run `npm.cmd run build`.
8. Update `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.

---



---

# Preserved Prior V5 Reusable Master Prompt

# SynaptiReach Reusable Codex Master Prompt — V5 Updated After Schema Column Repair + Local AI Guidance

Use this prompt in Codex. It is intentionally reusable for multiple passes. Codex should inspect what already exists, complete only what remains, and preserve all working functionality.

## V5 LATEST STATUS OVERRIDE — READ FIRST

This section supersedes any older wording later in this prompt where it conflicts.

### Current manual SQL issue

The latest Supabase run exposed that `supabase/user_crm_full_completion_schema.sql` is still not fully safe for existing databases where tables already exist but are missing newer columns.

Observed errors:
- `ERROR: 42703: column "step_order" does not exist`
- Confirmed failing index:
  `create index if not exists idx_marketing_campaign_steps_campaign on public.marketing_campaign_steps(campaign_id, step_order);`
- After manually patching `step_order`, the full schema then failed with:
  `ERROR: 42703: column "status" does not exist`

Root cause:
- `CREATE TABLE IF NOT EXISTS` does not add missing columns to existing tables.
- Existing Supabase tables were created in earlier migrations with older shapes.
- The schema file creates indexes against columns that may not exist on already-existing tables.
- Codex must fix the schema file so every table receives all required additive columns via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` before any index, trigger, insert, update, select, constraint, or order-by references those columns.

Immediate Task 2 / schema priority:
1. Inspect every `CREATE INDEX`, trigger, upsert, query reference, and route write target that references columns in `supabase/user_crm_full_completion_schema.sql`.
2. Add an idempotent repair block before indexes that performs `ALTER TABLE IF EXISTS ... ADD COLUMN IF NOT EXISTS ...` for every required column on every table that might already exist.
3. Specifically fix at minimum:
   - `public.marketing_campaign_steps.step_order`
   - `public.marketing_campaign_steps.status`
   - `public.marketing_ai_recommendations.status`
   - `public.marketing_campaign_logs.status`
   - `public.marketing_automation_queue.status`
   - `public.marketing_retry_queue.status`
   - any other `status`, `created_at`, `updated_at`, `workspace_id`, `company_id`, `user_id`, `metadata`, `campaign_id`, or indexed column referenced by this file.
4. Do not rely on the `CREATE TABLE IF NOT EXISTS` definitions alone.
5. Do not drop, truncate, or destructively modify existing data.
6. After updating the schema, provide a short preflight SQL block the user can run to add missing columns before rerunning the full file.
7. Run `npm.cmd run build`.
8. Update `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md` with the schema repair status.

### Local AI / Ollama status

The user installed Ollama locally on Windows and is testing:
- Model: `gemma3:1b`
- Local Ollama base URL: `http://localhost:11434`
- Chat endpoint: `POST http://localhost:11434/api/chat`

Codex was given a local-first AI prompt. Treat local AI as an additional future/provider task, not a replacement for the existing AI stack.

Important architecture constraints:
- A Vercel-hosted website cannot directly use the site owner's laptop Ollama instance for all users.
- In production, `localhost:11434` points to the runtime machine, not every customer’s machine. On Vercel, that is not the user’s laptop and not the developer’s laptop.
- Browser calls to a customer’s `localhost:11434` are unreliable and may fail due to CORS, browser security, missing Ollama, networking, and user setup.
- Local Ollama should be treated as development-only unless a supported local connector/desktop companion app or explicit user-side local bridge is built.
- Do not expose private cloud provider API keys in frontend code.
- Avoid relying on `VITE_` variables in a Next.js app unless that build system actually uses Vite. For Next.js, use server-side env vars or `NEXT_PUBLIC_` only for values intentionally exposed to the browser.
- The production-safe architecture should be:
  1. Built-in deterministic mini-brain for low-cost logic.
  2. Optional dev-only server-side Ollama provider for local testing.
  3. Optional customer BYOK cloud providers.
  4. SynaptiReach-managed cloud fallback with caps/credits.
  5. Optional future local-user AI through a separately built desktop/local connector or browser WebLLM feature.

Local AI task guidance:
- Preserve existing Gemini/OpenRouter/OpenAI fallback behavior.
- Add a modular provider interface only if it does not break existing AI routes.
- Use Ollama locally for lightweight dev tasks only:
  - lead summaries
  - follow-up drafts
  - scoring explanations
  - campaign ideas
  - lightweight CRM recommendations
- Keep heavy tasks on backend/cloud:
  - investor reports
  - long-context analysis
  - autonomous multi-agent simulations
  - production secure tasks
- Every AI result should report provider metadata:
  - providerUsed
  - local
  - fallbackUsed
  - task
  - error if applicable
- UI must never crash if Ollama is unavailable.
- Add `docs/local-ai.md`.
- Do not move local AI work ahead of the urgent schema repair and live test-workspace bootstrap verification unless the user explicitly asks.

### Task ordering reminder

Next pass priority:
1. Fix the Supabase schema column safety issue first.
2. Re-run/verify the full schema.
3. Finish live bootstrap/seed/tick verification for the dedicated simulated test workspace.
4. Then continue the remaining launch tasks in order, while reporting exact task numbers completed each pass.

---



---

# SynaptiReach Reusable Codex Master Prompt — V4 Updated After Schema `step_order` Error

Use this prompt in Codex. It is intentionally reusable for multiple passes. Codex should inspect what already exists, complete only what remains, and preserve all working functionality.

## V4 LATEST STATUS OVERRIDE — READ FIRST

This section supersedes any older wording later in this prompt where there is a conflict.

Current manual Supabase SQL status:
- Running `supabase/user_crm_full_completion_schema.sql` failed with:
  `ERROR: 42703: column "step_order" does not exist`
- Search showed the failing reference is:
  `create index if not exists idx_marketing_campaign_steps_campaign on public.marketing_campaign_steps(campaign_id, step_order);`
- The schema file creates `step_order` inside the `CREATE TABLE IF NOT EXISTS public.marketing_campaign_steps (...)` block, but this does not fix already-existing tables that were created before `step_order` existed.
- Therefore Codex must fix `supabase/user_crm_full_completion_schema.sql` so it explicitly runs:
  `ALTER TABLE public.marketing_campaign_steps ADD COLUMN IF NOT EXISTS step_order integer not null default 1;`
  before any index, select, update, insert, order by, or constraint references `marketing_campaign_steps.step_order`.
- Codex must inspect every `step_order` reference in `supabase/user_crm_full_completion_schema.sql` and add idempotent `ALTER TABLE ... ADD COLUMN IF NOT EXISTS step_order ...` for the exact table being referenced before the reference.
- Do not only patch onboarding tables. The confirmed failing table is `public.marketing_campaign_steps`.
- Keep the schema file fully idempotent and non-destructive.
- Do not use `DROP`, `TRUNCATE`, destructive `DELETE`, or destructive rewrites.
- After patching the schema file, Codex must tell the user to rerun the full file in Supabase SQL Editor.

Immediate next-pass priority:
1. Fix the schema `step_order` issue first.
2. Run/verify `npm.cmd run build`.
3. Confirm the schema remains additive and safe.
4. Continue live Task 3 / Task 2A test workspace bootstrap/seed/tick verification.
5. Do not move to billing/services/waitlist/contact/public-page/metric-modal/AI-command-center/mini-brain/communications tasks until the schema applies cleanly and the simulation bootstrap flow is live-verified.

Required final report addition:
- Report the exact table(s) patched for `step_order`.
- Confirm whether `supabase/user_crm_full_completion_schema.sql` now contains an `ALTER TABLE public.marketing_campaign_steps ADD COLUMN IF NOT EXISTS step_order` before the index on `(campaign_id, step_order)`.
- Include the exact SQL-editor action the user must run next.

---


# Preserved Prior V3 Reusable Master Prompt

# SynaptiReach Reusable Codex Master Prompt — V3 Updated After Test Bootstrap Pass

Use this prompt in Codex. It is intentionally reusable for multiple passes. Codex should inspect what already exists, complete only what remains, and preserve all working functionality.

## V3 LATEST STATUS OVERRIDE — READ FIRST

This section supersedes any older wording later in this prompt that says the dedicated simulated test user/workspace was not implemented.

Latest Codex pass completed the urgent test-workspace bootstrap foundation.

Completed in the latest pass:
- Verified `npm.cmd run build` still passes.
- Confirmed active CRM auth model is Supabase Auth plus `workspaces.owner_id`; NextAuth exists but is not the active CRM dashboard auth path.
- Added additive schema support for `workspace_members` and `onboarding_sessions`.
- Added protected bootstrap route: `POST /api/test/simulation/bootstrap`.
- Bootstrap can create/find Supabase Auth user `donovan.mike966@gmail.com`, create/find a test workspace, link membership, create onboarding/session/settings records, and mark the workspace as simulation-only.
- Bootstrap requires `CRM_TEST_ACCOUNT_EMAILS` to explicitly include the test email.
- Bootstrap can optionally set/update a local test password with `test_password`, without returning it.
- Added/kept protected simulation routes:
  - `GET /api/test/simulation/status`
  - `POST /api/test/simulation/seed`
  - `POST /api/test/simulation/tick`
  - `POST /api/test/simulation/pause`
  - `POST /api/test/simulation/reset`
- Tightened seed behavior: seed refuses to run unless bootstrap has already marked the workspace as test/simulation.
- Added deterministic rich seed/tick/reset foundation for test-only CRM data.
- Added Settings test-only simulation controls visible only for validated simulation workspaces.
- Added dashboard “Simulated Test Workspace” badge only for validated simulation workspaces.
- Updated `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md` with env vars, commands, safety rules, and verification notes.
- Confirmed no destructive SQL was added to the schema file.
- Protected simulation routes fail closed with 403 when called without valid auth/secret.

Partially complete:
- Dedicated test workspace foundation is code-complete.
- Bootstrap/seed/tick were not executed against live Supabase because real local secrets/env execution was not completed inside Codex.
- The real test user still needs to be bootstrapped in the target Supabase project, seeded, and browser-verified.

Still remaining before moving beyond Task 3 / Task 2A:
- Apply/run the updated `supabase/user_crm_full_completion_schema.sql` if not already applied after this latest pass.
- Add local env vars:
  - `CRM_ENABLE_TEST_SIMULATION=true`
  - `CRM_TEST_ACCOUNT_EMAILS=donovan.mike966@gmail.com`
  - `CRM_TEST_BOOTSTRAP_SECRET=<local-secret>`
  - `CRM_TEST_SIMULATION_SEED_SECRET=<local-secret>`
  - `CRM_TEST_WORKSPACE_IDS=<returned from bootstrap>` after bootstrap returns the workspace ID.
- Execute bootstrap against Supabase.
- Run status/seed/tick.
- Sign in as `donovan.mike966@gmail.com` and verify every normal CRM page is populated with simulated data.
- Verify normal users do not see simulated data, simulation controls, or the “Simulated Test Workspace” badge.
- Verify all simulation routes remain protected.
- Update checklist with final live bootstrap/seed verification results.

Immediate next-pass priority:
1. Briefly re-check Task 1 and Task 2 because this prompt is reusable.
2. Continue Task 3 / Task 2A first.
3. Do not move to subscription trials, services, contact/waitlist, public pages, metric modals, AI Command Center, mini-brain, or communications sending until live bootstrap/seed/tick and browser verification for the simulated test workspace are complete.
4. After Task 3 / Task 2A is fully verified, continue all remaining active tasks in order.

Active task coverage requirement:
- Codex must continue tracking every task in this prompt, including the original 20 major launch tasks plus the later split-out tasks now numbered through Task 24.
- In every final report, Codex must specify exactly which task numbers were completed, which were skipped because already complete, which are partially complete, and which remain.
- Do not summarize vaguely. Report by task number.

Latest changed/expected files from the test-bootstrap work:
- `app/api/test/simulation/bootstrap/route.ts`
- `app/api/test/simulation/status/route.ts`
- `app/api/test/simulation/seed/route.ts`
- `app/api/test/simulation/tick/route.ts`
- `app/api/test/simulation/pause/route.ts`
- `app/api/test/simulation/reset/route.ts`
- `lib/simulation/testWorkspaceSeed.ts`
- `app/dashboard/layout.tsx`
- `app/dashboard/settings/page.tsx`
- `supabase/user_crm_full_completion_schema.sql`
- `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`
- Preserved prior changed files: `components/demo/DemoTopNav.tsx`, `lib/marketing/execution/executeCampaign.ts`

Exact local test command pattern after env vars are set:

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

Invoke-RestMethod -Method Post "$base/api/test/simulation/bootstrap" `
  -ContentType "application/json" `
  -Body '{"email":"donovan.mike966@gmail.com","bootstrap_secret":"YOUR_BOOTSTRAP_SECRET","test_password":"LOCAL_ONLY_TEST_PASSWORD"}'

Invoke-RestMethod "$base/api/test/simulation/status"

Invoke-RestMethod -Method Post "$base/api/test/simulation/seed" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET"}'

Invoke-RestMethod -Method Post "$base/api/test/simulation/tick" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET"}'

Browser pages to verify after seed:
- `/signin`
- `/dashboard`
- `/dashboard/analytics`
- `/dashboard/leads`
- `/dashboard/pipeline`
- `/dashboard/tasks`
- `/dashboard/calendar`
- `/dashboard/marketing`
- `/dashboard/communications`
- `/dashboard/workflow`
- `/dashboard/ai_assistant`
- `/dashboard/settings`

---



# Preserved Full Reusable Master Prompt

# SynaptiReach Reusable Codex Master Prompt

  

Use this prompt in Codex. It is intentionally reusable for multiple passes. Codex should inspect what already exists, complete only what remains, and preserve all working functionality.

  

---

  

Continue the SynaptiReach final major upgrade and launch-readiness pass.

  

This prompt is intentionally reusable. It may be run multiple times. Do not restart from scratch. Before making changes, inspect the current codebase and determine what is already complete, what is partially complete, and what still needs work. Preserve all completed work. Skip tasks that are already fully implemented and verified. Improve, repair, or complete anything incomplete. Work task-by-task in order. Do not move to the next task until the current task is implemented, build-safe, smoke-tested where possible, and documented.

  

IMPORTANT EXECUTION RULES FOR MULTIPLE PASSES

  

1. Start every run by checking:

   - git status

   - latest commit

   - current changed files

   - whether npm.cmd run build passes

   - whether the Supabase schema file includes all required tables/columns

   - whether the checklist already documents the latest completed work

  

2. For each task:

   - Inspect existing implementation first.

   - If already complete, mark it as verified in the final report and move on.

   - If partially complete, finish it without rewriting unrelated working code.

   - If missing, implement it carefully.

   - Preserve all existing working functionality.

   - Do not remove features to simplify the work.

   - Do not leave placeholders unless the prompt explicitly allows setup-required or review-gated behavior.

   - Do not introduce fake real-data behavior, except for the explicitly allowed dedicated test/demo user described in TASK 3.

  

3. After each major group:

   - Run npm.cmd run build.

   - Fix build errors immediately.

   - Update exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md.

   - Keep changes idempotent and safe.

  

4. Final report must clearly say:

   - completed

   - skipped because already complete

   - partially complete

   - still remaining

   - files changed

   - build result

   - exact commands to test

   - exact browser pages to test

   - whether another pass is needed

  


---

## PRIOR URGENT UPDATE — TEST USER / WORKSPACE BOOTSTRAP

NOTE: The bootstrap foundation described here has now been implemented. Do not rebuild it from scratch. Verify it, execute it with local secrets, and complete live seed/tick/browser verification before moving forward.


The intended test account email is:

- `donovan.mike966@gmail.com`

Manual Supabase checks returned **no rows** for this email in `auth.users` and no matching rows in `crm_settings`. That means the test account/workspace does not currently exist in this Supabase project, or the app is using a different auth/workspace creation flow than expected.

Do **not** require the user to manually find `CRM_TEST_WORKSPACE_IDS` before completing the simulation foundation. Instead, Codex must inspect the current auth/workspace implementation and create a safe, test-only bootstrap path.

Required behavior:

1. Inspect the current auth model:
   - Determine whether CRM users are created through Supabase Auth, NextAuth, custom auth, or a hybrid.
   - Inspect `auth.users`, `workspaces`, `workspace_members`, `crm_settings`, `onboarding_sessions`, and all current workspace helper functions.
   - Inspect existing helper files such as `lib/auth/getWorkspaceContext.ts`, `lib/security/requireWorkspaceAccess.ts`, CRM settings routes, onboarding routes, signup/auth routes, and simulation routes.

2. Build or complete a protected test-only bootstrap utility:
   - The bootstrap utility should create or identify the test user/workspace for `donovan.mike966@gmail.com`.
   - It should work even if the user does not yet exist in `auth.users`, as long as the required server-side Supabase service role key is configured.
   - It may create a Supabase Auth user only if that matches the app’s auth model and can be done safely with the service role server-side.
   - If the app uses NextAuth or another auth system, it should create/link the correct workspace records according to the current app architecture instead of forcing Supabase Auth.
   - It must be protected by environment flags and, if appropriate, a developer secret.
   - It must never be available to normal users.
   - It must never create simulation data for normal users.

3. Suggested protected route names:
   - `POST /api/test/simulation/bootstrap`
   - `GET /api/test/simulation/status`
   - Keep existing simulation routes if already created:
     - `/api/test/simulation/seed`
     - `/api/test/simulation/tick`
     - `/api/test/simulation/reset`
     - `/api/test/simulation/pause`
     - `/api/test/simulation/status`

4. Suggested environment variables:
   - `CRM_ENABLE_TEST_SIMULATION=true`
   - `CRM_TEST_ACCOUNT_EMAILS=donovan.mike966@gmail.com`
   - `CRM_TEST_WORKSPACE_IDS=<auto-created-or-detected-workspace-id>`
   - Optional: `CRM_TEST_BOOTSTRAP_SECRET=<local/dev secret>`
   - Optional: `CRM_TEST_AUTO_CREATE_WORKSPACE=true`

5. The bootstrap route should:
   - Verify `CRM_ENABLE_TEST_SIMULATION=true`.
   - Verify the requested email is included in `CRM_TEST_ACCOUNT_EMAILS`.
   - Create or find the test user according to the current auth architecture.
   - Create or find a test workspace/company record.
   - Create or find a `workspace_members` row linking the user and workspace.
   - Create or find baseline `crm_settings`.
   - Mark workspace/settings metadata as test/simulation:
     - `is_test_data: true`
     - `simulation_source: "synaptireach_test_workspace"`
     - `simulation_version`
     - `test_account_email: "donovan.mike966@gmail.com"`
   - Return the created/found `workspace_id`, `company_id`, and `user_id`.
   - Never expose secrets.
   - Be idempotent: rerunning it should not duplicate the workspace endlessly.

6. The simulation seed/tick routes should:
   - Use the bootstrapped workspace automatically if it is the only allowed test workspace.
   - Or return a clear JSON message telling the user exactly which `CRM_TEST_WORKSPACE_IDS` value to put in `.env.local`.
   - Never run if the workspace is not explicitly marked as test/simulation.
   - Never run for normal users.

7. Add documentation to `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`:
   - How to bootstrap the test account/workspace.
   - The exact local env vars.
   - The exact PowerShell commands for:
     - bootstrap
     - status
     - seed
     - tick
     - pause
     - reset
   - How to verify the test user sees the normal CRM pages with simulated data.
   - How to verify normal users do not see simulated data.
   - How to remove/disable the simulation in production.

8. On this next run, prioritize the test workspace bootstrap and simulation foundation before moving to subscription billing, services, waitlist, contact form, public pages, metric modals, mini-brain, or communication sending.

Important: The user is okay rerunning the full prompt now, but Codex must treat this as a reusable continuation and should not duplicate already-completed work.

---

IMPORTANT CURRENT STATUS

  
  

LATEST CODEX PASS RESULT TO PRESERVE

  

Codex completed the latest pass through the initial verification/performance work. Treat this as current unless a fresh inspection proves otherwise.

  

Completed in latest pass:

- Clean .next rebuild verified.

- npm.cmd run build passes.

- /_not-found build/page-data issue did not reproduce.

- .next/routes-manifest.json regenerates correctly.

- The stale .next/server/vendor-chunks/@supabase.js file is not generated by the current build, and local route/API probes no longer fail from that stale path.

- Local required page smoke test returned 200 after warm-up.

- Production required page smoke test returned 200 against https://synapti-reach.vercel.app.

- /ai-agents, /demo, and /demo/settings return 200 locally and in production.

- Demo nav no longer has the unnecessary “Overview” tab.

- Demo nav is no longer sticky, so it scrolls with the page and should not block mobile scrolling.

- Core CRM API smoke checks returned 200 locally.

- Added missing additive Supabase schema support for marketing, services, and waitlist tables.

- Fixed campaign execution to use canonical leads instead of nonexistent crm_leads.

- Updated exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md.

  

Skipped because already complete:

- Deployment/build health was broadly healthy and was verified rather than rewritten.

- Production route availability was already good; all required routes returned 200.

- Existing Stripe webhook/billing stabilization work was preserved.

  

Partially complete:

- Supabase schema verification is improved, but full end-to-end Supabase feature testing with live writes for every module still needs a later pass.

- Service/waitlist tables are now present in schema, but UI/admin workflows are not fully built yet.

  

Still remaining:

- Dedicated isolated simulated test user/workspace foundation is implemented, but live bootstrap/seed/tick/browser verification remains.

- Subscription trial checkout/autorenewal UX remains.

- Services UI remains.

- Contact form Resend flow remains.

- Waitlist widget/admin remains.

- Expanded industry/info pages remain.

- Metric modals remain.

- AI Command Center remains.

- Workflow signals remain.

- Mini-brain modules remain.

- Review-gated email/SMS replies remain.

  

Files changed in latest pass:

- components/demo/DemoTopNav.tsx

- lib/marketing/execution/executeCampaign.ts

- supabase/user_crm_full_completion_schema.sql

- exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md

  

Recommended next-pass priority:

- First complete the dedicated isolated simulated test user/workspace so every CRM page can be tested with rich data.

- Then continue the remaining tasks in order, starting with subscription trial checkout/autorenewal and billing caps.

  

NEXT-PASS TASK ORDER CLARIFICATION:

- On the next Codex run, Codex should not jump straight into subscription/trial billing work unless the dedicated simulated test workspace is already complete.

- Treat the dedicated simulated test user/workspace as the next priority. It is listed as TASK 3 in this prompt, but it may also be referred to as Task 2A because it is an extension of the Supabase/data-verification work.

- Codex should still briefly inspect/verify TASK 1 and TASK 2 at the start of each reusable pass, because this prompt is rerunnable.

- If TASK 1 and TASK 2 remain verified, Codex should immediately continue with TASK 3 / Task 2A and fully build the isolated simulated test workspace before moving to TASK 5 subscription trial checkout, billing caps, services, waitlist, contact form, public pages, metric modals, mini-brain, and communication sending.

- The reason for this priority is that the simulated test workspace gives every CRM page realistic data, making all later UI, metrics, modal, AI, workflow, onboarding, admin, staff, and billing tests much more reliable.

- If Codex cannot complete the entire simulated workspace in one pass, it should finish the seed/schema/isolation/API foundation first, document what remains, and continue the rest of TASK 3 on the next run before moving forward.

  

Clarification: review-gated means the system may draft, recommend, queue, or prepare an action, but it must not perform an external irreversible action until a human user explicitly reviews and confirms it. For email/SMS/social sends, the safe flow is: draft → review → confirm send → send through provider → log result. For payments/service orders, the safe flow is: request/checkout → Stripe confirmation/webhook → mark paid/active.

  
  

Git / deployment:

- Git working tree was clean before this prompt.

- Current known commit:

  81f9a692 Finalize CRM portal Stripe billing and production readiness

- Local main matched origin/main.

- Vercel production deployment was Ready.

- Production URL:

  https://synapti-reach.vercel.app

- Earlier build output showed a /_not-found page-data error before commit/deploy, but the later commit/push/deploy succeeded.

- Do not assume the earlier build error is current unless npm.cmd run build reproduces it now.

  

Supabase:

- supabase/user_crm_full_completion_schema.sql has already been run.

- It is confirmed safe and creates every indexed CRM table before indexes.

- No destructive SQL should be introduced.

- Continue using idempotent SQL only.

- On this pass, verify every feature that depends on Supabase tables actually has the required tables, columns, indexes, and safe fallback states.

- If new schema is needed, update supabase/user_crm_full_completion_schema.sql only with safe idempotent SQL:

  CREATE TABLE IF NOT EXISTS

  ALTER TABLE ADD COLUMN IF NOT EXISTS

  CREATE INDEX IF NOT EXISTS

- Do not drop, truncate, or destructively update existing data.

  

Stripe:

- Stripe publishable key, secret key, and webhook secret are set locally.

- Stripe CLI is installed and working.

- Stripe sandbox/test mode is being used.

- Test card checkout appeared to work and returned to:

  /dashboard/settings?checkout=success&session_id=...

- Canonical webhook route:

  /api/billing/stripe/webhook

- Compatibility shim:

  /api/stripe/webhook

- Production webhook endpoint:

  https://synapti-reach.vercel.app/api/billing/stripe/webhook

- Keep Stripe in sandbox/test mode until checkout, webhook fulfillment, duplicate webhook replay, subscriptions, trial auto-renewal, and Billing Portal are fully verified.

- Do not mark purchases, subscriptions, or service orders paid until Stripe webhook confirmation.

- Never expose STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET client-side.

  

Vercel:

- User added these Vercel production env vars:

  AI_ENABLE_OPENAI

  AI_PROVIDER_ORDER

  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  OPENAI_API_KEY

  OPENROUTER_API_KEY

  OPENROUTER_MODEL

  RESEND_API_KEY

  STRIPE_SECRET_KEY

  STRIPE_WEBHOOK_SECRET

- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY warning is expected because publishable keys are intentionally browser-visible.

- Production has been redeployed after env var updates.

- Production deploy target:

  https://synapti-reach.vercel.app

  

Local testing issue to fix/avoid:

- Earlier local page smoke tests showed 500 errors caused by missing .next files:

  .next/routes-manifest.json

  .next/server/vendor-chunks/@supabase.js

- Treat this as local Next build/dev cache corruption unless code proves otherwise.

- Before relying on local smoke tests, stop dev server, delete .next, run npm.cmd run build, then restart npm.cmd run dev.

- Add a note to checklist explaining this clean rebuild step.

- On this pass, verify that after a clean rebuild the local page smoke test no longer fails from missing .next files.

- If missing .next files still happen after a clean rebuild, investigate Next config, dependency bundling, Supabase imports, server/client boundaries, and any dynamic imports causing vendor chunk issues.

  

Recent page smoke tests:

- Earlier smoke test showed most pages returned 200.

- These pages previously timed out and need optimization:

  /ai-agents

  /demo

  /demo/settings

- A later corrupted local .next state caused all tested pages to show errors. Fix/verify with clean rebuild before diagnosing app-level issues.

  

Current limitations to preserve unless safely improved:

- External calendar sync remains disabled/internal-only.

- Strict auth enforcement remains staged until final workspace membership rules are finalized.

- External email/SMS/social sends were review-gated. Review-gated means the system can draft/queue/recommend actions, but a human must explicitly review and confirm before anything is sent externally. In this pass, build safe review-gated actual sending for email/SMS only.

  

Ayrshare provider model:

- Default platform mode:

  SynaptiReach uses one server-side Ayrshare API key and creates/maps Ayrshare profiles per customer/workspace.

- BYOK mode:

  Advanced customers can add their own Ayrshare API key if they already have one.

- Ayrshare is only needed for social publishing.

- Keep Ayrshare optional and setup-required if not configured.

- Never expose Ayrshare API keys client-side.

  

CORE RULES

  

- Do not remove existing working features.

- Do not remove CRM modules, AI agents, provider fallback, workflows, marketing scheduling, CSV import, analytics, billing/trial logic, notifications, staff/team management, command palette, Stripe, or Supabase real-data behavior.

- Do not replace real user data with fake/demo data.

- Preserve SynaptiReach branding:

  dark SaaS UI,

  cyan-to-green gradients,

  glass panels,

  rounded cards,

  glowing borders,

  grid background,

  glow pulse,

  synapse firing animations,

  premium autonomous CRM feel.

- Use real Supabase data in the User CRM.

- The only allowed simulated/manipulating dataset is the dedicated test user/workspace from TASK 3.

- For every normal user/workspace, use real data only.

- Keep OpenAI disabled unless AI_ENABLE_OPENAI=true.

- AI should use Gemini first, OpenRouter fallback, and OpenAI only if enabled.

- Never expose API keys, Stripe secret keys, webhook secrets, provider keys, Supabase service role keys, Twilio auth tokens, Resend keys, Ayrshare keys, or SynaptiReach internal keys to the browser.

- All user/customer data must be isolated per authenticated user/workspace/company.

- Use server-side API routes for privileged operations.

- Use idempotent Supabase migrations only.

- Run npm.cmd run build after each major group.

- Fix related build errors.

- Update exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md after this pass.

  

TASK 1 — Verify deployment/build health and fix local smoke-test instability

  

First, inspect the current repo state and recent build/deploy changes.

  

Requirements:

- Confirm app builds with npm.cmd run build.

- Confirm /_not-found page build issue is not present.

- Confirm local .next corruption does not reappear after clean rebuild.

- Confirm missing files do not reappear:

  .next/routes-manifest.json

  .next/server/vendor-chunks/@supabase.js

- Confirm the following pages return 200 locally after clean rebuild:

  /

  /pricing

  /services

  /trial

  /contact

  /about

  /ai-agents

  /automation

  /analytics

  /blog

  /careers

  /privacy

  /security

  /support

  /terms

  /cookies

  /solutions/agencies

  /solutions/healthcare

  /solutions/hvac

  /solutions/legal

  /solutions/roofing

  /demo

  /demo/dashboard

  /demo/leads

  /demo/marketing

  /demo/ai_assistant

  /demo/workflow

  /demo/communications

  /demo/settings

  /dashboard

  /dashboard/analytics

  /dashboard/leads

  /dashboard/pipeline

  /dashboard/tasks

  /dashboard/calendar

  /dashboard/marketing

  /dashboard/communications

  /dashboard/workflow

  /dashboard/ai_assistant

  /dashboard/settings

- Optimize pages that timeout:

  /ai-agents

  /demo

  /demo/settings

- Do not leave page smoke tests broken.

- Confirm deployed production pages can be checked with the same route list against:

  https://synapti-reach.vercel.app

  

TASK 2 — Verify every Supabase-dependent feature works

  

Because the SQL has already been run, verify each new and existing Supabase-backed feature works with real tables.

  

Verify required schema exists and works for:

- leads

- deals/pipeline

- tasks

- appointments

- workflows

- workflow runs

- communications

- communication conversations

- campaign activity

- AI recommendations

- agent runs

- notifications

- staff/team management

- billing accounts

- credit pack purchases

- billing events

- contact submissions

- waitlist signups

- service requests/orders

- audit logs

- provider/integration connections

- onboarding/trial metadata if implemented

- test user / test workspace simulation tables or seed state if implemented

  

Requirements:

- API routes should not crash if a table is empty.

- API routes should return clean setup-required messages if a future table is missing.

- Every new table/column needed by this pass must be added to supabase/user_crm_full_completion_schema.sql.

- All frontend sections must handle loading, empty, error, and success states.

- Verify no feature is silently writing to a table that does not exist.

- Verify workspace scoping is applied where compatible.

- Verify no user can accidentally access another workspace’s data when workspace context exists.

- Verify test-user simulation data cannot leak into normal user workspaces.

  

TASK 3 — Dedicated test user / simulated CRM workspace

  

Build a dedicated test user and test workspace with rich simulated CRM data.

  

This is the only allowed fake/manipulating dataset in the real CRM. All other users and workspaces must continue using real data only.

  

Goal:

- Create a safe, isolated test user/workspace that can demonstrate every User CRM feature with realistic simulated data.

- The test user should see the same real CRM pages as any normal user.

- The only difference is that the test user’s workspace contains seeded simulated data.

- Do not create separate fake dashboard pages unless useful for restricted admin/test controls.

- This test user should behave like a living business simulation.

- The simulated data should update/manipulate itself over time using deterministic rules and safe internal simulation logic.

- This should be inspired by the earlier SynaptiReach SaaS simulation idea: a central simulation kernel, agent-like CRM/marketing/pipeline behavior, customer behavior probability engine, and autonomous company simulation layer.

- The test user should make the CRM feel full and alive for demos, testing, QA, and investor/product walkthroughs.

  

Safety / isolation requirements:

- The test user/workspace must be clearly marked internally as test/simulation only.

- Use env vars such as:

  CRM_TEST_ACCOUNT_EMAILS

  CRM_TEST_WORKSPACE_IDS

  CRM_ENABLE_TEST_SIMULATION=true

- The simulation must only run for those explicit test accounts/workspaces.

- Never run the simulation for normal users.

- Never mix simulated records with real user records.

- Every simulated record should include metadata such as:

  is_test_data: true

  simulation_source: "synaptireach_test_workspace"

  simulation_version

  generated_at

- UI may show a small “Test Workspace / Simulated Data” badge only for the test user.

- Normal users must never see test badges, test controls, or simulated records.

- Test data should be seeded idempotently.

- Re-running the seed should update or upsert instead of duplicating endlessly.

- Add safe cleanup/reset tooling only for the test workspace, never for real data.

  

Test user/workspace data requirements:

Create realistic data for every major CRM module:

  

Business profile:

- Example company name

- Industry

- Target customer

- Brand voice

- Offer

- Services/products

- Website

- Business goals

- Sales cycle length

- Pipeline stages

- Staff/team members with roles

- Trial/plan status

- BYOK/managed configuration state

  

Leads:

- At least 50-100 realistic leads

- Mixed statuses:

  new

  contacted

  qualified

  nurture

  converted

  archived/lost

- Mixed sources:

  website

  referral

  Google Business Profile

  Facebook

  Instagram

  LinkedIn

  paid ads

  cold outreach

  CSV import

  webinar/event

  contact form

  waitlist

- Include realistic:

  names

  companies

  emails

  phones

  lead score

  temperature

  tags

  notes

  metadata

  created_at spread across recent days/weeks

  last interaction dates

- Include some duplicate-looking leads for duplicate review testing.

- Include hot/warm/cold/inactive segments.

  

Pipeline/deals:

- At least 20-40 deals

- Stages such as:

  New Opportunity

  Discovery

  Proposal

  Negotiation

  Won

  Lost

- Include:

  deal values

  probability

  weighted value

  expected close date

  stale deals

  high-value deals

  linked leads

  won/lost outcomes

  recent stage changes

- Enough variation to populate all pipeline metrics and modal details.

  

Tasks:

- At least 40-80 tasks

- Include:

  overdue tasks

  high-priority tasks

  completed tasks

  upcoming tasks

  lead follow-ups

  deal follow-ups

  campaign tasks

  service tasks

  staff-assigned tasks

  AI-recommended tasks

- Include multiple owners/staff.

  

Appointments/calendar:

- At least 20 appointments

- Include:

  upcoming

  completed

  canceled

  no-show

  proposed/draft appointments

  appointment intent suggestions

- Link appointments to leads/deals where possible.

- Include realistic meeting titles and notes.

  

Marketing campaigns:

- At least 15-25 campaigns

- Include:

  email campaigns

  SMS campaigns

  social campaigns

  draft campaigns

  scheduled campaigns

  sent campaigns

  canceled campaigns

- Include metrics:

  delivered

  opened

  clicked

  converted

  unsubscribed

  failed

- Include campaign activity rows.

- Include opened-but-not-clicked scenarios.

- Include high-converting and underperforming campaigns.

  

Communications/conversations:

- At least 40-100 communication records

- Include:

  inbound email

  outbound email

  inbound SMS

  outbound SMS

  internal notes

  failed messages

  scheduled/draft messages

- Group into conversation chains by lead.

- Include unread inbound replies.

- Include appointment-intent messages.

- Include messages requiring response.

- Include AI draft suggestions and rule-based mini brain suggestions.

  

Workflows:

- Seed workflow templates and saved workflows.

- Include:

  active workflows

  paused workflows

  draft workflows

  failed/test-run workflows

  workflow run history

  live workflow signals

- Include workflow-related notifications and approval queue items.

  

AI recommendations / agent runs:

- Seed realistic AI recommendations:

  lead scoring recommendation

  follow-up recommendation

  campaign optimization recommendation

  workflow recommendation

  task recommendation

  appointment recommendation

  pipeline risk recommendation

  billing/usage warning

- Include statuses:

  pending

  approved

  denied/dismissed

  converted_to_task

  converted_to_workflow

- Seed agent runs:

  executive

  workflow

  lead scoring

  campaign optimization

  task recommendation

  pipeline risk

- Include provider metadata/fallback metadata where safe.

- Include mini-brain recommendations that do not require API calls.

  

Notifications:

- Seed realistic notifications:

  new lead

  hot lead

  overdue task

  appointment upcoming

  appointment no-show

  new inbound reply

  campaign underperforming

  campaign ready for review

  workflow signal

  AI recommendation pending

  usage cap warning

  trial ending soon

  billing/payment event

  waitlist signup

  contact form submission

- Include read and unread states.

- Enough unread notifications to test count decrement and mark-read behavior.

  

Billing/usage:

- Seed safe test billing state:

  trial active

  trial days left

  usage caps

  AI/email/SMS/contact usage

  credit pack purchase history

  billing events

  Stripe sandbox references only if safe placeholders are needed

- Do not create fake paid production Stripe charges.

- Do not mark real payments paid unless webhook confirms.

- For the test user, use test-only billing metadata and clearly mark as simulation.

  

Services / bundles / retainers:

- Seed service requests for:

  Launch System

  Growth Engine

  Automation System

  Authority Builder

  Conversion Engine

  Full Business System

  Growth Ops

  Scale Ops

  Elite Ops

  individual services

- Include statuses:

  requested

  consultation_required

  quoted

  approved

  completed

  canceled

- Do not fake actual paid service orders unless test-only and clearly marked.

  

Waitlist/contact:

- Seed a few test waitlist/contact submissions if admin demo needs them.

- Mark as test/simulation.

- Do not email real users for seeded simulation data.

  

Simulation engine requirements:

Create or enhance a deterministic simulation layer such as:

- lib/simulation/testWorkspaceSeed.ts

- lib/simulation/testWorkspaceEngine.ts

- lib/simulation/customerBehavior.ts

- lib/simulation/simulationClock.ts

- app/api/test/simulation/seed/route.ts

- app/api/test/simulation/tick/route.ts

or equivalent safe architecture.

  

Simulation should be able to:

- seed the test workspace

- advance one simulation tick manually

- optionally auto-refresh simulated metrics only when viewing the test workspace

- age leads and deals

- create new interactions

- move some deals between stages

- mark some tasks overdue/completed

- generate campaign activity

- create workflow signals

- create notifications

- create AI/mini-brain recommendations

- simulate appointment confirmations/no-shows

- simulate lead replies

- simulate usage changes

- simulate waitlist/contact events only within test workspace

  

Simulation control requirements:

- Add a test-only control panel visible only to test workspace users, possibly under Settings or Dashboard:

  - Seed/reset test data

  - Run simulation tick

  - Pause simulation

  - Resume simulation

  - Show simulation status

  - Last tick time

  - Simulation version

- Do not expose this to normal users.

- Protect simulation APIs with test workspace checks and environment flag.

- Do not allow destructive reset outside test workspace.

  

UI requirements:

- The test user should make every CRM page look populated:

  dashboard

  analytics

  leads

  pipeline

  tasks

  calendar

  marketing

  communications

  workflow

  ai_assistant

  settings

  billing/services

  approvals/audit if created

- All metric cards and modals should show meaningful test data for test user.

- Empty states should still remain for normal users with no data.

- Add “Simulated Test Workspace” badge only for test workspace.

- Add checklist instructions for how to create/use/test the test user.

  

Documentation:

- Update exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md with:

  - test user env vars

  - test workspace seed command/API

  - simulation tick command/API

  - safety/isolation rules

  - pages to verify with simulated data

  - confirmation that normal users do not get fake data

  

TASK 4 — Fix timeout/performance pages

  

Investigate and optimize:

- /ai-agents

- /demo

- /demo/settings

  

Requirements:

- No timeouts under local smoke test.

- Avoid expensive client-side loops, stuck animations, unnecessary fetches, or hydration-heavy sections.

- Preserve branding and content.

- Keep demo pages clearly demo/simulation data.

- Demo nav should not be fixed/sticky on mobile because it blocks scrolling.

- Remove the unnecessary “Overview” tab from /demo navigation.

- Demo nav should scroll with the page, not stay locked over content.

- Confirm pages return 200 with Invoke-WebRequest.

  

TASK 5 — Free trial subscriptions and auto-charge after trial

  

Implement proper 14-day Stripe subscription trial behavior.

  

Important legal/safety requirement:

- Users may only be charged after trial if they explicitly select a paid plan and provide payment details through Stripe Checkout.

- UI must clearly disclose:

  “After the 14-day trial, your selected plan renews automatically unless canceled before the trial ends.”

- Do not charge users who only joined the waitlist or submitted contact forms.

- Do not fake subscriptions.

- Do not mark subscriptions active without Stripe confirmation.

  

Requirements:

- Add plan subscription checkout for both BYOK and SynaptiReach-managed plans.

- Use Stripe Checkout subscription mode with 14-day trial where appropriate.

- Create or update billing account record before redirecting.

- Store Stripe customer ID, subscription ID, plan tier, billing mode, trial start/end, and status.

- Webhook should update subscription lifecycle from Stripe events:

  customer.subscription.created

  customer.subscription.updated

  customer.subscription.deleted

  customer.subscription.trial_will_end

  invoice.paid

  invoice.payment_failed

  invoice.payment_action_required

- Add trial countdown banners across CRM pages.

- Add trial ending notifications:

  7 days left

  5 days left

  3 days left

  1 day left

  trial ended

- Add cap warning notifications.

- If trial ends and subscription/payment is not active, put account into restricted/upgrade-required state while preserving access to billing/settings.

- Add a special test account bypass:

  - Use env var such as CRM_TEST_ACCOUNT_EMAILS or CRM_TEST_WORKSPACE_IDS.

  - These accounts retain access after 14 days without canceling or charging.

  - Make it clear in code/checklist this is for internal testing only.

- Add checklist instructions for testing trial expiration safely.

  

TASK 6 — Tiers, caps, subscriptions, BYOK vs SynaptiReach-managed

  

Make sure each tier and cap is fully configured.

  

Use or create central billing constants:

- lib/billing/plans.ts

- lib/billing/services.ts

- lib/billing/usageCaps.ts

  

Plans must support both:

- BYOK tiers

- SynaptiReach-managed-key tiers

  

Each plan should define:

- monthly price

- plan tier

- billing mode

- AI cap

- email cap

- SMS cap

- contact cap

- agent/workflow caps if applicable

- over-cap behavior

- whether credit packs are allowed

- whether managed keys are included

- whether BYOK provider costs are customer responsibility

  

Settings/Billing UI must show:

- selected tier only

- trial status

- days left

- usage used out of cap

- upgrade/cancel/manage subscription controls

- clear “BYOK users pay their own provider usage separately” messaging

- clear “SynaptiReach-managed keys consume included credits and require credit packs after caps” messaging

  

TASK 7 — DFY setup, services, bundles, and recurring retainers in Settings

  

Add a Services section in /dashboard/settings or create /dashboard/services if cleaner.

  

Users should be able to select/request SynaptiReach services, bundles, and retainers.

  

Important:

- Public services page should route to contact/consultation first.

- Inside CRM settings, services may be requested, but paid purchase should either:

  - create a consultation/service request first, or

  - create Stripe Checkout only for approved items if implementation supports it.

- Do not fake purchases.

- If direct payment is enabled, use Stripe Checkout and webhook confirmation.

- If consultation required, create crm_service_requests record and notify admin/SynaptiReach.

  

Services and prices to include:

  

Marketing Services / Execution:

- Email Campaign — $149

- SMS Campaign — $179

- Landing Page — $399

- Workflow Setup — $249

- CRM Setup — $399

  

Marketing Services / Strategy:

- Offer Optimization — $249

- Funnel Copywriting — $399

- Lead Magnet Creation — $299

- A/B Testing — $249

- Conversion Audit — $299

  

Marketing Services / Advanced:

- Customer Journey Mapping — $499

- Segmentation Strategy — $399

- Retargeting Setup — $499

  

AI Services / AI Execution:

- AI Campaign Strategy — $399

- AI Persona Modeling — $349

- AI Funnel Optimization — $499

  

Branding & SEO / Brand Growth:

- Logo Design — $249

- Branding Kit — $599

- SEO Optimization — $499

- Local SEO — $399

  

Social & GMB / Local Presence:

- Social Media Management — $599/mo

- Content Calendar — $249

- GMB Optimization — $299

- GMB Monthly Management — $299/mo

  

Service Bundles:

- Launch System — $599

  includes Landing Page, Email Campaign, Workflow Setup, Basic CRM Setup, Best for launching fast

- Growth Engine — $999

  includes Funnel Copywriting, Email Sequence, CRM Setup, Segmentation Strategy, Lead Magnet

  mark as MOST POPULAR

- Automation System — $1,499

  includes Lead Nurturing Workflow, Advanced Automation, A/B Testing, Dashboard Setup, SMS Campaign

- Authority Builder — $1,799

  includes Branding Kit, SEO Optimization, Local SEO, GMB Optimization, Offer Optimization

- Conversion Engine — $2,499

  includes Funnel Strategy, Funnel Copywriting, Lead Magnet Creation, AI Campaign Strategy, Customer Journey Mapping, Segmentation Strategy

- Full Business System — $4,999

  includes Full system setup, CRM Setup, Automation System, Branding Kit, SEO/GMB, AI Funnel Optimization, Campaign Strategy, 30-day implementation support

  

Recurring Service Retainers:

- Growth Ops — $599/mo

- Scale Ops — $999/mo

- Elite Ops — $1,999/mo

  

Add Supabase support if needed:

- crm_service_requests

- crm_service_catalog

- crm_service_orders

  

Each request/order should store:

- workspace_id

- user_id/company_id

- service_type

- item_name

- price_cents

- recurring boolean

- status

- requested_at

- consultation_required boolean

- checkout_session_id if paid

- metadata

  

TASK 8 — Public services page consultation language and buttons

  

On the Marketing & AI services page:

- Change every service/bundle button from “Get Started” to “Contact SynaptiReach.”

- Add language explaining:

  - A 30-minute video consultation is required before purchasing services or bundles.

  - SynaptiReach uses the consultation to understand company needs, goals, systems, audience, budget, and implementation requirements.

  - Users should submit the contact form and mention the service or bundle they are interested in.

- Buttons should route to /contact with query params if useful:

  /contact?service=Growth%20Engine

- Do not remove pricing.

- Preserve all service/bundle prices.

- Preserve 30-day implementation support phrase only for Full Business System.

  

TASK 9 — Public contact form and admin/contact handling

  

Make the contact form actually work.

  

Requirements:

- Contact form submissions should:

  - save to Supabase contact_submissions

  - send email notification to SynaptiReach using Resend

  - show success/error states

  - include anti-spam/honeypot or basic rate limiting if simple

- Email should include:

  - name

  - company

  - email

  - phone if available

  - selected service/bundle if provided

  - message

  - source page

  - submitted_at

- Add admin portal section/page if existing admin area supports it:

  - /admin/dashboard/contact-submissions

  or add to existing admin dashboard.

- Admin should be able to view contact submissions.

- Create notifications for new contact submissions if useful.

- Use RESEND_API_KEY server-side only.

- Do not expose Resend key.

  

TASK 10 — Waitlist system for first launch cohort

  

Add a visible waitlist signup widget on every landing page.

  

Launch plan:

- Launch target: June 1st.

- First 14 days after launch: only 5 businesses allowed in first cohort.

- Everyone after the first 5 goes to waitlist.

  

Make launch date configurable:

- NEXT_PUBLIC_LAUNCH_DATE=2026-06-01

or app constant with easy update.

  

Waitlist widget requirements:

- visible on landing pages

- not on demo dashboard pages

- simple, premium, non-intrusive

- collects:

  - full name

  - business name

  - work email

  - phone optional

  - industry

  - website optional

  - business size

  - desired plan/tier

  - BYOK or managed preference

  - main goal

  - urgency

  - services interested in

  - consent to be contacted

- Save to Supabase table:

  crm_waitlist or waitlist_signups

- Deduplicate by email/company.

- Assign waitlist position.

- Mark first 5 eligible for founding cohort.

- Statuses:

  - pending

  - invited

  - accepted

  - deferred

  - rejected/spam

- Send email to SynaptiReach on signup.

- Send confirmation email to waitlist member if safe.

- Add admin management section:

  /admin/dashboard/waitlist

- Admin can:

  - view list

  - filter by status/industry/tier/urgency

  - mark invited

  - mark accepted

  - add notes

  - see first 5 cohort slots

  - copy contact info

  - send invite email if Resend configured

- Add notifications for new waitlist signup.

- Add public language:

  “We’re opening the first launch cohort to 5 businesses. Join the waitlist to be considered.”

- Add “Don’t see your industry?” pathway to contact/waitlist.

  

TASK 11 — Footer solutions/industry dropdown and industry pages

  

Update footer Solutions section.

  

Requirements:

- Under Legal in the footer solutions area, add a dropdown/list for all industries served.

- Include “Don’t See Your Industry?” option.

- Each industry must have its own page under:

  /solutions/[industry]

- Pages can be basic for now but must be real, branded, and responsive.

- Each industry page should include:

  - hero

  - problem SynaptiReach solves

  - CRM/AI/marketing use cases

  - workflows relevant to that industry

  - example metrics tracked

  - CTA to contact SynaptiReach

  - CTA to start 14-day trial where appropriate

  - “Don’t see your exact workflow? Contact us.”

- Include at least:

  - agencies

  - roofing

  - HVAC

  - legal

  - healthcare

  - real estate

  - med spa

  - dental

  - home services

  - contractors

  - ecommerce

  - consultants

  - coaches

  - gyms/fitness

  - restaurants/local businesses

  - automotive

  - insurance

  - financial services

  - education/training

  - nonprofit

  - other industry / don’t see your industry

- Make footer compact and not overwhelming.

  

TASK 12 — Build out public informational pages

  

Build these out more:

- /about

- /blog

- /careers

- /contact

- /privacy

- /terms

- /security

- /support

- /analytics

- /ai-agents

  

Do not make them generic one-paragraph pages.

  

Each page should use:

- public top nav

- public footer

- same animated background

- grid, glow pulse, synapse animations

- clear sections

- mobile/desktop responsive layout

  

/about should include:

- SynaptiReach mission

- who it serves

- why review-gated autonomy matters

- launch cohort message

- trust/security principles

- CTA to trial/contact/waitlist

  

/blog should include:

- article index layout

- static educational post cards or coming-soon state

- categories: CRM, AI automation, lead generation, marketing, operations

- no fake publication dates unless static

  

/careers should include:

- mission

- roles/interests

- contractor/partner opportunities

- contact CTA

- only one relevant Contact Us button

  

/contact should include:

- working contact form

- service inquiry options

- support inquiry options

- waitlist inquiry options

- expected response time

- consultation language

  

/privacy should include:

- data collected

- CRM data

- provider keys

- Stripe/payment data

- AI usage

- contact/waitlist submissions

- Contact SynaptiReach button only

  

/terms should include:

- SaaS terms sections

- review-gated automation disclaimer

- BYOK responsibility

- managed credits/caps

- payment/trial terms

- external provider limitations

  

/security should include:

- data isolation

- service-role server-only

- masked keys

- review-gated sends

- audit logs

- Stripe hosted checkout

- Supabase security posture

- no raw secrets

  

/support should include:

- Contact Support CTA only

- FAQs

- setup help

- billing help

- provider keys help

- Stripe/sandbox note

- troubleshooting

- remove duplicate Contact SynaptiReach button

  

/analytics should describe:

- all CRM metrics tracked

- leads, campaigns, communications, pipeline, tasks, appointments, workflows, AI, billing/usage

- dashboards and metric detail modals

- real-time/near-real-time behavior if supported

- no fake claims

  

/ai-agents should be built out much more:

- explain each AI agent:

  - Lead Scoring Agent

  - Follow-Up Review Agent

  - Executive Summary Agent

  - Campaign Optimization Agent

  - Workflow Review Agent

  - Task Recommendation Agent

  - Appointment Intent Agent

  - Conversation Drafting Agent

  - Pipeline Risk Agent

  - Billing/Usage Watcher

- explain review-gated autonomy

- explain Gemini/OpenRouter fallback and optional OpenAI

- explain built-in intelligence versus external AI API calls

- show examples of recommendations

- CTA to trial/contact/waitlist

- optimize performance so page does not time out

  

Button cleanup:

- /support should only have Contact Support button.

- /privacy should only have Contact SynaptiReach button.

- /careers should only have Contact Us button.

- Remove duplicate/conflicting buttons.

  

TASK 13 — Dashboard compaction and metric modal expansion

  

On /dashboard:

- The huge metric grid currently takes too much room:

  Leads, New Leads, Qualified, Converted Leads, Scheduled Campaigns, Active Campaigns, Cancelled Campaigns, Campaign Opens, Campaign Clicks, Communications, Pipeline Value, Open Deals, Won Deals, Lost Deals, Open Tasks, Overdue Tasks, Appointments, Active Workflows, Workflow Runs.

- Condense this without removing anything.

  

Suggested solution:

- grouped metric tabs/accordion:

  - Leads

  - Marketing

  - Pipeline

  - Tasks

  - Workflow

  - Communications

- or compact carousel/expandable metric drawer.

- Show top summary initially and allow “View all metrics.”

- Every metric remains clickable and opens detail modal.

- Preserve all metrics and real data.

  

Also condense quick actions:

Refresh, Create Lead, Import CSV, View Pipeline, Add Task, View Analytics, Create Workflow, Email Campaign, SMS Campaign, Social Campaign, Ask AI.

- Use compact action bar/dropdown/grouped quick actions.

- Do not remove actions.

  

Add popups for:

- Autonomous Agent Status cards

- Pipeline Summary cards

- each should show what it means, recent activity, related records, and recommended actions.

  

TASK 14 — Metric popup expansion across CRM pages

  

Add clickable detail popups/modals for all metric cards on:

  

/dashboard/leads:

- lead stats

- source/status metrics

- pipeline graphic stats

- add visual pipeline graphic showing how many leads are at each stage.

- Use demo leads pipeline overview as inspiration.

  

/dashboard/pipeline:

- Pipeline Value

- Weighted Value

- Open Deals

- Won Deals

- Lost Deals

- Stale Deals

  

/dashboard/marketing:

- all metric cards

- campaign stats

- scheduled campaign stats

- AI recommendation stats

- activity stats

  

/dashboard/ai_assistant:

- Autonomous Agents section cards

- each agent category popup should include:

  - what the agent does

  - what it has done recently

  - last run

  - recommendations created

  - actions pending

  - provider/fallback metadata if available

  

/dashboard/communications:

- all cards

- conversation metrics

- channel metrics

- status metrics

  

/dashboard/tasks:

- all cards

- status/priority/overdue metrics

- AI task recommendations metrics

  

/dashboard/calendar:

- all cards

- upcoming/completed/no-show/cancelled metrics

- appointment intent metrics

  

Each popup:

- uses real data

- has loading/error/empty states

- includes relevant quick actions

- mobile-safe

  

TASK 15 — Pipeline create deal help text

  

On /dashboard/pipeline:

- In the Create Deal modal, add a short explanation:

  - what a deal means

  - how it relates to a lead

  - how deal value/probability/stage work

  - how it helps forecast revenue

- Keep modal clean and professional.

  

TASK 16 — AI Command Center inside AI Assistant page

  

Add the AI Command Center to:

/dashboard/ai_assistant

  

Do not create a separate page unless it already exists.

  

It should show:

- recent agent runs

- pending recommendations

- approved recommendations/actions

- denied/dismissed recommendations

- workflow suggestions

- campaign suggestions

- lead scoring suggestions

- task suggestions

- AI usage/cap status

- provider status

- model/fallback metadata

  

Actions:

- approve recommendation

- deny recommendation

- convert to task

- convert to workflow draft

- convert to campaign draft

- run Executive Agent

- run Workflow Agent

- run Lead Scoring Agent

- run Campaign Optimization Agent

  

Also add AI Recommendations section:

- user can view recommended solutions

- approve or deny

- if recommendation requires manual action, AI guides user step-by-step

- use real crm_ai_recommendations and crm_agent_runs

- no fake recommendations as real

  

TASK 17 — Workflow templates and live signals expansion

  

On /dashboard/workflow:

  

Keep existing templates and add more useful review-gated templates.

  

Current templates to preserve:

- New lead follow-up workflow

- Missed follow-up reminder

- Opened-not-clicked campaign follow-up

- High-intent lead alert

- Appointment confirmation workflow

- Appointment reminder workflow

- No-show follow-up workflow

- Stale deal recovery workflow

- Re-engagement campaign workflow

- Review request workflow

- Lead scoring workflow

- Pipeline stage change notification workflow

- Trial ending and cap warning workflow

- New communication response workflow

  

Add more workflow templates:

- Abandoned consultation request follow-up

- Waitlist invite workflow

- Waitlist nurture workflow

- First 5 launch cohort onboarding workflow

- Failed payment recovery workflow

- Credit cap exceeded workflow

- Credit pack purchase confirmation workflow

- Staff assignment workflow

- New staff invite onboarding workflow

- New CSV import cleanup workflow

- Duplicate lead review workflow

- Hot lead fast-response workflow

- Cold lead monthly nurture workflow

- Deal close-date reminder workflow

- Lost deal reactivation workflow

- Post-service delivery follow-up

- GMB review request workflow

- Content calendar reminder workflow

- Social campaign approval workflow

- Manual approval queue escalation workflow

- AI recommendation review workflow

- Conversation unanswered reminder workflow

  

Build out “Live Workflow Signals.”

  

Current signals:

- Leads needing follow-up

- Campaigns ready for review

- Review recommendations

  

Add signals:

- Hot leads

- Stale deals

- Overdue tasks

- Upcoming appointments

- No-show appointments

- New inbound replies

- Unread conversations

- Pending approvals

- Failed payments

- Trial ending soon

- Usage cap warnings

- Waitlist signups

- Staff tasks unassigned

- Campaigns with opens but no clicks

- Workflow runs failed

- AI recommendations pending

  

Each signal should:

- be clickable

- open detail popup

- show real data

- explain what it means

- show related records

- provide recommended action

- support empty state

  

TASK 18 — Marketing page activity and AI recommendations limits

  

On /dashboard/marketing:

- Campaign Activity should show only the most recent 5 by default.

- Add View All button.

- Expanded state should allow searching/filtering if practical.

- AI Recommendations should show only most recent 5 by default.

- Add View All button.

- AI Recommendations should have approve and deny actions.

- Accepted recommendations should create task/campaign/workflow draft or log clear activity.

- Denied recommendations should be dismissed/logged.

- Preserve Campaign Library and Scheduled Campaigns recent/expand behavior.

  

TASK 19 — AI task recommendations polish

  

On /dashboard/tasks:

- AI Task Recommendations section should work like AI Assistant recommendations.

- User can view AI recommended solution.

- User can approve or deny.

- If task requires manual action, AI should guide the user.

- Approve creates real task.

- Deny dismisses/logs.

- Allow assigning approved task to Owner/Me or staff.

  

TASK 20 — Built-in SynaptiReach intelligence / mini brain

Upgrade the SynaptiReach mini-brain into a deterministic CRM intelligence engine that feels as AI-like as possible without requiring external AI API calls.

Purpose:
- Reduce AI API cost aggressively.
- Make CRM smarter even when Gemini/OpenRouter/OpenAI/Ollama are unavailable.
- Provide structured, explainable, review-gated recommendations from real CRM data.
- Power the dedicated test workspace simulation safely without affecting real users.
- Act as the first intelligence layer before external AI.
- Make every CRM module feel alive with smart insights, warnings, explanations, and next actions.

Create or enhance:
- `lib/intelligence/miniBrain.ts`
- `lib/intelligence/types.ts`
- `lib/intelligence/leadScoring.ts`
- `lib/intelligence/dealScoring.ts`
- `lib/intelligence/pipelineIntelligence.ts`
- `lib/intelligence/campaignIntelligence.ts`
- `lib/intelligence/communicationIntelligence.ts`
- `lib/intelligence/taskIntelligence.ts`
- `lib/intelligence/appointmentIntelligence.ts`
- `lib/intelligence/workflowSignals.ts`
- `lib/intelligence/billingUsageIntelligence.ts`
- `lib/intelligence/onboardingIntelligence.ts`
- `lib/intelligence/staffIntelligence.ts`
- `lib/intelligence/businessHealth.ts`
- `lib/intelligence/safetyChecks.ts`
- `lib/intelligence/templates.ts`
- `lib/intelligence/recommendations.ts`
- `lib/intelligence/intentDetection.ts`
- `lib/intelligence/executiveSummary.ts`
- `lib/intelligence/forecasting.ts`
- `lib/intelligence/anomalyDetection.ts`
- `lib/intelligence/nextBestAction.ts`
- `lib/intelligence/crmHygiene.ts`
- `lib/intelligence/priorityEngine.ts`
- `lib/intelligence/simulationSignals.ts`

Required normalized output type:
```ts
export type MiniBrainInsight = {
  id: string;
  type:
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
    | "anomaly"
    | "forecast"
    | "next_best_action";
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
```

Also expose helper result types for:
- lead scorecards
- deal health cards
- campaign health cards
- conversation summaries
- workflow signals
- task priority cards
- appointment prep cards
- billing/usage forecasts
- setup readiness score
- staff workload summaries
- business health summaries
- safety check results

Core mini-brain rules:
- Use real CRM data only, except for the dedicated test workspace.
- For the dedicated test workspace, mini-brain may generate simulation events and insights only when `CRM_ENABLE_TEST_SIMULATION=true` and the workspace is explicitly marked as test/simulation.
- Never manipulate normal user data as simulation.
- Never send email/SMS/social messages automatically.
- Never make billing/security/auth decisions without server-side validation.
- Never mark a payment, subscription, or service order paid without Stripe webhook confirmation.
- All external actions remain review-gated.
- Mini-brain can create draft recommendations, tasks, workflow drafts, notifications, and explanations where safe.
- Store durable recommendations in existing recommendation/notification/task tables only when the existing data model supports it safely.
- Prefer deterministic scoring and transparent reasoning over hidden black-box behavior.
- External AI may enhance/refine mini-brain output, but mini-brain must work even when all AI providers are unavailable.

1. Lead Intelligence:
- lead fit score
- lead intent score
- lead engagement score
- lead freshness score
- lead quality score
- lead source quality scoring
- lead lifecycle stage prediction
- recommended next stage
- duplicate lead detection
- duplicate merge/review suggestion
- missing contact detail detection
- stale lead detection
- lead decay score
- hot/warm/cold segment classification
- high-intent event detection
- low-quality/spam lead detection
- “why this lead matters” explanation
- “what changed since last review” summary
- recommended next action per lead
- recommended communication channel
- recommended owner/staff assignment
- recommended follow-up timing
- lead-to-deal conversion readiness score
- risk of losing the lead
- recent activity summary without LLM

2. Pipeline Intelligence:
- deal health score
- close probability adjustment
- weighted pipeline forecast
- pipeline value forecast
- pipeline coverage ratio
- deal velocity tracking
- stalled-stage detection
- close-date risk detection
- stale deal detection
- expected close slippage detection
- lost-deal reason patterns
- won-deal pattern detection
- next best action by deal stage
- revenue-at-risk alerts
- high-value opportunity alerts
- stage bottleneck detection
- unassigned deal detection
- low-probability high-value deal warning
- high-probability no-next-step warning
- deal-to-task gap detection
- recent stage movement summary
- pipeline trend summary

3. Communication Intelligence:
- response urgency detection
- unanswered conversation detection
- unread inbound reply detection
- objection detection
- buying-signal detection
- appointment-signal detection
- pricing concern detection
- competitor mention detection
- cancellation/refund risk detection
- sentiment approximation from keywords
- conversation summary without LLM
- “what changed since last reply” summary
- suggested response type:
  - follow-up
  - answer question
  - book call
  - send offer
  - nurture
  - handoff to owner
  - escalation
- safe rule-based SMS templates by situation
- safe rule-based email templates by situation
- short/medium/long reply template variants
- recommended channel based on conversation history
- missing opt-in warning for SMS
- no-response follow-up timing suggestion
- conversation priority score
- appointment confirmation extraction using deterministic patterns
- review-gated draft creation support

4. Campaign Intelligence:
- campaign health score
- open/click/convert interpretation
- underperforming campaign detection
- audience fatigue detection
- opened-not-clicked segment detection
- clicked-not-converted segment detection
- converted segment detection
- failed delivery warning
- unsubscribe/spam-risk warning if fields exist
- best follow-up channel suggestion
- campaign timing recommendations
- subject-line pattern tracking
- content length warning
- CTA clarity heuristic
- segment quality heuristic
- campaign readiness checklist
- “what to try next” rules
- best next campaign recommendation
- campaign-to-lead follow-up suggestions
- campaign ROI estimate if value data exists
- recommended A/B test idea without LLM
- recent campaign activity summary

5. Workflow Intelligence:
- workflow opportunity detection
- workflow risk detection
- approval queue prioritization
- automation coverage score
- missed automation opportunities
- workflow conflict detection
- workflow stale/failure detection
- workflow duplication detection
- workflow dependency warning
- suggested workflow templates based on CRM data
- workflow impact estimate
- workflow safety/review-gate check
- inactive workflow warning
- workflow run failure pattern detection
- pending approval aging
- “recommended workflow to create next”
- workflow signals for:
  - hot leads
  - stale deals
  - overdue tasks
  - upcoming appointments
  - no-shows
  - unread replies
  - failed campaigns
  - trial/cap warnings

6. Task Intelligence:
- task priority scoring
- staff workload balancing
- overdue impact scoring
- suggested assignee
- task deduplication
- “today’s focus” list
- task batching by lead/deal/campaign
- aging task escalation
- task-to-revenue impact estimate
- task-to-lead urgency estimate
- unassigned task detection
- task overload warning by staff
- task completion trend
- missing follow-up task detection
- next task recommendation per lead/deal
- recommended due date
- recommended priority
- task dependency hints
- recurring task suggestions

7. Appointment Intelligence:
- appointment likelihood detection
- appointment intent extraction
- no-show risk score
- pre-call prep summary
- post-call follow-up recommendation
- appointment reminder suggestions
- appointment-to-deal conversion tracking
- upcoming appointment priority
- appointment missing lead/deal link warning
- appointment conflict detection if data exists
- no-show recovery task recommendation
- meeting outcome suggestion based on status
- recommended prep checklist
- recommended confirmation message template
- appointment follow-up timing
- appointment source/channel analysis

8. Billing / Trial / Usage Intelligence:
- usage pace prediction
- projected cap exhaustion date
- trial conversion readiness score
- credit-pack recommendation
- plan upgrade recommendation
- BYOK readiness checklist
- managed-key risk alerts
- trial ending risk
- usage anomaly detection
- AI usage trend
- email usage trend
- SMS usage trend
- contacts cap trend
- projected end-of-cycle charges where possible
- hard-cap warning generation
- billing setup completeness
- payment method missing warning
- failed payment follow-up recommendation
- credit pack purchase suggestion when cap is near
- “what happens if you hit cap” explanation

9. Business Health Intelligence:
- daily executive summary without LLM
- weekly trend summary
- revenue forecast
- pipeline coverage ratio
- lead response time score
- sales activity score
- marketing efficiency score
- CRM hygiene score
- customer acquisition momentum score
- conversion momentum score
- operational risk score
- “top 5 risks”
- “top 5 opportunities”
- “top 5 recommended actions”
- growth bottleneck detection
- neglected segment detection
- activity drop-off detection
- data freshness score
- team execution score
- launch readiness score where relevant
- compare current week to previous week if data exists
- explain what changed since last review

10. Onboarding / Setup Intelligence:
- setup completeness score
- missing configuration detector
- provider readiness checklist
- CSV import quality score
- brand profile completeness
- recommended next onboarding step
- DFY upsell trigger when setup becomes too complex
- workspace readiness score
- AI provider readiness
- email provider readiness
- SMS provider readiness
- social/Ayrshare readiness
- Stripe/billing readiness
- first-campaign readiness
- first-workflow readiness
- lead import readiness
- staff setup readiness
- industry/profile completeness
- suggested default workflows based on industry
- suggested default pipeline stages
- “blocked because” explanation for incomplete setup

11. Staff / Team Intelligence:
- staff performance metrics
- assigned workload
- overdue tasks by staff
- response time by staff
- permission-risk warnings
- task reassignment suggestions
- staff capacity score
- staff follow-up quality estimate
- staff bottleneck detection
- unassigned work detection
- role/permission mismatch warning
- staff activity summary
- recommended owner for new lead/deal/task
- workload balancing recommendation
- overdue workload escalation
- low-activity warning

12. Safety / Compliance Intelligence:
- external-send readiness checks
- missing opt-in warning
- SMS provider setup warning
- suspicious duplicate data warning
- possible spam/bad contact detection
- “review required” enforcement
- missing unsubscribe/compliance warning where relevant
- missing sender identity warning
- missing business address warning for marketing email if needed
- potentially risky automation warning
- high-volume send warning
- provider key missing/misconfigured warning
- staff permission warning
- sensitive-data warning if obvious from text patterns
- unsafe auto-send prevention
- audit-log recommendation for important actions

13. Anomaly / Pattern Intelligence:
- sudden lead drop detection
- sudden campaign performance drop detection
- sudden spike in failed messages
- unusual task backlog growth
- unusual no-show spike
- unusually high stale deal count
- unusual usage spike
- repeated failed workflow run pattern
- duplicate import spike
- staff workload anomaly
- notification flood detection
- pipeline value sudden change explanation

14. Next-Best-Action Engine:
- generate ranked actions for:
  - today
  - this week
  - each lead
  - each deal
  - each campaign
  - each workflow
  - each staff member
- assign each action:
  - urgency
  - impact
  - effort
  - confidence
  - related record
  - reason
- actions must be reviewable and explainable.
- high-confidence low-risk actions may create draft tasks/notifications.
- never execute external sends automatically.

15. Rule-Based Drafting / Templates:
- follow-up after website form
- follow-up after no response
- opened-not-clicked email follow-up
- clicked-not-converted email follow-up
- appointment confirmation
- appointment reminder
- no-show recovery
- stale deal check-in
- quote/proposal follow-up
- review request
- re-engagement
- billing/cap warning
- provider setup reminder
- staff assignment note
- waitlist invitation
- consultation request reply
- service inquiry reply
Templates should support:
- email subject
- email body
- SMS body
- tone variants:
  - professional
  - friendly
  - concise
  - persuasive
- personalization fields from CRM data.
Templates must remain drafts unless user confirms sending.

Integration requirements:
- Mini-brain should run from server-safe code.
- Add an API endpoint if needed:
  - `POST /api/intelligence/run`
  - `GET /api/intelligence/summary`
  - or integrate into existing CRM dashboard/AI routes.
- Integrate mini-brain insights into:
  - `/dashboard`
  - `/dashboard/analytics`
  - `/dashboard/leads`
  - `/dashboard/pipeline`
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/marketing`
  - `/dashboard/communications`
  - `/dashboard/workflow`
  - `/dashboard/ai_assistant`
  - `/dashboard/settings`
  - onboarding when built later.
- Use existing `crm_ai_recommendations`, `crm_notifications`, `crm_tasks`, and `crm_agent_runs` tables when appropriate.
- If creating new tables is necessary, add them idempotently to `supabase/user_crm_full_completion_schema.sql`.
- Make all UI sections handle loading, empty, error, and success states.
- Add approve/deny/convert actions where recommendations are actionable.
- Preserve current AI provider fallback and `aiClient.runTask` architecture.
- The AI router should prefer mini-brain for deterministic tasks before calling Ollama/dev/cloud providers.
- External AI can enhance mini-brain output only when allowed by provider settings, caps, BYOK, and user action.

Testing and docs:
- Add unit-like deterministic tests or smoke helpers where practical.
- Add docs explaining what mini-brain does without AI APIs.
- Add checklist coverage for mini-brain modules.
- Verify normal users only see real-data insights.
- Verify test workspace may use simulation data.
- Verify `npm.cmd run build` passes.




  

TASK 21 — Actual review-gated email/SMS replies from communications

  

On /dashboard/communications:

- Users should be able to respond to leads through email and SMS.

- Use Resend for email.

- Use Twilio for SMS.

- Keep review-gated confirmation before sending.

- Log all outgoing messages.

- Update conversation chain.

- Update lead activity.

- Create notifications for sent/failed messages.

  

Provider rules:

- Server-side only.

- RESEND_API_KEY is server-side.

- TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are server-side.

- No secrets in browser.

  

Workspace provider model:

- Each company may use:

  1. SynaptiReach-managed provider credentials, or

  2. their own BYOK/provider connections.

- Each user/company should be able to save:

  - own Resend API key

  - own Twilio credentials/subaccount SID/auth token/from number

  - Ayrshare key/profile if needed for social publishing

- If using SynaptiReach-managed Twilio:

  - architecture should support one Twilio subaccount per company.

  - Do not automatically create real Twilio subaccounts unless master credentials and safe flow exist.

  - Store subaccount SID/from number references when configured.

- If using Ayrshare:

  - Default platform mode: SynaptiReach uses one server-side Ayrshare API key and creates/maps Ayrshare profiles per customer/workspace.

  - BYOK mode: Advanced customers can add their own Ayrshare API key if they already have one.

  - Ayrshare is only necessary for social publishing.

  - Keep it optional.

  - Support workspace-level Ayrshare key/profile key if social publishing is enabled.

- Add setup-required states for missing provider config.

- Add clear error messages for failed sends.

- Do not auto-send AI drafts.

- Send flow:

  draft → review → confirm send → send via provider → log result.

  

TASK 22 — Notifications behavior fix

  

Fix the User CRM topbar notification dropdown.

  

Requirements:

- When an individual notification is clicked, mark that notification as read.

- Unread count should decrease immediately and accurately.

- If click navigates to a linked page/record, mark read first or optimistically mark read before navigation.

- Add explicit Mark all as read if not already present.

- Add dismiss behavior if schema supports it.

- Ensure notification updates are persisted in Supabase.

- Ensure API route supports mark-read for one notification and optionally mark-all-read.

- Ensure empty, loading, and error states are clean.

- Ensure mobile dropdown behavior works.

- Do not mark all notifications read when only one is clicked.

  

TASK 23 — Contact/support/admin notifications

  

Make sure:

- Contact form sends email to SynaptiReach.

- Contact form stores Supabase submission.

- Waitlist signup sends email to SynaptiReach.

- Admin portal can view contact submissions and waitlist.

- Notifications are created for new contact/waitlist entries.

- Support page uses only Contact Support button.

- Privacy page uses only Contact SynaptiReach button.

- Careers page uses only Contact Us button.

  

TASK 24 — Final build, tests, and docs

  

Run:

npm.cmd run build

  

Run page smoke tests and make sure the previously timed-out pages pass:

- /ai-agents

- /demo

- /demo/settings

  

Run API smoke tests.

  

Run Supabase-dependent feature tests for:

- billing

- waitlist

- contact submissions

- notifications mark-read

- service requests

- workflow signals

- communication send setup-required/success path where possible

- dedicated test workspace seed

- dedicated test workspace simulation tick

- dedicated test workspace reset/pause/resume if implemented

  

Update:

exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md

  

Include:

- clean .next rebuild instructions for local ENOENT errors

- Vercel env vars missing/present checklist

- Supabase SQL already run note

- Stripe sandbox test checklist

- test card instructions

- trial subscription checkout tests

- subscription webhook tests

- free trial countdown banner tests

- plan/cap tests

- services/settings tests

- waitlist tests

- contact form tests

- industry pages tests

- public page button cleanup tests

- dashboard compaction tests

- metric modal tests across all CRM pages

- AI Command Center tests

- workflow template/signal tests

- built-in mini brain tests

- communication send tests

- Resend/Twilio/Ayrshare provider setup tests

- notification mark-read tests

- dedicated test user/test workspace tests

- test simulation seed/tick/reset tests

- test simulation isolation tests

- mobile/desktop tests

  

Final report:

- Whether one more pass is needed or this is launch-test ready.

- Files changed.

- Supabase schema changes.

- Confirmation that SQL-dependent features were verified.

- Stripe subscription/trial status.

- Services/bundles checkout/request status.

- Waitlist/contact/admin status.

- Public page status.

- CRM page status.

- Dedicated test user/workspace status.

- Test simulation status.

- Mini brain status.

- Communications send status.

- Notification mark-read status.

- Build result.

- Exact commands to test.

- Exact browser pages to test.

- Remaining limitations.

  

This prompt is reusable.

If run again, inspect what is already done, preserve it, and continue/fix only what remains.

  

---

  

## Post-Pass Prompt Roadmap

  

After this pass is finished, plan the next prompts in this order:

  

1. Full onboarding process overhaul.

   - First-run setup wizard.

   - Trial/plan selection.

   - Provider setup.

   - Business profile.

   - Import leads.

   - Launch readiness score.

  

2. Admin portal buildout.

   - Owner/admin dashboard for SynaptiReach.

   - Contact submissions.

   - Waitlist management.

   - Billing/service requests.

   - Test workspace controls.

   - System health.

   - User/workspace management.

  

3. User staff portals.

   - Dedicated staff access experience.

   - Role-based permissions.

   - Staff-specific CRM dashboard.

   - Task assignment.

   - Communication review permissions.

   - Staff activity/audit log.

   - Restricted billing/settings access.

  

4. Local AI integration prompt.

   - Locally downloaded model such as Ollama/Gemma.

   - Define which tasks local AI owns.

   - Use local AI for low-cost drafts, summaries, lead scoring explanations, intent detection, and recommendation enrichment.

   - Keep cloud AI providers as optional enhancement/fallback.

   - Add server-side local AI routing and health checks.

  

5. Full security hardening prompt.

   - Auth/workspace enforcement.

   - RLS policy review.

   - API route permission checks.

   - Secrets handling.

   - Staff permissions.

   - Webhook verification.

   - Audit logs.

   - Rate limiting.

   - Contact/waitlist spam protection.

  

6. Final master sweep prompt.

   - Build.

   - Tests.

   - Smoke tests.

   - Production checks.

   - Mobile/desktop UI review.

   - Security review.

   - Billing/Stripe test flow.

   - Supabase schema validation.

   - Launch readiness checklist.

```