# SynaptiReach Codex Global Goal Runbook

## Purpose

Use this file when switching to Codex after the User CRM Portal is complete.

This file is designed to be pasted into Codex as a `/goal` objective so Codex can work through every SynaptiReach prompt pack in order until the full system is complete.

This is a long-horizon implementation goal. Codex must not treat this as one giant uncontrolled edit. It must work milestone-by-milestone, validate after each milestone, keep changes scoped, and update progress documentation continuously.

---

# Codex Global Goal Prompt

Paste the following into Codex from the SynaptiReach project root:

```text
/goal Complete the full SynaptiReach build roadmap by reading and implementing every prompt pack in the required order, milestone-by-milestone, without stopping until all prompt packs are fully implemented, validated, documented, and production-ready, while preserving the existing User CRM and SynaptiReach design system.

Before editing any code, inspect the repository and read this file:

- docs/codex_synaptireach_prompt_reading_roadmap.md

Then read the prompt packs in this global implementation order:

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

Work through each pack in the exact file order defined below.

For every pack:
1. Read the README first if present.
2. Read the 00_master prompt second.
3. Read each numbered phase file in ascending order.
4. Implement one phase at a time.
5. After each phase, run validation commands.
6. Fix all issues caused by the phase before moving to the next phase.
7. Update docs/synaptireach_codex_global_goal_status.md with:
   - current pack
   - current phase
   - files changed
   - database/schema changes
   - commands run
   - validation results
   - known issues
   - next step
8. Do not move to the next phase until the current phase is implemented, validated, and documented.

Global constraints:
- Do not use mock data.
- Do not use hardcoded fake users.
- Do not use fake staff.
- Do not use fake CRM records.
- Do not use fake analytics.
- Do not use fake service orders.
- Do not use fake revenue.
- Do not use fake prospects.
- Do not use simulated campaign/workflow data.
- Use real app state, real authenticated users, real database structures, real organization/team membership, real permissions, and clean empty states when data is unavailable.
- Preserve the existing SynaptiReach design system.
- Preserve the existing User CRM.
- Do not break working routes.
- Do not remove working functionality unless replacing it with a fully working equivalent.
- Do not expose Supabase service role keys to the client.
- Do not commit secrets.
- Do not weaken security or RLS.
- Do not create disconnected duplicate systems when existing architecture can be extended.
- Keep changes scoped to the active phase.
- Prefer reusable components, hooks, services, and database helpers.
- Use production-ready empty states instead of demo data.
- Add TODO comments only when a real external integration or unavailable credential blocks completion.
- When blocked, document the blocker clearly and continue to the next safe subtask only if it does not depend on the blocker.

Validation requirements:
- Inspect package.json and use the actual project commands.
- Run the appropriate commands after each milestone, such as:
  - npm run lint
  - npm run typecheck
  - npm run test
  - npm run build
- If one of these scripts does not exist, document that and use the closest available validation command.
- If database migrations are added, verify they are syntactically valid and document how to apply them.
- If a validation command fails, fix the failure before moving on unless the failure is pre-existing and clearly unrelated. If unrelated, document the evidence.

Completion condition:
The goal is complete only when:
1. Every prompt pack has been read.
2. Every numbered phase in every prompt pack has either been implemented or explicitly documented as blocked by a real missing dependency.
3. All implemented phases pass available validation commands.
4. No mock/fake/simulated production data has been added.
5. User CRM remains functional.
6. Auth, permissions, role access, and data isolation are respected.
7. Supabase/database changes are documented.
8. Billing, integrations, local connector, mobile/PWA, QA, production hardening, and documentation packs have all been completed or safely blocked with exact reasons.
9. docs/synaptireach_codex_global_goal_status.md contains the final implementation summary.
10. docs/synaptireach_internal_handoff.md exists and explains how to run, test, deploy, maintain, and continue the project.
```

---

# Required Read Order By Prompt Pack

## 1. User CRM v9

Codex should locate the User CRM v9 prompt files before starting the global goal.

Expected places to search:

- docs/
- docs/synaptireach-user-crm-prompts/
- docs/synaptireach-crm-prompts/
- docs/synaptireach-user-crm-v9/
- root project prompt files
- any file with user CRM, CRM v9, or SynaptiReach CRM in the filename

