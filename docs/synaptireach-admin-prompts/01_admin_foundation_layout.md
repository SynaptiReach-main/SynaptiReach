# Phase 1 - Admin Portal Foundation and Layout

Use the instructions from `00_master_admin_portal_prompt.md`.

## Goal

Build the foundational layout, routing, and navigation structure for the SynaptiReach Admin Portal and Admin Staff Portal.

## Objectives

1. Create the main Admin Portal shell.
2. Create the Admin Staff Portal shell.
3. Add secure role-aware navigation.
4. Add dashboard-ready pages with real-data empty states.
5. Create reusable admin UI components.
6. Do not use fake or hardcoded data.

## Admin Portal Navigation

Create routes/pages for:

- Command Center
- Users / Clients
- Enter User CRM
- Service Orders
- Approvals
- Tasks
- Staff
- Campaigns
- Workflows
- AI Assistant
- Mini-Brain
- Client Finder
- Prospects
- Proposals
- Packages
- Revenue
- Analytics
- Reports
- Templates
- Knowledge Base
- Integrations
- Audit Logs
- Settings

## Admin Staff Portal Navigation

Create routes/pages for:

- My Dashboard
- My Clients
- My Tasks
- My Service Orders
- My Approvals
- Campaign Tools
- Workflow Tools
- Content Tools
- AI Copilot
- Knowledge Base
- Reports

## Required Components

Create reusable components if they do not already exist:

- AdminSidebar
- AdminTopbar
- AdminPageHeader
- AdminMetricCard
- AdminActionCard
- AdminEmptyState
- AdminStatusBadge
- AdminDataTable
- AdminCommandPanel
- AdminSectionCard
- AdminFilterBar
- AdminPermissionGate

## Requirements

- Use existing authentication/session logic if available.
- Add role-based route protection.
- Owner/Super Admin can access everything.
- Staff users only see allowed sections.
- Add clean empty states when no real data exists.
- Do not create fake sample records.
- Do not create mock dashboards with fake numbers.
- If database tables or API endpoints are missing, create clean interfaces/hooks/services ready for real data.
- Keep the UI dark, premium, high-tech, and consistent with SynaptiReach branding.
- Make the layout responsive.

## Deliverable

Deliver a working admin shell with all core routes, layouts, navigation, permission placeholders, empty states, and reusable admin components.
