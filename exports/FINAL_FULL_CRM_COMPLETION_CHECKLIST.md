# Final Full CRM Completion Checklist

## Settings Manual Review Fixes - 2026-05-26

- [x] Read `docs/codex/SYNAPTIREACH_SETTINGS_BILLING_UX_GOAL.md`.
- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Made `Setup & Usage Intelligence` collapsible/expandable.
- [x] Preserved the existing CRM Intelligence panel/content and API behavior.
- [x] Made `Business Profile` collapsible/expandable.
- [x] Added collapsed Business Profile summary from business name, industry, and contact email where available.
- [x] Preserved existing Business Profile save behavior.
- [x] Improved Integration Status modal/drawer so supported integrations can add/update:
  - Resend/email provider key
  - Twilio Account SID
  - Twilio Auth Token
  - Ayrshare key
  - Gemini key
  - OpenRouter key
  - OpenRouter model
  - OpenAI key
- [x] Integration modal uses existing encrypted provider connection save path.
- [x] Existing configured keys are represented only by saved masked key labels.
- [x] Integration modal shows management mode and setup/future-ready status.
- [x] Test Connection is shown as disabled/future-ready because safe provider test endpoints are not available for every provider.
- [x] Added mobile-safe scrolling to Settings modals/drawers.
- [x] `npm.cmd run build` passed and generated 150/150 static pages.
- [x] `.env.local` is not tracked.
- [x] Customer-facing Settings source scan found no `mini-brain`, `mini brain`, `Start Stripe Checkout`, `AI Settings`, Supabase, or Vercel Cron wording.
- [ ] Manual mobile browser review of `/dashboard/settings` remains.
- [ ] Signed Stripe webhook replay still needed for end-to-end app-level credit-pack confirmation email verification.

## Settings Billing UX Manual Review Follow-up - 2026-05-26

