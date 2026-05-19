export function detectIntent(text: string) {
  const value = text.toLowerCase();
  if (value.includes("book") || value.includes("schedule") || value.includes("appointment")) {
    return "appointment_intent";
  }
  if (value.includes("price") || value.includes("quote") || value.includes("proposal")) {
    return "purchase_intent";
  }
  if (value.includes("unsubscribe") || value.includes("stop")) {
    return "opt_out_intent";
  }
  return "general_follow_up";
}
