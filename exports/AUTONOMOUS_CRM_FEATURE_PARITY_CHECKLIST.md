# SynaptiReach Autonomous CRM Feature Parity Checklist

## Local Setup
- Install dependencies with `npm install` if `node_modules` is missing.
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- AI env vars: `GEMINI_API_KEY` recommended, `OPENROUTER_API_KEY` fallback, `OPENROUTER_MODEL=openrouter/free`, `AI_ENABLE_OPENAI=false` unless OpenAI billing is intentionally enabled.
- Optional integration env vars: Resend, Twilio, Ayrshare, and Vercel cron secrets.

## Supabase Migration
- Apply `supabase/user_crm_complete_schema.sql` first if the base CRM tables are missing.
- Apply `supabase/autonomous_crm_full_features.sql` to add pipeline, tasks, workflows, appointments, usage, and contact submission support.
- PowerShell with `psql`:
  ```powershell
  psql "$env:DATABASE_URL" -f "supabase\user_crm_complete_schema.sql"
  psql "$env:DATABASE_URL" -f "supabase\autonomous_crm_full_features.sql"
  ```
- If using Supabase SQL Editor, paste and run both files in the same order.

## Browser Page Tests
- `/dashboard`: completed current pass. Verify real lead, campaign, communication, pipeline, won/lost deal, task, overdue task, workflow run, appointment, agent-run, follow-up queue, quick-action, analytics, and AI next-action cards.
- `/dashboard/leads`: completed current pass. Create, edit, search, status/source filter, tag metadata, archive leads; verify detail panel, notes, AI next step, guarded mutation states, follow-up task creation, and lead-to-deal conversion.
- `/dashboard/pipeline`: completed current pass. Create, edit, link lead ID, move stage, filter status, identify stale deals, create deal follow-up tasks, and archive real deals.
- `/dashboard/marketing`: completed current pass. Schedule email/SMS/social campaigns, edit/cancel scheduled campaigns, duplicate campaigns, upload media, accept recommendations, filter campaign library, and verify real delivered/opened/clicked/converted metrics.
- `/dashboard/communications`: completed current pass. Create email/SMS/social/call/note/internal communication drafts, use AI drafting with provider metadata, search/filter logs, set direction/status, and link communications to leads/campaigns.
- `/dashboard/workflow`: completed current pass. Run agent review, create draft review-only workflow, activate/pause saved workflows, and log safe manual test runs without external sending.
- `/dashboard/ai_assistant`: completed current pass. Ask CRM context questions, include leads/campaigns/deals/tasks/workflows/appointments in context, log assistant runs, run executive agent, show provider/model/fallback metadata, and link recommendations to action pages.
- `/dashboard/tasks`: completed current pass. Create, edit, complete, archive, filter by status/priority/computed overdue, inspect overdue/high-priority counts, and link tasks to leads/deals/campaigns.
- `/dashboard/calendar`: completed current pass. Create, edit, complete, mark no-show, cancel appointments with guarded actions, inspect status counts, and link appointments to leads/deals.
- `/dashboard/analytics`: completed current pass. Verify real lead conversion, campaign performance, communication volume, pipeline value, task/workflow/agent health, date-range filters, loading/error/empty states, and no sample metrics.
- `/dashboard/settings`: completed current pass. Save business/AI settings, verify secret-safe provider/integration status, show OpenAI disabled behavior, display 14-day trial caps, managed plan caps, and commitment discounts.

## CSV Lead Import Tests
- `/dashboard`: verify the `Import CSV` quick action opens the shared import modal and refreshes dashboard metrics after import.
- `/dashboard/leads`: verify the `Import CSV` button opens the same modal and refreshes the lead list after import.
- Instruction modal: confirm suggested format, accepted columns, sample CSV, duplicate behavior, and hard validation rules are visible before import.
- Accepted columns: `name`, `first_name`, `last_name`, `full_name`, `email`, `phone`, `company`, `source`, `status`, `tags`, `notes`, `address`, `city`, `state`, `zip`, `website`, `lead_score`, `score`, `last_interaction`, `created_at`.
- Sample CSV:
  ```csv
  name,email,phone,company,source,status,tags,notes
  Jane Smith,jane@example.com,555-123-4567,Smith Roofing,Website,new,"roofing,hot","Requested pricing"
  Marcus Lee,marcus@example.com,555-222-9999,Lee HVAC,Referral,qualified,"hvac,commercial","Needs follow-up"
  ```