- [x] Read `docs/codex/SYNAPTIREACH_SETTINGS_BILLING_UX_GOAL.md`.
- [x] Read `docs/codex/CODEX_TASK_LEDGER.md`.
- [x] Read `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
- [x] Continued from current working tree without restarting completed work.
- [x] Confirmed latest committed code is `0daa1412 Improve settings billing UX and consultation flows`.
- [x] No issue-supported code changes were made because the supplied browser review entries still contained placeholders instead of concrete pass/fail notes.
- [x] `npm.cmd run build` passed and generated 150/150 static pages.
- [ ] Concrete manual browser review notes still needed for:
  - Settings accordions/modals
  - Credit pack selection + Checkout button
  - Services multi-select consultation request
  - CRM Automation & AI Behavior save flow
  - Integration config modal/drawer
  - Production smoke after deploy
- [ ] Signed Stripe webhook replay still needed for end-to-end app-level credit-pack confirmation email verification.
- [ ] Resend delivery/provider configuration still needs final confirmation.

## Settings Billing UX Checkpoint 1 - 2026-05-25

- [x] Read `docs/codex/SYNAPTIREACH_SETTINGS_BILLING_UX_GOAL.md` and continued from current working tree.
- [x] Added reusable collapsible Settings sections.
- [x] Kept Setup & Usage Intelligence and Business Profile non-collapsible.
- [x] Added compact collapsible sections for:
  - Trial, Caps & Billing Rules
  - Services, Bundles & Retainers
  - CRM Automation & AI Behavior
  - Integration Status
  - Connect Your AI Keys
  - AI Providers
  - Staff & Permissions
- [x] Reworked customer-facing integration cards and removed Supabase/Vercel Cron from customer-facing status.
- [x] Added selectable credit-pack UX with one Checkout button and confirmation modal.
- [x] Added Stripe return notice for credit pack/subscription returns without claiming webhook confirmation early.
- [x] Added billing setup confirmation modal with 14-day trial disclosure and Stripe security copy.
- [x] Added multi-select service consultation UX.
- [x] Updated service request API to accept `items` / `selected_items` arrays while preserving single-item compatibility.
- [x] Added structured selected-service metadata and totals to service requests.
- [x] Added app-level credit-pack confirmation email attempt from verified Stripe webhook processing.
- [x] Added automation policy UI backed by `crm_settings.metadata.automation_policy`.
- [x] `npm.cmd run build` passed after these changes.
- [ ] Browser click-through and live webhook/provider verification still pending.

## Settings Billing UX Checkpoint 2 - Final Verification - 2026-05-25

- [x] Local `/dashboard/settings` smoke returned HTTP 200.
- [x] Settings page with Stripe return query params loaded without server errors:
  - `?checkout=success&session_id=...`
  - `?subscription=success&session_id=...`
- [x] Unauthorized admin waitlist mutation still fails closed with HTTP 403.
- [x] Multi-service consultation request API returned HTTP 200 with structured selected items and `consultation_requested` status.
- [x] Credit-pack checkout intent API returned HTTP 200 with `checkout_created` and a Stripe Checkout URL present in test mode.
- [x] `.env.local` is not tracked.
- [x] `.next/routes-manifest.json` exists.
- [x] Stale `.next/server/vendor-chunks/@supabase.js` is absent.
- [x] Customer-facing Settings source scan found no:
  - `mini-brain`
  - `mini brain`
  - `Start Stripe`
  - `AI Settings`
  - Supabase customer integration card
  - Vercel Cron customer integration card
- [x] Remaining lowercase billing enum strings in Settings are internal mapping logic only.
- [ ] Manual browser verification remains for accordion/modals, Stripe redirect UX, and exact visual layout.
- [ ] Signed Stripe webhook replay remains required to verify app-level credit-pack confirmation email end-to-end.

## Request 1 - Public Footer/Page Tests

- [x] Home page renders the shared public footer.
- [x] Pricing page renders the shared public footer.
- [x] Services page renders the shared public footer.
- [x] Trial page renders the shared public footer.
- [x] Contact page renders the shared public footer.
- [x] Demo dashboard pages are not given the public footer by this pass.
- [x] Footer CRM link routes to `/demo/dashboard`.
- [x] Footer Pricing link routes to `/pricing`.
- [x] Footer Contact link routes to `/contact`.
- [x] Footer Trial CTA uses `Start 14-Day Trial`.
- [x] Footer links use real routes instead of placeholder anchors.
- [x] Missing footer routes were created under the marketing route group.
- [x] `npm.cmd run build` passes after Request 1.
- [x] Legacy trial wording search passes; only the allowed implementation-support phrase remains on the services page.
- [ ] Browser-check footer links on desktop.
- [ ] Browser-check footer links on mobile.

## Remaining Requests

- [x] Request 2 - Supabase schema verification for every CRM page.
  - [x] Added `supabase/user_crm_full_completion_schema.sql`.
  - [x] Covered workspace/company/user scoping columns.
  - [x] Covered staff/team members, roles, and permissions.
  - [x] Covered notifications.
  - [x] Covered conversation/message chains.
  - [x] Covered audit logs.
  - [x] Covered server-side provider connection references.
  - [x] Covered billing accounts, usage events, credit pack purchases, and CSV import history.
  - [x] Added dashboard/module query indexes.
  - [x] Fixed fresh-database safety in `supabase/user_crm_full_completion_schema.sql` by creating core CRM tables before altering/indexing them.
- [x] Request 3 - User/workspace security and data isolation.
  - [x] Added `lib/auth/getWorkspaceContext.ts` for server-side workspace/user context resolution.
  - [x] Added `lib/security/permissions.ts` with CRM permission constants and checks.
  - [x] Added `lib/security/requireWorkspaceAccess.ts` for strict route guard adoption.
  - [x] Added schema support for workspace/company/user scoping, staff roles, permissions, and audit logs in `supabase/user_crm_full_completion_schema.sql`.
  - [ ] Remaining integration: adopt `requireWorkspaceAccess` in every CRM/marketing route once auth/workspace membership is finalized for production.
- [x] Request 4 - Global CRM notifications.
  - [x] Added `/api/crm/notifications`.
  - [x] Added topbar notifications button to every User CRM page through `app/dashboard/layout.tsx`.
  - [x] Added unread count, dropdown panel, mark-as-read action, and mobile-safe width.
  - [x] Notifications use stored `crm_notifications` plus real-derived reminders from tasks, appointments, AI recommendations, and campaign status.
- [x] Request 5 - Dashboard professional living upgrade.
  - [x] Preserved existing dashboard metrics and sections.
  - [x] Made metric cards clickable.
  - [x] Added metric detail modal with real backing records, empty state, related page action, and copy JSON action.
  - [x] Added professional deal-flow pipeline overview with stage counts, value, stale deal context, and pipeline CTA.
  - [x] Kept CSV import quick action and dashboard refresh behavior.
- [x] Request 6 - Analytics metric detail modals.
  - [x] Made analytics metric cards clickable.
  - [x] Added mobile-safe modal with complete metric overview, real records, context, recommended action, related page CTA, and copy JSON export.
  - [x] Added analytics coverage for leads, conversion, campaign performance, communications, pipeline, workflow health, task health, appointments, AI agent activity, and activity events.
  - [x] Preserved empty/loading/error states and avoided fake analytics.
- [x] Request 7 - Leads profile/details section.
  - [x] Selecting a lead populates the profile/detail panel.
  - [x] Detail panel shows contact info, company/source/status/tags/score, notes, activity timeline, communications, campaign interactions, tasks/follow-ups, linked deals, and AI next-step guidance.
  - [x] Actions include edit lead, update status, add note, create follow-up task, convert to deal, draft review-gated message, archive, and run AI next-step review.
  - [x] Uses existing real CRM APIs and Supabase-backed records.
- [x] Request 8 - Pipeline page graphics.
  - [x] Added professional pipeline-flow visualization using real deal records.
  - [x] Visualizes deals by stage, total stage value, probability-weighted value, stale deals, and win/loss counts.
  - [x] Preserved existing Kanban/stage controls and deal CRUD actions.
  - [x] Added mobile-safe empty state when filters produce no deals.
- [x] Request 9 - Marketing recent and expandable sections.
  - [x] Campaign Library shows recent 5 by default with View All / Show Recent toggle.
  - [x] Expanded Campaign Library supports search, status filter, type filter, date filter, details, edit/cancel where supported, and duplicate.
  - [x] Scheduled Campaigns show recent 5 by default with View All / Show Recent toggle.
  - [x] Expanded scheduled campaigns support search, edit date/time, cancel, duplicate, and details.
  - [x] AI Recommendations accept and deny actions work through `/api/marketing/recommendations`, log activity, refresh data, and hide accepted/dismissed items.
  - [x] Provider/fallback metadata is displayed when returned.
- [x] Request 10 - Workflow Automation page.
  - [x] Run Agent Review calls the real `/api/crm/agents/run` endpoint, shows loading/success/error state, and uses logged agent recommendations.
  - [x] Saved workflows show trigger, condition/action summary, status, last run, success/failure counts, details, activate/pause toggle, and safe manual test logging.
  - [x] Added review-gated workflow templates for lead follow-up, missed follow-up, campaign follow-up, high-intent alerts, appointments, stale deals, re-engagement, reviews, lead scoring, pipeline notifications, trial/cap warnings, and new communication response.
  - [x] Workflow details open in a mobile-safe modal and clearly state that external sends require manual review.
- [x] Request 11 - Communications conversation chains.
  - [x] Added real conversation chains grouped from CRM communication records by lead or recipient.
  - [x] Conversation cards show contact/lead identity, channel, status, latest preview, unread count, timestamp, and message count.
  - [x] Conversation drawer shows full message history with email/SMS/social/internal records where available.
  - [x] Added review-gated email/SMS response drafting with AI provider metadata, Save Draft, and Queue for Review actions.
  - [x] Saved replies write to the real communications API/table and do not send external messages automatically.
- [x] Request 12 - Tasks AI recommendations and assignment.
  - [x] Added AI task recommendation panel from real CRM context: stale leads, overdue tasks, stale deals, upcoming/no-show appointments, campaign interactions, and inbound communications.
  - [x] Recommendation actions include approve, deny, and assign; approved items create real reviewable tasks through `/api/crm/tasks`.
  - [x] Added task assignment fields, assignee display, and assignee filtering with Owner / Me fallback when no staff records exist.
  - [x] Added lightweight staff listing API for task assignment options.
- [x] Request 13 - Calendar appointment workflows and notifications.
  - [x] Added appointment-intent suggestions from real inbound communications with reviewable appointment draft flow.
  - [x] Added internal upcoming appointment reminder creation through `/api/crm/notifications`.
  - [x] Appointment create/update/cancel/no-show/complete actions log notifications and remain internal-only.
  - [x] Expanded notification derivation to include new leads, pipeline changes, lead responses, appointments, overdue tasks, AI recommendations, campaigns, and usage cap warnings.
  - [x] Calendar clearly states external calendar sync is not enabled.
- [x] Request 14 - Settings page overhaul.
  - [x] Business Profile and AI Settings now have dedicated save buttons with loading/success/error states.
  - [x] Added server-side AI provider key connection UI/API for Gemini, OpenRouter, and optional OpenAI; keys are never returned to the browser.
  - [x] Added integration key connection UI/API for Resend, Twilio, and Ayrshare with masked configured status.
  - [x] Added selected trial/plan status, actual usage/cap display, commitment discount messaging, BYOK cost language, and credit pack checkout-intent flow.
  - [x] Added payment method setup-required state instead of fake payment success.
- [x] Request 15 - Staff/team management.
  - [x] Added staff management API with create/update/list support and server-side permission records.
  - [x] Added settings-page staff section for adding/editing staff, status, contact info, titles, and granular CRM permissions.
  - [x] Staff changes write audit-log records when the schema is available.
  - [x] Task assignment can use staff records, with Owner / Me fallback when no staff exists.
  - [x] Shared permission constants/helpers remain available for route-by-route enforcement.
- [x] Request 16 - Additional CRM upgrades.
  - [x] Added global Ctrl+K command palette in the real CRM layout.
  - [x] Command palette searches real dashboard context across leads, deals, tasks, campaigns, and communications.
  - [x] Added quick actions for create lead, import CSV, create campaign, create workflow, ask AI, add task, and view pipeline.
  - [x] Preserved notification topbar, collapsed sidebar behavior, and real-data-only CRM records.
- [x] Request 17 - Page-by-page verification.
  - [x] Verified `npm.cmd run build` passes after Requests 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, and 16.
  - [x] Verified dashboard layout still has collapsed-by-default sidebar, notifications, and real-data command palette.
  - [x] Verified analytics metric cards open detail modals with real backing records.
  - [x] Verified leads detail panel actions are wired to existing real CRM APIs.
  - [x] Verified pipeline graphic preserves Kanban/deal controls.
  - [x] Verified marketing recent/expanded campaign sections preserve scheduling, edit/cancel, duplicate, and AI recommendations.
  - [x] Verified workflow run/review/test actions are review-gated and log internal runs only.
  - [x] Verified communications conversation replies save records without external sending.
  - [x] Verified tasks recommendations approve into real tasks and support staff/owner assignment.
  - [x] Verified calendar appointment suggestions/reminders create internal notifications only.
  - [x] Verified settings saves profile, AI settings, provider keys, integrations, credit-pack intents, and staff records without returning secrets.
  - [x] Ran trial-language search; remaining legacy wording is limited to allowed implementation-support copy, with non-trial date filters also present.

## Request 18 - Documentation/checklists

- [x] Public footer/page tests documented above.
- [x] CRM schema tests documented above.
- [x] User data isolation architecture documented above.
- [x] Dashboard metric modal tests documented above.
- [x] Analytics metric modal tests documented above.
- [x] Leads detail panel tests documented above.
- [x] Pipeline graphic tests documented above.
- [x] Marketing expand/filter tests documented above.
- [x] Workflow automation tests documented above.
- [x] Communications conversation tests documented above.
- [x] Task AI recommendation tests documented above.
- [x] Calendar appointment/notification tests documented above.
- [x] Settings save/API key/billing tests documented above.
- [x] Staff permissions tests documented above.
- [ ] Mobile browser tests: `/dashboard`, `/dashboard/analytics`, `/dashboard/leads`, `/dashboard/pipeline`, `/dashboard/tasks`, `/dashboard/calendar`, `/dashboard/marketing`, `/dashboard/communications`, `/dashboard/workflow`, `/dashboard/ai_assistant`, `/dashboard/settings`.
- [ ] Desktop browser tests: same CRM pages plus `/demo`, `/demo/dashboard`, `/demo/leads`, `/demo/marketing`, `/demo/ai_assistant`, `/demo/workflow`, `/demo/communications`, `/demo/settings`.
- [ ] API smoke tests against local dev server and real Supabase credentials.
- [x] Supabase migration instruction: run `supabase/user_crm_full_completion_schema.sql` in Supabase SQL Editor. It is now safe on a fresh database because it creates core tables before altering/indexing.
- [x] Required Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY` recommended, `OPENROUTER_API_KEY` optional fallback, `OPENROUTER_MODEL=openrouter/free`, `AI_ENABLE_OPENAI=false` by default, `OPENAI_API_KEY` optional premium, `CRM_SECRET_ENCRYPTION_KEY` recommended for BYOK secret encryption, plus `RESEND_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `AYRSHARE_API_KEY`, `CRON_SECRET` where used.
- [x] Remaining limitations documented: strict `requireWorkspaceAccess` adoption is still pending route-by-route once final auth/workspace membership is finalized; Stripe/payment collection is setup-required; external calendar sync is not enabled; external sends remain review-gated.

## Final Stabilization Continuation Pass

- [x] Verified `supabase/user_crm_full_completion_schema.sql` can be used as the SQL Editor bootstrap/full-completion schema.
- [x] Verified every `CREATE INDEX ... ON public.*` target has a matching `CREATE TABLE IF NOT EXISTS public.*` in the same SQL file.
- [x] Verified the SQL file contains no `DROP TABLE`, `TRUNCATE TABLE`, or `DELETE FROM` data-reset statements.
- [x] Updated missing-schema runtime errors to explicitly tell the user to run `supabase/user_crm_full_completion_schema.sql` in the Supabase SQL Editor.
- [x] Added optional workspace scoping to shared CRM context loading for dashboard, AI assistant, recommendations, and agent routes.
- [x] Added safe workspace-aware scoping to core CRM routes where compatible with the current local auth model: leads, deals, tasks, appointments, communications, workflows, workflow test runs, staff, settings, notifications, marketing campaigns, marketing activity, and marketing recommendations.
- [x] Preserved local development behavior: routes still work without a final authenticated workspace session, but scope by `workspace_id`/workspace context when provided or available.
- [x] Provider/BYOK connection lookup now scopes by workspace when available so one workspace cannot overwrite another workspace's provider connection.
- [x] Confirmed missing schema remains a clean `success: false` response with `missingSchema: true` where Supabase reports missing tables/columns.
- [x] Confirmed review-gated sends, external calendar limitation, Stripe setup-required state, Gemini/OpenRouter fallback, and OpenAI-disabled-by-default behavior were preserved.
- [x] Final build verification passed with `npm.cmd run build`.
- [x] Final trial-language search passed. Remaining matches are the allowed marketing date filter and the Full Business System implementation-support service item.

## Payment/Billing Stabilization Pass

- [x] Installed Stripe docs skills requested by the user: `stripe-best-practices`, `stripe-projects`, and `upgrade-stripe`.
- [x] Added Stripe env placeholders to `.env.example`: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- [x] Added server-side Stripe Checkout helper for one-time credit-pack purchases; no Stripe secret is exposed to client code.
- [x] Credit pack buttons now create a real Stripe Checkout Session when `STRIPE_SECRET_KEY` is configured, otherwise they preserve the setup-required/reviewable checkout-intent fallback.
- [x] Credit-pack attempts continue to be stored in `crm_credit_pack_purchases` with status and Stripe session metadata when available.
- [x] Added `/api/stripe/webhook` with Stripe signature verification. It marks matching credit-pack checkout records as `paid` only after `checkout.session.completed`, or `expired` after `checkout.session.expired`.
- [x] Added canonical snapshot webhook endpoint `/api/billing/stripe/webhook`; `/api/stripe/webhook` remains a compatibility shim.
- [x] Added `crm_billing_events` to the full Supabase schema with a unique Stripe event id index for idempotent webhook processing.
- [x] Stripe webhook now logs selected snapshot events, ignores unsupported events safely with HTTP 200, and only marks purchases paid after verified webhook confirmation.
- [x] Credit-pack checkout now creates the Supabase purchase before redirecting to Stripe and passes `purchase_id`, `workspace_id`, `company_id`, `user_id`, `pack_type`, and `quantity` in Stripe metadata.
- [x] Settings page shows Stripe configured/missing state, test/live mode, and webhook configured/missing state without exposing keys.
- [x] Added Billing Portal endpoint `/api/billing/portal`; Settings can open it when Stripe is configured, otherwise it remains setup-required.
- [x] Provider/BYOK keys and integration keys remain encrypted server-side and masked after save.
- [x] Provider key updates and credit-pack checkout attempts write audit-log records when the full schema has been applied.
- [x] Stripe implementation follows hosted Checkout Sessions and omits `payment_method_types` so dynamic payment methods can be managed from Stripe Dashboard.
- [x] Stripe webhook fulfillment remains server-side only and stores Stripe session/payment metadata without exposing keys.
- [x] Stripe Sandbox/Test mode deployment reminder: configure a Snapshot payload webhook for `/api/billing/stripe/webhook` only. Do not mix thin-payload webhook secrets with snapshot webhook secrets.
- [x] Selected Stripe snapshot events: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`, `payment_intent.requires_action`, `customer.created`, `customer.updated`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.trial_will_end`, `invoice.paid`, `invoice.payment_succeeded`, `invoice.payment_failed`, `invoice.payment_action_required`, `invoice.upcoming`, `charge.refunded`, `charge.dispute.created`.
- [x] Vercel deployment reminder: add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`, then redeploy. The production webhook URL should be `https://YOUR-VERCEL-DOMAIN.vercel.app/api/billing/stripe/webhook`.
- [x] Security reminder: never commit `.env.local`, rotate any leaked Stripe secret key, keep Sandbox/Test mode until checkout and webhook tests pass, and run `supabase/user_crm_full_completion_schema.sql` before billing tests.

