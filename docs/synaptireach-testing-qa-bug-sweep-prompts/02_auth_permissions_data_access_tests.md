# Phase 2 - Auth, Permissions, and Data Access Tests

Test security-sensitive flows:

- Unauthenticated user cannot access protected routes.
- Normal user cannot access admin routes.
- Staff cannot access owner-only settings.
- Staff cannot access other organizations.
- User cannot access another user's CRM.
- Admin impersonation logs actions if implemented.
- Destructive actions require permission/confirmation.
- API/server actions enforce permissions.

Fix any data leaks or permission bypasses.
