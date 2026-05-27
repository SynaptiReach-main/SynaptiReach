# architecture

## Onboarding

The first-run onboarding flow lives at `/onboarding` with a lightweight selector at `/onboarding/select`.

Server APIs:

- `GET /api/onboarding/save` loads the authenticated user's current workspace, onboarding session, saved CRM state, and launch readiness.
- `POST /api/onboarding/save` saves progress into existing workspace/CRM tables.
- `POST /api/onboarding/complete` saves final state, marks the onboarding session complete, and redirects to `/dashboard`.
- `POST /api/onboarding/integrations` is a compatibility path for integration-only onboarding saves.
- `POST /api/onboarding/upload` currently fails with setup-required until real file storage is connected.

State is stored in existing tables: `workspaces`, `workspace_members`, `onboarding_sessions`, `crm_settings`, `crm_billing_accounts`, `crm_provider_connections`, `crm_csv_imports`, `leads`, and `crm_staff`. Billing setup records plan intent only; active subscription/payment status remains Stripe-webhook owned.

## User CRM Portal Usability

The authenticated User CRM dashboard keeps its existing route structure under `/dashboard/*` and now shares a compact owner-focus summary component across the scoped portal pages. The panel surfaces real counts from each page when available and uses setup/safety language only where a count would imply unavailable state.

The shared dashboard layout groups navigation into Start, Customers, Growth, Work, and Review while preserving existing hrefs. The shared Business Intelligence panel keeps the same `/api/intelligence/*` data flow and review-gated action API, but presents insights with explicit "Why it matters" and "Suggested next step" blocks for non-technical business owners.

Guardrails:

- Owner-focus panels are presentation-only and do not write database state.
- Existing CRM create/edit/import/send/checkout behavior remains owned by the existing page/API routes.
- Review-gated email, SMS, social, workflow, and billing safety behavior must remain visible and unchanged.
- Dashboard routes continue to use real workspace state and clean empty states; normal users must not receive fake CRM records.
