import mongoose, { Schema, Document, Types } from "mongoose";
import { Status, STATUS_VALUES } from "@/constants/status.enum";

export interface ICropDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  unit: string;
  status: Status;
  created_at: Date;
  updated_at: Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
}

const CropSchema = new Schema<ICropDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    unit: { type: String, required: true, default: "quintal" },
    status: { type: String, enum: STATUS_VALUES, default: Status.Active },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Crop = mongoose.models.Crop || mongoose.model<ICropDocument>("Crop", CropSchema);
export default Crop;
