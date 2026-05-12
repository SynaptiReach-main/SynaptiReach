"use client";
import { useEffect, useState } from "react";

let globalState: any = {
  leads: 12,
  deals: 3,
  revenue: 12000,
  industry: "agency",
  aiMessages: [],
};

let listeners: any[] = [];

export function dispatch(action: any) {
  switch (action.type) {

    case "ADD_LEAD":
      globalState.leads += 1;
      break;

    case "CLOSE_DEAL":
      globalState.deals += 1;
      globalState.revenue += 1200;
      break;

    case "AI_MESSAGE":
      globalState.aiMessages.unshift(action.payload);
      break;

    case "SET_INDUSTRY":
      globalState.industry = action.payload;
      globalState.aiMessages.unshift("Switched to " + action.payload + " model");
      break;
  }

  listeners.forEach((l) => l({ ...globalState }));
}

export function useSimulationEngine() {
  const [state, setState] = useState(globalState);

  useEffect(() => {
    listeners.push(setState);

    const interval = setInterval(() => {
      runAgents();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return state;
}

function runAgents() {
  // Marketing AI
  if (Math.random() > 0.5) {
    globalState.leads += 1;
    globalState.aiMessages.unshift("Marketing AI generated a lead");
  }

  // Sales AI
  if (globalState.leads > 5 && Math.random() > 0.6) {
    globalState.deals += 1;
    globalState.aiMessages.unshift("Sales AI closed a deal");
  }

  // CEO AI
  if (Math.random() > 0.7) {
    globalState.aiMessages.unshift("CEO: Shift budget to high-performing channel");
  }

  listeners.forEach((l) => l({ ...globalState }));
}
