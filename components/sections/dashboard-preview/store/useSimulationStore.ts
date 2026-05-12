"use client";

import { useReducer } from "react";
import { createInitialState, simulationReducer } from "../kernel/simulation-kernel";

export function useSimulationStore() {
  const [state, dispatch] = useReducer(
    simulationReducer,
    undefined,
    createInitialState
  );

  return { state, dispatch };
}
