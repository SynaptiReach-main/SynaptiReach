# Phase 2 - Pricing, Trials, and Plan Logic

Audit and polish pricing and trial logic.

Check:
- Plan names
- Monthly/yearly pricing if present
- Trial length
- Trial eligibility
- What requires payment method
- What happens at trial end
- Cancellation language
- Upgrade/downgrade behavior
- Seat limits if supported
- AI usage limits if supported
- BYOK/local connector messaging
- Service purchases vs subscriptions

Requirements:
- Pricing UI must match real plan configuration.
- No fake plan features.
- No hidden auto-charge language.
- If payment method is required before trial, state it clearly.
- If payment method is not required, state that clearly.
- If auto-conversion after trial exists, disclose it clearly.
- If manual upgrade is required, disclose it clearly.
