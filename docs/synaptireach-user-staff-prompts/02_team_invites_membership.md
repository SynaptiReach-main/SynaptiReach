# Phase 2 - Team Invites and Membership

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Build the customer-side team management system so a business owner can invite, manage, deactivate, and oversee staff members inside their own CRM.

## Requirements

- Use real authenticated users.
- Use real organization membership.
- Do not create fake staff members.
- Do not hardcode demo invites.
- Preserve existing User CRM.
- Enforce permissions server-side and client-side.

## Team Directory

Create a team directory page for the customer organization.

Fields:

- Name
- Email
- Phone if available
- Role
- Status
- Last active
- Invite status
- Assigned leads count if available
- Assigned tasks count if available
- Assigned opportunities count if available
- Permission summary
- Joined date
- Created date

Actions based on permissions:

- Invite staff
- Resend invite
- Cancel invite
- Edit role
- Edit permissions
- Deactivate staff
- Reactivate staff
- Remove staff if allowed
- View activity
- View performance
- Transfer assignments

## Invite Staff Flow

Build an invite flow:

1. Owner/admin opens Invite Staff.
2. Enters email.
3. Selects role.
4. Selects permission preset.
5. Optionally customizes permissions.
6. Optionally assigns existing records.
7. Sends invite.
8. Invite is stored with real organization ID.
9. Invite acceptance route allows user to join organization.
10. Existing account users can accept and link membership.
11. New users can sign up and then join membership.

Invite states:

- Draft
- Sent
- Accepted
- Expired
- Canceled
- Failed

Security:

- Invite tokens should expire.
- Store token hashes if implementing token storage.
- Invitation must be tied to organization.
- Revoked/expired invites should not grant access.
- Accepted invite should create or activate organization membership.
- Invite acceptance should be logged.

## Membership Management

Support member statuses:

- Active
- Invited
- Pending
- Deactivated
- Removed

Deactivation behavior:

- Member loses access immediately.
- Existing activity remains in logs.
- Notes and records remain attributed.
- Owner is prompted to reassign active work.
- Active sessions should be invalidated if supported.

## Assignment Transfer Prompt

When deactivating a member, show summary:

- Assigned leads
- Assigned contacts
- Assigned opportunities
- Assigned tasks
- Pending approvals
- Draft campaigns/workflows

Allow owner/admin to:

- Reassign to another member.
- Leave unassigned.
- Bulk reassign by entity type.

## Role and Permission Editing

Allow authorized owner/admin users to:

- Change a member's role.
- Override permissions.
- Change AI access level.
- Change data scope.
- Restrict exports/destructive actions.
- Require approvals for specific actions.

Every change should be logged.

## Deliverables

- Team directory.
- Invite staff modal/page.
- Invite acceptance route.
- Resend/cancel invite actions.
- Member activation/deactivation.
- Role/permission editing interface.
- Assignment transfer/reassignment prompt.
- Audit logging for membership changes.
- Clean empty states.
- No fake data.
