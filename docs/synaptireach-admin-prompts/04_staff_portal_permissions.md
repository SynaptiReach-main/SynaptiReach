# Phase 4 - Admin Staff Portal and Permissions

Use the instructions from `00_master_admin_portal_prompt.md`.

## Goal

Build the SynaptiReach Admin Staff Portal and role-based permission system.

Staff should get a restricted execution workspace where they can complete assigned client work, use approved tools, submit work for approval, and manage assigned tasks without accessing owner-only controls.

## Roles to Support

- Owner
- Super Admin
- Admin Manager
- Staff Manager
- Marketing Specialist
- AI Specialist
- CRM Specialist
- SEO Specialist
- GMB Specialist
- Designer
- Copywriter
- Sales / Client Finder
- Support Agent
- Read-Only Auditor
- Contractor

## Permission Categories

- View users
- Edit users
- Enter user CRM
- View assigned clients
- Manage campaigns
- Manage workflows
- Manage service orders
- Manage tasks
- Manage approvals
- Use AI tools
- Use client finder
- View revenue
- Manage billing
- Manage staff
- Manage templates
- Manage knowledge base
- Manage integrations
- Export data
- Delete data
- View audit logs
- Manage settings

## Staff Dashboard

Show real data for:

- Assigned clients
- Assigned service orders
- Assigned tasks
- Tasks due today
- Overdue tasks
- Approval items
- Work waiting on client
- Work waiting on admin
- AI recommendations for assigned work

## Assignment System

Owner/admin should be able to assign:

- Clients to staff
- Tasks to staff
- Service orders to staff
- Campaign work to staff
- Workflow work to staff
- Approval items to reviewers
- Prospect outreach to sales staff

## Staff Capabilities

Staff can:

- Work assigned service orders
- Use permitted tools
- Submit work for approval
- Request missing information
- Leave internal notes
- View relevant client context
- Use Staff AI Copilot only within permitted scope

Staff cannot:

- Access owner-only tools unless permitted
- View global revenue unless permitted
- Access unassigned users unless permitted
- Impersonate users unless explicitly permitted
- Delete sensitive records unless explicitly permitted

## Requirements

- Staff only see records assigned to them unless permission says otherwise.
- Every staff action should be auditable.
- Owner can manage staff roles and assignments.
- Add clean empty states.
- Use real data only.

## Deliverable

Deliver staff roles, permissions, staff portal dashboard, assignment system, restricted navigation, and audit-ready staff actions.
