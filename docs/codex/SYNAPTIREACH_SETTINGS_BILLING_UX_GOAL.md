# SynaptiReach Codex Goal — Settings, Billing UX, Credit Packs, Services, Integrations, and Automation Safety

Use this file in Codex with `/goal`.

## Goal

Finish the Settings page, billing UX, credit pack checkout UX, services consultation UX, integration configuration UX, and AI/automation safety settings from the current working tree without restarting completed work.

## Read First

Read these files first:

- `docs/codex/SYNAPTIREACH_MASTER_V9.md`
- `docs/codex/CODEX_TASK_LEDGER.md`
- `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`
- `app/dashboard/settings/page.tsx`
- `app/api/crm/settings/route.ts`
- `app/api/billing/subscription/checkout/route.ts`
- `app/api/billing/stripe/webhook/route.ts`
- `lib/billing/plans.ts`
- `lib/billing/services.ts`
- `app/api/crm/services/request/route.ts`
- `lib/billing/stripe.ts`
- `lib/notifications/resend.ts`
- `supabase/user_crm_full_completion_schema.sql`

Continue from the current working tree. Do not restart completed work. Do not duplicate existing routes, tables, components, modals, or docs. Update `docs/codex/CODEX_TASK_LEDGER.md` and `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md` after every checkpoint.

## Current Verified Status

- Latest deployed commit: `e37c8040 Verify launch readiness billing services intelligence and communications`.
- Vercel production deployment is ready and aliased to `https://synapti-reach.vercel.app`.
- Production smoke checks returned `200` for key public, CRM, and admin pages.
- Local fail-closed checks passed:
  - `PATCH /api/admin/waitlist` with `{}` returned `403`.
  - `POST /api/crm/communications/send` with `{}` returned `400`.
- Stripe CLI `trigger checkout.session.completed` succeeded from Stripe’s side, but this does not fully prove the app-specific checkout/webhook lifecycle unless the listener was forwarding to the local app and the app processed it.
- Credit pack checkout was tested manually for $19 and $25 packs. Payment appeared to work, but the user did not receive a proper in-app confirmation popup and did not receive the expected app-level purchase confirmation email.
- Request consultation works and sends email to `synaptireach@gmail.com`.
- “Start Stripe Trial Checkout” buttons in Settings did not trigger anything.
- Stripe remains intentionally in test/sandbox mode.
- Resend key was pasted into chat previously. Do not expose it. Keep rotation reminder in checklist.
- Do not commit `.env.local`.
- Do not switch Stripe to live mode.

## Important UX/Language Requirements

- Customer-facing UI must never use “mini-brain.”
- Customer-facing “BYOK” should be spelled out as “Bring Your Own Key” wherever space allows.
- If abbreviation is unavoidable, use uppercase `BYOK`, never `byok`.
- Raw enum values such as `byok`, `managed`, and `synaptireach_managed` must not be displayed to customers.
- Use polished labels:
  - `Bring Your Own Key`
  - `SynaptiReach Managed`
  - `Review Needed First`
  - `Autonomous Where Allowed`
  - `Disabled`
- Preserve the SynaptiReach dark theme, cyan-to-green gradients, premium glass cards, compact dashboards, rounded 2xl/3xl style, and existing CRM design system.

## High-Level Problems Found From Code Review

The current `app/dashboard/settings/page.tsx` has become too dense and exposes too many sections all at once. It lists full plan cards, all credit packs, all services, all integrations, staff controls, AI settings, and provider key inputs together. This makes Settings overwhelming and makes important actions harder to understand.

Specific issues:
1. `AI Settings` is vague and not self-explanatory.
2. `Integration Status` includes customer-irrelevant infrastructure cards such as Supabase and Vercel Cron.
3. Integration cards open only a generic metric modal instead of an integration configuration panel.
4. Credit packs are all visible at once and each has its own “Start Stripe Checkout” button.
5. Services/Bundles/Retainers are all visible at once and each has its own “Request Consultation” button.
6. Subscription plan cards use “Start Stripe Trial Checkout,” but manual test showed these buttons did not trigger anything.
7. Trial/subscription selection likely belongs primarily in onboarding, while Settings should show current billing state and let users complete/manage billing setup.
8. Credit pack checkout needs confirmation UX after Stripe redirect.
9. Credit pack webhook-confirmed purchases should trigger an app-level SynaptiReach confirmation email.
10. Services API currently supports a single `itemName`; the UX needs multi-service selection and the API should store structured selected items.
11. Review-gated/autonomous behavior needs a real settings model and UI that can be respected across communications, workflows, recommendations, and internal actions.
12. Settings sections need accordion/collapsible structure to conserve space.

