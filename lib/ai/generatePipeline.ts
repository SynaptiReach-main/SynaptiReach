export {};
export function generatePipeline(industry: string) {
  const base = ["Lead Captured", "Qualification", "Proposal", "Negotiation", "Won", "Retention"];

  const maps: Record<string, string[]> = {
    Dental: ["Inquiry", "Verification", "Consult", "Treatment Plan", "Scheduled", "Follow-Up"],
    HVAC: ["Lead", "Inspection", "Quote", "Financing", "Booked", "Upsell"],
    "Real Estate": ["Inquiry", "Qualification", "Match", "Showing", "Offer", "Closed"],
    Roofing: ["Lead", "Inspection", "Insurance", "Estimate", "Contract", "Completion"],
    Restaurant: ["Reservation", "Engagement", "Campaign", "Loyalty", "Repeat"]
  };

  return maps[industry] || base;
}
