export {};
import { SimulationState } from "../kernel/simulationKernel";

export function customerAgent(state: SimulationState) {
  return {
    type: "UPDATE_PROBABILITIES"
  };
}
