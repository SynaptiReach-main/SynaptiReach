# SynaptiReach Codex Prompt — Onboarding Final Verification, Manual Service Menu, Admin Review Readiness

## Context

Continue from the current SynaptiReach repository state.

The previous onboarding polish pass completed successfully and reported:

- `npm.cmd run build` passed.
- Files changed:
  - `app/onboarding/page.tsx`
  - `app/onboarding/status/page.tsx`
  - `lib/onboarding/server.ts`
  - `docs/architecture.md`
  - `docs/knowledge-map.md`
- Customer-facing billing copy was simplified:
  - `Stripe checkout submitted. Waiting for webhook confirmation.`
    changed to:
    `Checkout Submitted. Waiting Confirmation & Review.`
  - `Billing state: pending_webhook / Session cs_test_...`
    changed to:
    `Billing Status: Pending.`
- Raw Stripe session IDs were removed from onboarding UI.
- Visible Stripe/webhook status wording was replaced with simpler checkout/billing confirmation language.
- `/onboarding/status` was improved with:
  - Timeline: Submitted -> Billing confirmation -> SynaptiReach review -> Approved -> CRM activated.
  - “What happens next.”
  - Friendly pending/missing/approved explanations with editable onboarding links.
  - Existing “Edit onboarding” and “Sign Out.”
- Launch/final review summary was added:
  - business profile
  - pipeline stages
  - lead sources
  - staff roles
  - workflow drafts
  - marketing goals
  - calendar preference
  - billing/trial path
  - service/product menu state
- Service/product menu upload language now explains:
  - Analysis pending
  - Extraction scope
  - Manual fallback
- `crm_setup_summary` was added under existing `crm_settings.metadata`.
- No schema changes were made in that pass.
- No fake customers, fake revenue, fake provider success, fake subscription status, or fake paid state were added.

## Prime Directive

Do not redesign onboarding from scratch.

Do not undo any completed onboarding work.

Preserve:

- Stripe webhook ownership.
- Hosted Stripe Checkout flow.
- Subscription/trial activation rules.
- `/onboarding`
- `/onboarding/status`
- `/api/onboarding/stripe-session`
- Save/resume behavior.
- Workspace/user scoping.
- Dashboard access rules.
- CRM usability work.
- OwnerFocusPanel.
- Sidebar grouping.
- Review-gated safety behavior.
- Real-data-only behavior for normal users.
- CRM-aware onboarding metadata mapping.
- Service/product menu upload `pending_analysis` behavior.
- `crm_setup_summary` under `crm_settings.metadata`.

Do not create fake customers, fake revenue, fake analytics, fake paid state, fake provider success, fake subscription/trial activation, or fake service menu analysis success.

Only a dedicated simulated test workspace/user may contain simulated data if that feature exists. Normal users must remain real-data only.

## Task 1 — Verify Latest State Before Editing

Before changing code, inspect:

- `app/onboarding/page.tsx`
- `app/onboarding/status/page.tsx`
- `lib/onboarding/server.ts`
- `app/api/onboarding/stripe-session/route.ts`
- `app/api/billing/subscription/checkout/route.ts`
- `app/(marketing)/signin/page.tsx`
- `docs/onboarding.md`
- `docs/architecture.md`
- `docs/knowledge-map.md`
- `docs/codex/CODEX_TASK_LEDGER.md`
- `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`

Confirm the latest pass is present and do not redo completed work.

## Task 2 — Manual Service/Product Menu Entry

Add a manual service/product entry option in the Business/Profile or Service/Product Menu area.

Each manual service/product row should support:

- service/product name
- category
- price or price range
- duration, if applicable
- description
- notes
- active/enabled flag if useful

Use user-friendly helper copy.

Examples:

- “Service/product name: The thing customers can buy or book. Example: Haircut, Roof Inspection, HVAC Tune-Up.”
- “Category: A group this belongs to. Example: Grooming, Repairs, Maintenance, Consulting.”
- “Price/range: Use a normal price or estimate. Example: $45, $99-$149, quote required.”
- “Duration: How long this usually takes. Example: 30 minutes, 2 hours, varies.”
- “Description: A short explanation customers or staff would understand.”
- “Notes: Internal details SynaptiReach should know when helping build workflows, campaigns, or CRM recommendations.”

Include controls:

- Add service/product.
- Remove row.
- Optional starter examples based on industry/business type where safe, but do not create fake records automatically.

