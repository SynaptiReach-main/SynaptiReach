# Phase 2 - Auth, Permissions, and RLS Hardening

Harden authentication, permissions, and data access.

Audit:
- Sign up
- Sign in
- Sign out
- Session refresh
- Protected routes
- User CRM access
- Admin access
- Admin impersonation
- User staff permissions
- Organization/team data isolation
- Supabase RLS policies if used
- API/server action permission checks

Fix:
- Client-only permission checks that need server enforcement.
- Any route that leaks data between organizations.
- Any admin route accessible to normal users.
- Any staff route that ignores scope.
- Any mutation missing an ownership/org check.
- Any destructive action missing confirmation or permission check.

No fake users.
No mock permission records.
Use real auth and real role/permission structures.
