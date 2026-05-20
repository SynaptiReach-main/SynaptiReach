# Phase 4 - AI Routing, Fallbacks, and Privacy

Build the AI routing logic that chooses the correct provider based on mode, permissions, and availability.

Routing rules:
1. If mode is SynaptiReach Managed, route through managed provider.
2. If mode is Bring Your Own Keys, route through configured BYOK provider.
3. If mode is Local Connector, route through active paired connector.
4. If selected mode is unavailable, show a useful error or fallback option only if fallback is explicitly enabled.
5. Do not silently send local-mode requests to cloud AI unless the user/organization allowed fallback.

Privacy controls:
- Show what type of CRM context may be sent.
- Allow limiting AI context scope.
- Add "do not send sensitive fields" option if architecture supports it.
- Respect staff permissions.
- Log AI action metadata without storing sensitive prompt content unless configured.

Fallback states:
- Local connector offline
- BYOK key missing
- Managed provider not configured
- Model unavailable
- Timeout
- Rate limit
- Unsupported task

Build reusable AI routing service abstractions and UI error states.
