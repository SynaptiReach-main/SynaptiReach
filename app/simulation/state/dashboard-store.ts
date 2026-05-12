export {};
import { useSyncExternalStore } from "react";

type State = {
  leads: any[];
  aiInsights: any[];
  automationEvents: any[];
  campaigns: any[];
};

let state: State = {
  leads: [],
  aiInsights: [],
  automationEvents: [],
  campaigns: [],
};

let listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

export function setState(updater: (prev: State) => State) {
  state = updater(state);
  emit();
}

export function getState() {
  return state;
}

export function useDashboardStore() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getState,
    getState
  );
}
