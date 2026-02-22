import { NextRequest } from "next/server";
import { EstimateController } from "@/controllers/estimate.controller";

/**
 * POST /api/estimate
 *
 * Protected endpoint — requires JWT in Authorization header.
 *
 * Body: { cropId, regionId, landSizeAcres, irrigationType, costs }
 * Returns: { expectedYield, selectedPrice, revenue, totalCost, netProfit, riskScore, riskBreakdown }
 */
export async function POST(req: NextRequest) {
  return EstimateController.create(req);
}

/**
 * GET /api/estimate
 *
 * Protected endpoint — requires JWT in Authorization header.
 *
 * Returns: List of past estimates for the logged-in user.
 */
export async function GET(req: NextRequest) {
  return EstimateController.getUserHistory(req);
}
