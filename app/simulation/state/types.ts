export {};
export type Lead = {
  id: string;
  stage: "New" | "Contacted" | "Qualified" | "Won";
};

export type Campaign = {
  id: string;
  type: string;
  status: string;
  performance: number;
};

export type DashboardState = {
  leads: Lead[];
  campaigns: Campaign[];
  aiInsights: string[];
  automationEvents: string[];
  tick: number;
};
