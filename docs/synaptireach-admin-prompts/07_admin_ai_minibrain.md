# Phase 7 - Admin AI Assistant and Mini-Brain

Use the instructions from `00_master_admin_portal_prompt.md`.

## Goal

Build the SynaptiReach Admin AI Assistant and Admin Mini-Brain interface.

## Admin AI Assistant Purpose

The Admin AI Assistant is the internal operations AI for SynaptiReach.

It should help the owner/admin:

- Manage clients
- Review accounts
- Create service deliverables
- Audit CRM usage
- Find growth opportunities
- Detect client risk
- Prioritize tasks
- Summarize accounts
- Generate campaign strategy
- Create workflows
- Draft emails/SMS
- Create landing page copy
- Review funnel performance
- Find prospects
- Write outreach
- Prepare service checklists
- Suggest upsells
- Create reports
- Detect churn risk
- Recommend next best actions

## AI Modes

Support these AI modes:

1. Command Mode
2. Strategy Mode
3. Fulfillment Mode
4. Intelligence Mode
5. Automation Builder Mode
6. Client Finder Mode
7. Quality Control Mode

## AI Interface Requirements

- Chat-style interface
- Mode selector
- Client context selector
- Service context selector
- Staff/task context selector where applicable
- Prompt/action suggestions
- Output preview
- Save output
- Send output to approval queue
- Convert output into task
- Convert output into service deliverable
- Convert output into template where applicable
- AI history/logs if supported
- Context panel showing what data the AI is using

## Mini-Brain Should Organize

- SynaptiReach service knowledge
- Pricing
- Fulfillment processes
- Client memory
- Staff memory where appropriate
- Client preferences
- Campaign learnings
- Approval patterns
- Denial reasons
- Best-performing templates
- Industry playbooks
- Sales objections
- Outreach strategies
- Upsell patterns
- Workflow recommendations

## Mini-Brain Features

- Internal memory per client
- Internal memory per service
- Internal knowledge base
- Best practices library
- Prompt library
- Campaign performance memory
- Offer intelligence database
- Industry playbooks
- Approval pattern learning
- Denial reason tracking
- Workflow recommendation engine
- Upsell recommendation engine
- Client health prediction
- Churn risk prediction
- Lead quality prediction

## Requirements

- Do not fake AI results.
- If AI backend is not implemented, create clean interfaces and UI states ready for real AI calls.
- AI should use real selected client/service/context when available.
- Show what context the AI is using.
- Add approval flow for AI-generated actions.
- AI should not perform destructive actions without confirmation.
- Owner-only AI tools should not be available to staff unless permitted.
- Staff AI Copilot should only access assigned client/task context.
- Add saved AI outputs if supported.
- Add AI history/logs if supported.

## Deliverable

Deliver Admin AI Assistant UI, AI mode system, Mini-Brain knowledge interface, saved outputs, approval integration, context panel, and real-data-ready AI service abstraction.
