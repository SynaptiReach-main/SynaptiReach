import type { WorkspaceContext } from "@/lib/auth/getWorkspaceContext";

export const CRM_PERMISSIONS = [
  "dashboard:view",
  "leads:view",
  "leads:create",
  "leads:edit",
  "leads:delete",
  "leads:import",
  "pipeline:view",
  "pipeline:create",
  "pipeline:edit",
  "pipeline:archive",
  "tasks:view",
  "tasks:create",
  "tasks:edit",
  "tasks:complete",
  "tasks:assign",
  "calendar:view",
  "calendar:create",
  "calendar:edit",
  "marketing:view",
  "marketing:create",
  "marketing:edit",
  "marketing:schedule",
  "marketing:cancel",
  "communications:view",
  "communications:respond",
  "communications:send",
  "workflows:view",
  "workflows:create",
  "workflows:edit",
  "workflows:run",
  "ai:view",
  "ai:run_agents",
  "analytics:view",
  "settings:view",
  "settings:edit",
  "billing:view",
  "billing:edit",
  "staff:manage",
] as const;

export type CRMPermission = (typeof CRM_PERMISSIONS)[number];

export function hasPermission(
  context: WorkspaceContext,
  permission: CRMPermission
) {
  return (
    context.permissions.includes("*") ||
    context.permissions.includes(permission)
  );
}

export function missingPermissionMessage(permission: CRMPermission) {
  return `You do not have permission to perform this action: ${permission}.`;
}
