# knowledge-map

## Core Systems

- [[SynaptiReach Onboarding]] implements first-run workspace setup for the [[User CRM]].
- [[SynaptiReach Onboarding]] depends_on [[Business Profile]], [[Billing & Purchase History]], [[CRM Automation & AI Behavior]], provider setup, staff setup, and lead import.
- [[SynaptiReach Onboarding]] connects_to `/dashboard`, `/dashboard/settings`, `/dashboard/leads`, and Stripe Checkout setup.
- [[SynaptiReach Onboarding]] controls trial path selection for SynaptiReach-managed and BYOK trials while Stripe webhooks own paid/subscribed/trialing state.
- [[SynaptiReach Onboarding]] contains launch readiness scoring, workflow draft setup, staff permission setup, marketing setup, and Help/DFY preference capture.
- [[SynaptiReach Onboarding]] contains service/product menu upload metadata and pending analysis/review state for later CRM/AI knowledge use.
- [[User CRM Portal Usability]] implements clarity and navigation improvements for the [[User CRM]] dashboard routes.
- [[User CRM Portal Usability]] depends_on real workspace CRM records, review-gated safety behavior, and existing dashboard navigation.
- [[User CRM Portal Usability]] must_not_break onboarding, billing/webhook state ownership, provider setup, local AI/CRM Intelligence data flow, or simulation-only test workspace controls.
