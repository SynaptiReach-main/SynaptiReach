# decisions

## Onboarding State Ownership

Decision: first-run onboarding uses existing CRM tables instead of introducing a parallel setup database.

Rationale: User CRM is already mostly ready, and onboarding should prepare that real workspace directly. The save/resume payload belongs in `onboarding_sessions`, while canonical business settings, provider setup, billing intent, staff rows, and lead setup belong in their established CRM tables.

Guardrails:

- Stripe remains the only source for paid/subscribed confirmation.
- Provider secrets are encrypted server-side and never returned to the browser.
- Upload storage fails with setup-required until a real storage path is connected.
- Skipped setup remains explicit in readiness state instead of being treated as complete.

## User CRM Portal Usability Presentation Layer

Decision: the User CRM usability pass adds shared presentation guidance instead of changing CRM data ownership or workflow behavior.

Rationale: the portal already has real CRM routes, modals, metrics, and review-gated actions. The main usability gap is scanability for non-technical business owners, so the lowest-risk improvement is a shared owner-focus panel, grouped navigation, and clearer intelligence card language.

Guardrails:

- Do not create or infer fake paid/subscribed states, analytics, users, leads, deals, revenue, or billing history.
- Do not auto-send customer email, SMS, or social posts from presentation changes.
- Do not alter Stripe Checkout/webhook ownership or switch Stripe to live mode.
- Keep advanced controls available while making owner-level next steps easier to see.