### Stripe Local Test Flow

```powershell
# In one terminal
stripe listen --forward-to localhost:3000/api/billing/stripe/webhook

# Put the displayed whsec_... value in STRIPE_WEBHOOK_SECRET, then restart npm.cmd run dev.
# In the browser, go to /dashboard/settings and start a credit-pack checkout.
# Use Stripe test card 4242 4242 4242 4242 with any future expiry and any CVC.

# After returning from Stripe, verify records:
$base = "http://localhost:3000"
Invoke-RestMethod "$base/api/crm/settings"

# Confirm in Supabase:
# - crm_credit_pack_purchases has status checkout_created before webhook, then paid after checkout.session.completed.
# - crm_billing_events contains the Stripe event id.
# - Replaying the same event is idempotent because stripe_event_id is unique.
```

### API Smoke Tests To Run Locally

```powershell
$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/crm/dashboard"
Invoke-RestMethod "$base/api/crm/notifications"
Invoke-RestMethod "$base/api/crm/staff"
Invoke-RestMethod "$base/api/crm/tasks"
Invoke-RestMethod "$base/api/crm/appointments"
Invoke-RestMethod "$base/api/crm/communications"
Invoke-RestMethod "$base/api/crm/workflows"

Invoke-RestMethod -Method Post "$base/api/crm/agents/run" `
  -ContentType "application/json" `
  -Body '{"agent":"workflow"}'

Invoke-RestMethod -Method Post "$base/api/crm/workflows/run" `
  -ContentType "application/json" `
  -Body '{"workflow_id":"REPLACE_WITH_WORKFLOW_ID"}'
```

### Browser Pages To Test

- `/`
- `/pricing`
- `/services`
- `/trial`
- `/contact`
- `/about`
- `/ai-agents`
- `/automation`
- `/solutions/agencies`
- `/privacy`
- `/support`
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
- `/demo`
- `/demo/dashboard`

## Reusable Final Upgrade Pass - 2026-05-19

- [x] Started pass from clean git state at `81f9a692 Finalize CRM portal Stripe billing and production readiness`.
- [x] Verified clean rebuild flow for local smoke tests: stop local server, delete `.next`, run `npm.cmd run build`, then restart `npm.cmd run start -- -p 3000`.
- [x] Confirmed `npm.cmd run build` passes after a clean `.next` rebuild.
- [x] Confirmed the earlier `/_not-found` page-data build issue is not present; build output includes `○ /_not-found`.
- [x] Confirmed `.next/routes-manifest.json` is regenerated after clean build.
- [x] Confirmed the stale missing `.next/server/vendor-chunks/@supabase.js` path does not reappear as a generated file in the current Next build; local production route and API probes no longer fail from that stale path after a clean rebuild.
- [x] Local production smoke test returned 200 for the required public, demo, and dashboard route list after warm-up. Cold-start requests on this Windows local environment can take several seconds; repeat probes returned 200.
- [x] Production smoke test against `https://synapti-reach.vercel.app` returned 200 for the full required route list.
- [x] Optimized demo navigation behavior: removed the unnecessary `/demo` “Overview” tab and changed the demo tab bar from sticky to normal page flow so it does not block mobile scrolling.
- [x] Verified `/ai-agents`, `/demo`, and `/demo/settings` return 200 locally and in production.
- [x] Verified core CRM API routes return clean 200 responses locally: `/api/crm/dashboard`, `/api/crm/notifications`, `/api/crm/staff`, `/api/crm/tasks`, `/api/crm/appointments`, `/api/crm/communications`, `/api/crm/workflows`, `/api/marketing/recommendations`, and `/api/marketing/campaigns`.
- [x] Added missing additive Supabase schema support for marketing tables used by API/lib code: `marketing_ai_recommendations`, `marketing_campaign_steps`, `marketing_campaign_logs`, `marketing_automation_queue`, `marketing_retry_queue`, `marketing_suppression_list`, `marketing_audit_logs`, and `marketing_media`.
- [x] Added missing additive Supabase schema support for launch-readiness service and waitlist features: `crm_service_catalog`, `crm_service_requests`, `crm_service_orders`, and `waitlist_signups`.
- [x] Added required additive marketing columns used by existing routes: `marketing_campaigns.body`, `platforms`, `scheduled_for`, `stagger_size`, `ai_recommendations`, plus `marketing_events.event_type` and `title`.
- [x] Corrected legacy campaign execution lookup from nonexistent `crm_leads` to canonical `leads`, scoped by campaign workspace when available.
- [x] Confirmed this pass introduced no `DROP TABLE`, `TRUNCATE TABLE`, or `DELETE FROM` statements to `supabase/user_crm_full_completion_schema.sql`.
- [x] Build verification after this pass: `npm.cmd run build` passed.
- [ ] Still pending for later passes: full implementation of Stripe subscription trial checkout/autorenewal UX, CRM services request UI, working public contact form notification flow, waitlist widget/admin management, expanded industry pages, expanded informational pages, CRM metric modal expansion, AI Command Center, workflow signal expansion, mini-brain modules, and review-gated Resend/Twilio replies.

## Dedicated Test Workspace Simulation Foundation - 2026-05-19

- [x] Added additive schema support for isolated test simulation state: `crm_test_simulation_state`, `crm_test_simulation_events`, `crm_test_simulation_snapshots`, and `crm_test_simulation_settings`.
- [x] Added additive compatibility schema support for `workspace_members` and `onboarding_sessions`, matching the legacy Supabase workspace model.
- [x] Added additive workspace flags: `is_test_workspace`, `simulation_enabled`, and `simulation_profile`.
- [x] Added server-only simulation library at `lib/simulation/testWorkspaceSeed.ts`.
- [x] Confirmed active CRM auth architecture: public signup/signin and `/dashboard` use Supabase Auth, workspace ownership uses `workspaces.owner_id`, and NextAuth exists only as a separate/static legacy route.
- [x] Added protected bootstrap API: `POST /api/test/simulation/bootstrap`.
- [x] Added protected simulation APIs: `GET /api/test/simulation/status`, `POST /api/test/simulation/seed`, `POST /api/test/simulation/tick`, `POST /api/test/simulation/reset`, and `POST /api/test/simulation/pause`.
- [x] Bootstrap target email is `donovan.mike966@gmail.com`.
- [x] Bootstrap can create/find the Supabase Auth user server-side with the service-role key, then create/find the test workspace, `workspace_members`, `onboarding_sessions`, baseline `crm_settings`, and simulation state.
- [x] Bootstrap is idempotent and returns the exact `CRM_TEST_WORKSPACE_IDS` value to place in `.env.local`.
- [x] Simulation controls require either an authenticated workspace/account listed in `CRM_TEST_WORKSPACE_IDS` / `CRM_TEST_ACCOUNT_EMAILS` or `CRM_TEST_SIMULATION_SEED_SECRET`; normal public requests receive setup-required or forbidden responses.
- [x] Seed now refuses to run until the workspace has already been explicitly marked as test/simulation by bootstrap.
- [x] Seed data is deterministic and uses stable IDs so re-running seed upserts instead of duplicating indefinitely.
- [x] Every seeded CRM row includes `metadata.is_test_data=true`, `simulation_source="synaptireach_test_workspace"`, `simulation_version`, and `generated_at`.
- [x] Seed foundation covers workspace profile, settings, staff, leads, deals, tasks, appointments, campaigns, campaign events/interactions, conversations/messages, workflows/runs, AI recommendations, marketing recommendations, agent runs, notifications, billing usage, credit/billing state, provider setup states, service requests, contact submissions, waitlist signups, and audit logs.
- [x] Simulation tick advances a deterministic subset of lead/deal/task/campaign state and creates test-only notifications/recommendations/events.
- [x] Reset is implemented only through the protected simulation API and deletes records scoped to the configured test workspace ID; do not run it against any real workspace ID.
- [x] Dashboard shell shows a “Simulated Test Workspace” badge only when the server validates the current workspace as simulation-enabled.
- [x] Settings shows test-only seed/tick/pause/reset controls only for validated test simulation workspaces.
- [x] Local protected-route smoke test passed: `/api/test/simulation/status`, `/api/test/simulation/bootstrap`, and `/api/test/simulation/seed` fail closed with HTTP 403 when called without a valid authenticated test workspace or bootstrap/seed secret.
- [x] Build verification after simulation foundation: `npm.cmd run build` passed.
- [x] Local page smoke after this pass: `/ai-agents`, `/demo`, and `/demo/settings` returned 200 from `npm.cmd run start -- -p 3000` after build warm-up and redirects.
- [x] Clean build artifact check after this pass: `.next/routes-manifest.json` exists and stale `.next/server/vendor-chunks/@supabase.js` is not generated.
- [ ] To enable a real test workspace, set `CRM_ENABLE_TEST_SIMULATION=true`, `CRM_TEST_ACCOUNT_EMAILS=donovan.mike966@gmail.com`, optionally `CRM_TEST_BOOTSTRAP_SECRET=<secret>`, optionally `CRM_TEST_SIMULATION_SEED_SECRET=<secret>`, and run `supabase/user_crm_full_completion_schema.sql` before bootstrap/seed.
- [x] Bootstrap refuses to run if `CRM_TEST_ACCOUNT_EMAILS` is missing, and only allows the requested email when it is explicitly listed there.
- [x] Bootstrap can optionally set or update a local test password through a protected request body field (`test_password`); it returns only `password_set=true/false` and never returns the password.
- [ ] Test workspace seed/tick was not executed against production Supabase in this pass because no explicit test workspace ID was provided in the prompt.
- [ ] Remaining Task 3 work for a later pass: run bootstrap/seed against the configured Supabase project, sign in as the test user, verify every CRM page is populated with simulated data, add snapshot/restore if needed, and tune tick behavior after observing real dashboard data.

### Test Workspace Simulation Commands

