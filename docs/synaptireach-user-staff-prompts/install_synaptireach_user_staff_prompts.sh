#!/usr/bin/env bash
set -euo pipefail
mkdir -p docs/synaptireach-user-staff-prompts
cat > docs/synaptireach-user-staff-prompts/README.md <<'EOF'
# SynaptiReach User Staff Portal Prompt Pack

This prompt pack is for building the customer-facing User Staff Portal inside each SynaptiReach user's CRM.

This is **not** the SynaptiReach Admin Staff Portal.

The User Staff Portal lets each SynaptiReach customer invite and manage their own staff/team members inside their own CRM with restricted roles, permissions, data scopes, approval rules, AI access levels, task assignment, activity tracking, and mobile-friendly workflows.

## Recommended Codex Start

Read these files first:

- `00_master_user_staff_portal_prompt.md`
- `01_user_staff_foundation_roles_permissions.md`

Then implement Phase 1 first.

## Critical Rules

- Do not use mock data.
- Do not create fake team members.
- Do not create fake analytics.
- Do not create fake leads, contacts, tasks, opportunities, campaigns, workflows, or staff activity.
- Use real authenticated users.
- Use real organization/team membership.
- Use real CRM records.
- Use real permissions.
- Use clean empty states when data is unavailable.
- Preserve the existing User CRM.
- Preserve the existing SynaptiReach design system.
- Enforce permissions server-side and client-side.
- Never rely only on hiding UI buttons.

## Suggested Build Order

1. Foundation, roles, permissions, organization context
2. Team invites and membership
3. Staff dashboards and My Work
4. Assignment and task system
5. Staff approval workflows
6. Staff AI Copilot
7. Activity, analytics, notifications, and audit logs
8. Mobile, security, seat limits, and production polish

## Codex Starter Prompt

```text
Read the files in docs/synaptireach-user-staff-prompts.

Start with:
- 00_master_user_staff_portal_prompt.md
- 01_user_staff_foundation_roles_permissions.md

Implement Phase 1 first.

Do not use mock data, hardcoded data, fake users, fake staff, fake analytics, fake leads, fake tasks, fake opportunities, or simulated CRM records.

Use real app state, real database structures, real authenticated users, real organization/team membership, real permissions, and clean empty states when data is unavailable.

Preserve the existing SynaptiReach design system and do not break the existing User CRM.

Remember: this is the customer-facing staff portal inside each user's CRM, not the SynaptiReach Admin Staff Portal.
```
EOF
cat > docs/synaptireach-user-staff-prompts/00_master_user_staff_portal_prompt.md <<'EOF'
# SynaptiReach User Staff Portal - Master Prompt

You are building the SynaptiReach User Staff Portal.

This is a production-grade customer-facing team portal inside each SynaptiReach user's CRM. It allows a SynaptiReach customer/business owner to invite their own staff members into their business CRM with restricted roles, scoped permissions, assignment workflows, approval controls, staff AI assistance, activity logs, notifications, and mobile-friendly CRM workflows.

This is not the SynaptiReach Admin Portal.
This is not the SynaptiReach Admin Staff Portal.
This is not for SynaptiReach internal staff.

This is for each SynaptiReach customer's own team.

Example:

A roofing company uses SynaptiReach. The roofing company owner should be able to invite:

- Business admin
- Manager
- Sales rep
- Appointment setter
- Office admin
- Marketing assistant
- Technician or field staff
- Read-only user
- Contractor

Each staff member should only see and do what the business owner allows within that business's CRM.

## Core Vision

The User Staff Portal should make SynaptiReach feel like a complete team-based CRM and business operating system.

Each customer should be able to:

- Invite staff.
- Assign roles.
- Customize permissions.
- Control AI access.
- Assign leads, contacts, opportunities, tasks, campaigns, workflows, and approvals.
- Track staff activity.
- Review staff performance.
- Approve or deny staff-created work.
- Protect sensitive data.
- Restrict billing access.
- Restrict destructive actions.
- Keep all organization data isolated.
- Support mobile staff workflows.
- Prepare for future seat-based pricing and plan limits.

The portal must extend the existing User CRM, not duplicate or replace it.

## Absolute Requirements

1. Use real application data only.
2. Do not create fake staff users.
3. Do not create fake leads, contacts, opportunities, tasks, analytics, approvals, activities, campaigns, workflows, or reports.
4. Do not hardcode demo users or simulated records.
5. If real data does not exist, show clean empty states with helpful actions.
6. Reuse existing User CRM architecture wherever possible.
7. Reuse existing auth/session logic wherever possible.
8. Reuse existing Supabase/database access patterns wherever possible.
9. Preserve the existing SynaptiReach design system.
10. Preserve the existing User CRM.
11. Do not break current working routes/components.
12. Do not create disconnected duplicate CRM pages unless necessary.
13. Build staff support as an extension of the existing CRM.
14. Enforce permissions in the UI and in backend/API/database access.
15. Never rely only on hidden buttons for security.
16. Keep all data scoped by organization/business account.
17. Prevent cross-organization data leaks.
18. Every staff action that changes important data should be auditable.
19. Sensitive actions must require explicit permission and confirmation.
20. AI tools must respect staff permissions and data scopes.

## Existing SynaptiReach Design Requirements

Use the SynaptiReach dark premium UI style:

- Dark background.
- Cyan-to-green gradients.
- No flat solid green.
- Glow accents.
- Card-based layouts.
- High-tech SaaS dashboard feel.
- Clean responsive layout.
- Prominent SynaptiReach branding where appropriate.
- Smooth, polished, modern CRM interactions.
- Consistent typography, spacing, border radii, and component behavior.

