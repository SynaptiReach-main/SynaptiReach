export {};
import { DashboardState, Industry } from "./dashboard-types";

export function createInitialState(industry: Industry): DashboardState {
  const base = {
    saas: {
      leads: [
        { id: "1", stage: "New" },
        { id: "2", stage: "Contacted" },
      ],
      aiInsights: ["SaaS churn risk detected"],
    },
    ecommerce: {
      leads: [
        { id: "1", stage: "New" },
        { id: "2", stage: "New" },
      ],
      aiInsights: ["Cart abandonment rising"],
    },
    agency: {
      leads: [
        { id: "1", stage: "Qualified" },
        { id: "2", stage: "Contacted" },
      ],
      aiInsights: ["High-value pipeline detected"],
    },
  };

  return {
    industry,
    leads: base[industry].leads,
    aiInsights: base[industry].aiInsights,
    automationEvents: 0,
  };
}
