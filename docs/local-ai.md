# Local AI Development

SynaptiReach can run lightweight AI tasks against a local Ollama model during development, then fall back to the backend provider layer when Ollama is unavailable or the task is too heavy.

## Install Ollama on Windows

1. Download and install Ollama from https://ollama.com/download/windows.
2. Restart PowerShell after installation so `ollama` is available on `PATH`.
3. Pull the local Gemma model:

```powershell
ollama pull gemma3:1b
```

## Test The Model

Run a direct model test:

```powershell
ollama run gemma3:1b "Say ready."
```

Run an API test:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:11434/api/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"model":"gemma3:1b","messages":[{"role":"user","content":"Say ready."}],"stream":false}'
```

## Environment Variables

Add these to `.env.local` for local development. This is a Next.js app, so the server-side names are preferred:

```env
AI_DEFAULT_PROVIDER=ollama-dev
AI_ENABLE_LOCAL=true
AI_ENABLE_OLLAMA_DEV=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:1b
```

The older `VITE_*` names remain supported as backward-compatible aliases for existing local setup:

```env
VITE_AI_DEFAULT_PROVIDER=ollama-dev
VITE_AI_ENABLE_LOCAL=true
VITE_AI_ENABLE_OLLAMA_DEV=true
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=gemma3:1b
```

Private cloud keys such as OpenAI, Gemini, OpenRouter, or Claude keys must remain server-side only. Do not expose them with `NEXT_PUBLIC_*`.

Ollama dev routing is development-only. Production customers must not depend on a developer laptop's `localhost`.

## Routing Order

`aiClient.runTask()` routes in this order:

1. Deterministic mini-brain output when a task already has safe deterministic text available.
2. `ollama-dev`, only for local development and local-allowed tasks.
3. Future `customer-local` provider when a workspace has explicitly configured and enabled it.
4. SynaptiReach-managed backend/cloud providers when task caps allow them.
5. Mock fallback only for safe development or demo states.

## Local-First Tasks

These tasks can use Ollama Gemma first in development:

- `lead_summary`
- `draft_followup`
- `score_lead`
- `customer_persona_simulation`
- `campaign_ideas`
- lightweight `pipeline_analysis` suggestions

## Backend Or Cloud Fallback

These tasks stay on backend/cloud/mock fallback by default:

- `investor_report`
- `autonomous_simulation`
- complex strategy reports
- large multi-agent simulations
- long-context production analysis
- production-only secure tasks

If Ollama is closed or unreachable, SynaptiReach catches the local error and returns a normalized AI result with `providerUsed`, `local`, `fallbackUsed`, and `task` metadata.

## Future Customer-Local AI

The current local Ollama path is for SynaptiReach development. Future customer-local AI will be workspace-scoped and disabled by default.

Planned workspace fields:

- `provider`: `customer-local`
- `status`: `setup_required`, `connected`, or `unavailable`
- `endpointUrl`: customer-owned endpoint URL
- `model`: model name served by that endpoint
- test connection action: `POST /api/ai/customer-local/test`

Future customer-local options:

- Manual local endpoint URL for technical users who already run an Ollama-compatible service.
- SynaptiReach Local AI Connector for guided desktop setup.
- Self-hosted Docker connector for teams that want a private LAN or cloud-hosted bridge.
- Browser WebLLM/WebGPU experimental mode for small tasks where supported by the user's browser and hardware.

## Troubleshooting

- If PowerShell cannot find `ollama`, close and reopen PowerShell to refresh `PATH`.
- Restart Ollama from the Windows tray app if the API stops responding.
- Check the local API at http://localhost:11434.
- Confirm the model exists with `ollama list`.
- Pull the model again if needed: `ollama pull gemma3:1b`.
