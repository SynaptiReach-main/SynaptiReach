# SynaptiReach Codex Prompt — Onboarding Stabilization + CRM-Aware Data Collection

## Execution Mode

Continue the SynaptiReach onboarding stabilization pass.

Do not redesign onboarding from scratch. Fix the current onboarding flow in place. Preserve completed CRM usability work, OwnerFocusPanel, sidebar grouping, Review gated / Real records wording, dashboard routes, Stripe webhook ownership, Stripe safety, and existing save/resume architecture.

## ADDITIONAL CRITICAL ONBOARDING REQUIREMENT — CRM POPULATION AND CRM-AWARE DATA COLLECTION

Codex must treat onboarding as the primary workspace-generation and CRM-population process.

All information collected during onboarding should be used to configure and populate the user’s CRM wherever appropriate. Do not collect onboarding data only for display. It should become real workspace/business/profile/settings/CRM configuration data that the User CRM can use.

Before implementing new onboarding fields, Codex must inspect the current User CRM code and identify every CRM page/module that could benefit from onboarding-collected data, including but not limited to:

- Dashboard
- Analytics & Reporting
- Leads
- Pipeline/Deals
- Tasks
- Calendar/Appointments
- Marketing
- Communications
- Automations/Workflow
- AI Assistant / CRM Intelligence
- Settings
- Staff/permissions
- Billing/usage
- Services/DFY requests
- Service/product menu knowledge
- Notifications
- Trial/caps/readiness state

Codex must review the current code/data flow for these CRM areas and add onboarding collection fields for any useful information that can reasonably be obtained from the user during onboarding.

The goal is that after onboarding, the user’s CRM is not an empty shell. It should be pre-configured with as much real, user-provided setup data as possible.

Examples of onboarding data that should be collected and mapped into the CRM:

Business / workspace:
- Business name
- Legal business name
- Business type
- Industry
- Services offered
- Service/product menu
- Service areas
- Business hours
- Website
- Phone
- Main business email
- Location/address if applicable
- Primary contact/owner
- Brand voice
- Customer communication style
- Main CTA
- Target customer
- Ideal customer profile
- Common customer problems
- Top services/products
- Pricing/ranges if provided
- Appointment/booking process
- Estimate/quote process
- Review/reputation process

CRM / sales setup:
- Lead stages
- Pipeline stages
- Deal stages
- Typical deal value
- Average close time
- Lead sources
- Lead statuses
- Lead tags
- Follow-up rules
- Priority rules
- Lost/won reasons
- Appointment types
- Default task types
- Staff assignment rules
- Team roles and permissions
- Required fields for leads/deals/tasks

Dashboard and analytics:
- User’s main business goals
- Primary KPI they care about
- Monthly lead goal
- Monthly revenue goal
- Appointment goal
- Conversion goal
- Average job/deal value
- Campaign budget if applicable
- Current monthly lead volume if known
- Current monthly customer volume if known
- Current follow-up process
- Current pain points
- What success should look like after 30/60/90 days
- Baseline metrics if user knows them
- Analytics preferences and reporting cadence

Marketing setup:
- Marketing channels used
- Campaign goals
- Email/SMS/social preferences
- Lead magnets
- Offers/promotions
- Seasonal campaigns
- Past campaign performance if known
- Customer segments
- Retargeting needs
- Review request preferences
- Content tone
- Compliance preferences
- Preferred campaign approval workflow

Communications:
- Preferred email style
- Preferred SMS style
- Common questions customers ask
- Common objections
- Common follow-up messages
- Escalation rules
- Who should respond to what
- Response-time expectations
- Do-not-contact preferences
- Business-specific disclaimers

Calendar/appointments:
- Appointment types
- Appointment duration
- Booking windows
- Service areas
- Staff availability notes
- Reminder preferences
- No-show follow-up preference
- Confirmation workflow preference
- Calendar provider preference
- Internal CRM calendar vs Google Calendar setup

Automations/workflows:
- Which workflows the user wants active or drafted
- Which workflows should remain review-only
- Follow-up windows
- Appointment reminder timing
- No-show recovery preferences
- Review request timing
- Quote follow-up timing
- Re-engagement timing
- Campaign reply workflow preferences
- Usage/cap warning preferences
- Human review requirements

