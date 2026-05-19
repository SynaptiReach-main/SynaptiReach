# Phase 8 - Mobile, Security, Seat Limits, and Production Polish

Use `00_master_user_staff_portal_prompt.md` as the governing instruction.

## Goal

Harden the User Staff Portal for production readiness, mobile workflows, data security, and future billing/seat-limit support.

## Mobile Requirements

Ensure the following workflows are responsive and usable on phones:

- Accept team invite.
- Switch organization if multiple memberships exist.
- View My Work.
- View assigned leads.
- Add notes.
- Complete tasks.
- Send or draft follow-up if allowed.
- View contact info.
- Update opportunity stage if allowed.
- Review approval.
- Use Staff AI Copilot.
- View notifications.
- Update appointment/job status if supported.
- Reassign work if manager/owner.

Mobile UI should be fast, clean, and not cramped.

## Security Hardening

Review and harden:

- Organization-level data isolation.
- Server-side permission checks.
- Client-side permission rendering.
- Supabase RLS policies if used.
- Deactivated user access.
- Invite token expiration.
- Invite token revocation.
- Role/permission change logging.
- Export restrictions.
- Destructive action restrictions.
- Billing access restrictions.
- AI context restrictions.
- Integration access restrictions.
- Cross-organization switching.

Do not rely only on hiding UI buttons.

## Seat Limit Readiness

Prepare architecture for future seat-based plans.

Possible limits:

- Max team members.
- Max active staff.
- Max AI-enabled staff.
- Max managers.
- Max campaign editors.
- Max monthly AI actions.
- Max assigned contacts per staff.
- Feature availability by plan.

Behavior:

- Use real plan/subscription data if available.
- If plan data is unavailable, create data-ready hooks and clean empty states.
- Do not fake billing.
- Do not hardcode fake limits unless using explicit configuration constants documented as defaults.
- Show upgrade prompt only if real plan/limit data supports it or behind clearly named placeholder-free capability checks.

## Quality Checks

Run or prepare:

- Typecheck.
- Lint.
- Build.
- Route smoke test.
- Permission smoke test.
- Empty state review.
- Mobile responsive review.
- No mock data review.
- No fake analytics review.
- No cross-organization leak review.
- Existing User CRM regression check.

## Loading and Error States

Every User Staff feature should have:

- Loading state.
- Error state.
- Empty state.
- Permission denied state.
- Deactivated membership state.
- Invite expired state.
- Invite canceled state.

## Accessibility

Add reasonable accessibility basics:

- Keyboard-accessible dialogs/buttons.
- Proper labels.
- Focus states.
- Sufficient contrast.
- Clear status messages.
- Responsive text layout.

## Final Deliverables

- Mobile polish.
- Security hardening.
- Seat limit readiness.
- Permission regression review.
- Empty/loading/error states.
- Production readiness checklist.
- Existing User CRM remains intact.
- No fake data.
