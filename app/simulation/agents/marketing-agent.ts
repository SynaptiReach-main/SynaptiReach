export {};
import { SimulationState } from "../kernel/simulationKernel";

export function marketingAgent(state: SimulationState) {
  if (state.tick % 3 !== 0) return null;

  return {
    type: "GENERATE_LEADS",
    payload: { count: 3 }
  };
}
