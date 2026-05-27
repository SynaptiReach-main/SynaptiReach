# SynaptiReach Onboarding Stabilization Codex Prompt

Continue the SynaptiReach onboarding stabilization pass.

Do not redesign onboarding from scratch. Fix the current onboarding flow in place. Preserve the completed CRM usability work, OwnerFocusPanel, sidebar grouping, Review gated / Real records wording, dashboard routes, billing webhook ownership, Stripe safety, and existing save/resume architecture.

Latest manual test results:
- /onboarding loads.
- Continue buttons now work better.
- Required fields are marked with red asterisks.
- Stripe Checkout redirects to checkout.stripe.com successfully.
- After completing Stripe test card checkout, the app redirects to /dashboard/settings instead of returning to /onboarding at the Billing step.
- Settings shows:
  “Subscription checkout received / Billing setup submitted / Pending Stripe webhook confirmation”
- There is a Continue onboarding button in Settings and it does return to the Billing section.
- However, onboarding Billing still says:
  “Required before continuing. Set up payment method with Stripe, or choose Save and continue later knowing trial activation remains blocked.”
- The Billing step does not acknowledge that Stripe checkout was submitted / payment method setup is pending or complete.
- “Save and continue later” currently works but should be removed from the required billing step. Users must set up a Stripe payment method during onboarding before trial activation/completion.
- “Start 14-day trial through Stripe” works but redirects back to Settings instead of Onboarding.
- User could not proceed normally past Billing with Continue. They could only move forward by clicking the next step manually.
- Step navigation must be stricter: users should not be able to click ahead to future locked steps until current required step is completed through Continue.
- Complete Onboarding does not complete because readiness still shows billing/integration/legal blockers.
- User received complete-onboarding blocker:
  “Required before continuing: Legal/company information reviewed, Stripe card setup state is explicit, Email integration reviewed, SMS integration reviewed.”
- If Stripe card setup has been submitted and is pending webhook confirmation, onboarding should reflect that state clearly.
- Completion can remain blocked until actual webhook confirmation if required, but the UI must not act like no Stripe action happened.
- If card setup is confirmed, user should be able to submit onboarding for review.
- The submitted onboarding should be reviewable/approvable later in the admin portal.

Critical Stripe return behavior:
1. Update the Stripe subscription checkout route so onboarding-originated checkouts return to /onboarding, not /dashboard/settings.
2. Add an explicit return/cancel URL such as:
   /onboarding?checkout=success&session_id={CHECKOUT_SESSION_ID}&step=billing
   /onboarding?checkout=cancelled&step=billing
3. Preserve Settings-originated checkout behavior separately so Settings can still return to Settings.
4. Add a source/origin parameter when creating checkout:
   source=onboarding or return_to=onboarding
5. In /onboarding, read checkout success/cancel query params and:
   - save checkout session id
   - save billing setup state as checkout_submitted or pending_webhook
   - keep the user on or return the user to the Billing step
   - display clear status:
     “Stripe checkout submitted. Waiting for webhook confirmation.”
6. If webhook confirms setup/subscription/trialing state, show:
   “Payment method on file.”
7. Do not mark paid/subscribed/trialing without webhook confirmation.

Billing step requirements:
- Remove “Save and continue later” from the required billing step.
- User must set up Stripe payment method during onboarding.
- Billing step should show:
  - Why card is required.
  - SynaptiReach employees never see or access card details.
  - Payment is processed securely by Stripe.
  - Trial auto-renews to selected plan after 14 days unless canceled.
  - Usage caps and credit packs apply.
- Add a clear button:
  “Set up payment method with Stripe”
  or
  “Start 14-day trial through Stripe”
- After checkout submission, Continue should either:
  - allow proceeding if billing state is webhook-confirmed/eligible, or
  - show pending webhook state with a refresh/check status action.
- If the product decision is that users can submit for review while webhook is pending, add:
  “Submit onboarding for review”
  but do not activate trial until webhook confirmation.