## Portal Types and Separation

### SynaptiReach Owner/Admin Portal

Used by the SynaptiReach owner.

Controls the entire platform, all users, service orders, SynaptiReach staff, revenue, admin AI, client finder, global approvals, and user CRM impersonation.

### SynaptiReach Admin Staff Portal

Used by SynaptiReach internal staff.

Allows assigned internal staff to fulfill SynaptiReach services for clients.

### User Staff Portal

Used by a customer's staff.

Restricted to one customer organization/business CRM unless the person belongs to multiple organizations. Controlled by the customer's business owner or authorized business admin. Staff cannot access SynaptiReach platform-level admin features.

## Default User Staff Roles

Support preset roles and prepare for custom roles.

### Business Owner

Highest role inside a customer organization.

Can generally:

- Manage team members.
- Manage roles and permissions.
- View and manage all CRM data for the organization.
- Manage contacts, leads, opportunities, tasks, campaigns, workflows, templates, AI settings, and team settings.
- View analytics and staff performance.
- Approve or deny staff work.
- Control billing access if the billing system permits.
- Manage integrations if permitted.
- Export data if allowed by plan and settings.

### Business Admin

Trusted administrator inside the customer organization.

Can generally manage most CRM operations but may be restricted from billing, ownership transfer, account deletion, and high-risk settings.

### Manager

Operational manager.

Can manage assigned teams, assign leads/tasks, review staff work, view team dashboards, and approve work if allowed.

### Sales Rep

Frontline sales staff.

Can work assigned leads/opportunities, add notes, complete tasks, move deals through permitted stages, and use approved follow-up tools.

### Appointment Setter

Focused on first contact, callbacks, scheduling, lead status updates, and follow-up tasks.

### Office Admin

Handles contact organization, appointments, CRM cleanup, data entry, internal notes, and task management.

### Marketing Assistant

Can draft campaign content, social/email/SMS content, and submit marketing work for approval. May view campaign analytics if allowed.

### Technician / Field Staff

Useful for service businesses.

Can view assigned customer/contact info, appointments/jobs if supported, customer notes, tasks, and completion checklists. Can update task/job status and upload files/photos if supported.

### Read-Only User

Can view permitted records but cannot edit, send, launch, delete, export, or approve.

### Contractor

Limited external helper.

Can only view explicitly assigned tasks/projects/records and add comments or deliverables if allowed.

## Custom Roles

Business owners should eventually be able to create custom roles.

Custom role fields:

- Role name
- Description
- Permission set
- Default dashboard
- Allowed modules
- Data access scope
- Approval requirements
- AI access level
- Created by
- Created date
- Last updated

Examples:

- Senior Sales Rep
- Junior Sales Rep
- Marketing Intern
- Regional Manager
- Call Center Agent
- Intake Coordinator
- Project Coordinator
- Estimator
- Dispatcher

## Permission Categories

Permissions should be grouped clearly and represented as data, not scattered hardcoded logic.

### Team Permissions

- View team members
- Invite team members
- Remove team members
- Deactivate/reactivate team members
- Edit team roles
- Create custom roles
- View staff activity
- View staff performance
- Assign staff to records
- Reassign staff work

### Contact Permissions

- View contacts
- View assigned contacts only
- Create contacts
- Edit contacts
- Delete contacts
- Import contacts
- Export contacts
- Merge contacts
- Add internal notes
- View sensitive contact fields
- View communication history

### Lead Permissions

- View leads
- View assigned leads only
- Create leads
- Edit leads
- Delete leads
- Assign leads
- Claim unassigned leads
- Move leads through stages
- Convert leads to opportunities
- View lead source
- View lead score

### Opportunity / Pipeline Permissions

- View pipeline
- View assigned opportunities only
- Create opportunities
- Edit opportunities
- Delete opportunities
- Move opportunity stages
- Mark won/lost
- View deal value
- Edit deal value
- Assign opportunities
- View pipeline analytics

### Task Permissions

- View tasks
- View assigned tasks only
- Create tasks
- Assign tasks
- Edit tasks
- Complete tasks
- Delete tasks
- Reopen tasks
- View team tasks
- View overdue tasks

### Campaign Permissions

- View campaigns
- Create campaign drafts
- Edit campaigns
- Submit campaigns for approval
- Approve campaigns
- Launch campaigns
- Pause campaigns
- Delete campaigns
- View campaign analytics
- Send email campaigns
- Send SMS campaigns
- Send bulk campaigns

### Workflow Permissions

- View workflows
- Create workflow drafts
- Edit workflows
- Activate workflows
- Pause workflows
- Delete workflows
- View workflow logs
- View failed workflow events
- Submit workflow changes for approval

### AI Permissions

- Use AI assistant
- Use AI for assigned records only
- Generate summaries
- Generate email drafts
- Generate SMS drafts
- Generate campaign ideas
- Generate workflow suggestions
- Generate sales scripts
- Generate follow-up recommendations
- Auto-apply low-risk AI suggestions
- Require approval before using AI output
- View AI history
- Save AI templates

### Analytics Permissions

- View personal dashboard
- View team dashboard
- View business dashboard
- View sales analytics
- View campaign analytics
- View workflow analytics
- View revenue/deal values
- View lead source analytics
- Export analytics

### Settings Permissions

- View CRM settings
- Edit CRM settings
- Manage pipelines
- Manage custom fields
- Manage tags
- Manage templates
- Manage automations
- Manage integrations
- Manage notification settings
- Manage AI settings

### Billing Permissions

Usually owner-only.

- View subscription
- Change plan
- Manage payment method
- View invoices
- Purchase SynaptiReach services
- Cancel account

