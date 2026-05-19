# Phase 2 - User Management and CRM Impersonation

Use the instructions from `00_master_admin_portal_prompt.md`.

## Goal

Build the Admin User/Client Management system and CRM Impersonation system for SynaptiReach.

## Objectives

1. Admin can view and manage all users/clients.
2. Admin can open a client profile.
3. Admin can enter a user's CRM and manage it as if they were the user.
4. Every impersonation action must be visible, controlled, and auditable.

## User Directory Fields

Use real data fields when available:

- User name
- Business name
- Email
- Phone
- Account status
- Subscription/plan
- Signup date
- Last login
- Assigned staff
- Services purchased
- CRM usage
- Client health score
- Tags
- Internal notes
- Revenue generated
- Open service orders
- Pending approval items

## Admin User Actions

Support real actions where backend support exists:

- View user
- Edit user
- Assign staff
- Change status
- Add internal note
- Add/remove tags
- View CRM records
- View service orders
- View billing/revenue history if available
- Enter user CRM
- Export data if available
- Suspend/archive user if supported
- Delete user only with strong confirmation and permission checks

## CRM Impersonation Requirements

- Admin can enter a selected user's CRM.
- Display a persistent admin impersonation banner.
- Admin can exit impersonation mode instantly.
- System must know the difference between:
  - The real logged-in admin
  - The user account being managed
- Every admin action inside the user CRM must be logged.
- Destructive actions require confirmation.
- Add permission checks before impersonation.
- Staff can only impersonate if explicitly permitted.
- Consider requiring a reason before entering impersonation mode.

## Impersonation Audit Log

Log:

- Admin/staff actor ID
- Target user ID
- Target organization/account ID if available
- Timestamp
- Action
- Entity changed
- Old value if available
- New value if available
- Reason if required
- IP/device/session metadata if available

## Requirements

- Do not fake users.
- Do not hardcode CRM records.
- Use real data or empty states.
- Preserve existing User CRM behavior.
- Keep impersonation clearly labeled.
- Make it impossible to confuse normal user mode with admin impersonation mode.

## Deliverable

Deliver a working user directory, user profile page, impersonation entry/exit flow, impersonation banner, and audit-ready action logging structure.
