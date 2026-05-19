import { loadCRMContext } from "@/lib/crm/data";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import type { MiniBrainContext } from "./types";

export async function buildMiniBrainContext(request?: Request): Promise<MiniBrainContext> {
  let context: MiniBrainContext;
  try {
    context = await loadCRMContext(request);
  } catch (error) {
    const friendly = friendlySupabaseError(error);
    if (!friendly.setupRequired && !friendly.missingSchema) {
      throw error;
    }

    context = {
      leads: [],
      campaigns: [],
      activity: [],
      communications: [],
      deals: [],
      tasks: [],
      workflows: [],
      workflowRuns: [],
      appointments: [],
      agentRuns: [],
      recommendations: [],
      notifications: [],
      staff: [],
      providerConnections: [],
      billing: null,
      usage: [],
      settings: null,
      metrics: {},
      schemaWarnings: friendly.missingSchema ? [friendly.message] : [],
      workspaceWarnings: friendly.setupRequired ? [friendly.message] : [],
      workspaceId: null,
      companyId: null,
      userId: null,
      isTestWorkspace: false,
    };
  }
  const settingsMetadata = context.settings?.metadata || {};

  return {
    ...context,
    workspaceId: context.settings?.workspace_id || null,
    companyId: context.settings?.company_id || null,
    userId: context.settings?.user_id || null,
    isTestWorkspace:
      settingsMetadata?.is_test_data === true ||
      settingsMetadata?.simulation_source === "synaptireach_test_workspace",
  };
}
