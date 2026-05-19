# Phase 9 - Revenue, Proposals, and Package Builder

Use the instructions from `00_master_admin_portal_prompt.md`.

## Goal

Build the SynaptiReach Revenue Command Center, Proposal Builder, and Service Package Builder.

## Revenue Command Center

Show real data for:

- MRR
- ARR
- One-time service revenue
- Monthly service revenue
- Average revenue per user
- Client lifetime value if available
- Churn if available
- New subscriptions
- Canceled subscriptions
- Failed payments
- Open invoices
- Revenue by service
- Revenue by client
- Revenue by staff-supported work if available
- Most profitable services if data is available

## Revenue Actions

Support where backend/integrations allow:

- View invoice
- Mark service paid
- Issue refund only if supported and permitted
- Change plan
- Add manual service order
- Create package
- Generate proposal
- Track unpaid balances

## Proposal Builder

Proposal fields:

- Prospect/client selection
- Problem summary
- Recommended services
- Expected outcomes
- Timeline
- Pricing
- Deliverables
- Terms
- Approval status
- Payment link if available
- Internal notes
- Client-facing summary

Proposal actions:

- Save draft
- Submit for approval
- Send to client if supported
- Convert approved proposal into service order
- Convert prospect into client
- Save as proposal template

## Package Builder

Package fields:

- Selected services
- One-time services
- Monthly services
- Discount
- Total price
- Monthly price
- Proposal copy
- Client-facing summary
- Internal fulfillment plan
- AI-generated recommendation reason
- Save as template
- Send for approval

## Example Packages to Support

- Local Growth Starter
- CRM Setup + Workflow Setup
- GMB Optimization + Local SEO
- AI Funnel Optimization + Email Campaign
- Landing Page + Funnel Copywriting
- Social Growth Monthly
- Full Marketing Automation Setup

## Requirements

- Do not fake revenue.
- Do not fake invoices.
- Do not fake proposals.
- Use real billing/order data when available.
- If billing integration does not exist, create interfaces ready for real data.
- Admin can manually create packages.
- Admin can convert prospect recommendations into proposals.
- Admin can convert approved proposals into service orders.
- Add clean empty states.
- Add audit logging for billing/proposal actions.

## Deliverable

Deliver revenue dashboard, proposal builder, package builder, and service-order conversion flow.
