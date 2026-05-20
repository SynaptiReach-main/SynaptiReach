# SynaptiReach Codex Prompt Reading Roadmap

Use this file when moving from ChatGPT planning into Codex implementation.

This roadmap tells Codex what prompt packs to read, what order to read them in, and how to proceed through the SynaptiReach build without losing context.

---

## Global Rule

Before implementing any phase, Codex must inspect the existing SynaptiReach codebase first.

Read and understand:

- `package.json`
- app/router structure such as `app/`, `src/`, `pages/`, or `routes/`
- existing CRM pages/components
- existing onboarding pages/components
- existing auth/session logic
- existing Supabase client/config files
- database/migration/schema files if present
- shared components
- design system components
- existing docs folder
- existing environment variable usage
- existing API/server actions/hooks/services

Do not make changes until you understand:

- routing structure
- authentication flow
- database access pattern
- current User CRM implementation status
- current onboarding implementation status
- existing SynaptiReach styling/design conventions
- whether data is real, empty, or missing

Always preserve the existing SynaptiReach design system.

Never use mock data, hardcoded demo users, fake analytics, fake CRM records, fake prospects, fake revenue, fake service orders, fake staff, or simulated data.

Use real app state, real database records, real authenticated users, real permissions, and clean empty states when data is unavailable.

---

# Master Implementation Order

Implement the prompt systems in this order:

1. User CRM v9
2. Onboarding
3. User Staff Portal
4. Admin/Admin Staff Portal
5. Billing / Pricing / Landing Page Final Polish
6. Database / Supabase Schema Hardening
7. Integrations
8. Local AI / Local Connector
9. Mobile / Responsive / PWA Polish
10. Testing / QA / Bug Sweep
11. Final Launch / Production Hardening
12. Documentation / Internal Handoff

This order is intentional.

The User CRM should come first because it is the core product experience. Onboarding should come next because it feeds real setup data into the CRM. User Staff Portal and Admin Portal build on top of the CRM foundation. Billing, database, integrations, local connector, mobile polish, QA, production hardening, and documentation should come after the core product systems are stable.

---

# 1. User CRM v9

## Purpose

Build and stabilize the main customer-facing SynaptiReach CRM experience.

This is the highest priority product layer.

## What Codex should read

Look for User CRM prompt files in `docs/`.

Search for files/folders containing names such as:

- `user-crm`
- `crm-v9`
- `user-crm-v9`
- `synaptireach-user-crm`
- `crm prompt`
- `v9`

Suggested PowerShell discovery command:

```powershell
Get-ChildItem docs -Recurse -File -Include *.md | Where-Object { $_.FullName -match "user|crm|v9" } | Select-Object FullName
```

Suggested Termux/Linux discovery command:

```bash
find docs -type f -name "*.md" | grep -Ei "user|crm|v9"
```

## Read order

If a User CRM prompt pack exists, read in this order:

1. `README.md`
2. any file beginning with `00_`
3. any file beginning with `01_`
4. continue numerically through the remaining phase files
5. any final checklist, polish, QA, or continuation file

## Codex starter prompt

```text
Read the User CRM v9 prompt files in docs.

Start with the master or 00 file, then Phase 1.

Implement the User CRM v9 work first.

Do not use mock data, hardcoded data, fake users, fake analytics, fake leads, fake contacts, fake opportunities, fake campaigns, fake revenue, or simulated CRM records.

Use real app state, real database structures, real authenticated users, real CRM records, and clean empty states when data is unavailable.

Preserve the existing SynaptiReach design system.
```

---

# 2. Onboarding

## Purpose

Build and stabilize the onboarding flow that collects real business setup data and routes users into the correct CRM experience.

## What Codex should read

Look for onboarding prompt files in `docs/`.

Search for files/folders containing names such as:

- `onboarding`
- `setup`
- `business-intake`
- `intake`
- `wizard`

Suggested PowerShell discovery command:

```powershell
Get-ChildItem docs -Recurse -File -Include *.md | Where-Object { $_.FullName -match "onboarding|setup|intake|wizard" } | Select-Object FullName
```

Suggested Termux/Linux discovery command:

