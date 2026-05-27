# decisions

## Onboarding State Ownership

Decision: first-run onboarding uses existing CRM tables instead of introducing a parallel setup database.

Rationale: User CRM is already mostly ready, and onboarding should prepare that real workspace directly. The save/resume payload belongs in `onboarding_sessions`, while canonical business settings, provider setup, billing intent, staff rows, and lead setup belong in their established CRM tables.

Guardrails:

- Stripe remains the only source for paid/subscribed confirmation.
- Provider secrets are encrypted server-side and never returned to the browser.
- Upload storage fails with setup-required until a real storage path is connected.
- Skipped setup remains explicit in readiness state instead of being treated as complete.
