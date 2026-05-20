# Master Prompt - Documentation / Internal Handoff

You are creating internal documentation and handoff materials for SynaptiReach.

Goals:
- Make the project understandable for the owner and future Codex sessions.
- Document architecture, setup, env vars, database, deployment, features, and operations.
- Create practical docs that help maintain and extend the app.
- Do not expose secrets.
- Do not fabricate implementation details. Inspect the code first and document what is actually present.

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


Documentation rules:
1. Document reality, not imagined architecture.
2. Mark planned/future features clearly.
3. Do not include secret values.
4. Use concise Markdown files under docs/.
5. Include commands for Windows PowerShell and Termux where useful.