```bash
find docs -type f -name "*.md" | grep -Ei "onboarding|setup|intake|wizard"
```

## Read order

If an onboarding prompt pack exists, read in this order:

1. `README.md`
2. any file beginning with `00_`
3. any file beginning with `01_`
4. continue numerically through the remaining phase files
5. any final checklist, polish, QA, or continuation file

## Codex starter prompt

```text
Read the onboarding prompt files in docs.

Start with the master or 00 file, then Phase 1.

Implement the onboarding work after the User CRM foundation is stable.

Do not use mock data, hardcoded onboarding answers, fake users, fake businesses, fake setup records, or simulated onboarding data.

Use real app state, real authenticated users, real business profile records, real onboarding records, and clean empty states when data is unavailable.

Preserve the existing SynaptiReach design system and do not break the User CRM.
```

---

# 3. User Staff Portal

## Purpose

Build the customer-facing staff portal inside each user's CRM.

This is for the customer's own team members, not SynaptiReach internal staff.

Example customer staff roles:

- Business owner
- Business admin
- Manager
- Sales rep
- Appointment setter
- Office admin
- Marketing assistant
- Technician / field staff
- Read-only user
- Contractor

## Folder

`docs/synaptireach-user-staff-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-user-staff-prompts/README.md`
2. `docs/synaptireach-user-staff-prompts/00_master_user_staff_portal_prompt.md`
3. `docs/synaptireach-user-staff-prompts/01_user_staff_foundation_roles_permissions.md`
4. `docs/synaptireach-user-staff-prompts/02_team_invites_membership.md`
5. `docs/synaptireach-user-staff-prompts/03_staff_dashboard_my_work.md`
6. `docs/synaptireach-user-staff-prompts/04_assignment_task_system.md`
7. `docs/synaptireach-user-staff-prompts/05_staff_approval_workflows.md`
8. `docs/synaptireach-user-staff-prompts/06_staff_ai_copilot.md`
9. `docs/synaptireach-user-staff-prompts/07_activity_analytics_notifications_audit.md`
10. `docs/synaptireach-user-staff-prompts/08_mobile_security_seat_limits_polish.md`

Do not read or run `install_synaptireach_user_staff_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

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

---

# 4. Admin/Admin Staff Portal

## Purpose

Build the SynaptiReach owner/admin operating system and SynaptiReach internal staff portal.

This is for the SynaptiReach business itself, not customer teams.

## Folder

`docs/synaptireach-admin-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-admin-prompts/README.md`
2. `docs/synaptireach-admin-prompts/00_master_admin_portal_prompt.md`
3. `docs/synaptireach-admin-prompts/01_admin_foundation_layout.md`
4. `docs/synaptireach-admin-prompts/02_user_management_impersonation.md`
5. `docs/synaptireach-admin-prompts/03_admin_command_center.md`
6. `docs/synaptireach-admin-prompts/04_staff_portal_permissions.md`
7. `docs/synaptireach-admin-prompts/05_global_approval_denial.md`
8. `docs/synaptireach-admin-prompts/06_service_fulfillment_engine.md`
9. `docs/synaptireach-admin-prompts/07_admin_ai_minibrain.md`
10. `docs/synaptireach-admin-prompts/08_client_finder_prospect_discovery.md`
11. `docs/synaptireach-admin-prompts/09_revenue_proposals_packages.md`
12. `docs/synaptireach-admin-prompts/10_templates_kb_reports_integrations_audit.md`

Do not read or run `install_synaptireach_admin_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-admin-prompts.

Start with:
- 00_master_admin_portal_prompt.md
- 01_admin_foundation_layout.md

Implement Phase 1 first.

Do not use mock data, hardcoded data, fake users, fake analytics, fake prospects, fake service orders, fake revenue, or simulated CRM records.

Use real app state, real database structures, real authenticated users, real permissions, and clean empty states when data is unavailable.