## Work Loop

Run this as a long `/goal` loop.

After every checkpoint:
1. Update `docs/codex/CODEX_TASK_LEDGER.md`.
2. Update `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`.
3. Run `npm.cmd run build` when runtime/app/schema behavior changes.
4. Continue automatically to the next incomplete task unless blocked by missing external setup, unsafe behavior, repeated build failure, or a required manual provider test.

Do not stop after one file unless blocked.

---

# Phase 1 — Settings Page Structure and Collapsible UX

## Task 1.1: Build reusable Settings accordion/section component

Create a reusable local component or shared component for collapsible Settings sections.

Each collapsed section should show:
- title
- short purpose statement
- status chip/summary
- expand/collapse icon/affordance
- optional alert chip if setup is required

Each expanded section should:
- preserve existing controls
- organize controls better
- be mobile-friendly
- not stretch the page unnecessarily

Use this accordion pattern for:
- `AI Providers`
- `Trial, Caps & Billing Rules`
- `Integration Status`
- `Connect Your AI Keys`
- `AI Settings` / new `CRM Automation & AI Behavior`
- `Credit Packs`
- `Services, Bundles & Retainers`
- `Staff & Permissions`

Keep these sections always visible and NOT collapsible:
- `Setup & Usage Intelligence`
- `Business Profile`

## Task 1.2: Suggested settings page order

Recommended order:
1. Page header
2. global error/success/toast area
3. Simulated Test Workspace banner, only if allowed
4. Setup & Usage Intelligence, not collapsible
5. Business Profile, not collapsible
6. Trial, Caps & Billing Rules, collapsible
7. Credit Packs, collapsible
8. Services, Bundles & Retainers, collapsible
9. CRM Automation & AI Behavior, collapsible
10. Integration Status, collapsible
11. Connect Your AI Keys, collapsible
12. AI Providers, collapsible
13. Staff & Permissions, collapsible

Keep `QueryRecordFocus`, `SimpleMetricModal`, and CRM Intelligence panels working.

---

# Phase 2 — Credit Pack Checkout UX

## Task 2.1: Redesign Credit Packs UI

Required behavior:
1. Make the whole Credit Packs section collapsible.
2. When expanded, show six premium cards.
3. Keep the card visual style, but make cards selectable.
4. Replace all per-card checkout buttons with one main button: `Checkout`.
5. Allow one selected pack at a time unless API supports multiple packs. Do not fake multi-pack support.
6. Show selected pack summary: pack name, price, credits included, Stripe security note.
7. Before redirecting to Stripe, show confirmation modal with pack, amount, credits, and secure payment disclosure.
8. Button text should be `Checkout`, not `Start Stripe Checkout`.
9. If Stripe is missing, show a clear setup-required state.

## Task 2.2: Stripe return confirmation

Inspect `createCreditPackCheckoutSession` and return URL behavior.

Implement success-return UX:
1. Detect Stripe return query params such as `checkout=success`, `session_id=...`, and `purchase_id=...` if available.
2. On Settings load, if purchase return params exist, show a confirmation modal/banner:
   - `Credit pack purchase received`
   - pack name/type if known
   - amount if known
   - status: `Pending Stripe webhook confirmation` or `Confirmed`
   - what happens next
3. If webhook is pending, say: “Your payment was submitted. SynaptiReach will apply credits after Stripe confirms the payment.”
4. If webhook confirmed, show confirmed credit state.
5. Do not falsely claim credits were applied before webhook confirmation.
6. Avoid duplicate popups after refresh if possible.

## Task 2.3: Credit pack app-level email confirmation

Add/complete app-level confirmation email behavior:
1. On verified webhook confirmation for credit pack payment, send a SynaptiReach purchase confirmation email to the user’s account email if available.
2. Do not duplicate Stripe’s official receipt; this is a SynaptiReach confirmation/status email.
3. Include pack name/type, amount, date, status, workspace/business if available.
4. Do not include sensitive payment/card details.
5. Fail safely if Resend is unavailable.
6. Ensure idempotency prevents duplicate emails/credits on replay.
7. Store email sent status in metadata/audit/notification where appropriate.

---

