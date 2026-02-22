import { connectDB } from "@/utils/db";
import { Status } from "@/constants/status.enum";
import Crop from "@/models/crop.model";
import Region from "@/models/region.model";
import IrrigationModifier from "@/models/irrigation-modifier.model";
import YieldProfile from "@/models/yield-profile.model";
import { successResponse } from "@/utils/response";
import { handleError } from "@/middleware/error.middleware";

// Lean document shapes
interface LeanCrop { _id: unknown; name: string; category: string }
interface LeanRegion { _id: unknown; name: string; state: string; district: string }
interface LeanIrrigation { _id: unknown; irrigationType: string; yieldMultiplier: number }

/**
 * GET /api/reference-data
 *
 * Returns all active crops, regions, and irrigation types.
 * Used by the frontend to dynamically populate form dropdowns.
 */
export async function GET() {
  try {
    await connectDB();

    const [crops, regions, irrigationTypes, yieldProfiles] = await Promise.all([
      Crop.find({ status: Status.Active }).select("_id name category").sort({ name: 1 }).lean<LeanCrop[]>(),
      Region.find({ status: Status.Active }).select("_id name state district").sort({ name: 1 }).lean<LeanRegion[]>(),
      IrrigationModifier.find({ status: Status.Active }).select("_id irrigationType yieldMultiplier").sort({ irrigationType: 1 }).lean<LeanIrrigation[]>(),
      YieldProfile.find({ status: Status.Active }).select("crop region").lean(),
    ]);

    const cropRegionMap: Record<string, string[]> = {};
    yieldProfiles.forEach((yp) => {
      const cId = String(yp.crop);
      const rId = String(yp.region);
      if (!cropRegionMap[cId]) cropRegionMap[cId] = [];
      cropRegionMap[cId].push(rId);
    });

    return successResponse({
      crops: crops.map((c) => ({ id: String(c._id), name: c.name, category: c.category })),
      regions: regions.map((r) => ({ id: String(r._id), name: r.name, state: r.state, district: r.district })),
      irrigationTypes: irrigationTypes.map((i) => ({ id: String(i._id), type: i.irrigationType, multiplier: i.yieldMultiplier })),
      cropRegionMap,
    }, "Reference data loaded.");
  } catch (error) {
    return handleError(error);
  }
}
