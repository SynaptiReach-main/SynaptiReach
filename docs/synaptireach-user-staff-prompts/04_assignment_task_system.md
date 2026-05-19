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
