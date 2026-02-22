/**
 * Risk Helper — Pure computation, no DB access.
 *
 * Computes a composite risk score on a 0–100 scale.
 * Higher score = higher risk.
 */

import { RiskBreakdown } from "@/types/estimate.types";

export interface RiskInput {
  irrigationType: string;
  irrigationReliabilityScore: number;   // 0–100 (higher = more reliable)
  yieldVariance: number;                // e.g. 0.0 – 1.0
  msp: number;
  avgMarketPrice: number;
}

const WEIGHTS = {
  weather: 0.30,
  priceVolatility: 0.25,
  irrigationReliability: 0.25,
  yieldVariance: 0.20,
};

/**
 * Weather risk: rainfed = 85, canal = 40, drip/sprinkler = 20, borewell = 35
 */
function computeWeatherRisk(irrigationType: string): number {
  const riskMap: Record<string, number> = {
    rainfed: 85,
    canal: 40,
    borewell: 35,
    sprinkler: 20,
    drip: 15,
  };
  return riskMap[irrigationType.toLowerCase()] ?? 50;
}

/**
 * Price volatility risk: abs(msp - market) / max(msp, market) × 100
 */
function computePriceVolatilityRisk(msp: number, avgMarketPrice: number): number {
  if (msp === 0 && avgMarketPrice === 0) return 0;
  const diff = Math.abs(msp - avgMarketPrice);
  const maxPrice = Math.max(msp, avgMarketPrice);
  return Math.min(Math.round((diff / maxPrice) * 100), 100);
}

/**
 * Irrigation reliability risk: 100 - reliabilityScore
 */
function computeIrrigationReliabilityRisk(reliabilityScore: number): number {
  return Math.max(0, Math.min(100, 100 - reliabilityScore));
}

/**
 * Yield variance risk: variance normalized to 0–100
 */
function computeYieldVarianceRisk(yieldVariance: number): number {
  // yieldVariance typically 0–1; multiply by 100
  return Math.min(Math.round(yieldVariance * 100), 100);
}

export interface RiskResult {
  riskScore: number;
  riskBreakdown: RiskBreakdown;
}

export function calculateRiskScore(input: RiskInput): RiskResult {
  const weatherRisk = computeWeatherRisk(input.irrigationType);
  const priceVolatilityRisk = computePriceVolatilityRisk(input.msp, input.avgMarketPrice);
  const irrigationReliabilityRisk = computeIrrigationReliabilityRisk(input.irrigationReliabilityScore);
  const yieldVarianceRisk = computeYieldVarianceRisk(input.yieldVariance);

  const riskScore = Math.round(
    weatherRisk * WEIGHTS.weather +
    priceVolatilityRisk * WEIGHTS.priceVolatility +
    irrigationReliabilityRisk * WEIGHTS.irrigationReliability +
    yieldVarianceRisk * WEIGHTS.yieldVariance
  );

  return {
    riskScore: Math.min(riskScore, 100),
    riskBreakdown: {
      weatherRisk,
      priceVolatilityRisk,
      irrigationReliabilityRisk,
      yieldVarianceRisk,
    },
  };
}
