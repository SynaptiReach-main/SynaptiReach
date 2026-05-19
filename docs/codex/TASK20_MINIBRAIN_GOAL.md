/goal Finish SynaptiReach Task 20 mini-brain CRM-wide integration and verification.

Read first:
- docs/codex/SYNAPTIREACH_MASTER_V9.md
- docs/codex/CODEX_TASK_LEDGER.md
- exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md
- lib/intelligence/*
- app/api/intelligence/*
- app/dashboard/page.tsx
- app/dashboard/ai_assistant/page.tsx
- all User CRM dashboard pages under app/dashboard

Current known status:
- Local-AI architecture is preserved and should not be redone.
- Mini-brain foundation exists.
- helperResults types exist.
- Task 20 is still partial.
- Next work is to populate helperResults from each domain module and wire them into per-record modals, page panels, workflow signals, and recommendations.
- Task 3 live bootstrap/seed/tick verification still needs configured CRM_TEST_* secrets, but do not block all code work on unavailable secrets.

Objective:
Fully upgrade Task 20 so the deterministic mini-brain feels as AI-like as possible without external AI API calls.

Required work:
1. Inspect current mini-brain implementation.
2. Populate helperResults from domain modules:
   - lead scorecards
   - deal health cards
   - campaign health cards
   - conversation summaries
   - workflow signals
   - task priority cards
   - appointment prep cards
   - billing/usage forecasts
   - setup readiness
   - staff workload
   - business health
   - safety checks
   - ranked actions
   - rule-based draft templates
3. Integrate helperResults into:
   - /dashboard
   - /dashboard/analytics
   - /dashboard/leads
   - /dashboard/pipeline
   - /dashboard/tasks
   - /dashboard/calendar
   - /dashboard/marketing
   - /dashboard/communications
   - /dashboard/workflow
   - /dashboard/ai_assistant
   - /dashboard/settings
4. Add compact premium UI panels and modals where useful.
5. Add safe review-gated actions only:
   - create task draft
   - create workflow draft
   - draft message
   - open related record
   - dismiss/deny
   - approve where review-gated
6. Do not auto-send email/SMS/social.
7. Do not auto-charge.
8. Do not expose secrets.
9. Preserve all existing working CRM features.
10. Keep test/simulation data isolated to the explicit test workspace only.
11. Use real CRM data for normal users.
12. Run npm.cmd run build after each major checkpoint.
13. Update exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md.
14. Update docs/codex/CODEX_TASK_LEDGER.md with exact completion status after each checkpoint.

Validation:
- npm.cmd run build must pass.
- /api/intelligence/summary must work.
- POST /api/intelligence/run with {"persist":false} must work.
- Empty workspace must not crash.
- Missing AI providers must not crash.
- Mini-brain must not require Gemini/OpenRouter/OpenAI/Ollama.
- Page loads must not persist duplicate recommendations repeatedly.
- Final report must list completed, skipped, partial, remaining, files changed, commands tested, and whether another pass is needed.

Stopping condition:
Stop when Task 20 is CRM-wide integrated, build passes, checklist is updated, task ledger is updated, and any remaining Task 20 limitations are clearly documented.
