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
