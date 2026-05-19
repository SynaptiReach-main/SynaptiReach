export function scoreLead(lead: any, communications: any[] = [], activity: any[] = []) {
  let score = Number(lead?.score || 0);
  if (lead?.status === "qualified") score += 25;
  if (lead?.status === "converted") score += 40;
  if (lead?.status === "contacted") score += 10;
  if (lead?.email) score += 8;
  if (lead?.phone) score += 8;
  if (lead?.company) score += 6;

  const leadComms = communications.filter((item) => item.lead_id === lead?.id);
  score += Math.min(leadComms.length * 5, 20);

  const leadEvents = activity.filter((event) =>
    JSON.stringify(event.metadata || {}).includes(lead?.email || "__none__")
  );
  score += Math.min(leadEvents.length * 5, 20);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function leadTemperature(score: number) {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}
