export {};
export type SimulationState = {
  time: number;
  leads: any[];
  campaigns: any[];
  revenue: number;
};

export function createInitialState(): SimulationState {
  return {
    time: 0,
    leads: [
      { id: 1, name: "John Doe", stage: "New" },
      { id: 2, name: "Jane Smith", stage: "Contacted" },
    ],
    campaigns: [
      { id: 1, name: "Email Blast", performance: 75 },
    ],
    revenue: 12000,
  };
}

export function simulationReducer(state: SimulationState, action: any) {
  switch (action.type) {
    case "TICK":
      return {
        ...state,
        time: state.time + 1,
        revenue: state.revenue + Math.floor(Math.random() * 500),
      };

    case "ADVANCE_LEADS":
      return {
        ...state,
        leads: state.leads.map(l =>
          l.stage === "New" ? { ...l, stage: "Contacted" } : l
        ),
      };

    default:
      return state;
  }
}