# Phase 3 — Trial and Subscription Billing UX

## Task 3.1: Fix broken Settings subscription buttons

Issue: “Start Stripe Trial Checkout” did not trigger anything.

Required:
1. Inspect current button action and route.
2. Fix broken event handling, disabled state, missing context, modal, or API behavior.
3. Prefer a clearer billing setup state:
   - Show current plan/trial/billing status.
   - Show selected plan if known.
   - Show trial end date if known.
   - Show billing mode as `Bring Your Own Key` or `SynaptiReach Managed`.
   - Show `Complete Billing Setup`, `Change Plan`, or `Manage Billing`.
   - If no active trial/subscription/payment method exists, show `Complete Billing Setup`.

## Task 3.2: Add billing setup confirmation modal

Clicking `Complete Billing Setup` should open a modal:
- selected plan
- selected billing mode
- 14-day trial terms
- card required before trial activation
- after trial, plan renews automatically unless canceled before trial ends
- Stripe handles payment details securely
- SynaptiReach employees never see card numbers
- final confirm button to continue to Stripe Checkout

Do not auto-start a trial without explicit user confirmation.
Do not mark a subscription/trial active until Stripe confirms via verified webhook.
Keep test/sandbox mode.

## Task 3.3: Prepare onboarding ownership

Add a clear note:
- Onboarding should be the primary place for selecting trial plan and adding payment method.
- Settings lets a user resume/complete billing setup or manage/change plan later.

---

# Phase 4 — Services, Bundles & Retainers UX

## Task 4.1: Group services into accordion categories

Group options into expandable categories:
- Marketing Execution
- Strategy
- Advanced Marketing
- AI Services
- Branding & SEO
- Social & Google Business Profile
- Service Bundles
- Recurring Retainers

Use `SERVICE_CATALOG` but map current categories into cleaner customer-facing headings.

## Task 4.2: Multi-select service request

Replace per-card request buttons with:
- selectable service cards or checkboxes
- one single `Request Consultation` button

Allow selecting one or multiple services/bundles/retainers.

Request consultation modal should show:
- selected service names
- prices
- one-time vs monthly
- categories
- total estimated one-time amount
- total estimated monthly amount
- notes/needs textarea
- requested timeline if practical
- reminder that consultation is required before purchase

Do not trigger Stripe.
Do not mark anything paid.

## Task 4.3: Update service request API for multiple selected items

Current `app/api/crm/services/request/route.ts` accepts a single `itemName`.

Update safely to support:
- existing single-item requests for backward compatibility
- new `items` or `selected_items` array

Store structured selected items in `crm_service_requests.metadata`.

If schema allows only one `item_name`, use summary item name like `Multiple services selected`, and store full details in metadata.

Internal email to `synaptireach@gmail.com` must clearly list:
- all selected services/bundles/retainers
- prices
- one-time/monthly totals
- workspace/company/user info if available
- notes
- requested timeline

Continue to create notifications/audit logs.

---

# Phase 5 — AI Settings Redesign and Enforcement Model

## Task 5.1: Rename/rebuild AI Settings section

Rename `AI Settings` to `CRM Automation & AI Behavior`.

Explain that it controls:
- message drafting
- task recommendations
- workflow actions
- appointment suggestions
- lead scoring
- campaign recommendations
- external sends

Replace vague fields with clear labels:
- `Brand voice`
- `Default response tone`
- `Preferred CTA style`
- `Audience / customer profile`
- `Automation mode`
- `External communication safety`
- `Internal action safety`

## Task 5.2: Add automation modes

Add high-level automation mode options:
1. `Conservative` — Always ask before taking action.
2. `Assisted` — Drafts and recommendations can be prepared automatically, but external actions require approval.
3. `Autonomous Where Allowed` — Internal actions may run automatically; external sends require explicit configured permissions.

Default should remain safe/review-gated.

## Task 5.3: Add category-specific behavior controls

Suggested categories:
- Email replies
- SMS replies
- Internal tasks
- Lead scoring updates
- Deal/pipeline updates
- Appointment suggestions
- Workflow recommendations
- Campaign recommendations
- Contact/waitlist/service intake notifications

Each category should support:
- `Review Needed First`
- `Auto-Apply / Auto-Send where safe and allowed`
- `Disabled`

Critical safety:
- External email/SMS defaults to `Review Needed First`.
- SMS/email auto-send requires explicit opt-in and provider readiness.
- If auto-send is enabled, show warning text and require confirmation.
- Do not enable fully autonomous external sends by default.
- Do not break current review-gated send route.

