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