### Destructive Action Permissions

High-risk permissions:

- Delete contacts
- Delete leads
- Delete opportunities
- Delete campaigns
- Delete workflows
- Delete team members
- Delete imported data
- Export full CRM
- Change ownership
- Cancel account
- Modify billing
- Disconnect integrations

These should require explicit permission, confirmation, and audit logging.

## Data Access Scopes

Permissions must include data scope, not only module access.

Supported scopes:

- No Access
- Assigned Only
- Created By Me
- Team Only
- Department/Territory Only, if supported
- All Organization Data
- Read-Only
- Custom Rule

Example:

A Sales Rep may have `leads.view` with `assigned_only`.
A Manager may have `leads.view` with `team_only`.
A Business Owner may have `leads.view` with `all_organization`.

## Organization Context

The system must support organization-level membership.

A person could belong to multiple organizations.

Example:

- One user is the owner of their own business.
- The same user is a contractor in another business's CRM.
- The same user is a sales rep for another organization.

Required behavior:

- Active organization context.
- Organization switcher if multiple memberships exist.
- Role per organization.
- Permissions per organization.
- Data scoped by active organization.
- No cross-organization data leaks.
- Staff cannot infer or access data from other organizations.

## Team Management

Business owners/admins should be able to:

- View team directory.
- Invite staff.
- Resend invite.
- Cancel invite.
- Edit roles.
- Edit permissions.
- Deactivate staff.
- Reactivate staff.
- Remove staff if allowed.
- View activity.
- View performance.
- Transfer assignments.
- Bulk reassign records.
- See invite status.
- See last active date.
- See assigned workload.

Team member fields:

- Name
- Email
- Phone
- Role
- Status
- Last active
- Assigned leads
- Assigned contacts
- Assigned tasks
- Assigned opportunities
- Permission summary
- Invite status
- Created date
- Joined date

## Invite Flow

Invite process:

1. Owner enters email.
2. Owner selects role.
3. Owner selects permission preset.
4. Owner optionally customizes permissions.
5. Owner optionally assigns existing records.
6. System sends invite.
7. Staff accepts invite.
8. Staff signs in or creates account.
9. Staff account joins organization.
10. Staff sees correct dashboard and access.

Invite states:

- Draft
- Sent
- Accepted
- Expired
- Canceled
- Failed

Security requirements:

- Invite token should expire.
- Invite should be tied to organization.
- Invite should not grant access to other organizations.
- If user already has an account, link membership to organization after acceptance.
- If user does not have an account, route through sign-up/onboarding.
- Owner should be able to revoke invitation.
- Invite acceptance should be audited.

## Staff Deactivation

When a team member is deactivated:

- They lose access immediately.
- Existing assignments remain visible to owner/admin.
- Owner is prompted to reassign leads/tasks/opportunities.
- Previous activity remains in audit logs.
- Notes/comments remain attributed.
- They are not deleted from historical records.
- Active sessions should be invalidated if supported.

## Assignment System

Assignable records:

- Leads
- Contacts
- Opportunities
- Tasks
- Campaign drafts
- Workflow drafts
- Appointments
- Jobs/service records if they exist later
- Follow-up sequences
- Approval items

Assignment fields:

- Organization ID
- Entity type
- Entity ID
- Assigned to user ID
- Assigned by user ID
- Assigned date
- Due date
- Priority
- Status
- Notes
- Reassignment history

Features:

- Bulk assign
- Round-robin assign
- Auto-assign by role
- Auto-assign by territory
- Auto-assign by lead source
- Auto-assign by workload
- Reassignment alerts
- Unassigned records queue
- Claim queue for eligible staff
- Assignment history

## Task System

Tasks should be central to the User Staff Portal.

Task types:

- Call lead
- Send follow-up
- Review contact
- Update opportunity
- Prepare estimate
- Book appointment
- Draft campaign
- Review campaign
- Check workflow
- Upload asset
- Internal reminder
- Custom task

Task fields:

- Organization ID
- Title
- Description
- Assigned to
- Created by
- Related contact
- Related lead
- Related opportunity
- Related campaign
- Priority
- Status
- Due date
- Reminder
- Notes
- Attachments if supported
- Completion timestamp

Task statuses:

- New
- Assigned
- In Progress
- Waiting
- Complete
- Overdue
- Canceled
- Archived

## Staff Dashboards

Each staff member should see a dashboard based on their role, permissions, assignments, and data scope.

### Owner Dashboard

Shows:

- Total leads
- New leads
- Assigned leads
- Unassigned leads
- Pipeline value
- Deals won/lost
- Campaign performance
- Staff workload
- Staff performance
- Tasks due
- Overdue tasks
- Approval requests
- AI recommendations
- CRM health score
- Follow-up speed
- Missed opportunities

### Manager Dashboard

Shows:

- Team leads
- Team opportunities
- Team tasks
- Staff workload
- Overdue follow-ups
- Records needing assignment
- Approval requests
- Campaign drafts
- Workflow issues
- Team performance

### Sales Rep Dashboard

Shows:

- My leads
- My opportunities
- Follow-ups due today
- Overdue follow-ups
- Recent contact activity
- Hot leads
- AI next best actions
- Appointments if supported
- Personal pipeline
- Won/lost tracking

### Appointment Setter Dashboard

Shows:

- Leads needing first contact
- Follow-ups due
- Overdue callbacks
- Appointment requests
- Booked appointments
- No-response leads
- AI call/SMS scripts

### Marketing Assistant Dashboard

Shows:

- Campaign drafts
- Content tasks
- Approval status
- Upcoming scheduled campaigns
- Campaign performance if allowed
- AI content suggestions
- Template library

