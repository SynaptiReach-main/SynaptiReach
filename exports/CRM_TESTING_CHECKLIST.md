# SynaptiReach User CRM Testing Checklist

## Local Setup

1. Install dependencies:
   ```powershell
   npm install
   ```

2. Start the app:
   ```powershell
   npm run dev
   ```

3. Open:
   ```text
   http://localhost:3000/dashboard
   ```

## Required Environment Variables

Set these in `.env.local` or the deployment environment:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY= recommended low-cost daily CRM AI provider
OPENROUTER_API_KEY= recommended fallback provider
OPENROUTER_MODEL=openrouter/free
AI_PROVIDER_ORDER=gemini,openrouter
AI_ENABLE_OPENAI=false
OPENAI_API_KEY= optional premium provider, ignored unless AI_ENABLE_OPENAI=true
RESEND_API_KEY= optional
TWILIO_ACCOUNT_SID= optional
TWILIO_AUTH_TOKEN= optional
AYRSHARE_API_KEY= optional
CRON_SECRET= optional
```

Do not add `NEXT_PUBLIC_OPENAI_API_KEY`, `NEXT_PUBLIC_GEMINI_API_KEY`, or `NEXT_PUBLIC_OPENROUTER_API_KEY`.

## Supabase Schema Setup

Primary SQL file:

```text
supabase/user_crm_complete_schema.sql
```

Run manually in the Supabase SQL editor, or run from PowerShell with a direct database URL:

```powershell
$env:SUPABASE_DB_URL="postgresql://postgres:<password>@<host>:5432/postgres"
node scripts/apply-user-crm-schema.mjs
```

Storage bucket for marketing media:

```sql
insert into storage.buckets (id, name, public)
values ('marketing-media', 'marketing-media', true)
on conflict do nothing;
```

## Browser Page Tests

Test these pages on desktop and mobile widths:

- `/dashboard`
- `/dashboard/leads`
- `/dashboard/marketing`
- `/dashboard/ai_assistant`
- `/dashboard/communications`
- `/dashboard/settings`

For each page verify:

- Sidebar is collapsed by default.
- Sidebar opens and closes.
- Mobile layout is readable.
- Loading, empty, and error states render cleanly.
- Dates display in local time.

## Dashboard Tests

- Confirm lead counts match Supabase rows.
- Confirm campaign counts match `marketing_campaigns`.
- Confirm recent activity uses `marketing_events`.
- Confirm recent communications use `communications`.
- Confirm AI next actions do not show fake metrics.

## Leads Tests

- Create a lead.
- Edit the lead.
- Change status through all supported statuses.
- Add a note.
- Archive the lead.
- Search by name/email/company.
- Filter by status.
- Sort by newest, score, and status.

## Marketing Tests

- Create scheduled email campaign.
- Create scheduled SMS campaign.
- Create scheduled social campaign.
- Try date-only and time-only validation.
- Upload media and remove it before scheduling.
- Edit a scheduled campaign.
- Cancel a scheduled campaign.
- Accept an AI recommendation.
- Confirm marketing activity refreshes.

## Communications Tests

- Create draft email communication.
- Create draft SMS communication.
- Create draft social communication.
- Filter by channel and status.
- Use AI draft button.

## Settings Tests

- Save business profile fields.
- Save AI settings.
- Confirm integration status shows configured/missing only.
- Confirm no secret values are displayed.

## PowerShell API Tests

Set base URL:

```powershell
$base = "http://localhost:3000"
```

Campaigns:

```powershell
Invoke-RestMethod "$base/api/marketing/campaigns"

$scheduledAt = (Get-Date).AddHours(2).ToUniversalTime().ToString("o")
$campaign = Invoke-RestMethod -Method Post -Uri "$base/api/marketing/campaigns" -ContentType "application/json" -Body (@{
  type = "email"
  audience = "all"
  subject = "CRM test campaign"
  content = "Testing scheduled campaign creation."
  stagger = 50
  attachments = @()
  sendDate = $scheduledAt
  sendTime = $scheduledAt
  scheduledAt = $scheduledAt
  status = "scheduled"
} | ConvertTo-Json -Depth 5)

Invoke-RestMethod -Method Patch -Uri "$base/api/marketing/campaigns" -ContentType "application/json" -Body (@{
  id = $campaign.campaign.id
  subject = "Updated CRM test campaign"
  content = "Updated content."
  audience = "qualified"
  stagger = 100
  sendDate = $scheduledAt
  sendTime = $scheduledAt
  scheduledAt = $scheduledAt
  status = "scheduled"
} | ConvertTo-Json -Depth 5)

