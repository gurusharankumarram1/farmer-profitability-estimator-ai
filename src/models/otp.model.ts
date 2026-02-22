import mongoose, { Schema, Document } from "mongoose";

export interface IOtpDocument extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtpDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // Expire document after 10 minutes (600 seconds)
  }
);

const OTP = mongoose.models.OTP || mongoose.model<IOtpDocument>("OTP", OtpSchema);
export default OTP;
