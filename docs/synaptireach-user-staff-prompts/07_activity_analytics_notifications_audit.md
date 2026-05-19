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
