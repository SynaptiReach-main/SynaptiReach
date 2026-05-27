# SynaptiReach Onboarding

implements:: [[SynaptiReach Onboarding]]
depends_on:: [[User CRM]]
depends_on:: [[Business Profile]]
depends_on:: [[Billing & Purchase History]]
depends_on:: [[CRM Automation & AI Behavior]]
connects_to:: [[Dashboard Preview]]
documents:: [[SynaptiReach]]

## Current Flow

`/onboarding` is the first-run workspace setup wizard for real User CRM workspaces. It saves and resumes through `/api/onboarding/save`, completes through `/api/onboarding/complete`, and routes activated users to `/dashboard`.

The wizard writes to existing structures where possible:

- `workspaces` and `workspace_members` for workspace ownership.
- `onboarding_sessions` for save/resume payload, current step, completed steps, skipped steps, and launch readiness score.
- `crm_settings` for business profile, audience, brand voice, timezone, and automation safety policy.
- `crm_billing_accounts` for selected plan and billing intent only. Paid or subscribed states still require Stripe Checkout and webhook confirmation.
- `crm_provider_connections` for AI, email, SMS, social, and calendar setup states. Provider secrets are encrypted server-side and not returned to the browser.
- `leads`, `crm_csv_imports`, `marketing_events`, and `crm_ai_recommendations` for real lead CSV/manual starter setup.
- `crm_staff` for pending staff invite rows. No invite email is sent automatically.

## Launch Readiness

Launch readiness is calculated from saved onboarding and CRM state:

- business type
- business profile completeness
- plan selection
- explicit billing state
- AI provider setup
- email and SMS integration review
- lead import or starter lead setup
- staff setup or solo selection
- automation safety acknowledgement

Statuses may be `complete`, `pending`, `skipped`, or `missing`. Pending and skipped items remain visible and are connected to `/dashboard/settings`, `/dashboard/leads`, and billing/provider setup paths.

## Safety Rules

- Onboarding does not mark paid/subscribed states unless Stripe confirms them through existing Checkout/webhook flow.
- Onboarding does not switch Stripe to live mode.
- Onboarding does not auto-charge outside Stripe Checkout.
- Onboarding does not auto-send customer email, SMS, or social messages.
- Normal users do not receive mock CRM records. CSV/manual lead setup only writes user-provided records.
- Upload storage remains setup-required until real storage is connected.

## Schema Compatibility

`supabase/user_crm_full_completion_schema.sql` includes additive repairs for older databases that created `workspace_members` or `onboarding_sessions` before the current onboarding metadata columns existed. The onboarding flow expects:

- `workspace_members.status`
- `workspace_members.metadata`
- `workspace_members.updated_at`
- `onboarding_sessions.payload`
- `onboarding_sessions.completed`
- `onboarding_sessions.metadata`
- `onboarding_sessions.updated_at`
