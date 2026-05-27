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

The current wizard collects:

- account owner details
- business profile, legal/company details, industry, service type, target customer, main offer, preferred CTA, sales process, and brand voice
- legal/company review acknowledgement and optional service/product menu upload
- trial path, post-trial plan, Stripe card acknowledgement, auto-renewal acknowledgement, usage caps, and managed SMS approval intent
- AI processing mode, provider setup, assistant behavior, and rule-based intelligence preference
- email, SMS, social, and calendar integration setup states
- lead import/manual starter lead intent and CSV mapping notes
- pipeline stages, lead statuses, sources, and tags
- staff invite rows and requested permissions
- marketing goals, channels, campaign notes, notification preferences, and workflow draft recommendations
- free guidance, guided setup call, and paid DFY assistance preference

The wizard writes to existing structures where possible:

- `workspaces` and `workspace_members` for workspace ownership.
- `onboarding_sessions` for save/resume payload, current step, completed steps, skipped steps, and launch readiness score.
- `crm_settings` for business profile, audience, sales setup, pipeline defaults, marketing preferences, help preference, brand voice, timezone, and automation safety policy.
- `crm_billing_accounts` for selected plan, trial path, usage caps, managed SMS readiness, and billing intent only. Paid, subscribed, and trialing states still require Stripe Checkout and webhook confirmation.
- `crm_provider_connections` for AI, email, SMS, social, and calendar setup states. Provider secrets are encrypted server-side and not returned to the browser.
- `leads`, `crm_csv_imports`, `marketing_events`, and `crm_ai_recommendations` for real lead CSV/manual starter setup.
- `crm_staff` and `crm_staff_permissions` for pending staff invite rows and requested access. No invite email is sent automatically.
- `crm_workflows` for onboarding-created workflow drafts only. Draft workflows remain review-gated and do not send externally.
- `crm_ai_recommendations` for launch-readiness recommendations generated from missing or pending real setup state.
- `crm_service_menu_uploads` for onboarding service/product menu metadata, private storage path, and pending analysis/review state.

## Trial Paths

Onboarding supports two 14-day trial paths:

- SynaptiReach-Managed Trial: full software access with hard free caps for managed AI, email, SMS, contacts, workflows, and agents. A Stripe card is required before the trial starts. The selected paid plan controls post-trial renewal only; higher managed tiers do not expand trial exposure. Managed SMS is optional and approval-based, and readiness requires Twilio/carrier fee approval plus the SynaptiReach $20 setup fee approval.
- BYOK Trial: full software access while the customer connects their own Gemini/OpenAI/OpenRouter, Resend, Twilio, and Ayrshare accounts as needed. The customer pays providers directly. SynaptiReach has no managed AI/email/SMS credit exposure. A Stripe card is still required before the trial starts, and optional self-imposed caps can be saved.

Stripe Checkout remains the only card collection path. Onboarding-originated subscription checkout now returns to `/onboarding?checkout=success&session_id={CHECKOUT_SESSION_ID}&step=billing` or `/onboarding?checkout=cancelled&step=billing`; Settings-originated checkout still returns to Settings. Onboarding records checkout submission as `pending_webhook`/submitted state and shows "Stripe checkout submitted. Waiting for webhook confirmation." Trial start/end timestamps and active/trialing/subscribed states are left empty until Stripe webhook confirmation supplies them.

Current managed trial caps are centralized in `lib/billing/plans.ts`: 300 AI credits, 250 emails, 0 SMS by default, 25 SMS after approval/payment, 250 contacts, 10 active workflows, 25 agent runs, 2 invited staff users, 5 campaign drafts, 1 CSV import, and 10 onboarding files / 25 MB total if file storage is enabled.

The post-trial plan-fit panel explains that trial access can be broader than the selected post-trial tier. Existing CRM data is not deleted automatically; future usage beyond the selected plan cap is restricted until upgrade or eligible capacity is added.

## Launch Readiness

Launch readiness is calculated from saved onboarding and CRM state:

- business type
- business profile completeness
- plan selection
- explicit billing state
- legal/company review acknowledgement
- Supabase auth email verification state
- AI provider setup
- email and SMS integration review
- calendar setup review
- optional service/product menu upload/review
- lead import or starter lead setup
- staff setup or solo selection
- automation safety acknowledgement
- marketing and workflow setup
- help/DFY preference

Statuses may be `complete`, `pending`, `skipped`, or `missing`. Pending and skipped items remain visible and are connected to `/dashboard/settings`, `/dashboard/leads`, and billing/provider setup paths.

The shared dashboard layout shows a continue-onboarding prompt until the saved onboarding session is complete.

