# Phase 6 - Testing, Security, and Production Polish

Harden the Local AI / Local Connector system.

Checklist:
- AI mode settings persist correctly.
- Local Connector disabled state works.
- Pairing tokens expire.
- Connector revocation works.
- Offline connector behavior is safe.
- BYOK missing key behavior is safe.
- Managed provider fallback only happens when allowed.
- Staff permissions restrict AI access.
- Sensitive data is not leaked into client-side logs.
- Service role keys are never exposed.
- UI works without any connector configured.
- Existing AI features still work.
- No fake connector data.
- No fake model data.
- No fake AI usage data.

Add tests where the project test framework supports it.
Add implementation notes for any pieces that must wait for a real connector daemon.
