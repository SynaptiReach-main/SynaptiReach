"use client";

import { useEffect } from "react";

type QueryRecordFocusProps = {
  keys: string[];
  hashIds?: string[];
};

function cssEscape(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/["\\]/g, "\\$&");
}

export default function QueryRecordFocus({ keys, hashIds = [] }: QueryRecordFocusProps) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetValue = keys.map((key) => params.get(key)).find(Boolean);
    const hash = window.location.hash.replace("#", "");
    const escaped = targetValue ? cssEscape(targetValue) : "";
    const target =
      targetValue
        ? document.querySelector(
            `[data-record-id="${escaped}"], [data-conversation-id="${escaped}"], [data-lead-id="${escaped}"], [data-deal-id="${escaped}"], [data-campaign-id="${escaped}"]`
          )
        : hashIds.includes(hash)
          ? document.getElementById(hash)
          : null;

    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("ring-2", "ring-cyan-300/70", "shadow-2xl", "shadow-cyan-500/20");
    const timeout = window.setTimeout(() => {
      target.classList.remove("ring-2", "ring-cyan-300/70", "shadow-2xl", "shadow-cyan-500/20");
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [hashIds, keys]);

  return null;
}
