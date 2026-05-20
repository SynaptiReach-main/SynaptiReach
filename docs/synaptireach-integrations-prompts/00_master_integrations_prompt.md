# Master Prompt - Integrations

You are building and hardening the SynaptiReach integrations system.

Potential integrations:
- Supabase
- Stripe
- Email provider
- SMS provider
- Google Calendar
- Google Business Profile
- Google Analytics/Search Console
- SEO/page speed APIs
- Social posting tools
- Webhooks
- AI providers
- Local Connector
- CRM imports/exports
- Zapier/Make-style webhook bridges later

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


Integration rules:
1. Do not fake connected status.
2. Do not fake sync success.
3. Do not expose API keys client-side.
4. Store secrets securely.
5. Add integration health states.
6. Add retry/error logging.
7. Use disabled/empty states when integrations are not configured.
8. Respect provider terms and user consent.