### Technician / Field Staff Dashboard

Shows:

- Assigned customers
- Assigned tasks
- Upcoming appointments/jobs if supported
- Customer notes
- Required follow-up
- Completion checklist

## Approval System

Business owners/managers may want staff to create drafts but not publish them.

Approval item types:

- Email campaign drafts
- SMS campaign drafts
- Workflow changes
- Landing page edits if applicable
- Contact imports
- Bulk message sends
- Pipeline changes
- AI-generated campaign content
- AI-generated workflow
- AI-generated outreach
- High-risk record changes

Approval actions:

- Approve
- Deny
- Request revision
- Edit and approve
- Comment
- Assign reviewer
- Schedule
- Publish

Approval rules:

- Owners can approve everything.
- Business admins can approve if allowed.
- Managers can approve team work if allowed.
- Staff can submit but not approve unless permission allows.
- Approval decisions should be logged.
- AI-generated content may require owner approval depending on settings.

## Approval Rule Builder

Business owners should eventually configure rules such as:

- Sales reps can send one-to-one emails without approval.
- Sales reps cannot send bulk emails.
- Marketing assistants can draft campaigns but not launch them.
- Workflow changes require owner approval.
- AI-generated SMS must be approved before sending.
- Contact imports over 100 contacts require approval.
- Deleting contacts requires owner approval.
- Moving opportunities to Lost does not require approval.
- Marking deals Won requires manager confirmation if deal value is above a threshold.
- Bulk export always requires owner approval.

## Staff AI Copilot

Each organization should have AI assistance for staff, controlled by permissions.

AI should help staff:

- Summarize contacts.
- Summarize leads.
- Draft follow-ups.
- Generate call scripts.
- Recommend next best actions.
- Explain pipeline status.
- Draft campaign content.
- Draft SMS/email.
- Suggest tasks.
- Identify stale leads.
- Prepare appointment notes.
- Improve lead conversion.
- Prioritize assigned work.
- Create safe drafts for owner approval.

AI access levels:

- No AI Access
- Basic AI Access
- Draft AI Access
- Assisted Action Access
- Full AI Access within organization scope

AI safety:

- AI cannot send messages without permission.
- AI cannot launch campaigns without approval.
- AI cannot change workflows without approval.
- AI cannot delete records.
- AI cannot access records outside the staff member's scope.
- AI cannot reveal sensitive fields the staff member is not allowed to see.
- AI must show what context it used.
- AI-generated high-impact outputs should support approval routing.
- AI actions should be logged.

## Notifications

Staff should receive notifications based on assignments and permissions.

Notification types:

- New lead assigned
- Task assigned
- Task due soon
- Task overdue
- Opportunity moved
- Approval requested
- Approval approved
- Approval denied
- Revision requested
- Comment/mention
- Campaign scheduled
- Workflow issue
- New message/reply
- Manager reassigned record
- AI recommendation available
- Invite accepted
- Staff deactivated
- High-risk permission granted
- Bulk export attempted

Channels:

- In-app notifications first.
- Email later if existing app supports it.
- SMS later if existing app supports it.
- Push later if supported.

Notification settings:

- User-level preferences.
- Organization-level defaults.
- Role-based defaults.

## Internal Notes and Collaboration

Features:

- Internal notes on contacts
- Internal notes on leads
- Internal notes on opportunities
- Internal notes on tasks
- Mentions if supported
- Activity feed
- Staff comments
- Status updates
- Pinned notes
- Private/internal note visibility if needed

Rules:

- Internal notes are not visible to external customers/leads.
- Staff only see notes attached to records they can access.
- Owners/managers can see broader notes based on permissions.

## Communication Controls

If CRM supports email/SMS:

Permissions:

- View message history
- Draft message
- Send message
- Use approved templates
- Use AI-generated message
- Send bulk message
- Schedule message
- Delete message draft

Safety:

- SMS compliance warnings.
- Opt-out handling.
- Email unsubscribe handling.
- Approval required for bulk sends.
- Approval required for AI-generated campaigns if configured.
- Logs for sent messages.

## Activity Tracking and Audit Logs

Track:

- Login
- Invite accepted
- Role changed
- Permission changed
- Lead viewed
- Lead edited
- Contact created
- Contact edited
- Opportunity moved
- Task completed
- Campaign drafted
- Campaign submitted
- Message sent
- Workflow changed
- AI output generated
- Export performed
- Delete action
- Approval decision

Audit log fields:

- Organization ID
- Staff user ID
- Actor role
- Action type
- Entity type
- Entity ID
- Timestamp
- Old value if available
- New value if available
- IP/device if available
- Source: manual, AI, automation, import, integration

## Staff Performance Analytics

Metrics:

- Leads assigned
- Leads contacted
- Average response time
- Follow-ups completed
- Overdue tasks
- Opportunities created
- Deals won
- Deals lost
- Pipeline value managed
- Campaign drafts created
- Approval pass rate
- Task completion rate
- Notes added
- Calls/messages logged if integrations exist
- No-response lead recovery

Staff personal analytics:

- My tasks completed
- My overdue tasks
- My pipeline value
- My win rate
- My follow-up speed
- My activity history

No fake analytics.

## Seat Limits and Billing Readiness

The architecture should be ready for seat-based plans.

Possible plan constraints:

- Max team members
- Max active staff
- Max AI staff users
- Max managers
- Max campaign editors
- Max monthly AI actions
- Max assigned contacts per staff
- Feature availability by plan

UI behavior:

- If user reaches team seat limit, show upgrade prompt.
- Do not fake billing.
- Use real subscription/plan data when available.
- If plan system is not ready, create data-ready hooks and empty states.

