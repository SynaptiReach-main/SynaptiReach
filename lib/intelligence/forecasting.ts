import { weightedDealValue } from "./dealScoring";

export function forecastPipelineValue(deals: any[] = []) {
  return deals.reduce((sum, deal) => sum + weightedDealValue(deal), 0);
}
