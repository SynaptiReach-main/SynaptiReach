export function runAIEngine(state: any) {
  const next = { ...state };

  // simulate growth logic
  if (Math.random() > 0.6) {
    next.leads += Math.floor(Math.random() * 3);
  }

  if (Math.random() > 0.7 && next.leads > 0) {
    next.deals += 1;
    next.leads -= 1;
  }

  return next;
}
