# Phase 1 - AI Mode Foundation

Build the foundation for SynaptiReach AI processing modes.

Modes:
- SynaptiReach Managed
- Bring Your Own Keys
- Local Connector

Tasks:
1. Inspect current AI usage, AI helpers, environment variables, and UI settings.
2. Create or reuse a central AI mode configuration model.
3. Add organization/user-level AI settings where appropriate.
4. Add mode-aware AI routing abstraction without changing every feature at once.
5. Build settings UI showing the three modes.
6. Show clean disabled states for modes not configured.
7. Add clear labels explaining each mode.

AI mode UI language:
- SynaptiReach Managed: "Use SynaptiReach's managed AI processing."
- Bring Your Own Keys: "Use your own provider API keys."
- Local Connector: "Use a secure local connector for compatible local models."

Requirements:
- Do not wire fake providers.
- Do not claim local connector is active unless real status exists.
- Preserve current AI features.
- Add backward-compatible defaults.
- If no AI settings table exists, create a data-ready abstraction and migration plan.
