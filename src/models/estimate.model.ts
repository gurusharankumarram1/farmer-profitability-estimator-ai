import mongoose, { Schema, Document, Types } from "mongoose";
import { Status, STATUS_VALUES } from "@/constants/status.enum";
import { CostInput, RiskBreakdown } from "@/types/estimate.types";

export interface IEstimateDocument extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  crop: Types.ObjectId;
  region: Types.ObjectId;
  landSizeAcres: number;
  irrigationType: string;
  costs: CostInput;
  expectedYield: number;
  selectedPrice: number;
  revenue: number;
  totalCost: number;
  netProfit: number;
  riskScore: number;
  riskBreakdown: RiskBreakdown;
  status: Status;
  created_at: Date;
  updated_at: Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
}

const EstimateSchema = new Schema<IEstimateDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    crop: { type: Schema.Types.ObjectId, ref: "Crop", required: true },
    region: { type: Schema.Types.ObjectId, ref: "Region", required: true },
    landSizeAcres: { type: Number, required: true },
    irrigationType: { type: String, required: true },
    costs: {
      seeds: { type: Number, default: 0 },
      fertilizer: { type: Number, default: 0 },
      pesticides: { type: Number, default: 0 },
      labor: { type: Number, default: 0 },
      irrigation: { type: Number, default: 0 },
      equipment: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
    },
    expectedYield: { type: Number, required: true },
    selectedPrice: { type: Number, required: true },
    revenue: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    netProfit: { type: Number, required: true },
    riskScore: { type: Number, required: true },
    riskBreakdown: {
      weatherRisk: { type: Number, default: 0 },
      priceVolatilityRisk: { type: Number, default: 0 },
      irrigationReliabilityRisk: { type: Number, default: 0 },
      yieldVarianceRisk: { type: Number, default: 0 },
    },
    status: { type: String, enum: STATUS_VALUES, default: Status.Active },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

EstimateSchema.index({ user: 1, status: 1 });

const Estimate =
  mongoose.models.Estimate ||
  mongoose.model<IEstimateDocument>("Estimate", EstimateSchema);
export default Estimate;
