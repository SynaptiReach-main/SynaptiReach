export {};
import { runAIEngine } from "./ai-layer";
"use client";

import { useEffect, useState } from "react";

/**
 * INITIAL STATE
 */
const initialState = {
  leads: 12,
  deals: 5,
  revenue: 24000,
  aiMessages: [
    "System initialized",
    "Monitoring business activity...",
  ],
};

/**
 * REDUCER (PURE)
 */
function reducer(state: any, event: any) {
  switch (event.type) {
    case "ADD_LEAD":
      return { ...state, leads: state.leads + 1 };

    case "CONVERT_LEAD":
      if (state.leads <= 0) return state;
      return {
        ...state,
        leads: state.leads - 1,
        deals: state.deals + 1,
        revenue: state.revenue + 1200,
      };

    case "AI_LOG":
      return {
        ...state,
        aiMessages: [event.payload, ...state.aiMessages].slice(0, 6),
      };

    default:
      return state;
  }
}

/**
 * GLOBAL STORE
 */
let globalState = initialState;
let listeners: any[] = [];

function emit() {
  listeners.forEach((l) => l(globalState));
}

export function dispatch(event: any) {
  globalState = reducer(globalState, event);
  emit();
}

/**
 * AUTONOMOUS AGENTS
 */
function runAgents() {
  // SALES AGENT (convert leads randomly)
  if (Math.random() > 0.6) {
    dispatch({ type: "CONVERT_LEAD" });
  }

  // MARKETING AGENT (generate leads)
  if (Math.random() > 0.5) {
    dispatch({ type: "ADD_LEAD" });
  }

  // AI BRAIN (commentary)
  if (Math.random() > 0.7) {
    const messages = [
      "AI: Lead velocity increasing",
      "AI: Pipeline healthy",
      "AI: Recommend scaling ads",
      "AI: Conversion rate improving",
    ];

    const msg = messages[Math.floor(Math.random() * messages.length)];

    dispatch({ type: "AI_LOG", payload: msg });
  }
}

/**
 * HOOK
 */
export function useSimulationEngine() {
  const [state, setState] = useState(globalState);

  useEffect(() => {
    const listener = (s: any) => setState({ ...s });
    listeners.push(listener);

    // AUTONOMOUS LOOP (SAFE)
    const interval = setInterval(() => {
      runAgents();
    }, 2000); // every 2 seconds

    return () => {
      listeners = listeners.filter((l) => l !== listener);
      clearInterval(interval);
    };
  }, []);

  return state;
}