Store manual service/product rows in onboarding payload under a clear structure, such as `serviceMenu.manualItems`.

Also map them into `crm_settings.metadata`, for example:

- `metadata.service_menu.manual_items`
- `metadata.crm_setup_summary.service_menu`

Do not claim AI extraction succeeded. Uploaded files should still remain `pending_analysis` unless a real analyzer extracts data.

## Task 3 — Improve Service/Product Menu Review State

On the Launch step and `/onboarding/status`, clearly separate:

- Uploaded menu files.
- Manual service/product entries.
- Pending analysis.
- Needs review.
- Missing/not provided.
- Not available yet.

User-facing language should be clear:

- If uploaded only: “Menu uploaded. Analysis pending.”
- If manual rows exist: “Manual services/products saved.”
- If neither exists but user checked not available: “Service/product menu marked as not available yet.”
- If neither exists and not marked unavailable: “Service/product menu missing. You can upload a file or add services manually.”

Do not make service/product menu mandatory unless existing business rules require it.

## Task 4 — Admin Review Readiness Metadata

When onboarding is submitted or updated after submission, ensure metadata includes where safe:

- submitted_at
- submitted_for_review
- review_status
- user_visible_status
- approval_blockers
- needs_edit_items
- approved_items, if available
- pending_items
- reviewer_notes placeholder, if safe
- requested_edits placeholder, if safe
- last_user_update_at
- crm_setup_summary
- source: onboarding

Use metadata first if no schema change is required.

Do not build the full admin portal in this pass. The goal is to make the future admin portal easier to build.

## Task 5 — Improve CRM Setup Summary

Improve `crm_setup_summary` so it captures onboarding information that will help initialize and configure the User CRM.

Use only saved user-provided or safely derived data.

Include:

Business:
- business name
- legal name presence/review state
- industry
- business type
- service areas
- business hours
- main customer type
- primary service/product categories
- top services/products
- manual service/product rows
- uploaded menu state
- common questions
- common objections
- preferred call to action
- brand voice

Sales/CRM:
- pipeline stages
- lead statuses
- lead sources
- lead tags
- typical deal value
- average close time
- stale lead threshold
- stale deal threshold
- follow-up timing
- owner assignment preference
- appointment types
- task types
- won/lost reasons
- priority rules

Marketing:
- goals
- channels
- starter strategy
- first campaign idea
- monthly budget
- lead magnets/offers
- customer segments
- review request timing
- approval workflow

Analytics:
- primary KPI
- monthly lead goal
- monthly revenue goal
- appointment goal
- conversion goal
- average customer value
- current monthly lead volume
- current monthly appointment volume
- reporting cadence
- 30/60/90 day success goals
- pain points

Communications:
- email style
- SMS style
- common questions
- common objections
- escalation rules
- response time expectations
- do-not-contact preferences
- disclaimers/restricted claims

Calendar:
- calendar mode
- appointment types
- default duration
- booking window
- availability notes
- reminder timing
- no-show preference
- confirmation workflow

Automation/Workflows:
- workflow drafts selected
- workflow notes
- review-gated policy
- quiet hours
- usage warning preferences

AI/CRM Intelligence:
- managed/BYOK mode
- provider preference
- brand voice
- tone
- risk tolerance
- topics to avoid
- draft mode
- rule-based-first preference

Billing/Trial:
- trial path
- selected post-trial plan
- billing status
- acknowledgement states
- managed SMS readiness state
- BYOK/provider-cost acknowledgement

Help/DFY:
- self-guided/guided/DFY mode
- requested services
- guided call requested
- help notes

This summary should not overwrite raw onboarding payload. It should be a clean derived summary for CRM/admin/status usage.

## Task 6 — Fix Combined Field Storage Where It Weakens CRM Mapping

Inspect onboarding inputs where multiple concepts are combined into one textarea but only saved into one field.

Examples to check:

- Common questions + common objections.
- Pricing + booking + quote + review notes.
- Lead magnets + offers/promotions.
- Customer segments + seasonal campaigns.
- Escalation + response time + do-not-contact + disclaimers.
- Won reasons + lost reasons.
- Priority rules + assignment rules.
- Availability + booking window + reminders + no-show + confirmation workflow.
- 30/60/90 goals + pain points.

Either split the UI into separate fields where it improves CRM data quality, or preserve the UI but save the combined content to a clearly named structured notes field while keeping existing payload compatibility.

