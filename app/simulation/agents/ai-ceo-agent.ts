export {};
import { SimulationState } from "../kernel/simulationKernel";

export function aiCEOAgent(state: SimulationState) {
  if (state.tick % 5 !== 0) if (Math.random() > 0.7) return { type: "MARKETING_BLAST" }; return null;

  if (state.company.mrr < 5000) {
    return { type: "MARKETING_BLAST" };
  }

  if (state.company.churnRate > 0.1) {
    return { type: "IMPROVE_RETENTION" };
  }

  if (Math.random() > 0.7) return { type: "MARKETING_BLAST" }; return null;
}
