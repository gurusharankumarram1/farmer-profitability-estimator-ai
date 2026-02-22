export interface CostInput {
  seeds: number;
  fertilizer: number;
  pesticides: number;
  labor: number;
  irrigation: number;
  equipment: number;
  transport: number;
  miscellaneous: number;
}

export interface EstimateInput {
  cropId: string;
  regionId: string;
  landSizeAcres: number;
  irrigationType: string;
  costs: CostInput;
}

export interface RiskBreakdown {
  weatherRisk: number;
  priceVolatilityRisk: number;
  irrigationReliabilityRisk: number;
  yieldVarianceRisk: number;
}

export interface EstimateResult {
  expectedYield: number;
  selectedPrice: number;
  revenue: number;
  totalCost: number;
  netProfit: number;
  riskScore: number;
  riskBreakdown: RiskBreakdown;
}