## Owner Controls

Business owner should be able to:

- Invite staff
- Assign roles
- Customize permissions
- Deactivate staff
- Reassign records
- Review staff activity
- Approve/deny staff work
- Set approval rules
- Set AI access rules
- Set notification rules
- View staff performance
- Control data exports
- Control billing access
- Control integration access
- Control destructive permissions
- Set default role for new invites
- Set deactivation behavior

## Team Settings

Organization team settings should include:

- Default role for invited staff
- Default AI access level
- Approval requirement defaults
- Lead assignment rules
- Task notification rules
- Data export settings
- Invite expiration length
- Staff deactivation behavior
- Internal note visibility
- Campaign approval rules
- Workflow approval rules
- High-risk action rules
- Mobile notification defaults

## Mobile Requirements

Staff may work from phones.

Mobile workflows must be responsive:

- View assigned leads
- Add notes
- Complete tasks
- Send follow-up if allowed
- View contact info
- Update opportunity stage
- Accept invite
- Review approval
- Use AI assistant
- View notifications
- Update appointment/job status if supported

## Recommended Pages

- `/crm/team` or equivalent Team Management page
- `/crm/team/invites` or equivalent invite page
- `/crm/team/roles` or equivalent role/permission page
- `/crm/my-work` or equivalent staff dashboard page
- `/crm/my-tasks`
- `/crm/my-leads`
- `/crm/my-opportunities`
- `/crm/approvals`
- `/crm/activity`
- `/crm/team-analytics`
- `/crm/team-settings`
- Invite acceptance auth/public route

Use the existing route conventions in the project.

## Recommended Components

Create or reuse components such as:

- UserStaffPortalShell
- UserStaffSidebar
- UserStaffTopbar
- OrganizationSwitcher
- PermissionGate
- RoleBadge
- ScopeBadge
- TeamMemberCard
- TeamMemberTable
- InviteStaffModal
- RoleEditor
- PermissionMatrix
- StaffDashboardCard
- MyWorkQueue
- AssignmentPanel
- TaskPanel
- ApprovalQueue
- StaffAICopilotPanel
- StaffActivityFeed
- StaffAnalyticsCard
- NotificationBell
- EmptyState

## Database / Entity Planning

Before creating new tables, inspect the existing schema and reuse what exists.

Potential tables/entities:

- organizations
- organization_members
- organization_invites
- organization_roles
- role_permissions
- user_profiles
- contacts
- leads
- opportunities
- tasks
- campaigns
- workflows
- approval_items
- activity_logs
- audit_logs
- staff_assignments
- staff_performance_events
- ai_outputs
- notifications
- team_settings
- organization_billing_limits

Possible `organization_members` fields:

- id
- organization_id
- user_id
- role_id
- status
- invited_by
- joined_at
- last_active_at
- ai_access_level
- created_at
- updated_at

Possible `organization_invites` fields:

- id
- organization_id
- email
- role_id
- invited_by
- token_hash
- status
- expires_at
- accepted_at
- created_at

Possible `role_permissions` fields:

- id
- role_id
- permission_key
- permission_value
- scope
- created_at
- updated_at

Possible `staff_assignments` fields:

- id
- organization_id
- assigned_to_user_id
- assigned_by_user_id
- entity_type
- entity_id
- priority
- status
- due_at
- created_at
- updated_at

Do not force new tables blindly. Inspect existing Supabase schema and implement the minimal compatible extension.

## Supabase / RLS Security

If Supabase is used:

- RLS policies must respect organization membership.
- Staff users should only read/write records in organizations where they are active members.
- Role permissions should restrict access at API/server level.
- Sensitive operations should require server-side checks.
- Inactive/deactivated members should have no access.
- Owner/admin-only operations should be protected server-side.
- Exports should be restricted server-side.
- Destructive actions should be restricted server-side.

## Empty States

Examples:

Team page:

"No team members yet. Invite your first staff member to start collaborating inside your CRM."

My Tasks:

"No assigned tasks yet. When your manager assigns work, it will appear here."

Approvals:

"No approval requests yet. Drafts that need review will appear here."

Analytics:

"Not enough staff activity yet. Performance analytics will appear after your team starts working in the CRM."

## Phase Files

Implement the prompt pack in phases:

1. Foundation, roles, permissions, organization context
2. Team invites and membership
3. Staff dashboard and My Work
4. Assignment and task system
5. Staff approval workflows
6. Staff AI Copilot
7. Activity, analytics, notifications, and audit
8. Mobile, security, seat limits, and polish

## Final Goal

The User Staff Portal should let each SynaptiReach customer run their CRM as a team.

It should support owner oversight, staff productivity, controlled permissions, AI-powered work assistance, safe approvals, activity tracking, and future seat-based pricing while preserving security and data isolation.
EOF
cat > docs/synaptireach-user-staff-prompts/01_user_staff_foundation_roles_permissions.md <<'EOF'
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
EOF
cat > docs/synaptireach-user-staff-prompts/02_team_invites_membership.md <<'EOF'
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
EOF
cat > docs/synaptireach-user-staff-prompts/03_staff_dashboard_my_work.md <<'EOF'
# Phase 3 - Staff Dashboard and My Work

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Build role-aware staff dashboards and a "My Work" command center for each customer-side staff member.

The dashboard must show only real data the current staff member is allowed to access.

## Required Pages

- My Dashboard
- My Work
- My Tasks
- My Leads
- My Opportunities
- My Approvals
- Follow-Up Queue
- Notifications panel or preview

Use existing route conventions.

## Role-Aware Dashboards

