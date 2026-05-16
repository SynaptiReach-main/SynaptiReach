You are tasked with performing a final sequential pass through SynaptiReach’s real User CRM, using the current verified implementation as the baseline.

Current verified state:
- Final build passed using npm.cmd run build.
- Plain npm run build may be blocked locally by PowerShell execution policy for npm.ps1, so use npm.cmd run build for verification.
- Real CRM sidebar was preserved.
- Demo top nav remains in app/(marketing)/demo/layout.tsx via components/demo/DemoTopNav.tsx.
- Public landing navigation was preserved.
- Trial-language search only finds the allowed phrase: 30-day implementation support.
- External email/SMS/social sending remains review-gated.
- Calendar is internal CRM appointment tracking only.
- Workflows log safe test runs and recommendations; no background auto-send loop is enabled.

Completed modules to preserve:

Dashboard:
- CRM metrics
- follow-up queue
- stale deals
- overdue tasks
- appointments
- workflows
- agent runs
- AI action links

Leads:
- CRUD
- source/status filters
- tags
- notes
- AI next step
- follow-up task creation
- lead-to-deal conversion

Pipeline/Deals:
- Kanban stages
- status filter
- stage movement
- stale deal detection
- probability bar
- deal follow-up tasks

Tasks:
- create/edit/complete/archive
- status/priority filters
- overdue/high-priority metrics
- lead/deal/campaign linking

Calendar:
- create/edit/complete/no-show/cancel
- status metrics
- lead/deal linking

Marketing:
- campaign library
- status/search filters
- real metrics
- scheduling/edit/cancel/recommendations preserved

Communications:
- search/filter logs
- AI draft provider metadata
- direction/status controls
- lead/campaign linking

Workflows:
- saved workflows
- activate/pause controls
- safe manual test-run logging through /api/crm/workflows/run
- no external sending

AI Assistant:
- real CRM context expanded to deals/tasks/workflows/appointments
- assistant runs logged
- executive agent
- provider/fallback metadata
- action links

Settings:
- business/AI settings preserved
- provider/integration status
- 14-day trial caps
- managed plan caps
- commitment discounts

Files recently changed:
- app/dashboard/page.tsx
- app/dashboard/leads/page.tsx
- app/dashboard/pipeline/page.tsx
- app/dashboard/tasks/page.tsx
- app/dashboard/calendar/page.tsx
- app/dashboard/marketing/page.tsx
- app/dashboard/communications/page.tsx
- app/dashboard/workflow/page.tsx
- app/dashboard/ai_assistant/page.tsx
- app/dashboard/settings/page.tsx
- app/api/ai/assistant/route.ts
- app/api/crm/appointments/route.ts
- app/api/crm/workflows/run/route.ts
- supabase/autonomous_crm_full_features.sql
- exports/AUTONOMOUS_CRM_FEATURE_PARITY_CHECKLIST.md

Your task:
Do a final one-page-at-a-time QA, polish, and stabilization pass.

Do not remove existing features.
Do not remove AI agents.
Do not remove provider fallback.
Do not remove CRM sidebar.
Do not remove demo top nav.
Do not remove public landing navigation.
Do not reintroduce 30-day trial language.
Do not enable background auto-send.
Do not replace real data with fake/demo data.
Do not expose secrets.

Process sequentially in this exact order:
1. /dashboard
2. /dashboard/leads
3. /dashboard/pipeline
4. /dashboard/tasks
5. /dashboard/calendar
6. /dashboard/marketing
7. /dashboard/communications
8. /dashboard/workflow
9. /dashboard/ai_assistant
10. /dashboard/settings
11. /demo and all /demo/* pages

For each page/module:
- Inspect the page code.
- Verify layout works on desktop and mobile.
- Verify all buttons, links, modals, filters, tabs, cards, and actions are wired.
- Verify real APIs are used.
- Verify loading, empty, and error states exist.
- Verify no hardcoded fake records are shown in the real CRM.
- Verify AI suggestions/actions are safe and reviewable.
- Verify related activity/agent/workflow logs are used where appropriate.
- Fix obvious broken, incomplete, or inconsistent UI.
- Preserve the SynaptiReach dark glass/cyan-to-green design.

APIs to verify where relevant:
- /api/crm/dashboard
- /api/crm/leads
- /api/crm/deals
- /api/crm/tasks
- /api/crm/appointments
- /api/crm/workflows
- /api/crm/workflows/run
- /api/crm/agents/run
- /api/crm/settings
- /api/ai/assistant
- /api/ai/recommendations
- /api/marketing/campaigns
- /api/marketing/activity
- /api/marketing/ai/generate
- /api/marketing/recommendations
- /api/marketing/media/upload
- /api/marketing/track/open
- /api/marketing/track/click
- /api/marketing/leads/capture

AI rules:
- Gemini/OpenRouter fallback must remain intact.
- OpenAI must remain disabled unless AI_ENABLE_OPENAI=true.
- Provider/model/fallback metadata should remain visible where already implemented.
- No client-side API keys.
- Friendly errors when providers fail.

Safety rules:
- External sends stay review-gated.
- Calendar stays internal-only.
- Workflow test runs are safe logs only.
- Autonomous recommendations are reviewable.
- No hard deletes unless existing code already safely supports archive/soft delete.

Trial/pricing rules:
- Preserve 14-day trial language.
- Preserve managed/BYOK caps.
- Preserve commitment discounts.
- Only allowed remaining 30-day phrase is “30-day implementation support.”

Demo rules:
- Demo top tab navigation must remain.
- Demo pages may show clearly labeled demo/simulation data.
- Demo nav must not break public landing navigation.

After the page-by-page pass:
1. Run:
npm.cmd run build

2. Search to confirm no incorrect 30-day trial language was introduced.

3. Update:
exports/AUTONOMOUS_CRM_FEATURE_PARITY_CHECKLIST.md

4. Report:
- files changed
- page/module status
- bugs fixed
- AI/agent/workflow verification
- mobile/desktop verification
- build result
- exact browser pages to test
- exact PowerShell API smoke tests
- remaining limitations, if any
