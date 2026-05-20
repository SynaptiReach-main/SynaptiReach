export function adminReadAccess() {
  const enabled = process.env.CRM_ADMIN_READ_ENABLED === "true";
  return {
    enabled,
    message: enabled
      ? ""
      : "Admin record viewing is disabled until CRM_ADMIN_READ_ENABLED=true is configured with final admin access controls.",
  };
}

export function verifyAdminActionSecret(secret: string | null) {
  const expected = process.env.CRM_ADMIN_ACTION_SECRET || "";
  return Boolean(expected && secret && secret === expected);
}