Read order:

1. README or overview file if present
2. Master/User CRM v9 prompt
3. Numbered phase files in ascending order
4. Any continuation or implementation notes

Instruction:
If there are multiple User CRM prompt versions, prioritize the latest v9 prompt and document which file was used.

---

## 2. Onboarding

Codex should locate the onboarding prompt files.

Expected places to search:

- docs/
- docs/synaptireach-onboarding-prompts/
- docs/onboarding/
- any file with onboarding in the filename

Read order:

1. README or overview file if present
2. Master onboarding prompt
3. Numbered phase files in ascending order
4. Any continuation or implementation notes

Instruction:
Onboarding must integrate with real auth, real user profiles, real business setup, real CRM state, and clean empty states.

---

## 3. User Staff Portal

Folder:

- docs/synaptireach-user-staff-prompts/

Read order:

1. README.md
2. 00_master_user_staff_portal_prompt.md
3. 01_user_staff_foundation_roles_permissions.md
4. 02_team_invites_membership.md
5. 03_staff_dashboard_my_work.md
6. 04_assignment_task_system.md
7. 05_staff_approval_workflows.md
8. 06_staff_ai_copilot.md
9. 07_activity_analytics_notifications_audit.md
10. 08_mobile_security_seat_limits_polish.md

Instruction:
This is the customer-facing staff portal inside each user's CRM. It is not the SynaptiReach internal Admin Staff Portal.

---

## 4. Admin/Admin Staff Portal

Folder:

- docs/synaptireach-admin-prompts/

Read order:

1. README.md
2. 00_master_admin_portal_prompt.md
3. 01_admin_foundation_layout.md
4. 02_user_management_impersonation.md
5. 03_admin_command_center.md
6. 04_staff_portal_permissions.md
7. 05_global_approval_denial.md
8. 06_service_fulfillment_engine.md
9. 07_admin_ai_minibrain.md
10. 08_client_finder_prospect_discovery.md
11. 09_revenue_proposals_packages.md
12. 10_templates_kb_reports_integrations_audit.md

Instruction:
This is the SynaptiReach owner/admin system and internal SynaptiReach staff system. It must include secure admin access, impersonation logging, staff permissions, service fulfillment, client finder, and admin AI tools.

---

## 5. Billing / Pricing / Landing Page Final Polish

Folder:

- docs/synaptireach-billing-pricing-landing-prompts/

Read order:

1. README.md
2. 00_master_billing_pricing_landing_prompt.md
3. all numbered phase files in ascending order

Instruction:
Preserve pricing clarity, 30-day free trial expectations, billing consent, upgrade/downgrade flows, landing page polish, conversion clarity, and real billing integration readiness. Do not fake payment state.

---

## 6. Database / Supabase Schema Hardening

Folder:

- docs/synaptireach-database-supabase-hardening-prompts/

Read order:

1. README.md
2. 00_master_database_supabase_hardening_prompt.md
3. all numbered phase files in ascending order

Instruction:
Inspect existing schema before creating new tables. Strengthen RLS, permissions, migrations, indexes, constraints, organization scoping, service role boundaries, and data integrity. Do not expose service role keys client-side.

---

## 7. Integrations

Folder:

- docs/synaptireach-integrations-prompts/

Read order:

1. README.md
2. 00_master_integrations_prompt.md
3. all numbered phase files in ascending order

Instruction:
Use real integration architecture, secure credential handling, connection status, sync logs, failure states, and clean disabled/empty states where external credentials are unavailable.

---

## 8. Local AI / Local Connector

Folder:

- docs/synaptireach-local-ai-connector-prompts/

Read order:

1. README.md
2. 00_master_local_ai_connector_prompt.md
3. all numbered phase files in ascending order

Instruction:
Implement optional local AI connector support without making local AI required for the main web app. Support SynaptiReach Managed, Bring Your Own Keys, and Local Connector modes as real-data-ready settings. Treat local connector as advanced and optional.

---

## 9. Mobile / Responsive / PWA Polish

Folder:

- docs/synaptireach-mobile-responsive-pwa-prompts/

Read order:

1. README.md
2. 00_master_mobile_responsive_pwa_prompt.md
3. all numbered phase files in ascending order

Instruction:
Polish the app for mobile and responsive use across landing, onboarding, User CRM, User Staff Portal, Admin Portal, dashboards, forms, tables, modals, navigation, and PWA readiness.

---

## 10. Testing / QA / Bug Sweep

Folder:

- docs/synaptireach-testing-qa-bug-sweep-prompts/

Read order:

1. README.md
2. 00_master_testing_qa_bug_sweep_prompt.md
3. all numbered phase files in ascending order

Instruction:
Run a systematic QA pass. Add or improve tests where appropriate. Fix bugs. Confirm no fake data, no broken routes, no permission leaks, no console errors, no build failures, and no obvious UX regressions.

---

## 11. Final Launch / Production Hardening

Folder:

- docs/synaptireach-production-hardening-prompts/

Read order:

1. README.md
2. 00_master_production_hardening_prompt.md
3. all numbered phase files in ascending order

Instruction:
This should be late in the process. Verify security, auth, Supabase, env vars, Vercel readiness, build stability, production safety, performance, SEO basics, logging, error states, and launch readiness.

---

## 12. Documentation / Internal Handoff

Folder:

- docs/synaptireach-documentation-handoff-prompts/

Read order:

1. README.md
2. 00_master_documentation_handoff_prompt.md
3. all numbered phase files in ascending order

Instruction:
Create final documentation for how the system works, how to run it, how to deploy it, how to maintain it, how prompt packs were implemented, what remains blocked, and what future roadmap items exist.

---

# Required Progress Log

Codex must create and maintain:

- docs/synaptireach_codex_global_goal_status.md

Suggested structure:

```md
# SynaptiReach Codex Global Goal Status

## Current Status
- Current pack:
- Current phase:
- Current task:
- Started:
- Last updated:

## Completed Packs
-

## Completed Phases
-

## Files Changed
-

## Database / Supabase Changes
-

## Commands Run
-

## Validation Results
-

## Known Issues / Blockers
-

## Decisions Made
-

## Next Step
-
```

Codex must update this after every phase.

---

# Required Final Handoff File

Codex must create or update:

- docs/synaptireach_internal_handoff.md

It must include:

1. Project overview
2. Implemented systems
3. Route map
4. Auth and permission model
5. Supabase/database model
6. Environment variables
7. How to run locally
8. How to validate
9. How to build
10. How to deploy
11. Known limitations
12. External integrations needed
13. Local connector setup if implemented
14. Admin/User Staff usage notes
15. Future roadmap

---

# Recommended Codex Operating Rules

Codex should:

1. Start by reading package.json.
2. Identify framework and routing style.
3. Identify auth/session logic.
4. Identify Supabase clients and server/client boundaries.
5. Identify database/migration files.
6. Identify User CRM routes/components.
7. Identify existing design system components.
8. Identify existing docs/prompt packs.
9. Create the global status log.
10. Work phase-by-phase.

Codex should not:

1. Rewrite the whole app.
2. Replace working architecture unnecessarily.
3. Implement unrelated prompt packs at the same time.
4. Add mock data.
5. Add fake metrics.
6. Add fake seed users.
7. Add placeholder production records.
8. Expose secrets.
9. Disable RLS to make things work.
10. Skip validation.

---

# Safer Alternative If Goal Gets Too Large

If Codex reports the `/goal` is too large, unstable, or too broad, use this smaller goal instead:

```text
/goal Complete the next unfinished SynaptiReach prompt pack from docs/codex_synaptireach_prompt_reading_roadmap.md, reading its files in order, implementing every phase in that pack, validating after each phase, updating docs/synaptireach_codex_global_goal_status.md, and stopping only when that pack is complete or explicitly blocked.
```

Then repeat for the next pack.

---

# Best Practical Recommendation

The single global `/goal` is possible, but it is very large.

The safest way to use it is:

1. Start the global `/goal`.
2. Require Codex to keep the status log updated.
3. Check the status log after each major pack.
4. Pause the goal if it starts expanding scope.
5. Resume after reviewing the diff.
6. Commit after each completed pack, not only at the very end.

This gives Codex a long-running target while still protecting the project from a giant unreviewable diff.