Step navigation fix:
- Users must proceed step-by-step with Continue.
- Future steps should be locked until previous required steps are complete.
- Users can go back to previous completed steps.
- Clicking readiness items can jump only to previous/current relevant steps, not bypass locked future steps.
- Continue must validate required fields before advancing.
- Manual clicking next step should not bypass validation.

Legal/company review:
- Make the legal/company step clearly actionable.
- If “reviewed” is required, add an explicit checkbox:
  “I confirm the legal/company information is accurate or intentionally skipped for review.”
- If Tax ID last 4 is optional, label it exactly:
  “Tax ID last 4 (optional)”
- Completion should know when the legal/company review is complete/pending.

Email/SMS integration review:
- If Email and SMS are not required to activate the trial, do not block final onboarding completion on full integration setup.
- Instead require a reviewed/acknowledged state:
  “Email integration reviewed”
  “SMS integration reviewed”
- Add explicit choices:
  - Set up now
  - Use SynaptiReach-managed setup later
  - BYOK setup later
  - Not using this yet
- Save those choices and mark the readiness items reviewed/complete or intentionally skipped.
- Do not require Resend/Twilio to be fully connected unless the user selected those as required for launch.

Remove local connector:
- Remove the “Local Connector” option from AI Mode:
  “Optional future connector; does not block CRM launch.”

Brand voice default:
- Do not leave Brand voice blank.
- Add editable starter/example text, such as:
  “Friendly, professional, and helpful. Keep messages clear, confident, and action-oriented without sounding pushy. Explain next steps simply and focus on helping customers solve their problem quickly.”
- User can edit this.

Calendar onboarding:
- Add Calendar setup during onboarding.
- Include:
  “Prepare Google Calendar connection”
  “OAuth connection is completed later from provider settings.”
- Let user choose:
  - Connect Google Calendar later
  - Use internal CRM calendar only
  - Needs SynaptiReach help setting this up
- Save state to onboarding payload/settings.
- Do not block launch unless user marks it required.

Provider tests:
- Make sure Test Resend and Test Ayrshare buttons work.
- They must be server-side readiness checks only.
- They must not send an email, campaign, SMS, or social post.
- If missing provider keys, show useful setup-required status.
- Save readiness state.

Lead import:
- Keep Create starter lead working.
- Keep CSV import working.
- Add or document accepted CSV format.
- User will test later with a 50-lead fake CSV.
- Do not require CSV import if starter lead exists.

Staff permissions:
- Make sure staff permissions actually persist and map to real permissions:
  leads
  pipeline
  tasks
  calendar
  communications
  marketing
  workflow
  settings_read
  admin
- Add dropdown presets to help users start:
  - Owner/Admin
  - Sales Rep
  - Appointment Setter
  - Marketing Manager
  - Support/Communications
  - Read-only Analyst
- Presets should fill permissions but remain editable.
- Persist staff invite/name/email/phone/role/permissions.

Marketing setup:
- Add dropdown starter options users can choose and edit for their company/services.
- Examples:
  - Service appointment funnel
  - Free estimate funnel
  - Consultation funnel
  - Lead magnet funnel
  - Review/reputation campaign
  - Re-engagement campaign
  - New customer onboarding campaign
- Save chosen strategy/goals.

Workflows:
- Add more workflow draft options and explanations.
- Current drafts:
  - New lead follow-up
  - Stale deal follow-up
  - Appointment reminder
  - Opened-not-clicked campaign follow-up
  - Unread inbound response
  - Post-service review request
- Add additional draft workflows:
  - Missed call follow-up
  - Quote sent follow-up
  - Estimate reminder
  - No-show recovery
  - Review request after completed appointment
  - Referral request after converted/won customer
  - Payment/checkpoint reminder
  - Cold lead reactivation
  - High-intent website inquiry alert
  - New lead owner assignment
  - Trial usage/cap warning
  - Campaign reply triage
  - Upsell/cross-sell follow-up
  - Dormant customer winback
  - VIP/high-value lead escalation
