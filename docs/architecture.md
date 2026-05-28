# architecture

## Onboarding

The first-run onboarding flow lives at `/onboarding` with a lightweight selector at `/onboarding/select`.

Server APIs:

- `GET /api/onboarding/save` loads the authenticated user's current workspace, onboarding session, saved CRM state, and launch readiness.
- `POST /api/onboarding/save` saves progress into existing workspace/CRM tables.
- `POST /api/onboarding/complete` saves final state, marks the onboarding session complete, and redirects to `/dashboard`.
- `POST /api/onboarding/integrations` is a compatibility path for integration-only onboarding saves.
- `POST /api/onboarding/upload` accepts service/product menu PDF/image uploads, stores the file in the `onboarding-files` Supabase Storage bucket when configured, records metadata in `crm_service_menu_uploads`, and creates a review recommendation when parsing is still manual.
- `POST /api/onboarding/stripe-session` refreshes Stripe Checkout session status into billing metadata for visibility only; signed Stripe webhooks still own active/trialing/subscribed state.

State is stored in existing tables: `workspaces`, `workspace_members`, `onboarding_sessions`, `crm_settings`, `crm_billing_accounts`, `crm_provider_connections`, `crm_csv_imports`, `crm_service_menu_uploads`, `leads`, `crm_staff`, `crm_staff_permissions`, `crm_tasks`, `crm_workflows`, and `crm_ai_recommendations`. Billing setup records plan/trial intent, usage caps, acknowledgements, checkout submission, and managed SMS readiness only; active subscription/payment/trialing status remains Stripe-webhook owned.

`crm_settings.metadata` is the CRM-population bridge for onboarding defaults: service areas/hours, common customer problems, booking/quote/review notes, pipeline defaults, appointment types, task defaults, assignment rules, analytics preferences, communication style, calendar setup, marketing setup, and workflow draft preferences. These values configure the real workspace and recommendations; onboarding does not generate fake CRM activity.

Onboarding-originated Stripe Checkout uses `/onboarding?checkout=success&session_id={CHECKOUT_SESSION_ID}&step=billing` and `/onboarding?checkout=cancelled&step=billing`. Settings-originated checkout keeps the Settings return path.

The onboarding wizard now supports two 14-day trial paths:

- SynaptiReach-managed trial: fixed hard caps for managed AI/email/SMS/contact/workflow/AI-review exposure; post-trial plan selection controls renewal after the trial and does not increase trial caps.
- BYOK trial: the customer connects and pays their own AI/email/SMS/social providers, with optional self-imposed caps saved in billing metadata.

Stripe Checkout is the only card setup path. Checkout requests write `checkout_required`, `checkout_created`, or `pending_webhook` state and leave trial start/end timestamps empty until signed Stripe webhook events provide them. Email verification, Stripe card setup, and trial disclosures gate final onboarding completion. Dashboard layout redirects incomplete unsubmitted users back to onboarding, redirects submitted pending-review users to `/onboarding/status`, and allows completed users into the CRM.

Help/DFY requests from onboarding are persisted as `crm_service_requests` with `metadata.source = onboarding_help`; they store intent and consultation state only, not paid order state. Provider test controls in onboarding save encrypted setup state and readiness status without sending campaigns, email, SMS, or social posts.

## User CRM Portal Usability

The authenticated User CRM dashboard keeps its existing route structure under `/dashboard/*` and now shares a compact owner-focus summary component across the scoped portal pages. The panel surfaces real counts from each page when available and uses setup/safety language only where a count would imply unavailable state.

The shared dashboard layout groups navigation into Start, Customers, Growth, Work, and Review while preserving existing hrefs. The shared Business Intelligence panel keeps the same `/api/intelligence/*` data flow and review-gated action API, but presents insights with explicit "Why it matters" and "Suggested next step" blocks for non-technical business owners.

Guardrails:

- Owner-focus panels are presentation-only and do not write database state.
- Existing CRM create/edit/import/send/checkout behavior remains owned by the existing page/API routes.
- Review-gated email, SMS, social, workflow, and billing safety behavior must remain visible and unchanged.
- Dashboard routes continue to use real workspace state and clean empty states; normal users must not receive fake CRM records.
