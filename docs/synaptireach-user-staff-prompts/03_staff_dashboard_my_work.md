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
