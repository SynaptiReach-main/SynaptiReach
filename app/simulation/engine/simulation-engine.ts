export {};
import { SimulationKernel, SimulationState } from "../kernel/simulationKernel";

const initialState: SimulationState = {
  tick: 0,
  company: {
    cash: 10000,
    mrr: 1000,
    churnRate: 0.05,
    acquisitionRate: 0.1,
  },
  leads: [],
  events: [],
};

class SimulationEngine {
  private kernel: SimulationKernel;
  private listeners: Function[] = [];

  constructor() {
    this.kernel = new SimulationKernel(initialState);

    // start loop
    setInterval(() => {
      this.kernel.dispatch({ type: "TICK" });
      this.emit();
    }, 1000);
  }

  subscribe(listener: Function) {
    this.listeners.push(listener);
  }

  emit() {
    const state = this.kernel.getState();
    this.listeners.forEach(l => l(state));
  }

  getState() {
    return this.kernel.getState();
  }

  dispatch(event: any) {
    this.kernel.dispatch(event);
    this.emit();
  }
}

export const simulationEngine = new SimulationEngine();
