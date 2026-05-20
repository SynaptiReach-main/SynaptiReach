# Phase 2 - Local Connector Pairing and Security

Build the Local Connector registration and pairing design.

Goals:
- A user/organization can register a local connector.
- The connector has a secure identity.
- The UI can show whether a connector is paired, pending, active, offline, or revoked.

Connector states:
- Not configured
- Pairing pending
- Paired
- Online
- Offline
- Revoked
- Error

Build:
1. Connector settings page.
2. Pairing token creation flow.
3. Pairing token expiration.
4. Connector name and device label.
5. Last seen timestamp.
6. Revoke connector action.
7. Connector audit events.
8. Security warnings and safe empty states.

Security requirements:
- Pairing tokens must expire.
- Store token hashes, not raw tokens, when possible.
- Do not expose connector secrets in client UI.
- Revoking connector must immediately disable routing.
- Add audit logs for pair/revoke/status changes.
- Do not hardcode fake online status.
