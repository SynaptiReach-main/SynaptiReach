# SynaptiReach User CRM Portal Usability Goal

## Objective

Improve the User CRM portal so it is easier for non-technical business owners to understand, navigate, and use without removing existing features.

This is a UX/layout/navigation/readability pass, not a feature-removal pass.

## Core Principles

- Do not remove existing working features.
- Do not break existing CRM data flows.
- Do not introduce fake data.
- Do not redesign the whole brand.
- Preserve the SynaptiReach dark UI system, cyan-to-green accents, glassmorphism, dashboard feel, and existing CRM architecture.
- Make the interface calmer, more guided, and less overwhelming.
- Prioritize clarity for local service businesses, professional services, agencies, ecommerce operators, and non-technical owners.
- Keep advanced controls available, but do not force them into the user’s face.

## Pages In Scope

- /dashboard
- /dashboard/leads
- /dashboard/pipeline
- /dashboard/tasks
- /dashboard/calendar
- /dashboard/communications
- /dashboard/marketing
- /dashboard/workflow
- /dashboard/analytics
- /dashboard/ai_assistant
- /dashboard/settings
- shared dashboard layout/sidebar/header
- shared modals/cards/panels used by these pages

## UX Goals

1. Make each page answer:
   - What is this page for?
   - What should I do first?
   - What needs my attention today?
   - What can be safely ignored until later?

2. Reduce visual overwhelm:
   - group advanced controls into accordions, drawers, tabs, or secondary panels
   - use consistent spacing
   - use consistent card widths
   - avoid crowded metric walls
   - avoid huge blocks of equal-importance buttons

3. Improve navigation:
   - make page titles and descriptions clearer
   - keep major CRM sections easy to find
   - add contextual links between related records when useful
   - preserve existing routes

4. Improve action clarity:
   - primary action should be obvious
   - secondary actions should be quieter
   - destructive actions should remain review-gated
   - external sends should remain review-gated unless user settings explicitly allow automation

5. Improve empty states:
   - explain what is missing
   - show the next safe setup step
   - link to onboarding/settings/import where useful

6. Improve record views:
   - make leads, deals, tasks, campaigns, messages, workflows, and appointments easier to scan
   - use status chips and grouped summaries
   - avoid making every field equally prominent

7. Improve intelligence panels:
   - avoid confusing labels
   - show recommendations as “why it matters” + “suggested next step”
   - make dismiss/approve/open-record behavior clear
   - do not use customer-facing “mini-brain” wording

8. Improve Settings:
   - keep the current collapsible structure
   - keep Billing & Purchase History grouped and collapsible
   - do not expose secrets
   - keep customer-local/local connector future-ready language clear

## Safety Constraints

- Do not remove features.
- Do not delete routes.
- Do not remove database writes that are currently working.
- Do not auto-send email/SMS/social.
- Do not auto-charge outside Stripe Checkout.
- Do not expose secrets.
- Do not commit .env.local.
- Do not switch Stripe to live mode.
- Keep test/simulation data isolated to explicit test workspace flows.
- Preserve real CRM data behavior for normal users.

## Required Process For Codex

1. Read docs/codex/CODEX_TASK_LEDGER.md.
## Required Process For Codex

1. Read docs/codex/CODEX_TASK_LEDGER.md.
2. Read exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md.
3. Inspect all dashboard pages before editing.
4. Make small, reviewable UX improvements.
5. Prefer shared components if they reduce inconsistency.
6. Run npm.cmd run build.
7. Update docs/codex/CODEX_TASK_LEDGER.md.
8. Update exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md.
9. Report:
   - pages improved
   - UX changes made
   - files changed
   - build result
   - manual browser checks required
   - anything intentionally deferred

## Stop Conditions

Stop if:
- build fails and cannot be fixed safely
- changes would require major data model changes
- user feedback is needed for layout decisions
- only manual browser review remains

