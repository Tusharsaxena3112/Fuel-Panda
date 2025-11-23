import mongoose, { Schema, Document } from "mongoose";

export interface IDriver extends Document {
  name: string;
  phone: string;
  licenseNumber: string;
  isActive: boolean;
}

const DriverSchema: Schema = new Schema<IDriver>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IDriver>("Driver", DriverSchema);