Do not break existing saved onboarding sessions. Do not delete user-entered data.

## Task 7 — Readiness and Status Copy Polish

Keep labels user-friendly and consistent.

Preferred labels:

- Business Profile
- Billing Set-Up
- Email Setup Reviewed
- SMS Setup Reviewed
- Calendar Setup Reviewed
- Service/Menu Upload
- Staff Setup
- Workflow Drafts
- Automation Safety
- CRM Setup Summary
- CRM Intelligence

Avoid technical labels like:

- webhook
- session id
- provider runtime
- raw Stripe session
- agent runs
- autonomous agents

Internal code names can remain if renaming would be risky, but customer-facing text should be simple.

## Task 8 — Status Page Experience

Improve `/onboarding/status` where needed.

The status page should show:

- Current review state.
- What happens next.
- Timeline:
  - Submitted
  - Billing Confirmation
  - SynaptiReach Review
  - Approved
  - CRM Activated
- Friendly grouped cards:
  - Waiting on SynaptiReach
  - Waiting on Stripe
  - Needs Your Edits
  - Approved / Complete
  - Missing
- Clear “Edit onboarding.”
- Clear “Sign Out.”

If a pending/missing item can be edited by the user, provide a link back to the relevant onboarding step.

If an item requires SynaptiReach/admin review, clearly say the user does not need to do anything unless SynaptiReach requests edits.

Do not send users to the CRM dashboard until access is approved/active according to existing rules.

## Task 9 — Onboarding Page UX Polish

Make small usability improvements only.

Verify:

- Finish Later saves current step and returns to homepage.
- Sign-in resumes exact saved step for incomplete users.
- Submitted users go to `/onboarding/status`.
- Editing submitted onboarding works.
- Updating onboarding after submission returns to status.
- Future steps cannot be bypassed.
- Required fields are clearly marked with red asterisks.
- Optional fields say `(optional)`.
- Helper text explains technical/business terms.

Do not add friction unless it improves CRM setup quality.

## Task 10 — Customer-Facing “Agent” Wording Scan

Search customer-facing text in `app`, `components`, and customer-facing docs for:

- agent
- agents
- agent runs
- autonomous agent
- agent activity

Replace visible customer-facing wording with safer language:

- AI review checks
- CRM Intelligence
- automation checks
- workflow reviews
- AI recommendations
- built-in intelligence

Do not rename internal routes/API files if risky.

Do not break `/ai-agents` route if it exists. If needed, keep the route but change visible page title/copy to “CRM Intelligence” or “AI Automation.”

## Task 11 — Build and Smoke Tests

Run:

```powershell
npm.cmd run build
```

Smoke test locally or report how to test:

- `/signup?trial=managed`
- `/signup?trial=byok`
- `/onboarding`
- `/onboarding/status`
- `/dashboard`

## Manual Tests To Report

Report manual tests still needed:

1. Unauthenticated `/onboarding` redirects safely and does not hang.
2. Incomplete user signs in and returns to exact saved step.
3. Finish Later saves and redirects to homepage.
4. Sign back in resumes exact saved step.
5. Stripe Checkout returns to `/onboarding` without loading hang.
6. Billing section shows user-friendly pending status.
7. Submit onboarding for review goes to `/onboarding/status`.
8. Submitted/pending user signs in and goes to `/onboarding/status`.
9. Status page button says Sign Out.
10. Dashboard is only accessible for approved/active onboarding state.
11. Manual service/product rows save and appear in CRM setup summary.
12. Uploaded service/product menu remains pending analysis unless real extraction exists.
13. Status page clearly distinguishes missing, pending, approved, and needs-edit states.
14. Customer-facing “agent” wording is removed/replaced.

## Final Report Required

At the end, report:

- Files changed.
- Whether any SQL/schema changes were needed.
- Exact customer-facing copy changed.
- Manual service/product menu changes.
- CRM setup summary improvements.
- Admin-review metadata improvements.
- Status page improvements.
- Readiness explanation improvements.
- Combined field storage changes.
- Customer-facing “agent” wording changes.
- Build result.
- Manual tests still required.

## Stop Condition

If `npm.cmd run build` passes and the above targeted improvements are complete, stop.

Do not continue into:

- full admin portal build
- staff portal build
- local AI connector build
- major billing rewrite
- major dashboard redesign
- new simulation/test user work

Those should be separate prompts.
