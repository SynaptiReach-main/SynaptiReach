export interface WorkspaceProfile {
  workspaceId: string;

  business: {
    name: string;
    industry: string;
    businessType: "service" | "product" | "hybrid";
    website: string;
    phone: string;
    teamSize: string;
    revenueRange: string;
  };

  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    tone: string;
  };

  crm: {
    template: string;
    modules: string[];
  };

  ai: {
    mode: "managed" | "byok";
    providers: {
      openai?: string;
      gemini?: string;
      anthropic?: string;
    };
  };

  messaging: {
    enabled: boolean;
    agreedToFees: boolean;
    estimatedSetupFee: number;
    provider: "managed" | "byok";
    twilio?: {
      sid?: string;
      token?: string;
      phone?: string;
    };
  };

  email: {
    provider: "managed" | "byok";
    resendApiKey?: string;
    domain?: string;
  };

  integrations: {
    facebook: boolean;
    instagram: boolean;
    slack: boolean;
    teams: boolean;
  };

  uploads: {
    knowledgeFiles: string[];
    csvImports: string[];
  };
}
