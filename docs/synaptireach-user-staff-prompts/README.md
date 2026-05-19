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
