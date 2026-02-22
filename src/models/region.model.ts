import mongoose, { Schema, Document, Types } from "mongoose";
import { Status, STATUS_VALUES } from "@/constants/status.enum";

export interface IRegionDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  state: string;
  district: string;
  climate: string;
  status: Status;
  created_at: Date;
  updated_at: Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
}

const RegionSchema = new Schema<IRegionDocument>(
  {
    name: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    climate: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUS_VALUES, default: Status.Active },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Region = mongoose.models.Region || mongoose.model<IRegionDocument>("Region", RegionSchema);
export default Region;
