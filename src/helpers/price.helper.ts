export interface PriceInput {
  msp: number;
  avgMarketPrice: number;
}

export function selectBestPrice(input: PriceInput): number {
  return Math.max(input.msp, input.avgMarketPrice);
}

export function calculateRevenue(expectedYield: number, selectedPrice: number): number {
  return Math.round(expectedYield * selectedPrice * 100) / 100;
}
