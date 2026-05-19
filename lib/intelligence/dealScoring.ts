export function scoreDeal(deal: any) {
  const value = Number(deal?.value || 0);
  const probability = Number(deal?.probability || deal?.probability_percent || 0);
  const updatedAt = deal?.updated_at || deal?.created_at;
  const ageDays = updatedAt
    ? (Date.now() - new Date(updatedAt).getTime()) / 86400000
    : 0;
  const stalePenalty = ageDays >= 21 ? 25 : ageDays >= 14 ? 15 : 0;
  const valueBoost = value >= 10000 ? 20 : value >= 5000 ? 10 : 0;
  return Math.max(0, Math.min(100, Math.round(probability + valueBoost - stalePenalty)));
}

export function weightedDealValue(deal: any) {
  const value = Number(deal?.value || 0);
  const probability = Number(deal?.probability || deal?.probability_percent || 0);
  return Math.round(value * (probability / 100));
}