Preserve the existing SynaptiReach design system and do not break the existing User CRM.
```

---

# 5. Billing / Pricing / Landing Page Final Polish

## Purpose

Polish the public monetization flow: landing page, pricing, free trial rules, billing consent, checkout, service catalog, and public-page QA.

## Folder

`docs/synaptireach-billing-pricing-landing-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-billing-pricing-landing-prompts/README.md`
2. `docs/synaptireach-billing-pricing-landing-prompts/00_master_billing_pricing_landing_prompt.md`
3. `docs/synaptireach-billing-pricing-landing-prompts/01_landing_page_conversion_polish.md`
4. `docs/synaptireach-billing-pricing-landing-prompts/02_pricing_trials_plan_logic.md`
5. `docs/synaptireach-billing-pricing-landing-prompts/03_checkout_billing_consent.md`
6. `docs/synaptireach-billing-pricing-landing-prompts/04_service_catalog_offers.md`
7. `docs/synaptireach-billing-pricing-landing-prompts/05_final_public_page_qa.md`

Do not read or run `install_synaptireach_billing_pricing_landing_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-billing-pricing-landing-prompts.

Start with:
- 00_master_billing_pricing_landing_prompt.md
- 01_landing_page_conversion_polish.md

Implement Phase 1 first.

Do not use fake pricing, fake plans, fake billing state, fake checkout state, fake testimonials, fake revenue, or simulated payment data.

Use real app state, real pricing configuration, real subscription/billing structures where available, and clean empty states when data is unavailable.

Preserve the existing SynaptiReach design system and do not break the User CRM, onboarding, User Staff Portal, or Admin Portal.
```

---

# 6. Database / Supabase Schema Hardening

## Purpose

Audit and harden the real database structure, Supabase schema, RLS policies, constraints, indexes, migrations, seed defaults, and operational checks.

## Folder

`docs/synaptireach-database-supabase-hardening-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-database-supabase-hardening-prompts/README.md`
2. `docs/synaptireach-database-supabase-hardening-prompts/00_master_database_supabase_hardening_prompt.md`
3. `docs/synaptireach-database-supabase-hardening-prompts/01_schema_inventory_entity_map.md`
4. `docs/synaptireach-database-supabase-hardening-prompts/02_rls_permissions_data_isolation.md`
5. `docs/synaptireach-database-supabase-hardening-prompts/03_constraints_indexes_integrity.md`
6. `docs/synaptireach-database-supabase-hardening-prompts/04_migrations_seed_defaults_no_fake_data.md`
7. `docs/synaptireach-database-supabase-hardening-prompts/05_backup_recovery_operational_checks.md`

Do not read or run `install_synaptireach_database_supabase_hardening_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-database-supabase-hardening-prompts.

Start with:
- 00_master_database_supabase_hardening_prompt.md
- 01_schema_inventory_entity_map.md

Implement Phase 1 first.

Inspect the current Supabase schema, migrations, database helpers, RLS policies, auth tables, organization/user relationships, CRM tables, and service-related tables before making changes.

Do not create fake records, fake seed data, fake users, fake CRM records, fake analytics, or simulated data.

Use real schema changes, safe migrations, real constraints, real indexes, real RLS policies, and clean defaults only.

Preserve the existing SynaptiReach app behavior and do not break the User CRM.
```

---

# 7. Integrations

## Purpose

Build integration registry, settings, email/SMS/calendar/CRM integrations, Google/GMB/SEO/social integration readiness, webhooks, sync logs, error handling, security, and rate-limit foundations.

## Folder

`docs/synaptireach-integrations-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-integrations-prompts/README.md`
2. `docs/synaptireach-integrations-prompts/00_master_integrations_prompt.md`
3. `docs/synaptireach-integrations-prompts/01_integration_registry_settings.md`
4. `docs/synaptireach-integrations-prompts/02_email_sms_calendar_crm_integrations.md`
5. `docs/synaptireach-integrations-prompts/03_google_gmb_seo_social_integrations.md`
6. `docs/synaptireach-integrations-prompts/04_webhooks_sync_logs_error_handling.md`
7. `docs/synaptireach-integrations-prompts/05_security_rate_limits_production_polish.md`

Do not read or run `install_synaptireach_integrations_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-integrations-prompts.

Start with:
- 00_master_integrations_prompt.md
- 01_integration_registry_settings.md

Implement Phase 1 first.

Do not use fake connected accounts, fake API responses, fake sync logs, fake integration health, fake email/SMS/calendar data, or simulated external records.