### Business Owner Dashboard

Show real data:

- Total leads
- New leads
- Assigned leads
- Unassigned leads
- Pipeline value if permitted/available
- Deals won/lost
- Campaign performance if available
- Staff workload
- Staff performance
- Tasks due
- Overdue tasks
- Approval requests
- AI recommendations
- CRM health indicators
- Follow-up speed
- Missed opportunities

### Manager Dashboard

Show:

- Team leads
- Team opportunities
- Team tasks
- Staff workload
- Overdue follow-ups
- Records needing assignment
- Approval requests
- Campaign drafts
- Workflow issues
- Team performance

### Sales Rep Dashboard

Show:

- My leads
- My opportunities
- Follow-ups due today
- Overdue follow-ups
- Recent contact activity
- Hot leads
- AI next best actions
- Appointments if supported
- Personal pipeline
- Won/lost tracking if allowed

### Appointment Setter Dashboard

Show:

- Leads needing first contact
- Follow-ups due
- Overdue callbacks
- Appointment requests if supported
- Booked appointments if supported
- No-response leads
- AI call/SMS scripts if AI permission allows

### Marketing Assistant Dashboard

Show:

- Campaign drafts
- Content tasks
- Approval status
- Upcoming scheduled campaigns
- Campaign performance if allowed
- AI content suggestions if allowed
- Template library access if allowed

### Technician / Field Staff Dashboard

Show:

- Assigned customers
- Assigned tasks
- Upcoming appointments/jobs if supported
- Customer notes
- Required follow-up
- Completion checklist

## My Work Queue

The My Work page should combine:

- Assigned tasks
- Assigned leads
- Assigned opportunities
- Assigned approvals
- Due today
- Overdue
- High priority
- Recently updated
- Waiting on me
- Waiting on manager/owner

Actions:

- Open record
- Complete task
- Add note
- Update status
- Request help
- Ask AI if allowed
- Submit work for approval if needed

## Follow-Up Queue

For sales and appointment staff, create or prepare a follow-up queue using real CRM data.

Prioritize:

- Due today
- Overdue
- Hot leads
- No recent contact
- New assigned leads
- Stale opportunities
- AI recommended next actions if available

## Empty States

Examples:

- "No assigned work yet. When your manager assigns leads, tasks, or opportunities, they will appear here."
- "No follow-ups due today."
- "No approvals waiting on you."

## Deliverables

- Role-aware staff dashboards.
- My Work page.
- My Tasks page/view.
- My Leads page/view.
- My Opportunities page/view.
- Follow-Up Queue.
- Permission-scoped data loading.
- Clean loading, error, and empty states.
- No fake data.
EOF
cat > docs/synaptireach-user-staff-prompts/04_assignment_task_system.md <<'EOF'
# Phase 4 - Assignment and Task System

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Build the assignment and task system that allows business owners/managers to assign real CRM work to customer-side staff members.

## Assignment System

Assignable entities:

- Leads
- Contacts
- Opportunities
- Tasks
- Campaign drafts
- Workflow drafts
- Appointments if supported
- Jobs/service records if supported
- Follow-up sequences
- Approval items

Assignment fields:

- Organization ID
- Entity type
- Entity ID
- Assigned to user ID
- Assigned by user ID
- Assigned date
- Due date
- Priority
- Status
- Notes
- Reassignment history

## Assignment Features

Build or prepare:

- Assign one record to one staff member.
- Reassign record.
- Bulk assign records.
- Unassigned records queue.
- Claim unassigned record if permitted.
- Round-robin assignment readiness.
- Auto-assign by role readiness.
- Auto-assign by territory readiness.
- Auto-assign by workload readiness.
- Assignment history.
- Assignment notifications.

## Task System

Task types:

- Call lead
- Send follow-up
- Review contact
- Update opportunity
- Prepare estimate
- Book appointment
- Draft campaign
- Review campaign
- Check workflow
- Upload asset
- Internal reminder
- Custom task

Task fields:

- Organization ID
- Title
- Description
- Assigned to
- Created by
- Related contact
- Related lead
- Related opportunity
- Related campaign
- Priority
- Status
- Due date
- Reminder
- Notes
- Attachments if supported
- Completion timestamp

Task statuses:

- New
- Assigned
- In Progress
- Waiting
- Complete
- Overdue
- Canceled
- Archived

## Task Views

Create views for:

- My Tasks
- Team Tasks
- Due Today
- Overdue
- Completed
- Created By Me
- Assigned By Me
- Related to selected contact/lead/opportunity

## Task Actions

Based on permission:

- Create task
- Edit task
- Assign task
- Reassign task
- Complete task
- Reopen task
- Cancel task
- Delete task if explicitly allowed
- Add note/comment
- Add reminder

## Assignment and Permission Rules

- Staff can only see assigned records if their scope is assigned-only.
- Managers can see team records if scope is team-only.
- Owners can see all organization records.
- Staff cannot assign work to users they cannot manage.
- Assignment changes should be logged.
- Bulk assignment should require permission.
- Deleting or mass-changing assignments should require confirmation.

## Deliverables

- Assignment data model/services/hooks as needed.
- Assignment UI/actions on CRM records.
- Unassigned records queue.
- Task system pages/components.
- My Tasks and Team Tasks views.
- Reassignment history.
- Permission and scope enforcement.
- Notifications for assignment/task changes if notification system exists or prepared event hooks if not.
- No fake data.
EOF
cat > docs/synaptireach-user-staff-prompts/05_staff_approval_workflows.md <<'EOF'
# Phase 5 - Staff Approval Workflows

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Build approval workflows for staff-created or high-risk CRM actions inside each customer's organization.

