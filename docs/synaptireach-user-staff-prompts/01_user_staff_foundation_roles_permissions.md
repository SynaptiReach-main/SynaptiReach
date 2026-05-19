# Phase 1 - User Staff Foundation, Roles, Permissions, and Organization Context

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Build the foundation for customer-facing staff/team access inside each SynaptiReach user's CRM.

This phase should establish organization membership, roles, permissions, data scopes, route protection, and permission-aware navigation.

## Requirements

1. Inspect the existing project structure before editing.
2. Inspect current authentication/session logic.
3. Inspect current User CRM routes/components.
4. Inspect current database/Supabase access patterns.
5. Reuse existing architecture where possible.
6. Do not create fake team members.
7. Do not create fake CRM data.
8. Do not break the existing User CRM.

## Build or Prepare

### Organization Context

Create or reuse an organization/business account context.

Support:

- Current active organization.
- Organization membership for authenticated user.
- Role per organization.
- Permission set per organization.
- Data scope per permission.
- Organization switcher readiness for users with multiple memberships.

If organization support already exists, extend it.
If it does not exist, create data-ready interfaces and minimal structures that fit the current app.

### Role System

Support default customer-side roles:

- Business Owner
- Business Admin
- Manager
- Sales Rep
- Appointment Setter
- Office Admin
- Marketing Assistant
- Technician / Field Staff
- Read-Only User
- Contractor

Do not create fake sample staff records.

If system role records are needed, create proper system/default role definitions safely, not fake demo content.

### Permission System

Create a permission key model that can support:

- Team permissions
- Contact permissions
- Lead permissions
- Opportunity permissions
- Task permissions
- Campaign permissions
- Workflow permissions
- AI permissions
- Analytics permissions
- Settings permissions
- Billing permissions
- Destructive action permissions

Each permission should support a scope:

- No Access
- Assigned Only
- Created By Me
- Team Only
- All Organization Data
- Read-Only
- Custom Rule, if practical

### Permission Enforcement

Add reusable helpers/components such as:

- `hasPermission`
- `getPermissionScope`
- `requireOrganizationRole`
- `requirePermission`
- `PermissionGate`
- `ScopeBadge`
- `RoleBadge`

Security rules:

- UI must hide unavailable actions.
- Server/API/database access must enforce permissions.
- Do not rely only on UI hiding.
- Deactivated staff must have no access.
- Cross-organization data leaks must be prevented.

### Route Protection

Protect User Staff Portal routes based on:

- Authenticated user.
- Active organization membership.
- Role.
- Permission.
- Membership status.

### Navigation

Add permission-aware navigation for customer-side staff.

Navigation may include:

- My Dashboard
- My Work
- My Tasks
- My Leads
- My Opportunities
- Team
- Approvals
- Activity
- Team Analytics
- Team Settings
- AI Copilot

Only show sections the current user can access.

## Empty States

Add clean empty states when no real data exists.

Examples:

- "No team members yet. Invite your first staff member to start collaborating inside your CRM."
- "No assigned work yet. When tasks or leads are assigned to you, they will appear here."

## Deliverables

- Organization context support.
- Role and permission model.
- Permission helpers.
- Permission-aware route protection.
- Permission-aware User Staff navigation.
- Reusable permission UI components.
- Clean empty states.
- No fake data.
- Existing User CRM remains intact.
