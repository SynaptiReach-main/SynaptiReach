# Phase 1 - Architecture, Environment, and Security Audit

Inspect the full project before changing code.

Review:
- package.json
- app/src routing
- components
- lib/helpers
- Supabase clients
- auth/session logic
- env variable usage
- middleware
- API routes/server actions
- migrations/schema files
- docs prompt packs
- deployment config
- Vercel config if present

Check:
- Service role key is never used client-side.
- Public env vars are safe.
- Private env vars stay server-only.
- No secrets are committed.
- No console logs expose sensitive data.
- No mock/demo production paths remain.
- No hardcoded Supabase credentials.
- No fake analytics/revenue/user records.

Deliver:
- Fix critical issues.
- Create a production readiness notes file if useful.
- Keep changes minimal and safe.