```powershell
$base = "http://localhost:3000"

# Required local env before bootstrap:
# CRM_ENABLE_TEST_SIMULATION=true
# CRM_TEST_ACCOUNT_EMAILS=donovan.mike966@gmail.com
# CRM_TEST_BOOTSTRAP_SECRET=<local-dev-secret>
# CRM_TEST_SIMULATION_SEED_SECRET=<local-dev-secret-or-another-secret>

# Bootstrap. This creates/finds the Supabase Auth test user and workspace.
Invoke-RestMethod -Method Post "$base/api/test/simulation/bootstrap" `
  -ContentType "application/json" `
  -Body '{"email":"donovan.mike966@gmail.com","bootstrap_secret":"YOUR_BOOTSTRAP_SECRET"}'

# Optional local/dev bootstrap with a known test password for browser sign-in.
# The password is accepted only by the protected bootstrap route and is never returned.
Invoke-RestMethod -Method Post "$base/api/test/simulation/bootstrap" `
  -ContentType "application/json" `
  -Body '{"email":"donovan.mike966@gmail.com","bootstrap_secret":"YOUR_BOOTSTRAP_SECRET","test_password":"LOCAL_ONLY_TEST_PASSWORD"}'

# Put the returned value into .env.local:
# CRM_TEST_WORKSPACE_IDS=<returned workspace_id>

# Status. Should return setup-required until env vars are configured.
Invoke-RestMethod "$base/api/test/simulation/status"

# Seed with an authenticated configured test workspace, or with the seed secret.
Invoke-RestMethod -Method Post "$base/api/test/simulation/seed" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET"}'

# Advance deterministic simulation activity.
Invoke-RestMethod -Method Post "$base/api/test/simulation/tick" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET"}'

# Pause/resume.
Invoke-RestMethod -Method Post "$base/api/test/simulation/pause" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET","paused":true}'

Invoke-RestMethod -Method Post "$base/api/test/simulation/pause" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET","paused":false}'

# Protected reset. This deletes only records scoped to the configured test workspace.
Invoke-RestMethod -Method Post "$base/api/test/simulation/reset" `
  -ContentType "application/json" `
  -Body '{"workspace_id":"YOUR_TEST_WORKSPACE_ID","seed_secret":"YOUR_SEED_SECRET"}'
```

To disable simulation in production, set `CRM_ENABLE_TEST_SIMULATION=false`, remove `CRM_TEST_BOOTSTRAP_SECRET`, remove `CRM_TEST_SIMULATION_SEED_SECRET`, and remove or empty `CRM_TEST_WORKSPACE_IDS`. Normal users do not receive seed data because all simulation APIs require explicit test env configuration and a workspace marked `is_test_workspace=true`.

## Local-First AI Provider Layer Correction - 2026-05-19

- [x] Preserved the local-first AI provider layer added in the previous pass.
- [x] Corrected Ollama development configuration for Next.js by preferring server-side env vars: `AI_DEFAULT_PROVIDER`, `AI_ENABLE_LOCAL`, `AI_ENABLE_OLLAMA_DEV`, `OLLAMA_BASE_URL`, and `OLLAMA_MODEL`.
- [x] Kept existing `VITE_*` local AI env vars as backward-compatible aliases.
- [x] Confirmed `ollama-dev` routing remains development-only and local-allowed-task-only.
- [x] Added future-ready `customer-local` provider interface with disabled-by-default workspace config fields for status, endpoint URL, model, and workspace ID.
- [x] Added `POST /api/ai/customer-local/test` as the future test connection action.
- [x] Updated `aiClient.runTask` routing order documentation: deterministic mini-brain, Ollama dev, customer-local, SynaptiReach backend/cloud, safe mock fallback.
- [x] Added Supabase env guards for `/api/cron/marketing/retries` and `getRetryCampaigns()` so missing Supabase env returns setup-required at runtime instead of crashing page-data collection at build import time.
- [x] Build verification for this correction pass: `npm.cmd run build` passed with local `.env.local` missing Supabase credentials.

## Expanded Deterministic Mini-Brain Intelligence - 2026-05-19

- [x] Added normalized deterministic intelligence types and result shape under `lib/intelligence/types.ts`.
- [x] Added the core deterministic mini-brain orchestrator at `lib/intelligence/miniBrain.ts`.
- [x] Added zero-cost intelligence modules for lead scoring, deal scoring, pipeline, campaigns, communications, tasks, appointments, workflow signals, billing usage, onboarding/setup, business health, safety checks, recommendations, executive summaries, forecasting, anomaly detection, next-best action, CRM hygiene, staff extension points, intent detection, and simulation signal metadata.
- [x] Mini-brain outputs are structured, explainable, review-gated, and tagged with `source="mini_brain"`.
- [x] Existing CRM deterministic agent now uses the mini-brain output first while preserving legacy summary/detail arrays used by current dashboard pages.
- [x] AI router deterministic provider can now return precomputed mini-brain text or run a supplied mini-brain context before trying Ollama/customer-local/backend providers.
- [x] AI Assistant page now surfaces when mini-brain deterministic insights are available and maps new action types to the correct CRM pages.
- [x] Mini-brain does not perform irreversible external sends, payment changes, or destructive data actions.
- [x] Build verification after mini-brain expansion: `npm.cmd run build` passed.
- [ ] Live test workspace bootstrap/seed/tick/browser verification still requires configured local secrets/env and a real run against Supabase.

## V8 Mini-Brain Integration Upgrade - 2026-05-19

- [x] Preserved the corrected local-first AI architecture and did not redo the provider layer from scratch.
- [x] Verified `npm.cmd run build` passes after this V8 integration pass.
- [x] Confirmed `.next/routes-manifest.json` exists after build and the stale `.next/server/vendor-chunks/@supabase.js` file is not generated.
- [x] Added a mini-brain rule registry at `lib/intelligence/ruleRegistry.ts` so deterministic CRM rules run in a stable, extensible order.
- [x] Added reusable mini-brain support modules: scoring config, confidence helpers, explanation helpers, action/page mapping, CRM context builder, and optional persistence helper.
- [x] Added deeper deterministic lead intelligence covering hot unconverted leads, stale leads, missing contact details, duplicate lead groups, suggested channels, confidence, and review-gated next actions.
- [x] Added simulation-aware mini-brain output that only appears when the workspace context is explicitly marked as a test workspace.
- [x] Updated the mini-brain orchestrator to use registered rules, deduplicate insights, and include rule IDs in `data_used`.
- [x] Added `GET /api/intelligence/summary` for transient built-in intelligence summaries.
- [x] Added `POST /api/intelligence/run` for transient runs plus optional, explicit persistence into existing `marketing_ai_recommendations`.
- [x] Kept persistence opt-in only; mini-brain does not auto-create durable recommendations unless the API caller sends `persist=true`.
- [x] Updated AI provider metadata to support `providerUsed="mini_brain"` while preserving `mock` for safe dev/demo fallback.
- [x] Dashboard now shows a compact Built-in Intelligence / Mini-Brain executive signal panel with priority, confidence, reasoning, and review-gated links.
- [x] AI Assistant now shows detailed mini-brain insight cards with source, confidence, reasoning, recommended action, and review-gated routing.
- [x] Local shell did not contain `CRM_ENABLE_TEST_SIMULATION`, `CRM_TEST_ACCOUNT_EMAILS`, or `CRM_TEST_WORKSPACE_IDS`, so live bootstrap/seed/tick/browser verification was not run in this pass.
- [ ] Remaining Task 20 work: deeper per-page metric modal integration, approve/deny feedback loops, richer persistence idempotency, notification/task/workflow draft conversion actions, and tuning against the live simulated test workspace.

### V8 Mini-Brain API Smoke Tests

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

# Requires Supabase env for real CRM data. If missing, returns setup-required.
Invoke-RestMethod "$base/api/intelligence/summary"

# Transient deterministic run.
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'

# Optional review-queue persistence into marketing_ai_recommendations.
# Keep this off unless you intentionally want durable pending recommendations.
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":true,"limit":5}'
```

## V9 CRM-Wide Mini-Brain Integration Upgrade - 2026-05-19

- [x] Preserved the local-first AI architecture: deterministic mini-brain first, Ollama dev-only, customer-local future/setup-required, backend/cloud fallback, safe mock fallback.
- [x] Verified `npm.cmd run build` passes after the V9 page integration pass.
- [x] Confirmed `.next/routes-manifest.json` exists after build.
- [x] Confirmed stale `.next/server/vendor-chunks/@supabase.js` is not generated after build.
- [x] Added reusable CRM-wide built-in intelligence UI at `components/intelligence/MiniBrainInsightPanel.tsx`.
- [x] Integrated compact Mini-Brain / Built-in Intelligence panels into:
  - `/dashboard/analytics`
  - `/dashboard/leads`
  - `/dashboard/pipeline`
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/marketing`
  - `/dashboard/communications`
  - `/dashboard/workflow`
  - `/dashboard/settings`
- [x] Preserved existing Dashboard and AI Assistant mini-brain integrations from the previous pass.
- [x] Expanded `lib/crm/data.ts` context loading to include notifications, staff, billing account state, and usage events where Supabase tables are available.
- [x] Expanded `MiniBrainContext` to carry staff, billing, and usage inputs safely.
- [x] Added rule metadata to the mini-brain registry: stable rule IDs, categories, severity, required inputs, action types, destination pages, and enabled-by-default state.
- [x] Mini-brain insights now carry review metadata such as `rule_id`, `rule_category`, `destinationPage`, and `review_required`.
- [x] Deepened staff/team intelligence with unassigned-work and overdue-workload signals.
- [x] Deepened billing/usage intelligence with usage-event totals, cap-risk warnings, and usage-without-billing setup warnings.
- [x] Page integrations fetch transient summaries only and do not persist duplicate recommendations on page load.
- [x] Mini-brain UI labels deterministic output as Built-in Intelligence / Mini-Brain and does not imply an external paid AI call was used.
- [x] Mini-brain remains review-gated and never auto-sends external messages, auto-posts social content, or changes billing/payment state.
- [x] No Supabase schema changes were required in this pass.
- [ ] Live test workspace bootstrap/seed/tick/browser verification still requires configured local Supabase and `CRM_TEST_*` env secrets.
- [ ] Remaining Task 20 work: per-record metric modal insight wiring, approve/deny/dismiss feedback loops across every page, richer durable idempotency keys, task/workflow/message draft conversion actions, and tuning against the live seeded test workspace.

### V9 Mini-Brain Page Smoke Targets

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/intelligence/summary"
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'

