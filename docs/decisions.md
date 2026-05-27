# decisions

## Onboarding State Ownership

Decision: first-run onboarding uses existing CRM tables instead of introducing a parallel setup database.

Rationale: User CRM is already mostly ready, and onboarding should prepare that real workspace directly. The save/resume payload belongs in `onboarding_sessions`, while canonical business settings, provider setup, billing intent, staff rows, and lead setup belong in their established CRM tables.

Guardrails:

- Stripe remains the only source for paid/subscribed confirmation.
- Provider secrets are encrypted server-side and never returned to the browser.
- Upload storage fails with setup-required until a real storage path is connected.
- Skipped setup remains explicit in readiness state instead of being treated as complete.

## Trial Path and Card Collection Ownership

Decision: onboarding offers exactly two 14-day trial paths: SynaptiReach-managed and BYOK. The selected subscription plan is the post-trial renewal plan, not a way to unlock larger managed trial usage.

Rationale: managed usage creates SynaptiReach credit exposure and must be constrained during trial. BYOK customers can explore the full software surface while paying provider usage directly. Both paths still require Stripe-hosted card collection before trial activation.

Guardrails:

- Managed trial caps are hard caps for AI, email, SMS, contacts, workflows, and agents.
- Current managed trial caps are 300 AI credits, 250 emails, 0 SMS by default, 25 approved SMS, 250 contacts, 10 active workflows, 25 agent runs, 2 staff invites, 5 campaign drafts, and 1 CSV import.
- Managed SMS readiness is approval-based and requires Twilio/carrier fee approval plus SynaptiReach $20 setup fee approval.
- BYOK trial stores provider setup and optional self-imposed caps but does not expose SynaptiReach-managed AI/email/SMS credit.
- Onboarding and checkout-request code must not write active, paid, subscribed, or trialing state. Stripe webhooks own those transitions and trial timestamps.
- Card data is never collected by SynaptiReach pages; card setup is Stripe Checkout only.
- Email verification, Stripe card setup state, and required trial disclosures gate final onboarding completion.
- A lower post-trial tier must never delete CRM data automatically; future usage beyond the selected plan cap is restricted until upgrade or eligible capacity is added.

## Onboarding Help and DFY Boundary

Decision: onboarding includes self-guided help, a free 30-minute guided setup call option, and paid DFY assistance options in the same save/resume flow.

Rationale: non-technical business owners need clear help without confusing free guidance with paid implementation. Saving the preference in onboarding lets SynaptiReach follow up without auto-charging or auto-fulfilling services.

Guardrails:

- Guidance is free when the user performs setup with SynaptiReach guidance.
- If SynaptiReach performs setup for the user, it is paid DFY work.
- DFY/help requests store intent only and remain consultation/review-gated before checkout or fulfillment.
- DFY/help requests from onboarding are stored in `crm_service_requests` with onboarding metadata and no paid order state.

## User CRM Portal Usability Presentation Layer

Decision: the User CRM usability pass adds shared presentation guidance instead of changing CRM data ownership or workflow behavior.

Rationale: the portal already has real CRM routes, modals, metrics, and review-gated actions. The main usability gap is scanability for non-technical business owners, so the lowest-risk improvement is a shared owner-focus panel, grouped navigation, and clearer intelligence card language.

Guardrails:

- Do not create or infer fake paid/subscribed states, analytics, users, leads, deals, revenue, or billing history.
- Do not auto-send customer email, SMS, or social posts from presentation changes.
- Do not alter Stripe Checkout/webhook ownership or switch Stripe to live mode.
- Keep advanced controls available while making owner-level next steps easier to see.
