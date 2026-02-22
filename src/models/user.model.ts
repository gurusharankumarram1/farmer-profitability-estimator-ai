import mongoose, { Schema, Document, Types } from "mongoose";
import { Status, STATUS_VALUES } from "@/constants/status.enum";

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user";
  status: Status;
  created_at: Date;
  updated_at: Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user"], default: "user" },
    status: { type: String, enum: STATUS_VALUES, default: Status.Active },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User =
  mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);
export default User;
