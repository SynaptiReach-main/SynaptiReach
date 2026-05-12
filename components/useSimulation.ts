"use client";
import { useEffect, useState } from "react";

export default function useSimulation() {
  const [leads, setLeads] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);

  function log(msg) {
    setActivity((a) => [msg, ...a.slice(0, 6)]);
  }

  function addLead() {
    const lead = {
      id: Date.now(),
      name: ["John", "Sarah", "Mike", "Alex"][Math.floor(Math.random()*4)],
      stage: "New"
    };
    setLeads((l) => [lead, ...l.slice(0, 5)]);
    log("New lead captured");
  }

  function moveLead() {
    setLeads((l) =>
      l.map((lead, i) =>
        i === 0
          ? { ...lead, stage: "Contacted" }
          : lead
      )
    );
    log("Lead moved to Contacted");
  }

  function aiMessage() {
    log("AI sent follow-up message");
  }

  useEffect(() => {
    const loop = setInterval(() => {
      const r = Math.random();

      if (r < 0.4) addLead();
      else if (r < 0.7) moveLead();
      else aiMessage();

    }, 2500 + Math.random()*1500);

    return () => clearInterval(loop);
  }, []);

  return { leads, activity };
}
