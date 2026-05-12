export {};
import { SimulationState } from "../kernel/simulationKernel";

export function crmAgent(state: SimulationState) {
  return {
    type: "ADVANCE_PIPELINE"
  };
}
