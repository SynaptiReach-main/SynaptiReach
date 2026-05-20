# Master Prompt - Database / Supabase Schema Hardening

You are hardening the SynaptiReach database and Supabase architecture.

Goals:
- Understand current schema.
- Avoid duplicate/conflicting tables.
- Protect user/org data.
- Enforce RLS where appropriate.
- Add indexes and constraints where needed.
- Keep migrations safe.
- Support User CRM, onboarding, admin portal, user staff portal, service orders, approvals, AI settings, and integrations.

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


Database rules:
1. Inspect existing schema/migrations first.
2. Do not create duplicate tables for concepts that already exist.
3. Prefer additive migrations.
4. Avoid destructive migrations unless explicitly required and backed up.
5. Do not seed fake users, fake CRM records, fake analytics, fake revenue, fake service orders, or fake prospects.
6. System default roles/templates are acceptable only if clearly system defaults, not fake business data.
7. Apply server-side and RLS protections for organization isolation.