AI / CRM intelligence:
- Managed vs BYOK mode
- AI provider preferences
- Brand voice
- Risk tolerance
- How aggressive follow-ups should be
- Whether AI should draft only or recommend tasks
- Approval requirements
- Topics/claims AI should avoid
- Customer service tone
- Business-specific knowledge from service menu upload

Billing / usage:
- Trial path
- Selected post-trial plan
- Managed vs BYOK usage mode
- Usage cap acknowledgements
- Credit pack interest
- SMS readiness request
- DFY/service interest
- Payment method setup status
- Subscription/review status

IMPORTANT: Codex should add onboarding fields only where they create real value for the CRM. Avoid unnecessary friction, but collect enough information to configure the CRM properly.

Every collected field must map to one or more of:
- workspace/business profile
- CRM settings
- dashboard metrics/baselines
- analytics preferences
- lead/pipeline/task/calendar defaults
- marketing setup
- communications setup
- workflow draft generation
- AI/CRM intelligence configuration
- provider readiness state
- staff/permissions
- billing/trial/caps
- service/product knowledge
- onboarding review/admin approval state

Codex must make these mappings explicit in code and documentation. If a field is collected but not yet used by a CRM module, store it safely in onboarding payload/metadata and document where it should be consumed later.

User-friendly explanations:
Do not assume the user understands technical or business-centered terms.

For every technical/business term in onboarding, Codex must provide clear plain-English helper text, examples, placeholders, or tooltips.

Examples:
- “Pipeline stage” should explain: “The steps a lead or deal moves through before becoming a customer. Example: New Lead → Contacted → Estimate Sent → Won.”
- “Average deal value” should explain: “About how much a normal customer/job is worth. Example: if most jobs are around $750, enter 750.”
- “Lead source” should explain: “Where new leads usually come from. Example: Google, Facebook, referrals, website, cold outreach, trade shows.”
- “Conversion rate” should explain: “The percentage of leads who become paying customers. If you are not sure, leave this blank or use an estimate.”
- “Brand voice” should explain: “How your business should sound when messaging customers. Example: friendly, professional, direct, reassuring.”
- “Workflow” should explain: “A repeatable process the CRM can prepare for review, such as creating a follow-up task after a new lead is added.”
- “BYOK” should explain: “Bring Your Own Keys. You connect your own provider accounts and pay those providers directly.”
- “Managed mode” should explain: “SynaptiReach-managed provider setup with hard usage caps and credit packs where applicable.”
- “KPI” should explain: “A number you want to track to know if the business is improving, such as leads, appointments, revenue, or conversion rate.”

For every onboarding text input/textarea where useful, add placeholder/example content. The user should never stare at a blank box wondering what to write.

For dropdowns, provide practical starter options that can be edited later.

For optional questions, clearly mark them as “(optional)” and explain that they help pre-configure the CRM but can be completed later.

For required questions, mark with a red asterisk and explain why the information is needed.

CRM population behavior:
When onboarding is saved or submitted, Codex should create/update the appropriate real records/settings wherever safe, such as:
- business profile/settings
- CRM default settings
- pipeline stages
- lead source/tag defaults
- appointment settings
- marketing setup preferences
- workflow draft templates
- staff invite/permission records
- launch readiness status
- billing/trial mode
- service menu upload records
- extracted service/product knowledge records if available
- onboarding review records for admin approval later

Do not create fake customers, fake revenue, fake paid status, fake provider success, or fake subscription status for normal users.

Only the dedicated simulated test workspace/user may contain simulated data if that feature exists.

Codex must preserve real-data behavior for all normal users.

Review after implementation:
Codex must update the final report with:
- What new onboarding fields were added.
- Which CRM modules each field maps to.
- Which fields directly populate real CRM settings/records.
- Which fields are stored for later admin review.
- Which fields are optional vs required.
- Which helper text/tooltips/placeholders were added.
- Which CRM pages were inspected to decide what onboarding should collect.
- Any remaining CRM fields that should be collected later but were deferred.