Business owners/managers should be able to approve, deny, revise, or publish work created by staff.

## Approval Item Types

Support or prepare approval items for:

- Email campaign drafts
- SMS campaign drafts
- Workflow changes
- Landing page edits if supported
- Contact imports
- Bulk message sends
- Pipeline changes
- AI-generated campaign content
- AI-generated workflow
- AI-generated outreach
- High-risk record changes
- Bulk exports
- Destructive actions
- Custom approval requests

## Approval Actions

- Submit for approval
- Approve
- Deny
- Request revision
- Edit and approve
- Comment
- Assign reviewer
- Schedule
- Publish
- Archive

## Approval Queue Views

Create views:

- Waiting on me
- Submitted by me
- Waiting on owner/manager
- Needs revision
- Approved
- Denied
- Scheduled/published
- Archived

## Approval Rules

Support approval requirements based on:

- Role
- Permission
- Action type
- Entity type
- Risk level
- AI-generated content
- Bulk action size
- Deal value threshold
- Campaign type
- Workflow activation
- Export/destructive action

Examples:

- Marketing Assistant can draft campaigns but cannot launch.
- Sales Rep can send one-to-one email but not bulk campaign.
- Workflow activation requires owner approval.
- Contact import over 100 records requires approval.
- AI-generated SMS requires approval before sending.
- Bulk export requires owner approval.
- Deleting contacts requires owner approval.
- Marking a high-value opportunity as Won requires manager confirmation.

## Approval Detail Page

Each approval item should show:

- Organization
- Submitted by
- Requested reviewer
- Entity type
- Entity preview
- Current status
- Risk level
- AI-generated flag if applicable
- Diff/changes if available
- Internal comments
- Revision history
- Approval history
- Created date
- Due date if applicable

## Logging

Every approval event should log:

- Actor
- Action
- Timestamp
- Old status
- New status
- Comments/reason
- Entity affected
- Organization ID

## Deliverables

- Approval queue.
- Approval detail view.
- Submit-for-approval flow.
- Approve/deny/revision actions.
- Approval rules structure.
- Staff and manager/owner views.
- Audit logging.
- Permission enforcement.
- No fake approval records.
EOF
cat > docs/synaptireach-user-staff-prompts/06_staff_ai_copilot.md <<'EOF'
# Phase 6 - Staff AI Copilot

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Build or prepare a permission-aware Staff AI Copilot for customer-side staff inside the User CRM.

The AI Copilot should help staff work faster while respecting organization membership, role permissions, data scopes, approval rules, and safety limits.

## AI Access Levels

Support or prepare:

1. No AI Access
2. Basic AI Access
3. Draft AI Access
4. Assisted Action Access
5. Full AI Access within organization scope

## AI Capabilities

Based on permissions, AI can help staff:

- Summarize contacts.
- Summarize leads.
- Summarize opportunities.
- Draft follow-up emails.
- Draft follow-up SMS.
- Generate call scripts.
- Recommend next best actions.
- Explain pipeline status.
- Draft campaign content.
- Draft internal notes.
- Suggest tasks.
- Identify stale leads.
- Prepare appointment notes.
- Prioritize assigned work.
- Create safe drafts for owner approval.
- Suggest workflow ideas without activating them.
- Rewrite messages using business tone.
- Create objection-handling responses.
- Generate meeting prep summaries.

## Context Rules

AI should only use context the staff member is allowed to access.

Context sources may include:

- Assigned leads
- Assigned contacts
- Assigned opportunities
- Assigned tasks
- Accessible campaign drafts
- Accessible workflow drafts
- Organization-approved templates
- Business profile/context
- Staff role and permissions
- Prior AI outputs if accessible

AI must not access:

- Other organizations.
- Records outside staff scope.
- Billing information unless permitted.
- Sensitive fields unless permitted.
- Owner-only analytics unless permitted.
- SynaptiReach internal admin data.

## Safe Actions

AI can generate drafts, but high-impact actions should require approval.

AI should not directly:

- Send messages without permission.
- Launch campaigns without approval.
- Activate workflows without approval.
- Delete records.
- Export data.
- Change billing.
- Change roles/permissions.
- Access restricted data.

## AI UI Requirements

Create or prepare:

- StaffAICopilotPanel
- Record-aware AI sidebar
- My Work AI assistant
- Prompt suggestions
- Context display
- AI output card
- Save draft
- Submit for approval
- Copy output
- Create task from output
- Add note from output if permitted
- View AI history if permitted

## AI Output Logging

Track:

- Organization ID
- Staff user ID
- Prompt/action type
- Context entity type
- Context entity ID
- Output summary
- Created date
- Approval status if needed
- Applied action if any

Do not store sensitive prompt/output data in an unsafe way. Follow existing app patterns.

## AI Empty/Unavailable States

If AI backend is not implemented:

- Create UI and service abstraction ready for real AI calls.
- Show clean unavailable state.
- Do not fake AI answers.

Example:

"AI Copilot is not connected yet. Once AI is enabled for your organization, permitted staff can use it for summaries, follow-ups, and next-best-action suggestions."

## Deliverables

- Permission-aware Staff AI Copilot UI.
- AI access level support.
- Context-safe AI service abstraction.
- Draft/approval routing for AI outputs.
- AI history/logging readiness.
- Empty/unavailable states.
- No fake AI results.
EOF
cat > docs/synaptireach-user-staff-prompts/07_activity_analytics_notifications_audit.md <<'EOF'
# Phase 7 - Activity, Analytics, Notifications, and Audit

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Build activity tracking, staff analytics, notifications, and audit visibility for customer-side team operations.

