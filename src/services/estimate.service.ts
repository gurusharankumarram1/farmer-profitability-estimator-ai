import { connectDB } from "@/utils/db";
import { Status } from "@/constants/status.enum";
import { EstimateInput, EstimateResult } from "@/types/estimate.types";

// Models
import YieldProfile from "@/models/yield-profile.model";
import PriceData from "@/models/price-data.model";
import IrrigationModifier from "@/models/irrigation-modifier.model";
import Estimate from "@/models/estimate.model";

import { calculateExpectedYield } from "@/helpers/yield.helper";
import { calculateRiskScore } from "@/helpers/risk.helper";
import { selectBestPrice, calculateRevenue } from "@/helpers/price.helper";
import { calculateTotalCost, calculateNetProfit } from "@/helpers/cost.helper";

export class EstimateService {
  /**
   * Run a full profitability estimation.
   *
   * Flow:
   * 1. Fetch yield profile (crop + region, Active)
   * 2. Fetch irrigation modifier (Active)
   * 3. Calculate expected yield
   * 4. Fetch price data (crop, Active)
   * 5. Select best price (MSP vs Market)
   * 6. Calculate revenue, total cost, net profit
   * 7. Calculate risk score
   * 8. Save estimation record
   * 9. Return result
   */
  static async calculate(userId: string, input: EstimateInput): Promise<EstimateResult> {
    await connectDB();

    const yieldProfile = await YieldProfile.findOne({
      crop: input.cropId,
      region: input.regionId,
      status: Status.Active,
    });
    if (!yieldProfile) {
      throw new Error("No active yield profile found for the selected crop and region.");
    }

    const irrigationModifier = await IrrigationModifier.findOne({
      irrigationType: input.irrigationType,
      status: Status.Active,
    });
    if (!irrigationModifier) {
      throw new Error(`No active irrigation modifier found for type: ${input.irrigationType}`);
    }

    const expectedYield = calculateExpectedYield({
      baseYieldPerAcre: yieldProfile.baseYieldPerAcre,
      landSizeAcres: input.landSizeAcres,
      irrigationMultiplier: irrigationModifier.yieldMultiplier,
    });

    const priceData = await PriceData.findOne({
      crop: input.cropId,
      status: Status.Active,
    });
    if (!priceData) {
      throw new Error("No active price data found for the selected crop.");
    }

    const selectedPrice = selectBestPrice({
      msp: priceData.msp,
      avgMarketPrice: priceData.avgMarketPrice,
    });

    const revenue = calculateRevenue(expectedYield, selectedPrice);
    const totalCost = calculateTotalCost(input.costs);
    const netProfit = calculateNetProfit(revenue, totalCost);

    const { riskScore, riskBreakdown } = calculateRiskScore({
      irrigationType: input.irrigationType,
      irrigationReliabilityScore: irrigationModifier.reliabilityScore,
      yieldVariance: yieldProfile.yieldVariance,
      msp: priceData.msp,
      avgMarketPrice: priceData.avgMarketPrice,
    });

    await Estimate.create({
      user: userId,
      crop: input.cropId,
      region: input.regionId,
      landSizeAcres: input.landSizeAcres,
      irrigationType: input.irrigationType,
      costs: input.costs,
      expectedYield,
      selectedPrice,
      revenue,
      totalCost,
      netProfit,
      riskScore,
      riskBreakdown,
      status: Status.Active,
      created_by: userId,
      updated_by: userId,
    });

    return {
      expectedYield,
      selectedPrice,
      revenue,
      totalCost,
      netProfit,
      riskScore,
      riskBreakdown,
    };
  }

  /**
   * Fetch all estimation records for a given user.
   */
  static async getUserHistory(userId: string) {
    await connectDB();
    
    return Estimate.find({ user: userId, status: Status.Active })
      .populate("crop", "name category")
      .populate("region", "name district state")
      .sort({ created_at: -1 })
      .lean();
  }
}