## Latest Manual Test Results

- SQL ran successfully in Supabase.
- `/onboarding` loads.
- Continue works.
- Required red asterisks show correctly.
- Stripe checkout now returns to:
  `/onboarding?checkout=success&session_id=...&step=billing`
- Billing step now shows:
  “Stripe checkout submitted. Waiting for webhook confirmation.”
  “Billing state: checkout_created / Session cs_test_...”
- Save/resume keeps data.
- Future steps cannot be bypassed by clicking ahead.
- Test Resend, Test Ayrshare, and Test Twilio show safe readiness messages.
- CSV import worked with 50 rows.
- Submit for review behavior partly works.
- Service menu upload UI exists but failed because the onboarding-files bucket is missing.

## Issues to Fix Now

### 1. Onboarding submitted/review status page

- After a user submits onboarding for review, redirect them to a dedicated onboarding status page.
- Create a route such as:
  `/onboarding/status`
- This page should show:
  - submitted status
  - what is pending review
  - what is approved
  - what is missing
  - what needs edits
  - billing/webhook state
  - provider setup state
  - legal/company review state
  - email/SMS review state
  - service menu analysis state
  - staff setup state
  - lead import state
  - workflow draft state
- If onboarding is submitted but still pending approval/review/webhook confirmation, users should land on `/onboarding/status` when signing in, not the User CRM dashboard.
- If onboarding is incomplete/not submitted, users should land back on `/onboarding` at their saved step.
- If onboarding is fully approved/activated, users can access the User CRM dashboard.
- During review, users should be able to click “Edit onboarding” to return to onboarding and make changes.
- If they edit after submission, the final button should say “Update Onboarding,” not “Complete Onboarding.”
- Save submitted updates and return user to `/onboarding/status`.
- Do not activate trial or CRM access until Stripe webhook confirmation and required review conditions are satisfied.

### 2. Notification/toast behavior

- Current top-of-page popups are easy to miss.
- Replace or supplement them with viewport-positioned toast/pop-up notifications that appear wherever the user currently is on the page.
- These should be visible even if the user is scrolled down.
- Examples:
  - Required before continuing
  - Onboarding submitted for review
  - Imported 50 lead records
  - Stripe checkout submitted
- Notifications should not persist outside their relevant section/context.
- Example: “Saved. Imported 50 lead record(s).” should show on the Leads section and disappear after continuing or after a reasonable timeout.
- Avoid stale success/error messages bleeding into later sections.

### 3. Legal/company review wording

- Remove the phrase:
  “or intentionally skipped for review”
- Do not encourage fake businesses or skipped legal/company info.
- Replace with stricter wording:
  “I confirm the legal/company information provided is accurate to the best of my knowledge. If something is missing, I understand SynaptiReach may request clarification before activation.”
- Keep admin discretion possible later.
- Admin portal should eventually be able to approve, request edits, or reject suspicious onboarding submissions.
- Completion/submission should mark this as legal/company reviewed only after the confirmation is checked.

### 4. Stripe/billing review behavior

- Billing section can show checkout_created / pending_webhook after Stripe return.
- If Stripe checkout was submitted but webhook is not confirmed yet:
  - Allow “Submit onboarding for review.”
  - Do not activate trial.
  - Show status page with “Waiting for Stripe webhook confirmation.”
- Add a clear “Refresh/check Stripe status” action.
- If possible, add a safe server-side Stripe session check using the session_id to confirm session/payment/subscription state without replacing webhook ownership.
- Do not mark paid/subscribed/trialing unless webhook confirms or the app’s existing trusted billing state says so.
- Make sure billing data is saved after Stripe return.
- Make sure the billing section no longer says no card/setup has happened when checkout was submitted.
- Explain that SynaptiReach employees never see card details.

### 5. Email/SMS reviewed state bug

- User got blocker:
  “Choose how email integration should be handled.”
  “Choose how SMS integration should be handled.”
- But “Email integration reviewed” and “SMS integration reviewed” were not accepted as valid completion options.
- Fix integration step so explicit reviewed choices count.
- Add clear options:
  - Set up now
  - Use SynaptiReach-managed setup later
  - BYOK setup later
  - Not using this yet
  - Reviewed / handle later
