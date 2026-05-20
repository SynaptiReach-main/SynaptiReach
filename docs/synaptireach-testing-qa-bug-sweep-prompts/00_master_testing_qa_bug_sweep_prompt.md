# Master Prompt - Testing / QA / Bug Sweep

You are performing a full testing, QA, and bug sweep pass for SynaptiReach.

Goals:
- Find and fix real bugs.
- Verify core flows.
- Verify permissions.
- Verify no mock/fake data appears.
- Verify mobile and responsive behavior.
- Verify build/typecheck/lint/test status.
- Produce a concise QA summary.

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


Testing rules:
1. Prefer fixing bugs over adding features.
2. Do not hide failures with broad try/catch unless appropriate.
3. Do not disable lint/typecheck/tests to make the build pass.
4. Do not invent fake data to make tests look successful.
5. Add tests only where they fit existing project patterns.
