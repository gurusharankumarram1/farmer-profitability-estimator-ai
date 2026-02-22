import { NextRequest } from "next/server";
import { EstimateService } from "@/services/estimate.service";
import { authenticateUser } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validation.middleware";
import { handleError } from "@/middleware/error.middleware";
import { estimateSchema } from "@/validations/schemas";
import { successResponse } from "@/utils/response";
import { EstimateInput, CostInput } from "@/types/estimate.types";

export class EstimateController {
  /**
   * POST /api/estimate
   * Auth required → validates input → delegates to EstimateService → returns result
   */
  static async create(req: NextRequest) {
    try {
      // Authenticate
      const authResult = await authenticateUser(req);
      if ("error" in authResult) return authResult.error;
      const { user } = authResult;

      // Parse & validate body
      const body = await req.json();
      const validation = validateBody(estimateSchema, body);
      if ("error" in validation) return validation.error;

      // Map to service input — guaranteed non-undefined by Zod defaults
      const costs: CostInput = {
        seeds: validation.data.costs.seeds ?? 0,
        fertilizer: validation.data.costs.fertilizer ?? 0,
        pesticides: validation.data.costs.pesticides ?? 0,
        labor: validation.data.costs.labor ?? 0,
        irrigation: validation.data.costs.irrigation ?? 0,
        equipment: validation.data.costs.equipment ?? 0,
        transport: validation.data.costs.transport ?? 0,
        miscellaneous: validation.data.costs.miscellaneous ?? 0,
      };

      const input: EstimateInput = {
        cropId: validation.data.cropId,
        regionId: validation.data.regionId,
        landSizeAcres: validation.data.landSizeAcres,
        irrigationType: validation.data.irrigationType,
        costs,
      };

      // Delegate to service
      const result = await EstimateService.calculate(user.userId, input);
      return successResponse(result, "Profitability estimate calculated successfully.", 201);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * GET /api/estimate
   * Fetch all past estimates for the logged-in user.
   */
  static async getUserHistory(req: NextRequest) {
    try {
      const authResult = await authenticateUser(req);
      if ("error" in authResult) return authResult.error;
      const { user } = authResult;

      const history = await EstimateService.getUserHistory(user.userId);
      return successResponse(history, "History retrieved successfully.");
    } catch (error) {
      return handleError(error);
    }
  }
}
