export {};
export type Industry = "saas" | "ecommerce" | "agency";

export type Lead = {
  id: string;
  stage: "New" | "Contacted" | "Qualified";
};

export type DashboardState = {
  industry: Industry;
  leads: Lead[];
  aiInsights: string[];
  automationEvents: number;
};

export type Action =
  | { type: "TICK" }
  | { type: "SET_INDUSTRY"; industry: Industry }
  | { type: "RESET" };
