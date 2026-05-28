# SynaptiReach Codex Memory Rules

This repository is connected to the user's Obsidian second brain.

Obsidian vault:

C:\Users\nikna\Documents\Obsidian Vault

Project notes:

C:\Users\nikna\Documents\Obsidian Vault\01-Projects\SynaptiReach

Graph maps:

C:\Users\nikna\Documents\Obsidian Vault\01-Projects\SynaptiReach\Graph Maps

## Before coding

Check:

- docs/knowledge-map.md
- docs/architecture.md
- docs/decisions.md

## While coding

When creating or modifying important systems, update the related docs.

When creating new important files, components, routes, APIs, database structures, agents, automations, or features, add or update an Obsidian-compatible note.

## Obsidian linking rules

Use wiki links:

- [[Simulation Kernel]]
- [[Dashboard Preview]]
- [[Business Type Selector]]
- [[Investor Demo Mode]]
- [[Admin Portal]]
- [[User CRM]]

Use typed relationships:

- implements
- depends_on
- blocks
- replaces
- relates_to
- owned_by
- tested_by
- documents
- contains
- part_of
- connects_to
- controls
- must_not_break

## Breadcrumbs syntax

implements:: [[CRM Simulation UI]]
depends_on:: [[SaaS Metrics Engine]]
controls:: [[Dashboard Preview]]
documents:: [[SynaptiReach]]
part_of:: [[User CRM]]

## Data rules

Do not use fake data, mock users, fake analytics, fake prospects, fake service orders, fake revenue, or simulated CRM records unless the file is explicitly part of the demo or simulation layer.

Use real app state, real database structures, real authenticated users, real permissions, and clean empty states when data is unavailable.

## Design rules

Preserve the SynaptiReach design system:

- dark theme
- cyan-to-green gradients
- no solid green usage
- large prominent logo or wordmark styling
- existing BackgroundSystem grid, glow pulse, and synapse animations

## Obsidian MOC Maintenance

Whenever new SynaptiReach notes, prompts, runbooks, architecture docs, API/security docs, branding docs, or CRM/admin prompts are created or renamed, update:

C:\Users\nikna\Documents\Obsidian Vault\01-Projects\SynaptiReach\SynaptiReach MOC.md

Keep the MOC grouped into:

- SynaptiReach Prompts
- User CRM Prompts
- Admin Portal Prompts
- Branding / API / Environment
- Codex Runbooks
- Architecture / Decisions / Code Maps
- Core Systems

Use Obsidian wiki links and Breadcrumbs-compatible typed relationships.

Do not remove existing links unless the linked file no longer exists or has been renamed.

## Codex + Local AI Agent Workflow

This repo uses Codex for implementation work and local Ollama models for planning, review, and second-brain maintenance.

### Local AI model roles

- llama3.2:1b routes tasks, summarizes plans, and prepares Codex prompts.
- qwen2.5-coder:1.5b performs fast code-diff summaries.
- qwen2.5-coder:3b performs balanced TypeScript, Next.js, API, and React review.
- qwen2.5-coder:7b performs deeper code review when waiting several minutes is acceptable.
- phi4-mini performs risk review and second-opinion planning.
- moondream performs lightweight screenshot and UI review.
- llava performs heavier screenshot and UI review when needed.
- nomic-embed-text and mxbai-embed-large are used for future semantic memory over Obsidian notes, Codex session logs, architecture notes, decision docs, and repo docs.

### Required Codex behavior

Before major code changes, read:

- AGENTS.md
- docs/knowledge-map.md
- docs/architecture.md
- docs/decisions.md
- docs/onboarding.md when onboarding is involved
- docs/codex/CODEX_TASK_LEDGER.md when continuing previous work

When making code changes:

- Do not use fake data, mock users, fake analytics, fake prospects, fake service orders, fake revenue, or simulated CRM records unless the file is explicitly part of the demo or simulation layer.
- Preserve the SynaptiReach design system.
- Update architecture, decision, knowledge-map, onboarding, or Codex ledger docs when relevant.
- Do not commit or push unless explicitly asked.
- Do not expose secrets.
- Do not edit .env.local.
- Do not delete files unless explicitly asked.

### Obsidian sync requirement

After important Codex work, update relevant Obsidian notes and regenerate graph maps:

- C:\Users\nikna\Documents\Obsidian Vault\01-Projects\SynaptiReach\SynaptiReach MOC.md
- C:\Users\nikna\Documents\Obsidian Vault\01-Projects\SynaptiReach\System Status Dashboard.md
- C:\Users\nikna\Documents\Obsidian Vault\01-Projects\SynaptiReach\Architecture\Local AI Agent Team.md
- C:\Users\nikna\Documents\Obsidian Vault\01-Projects\SynaptiReach\Architecture\Local AI Model Router.md

Use Obsidian wiki links and Breadcrumbs-compatible relationships.