Use real integration configuration, real environment variables, real API clients where available, safe disconnected states, and clean empty states when integrations are not configured.

Preserve the existing SynaptiReach design system and do not break the User CRM, onboarding, User Staff Portal, Admin Portal, billing, or database hardening work.
```

---

# 8. Local AI / Local Connector

## Purpose

Build optional local AI connector support while keeping SynaptiReach web-first.

This should support the AI processing modes:

- SynaptiReach Managed
- Bring Your Own Keys
- Local Connector

Local Connector should be optional, secure, and not required for launch.

## Folder

`docs/synaptireach-local-ai-connector-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-local-ai-connector-prompts/README.md`
2. `docs/synaptireach-local-ai-connector-prompts/00_master_local_ai_connector_prompt.md`
3. `docs/synaptireach-local-ai-connector-prompts/01_ai_mode_foundation.md`
4. `docs/synaptireach-local-ai-connector-prompts/02_local_connector_pairing_security.md`
5. `docs/synaptireach-local-ai-connector-prompts/03_ollama_model_discovery_runtime.md`
6. `docs/synaptireach-local-ai-connector-prompts/04_ai_routing_fallbacks_privacy.md`
7. `docs/synaptireach-local-ai-connector-prompts/05_admin_controls_user_settings_ui.md`
8. `docs/synaptireach-local-ai-connector-prompts/06_testing_security_production_polish.md`

Do not read or run `install_synaptireach_local_ai_connector_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-local-ai-connector-prompts.

Start with:
- 00_master_local_ai_connector_prompt.md
- 01_ai_mode_foundation.md

Implement Phase 1 first.

Keep SynaptiReach web-first. Local Connector must be optional and must not block the main app, onboarding, User CRM, Admin Portal, or billing.

Do not use fake local models, fake connector status, fake pairing state, fake AI responses, fake API keys, or simulated AI usage.

Use real configuration structures, safe disconnected states, secure pairing/token architecture, clear privacy boundaries, and clean empty states when local AI is unavailable.

Preserve the existing SynaptiReach design system.
```

---

# 9. Mobile / Responsive / PWA Polish

## Purpose

Polish the full app for mobile, responsive layouts, touch usability, PWA readiness, accessibility, and performance.

## Folder

`docs/synaptireach-mobile-responsive-pwa-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-mobile-responsive-pwa-prompts/README.md`
2. `docs/synaptireach-mobile-responsive-pwa-prompts/00_master_mobile_responsive_pwa_prompt.md`
3. `docs/synaptireach-mobile-responsive-pwa-prompts/01_responsive_layout_audit.md`
4. `docs/synaptireach-mobile-responsive-pwa-prompts/02_mobile_crm_staff_admin_workflows.md`
5. `docs/synaptireach-mobile-responsive-pwa-prompts/03_touch_forms_tables_modals.md`
6. `docs/synaptireach-mobile-responsive-pwa-prompts/04_pwa_install_offline_readiness.md`
7. `docs/synaptireach-mobile-responsive-pwa-prompts/05_accessibility_performance_polish.md`

Do not read or run `install_synaptireach_mobile_responsive_pwa_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-mobile-responsive-pwa-prompts.

Start with:
- 00_master_mobile_responsive_pwa_prompt.md
- 01_responsive_layout_audit.md

Implement Phase 1 first.

Audit the existing app before changing layouts.

Do not remove working desktop behavior.

Do not use fake mobile data, fake records, fake notifications, or simulated dashboards.

