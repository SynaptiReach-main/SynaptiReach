export {};
"use client";

import { useEffect, useState } from "react";
import { simulationEngine } from "./simulation-engine";

export function useSimulation() {
  const [state, setState] = useState(simulationEngine.getState());

  useEffect(() => {
    simulationEngine.subscribe(setState);
  }, []);

  return {
    state,
    dispatch: simulationEngine.dispatch.bind(simulationEngine),
  };
}
