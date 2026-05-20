# Phase 3 - Checkout and Billing Consent

Polish checkout and billing consent flows.

Review:
- CTA routing
- Signup to checkout
- Checkout to onboarding
- Subscription success state
- Failed payment state
- Canceled checkout state
- Billing settings
- Invoice access if available
- Service order checkout if available

Consent requirements:
- Show price clearly.
- Show billing interval clearly.
- Show trial terms clearly.
- Show renewal terms clearly.
- Show cancellation path.
- Do not charge without user consent and real payment flow.

Security:
- Do not expose secret keys client-side.
- Use server-side billing operations where required.
- Do not fake checkout success.