Use real app state and preserve the existing SynaptiReach design system while making CRM, onboarding, User Staff Portal, Admin Portal, billing, integrations, and AI settings usable on mobile.
```

---

# 10. Testing / QA / Bug Sweep

## Purpose

Run a structured test and bug-sweep process across core flows, auth, permissions, data access, UI regression, responsive behavior, error states, and final bug reporting.

## Folder

`docs/synaptireach-testing-qa-bug-sweep-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-testing-qa-bug-sweep-prompts/README.md`
2. `docs/synaptireach-testing-qa-bug-sweep-prompts/00_master_testing_qa_bug_sweep_prompt.md`
3. `docs/synaptireach-testing-qa-bug-sweep-prompts/01_smoke_tests_core_flows.md`
4. `docs/synaptireach-testing-qa-bug-sweep-prompts/02_auth_permissions_data_access_tests.md`
5. `docs/synaptireach-testing-qa-bug-sweep-prompts/03_ui_regression_responsive_tests.md`
6. `docs/synaptireach-testing-qa-bug-sweep-prompts/04_error_states_edge_cases.md`
7. `docs/synaptireach-testing-qa-bug-sweep-prompts/05_final_bug_sweep_report.md`

Do not read or run `install_synaptireach_testing_qa_bug_sweep_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-testing-qa-bug-sweep-prompts.

Start with:
- 00_master_testing_qa_bug_sweep_prompt.md
- 01_smoke_tests_core_flows.md

Implement Phase 1 first.

Run the project’s available test, lint, typecheck, build, and validation commands after inspecting package scripts.

Do not create fake passing tests by mocking away core behavior.

Do not hide failing behavior.

Use real app flows, real auth/data boundaries where possible, safe test fixtures only where appropriate, and document any unresolved issues clearly.
```

---

# 11. Final Launch / Production Hardening

## Purpose

Perform final production readiness checks across architecture, environment variables, security, auth, permissions, RLS, build/deploy, observability, data integrity, error states, empty states, performance, and final launch checklist.

This should happen near the end, not early.

## Folder

`docs/synaptireach-production-hardening-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-production-hardening-prompts/README.md`
2. `docs/synaptireach-production-hardening-prompts/00_master_production_hardening_prompt.md`
3. `docs/synaptireach-production-hardening-prompts/01_architecture_env_security_audit.md`
4. `docs/synaptireach-production-hardening-prompts/02_auth_permissions_rls_hardening.md`
5. `docs/synaptireach-production-hardening-prompts/03_build_deploy_performance_observability.md`
6. `docs/synaptireach-production-hardening-prompts/04_data_integrity_error_empty_states.md`
7. `docs/synaptireach-production-hardening-prompts/05_final_launch_checklist.md`

Do not read or run `install_synaptireach_production_hardening_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-production-hardening-prompts.

Start with:
- 00_master_production_hardening_prompt.md
- 01_architecture_env_security_audit.md

Implement Phase 1 first.

This is a final launch-hardening pass. Do this after the main User CRM, onboarding, User Staff Portal, Admin Portal, billing, database hardening, integrations, local connector, mobile polish, and QA work are stable.

Do not use fake environment variables, fake production checks, fake security results, fake analytics, fake monitoring, or simulated pass/fail results.

Use real project configuration, real build commands, real environment variable checks, real auth/permission checks, real RLS checks, and documented unresolved issues where needed.
```

---

# 12. Documentation / Internal Handoff

## Purpose

Create internal documentation and project handoff materials after the product systems are built and hardened.

This should become the map for future development, troubleshooting, support, and operating SynaptiReach.

## Folder

`docs/synaptireach-documentation-handoff-prompts/`

## Read order

Read these files in this exact order:

1. `docs/synaptireach-documentation-handoff-prompts/README.md`
2. `docs/synaptireach-documentation-handoff-prompts/00_master_documentation_handoff_prompt.md`
3. `docs/synaptireach-documentation-handoff-prompts/01_project_architecture_map.md`
4. `docs/synaptireach-documentation-handoff-prompts/02_setup_env_deployment_docs.md`
5. `docs/synaptireach-documentation-handoff-prompts/03_feature_operations_playbooks.md`
6. `docs/synaptireach-documentation-handoff-prompts/04_admin_support_troubleshooting_docs.md`
7. `docs/synaptireach-documentation-handoff-prompts/05_final_handoff_index.md`

Do not read or run `install_synaptireach_documentation_handoff_prompts.sh` unless specifically needed for installation/reference.

## Codex starter prompt

```text
Read the files in docs/synaptireach-documentation-handoff-prompts.

Start with:
- 00_master_documentation_handoff_prompt.md
- 01_project_architecture_map.md

Implement Phase 1 first.

Create documentation from the real current codebase only.

