import { getWorkspaces } from "@/server/services/workspace.service";

export async function fetchWorkspaces() {
  return getWorkspaces();
}
