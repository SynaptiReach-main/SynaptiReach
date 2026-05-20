# Phase 4 - Migrations, System Defaults, and No Fake Data

Create safe migrations for missing infrastructure.

Allowed system defaults:
- Default role definitions
- Default permission keys
- Default empty settings
- Default system templates only if clearly real product defaults

Not allowed:
- Fake users
- Fake clients
- Fake contacts
- Fake leads
- Fake analytics
- Fake revenue
- Fake prospects
- Fake service orders

Make migrations idempotent where possible.
Document how to apply migrations.