Do not invent architecture, fake features, fake integrations, fake setup steps, fake environment variables, fake deployment details, or fake support procedures.

Document what exists, what is partially implemented, what is missing, and what still needs follow-up.

Preserve useful existing docs and add clear internal handoff materials.
```

---

# Universal Codex Operating Instructions

Use these rules during every prompt pack.

## Before Editing

1. Inspect the files relevant to the requested phase.
2. Inspect existing components and data helpers before creating new ones.
3. Identify whether the app uses Next.js App Router, Pages Router, Vite, Remix, or another structure.
4. Identify existing Supabase/auth helpers before adding new database access.
5. Identify existing UI/design components before creating new components.
6. Check whether equivalent routes/components already exist.
7. Avoid duplicate systems.

## During Implementation

1. Make small, logical changes.
2. Preserve existing working functionality.
3. Keep User CRM stable.
4. Keep onboarding stable.
5. Keep permission checks server-side where applicable.
6. Keep all data real.
7. Use clean empty states when records do not exist.
8. Maintain SynaptiReach dark premium visual language.
9. Avoid introducing fake data just to fill the UI.
10. Document assumptions in code comments only when useful.

## After Implementation

Run the available commands from `package.json`, such as:

- install check if needed
- lint
- typecheck
- test
- build

Do not assume command names. Inspect `package.json` first.

If a command fails, fix the issue if safe. If not safe, document the failure and why it remains.

## Security Rules

Never commit secrets.

Never expose:

- Supabase service role key
- private API keys
- Stripe secret key
- OpenAI API key
- OAuth client secrets
- webhook signing secrets
- local connector pairing secrets

If `.env.local` contains secrets, do not print them in logs.

If secrets were accidentally exposed, rotate them before production.

## Data Rules

Do not use:

- fake users
- fake staff
- fake contacts
- fake leads
- fake opportunities
- fake campaigns
- fake analytics
- fake service orders
- fake revenue
- fake invoices
- fake prospects
- fake AI responses
- fake integration statuses
- fake local connector states
- fake audit logs

Allowed alternatives:

- real data queries
- clean empty states
- setup prompts
- disabled integration states
- missing configuration warnings
- safe seed defaults for system roles/permissions only when intentional and migration-backed

---

# Recommended One-Time Codex Startup Prompt

Use this when opening the SynaptiReach repo in Codex:

```text
Before making changes, inspect the SynaptiReach project thoroughly.

Read:
- package.json
- app/routes or src/routes structure
- components structure
- lib/helpers
- Supabase client/config files
- database/schema/migration files if present
- docs/
- existing CRM pages/components
- existing auth/session/permissions logic
- existing design system components
- existing environment variable usage

Build a mental map of the app before editing.

Do not make changes until you understand:
- routing structure
- auth structure
- database access pattern
- CRM data model
- UI component system
- existing SynaptiReach design language
- environment variable usage
- current User CRM implementation status

After inspecting, summarize the architecture and then implement only the requested phase.

Never use mock data, hardcoded fake records, fake analytics, fake users, fake prospects, fake revenue, fake service orders, or simulated CRM data.

Use real app state and clean empty states.
```

---

# Quick Reference: Folder Map

Known prompt folders currently expected in `docs/`:

```text
docs/synaptireach-admin-prompts
docs/synaptireach-billing-pricing-landing-prompts
docs/synaptireach-database-supabase-hardening-prompts
docs/synaptireach-documentation-handoff-prompts
docs/synaptireach-integrations-prompts
docs/synaptireach-local-ai-connector-prompts
docs/synaptireach-mobile-responsive-pwa-prompts
docs/synaptireach-production-hardening-prompts
docs/synaptireach-testing-qa-bug-sweep-prompts
docs/synaptireach-user-staff-prompts
```

User CRM v9 and onboarding prompt file/folder names may differ depending on how they were previously added. Use the discovery commands above to locate them.

---

# Final Note

Do not try to implement every prompt pack in one Codex task.

Use one prompt pack phase at a time.

Best pattern:

1. Read master file.
2. Read current phase file.
3. Inspect relevant code.
4. Implement only that phase.
5. Run checks.
6. Summarize what changed.
7. Commit.
8. Move to the next phase.
