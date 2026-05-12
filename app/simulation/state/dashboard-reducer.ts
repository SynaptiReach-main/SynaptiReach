export {};
import { DashboardState, Action } from "./dashboard-types";
import { createInitialState } from "./dashboard-state";

export const initialState = createInitialState("saas");

export function dashboardReducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {

    case "SET_INDUSTRY":
      return createInitialState(action.industry);

    case "TICK":
      return {
        ...state,
        automationEvents: state.automationEvents + 1,
        leads: state.leads.map(l =>
          l.stage === "New" ? { ...l, stage: "Contacted" } : l
        ),
        aiInsights:
          state.industry === "saas"
            ? ["Churn model recalibrated"]
            : state.industry === "ecommerce"
            ? ["Revenue velocity increased"]
            : ["Pipeline scoring adjusted"],
      };

    case "RESET":
      return createInitialState(state.industry);

    default:
      return state;
  }
}
