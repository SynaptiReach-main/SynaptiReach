# Master Prompt - Local AI / Local Connector

You are building the optional SynaptiReach Local AI / Local Connector system.

This feature allows SynaptiReach to support multiple AI processing modes:

1. SynaptiReach Managed
2. Bring Your Own Keys
3. Local Connector

The app must remain web-first. Local Connector is an advanced optional mode, not a requirement for launch.

Core vision:

- SynaptiReach Managed: the platform handles AI through its own configured provider.
- Bring Your Own Keys: the user or organization provides supported AI provider API keys.
- Local Connector: the user runs a local connector on their own machine or network, potentially connecting to local AI systems such as Ollama.

The Local Connector should eventually support:
- Secure pairing flow
- Connector health status
- Local model discovery
- Local model selection
- Local inference routing
- Privacy-aware routing decisions
- Fallback to managed/BYOK when configured
- Clear warnings when the connector is offline
- User/org-level AI mode settings
- Admin-level controls and visibility
- No accidental exposure of sensitive data
- No dependency on localhost from the deployed web app without a secure connector strategy

Important architecture note:

A deployed web app cannot safely assume it can call a user's `localhost:11434` directly. Browser, network, and security constraints matter. Build the abstraction cleanly:
- UI and settings first
- connector registration/pairing next
- local runtime bridge later
- direct local calls only when technically appropriate and safe
- never hardcode localhost as the only path

Potential local providers:
- Ollama
- LM Studio
- OpenAI-compatible local endpoints
- Future custom local connector daemon

## Global Build Rules

These rules apply to every phase:

1. Use real app state and real database structures only.
2. Do not use mock data, hardcoded users, fake analytics, fake revenue, fake integrations, fake service orders, fake prospects, fake CRM records, or simulated production data.
3. If real data does not exist, show a clean empty state with a useful next action.
4. Preserve the existing SynaptiReach design system:
   - Dark premium interface
   - Cyan-to-green gradients
   - No flat solid green
   - Glow accents
   - Card-based layouts
   - High-tech SaaS feel
   - Prominent SynaptiReach branding
5. Preserve existing working User CRM functionality.
6. Inspect existing files before changing architecture.
7. Reuse existing components, hooks, helpers, auth/session logic, Supabase clients, route conventions, and design tokens where possible.
8. Enforce permissions and security server-side, not only in the UI.
9. Add loading, error, and empty states for every production-facing surface.
10. Avoid destructive migrations unless explicitly required and explained.
11. Keep changes modular and phased.
12. Make the feature production-ready, but do not overbuild beyond the requested phase.


Security rules:

1. Never store raw user API keys in plain text.
2. Never expose service role keys to the client.
3. Never send sensitive CRM data to local or external AI without the selected mode and permissions allowing it.
4. Show what context will be sent before high-risk AI actions.
5. Keep AI audit logs where appropriate.
6. Require confirmation for destructive or live CRM-changing AI actions.
7. Respect organization/team permissions.
8. Local Connector must fail safely when offline.
