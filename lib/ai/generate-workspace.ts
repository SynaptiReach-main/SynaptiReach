export {};
export type WorkspaceBlueprint = {
  businessType: string;
  crm: {
    entities: string[];
    fields: Record<string, string[]>;
  };
  pipeline: string[];
  aiAgents: string[];
};

/**
 * AI Workspace Generator (Production-Ready)
 * Generates REAL CRM structures used by actual SaaS tenants
 */
export function generateWorkspaceBlueprint(input: {
  industry: string;
  businessName?: string;
  goals?: string[];
}): WorkspaceBlueprint {

  const industry = input.industry?.toLowerCase() || "";

  // 🏠 Home services
  if (industry.includes("roof") || industry.includes("construction")) {
    return {
      businessType: "home_services",
      crm: {
        entities: ["leads", "estimates", "jobs", "customers"],
        fields: {
          leads: ["name", "phone", "address", "source", "status"],
          jobs: ["jobType", "price", "scheduleDate", "status"]
        }
      },
      pipeline: [
        "new_lead",
        "contacted",
        "estimate_sent",
        "scheduled",
        "in_progress",
        "completed"
      ],
      aiAgents: [
        "lead_responder",
        "estimate_generator",
        "follow_up_agent"
      ]
    };
  }

  // 🏋️ Fitness / gyms
  if (industry.includes("gym") || industry.includes("fitness")) {
    return {
      businessType: "membership_business",
      crm: {
        entities: ["members", "leads", "subscriptions"],
        fields: {
          members: ["name", "phone", "membershipType", "status"]
        }
      },
      pipeline: [
        "lead",
        "trial",
        "member",
        "active",
        "churn_risk",
        "renewed"
      ],
      aiAgents: [
        "trial_converter",
        "retention_agent",
        "upsell_agent"
      ]
    };
  }

  // ⚙️ Default SaaS CRM
  return {
    businessType: "general_crm",
    crm: {
      entities: ["leads", "deals", "contacts", "activities"],
      fields: {
        leads: ["name", "phone", "email", "status", "source", "priority"]
      }
    },
    pipeline: [
      "new_lead",
      "contacted",
      "qualified",
      "proposal_sent",
      "closed_won",
      "closed_lost"
    ],
    aiAgents: [
      "lead_qualifier",
      "follow_up_agent",
      "pipeline_optimizer"
    ]
  };
}