- Each workflow card must explain:
  - What it does
  - Trigger
  - Condition
  - Draft action created
  - Why it is review-gated
- Created workflows must be drafts/review-gated, not auto-send.

Workflow notes:
- Add placeholder/example text in Workflow notes:
  “Example: Follow up with new leads within 5 minutes during business hours. Send appointment reminders 24 hours before a scheduled visit. Create review request tasks only after a job is marked complete.”

Help/DFY section:
- Move Help/DFY earlier in onboarding, ideally after Business or Legal/Business Profile.
- Reason: user should choose early whether they want self-guided setup, free guided help, or paid DFY before completing all steps.
- Preserve later readiness state.
- Add placeholder/example text in Help notes:
  “Example: I want help importing contacts, setting up Twilio, and building my first workflow. I prefer a 30-minute screen-share walkthrough before launch.”
- Keep free guidance vs paid DFY distinction clear.

Service/product menu upload:
- Add a place during onboarding where user can upload their service/product menu as PDF or image.
- Accepted: PDF, PNG, JPG/JPEG, WEBP.
- Save uploaded file metadata and storage path.
- Add review/extraction state:
  pending_analysis
  analyzed
  needs_review
- If AI/document parsing is available, analyze menu and break it into structured CRM knowledge:
  service/product name
  category
  price/range if visible
  description
  duration if visible
  notes
  source file
- If AI parsing is unavailable, store upload and create a review task/recommendation for later admin/manual review.
- Do not fake extraction success.
- Make this knowledge available later to CRM/AI assistant/communications/campaign drafting.

Completion behavior:
- Rename any remaining wrong labels to “Complete Onboarding.”
- Remove unneeded “Open Settings” and “Open Lead” buttons from onboarding completion/readiness area.
- Completion should:
  - show blockers clearly
  - make blockers clickable to the relevant step
  - allow “Submit for review” only if required minimum data is present and Stripe setup is submitted/confirmed according to business rule
  - not activate trial until Stripe webhook confirms billing state
- If onboarding is submitted for review, save that state and show it in dashboard/settings for later admin portal work.

Save/resume:
- If user chooses to come back later, all progress and input must be saved.
- Returning to /onboarding must restore exact step and data.
- Dashboard Continue onboarding should return to the saved step.
- Save should not mark incomplete required steps as complete.
- Continue should save and validate before advancing.

Responsive/UI:
- Continue improving desktop and mobile layout.
- No text should overflow cards.
- Buttons should wrap safely.
- Cards should be touch-friendly.
- Long email/price/API-like labels should wrap/break.

Testing:
Run:
npm.cmd run build

Local smoke:
- /trial
- /signup?trial=managed
- /signup?trial=byok
- /onboarding
- /dashboard
- /dashboard/settings
- /dashboard/workflow

Manual browser tests to report:
1. Managed signup → onboarding → billing → Stripe → return to onboarding billing step.
2. BYOK signup → onboarding → billing → Stripe → return to onboarding billing step.
3. Billing step reflects checkout submitted/pending/confirmed state.
4. Save/resume works after leaving and returning.
5. Future step clicking cannot bypass required validation.
6. Continue advances only after required fields.
7. Legal/company reviewed state can be completed.
8. Email/SMS reviewed states can be completed without full provider connection.
9. Test Resend and Test Ayrshare show useful server-side readiness status.
10. Staff permission presets persist.
11. Workflows have expanded explanations and save draft workflows.
12. Help/DFY appears earlier and saves.
13. Service/product menu upload saves metadata and creates analysis/review state.
14. Complete Onboarding / Submit for Review works according to billing state.

Update:
- docs/onboarding.md
- docs/codex/CODEX_TASK_LEDGER.md
- exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md
- supabase/user_crm_full_completion_schema.sql if storage/upload/menu tables or columns are needed.

Final report:
- Files changed
- SQL/schema changes
- Stripe return URL behavior
- Billing state handling
- Save/resume status
- Locked step navigation status
- Completion/submission status
- Provider test status
- Menu upload status
- Build result
- Manual tests still required
