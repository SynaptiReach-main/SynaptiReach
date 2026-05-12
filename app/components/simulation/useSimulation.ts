export {};
"use client";
import { useEffect, useState } from "react";

const stages = ["Lead", "Contacted", "Qualified", "Closed"];

export default function useSimulation() {
  const [mounted, setMounted] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [activity, setActivity] = useState<string[]>([]);

  // ONLY run AFTER mount (prevents hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      const rand = Math.random();

      if (rand < 0.4) {
        const newLead = {
          id: Date.now(),
          name: "Lead " + Math.floor(Math.random() * 100),
          stage: "Lead",
        };
        setLeads((l) => [...l, newLead]);
        setActivity((a) => ["New lead captured", ...a.slice(0, 5)]);
      } else {
        setLeads((l) =>
          l.map((lead) => {
            if (Math.random() < 0.3) {
              const next =
                stages[Math.min(stages.indexOf(lead.stage) + 1, 3)];
              return { ...lead, stage: next };
            }
            return lead;
          })
        );
        setActivity((a) => ["AI moved lead", ...a.slice(0, 5)]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [mounted]);

  return { leads, activity, mounted };
}