Invoke-RestMethod -Method Delete -Uri "$base/api/marketing/campaigns?id=$($campaign.campaign.id)"
```

Activity:

```powershell
Invoke-RestMethod "$base/api/marketing/activity"
Invoke-RestMethod -Method Post -Uri "$base/api/marketing/activity" -ContentType "application/json" -Body (@{
  action = "test"
  details = "CRM activity API test"
} | ConvertTo-Json)
```

AI:

```powershell
Invoke-RestMethod -Method Post -Uri "$base/api/marketing/ai/generate" -ContentType "application/json" -Body (@{
  prompt = "Write a short follow-up email for qualified CRM leads."
  system = "You are SynaptiReach's CRM assistant."
} | ConvertTo-Json)

Invoke-RestMethod -Method Post -Uri "$base/api/ai/assistant" -ContentType "application/json" -Body (@{
  message = "Which leads need follow-up?"
} | ConvertTo-Json)

Invoke-RestMethod -Method Post -Uri "$base/api/crm/agents/run" -ContentType "application/json" -Body (@{
  agent = "executive"
} | ConvertTo-Json)
```

AI provider fallback:

```powershell
Invoke-RestMethod -Method Post -Uri "$base/api/marketing/ai/generate" -ContentType "application/json" -Body (@{
  prompt = "Write a concise SMS follow-up for qualified leads."
  system = "You are SynaptiReach's SMS marketing strategist."
  profile = "cheap"
} | ConvertTo-Json)

Invoke-RestMethod -Method Post -Uri "$base/api/ai/assistant" -ContentType "application/json" -Body (@{
  message = "Give me an executive CRM summary."
  profile = "premium"
} | ConvertTo-Json)
```

Recommendations:

```powershell
Invoke-RestMethod "$base/api/ai/recommendations"
Invoke-RestMethod -Method Post -Uri "$base/api/marketing/recommendations"
```

Leads:

```powershell
$lead = Invoke-RestMethod -Method Post -Uri "$base/api/crm/leads" -ContentType "application/json" -Body (@{
  name = "CRM Test Lead"
  email = "crm-test@example.com"
  phone = "555-555-0101"
  company = "Test Company"
  source = "PowerShell"
  status = "new"
  score = 10
} | ConvertTo-Json)

Invoke-RestMethod "$base/api/crm/leads"

Invoke-RestMethod -Method Post -Uri "$base/api/crm/leads/activity" -ContentType "application/json" -Body (@{
  lead_id = $lead.lead.id
  title = "Test note"
  details = "Lead note from PowerShell"
} | ConvertTo-Json)
```

Communications:

```powershell
Invoke-RestMethod -Method Post -Uri "$base/api/crm/communications" -ContentType "application/json" -Body (@{
  channel = "email"
  recipient = "crm-test@example.com"
  subject = "Draft test"
  content = "Draft communication."
  status = "draft"
} | ConvertTo-Json)

Invoke-RestMethod "$base/api/crm/communications"
```

Tracking and lead capture:

```powershell
Invoke-WebRequest "$base/api/marketing/track/open?campaign=PUT-CAMPAIGN-ID-HERE"
Invoke-WebRequest "$base/api/marketing/track/click?campaign=PUT-CAMPAIGN-ID-HERE&url=https%3A%2F%2Fexample.com"

Invoke-RestMethod -Method Post -Uri "$base/api/marketing/leads/capture" -ContentType "application/json" -Body (@{
  campaign_id = "PUT-CAMPAIGN-ID-HERE"
  name = "Interested Lead"
  email = "interested@example.com"
  source = "campaign"
  message = "I want more information."
} | ConvertTo-Json)
```

Media upload:

```powershell
$form = @{
  file = Get-Item ".\public\logo.png"
}
Invoke-RestMethod -Method Post -Uri "$base/api/marketing/media/upload" -Form $form
```

## Deployment Checklist

- Run `npm run build`.
- Apply `supabase/user_crm_complete_schema.sql`.
- Create `marketing-media` storage bucket.
- Confirm at least one AI provider key is configured server-side.
- Confirm `GEMINI_API_KEY` is configured for low-cost routine CRM AI.
- Confirm `OPENROUTER_API_KEY` is configured for fallback when Gemini is rate limited.
- Confirm `AI_PROVIDER_ORDER=gemini,openrouter`.
- Confirm `AI_ENABLE_OPENAI=false` unless OpenAI billing is intentionally enabled.
- Confirm `OPENAI_API_KEY` is optional and skipped unless `AI_ENABLE_OPENAI=true`.
- Confirm no `NEXT_PUBLIC_*` AI provider key is set.
- Test `/dashboard` after deployment.
- Test campaign scheduling and AI generation after deployment.

## Known Limitations

- External email/SMS/social sending is review-first and not silently enabled.
- Workspace scoping is supported by `workspace_id`, but full RLS policies should be added after workspace membership enforcement is centralized.
- Media upload requires the Supabase `marketing-media` bucket.
