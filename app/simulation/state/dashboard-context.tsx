export {};
"use client";

import React, { createContext, useContext, useReducer } from "react";
import { dashboardReducer, initialState } from "./dashboard-reducer";

const DashboardContext = createContext<any>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("DashboardProvider missing");
  return ctx;
}
