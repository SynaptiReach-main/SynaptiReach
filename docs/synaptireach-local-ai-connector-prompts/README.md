# SynaptiReach Local AI / Local Connector Prompt Pack

Purpose: build optional Local AI / Local Connector support for SynaptiReach without making local AI required for launch.

Read order:
1. 00_master_local_ai_connector_prompt.md
2. 01_ai_mode_foundation.md
3. 02_local_connector_pairing_security.md
4. 03_ollama_model_discovery_runtime.md
5. 04_ai_routing_fallbacks_privacy.md
6. 05_admin_controls_user_settings_ui.md
7. 06_testing_security_production_polish.md

Codex starter prompt:

Read the files in docs/synaptireach-local-ai-connector-prompts.

Start with:
- 00_master_local_ai_connector_prompt.md
- 01_ai_mode_foundation.md

Implement Phase 1 first.

Keep SynaptiReach web-first. Local Connector must be optional and must not block launch.
Do not use mock data or fake connector status. Use real app state, real settings, real authenticated users, and clean disabled/empty states where connector functionality is not configured.
