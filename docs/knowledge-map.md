# knowledge-map

## Core Systems

- [[SynaptiReach Onboarding]] implements first-run workspace setup for the [[User CRM]].
- [[SynaptiReach Onboarding]] depends_on [[Business Profile]], [[Billing & Purchase History]], [[CRM Automation & AI Behavior]], provider setup, staff setup, and lead import.
- [[SynaptiReach Onboarding]] connects_to `/dashboard`, `/dashboard/settings`, `/dashboard/leads`, and Stripe Checkout setup.
- [[User CRM Portal Usability]] implements clarity and navigation improvements for the [[User CRM]] dashboard routes.
- [[User CRM Portal Usability]] depends_on real workspace CRM records, review-gated safety behavior, and existing dashboard navigation.
- [[User CRM Portal Usability]] must_not_break onboarding, billing/webhook state ownership, provider setup, local AI/CRM Intelligence data flow, or simulation-only test workspace controls.