- Save these choices.
- Mark readiness as complete or intentionally deferred/reviewed.
- Do not require Resend/Twilio full connection unless user selected them as launch-required.

### 6. Service/product menu upload bucket

- Fix the “Bucket not found” error:
  “Onboarding file storage is not ready. Create the onboarding-files bucket and retry. Bucket not found”
- Add safe setup instructions and schema/storage support for an onboarding-files Supabase storage bucket.
- If possible, make the app gracefully detect missing bucket and show admin setup-required state.
- Update docs with exact Supabase bucket requirement.
- Bucket name: `onboarding-files`
- It should support PDF, PNG, JPG/JPEG, WEBP.
- Store uploaded file path, metadata, mime type, size, workspace/user association, analysis_state, extraction_state.
- `crm_service_menu_uploads` already exists in schema; verify it is fully wired.
- If storage policies are needed, add safe SQL or clear instructions.
- Do not expose files across workspaces.
- Service/product menu upload should save metadata and create pending analysis/review state.

### 7. Service/product menu analysis

- The uploaded service/product menu should be analyzed when possible.
- Break it into structured CRM knowledge:
  - service/product name
  - category
  - price/range if visible
  - description
  - duration if visible
  - notes
  - source file
- Store extracted items in existing metadata or add a safe table if needed.
- If AI/document parsing is unavailable, store upload and create review task/recommendation for manual/admin analysis.
- Do not fake analysis success.
- Make extracted menu knowledge available later to CRM/AI assistant/communications/campaign drafting.

### 8. Remove “Agent” customer-facing language sitewide

- Remove customer-facing references to “agents” throughout the website and CRM.
- Replace with clearer language:
  - “AI reviews”
  - “automation checks”
  - “built-in intelligence”
  - “CRM intelligence”
  - “workflow reviews”
  - “AI recommendations”
- Example to replace:
  “Agent runs: 25 during managed trial”
  should become something like:
  “AI review checks: 25 during managed trial”
- Remove/reword:
  “Agent activity hard-stops…”
  to:
  “AI review checks hard-stop…”
- Keep internal code names/routes if needed to avoid breaking APIs, but remove customer-facing “agent/agents” wording from:
  - public pages
  - onboarding
  - trial/pricing
  - dashboard
  - settings
  - AI assistant/AI pages
  - docs/checklists only if they are customer-facing
- If `/ai-agents` route must remain for compatibility, change the page title/copy to “AI Automation” or “CRM Intelligence” while preserving route.

### 9. Managed SMS readiness copy

- In managed SMS readiness section, add Twilio/carrier fee range language.
- Mention that managed SMS is optional and approval-based.
- Include:
  - Twilio/carrier fees vary depending on registration, carrier, phone number, and campaign requirements.
  - SynaptiReach will review estimated fees with the user before charging.
  - SynaptiReach setup fee is $20.
  - User must approve Twilio/carrier fees and the $20 SynaptiReach setup fee before managed SMS readiness is marked complete.
- Add a min-to-max estimate range if appropriate, but phrase it safely as an estimate and not a guarantee.
- Example:
  “Estimated Twilio/carrier readiness costs may range from about $15–$100+ depending on registration and carrier requirements, plus SynaptiReach’s $20 setup fee. Final costs are reviewed before approval.”

### 10. Finish Later button

- Next to every Save button, add a “Finish Later” button.
- Finish Later should:
  - save all current progress
  - redirect user to the landing page homepage `/`
- If the user signs back in and onboarding is incomplete/not submitted, redirect them directly to `/onboarding` at the saved step.
- Do not send incomplete users to the CRM dashboard first.
- If onboarding is submitted and pending review, redirect them to `/onboarding/status`.
- If onboarding is approved/active, redirect them to CRM dashboard.

### 11. Staff section default visibility

