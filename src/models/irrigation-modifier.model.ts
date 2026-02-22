import mongoose, { Schema, Document, Types } from "mongoose";
import { Status, STATUS_VALUES } from "@/constants/status.enum";

export interface IIrrigationModifierDocument extends Document {
  _id: Types.ObjectId;
  irrigationType: string;
  yieldMultiplier: number;
  reliabilityScore: number;
  status: Status;
  created_at: Date;
  updated_at: Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
}

const IrrigationModifierSchema = new Schema<IIrrigationModifierDocument>(
  {
    irrigationType: { type: String, required: true, unique: true, trim: true },
    yieldMultiplier: { type: Number, required: true, default: 1.0 },
    reliabilityScore: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: STATUS_VALUES, default: Status.Active },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

IrrigationModifierSchema.index({ irrigationType: 1, status: 1 });

const IrrigationModifier =
  mongoose.models.IrrigationModifier ||
  mongoose.model<IIrrigationModifierDocument>("IrrigationModifier", IrrigationModifierSchema);
export default IrrigationModifier;