# Browser-check these pages for compact Built-in Intelligence panels:
# /dashboard
# /dashboard/analytics
# /dashboard/leads
# /dashboard/pipeline
# /dashboard/tasks
# /dashboard/calendar
# /dashboard/marketing
# /dashboard/communications
# /dashboard/workflow
# /dashboard/ai_assistant
# /dashboard/settings
```

## V9 Mini-Brain Review-Gated Actions Upgrade - 2026-05-19

- [x] Added `POST /api/intelligence/actions` for safe Mini-Brain approve/deny/dismiss behavior.
- [x] Approve actions are mapped only to internal review-gated outcomes:
  - `crm_tasks` task drafts for task, assignment, and appointment-prep actions.
  - `crm_messages` draft messages for message suggestions.
  - `crm_workflows` draft workflows for workflow suggestions.
  - `crm_notifications` review notifications for risk/setup/billing/campaign review actions.
- [x] Dismiss/deny decisions are recorded in `crm_audit_logs` without creating external actions.
- [x] Approved Mini-Brain actions also write an audit log entry with source, insight ID, action type, confidence, and created record metadata.
- [x] Updated `MiniBrainInsightPanel` with compact approve/dismiss buttons, inline loading states, and success/error states.
- [x] Updated Mini-Brain persistence to check deterministic `metadata.idempotency_key` before inserting `marketing_ai_recommendations`, reducing duplicate persisted recommendations.
- [x] Confirmed page integrations remain transient on load; durable writes happen only from explicit user action or explicit `persist=true`.
- [x] Confirmed no external email, SMS, social post, payment, subscription, or destructive operation is performed by Mini-Brain actions.
- [x] Verified `npm.cmd run build` passes after the action upgrade.
- [x] Confirmed `.next/routes-manifest.json` exists after build and `.next/server/vendor-chunks/@supabase.js` is not generated.
- [x] No Supabase schema changes were required in this pass; existing tables were used.
- [ ] Live approve/dismiss API testing still requires configured Supabase env and an authenticated or explicitly scoped workspace context.

### V9 Review-Gated Action Smoke Test

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

# Transient run, no persistence.
$result = Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'

# Approve the first Mini-Brain insight into an internal review-gated draft.
$insight = $result.result.insights[0]
Invoke-RestMethod -Method Post "$base/api/intelligence/actions" `
  -ContentType "application/json" `
  -Body (@{ decision = "approve"; insight = $insight } | ConvertTo-Json -Depth 12)

# Dismiss an insight without creating an external action.
Invoke-RestMethod -Method Post "$base/api/intelligence/actions" `
  -ContentType "application/json" `
  -Body (@{ decision = "dismiss"; insight = $insight } | ConvertTo-Json -Depth 12)
```

## V9 Mini-Brain Scorecards and Insight Details Upgrade - 2026-05-19

- [x] Verified `npm.cmd run build` passes after the scorecard/detail-modal upgrade.
- [x] Confirmed `.next/routes-manifest.json` exists after build and `.next/server/vendor-chunks/@supabase.js` is not generated.
- [x] Confirmed no `DROP TABLE`, `TRUNCATE TABLE`, or destructive `DELETE FROM` statements were added to `supabase/user_crm_full_completion_schema.sql`.
- [x] Added `MiniBrainScore` to `lib/intelligence/types.ts` and exposed scorecards on the `MiniBrainResult`.
- [x] Added `lib/intelligence/scorecards.ts` for deterministic CRM scorecards:
  - Business health
  - Pipeline focus
  - Marketing efficiency
  - Setup readiness
  - CRM hygiene
- [x] Updated `lib/intelligence/miniBrain.ts` so every run returns structured scorecards alongside insights, recommendations, actions, confidence, and data-used metadata.
- [x] Expanded `lib/crm/data.ts` context loading to include `crm_provider_connections` and provider readiness metrics for setup/safety intelligence.
- [x] Updated `components/intelligence/MiniBrainInsightPanel.tsx` so every integrated CRM page shows compact deterministic scorecards.
- [x] Added a shared Mini-Brain details modal with full reasoning, confidence, priority, source, related records, and review-gated next-step copy.
- [x] Details modal confirms Mini-Brain actions create only internal drafts/review records and do not send email/SMS/social posts or perform billing actions.
- [x] Page loads still use transient `/api/intelligence/summary`; no durable recommendation persistence happens unless an explicit action or `persist=true` request is made.
- [ ] Live scorecard/insight behavior still needs browser verification against the seeded test workspace after `CRM_TEST_*` env secrets are configured.

### V9 Scorecard Smoke Targets

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

$summary = Invoke-RestMethod "$base/api/intelligence/summary"
$summary.result.scores

# Browser-check scorecards and the "Why this matters" modal on:
# /dashboard/analytics
# /dashboard/leads
# /dashboard/pipeline
# /dashboard/tasks
# /dashboard/calendar
# /dashboard/marketing
# /dashboard/communications
# /dashboard/workflow
# /dashboard/settings
```

## V9 Mini-Brain Helper Result Types Upgrade - 2026-05-19

- [x] Added shared Mini-Brain helper result contracts to `lib/intelligence/types.ts`.
- [x] Added `MiniBrainActionCard` for ranked review-gated actions with urgency, impact, effort, confidence, reason, destination, and related record metadata.
- [x] Added `MiniBrainTemplateDraft` for deterministic rule-based email/SMS draft templates with tone, personalization fields, and `reviewRequired=true`.
- [x] Added helper result types for:
  - `LeadIntelligenceCard`
  - `DealHealthCard`
  - `CampaignHealthCard`
  - `ConversationSummary`
  - `WorkflowSignalCard`
  - `TaskPriorityCard`
  - `AppointmentPrepCard`
  - `BillingUsageForecast`
  - `SetupReadinessScore`
  - `StaffWorkloadSummary`
  - `BusinessHealthSummary`
  - `SafetyCheckResult`
- [x] Added optional `helperResults` to `MiniBrainResult` so future page modals, record detail panels, and workflow signals can consume stable typed structures without changing the current insight API shape.
- [x] Helper result contracts preserve review-gated semantics and do not allow automatic email, SMS, social, billing, payment, auth, or destructive actions.
- [x] Verified `npm.cmd run build` passes after the helper type expansion.
- [ ] Remaining helper-result work: populate these contracts from each domain module and wire them into per-record modals after live seeded-workspace tuning.

## Task 20 Goal Run - HelperResults Population and Empty-Context Verification - 2026-05-19

- [x] Read `docs/codex/CODEX_TASK_LEDGER.md` and `docs/codex/TASK20_MINIBRAIN_GOAL.md` before implementation.
- [x] `docs/codex/SYNAPTIREACH_MASTER_V9.md` was requested by the goal but is not present in `docs/codex`; continued from the available repo docs, checklist, and current working tree.
- [x] Updated `docs/codex/CODEX_TASK_LEDGER.md` after each checkpoint.
- [x] Added `lib/intelligence/helperResults.ts` to populate Mini-Brain helperResults from real normalized CRM context.
- [x] `runMiniBrain()` now returns populated helperResults for:
  - lead scorecards
  - deal health cards
  - campaign health cards
  - conversation summaries
  - workflow signals
  - task priority cards
  - appointment prep cards
  - billing/usage forecasts
  - setup readiness
  - staff workload summaries
  - business health summaries
  - safety check results
  - ranked review-gated actions
  - rule-based draft templates
- [x] Updated `components/intelligence/MiniBrainInsightPanel.tsx` to render page-relevant domain helper cards from helperResults, using the existing page `types` filters.
- [x] Helper cards open in the shared "Why this matters" modal with deterministic reasoning, confidence, priority, source, related records, and review-gated next step.
- [x] Updated `buildMiniBrainContext()` to return a successful empty real-data context with setup/schema warnings when Supabase setup is unavailable, so Mini-Brain can still run without external AI providers or live database access.
- [x] Verified `npm.cmd run build` passes after helperResults population and empty-context fallback.
- [x] Local production API smoke test passed:
  - `GET /api/intelligence/summary` returned 200.
  - `POST /api/intelligence/run` with `{"persist":false}` returned 200.
- [x] Empty/setup-warning context no longer crashes Mini-Brain APIs.
- [x] Page loads still use transient summaries and do not persist durable recommendations repeatedly.
- [x] No external email, SMS, social post, charge, subscription update, payment status update, or destructive data action is performed by Mini-Brain.
- [x] Confirmed no destructive `DROP TABLE`, `TRUNCATE TABLE`, or destructive `DELETE FROM` was added to `supabase/user_crm_full_completion_schema.sql`.
- [x] Build artifact check: `.next/routes-manifest.json` exists. `.next/server/vendor-chunks/@supabase.js` is currently generated and present, so the prior missing-file ENOENT condition is not reproduced.
- [ ] Remaining Task 20 work: richer per-record metric modal wiring, live seeded test-workspace tuning, and authenticated approve/dismiss/action DB-write verification.

### Task 20 Goal Verification Commands

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/intelligence/summary"
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'
```

## Task 20 Continuation - CRM-Wide Panel Completion - 2026-05-19

- [x] Read `docs/codex/SYNAPTIREACH_MASTER_V9.md` and `docs/codex/CODEX_TASK_LEDGER.md` before continuing.
- [x] Continued Task 20 only and preserved completed mini-brain/local-AI work.
- [x] Updated `docs/codex/CODEX_TASK_LEDGER.md` after each checkpoint.
- [x] Added the shared `MiniBrainInsightPanel` to `/dashboard`, giving the main dashboard the same helperResults scorecards, helper cards, modal, and review-gated action flow used by the other CRM pages.
- [x] Added the shared `MiniBrainInsightPanel` to `/dashboard/ai_assistant`, so the AI Command Center also consumes helperResults and deterministic scorecards before external AI.
- [x] Existing shared panel coverage remains in:
  - `/dashboard/analytics`
  - `/dashboard/leads`
  - `/dashboard/pipeline`
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/marketing`
  - `/dashboard/communications`
  - `/dashboard/workflow`
  - `/dashboard/settings`
- [x] Updated the Mini-Brain detail modal with related-record open links and inline action feedback for approve/dismiss decisions.
- [x] All shared panel page loads still call transient `/api/intelligence/summary`; no durable recommendations are persisted on page load.
- [x] Safe actions remain review-gated and internal only: task drafts, workflow drafts, message drafts, notifications/review records, related-page links, approve/dismiss.
- [x] Confirmed no auto-send email/SMS/social behavior, no auto-charge behavior, and no secret exposure was added.
- [x] Verified `npm.cmd run build` passes after this continuation.
- [x] Local production API smoke test passed:
  - `GET /api/intelligence/summary` returned 200.
  - `POST /api/intelligence/run` with `{"persist":false}` returned 200.
- [x] Confirmed no destructive `DROP TABLE`, `TRUNCATE TABLE`, or destructive `DELETE FROM` was added to `supabase/user_crm_full_completion_schema.sql`.
- [x] Build artifact check: `.next/routes-manifest.json` exists. `.next/server/vendor-chunks/@supabase.js` is generated and present, so the prior missing vendor-chunk ENOENT condition is not reproduced.
- [ ] Task 20 remains partial, not fully complete, until live seeded-workspace tuning and authenticated approve/dismiss/action DB-write verification are completed.

### Task 20 Continuation Test Commands

```powershell
npm.cmd run build
npm.cmd run start -- -p 3000

