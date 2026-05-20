# Phase 2 - RLS, Permissions, and Data Isolation

Harden data isolation.

Check:
- Users only access their own records.
- Organization members only access their organization data.
- Staff only access permitted/scoped data.
- Admin routes use admin-specific checks.
- Service role usage stays server-side.
- RLS policies align with app permissions.

Implement/fix:
- Organization-based RLS policies.
- Role/permission checks where required.
- Admin-only policies or server-only access patterns.
- Audit log protections.
- Billing protections.
- Integration secret protections.

Never rely only on UI hiding.
