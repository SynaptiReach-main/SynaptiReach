# Phase 6 - Service Fulfillment Engine

Use the instructions from `00_master_admin_portal_prompt.md`.

## Goal

Build the SynaptiReach Service Fulfillment Engine.

The system must support every SynaptiReach service as a real fulfillment workflow.

## Services

### Marketing Services - Execution

- Email Campaign - $149
- SMS Campaign - $179
- Landing Page - $399
- Workflow Setup - $249
- CRM Setup - $399

### Marketing Services - Strategy

- Offer Optimization - $249
- Funnel Copywriting - $399
- Lead Magnet Creation - $299
- A/B Testing - $249
- Conversion Audit - $299

### Advanced

- Customer Journey Mapping - $499
- Segmentation Strategy - $399
- Retargeting Setup - $499

### AI Services

- AI Campaign Strategy - $399
- AI Persona Modeling - $349
- AI Funnel Optimization - $499

### Branding & SEO

- Logo Design - $249
- Branding Kit - $599
- SEO Optimization - $499
- Local SEO - $399

### Social & GMB

- Social Media Management - $599/mo
- Content Calendar - $249
- GMB Optimization - $299
- GMB Monthly Management - $299/mo

## Each Service Order Should Have

- Service order page
- Intake section
- Internal brief
- Client context
- Assigned staff
- Status
- Priority
- Due date
- Checklist
- AI assistant panel
- Deliverables
- Approval flow
- Revision history
- Internal notes
- Client-facing notes
- Files/assets if supported
- Completion button
- Upsell recommendation
- Report/export if applicable

## Service Statuses

- New
- Intake Needed
- Assigned
- In Progress
- Waiting on Client
- Waiting on Admin
- Needs Revision
- Ready for Approval
- Approved
- Scheduled
- Delivered
- Complete
- Blocked
- Archived

## Service Workflow Requirements

- When a service order is created, generate or attach the correct workflow/checklist.
- Admin can manually create a service order for a client.
- Admin can assign service work to staff.
- Staff can work assigned service orders.
- Staff submits deliverables for approval.
- Admin approves, denies, or requests revision.
- AI should assist with each service type.
- Completion should update the service order state.
- Completed service orders should support report/export where applicable.

## Data Requirements

- Do not fake service orders.
- Use real purchases/orders if available.
- If no order system exists yet, create data-ready structures and empty states.
- Do not hardcode client/service work.
- Use the actual SynaptiReach service/pricing list.

## Deliverable

Deliver a service fulfillment operating system that supports all listed services with reusable workflow architecture, service order views, checklists, staff assignment, AI assistance hooks, approval flow, and empty states.