- Staff section currently only expands after “Invite Staff Later.”
- Make staff invite/permission box visible by default.
- Keep “Invite Staff Later” as an option, but do not hide the staff form behind it.
- Staff permission presets should remain:
  - Owner/Admin
  - Sales Rep
  - Appointment Setter
  - Marketing Manager
  - Support/Communications
  - Read-only Analyst
- Ensure permissions persist:
  - leads
  - pipeline
  - tasks
  - calendar
  - communications
  - marketing
  - workflow
  - settings_read
  - admin

### 12. Step/submission behavior

- Users should proceed by Continue, not by clicking ahead.
- Manual step clicking must not bypass required validation.
- Completed previous steps can be revisited.
- Future locked steps should show why they are locked.
- Billing section can allow Continue only if billing state is eligible according to the current business rule:
  - confirmed payment method/webhook state, OR
  - checkout submitted/pending webhook if user is only submitting onboarding for review.
- Trial activation still requires webhook confirmation.

### 13. Complete/Submit button behavior

- If onboarding is not yet submitted and billing is pending webhook, button should say:
  “Submit Onboarding for Review”
- If onboarding is being edited after submission, button should say:
  “Update Onboarding”
- If everything is confirmed/approved, button can say:
  “Complete Onboarding”
- Remove unneeded “Open Settings” and “Open Lead” buttons.

### 14. Dashboard/auth redirect behavior

- Incomplete onboarding users should not be taken directly into the User CRM dashboard.
- Redirect rules:
  - onboarding incomplete and not submitted → `/onboarding` at saved step
  - onboarding submitted/pending review → `/onboarding/status`
  - onboarding approved/active → `/dashboard`
- Preserve ability for existing/test/admin users to access as needed if they already have complete/active state.

## Final Testing

Run:

```powershell
npm.cmd run build
```

Local/prod smoke:
- `/trial`
- `/signup?trial=managed`
- `/signup?trial=byok`
- `/onboarding`
- `/onboarding/status`
- `/dashboard`
- `/dashboard/settings`
- `/dashboard/workflow`

Manual tests to report:
1. Managed signup → onboarding → billing → Stripe → return to onboarding billing step.
2. Billing reflects checkout submitted/pending webhook.
3. Submit Onboarding for Review redirects to `/onboarding/status`.
4. Pending user signing in goes to `/onboarding/status`.
5. Incomplete user signing in goes to saved onboarding step.
6. Approved/active user can access dashboard.
7. Finish Later saves and redirects to home.
8. Legal/company confirmation no longer says “intentionally skipped.”
9. Email/SMS reviewed choices count correctly.
10. Service menu upload no longer fails due to missing bucket, or shows setup-required with exact admin instructions.
11. CSV import success notification does not persist into unrelated sections.
12. Staff invite form is visible by default.
13. Customer-facing “agent/agents” wording is removed/replaced.
14. Mobile/desktop layout has no text overflow.

## Files Codex May Need to Update

- `app/onboarding/page.tsx`
- `app/onboarding/status/page.tsx` if needed
- `app/dashboard/layout.tsx` or auth redirect logic if needed
- `app/api/onboarding/upload/route.ts`
- `lib/onboarding/server.ts`
- `lib/billing/stripe.ts` if needed
- `app/api/billing/subscription/checkout/route.ts` if needed
- `supabase/user_crm_full_completion_schema.sql` if storage/menu schema or policies are needed
- `docs/onboarding.md`
- `docs/codex/CODEX_TASK_LEDGER.md`
- `exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md`

## Final Report Requirements

Final report must include:
- Files changed
- SQL/storage changes
- Whether onboarding-files bucket setup is automated or manual
- Service menu upload status
- Service menu analysis status
- Stripe pending/review status behavior
- Onboarding status page behavior
- Redirect behavior
- Email/SMS reviewed state behavior
- Staff section behavior
- Agent language replacement status
- What new onboarding fields were added
- Which CRM modules each field maps to
- Which fields directly populate real CRM settings/records
- Which fields are stored for later admin review
- Which fields are optional vs required
- Which helper text/tooltips/placeholders were added
- Which CRM pages were inspected to decide what onboarding should collect
- Any remaining CRM fields that should be collected later but were deferred
- Build result
- Manual tests still required