Email verification is part of launch readiness and final onboarding completion gating. The current implementation uses Supabase auth email-confirmation state; a dedicated custom verification-code UI/API remains a future hardening item.

## Help and DFY

Onboarding includes a floating help panel and a dedicated help step. Rule-based help is the default. AI help remains optional and provider-dependent. Users can request:

- Guided Setup Call: Free 30 minutes.
- Extended Setup Support: $99/hour.
- Provider Setup Assistance: $149.
- CRM Import + Cleanup: $199.
- Campaign Setup Assistance: $249.
- Workflow Setup Assistance: $249.
- Full Onboarding Setup: $599.
- Premium Launch Setup: $999+.

Guidance is free when the user performs setup with SynaptiReach guidance. If SynaptiReach performs setup for the user, it is paid DFY work and remains consultation/review-gated before checkout or fulfillment.

Onboarding Help/DFY selections create `crm_service_requests` rows with `metadata.source = onboarding_help`. These records store requested service, price label, notes, consultation requirement, and checkout state without creating paid orders.

## Safety Rules

- Onboarding does not mark paid/subscribed states unless Stripe confirms them through existing Checkout/webhook flow.
- Onboarding does not switch Stripe to live mode.
- Onboarding does not auto-charge outside Stripe Checkout.
- Onboarding does not auto-send customer email, SMS, or social messages.
- Normal users do not receive mock CRM records. CSV/manual lead setup only writes user-provided records.
- Service/product menu upload accepts PDF, PNG, JPG/JPEG, and WEBP. Uploads require a Supabase Storage bucket named `onboarding-files`; when stored, extraction remains `pending_analysis` / `needs_review` until AI or admin review actually parses it.

## Schema Compatibility

`supabase/user_crm_full_completion_schema.sql` includes additive repairs for older databases that created `workspace_members` or `onboarding_sessions` before the current onboarding metadata columns existed. The onboarding flow expects:

- `workspace_members.status`
- `workspace_members.metadata`
- `workspace_members.updated_at`
- `onboarding_sessions.payload`
- `onboarding_sessions.completed`
- `onboarding_sessions.metadata`
- `onboarding_sessions.updated_at`

The schema now explicitly repairs `onboarding_sessions.metadata` with:

```sql
ALTER TABLE public.onboarding_sessions ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
```

The schema ends with `notify pgrst, 'reload schema';` so Supabase/PostgREST refreshes column metadata after the migration is applied.

The schema also includes `crm_service_menu_uploads` for onboarding menu files. The table stores only metadata, storage bucket/path, analysis state, extraction state, optional structured knowledge, and review metadata. Files live in Supabase Storage under the `onboarding-files` bucket.

## Stabilization Pass Notes - 2026-05-27

- Subscription checkout accepts `source=onboarding` / `return_to=onboarding` and returns hosted Stripe Checkout to onboarding billing instead of Settings.
- Billing no longer offers "Save and continue later" on the required billing step.
- Plain Save persists progress without marking incomplete required steps complete; Continue validates, saves, then unlocks the next step.
- Future step navigation is locked to the first incomplete required step; readiness jumps cannot bypass locked steps.
- Legal/company review now has an explicit acknowledgement, and Tax ID last 4 is labeled optional.
- Email and SMS require reviewed setup choices instead of full Resend/Twilio connection unless the user chooses setup now.
- Local Connector was removed from AI mode.
- Brand voice has editable starter copy.
- Calendar setup choices are saved and do not block launch unless marked required.
- Staff presets map to real permissions: leads, pipeline, tasks, calendar, communications, marketing, workflow, settings_read, and admin.
- Workflow draft options were expanded and remain draft/review-gated.
- Help/DFY appears earlier after Business.
- Service/product menu uploads save metadata and create a review recommendation without faking extraction success.

## Fix Pass Notes - 2026-05-27

- Onboarding save is tolerant of stale production schema cache: it writes `metadata`/`updated_at` when available and falls back to payload-backed progress if those columns are not yet visible.
- Continue validates required fields, saves server-side, and then advances one step.
- Skip for now is disabled on required steps and records intentional skip state on optional steps.
- Step navigation is locked for future steps; users can return to completed/unlocked steps.
- Readiness items are clickable and navigate to the relevant onboarding step.
- The billing step uses the explicit “Set up payment method with Stripe” action and Stripe-hosted checkout only.
- The completion button is now “Complete Onboarding” and remains blocked until required readiness gates are complete.
- Dashboard onboarding prompts fetch with the active Supabase session token and also prompt when a workspace exists but no completed onboarding session exists.
- Provider test buttons call `POST /api/onboarding/provider-test`, save/read server-side readiness state, and do not send campaigns, email, SMS, or social posts.
