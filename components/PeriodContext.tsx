"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Period } from "@/lib/period";

export const PERIODS = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
  { value: "all", label: "All time" },
] as const satisfies readonly { value: Period; label: string }[];

type PeriodContextValue = {
  period: Period;
  setPeriod: (period: Period) => void;
};

const PeriodContext = createContext<PeriodContextValue | null>(null);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period>("12m");

  return (
    <PeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriod() {
  const context = useContext(PeriodContext);
  if (!context) throw new Error("usePeriod must be used within PeriodProvider");
  return context;
}
