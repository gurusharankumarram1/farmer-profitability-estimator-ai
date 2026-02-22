import mongoose, { Schema, Document, Types } from "mongoose";
import { Status, STATUS_VALUES } from "@/constants/status.enum";

export interface IPriceDataDocument extends Document {
  _id: Types.ObjectId;
  crop: Types.ObjectId;
  msp: number;
  avgMarketPrice: number;
  status: Status;
  created_at: Date;
  updated_at: Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
}

const PriceDataSchema = new Schema<IPriceDataDocument>(
  {
    crop: { type: Schema.Types.ObjectId, ref: "Crop", required: true },
    msp: { type: Number, required: true },
    avgMarketPrice: { type: Number, required: true },
    status: { type: String, enum: STATUS_VALUES, default: Status.Active },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

PriceDataSchema.index({ crop: 1, status: 1 });

const PriceData =
  mongoose.models.PriceData ||
  mongoose.model<IPriceDataDocument>("PriceData", PriceDataSchema);
export default PriceData;
