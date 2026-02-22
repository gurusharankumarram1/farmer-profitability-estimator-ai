/**
 * Yield Helper — Pure computation, no DB access.
 *
 * Calculates expected yield based on base yield, land size, and irrigation multiplier.
 */

export interface YieldInput {
  baseYieldPerAcre: number;
  landSizeAcres: number;
  irrigationMultiplier: number;
}

/**
 * expectedYield = baseYieldPerAcre × landSizeAcres × irrigationMultiplier
 */
export function calculateExpectedYield(input: YieldInput): number {
  const { baseYieldPerAcre, landSizeAcres, irrigationMultiplier } = input;
  return Math.round(baseYieldPerAcre * landSizeAcres * irrigationMultiplier * 100) / 100;
}