## Task 5.4: Store and surface settings

Store these settings in real settings state:
- preferred path: `crm_settings.metadata.automation_policy`
- preserve existing `automation_level` for backward compatibility
- do not require destructive schema changes

Make affected areas read/respect the policy where possible:
- communications
- workflows
- task recommendations
- campaign recommendations
- appointment suggestions
- lead/deal updates

If full enforcement cannot be completed in one pass, implement settings model/UI and helper accessors, then document enforcement gaps.

Save button should say: `Save AI & Automation Settings`.

---

# Phase 6 — Integration Status and Configuration UX

## Task 6.1: Remove irrelevant customer integration cards

Do not show these to User CRM customers:
- Supabase
- Vercel Cron

## Task 6.2: Use customer-facing integrations

Integration Status should focus on:
- Stripe / Billing
- Resend / Email
- Twilio / SMS
- Ayrshare / Social
- Google Calendar / Calendar Sync
- Google Business Profile
- OpenAI
- Gemini
- OpenRouter
- Local Connector, future-ready status

## Task 6.3: Integration configuration drawer/modal

Clicking an integration card should open a configuration panel/modal/drawer showing:
- what the integration does
- current status
- required fields
- whether SynaptiReach manages it or user provides own key
- masked key label if saved
- test connection action where safe
- save/update button
- setup-required/future-ready state if not available

Do not expose stored secrets.
Provider configuration must remain server-side.

Preserve platform rules:
- Default platform mode: SynaptiReach uses one server-side Ayrshare API key and creates/maps Ayrshare profiles per customer/workspace.
- Bring Your Own Key mode: advanced customers can add their own Ayrshare API key if they already have one.

---

# Phase 7 — Billing Mode Display Cleanup

Find all customer-facing raw values:
- `byok`
- `managed`
- `synaptireach_managed`
- lowercase `byok`
- inconsistent `BYOK`

Replace with:
- `Bring Your Own Key`
- `SynaptiReach Managed`

Internal enums may stay unchanged.

---

# Phase 8 — Route/API Hardening and Backward Compatibility

## Task 8.1: Settings route

`app/api/crm/settings/route.ts` currently supports:
- PATCH normal settings
- PATCH `provider_connections`
- PATCH `credit_pack_intent`

Do not break backward compatibility.

Add support for:
- saving automation policy in metadata
- better credit pack metadata for return confirmation
- optional purchase confirmation email state if needed
- cleaner integration save/test behavior if practical

## Task 8.2: Subscription checkout route

`app/api/billing/subscription/checkout/route.ts` should:
- require a valid plan
- require a Stripe price ID
- not accidentally choose arbitrary billing accounts
- create/update billing account safely
- keep status `checkout_required` / `checkout_created` until webhook confirmation
- return useful errors
- support Settings modal and future onboarding flow

## Task 8.3: Stripe webhook route

`app/api/billing/stripe/webhook/route.ts` should:
- remain idempotent
- store event IDs
- avoid duplicate fulfillment
- update credit pack purchase state
- update subscription billing account state
- send app-level confirmation email for credit pack purchases if Resend configured
- not mark subscription active without verified webhook
- handle duplicate/replayed events safely
- fail safely and not expose secrets

---

# Phase 9 — Final Verification

Run:
- `npm.cmd run build`

Verify:
1. `.env.local` is not tracked.
2. No secrets are printed or committed.
3. Customer-facing “mini-brain” wording remains absent.
4. Settings page loads.
5. Settings sections are collapsible as required.
6. Business Profile and Setup & Usage Intelligence remain non-collapsible.
7. Credit pack checkout route still works.
8. Subscription checkout route still works or gives clear setup-required errors.
9. Contact/waitlist/service APIs still work or fail safely.
10. Admin pages remain fail-closed unless explicitly enabled.
11. Service consultation request email includes selected services clearly.
12. Credit pack success return shows confirmation.
13. Billing mode display is polished.
14. Integration cards no longer show Supabase/Vercel Cron to customers.
15. AI/automation settings are understandable and safe.

Update:
- `docs/codex/CODEX_TASK_LEDGER.md`
- `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`

Final report must include:
- completed items
- partial items
- blocked items
- files changed
- commands run
- build result
- tests run
- manual actions still required
- whether another pass is needed
