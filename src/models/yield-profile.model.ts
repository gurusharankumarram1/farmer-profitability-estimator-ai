import mongoose, { Schema, Document, Types } from "mongoose";
import { Status, STATUS_VALUES } from "@/constants/status.enum";

export interface IYieldProfileDocument extends Document {
  _id: Types.ObjectId;
  crop: Types.ObjectId;
  region: Types.ObjectId;
  baseYieldPerAcre: number;
  yieldVariance: number;
  status: Status;
  created_at: Date;
  updated_at: Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
}

const YieldProfileSchema = new Schema<IYieldProfileDocument>(
  {
    crop: { type: Schema.Types.ObjectId, ref: "Crop", required: true },
    region: { type: Schema.Types.ObjectId, ref: "Region", required: true },
    baseYieldPerAcre: { type: Number, required: true },
    yieldVariance: { type: Number, required: true, default: 0 },
    status: { type: String, enum: STATUS_VALUES, default: Status.Active },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Compound index for crop+region lookup
YieldProfileSchema.index({ crop: 1, region: 1, status: 1 });

const YieldProfile =
  mongoose.models.YieldProfile ||
  mongoose.model<IYieldProfileDocument>("YieldProfile", YieldProfileSchema);
export default YieldProfile;