$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/intelligence/summary"
Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'
```

## Task 3 / Task 2A - Test Workspace Live Verification Pass - 2026-05-19

- [x] Read `docs/codex/SYNAPTIREACH_MASTER_V9.md` and `docs/codex/CODEX_TASK_LEDGER.md` before continuing.
- [x] Continued Task 3 / Task 2A only; no billing, services, waitlist, public page, or Task 20 implementation work was performed.
- [x] Updated `docs/codex/CODEX_TASK_LEDGER.md` at each checkpoint.
- [x] Inspected all protected simulation routes:
  - `POST /api/test/simulation/bootstrap`
  - `GET /api/test/simulation/status`
  - `POST /api/test/simulation/seed`
  - `POST /api/test/simulation/tick`
  - `POST /api/test/simulation/pause`
  - `POST /api/test/simulation/reset`
- [x] Inspected `lib/simulation/testWorkspaceSeed.ts` and confirmed the seed foundation covers:
  - 84 leads
  - 32 deals
  - 64 tasks
  - 26 appointments
  - 22 campaigns plus campaign events/interactions
  - communications, CRM conversations, and CRM messages
  - workflows and workflow runs
  - CRM and marketing AI recommendations plus agent runs
  - notifications
  - billing account and usage events
  - service requests
  - waitlist and contact submissions
  - provider setup-required rows
  - staff roles and staff permissions
- [x] Confirmed seed IDs are deterministic and rows are upserted by stable IDs, so repeated seed calls are designed to be idempotent instead of endlessly duplicating records.
- [x] Confirmed seeded rows use `metadata: testMeta(...)` where supported, including:
  - `is_test_data: true`
  - `simulation_source: "synaptireach_test_workspace"`
  - `simulation_version`
  - `generated_at`
- [x] Confirmed bootstrap creates or finds the Supabase Auth user for `donovan.mike966@gmail.com`, creates/fixes the workspace, links `workspace_members`, writes onboarding/settings records, marks the workspace as test/simulation, and returns `workspace_id`, `company_id`, and `user_id`.
- [x] Confirmed dashboard/settings simulation UI is only shown when `/api/test/simulation/status` returns `allowed`.
- [x] Hardened simulation controls so status, seed, tick, pause, and reset now all verify `workspaces.is_test_workspace=true` before reading or mutating simulation state.
- [x] Confirmed `npm.cmd run build` passes after the simulation guard hardening.
- [x] Build artifact check: `.next/routes-manifest.json` exists after the final build.
- [ ] Live bootstrap was not executed because this shell and `.env.local` do not currently expose the required local env vars.
- [ ] Live status/seed/tick/pause/reset API verification remains blocked until local `CRM_TEST_*` and Supabase service credentials are configured.
- [ ] Seeded record counts, metadata, normal-user isolation, and browser page population still need live Supabase verification after bootstrap.
- [ ] Local HTTP fail-closed probes were attempted, but the local Next server exited during route probing in this shell; do not treat route probes as passed until rerun after env/server setup.

### Required Local Env For Live Test Workspace Verification

Set these in `.env.local` before rerunning the live bootstrap flow:

```powershell
Add-Content .env.local "CRM_ENABLE_TEST_SIMULATION=true"
Add-Content .env.local "CRM_TEST_ACCOUNT_EMAILS=donovan.mike966@gmail.com"
Add-Content .env.local "CRM_TEST_BOOTSTRAP_SECRET=replace-with-local-dev-secret"
Add-Content .env.local "CRM_TEST_SIMULATION_SEED_SECRET=replace-with-local-dev-secret"
Add-Content .env.local "NEXT_PUBLIC_SUPABASE_URL=replace-with-project-url"
Add-Content .env.local "SUPABASE_SERVICE_ROLE_KEY=replace-with-service-role-key"
```

After bootstrap returns a workspace ID, add:

```powershell
Add-Content .env.local "CRM_TEST_WORKSPACE_IDS=returned-workspace-id"
```

### Live Bootstrap / Seed / Tick Commands

```powershell
npm.cmd run build
npm.cmd run start -- -H 127.0.0.1 -p 3000

$base = "http://127.0.0.1:3000"

$bootstrap = Invoke-RestMethod -Method Post "$base/api/test/simulation/bootstrap" `
  -ContentType "application/json" `
  -Body '{"email":"donovan.mike966@gmail.com","bootstrap_secret":"YOUR_BOOTSTRAP_SECRET","test_password":"LOCAL_ONLY_TEST_PASSWORD"}'

$bootstrap.workspace_id
$bootstrap.company_id
$bootstrap.user_id

# Add CRM_TEST_WORKSPACE_IDS=$($bootstrap.workspace_id) to .env.local, restart the server, then run:

Invoke-RestMethod "$base/api/test/simulation/status?workspace_id=$($bootstrap.workspace_id)&secret=YOUR_SEED_SECRET"

Invoke-RestMethod -Method Post "$base/api/test/simulation/seed" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET" } | ConvertTo-Json)

Invoke-RestMethod -Method Post "$base/api/test/simulation/tick" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET" } | ConvertTo-Json)

Invoke-RestMethod -Method Post "$base/api/test/simulation/pause" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET"; paused = $true } | ConvertTo-Json)

Invoke-RestMethod -Method Post "$base/api/test/simulation/pause" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET"; paused = $false } | ConvertTo-Json)

# Reset is destructive only inside the marked test workspace.
Invoke-RestMethod -Method Post "$base/api/test/simulation/reset" `
  -ContentType "application/json" `
  -Body (@{ workspace_id = $bootstrap.workspace_id; seed_secret = "YOUR_SEED_SECRET" } | ConvertTo-Json)
```

### Browser Pages To Verify After Live Seed

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

Verify that the test user sees normal CRM pages populated with seeded simulated data, while normal users do not see simulation controls, the simulated workspace badge, or test records.

## Task 3 / Task 2A - Live Verification and Polish Completion - 2026-05-19

- [x] Task 3 / Task 2A continued only; billing/services/waitlist/public pages were not changed.
- [x] Live bootstrap succeeded for the dedicated test account:
  - Email: `donovan.mike966@gmail.com`
  - Workspace ID: `cc2d162a-33e9-4d0b-8a8f-b9d35f68d4a8`
  - Company ID: `c833d54d-20f9-4760-bf3c-d72619e7ada9`
  - User ID: `26525fd4-c5ad-4139-bb23-c607c6b73645`
- [x] Live seed succeeded and returned rich simulated counts across leads, deals, tasks, appointments, marketing, communications, conversations, workflows, recommendations, notifications, billing, services, waitlist, contacts, providers, staff, and audit logs.
- [x] Live tick succeeded twice and advanced the simulation to day 3.
- [x] CRM API smoke checks returned seeded data during live verification.
- [x] Browser login now works after adding `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Confirmed browser auth code requires `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
  - `lib/supabase/client.ts`
  - `lib/supabase/server.ts`
- [x] Manual browser verification confirmed the test user loads normal CRM pages, not fake separate pages:
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
- [x] Normal-user simulation isolation is enforced by code:
  - Simulation controls call `/api/test/simulation/status`.
  - Dashboard/settings simulation UI only appears when status returns `allowed`.
  - Simulation routes require configured test env/secret or allowed test account context.
  - Status, seed, tick, pause, and reset all verify `workspaces.is_test_workspace=true` before proceeding.
  - Seeded records are scoped by the configured test workspace ID and use normal CRM pages/data APIs.
- [x] Added schema repair for the live seed issue:
  - `public.marketing_campaigns.metadata jsonb not null default '{}'::jsonb` is now in the create-table definition.
  - `alter table if exists public.marketing_campaigns add column if not exists metadata jsonb not null default '{}'::jsonb;` is now included for existing databases.
- [x] Seeded test rows use deterministic IDs/upserts and `metadata: testMeta(...)` where supported, including test/simulation metadata.
- [x] Removed active customer-facing `mini-brain` wording from CRM UI/API messages and replaced it with polished intelligence language:
  - Built-in Intelligence
  - Business Intelligence
  - Smart Signals
  - Review-gated intelligence action
- [x] Internal code identifiers such as `MiniBrainInsight` and `miniBrain.ts` remain unchanged to avoid breakage; they are not customer-facing labels.
- [x] Added `components/dashboard/QueryRecordFocus.tsx` to support safe query/hash focus patterns from intelligence and recommendation links.
- [x] Added related-record routing/focus patterns:
  - `/dashboard/leads?leadId=...`
  - `/dashboard/pipeline?dealId=...`
  - `/dashboard/tasks?taskId=...`
  - `/dashboard/calendar?appointmentId=...`
  - `/dashboard/marketing?campaignId=...`
  - `/dashboard/communications?conversationId=...`
  - `/dashboard/workflow?workflowId=...`
  - `/dashboard/settings#billing`
  - `/dashboard/settings#providers`
- [x] Updated intelligence card routing so related records prefer exact item links where possible.
- [x] Page loads still use transient intelligence summaries and do not persist duplicate durable recommendations.
- [x] Review-gated intelligence actions remain internal only; no email, SMS, social post, Stripe charge, payment status update, or destructive action is triggered.
- [x] Verified `npm.cmd run build` passes after Task 3 polish.
- [x] Build artifact checks:
  - `.next/routes-manifest.json` exists.
  - `.next/BUILD_ID` exists.
- [x] Static customer-facing phrase check: active `app`, `components`, and `lib` UI/API strings no longer contain `mini-brain` / `mini brain`; remaining matches are internal code identifiers only.
- [ ] Local `next start` HTTP probes exited immediately after reporting "Ready" in this shell, so this pass did not add fresh local HTTP API probe results. Use the already successful live API/browser verification above and rerun route probes in a clean local shell if needed.

### Task 3 Final Verification Commands

```powershell
npm.cmd run build

# Start in a clean shell if local route probes are needed:
npm.cmd run start -- -H 127.0.0.1 -p 3000

$base = "http://127.0.0.1:3000"
$workspace = "cc2d162a-33e9-4d0b-8a8f-b9d35f68d4a8"

Invoke-RestMethod "$base/api/test/simulation/status?workspace_id=$workspace&secret=YOUR_SEED_SECRET"

Invoke-RestMethod -Method Post "$base/api/intelligence/run" `
  -ContentType "application/json" `
  -Body '{"persist":false}'
```

### Task 3 Status

Task 3 / Task 2A is marked complete for launch-readiness tracking. The dedicated simulated workspace exists, has rich seeded data, advances with ticks, uses normal CRM pages, and is protected by test-workspace guards. Continue to use this workspace for Task 20 tuning and later CRM/browser smoke tests.

## Tasks 5-12 Implementation Checkpoint - 2026-05-19

