export function confidenceFromSignals(signals: Array<boolean | number | undefined>, base = 0.55) {
  const strength = signals.reduce((sum, signal) => {
    if (signal === true) return sum + 0.08;
    if (typeof signal === "number") return sum + Math.min(0.12, Math.max(0, signal));
    return sum;
  }, base);

  return Number(Math.max(0.35, Math.min(0.94, strength)).toFixed(2));
}

export function confidenceLabel(confidence: number) {
  if (confidence >= 0.85) return "high";
  if (confidence >= 0.7) return "medium";
  return "watch";
}
