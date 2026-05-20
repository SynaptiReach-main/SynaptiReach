# Master Prompt - Final Launch / Production Hardening

You are performing the final launch and production hardening pass for SynaptiReach.

Goal: make the application safe, stable, secure, deployable, and ready for real users.

Focus areas:
- Security
- Auth/session correctness
- Permissions
- Supabase RLS and database access
- Environment variables
- Build health
- Runtime errors
- Real data only
- Empty states
- Error handling
- Performance
- Mobile responsiveness
- Billing readiness
- Admin safety
- User CRM stability
- Onboarding stability
- Staff portal stability
- Logging and observability
- Deployment readiness

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


Do not add major new product features during hardening unless necessary to fix launch blockers.
Do not redesign the app.
Do not introduce new architecture unless required for security or production correctness.