- [x] Continued from the current working tree and limited this pass to Tasks 5-12.
- [x] `npm.cmd run build` passes after Tasks 5-12 changes.
- [x] Added richer central plan metadata in `lib/billing/plans.ts`:
  - BYOK and SynaptiReach-managed tiers.
  - Monthly prices.
  - Stripe price env var names.
  - AI/email/SMS/contact/agent/workflow caps.
  - Hard-cap behavior.
  - Credit-pack eligibility.
  - BYOK provider-cost responsibility.
- [x] Added subscription Checkout intent route:
  - `POST /api/billing/subscription/checkout`
  - Uses Stripe Checkout `mode=subscription`.
  - Uses a 14-day trial.
  - Does not hardcode `payment_method_types`.
  - Does not mark subscriptions active without webhook confirmation.
  - Returns setup-required when Stripe price env vars or Supabase env are missing.
- [x] Updated Stripe webhook handling to store subscription checkout metadata and subscription lifecycle references where Stripe confirms events.
- [x] Added dashboard settings subscription plan selection and required disclosure:
  - “After the 14-day trial, your selected plan renews automatically unless canceled before the trial ends.”
- [x] Added `lib/billing/services.ts` service catalog for services, bundles, and retainers.
- [x] Added dashboard service consultation request flow:
  - `POST /api/crm/services/request`
  - Stores `crm_service_requests`.
  - Creates notifications/audit logs where Supabase is configured.
  - Does not trigger payment or fake paid orders.
- [x] Updated public `/services`:
  - Buttons now say `Contact SynaptiReach`.
  - Buttons route to `/contact?service=...`.
  - Consultation language explains the required 30-minute video consultation.
  - Pricing and Full Business System 30-day implementation support are preserved.
- [x] Rebuilt `/contact` as a working form:
  - Posts to `POST /api/contact`.
  - Saves `contact_submissions` when Supabase is configured.
  - Sends SynaptiReach notification email via Resend when configured.
  - Includes honeypot spam field.
  - Supports service, support, waitlist, trial, partner, and general inquiries.
- [x] Added admin contact view:
  - `/admin/dashboard/contact-submissions`
- [x] Added public waitlist widget:
  - Visible on public marketing pages.
  - Hidden from demo, dashboard, and admin paths.
  - Collects launch cohort fields.
  - Saves to `waitlist_signups` when Supabase is configured.
  - Deduplicates by email.
  - Assigns first-5 founding cohort eligibility.
  - Sends internal Resend email when configured.
- [x] Added admin waitlist view:
  - `/admin/dashboard/waitlist`
- [x] Added dynamic industry pages:
  - `/solutions/[industry]`
  - Required industries are covered, including real estate, med spa, dental, home services, contractors, ecommerce, consultants, coaches, gyms/fitness, restaurants/local businesses, automotive, insurance, financial services, education/training, nonprofit, and other industry.
- [x] Updated compact footer Solutions list to include all industries plus “Don’t See Your Industry?”.
- [x] Expanded public info pages:
  - `/about`
  - `/blog`
  - `/careers`
  - `/privacy`
  - `/terms`
  - `/security`
  - `/support`
  - `/analytics`
  - `/ai-agents`
- [x] Button cleanup:
  - `/support` uses only `Contact Support`.
  - `/privacy` uses only `Contact SynaptiReach`.
  - `/careers` uses only `Contact Us`.
- [x] Hardened Supabase build/runtime helpers:
  - `lib/supabase/client.ts` validates public Supabase URL before browser client construction.
  - `lib/crm/supabaseAdmin.ts` validates Supabase URL before service-role client construction and returns setup-required instead of crashing.

### Tasks 5-12 Smoke Tests

```powershell
npm.cmd run build

$job = Start-Job -ScriptBlock { Set-Location 'C:\Users\nikna\SynaptiReach'; npm.cmd run start -- -p 3008 }
Start-Sleep -Seconds 8
$routes = @(
  '/pricing','/trial','/services','/contact','/about','/blog','/careers',
  '/privacy','/terms','/security','/support','/analytics','/ai-agents',
  '/solutions/real-estate','/solutions/med-spa','/solutions/other-industry',
  '/admin/dashboard/contact-submissions','/admin/dashboard/waitlist'
)
$routes | ForEach-Object {
  Invoke-WebRequest -Uri "http://localhost:3008$_" -MaximumRedirection 5 -TimeoutSec 20 -UseBasicParsing
}
Stop-Job -Job $job
Remove-Job -Job $job
```

Observed result: all listed pages returned 200.

### Tasks 5-12 API Smoke Results

With the current local env, valid payload API probes returned clean setup-required responses because Supabase env is unavailable/invalid:

- `POST /api/contact` -> 503 setup-required.
- `POST /api/waitlist` -> 503 setup-required.
- `POST /api/billing/subscription/checkout` -> 503 setup-required.
- `POST /api/crm/services/request` -> 503 setup-required.

This is a safe failure mode. With valid env, rerun live-write tests:

```powershell
$base = "http://localhost:3000"

Invoke-RestMethod -Method Post "$base/api/contact" `
  -ContentType "application/json" `
  -Body '{"name":"Smoke Test","email":"smoke@example.com","message":"Contact smoke test","source":"local_smoke"}'

Invoke-RestMethod -Method Post "$base/api/waitlist" `
  -ContentType "application/json" `
  -Body '{"full_name":"Smoke Test","work_email":"waitlist-smoke@example.com","consent_to_contact":true,"source":"local_smoke"}'

Invoke-RestMethod -Method Post "$base/api/billing/subscription/checkout" `
  -ContentType "application/json" `
  -Body '{"plan":"growth-managed"}'

Invoke-RestMethod -Method Post "$base/api/crm/services/request" `
  -ContentType "application/json" `
  -Body '{"itemName":"Growth Engine"}'
```

Required live env for full verification:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Stripe subscription price env vars:
  - `STRIPE_PRICE_BASIC_BYOK`
  - `STRIPE_PRICE_GROWTH_BYOK`
  - `STRIPE_PRICE_PREMIUM_BYOK`
  - `STRIPE_PRICE_BASIC_MANAGED`
  - `STRIPE_PRICE_GROWTH_MANAGED`
  - `STRIPE_PRICE_PREMIUM_MANAGED`

### Tasks 5-12 Status

- Task 5: Partial. Subscription Checkout intent exists and build passes; live Stripe price/session/webhook/trial lifecycle verification remains.
- Task 6: Partial. Tiers/caps are centrally modeled and visible in settings; full cap enforcement tests remain.
- Task 7: Partial. Dashboard service request UI/API exists; live Supabase write verification remains.
- Task 8: Complete for current scope.
- Task 9: Partial. Contact form/API/admin exists; live Supabase insert and Resend delivery verification remain.
- Task 10: Partial. Waitlist widget/API/admin exists; live Supabase insert, Resend notification, and invite/admin action flows remain.
- Task 11: Complete for current scope.
- Task 12: Partial. Public pages are expanded and button cleanup is applied; final mobile/desktop visual polish remains.

## Launch Readiness Goal Checkpoint 1 - 2026-05-19

- [x] Started the full remaining launch-readiness goal from the current working tree.
- [x] Read the required files before implementation:
  - `docs/codex/SYNAPTIREACH_MASTER_V9.md`
  - `docs/codex/CODEX_TASK_LEDGER.md`
  - `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`
  - `package.json`
  - `.env.example`
- [x] Confirmed the initial working tree was clean for this goal.
- [x] Confirmed latest local commit at goal start:
  - `d74d852d Add SynaptiReach user staff portal prompt pack`
- [x] Preserved current Task 3 status:
  - Complete.
  - Test workspace `cc2d162a-33e9-4d0b-8a8f-b9d35f68d4a8` remains the only allowed simulated CRM workspace.
- [x] Preserved current Business Intelligence / CRM Intelligence foundation.
- [x] Confirmed Tasks 5-12 are the first active verification/hardening phase.
- [ ] Continue Tasks 5-12 static/live verification and hardening.

Security note: the Resend API key was previously pasted into chat during setup. Do not expose it in logs or source. Rotate the Resend API key after testing is complete.

## Launch Readiness Goal Checkpoint 2 - Tasks 5-12 Hardening - 2026-05-19

- [x] Added fail-closed admin record viewing:
  - `/admin/dashboard/contact-submissions`
  - `/admin/dashboard/waitlist`
  - These pages no longer read Supabase records unless `CRM_ADMIN_READ_ENABLED=true`.
- [x] Added secret-protected waitlist admin update route:
  - `PATCH /api/admin/waitlist`
  - Requires `CRM_ADMIN_ACTION_SECRET`.
  - Supports lifecycle statuses:
    - `new`
    - `reviewed`
    - `invited`
    - `onboarded`
    - `declined`
- [x] Updated waitlist insert behavior:
  - Default status is now `new`.
  - API accepts aliases for `team_size`, `needs`, `interested_tier`, and `byok_managed_interest`.
- [x] Updated Supabase schema idempotently:
  - `waitlist_signups.status` create-table default is `new`.
  - Existing table default is repaired with `alter table if exists public.waitlist_signups alter column status set default 'new';`.
- [x] Hardened subscription checkout setup-required behavior:
  - Missing Stripe price env vars return a clear 503 setup-required response before attempting checkout.
  - No subscription is marked active without Stripe webhook confirmation.
- [x] Updated `.env.example` with missing launch-readiness env vars:
  - Stripe subscription price vars.
  - Test simulation vars.
  - Admin read/action gate vars.
  - Resend sender/contact vars.
- [x] Build verification for this checkpoint:
  - `npm.cmd run build` passed.
- [x] Focused local production probes:
  - Admin-gated/public pages returned 200.
  - Unauthorized admin waitlist PATCH returned 403.
  - Empty contact/waitlist payloads returned validation errors.
- [x] Hardened Stripe provider network failure handling:
  - Stripe helper now returns a clear provider/network error instead of bubbling raw `fetch failed`.
- [ ] Live Supabase/Stripe/Resend verification.

## Launch Readiness Goal Checkpoint 3 - Tasks 13-19 CRM Polish - 2026-05-19

- [x] Task 13 dashboard compaction:
  - Grouped dashboard metrics into compact tabs with a View all metrics mode.
  - Preserved all dashboard metrics and their real-data detail modal behavior.
  - Collapsed secondary quick actions into a More actions menu while keeping every action available.
- [x] Task 14 partial metric popup expansion:
  - Added clickable pipeline metric modals for Pipeline Value, Weighted Value, Open Deals, Won Deals, Lost Deals, and Stale Deals.
  - Modals use real deal records and link back to exact deal IDs through `/dashboard/pipeline?dealId=...`.
  - Broader page-native metric popup coverage is still pending for several CRM pages.
- [x] Task 15 pipeline help:
  - Added Create Deal guidance explaining what a deal is, lead linkage, value, probability, stages, close dates, and forecasting impact.
- [x] Task 16 AI Command Center:
  - Added provider/action readiness cards for CRM Intelligence, SynaptiReach Managed, BYOK, and future Local Connector modes.
  - Preserved review-gated actions and did not expose provider keys.
