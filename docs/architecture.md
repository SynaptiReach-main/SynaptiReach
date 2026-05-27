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
