# Phase 3 - Ollama and Local Model Discovery

Build data-ready support for local provider/model discovery.

Target provider:
- Ollama, usually available locally at a configurable endpoint such as localhost:11434, but do not hardcode this as the only supported endpoint.

Features:
1. Provider type selector.
2. Configurable local endpoint for connector-side use.
3. Model discovery result interface.
4. Model list UI.
5. Model capabilities metadata where available.
6. Default local model selection.
7. Test prompt action.
8. Status/error display.

Important:
- The deployed web app should not directly assume access to the user's localhost.
- Prefer connector-mediated discovery.
- Direct localhost testing may only be used in local/dev contexts if safe.
- Show clear "Connector required" state in production if direct access is unavailable.

No fake models.
No fake discovery success.
Use real connector/provider response or empty/error states.
