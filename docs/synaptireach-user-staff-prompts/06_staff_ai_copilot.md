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