- [x] Task 17 workflow templates/signals:
  - Added review-gated templates for clicked-not-converted follow-up, abandoned setup reminder, failed payment follow-up, usage cap alert, staff reassignment, proposal follow-up, and service request intake.
  - Expanded Live Workflow Signals into clickable detail popups with real records, explanations, recommended actions, and empty states.
- [x] Task 18 marketing recommendations polish:
  - Campaign Activity now shows recent 5 by default with View all and search.
  - CRM Intelligence Recommendations now show recent 5 by default with View all and search.
  - Existing approve/deny behavior remains review-gated.
- [x] Task 19 current status:
  - Tasks page already supports AI/CRM Intelligence task recommendations with approve, deny, assign, and staff selection.
- [x] Customer-facing wording:
  - Removed a visible `mini_brain` source label from AI Assistant insight cards.
- [x] Build verification for this checkpoint:
  - First `npm.cmd run build` attempt compiled successfully but timed out at 120 seconds while collecting page data.
  - Second `npm.cmd run build` completed successfully.
- [ ] Browser interaction verification for the new modals, signal popups, grouped metrics, and expanded marketing lists.

## Launch Readiness Goal Checkpoint 4 - Tasks 21-22 Final Launch Items - 2026-05-19

- [x] Task 21 review-gated communications sending:
  - Added `POST /api/crm/communications/send`.
  - Requires `confirm=true` and an existing workspace-scoped communication record.
  - Sends only email or SMS.
  - Uses Resend server-side for email when `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are configured.
  - Uses Twilio server-side for SMS when `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` are configured.
  - Returns setup-required errors if providers are missing.
  - Updates the communication as `sent` or `failed` and stores provider metadata without exposing secrets.
  - Creates a workspace notification for sent/failed outcomes.
  - Added a Confirm Send action on outbound draft/scheduled/failed email/SMS cards in `/dashboard/communications`.
  - No background auto-send loop was added.
- [x] Task 22 notification mark-read:
  - Topbar notification clicks now optimistically mark that individual notification as read before navigation.
  - Mark all read updates the unread count immediately.
  - API mark-all now requires a workspace context or explicit workspace ID and no longer updates all unread notifications globally when context is missing.
- [x] `.env.example` now includes `TWILIO_FROM_NUMBER`.
- [ ] Live Resend/Twilio success-path verification.
- [ ] Workspace-level BYOK provider credential storage remains future/provider setup work.
- [x] Build verification for this checkpoint:
  - `npm.cmd run build` completed successfully and generated 150 app routes, including `/api/crm/communications/send`.

## Launch Readiness Goal Checkpoint 5 - Task 14 Metric Popup Breadth - 2026-05-19

- [x] Added shared real-data metric modal component:
  - `components/dashboard/SimpleMetricModal.tsx`
- [x] Added clickable metric popup coverage to:
  - `/dashboard/tasks`
  - `/dashboard/calendar`
  - `/dashboard/communications`
  - `/dashboard/marketing`
- [x] These are now in addition to existing/new metric modal coverage on:
  - `/dashboard`
  - `/dashboard/pipeline`
- [x] Popups include current value, real related records, empty states, and related-page links.
- [ ] Analytics, AI Assistant, and Settings still need deeper page-native metric modal treatment beyond existing panels/CRM Intelligence cards.
- [ ] Browser interaction verification remains.
- [x] Build verification for this checkpoint:
  - `npm.cmd run build` completed successfully after shared metric modal wiring.

## Launch Readiness Goal Checkpoint 6 - Final Checks For This Pass - 2026-05-19

- [x] Final build for this pass:
  - `npm.cmd run build` passed.
  - Build generated 150 app routes.
- [x] Local production page smoke for changed CRM pages:
  - `/dashboard` -> 200
  - `/dashboard/tasks` -> 200
  - `/dashboard/calendar` -> 200
  - `/dashboard/communications` -> 200
  - `/dashboard/marketing` -> 200
  - `/dashboard/pipeline` -> 200
  - `/dashboard/workflow` -> 200
  - `/dashboard/ai_assistant` -> 200
- [x] Fail-closed API probes:
  - `POST /api/crm/communications/send` with `{}` -> 400, expected because `communication_id` is required.
  - `PATCH /api/admin/waitlist` without admin secret -> 403, expected.
- [x] Safety checks:
  - `.env.local` is not tracked by git.
  - Active `app`, `components`, and `lib` source has no customer-facing `mini-brain` / `mini brain` phrase matches.
  - Secret source grep found only server-side env references, not committed secret values.
  - No live Stripe mode switch was made.
  - No external email/SMS/social send was triggered.
  - No fake paid/subscribed state was created.
- [x] Task status summary for this pass:
  - Complete in this pass/current scope: Tasks 13, 15, 16, 17, 18, 19, 22.
  - Still partial: Tasks 5, 6, 7, 9, 10, 12, 14, 20, 21, 23, 24.
  - Preserved complete: Task 3 test workspace and Task 8/11 public services/industry coverage.
- [ ] Manual/live verification still required:
  - Stripe test checkout/session/webhook/trial lifecycle and Billing Portal.
  - Supabase live writes for contact, waitlist, service requests, notification persistence, and communications send logs.
  - Resend notification delivery and email send success path.
  - Twilio SMS send success path.
  - Admin role/auth model hardening beyond fail-closed env gates.
  - Browser/mobile interaction pass for dashboard metric tabs, shared metric modals, workflow signal popups, marketing view-all/search, notification count decrement, and communications Confirm Send confirmation.
  - Production deployment and production route/API smoke for this new pass.

Reminder: the Resend API key was previously pasted into chat during setup. Rotate it after testing.

## Launch Verification Checkpoint 1 - 2026-05-20

- [x] Continued from the current working tree without restarting completed work.
- [x] Read required docs:
  - `docs/codex/SYNAPTIREACH_MASTER_V9.md`
  - `docs/codex/CODEX_TASK_LEDGER.md`
- [x] Confirmed current working tree was clean at start of this pass.
- [x] Confirmed latest local commit:
  - `3453000e Harden launch readiness CRM billing contact waitlist and communications`
- [x] Confirmed this shell does not expose required Supabase/Stripe/Resend/Twilio/admin/test env vars directly. Next runtime probes may still load `.env.local`, but no secret values were printed.
- [x] Preserved completed Task 3 simulation/test workspace and CRM Intelligence work.

## Launch Verification Checkpoint 2 - Task 14 Completion - 2026-05-20

- [x] Verified `/dashboard/analytics` already has native analytics metric detail modals.
- [x] Added native/shared metric modal coverage to `/dashboard/ai_assistant`:
  - provider/action readiness cards
  - agent summary metric cards
  - related records and related-page links where available
- [x] Added native/shared metric modal coverage to `/dashboard/settings`:
  - integration status cards
  - billing status cards
  - usage/cap cards
- [x] Task 14 is now code-complete for the requested page coverage, pending browser interaction verification.
- [x] Build verification for this checkpoint: `npm.cmd run build` passed on 2026-05-20 after a longer trace-collection timeout; Next.js generated 150/150 static pages.

## Launch Verification Checkpoint 3 - Stripe Subscription Checkout - 2026-05-20

- [x] Verified the six subscription plan definitions and caps in `lib/billing/plans.ts`:
  - Basic BYOK, Growth BYOK, Premium BYOK
  - Basic Managed, Growth Managed, Premium Managed
- [x] Verified `POST /api/billing/subscription/checkout` uses Stripe Checkout subscription mode with a 14-day trial.
- [x] Verified checkout creates billing records in `checkout_required` / `checkout_created` states only and does not mark subscriptions active without webhook confirmation.
- [x] Verified Stripe webhook processing stores event IDs in `crm_billing_events` and treats duplicate event inserts as successful duplicate replays.
- [x] Hardened checkout billing-account lookup so scoped requests do not select an arbitrary existing billing account.
- [x] Live test-mode probes against all six configured Stripe price IDs returned HTTP 200 with `success: true`, `stripeConfigured: true`, and `setupRequired: false`.
- [ ] Full signed webhook lifecycle replay remains a manual Stripe CLI/dashboard test.

## Launch Verification Checkpoint 4 - Live Writes and Safety Routes - 2026-05-20

- [x] Live `/api/contact` probe inserted a `contact_submissions` row and returned HTTP 200.
- [x] Live `/api/waitlist` probe inserted a `waitlist_signups` row with status `new` and returned HTTP 200.
- [x] Live `/api/crm/services/request` probe inserted a `crm_service_requests` row with consultation/review-gated status and returned HTTP 200.
- [x] Verified service requests do not create paid state or bypass consultation.
- [x] Hardened the shared Resend helper so provider/network failures return safe metadata instead of raw runtime failures.
- [x] Added internal SynaptiReach Resend notification support for service requests.
- [x] Verified `/api/crm/communications/send` requires `communication_id` and explicit `confirm=true` before any provider call.
- [x] Verified the admin waitlist mutation path does not expose writes without the proper method/authorization.
- [x] Verified customer-facing `mini-brain` / `mini brain` wording is absent from active app/component/lib source.
- [x] Updated CRM Intelligence `draft_message` action persistence to create canonical `communications` drafts.
- [ ] Resend provider-side delivery still needs review because live contact/waitlist probes returned `emailSent: false` while not setup-missing.
- [ ] Authenticated CRM Intelligence approve/dismiss DB-write verification remains a browser/session test.

## Launch Verification Checkpoint 5 - Final Build and Post-Build Probes - 2026-05-20

- [x] `npm.cmd run build` passed after all launch-hardening changes in this pass.
- [x] `.next/routes-manifest.json` exists after build.
- [x] Stale `.next/server/vendor-chunks/@supabase.js` is not present after build.
- [x] `.env.local` is not tracked by git.
- [x] Local post-build page smoke returned HTTP 200 for:
  - `/dashboard/analytics`
  - `/dashboard/ai_assistant`
  - `/dashboard/settings`
  - `/dashboard/communications`
- [x] `/api/intelligence/summary` returned seeded-workspace insights and helper results.
- [x] `POST /api/intelligence/run` with `{"persist":false}` returned `persisted=0`.
- [x] `POST /api/intelligence/actions` dismiss returned HTTP 200 and recorded a review-gated decision without sending, charging, or posting externally.
- [x] Post-build `/api/crm/services/request` returned HTTP 200 with an inserted request and safe email status fields.
- [x] Unauthorized `PATCH /api/admin/waitlist` returned HTTP 403.
- [x] Secret scan found env-name references and mode-prefix checks only; no tracked secret file was found.
- [ ] Remaining manual checks:
  - signed Stripe webhook replay with Stripe CLI/dashboard
  - Resend sender/domain/recipient delivery review
  - Twilio success-path verification with test credentials
  - authenticated browser review of metric modals and CRM Intelligence approve/dismiss interactions
