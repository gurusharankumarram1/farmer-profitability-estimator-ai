/**
 * Cost Helper — Pure computation, no DB access.
 *
 * Sums all cost inputs to compute total cost.
 */

import { CostInput } from "@/types/estimate.types";

/**
 * totalCost = sum of all cost line items
 */
export function calculateTotalCost(costs: CostInput): number {
  return (
    costs.seeds +
    costs.fertilizer +
    costs.pesticides +
    costs.labor +
    costs.irrigation +
    costs.equipment +
    costs.transport +
    costs.miscellaneous
  );
}

/**
 * netProfit = revenue - totalCost
 */
export function calculateNetProfit(revenue: number, totalCost: number): number {
  return Math.round((revenue - totalCost) * 100) / 100;
}
