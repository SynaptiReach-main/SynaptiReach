# decisions

## Onboarding State Ownership

Decision: first-run onboarding uses existing CRM tables instead of introducing a parallel setup database.

Rationale: User CRM is already mostly ready, and onboarding should prepare that real workspace directly. The save/resume payload belongs in `onboarding_sessions`, while canonical business settings, provider setup, billing intent, staff rows, and lead setup belong in their established CRM tables.

Guardrails:

- Stripe remains the only source for paid/subscribed confirmation.
- Provider secrets are encrypted server-side and never returned to the browser.
- Service menu uploads use the private `onboarding-files` Supabase Storage bucket and fail with setup-required instructions if private storage cannot be created or used.
- Skipped setup remains explicit in readiness state instead of being treated as complete.

## Trial Path and Card Collection Ownership

Decision: onboarding offers exactly two 14-day trial paths: SynaptiReach-managed and BYOK. The selected subscription plan is the post-trial renewal plan, not a way to unlock larger managed trial usage.

Rationale: managed usage creates SynaptiReach credit exposure and must be constrained during trial. BYOK customers can explore the full software surface while paying provider usage directly. Both paths still require Stripe-hosted card collection before trial activation.

Guardrails:

- Managed trial caps are hard caps for AI, email, SMS, contacts, workflows, and AI review checks.
- Current managed trial caps are 300 AI credits, 250 emails, 0 SMS by default, 25 approved SMS, 250 contacts, 10 active workflows, 25 AI review checks, 2 staff invites, 5 campaign drafts, and 1 CSV import.
- Managed SMS readiness is approval-based and requires approval for estimated Twilio/carrier registration and messaging costs plus SynaptiReach $20 setup fee approval.
- BYOK trial stores provider setup and optional self-imposed caps but does not expose SynaptiReach-managed AI/email/SMS credit.
- Onboarding and checkout-request code must not write active, paid, subscribed, or trialing state. Stripe webhooks own those transitions and trial timestamps.
- Card data is never collected by SynaptiReach pages; card setup is Stripe Checkout only.
- Onboarding-originated Checkout returns to the onboarding Billing step and records only `pending_webhook`/submitted state until signed Stripe webhooks confirm subscription/trial state.
- A manual Checkout-session refresh may store Stripe session visibility metadata, but it must not replace webhook ownership of active, trialing, paid, or subscribed state.
- Email verification, Stripe card setup state, and required trial disclosures gate final onboarding completion.
- A lower post-trial tier must never delete CRM data automatically; future usage beyond the selected plan cap is restricted until upgrade or eligible capacity is added.

## Onboarding Help and DFY Boundary

Decision: onboarding includes self-guided help, a free 30-minute guided setup call option, and paid DFY assistance options in the same save/resume flow.

## Submitted Onboarding Review Gate

Decision: users with submitted but incomplete onboarding sessions are routed to `/onboarding/status` instead of the CRM dashboard.

Rationale: pending Stripe webhook confirmation, provider setup, legal clarification, menu review, staff setup, lead setup, and workflow drafts are real activation blockers or review items. A status page keeps users informed without granting dashboard access before activation.

Guardrails:

- Users who save but do not submit resume `/onboarding` at the saved step.
- Users who submit for review can edit onboarding and resubmit/update without losing the submitted state.
- Users with completed onboarding sessions can access `/dashboard`.
- Stripe Checkout returns may temporarily show Billing, but they must not permanently overwrite the saved onboarding step unless the user was actually saving from Billing.
- Unauthenticated onboarding/status access redirects to sign-in with a return URL; onboarding APIs return 401 instead of attempting anonymous workspace access.
- Authenticated onboarding reads/writes are scoped to the user's owned workspace/session and do not honor raw workspace/session query params for cross-user access.

Rationale: non-technical business owners need clear help without confusing free guidance with paid implementation. Saving the preference in onboarding lets SynaptiReach follow up without auto-charging or auto-fulfilling services.

Guardrails:

- Guidance is free when the user performs setup with SynaptiReach guidance.
- If SynaptiReach performs setup for the user, it is paid DFY work.
- DFY/help requests store intent only and remain consultation/review-gated before checkout or fulfillment.
- DFY/help requests from onboarding are stored in `crm_service_requests` with onboarding metadata and no paid order state.

## Onboarding Menu Upload Boundary

Decision: service/product menu uploads in onboarding store file metadata and pending review/extraction state, but do not claim AI extraction success unless parsing actually runs.

Rationale: service menus can improve CRM/AI assistant/campaign drafting knowledge, but incorrect extracted prices or services would be high risk.

Guardrails:

- Accepted formats are PDF, PNG, JPG/JPEG, and WEBP.
- Files require the `onboarding-files` Supabase Storage bucket.
- Metadata is stored in `crm_service_menu_uploads` with `pending_analysis` / `needs_review` by default.
- A review recommendation is created for admin/manual analysis when parsing is unavailable.
- Structured service/product knowledge must remain tied to the source file and review state.

## CRM-Aware Onboarding Defaults

Decision: onboarding may collect real customer-provided configuration data for CRM defaults, analytics baselines, communication preferences, workflow drafts, and admin review, but it must store those values as settings/defaults unless a real user-provided record is intentionally imported or entered.

Rationale: the User CRM should feel pre-configured after onboarding without creating fake customers, fake analytics, fake revenue, fake provider success, or fake billing state.

Guardrails:

- Optional baseline metrics are stored as analytics preferences and do not create analytics events or revenue.
- Lead/deal/task/pipeline fields configure defaults and recommendations; they do not create fake deals or tasks.
- AI, marketing, and workflow fields create draft/review preferences only; external sends remain review-gated.
- Service/product menu uploads remain pending review until real extraction/admin review occurs.

## User CRM Portal Usability Presentation Layer

Decision: the User CRM usability pass adds shared presentation guidance instead of changing CRM data ownership or workflow behavior.

Rationale: the portal already has real CRM routes, modals, metrics, and review-gated actions. The main usability gap is scanability for non-technical business owners, so the lowest-risk improvement is a shared owner-focus panel, grouped navigation, and clearer intelligence card language.

Guardrails:

- Do not create or infer fake paid/subscribed states, analytics, users, leads, deals, revenue, or billing history.
- Do not auto-send customer email, SMS, or social posts from presentation changes.
- Do not alter Stripe Checkout/webhook ownership or switch Stripe to live mode.
- Keep advanced controls available while making owner-level next steps easier to see.
