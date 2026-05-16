# SynaptiReach CRM Demo Parity Testing Checklist

## Demo Navigation Tests

- Open `/demo`.
- Confirm it redirects to `/demo/dashboard`.
- Confirm the public landing-page navigation remains visible and unchanged.
- Confirm the demo top tab bar appears below the public navigation.
- Confirm the demo tabs are horizontally usable on desktop and mobile.
- Confirm active route highlighting on:
  - `/demo`
  - `/demo/dashboard`
  - `/demo/leads`
  - `/demo/marketing`
  - `/demo/communications`
  - `/demo/ai_assistant`
  - `/demo/workflow`
  - `/demo/settings`
- Confirm `Back to Main Site` routes to `/`.
- Confirm `Start 14-Day Trial` routes to `/trial`.

## Real CRM Visual Parity Tests

- Open `/dashboard`.
- Confirm real CRM sidebar is collapsed by default on first load.
- Expand/collapse the real CRM sidebar.
- Confirm sidebar state persists after refresh.
- Confirm dashboard cards use the same dark glass, rounded, cyan/green visual language as demo pages.
- Confirm dashboard uses real metrics from `/api/crm/dashboard`.
- Confirm no demo/static metrics appear on real CRM pages.

## Real CRM Page Tests

- `/dashboard`: verify lead/campaign/communication metrics, recent leads, recent activity, AI next actions, agent status, workflow overview.
- `/dashboard/leads`: verify create/edit/archive/status/search/filter/sort/detail/note flows.
- `/dashboard/marketing`: verify campaign creation, schedule edit/cancel, AI generation, media upload, activity, recommendations.
- `/dashboard/ai_assistant`: verify chat, suggested prompts, provider/model/fallback metadata.
- `/dashboard/workflow`: verify real workflow recommendations, agent review button, empty states.
- `/dashboard/communications`: verify filters, real communication records, compose, AI draft.
- `/dashboard/settings`: verify real settings load/save and provider/integration statuses.

## Mobile Tests

- Test at 375px and 430px widths.
- Confirm demo top tabs scroll horizontally without causing page overflow.
- Confirm real CRM sidebar opens as overlay and does not cover content after close.
- Confirm cards stack cleanly.
- Confirm buttons are tappable.
- Confirm modals remain usable on marketing campaign creation.

## Desktop Tests

- Test at 1366px and 1920px widths.
- Confirm demo top tabs sit below public navigation and do not cover content.
- Confirm real CRM sidebar fixed left and content margin adjusts.
- Confirm tables/lists remain readable.

## Agent/API Tests

```powershell
$base = "http://localhost:3000"

Invoke-RestMethod "$base/api/crm/dashboard"
Invoke-RestMethod -Method Post -Uri "$base/api/crm/agents/run" -ContentType "application/json" -Body (@{
  agent = "deterministic"
} | ConvertTo-Json)
Invoke-RestMethod "$base/api/ai/recommendations"
```

## AI Fallback Tests

```powershell
$base = "http://localhost:3000"

Invoke-RestMethod -Method Post -Uri "$base/api/marketing/ai/generate" -ContentType "application/json" -Body (@{
  prompt = "Write a concise follow-up for qualified CRM leads."
  profile = "cheap"
} | ConvertTo-Json)

Invoke-RestMethod -Method Post -Uri "$base/api/ai/assistant" -ContentType "application/json" -Body (@{
  message = "Which leads need follow-up?"
} | ConvertTo-Json)
```

Expected:

- Provider metadata is returned.
- OpenAI is skipped unless `AI_ENABLE_OPENAI=true`.
- Gemini/OpenRouter fallback is used when configured.

## Workflow Page Tests

- Open `/dashboard/workflow`.
- Confirm metrics are based on real CRM context.
- Click `Run Agent Review`.
- Confirm recommendations update or empty state remains clean.
- Confirm page states that external messages are not sent automatically.

## Build/Deploy Checklist

- Run `npm run build`.
- Confirm no legacy long-trial wording appears.
- Apply `supabase/user_crm_complete_schema.sql` if not already applied.
- Create Supabase `marketing-media` bucket for uploads.
- Confirm `GEMINI_API_KEY` and/or `OPENROUTER_API_KEY` are configured server-side.
- Confirm no `NEXT_PUBLIC_*` AI provider keys exist.
