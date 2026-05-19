export const MINI_BRAIN_SCORING = {
  staleLeadDays: 7,
  staleDealDays: 14,
  urgentInboundHours: 24,
  overdueTaskUrgencyDays: 3,
  highValueDealCents: 1000000,
  capWarningThreshold: 0.8,
  campaignLowOpenRate: 0.15,
  campaignLowClickRate: 0.02,
  confidence: {
    strong: 0.86,
    good: 0.78,
    watch: 0.68,
    weak: 0.55,
  },
} as const;

export function clampScore(score: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(score)));
}

export function scoreBand(score: number) {
  if (score < 35) return "poor" as const;
  if (score < 55) return "watch" as const;
  if (score < 70) return "fair" as const;
  if (score < 85) return "good" as const;
  return "excellent" as const;
}