Business owners and managers should understand what their team is doing without exposing data to unauthorized staff.

## Activity Tracking

Track real staff activity such as:

- Login
- Invite accepted
- Role changed
- Permission changed
- Lead viewed
- Lead edited
- Contact created
- Contact edited
- Opportunity moved
- Task created
- Task completed
- Campaign drafted
- Campaign submitted
- Message drafted
- Message sent
- Workflow changed
- AI output generated
- Export performed
- Delete action
- Approval decision
- Assignment changed

## Activity Feed

Create scoped activity feeds:

- My Activity
- Team Activity
- Record Activity
- Organization Activity for owner/admin

Activity feed fields:

- Actor
- Action
- Entity type
- Entity name/summary if allowed
- Timestamp
- Source
- Metadata if available

## Audit Logs

Audit logs should be more security-focused.

Track:

- Role changes
- Permission changes
- Invite changes
- Deactivation/reactivation
- Data exports
- Destructive actions
- Bulk actions
- Approval decisions
- AI high-impact actions
- Integration-setting changes
- Billing access changes

Audit log filters:

- Staff member
- Action type
- Entity
- Date range
- Risk level
- Source

Audit logs should be read-only for most users.

## Staff Performance Analytics

Use real data only.

Metrics may include:

- Leads assigned
- Leads contacted
- Average response time
- Follow-ups completed
- Overdue tasks
- Opportunities created
- Deals won
- Deals lost
- Pipeline value managed if allowed
- Campaign drafts created
- Approval pass rate
- Task completion rate
- Notes added
- Calls/messages logged if integrations exist
- No-response lead recovery

Staff personal analytics:

- My tasks completed
- My overdue tasks
- My pipeline value if allowed
- My win rate if data exists
- My follow-up speed
- My activity history

## Notifications

Create or prepare an in-app notification system for:

- New lead assigned
- Task assigned
- Task due soon
- Task overdue
- Opportunity moved
- Approval requested
- Approval approved
- Approval denied
- Revision requested
- Comment/mention
- Campaign scheduled
- Workflow issue
- New message/reply
- Record reassigned
- AI recommendation available
- Invite accepted
- Staff deactivated
- High-risk permission granted
- Bulk export attempted

Notification views:

- Notification bell/menu
- Notification list
- Mark as read
- Mark all as read
- Notification preferences if feasible

## Empty States

Examples:

- "No team activity yet."
- "No staff performance data yet. Analytics will appear after your team starts working in the CRM."
- "No notifications."

## Deliverables

- Activity feed.
- Audit log view.
- Staff analytics views.
- Notification system or notification-ready event hooks.
- Permission-scoped visibility.
- Real data only.
- No fake charts or metrics.
EOF
cat > docs/synaptireach-user-staff-prompts/08_mobile_security_seat_limits_polish.md <<'EOF'
# Phase 8 - Mobile, Security, Seat Limits, and Production Polish

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Harden the User Staff Portal for production readiness, mobile workflows, data security, and future billing/seat-limit support.

## Mobile Requirements

Ensure the following workflows are responsive and usable on phones:

- Accept team invite.
- Switch organization if multiple memberships exist.
- View My Work.
- View assigned leads.
- Add notes.
- Complete tasks.
- Send or draft follow-up if allowed.
- View contact info.
- Update opportunity stage if allowed.
- Review approval.
- Use Staff AI Copilot.
- View notifications.
- Update appointment/job status if supported.
- Reassign work if manager/owner.

Mobile UI should be fast, clean, and not cramped.

## Security Hardening

Review and harden:

- Organization-level data isolation.
- Server-side permission checks.
- Client-side permission rendering.
- Supabase RLS policies if used.
- Deactivated user access.
- Invite token expiration.
- Invite token revocation.
- Role/permission change logging.
- Export restrictions.
- Destructive action restrictions.
- Billing access restrictions.
- AI context restrictions.
- Integration access restrictions.
- Cross-organization switching.

Do not rely only on hiding UI buttons.

## Seat Limit Readiness

Prepare architecture for future seat-based plans.

Possible limits:

- Max team members.
- Max active staff.
- Max AI-enabled staff.
- Max managers.
- Max campaign editors.
- Max monthly AI actions.
- Max assigned contacts per staff.
- Feature availability by plan.

Behavior:

- Use real plan/subscription data if available.
- If plan data is unavailable, create data-ready hooks and clean empty states.
- Do not fake billing.
- Do not hardcode fake limits unless using explicit configuration constants documented as defaults.
- Show upgrade prompt only if real plan/limit data supports it or behind clearly named placeholder-free capability checks.

## Quality Checks

Run or prepare:

- Typecheck.
- Lint.
- Build.
- Route smoke test.
- Permission smoke test.
- Empty state review.
- Mobile responsive review.
- No mock data review.
- No fake analytics review.
- No cross-organization leak review.
- Existing User CRM regression check.

## Loading and Error States

Every User Staff feature should have:

- Loading state.
- Error state.
- Empty state.
- Permission denied state.
- Deactivated membership state.
- Invite expired state.
- Invite canceled state.

## Accessibility

Add reasonable accessibility basics:

- Keyboard-accessible dialogs/buttons.
- Proper labels.
- Focus states.
- Sufficient contrast.
- Clear status messages.
- Responsive text layout.

## Final Deliverables

- Mobile polish.
- Security hardening.
- Seat limit readiness.
- Permission regression review.
- Empty/loading/error states.
- Production readiness checklist.
- Existing User CRM remains intact.
- No fake data.
EOF
echo 'SynaptiReach User Staff Portal prompt pack installed in docs/synaptireach-user-staff-prompts'
