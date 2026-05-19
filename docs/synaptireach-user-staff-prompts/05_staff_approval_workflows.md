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
