# Phase 3 - Admin Command Center Dashboard

Use the instructions from `00_master_admin_portal_prompt.md`.

## Goal

Build the SynaptiReach Admin Command Center.

The Command Center is the owner's main dashboard for controlling the entire SynaptiReach business.

## Dashboard Sections

### 1. Business Overview

Use real data to show:

- Total users
- Active users
- New signups
- Paying users
- Trial users
- Canceled users
- At-risk clients
- Recently active clients
- Low-activity clients

### 2. Revenue Overview

Use real data to show:

- MRR if available
- ARR if available
- One-time service revenue
- Monthly service revenue
- Open invoices
- Failed payments
- Revenue by service
- Revenue by client
- Top services by revenue

### 3. Operations Overview

Use real data to show:

- New service orders
- Active service orders
- Overdue service orders
- Staff workload
- Tasks due today
- Blocked tasks
- Work waiting on clients
- Work waiting on admin

### 4. Approval Overview

Use real data to show:

- Pending approvals
- Denied items
- Revision requests
- Items waiting on client
- Items waiting on admin
- AI-generated items pending review

### 5. CRM/System Health

Use real data to show:

- Failed workflows
- Failed automations
- Integration issues
- Data sync issues
- Low-activity clients
- Accounts needing attention
- Campaigns with issues

### 6. Growth Opportunities

Use real data to show:

- Upsell opportunities
- Client Finder leads
- Prospects ready for outreach
- Clients needing service recommendations
- At-risk clients needing retention

### 7. AI Recommendations

Show real AI-backed recommendations when available:

- Next best actions
- Client risk alerts
- Service opportunities
- Internal workflow suggestions
- Staff bottleneck warnings

## Required Features

- Every metric must come from real data.
- If data does not exist, show empty state.
- Every card should be clickable and route to the relevant page.
- Add filters:
  - Date range
  - Client
  - Staff member
  - Service type
  - Status
- Add a high-tech Opportunity Radar feed.
- Add a command-style action panel for quick admin actions.
- Add loading/error states.
- Do not use fake numbers.
- Do not hardcode demo metrics.

## Deliverable

Deliver a real-data-ready Admin Command Center with actionable cards, alerts, filters, Opportunity Radar, command panel, and empty states.
