# SynaptiReach Admin Portal Prompt Pack

Use this folder as the Codex-readable prompt source for building the SynaptiReach Admin Portal and Admin Staff Portal.

## Recommended Reading Order

1. `00_master_admin_portal_prompt.md`
2. `01_admin_foundation_layout.md`
3. `02_user_management_impersonation.md`
4. `03_admin_command_center.md`
5. `04_staff_portal_permissions.md`
6. `05_global_approval_denial.md`
7. `06_service_fulfillment_engine.md`
8. `07_admin_ai_minibrain.md`
9. `08_client_finder_prospect_discovery.md`
10. `09_revenue_proposals_packages.md`
11. `10_templates_kb_reports_integrations_audit.md`

## How To Use With Codex

Tell Codex:

```text
Read the files in docs/synaptireach-admin-prompts.
Start with 00_master_admin_portal_prompt.md.
Then implement the current phase file I specify.
Follow the no-mock-data rules exactly.
Preserve the existing User CRM.
Use real data and clean empty states only.
```

## Continuation Prompt

```text
Continue building the SynaptiReach Admin Portal using the instructions in docs/synaptireach-admin-prompts.

Read 00_master_admin_portal_prompt.md first, then implement the next incomplete phase.

Do not use mock data, hardcoded data, fake users, fake analytics, fake prospects, fake service orders, fake revenue, or simulated CRM records.

Use real app state, real database structures, real authenticated users, real permissions, and clean empty states when data is unavailable.

Preserve the existing SynaptiReach design system and do not break the existing User CRM.
```