- Import preview/result: verify total rows, valid rows, skipped rows, duplicate rows, imported rows, and skipped-row reasons appear.
- Duplicate handling: verify duplicate email first, then duplicate phone, are skipped safely without overwriting existing leads.
- Supabase import: verify valid rows are inserted into `leads`, tags/extra fields are stored in `metadata`, CSV notes create `lead_activities`, and a review recommendation is created when supported.
- Refresh after import: verify `crm-leads-imported` refreshes Dashboard and Leads data.
- Mobile test: verify modal scrolls within viewport, file picker is tappable, preview table scrolls horizontally, and buttons do not overflow.
- Desktop test: verify two-column instruction/upload layout, preview, and result panels render cleanly.

## Demo Navigation Tests
- Verified implementation: demo-specific `DemoTopNav` is rendered from `app/(marketing)/demo/layout.tsx`; public marketing navigation remains outside the demo layout.
- Verify public navigation remains intact on `/demo`.
- Verify demo top tabs work on `/demo`, `/demo/dashboard`, `/demo/leads`, `/demo/marketing`, `/demo/ai_assistant`, `/demo/workflow`, `/demo/communications`, `/demo/settings`.
- Confirm demo pages are labeled as demo/simulation and do not imply real user data.

## API Smoke Tests
```powershell
$base = "http://localhost:3000"
Invoke-RestMethod "$base/api/crm/dashboard"
Invoke-RestMethod "$base/api/crm/leads"
Invoke-RestMethod -Method Post "$base/api/crm/leads/import" -ContentType "application/json" -Body '{"rows":[{"name":"CSV Test Lead","email":"csv-test@example.com","phone":"555-111-2222","company":"Test Co","source":"CSV Test","status":"new","tags":"test,import","notes":"Smoke test import"}]}'
Invoke-RestMethod "$base/api/crm/deals"
Invoke-RestMethod "$base/api/crm/tasks"
Invoke-RestMethod "$base/api/crm/workflows"
Invoke-RestMethod -Method Post "$base/api/crm/workflows/run" -ContentType "application/json" -Body '{"workflow_id":"REPLACE_WITH_WORKFLOW_ID"}'
Invoke-RestMethod "$base/api/crm/appointments"
Invoke-RestMethod "$base/api/crm/communications"
Invoke-RestMethod "$base/api/marketing/campaigns"
Invoke-RestMethod "$base/api/marketing/activity"
Invoke-RestMethod -Method Post "$base/api/crm/agents/run" -ContentType "application/json" -Body '{"agent":"executive"}'
Invoke-RestMethod -Method Post "$base/api/ai/assistant" -ContentType "application/json" -Body '{"message":"What should I do today?"}'
```

## Mobile Tests
- Test dashboard, leads, pipeline, marketing, communications, workflow, AI assistant, tasks, calendar, and settings at 390px width.
- Test analytics at 390px width and confirm cards/charts stack without page-wide overflow.
- Confirm sidebar opens/closes, cards stack, tables/lists do not cause page-wide horizontal overflow, and modals fit the viewport.

## Desktop Tests
- Test dashboard and module pages at 1440px width.
- Test analytics at 1440px width and confirm reporting sections fit the dashboard shell.
- Confirm collapsed sidebar saves space, expanded sidebar highlights active routes, and content is not hidden underneath navigation.

## Build And Deploy
- Current final pass build result: `npm.cmd run build` passed after dashboard, leads, pipeline, tasks, calendar, marketing, communications, workflow, AI assistant, settings, and demo navigation review.
- Trial-language verification: no outdated long-trial wording found; the only remaining legacy-duration wording is the allowed implementation-support phrase in the service bundle.
- Run `npm.cmd run build` before deployment on Windows.
- Set Vercel env vars for Supabase, Gemini/OpenRouter, and any external integrations before deployment.

## Known Limitations
- External sending remains review-gated; the CRM does not silently send email, SMS, or social posts.
- Calendar records are internal CRM appointments; external calendar sync is not implemented.
- Workflows are reviewable CRM automation records and recommendations; no unbounded background automation loop is enabled.
- RLS policies should be finalized once the workspace membership model is locked. Current API access is server-side service-role based.
