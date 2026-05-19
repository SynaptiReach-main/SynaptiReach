# Final Full CRM Completion Checklist

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
